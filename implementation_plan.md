# Kế hoạch Cải tiến Task #75 — PR Requested Changes (Updated & Optimized)

Bản kế hoạch này đánh giá và tối ưu hóa các giải pháp cho 3 điểm yêu cầu sửa đổi (Requested Changes) trong PR: lỗi build TypeScript, định hướng lưu trữ Cloudflare R2, và xử lý file rác khi validation hoặc DB transaction thất bại.

---

## Phân tích & Đề xuất Cải tiến so với Bản kế hoạch cũ

Qua việc rà soát kỹ lưỡng codebase hiện tại, chúng tôi phát hiện một số điểm chưa tối ưu và lỗi logic nghiêm trọng trong bản kế hoạch trước đó:

1. **Lỗi logic dọn dẹp file (Bug tiềm ẩn cực kỳ nghiêm trọng):** Bản kế hoạch cũ thực hiện upload file vật lý _bên trong_ database transaction. Nếu transaction DB bị rollback (ví dụ lỗi DB), file staging của Multer đã bị di chuyển đi mất nên `fs.unlinkSync(req.file.path)` ở controller sẽ không tìm thấy file staging và không xóa được gì. Kết quả là file đã được chuyển vào thư mục `uploads/` chính thức (hoặc Cloudflare R2 sau này) sẽ bị mồ côi (orphaned) vĩnh viễn.
2. **I/O blocking trong transaction DB:** Gọi một thao tác I/O nặng và tốn thời gian như upload/di chuyển file bên trong block transaction DB là một anti-pattern. Nó giữ connection DB lâu hơn cần thiết, dễ dẫn đến nghẽn connection pool và deadlock dưới tải cao.
3. **Lỗi cross-device link (`EXDEV`):** Hàm `fs.renameSync` được đề xuất trong `LocalStorageService.upload` sẽ crash server nếu thư mục staging và thư mục upload đích nằm trên hai phân vùng ổ đĩa hoặc filesystem khác nhau (rất phổ biến khi chạy trong môi trường Docker, AWS, Render).
4. **Sử dụng API đồng bộ:** Sử dụng `fs.renameSync`, `fs.unlinkSync`, `fs.mkdirSync` làm block event loop của Node.js, giảm throughput của server.

**Phương án Cải tiến được áp dụng trong kế hoạch này:**

- **Tách I/O upload ra khỏi DB transaction:** Thực hiện upload lên `StorageService` bên ngoài transaction DB.
- **Tự sinh UUID cho StudyPlan trước:** Sử dụng `crypto.randomUUID()` để sinh `planId` ở tầng ứng dụng, giúp xác định đường dẫn lưu trữ `fileKey` chính xác trước khi lưu vào DB.
- **Cơ chế Cleanup 2 lớp:**
  - Nếu Zod validate fail hoặc upload fail: Xóa file staging tạm.
  - Nếu DB transaction fail sau khi upload thành công: Xóa cả file staging tạm và file đã upload trên `StorageService` bằng hàm `delete(fileKey)`.
- **Sử dụng Async API an sau:** Sử dụng `copyFile` + `unlink` bất đồng bộ thay thế cho `renameSync` để chống lỗi `EXDEV` và tối ưu hóa hiệu năng Event Loop.
- **DX (Developer Experience) improvement:** Thêm `postinstall: prisma generate` vào `package.json` để tự động sinh Prisma client types ngay sau khi chạy `npm install`, giúp IDE không bị báo lỗi TypeScript đỏ.

---

## Chi tiết các File thay đổi và Cập nhật

### 1. Fix Build Script & DX (MUST FIX)

#### [MODIFY] [package.json](file:///home/pn0801/Projects/planning-ai/src/server/package.json)

```json
  "scripts": {
    "dev": "ts-node-dev --respawn src/server.ts",
    "build": "prisma generate && tsc",
    "postinstall": "prisma generate",
    "start": "node dist/server.js",
    ...
  }
```

- **Giải thích:** Thêm `prisma generate && tsc` cho build script. Thêm `postinstall` để đảm bảo client types được sinh tự động ngay sau khi install packages (hữu ích cho cả môi trường local và CI/CD).

#### Migration DB

Do DB ở branch cũ chưa chạy migration `add_file_path`, và thư mục migrations hiện chỉ có migration khởi tạo `init`, chúng ta sẽ tạo trực tiếp một migration mới với trường `file_key`:

```bash
npx prisma migrate dev --name add_file_key_to_analysis_job
```

---

### 2. Định hướng Lưu trữ Cloudflare R2 (Architecture Advisory)

#### [MODIFY] [schema.prisma](file:///home/pn0801/Projects/planning-ai/src/server/prisma/schema.prisma)

```prisma
model AnalysisJob {
  id          String            @id @default(uuid()) @db.Uuid
  planDraftId String?           @map("plan_draft_id") @db.Uuid
  fileKey     String?           @map("file_key")
  status      AnalysisJobStatus @default(pending)
  retryCount  Int               @default(0) @map("retry_count")
  createdAt   DateTime          @default(now()) @map("created_at")
  completedAt DateTime?         @map("completed_at")

  @@index([planDraftId])
  @@index([status])
  @@map("analysis_jobs")
}
```

- **Giải thích:** Đổi trường `filePath` (lưu path tuyệt đối máy local) thành `fileKey` (đường dẫn tương đối độc lập hạ tầng, ví dụ: `plans/<planId>/<timestamp>.pdf`).

#### [NEW] [storage.service.ts](file:///home/pn0801/Projects/planning-ai/src/server/src/services/storage.service.ts)

```typescript
import fs from 'fs';
import path from 'path';

/**
 * Abstract interface for file storage operations.
 * MVP uses LocalStorageService; production will use R2StorageService.
 */
export interface StorageService {
  /** Upload a file and return a storage key (relative, portable). */
  upload(localFilePath: string, destinationKey: string): Promise<string>;
  /** Delete a file by its storage key. */
  delete(fileKey: string): Promise<void>;
}

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');

/**
 * Local filesystem storage for MVP/development.
 * Uses async non-blocking file operations and supports cross-device migrations.
 */
export class LocalStorageService implements StorageService {
  async upload(localFilePath: string, destinationKey: string): Promise<string> {
    const destPath = path.join(UPLOAD_DIR, destinationKey);
    const destDir = path.dirname(destPath);

    // Đảm bảo thư mục cha tồn tại
    await fs.promises.mkdir(destDir, { recursive: true });

    // Copy + Unlink để chống lỗi EXDEV (cross-device link) khi staging nằm ở ổ đĩa/phân vùng khác
    await fs.promises.copyFile(localFilePath, destPath);
    await fs.promises.unlink(localFilePath);

    return destinationKey;
  }

  async delete(fileKey: string): Promise<void> {
    const filePath = path.join(UPLOAD_DIR, fileKey);
    try {
      await fs.promises.unlink(filePath);
    } catch (error: any) {
      // Bỏ qua nếu file không tồn tại
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
}

// Future Sprint 4: Cloudflare R2 Storage Service Stub
// export class R2StorageService implements StorageService {
//   private s3: S3Client;
//   constructor() {
//     this.s3 = new S3Client({
//       region: 'auto',
//       endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
//       credentials: {
//         accessKeyId: process.env.R2_ACCESS_KEY_ID!,
//         secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
//       },
//     });
//   }
//   async upload(localFilePath: string, destinationKey: string): Promise<string> { ... }
//   async delete(fileKey: string): Promise<void> { ... }
// }

/**
 * Factory: returns the appropriate StorageService based on environment.
 */
export function createStorageService(): StorageService {
  // Sprint 4: if (process.env.STORAGE_PROVIDER === 'r2') return new R2StorageService();
  return new LocalStorageService();
}
```

---

### 3. Tối ưu hóa Luồng Upload & Cleanup (Edge Case & DB Performance)

#### [MODIFY] [plan.service.ts](file:///home/pn0801/Projects/planning-ai/src/server/src/services/plan.service.ts)

```typescript
import prisma from '../config/prisma';
import { CreatePlanInput } from '../schemas/plan.schema';
import { CreatePlanResponse } from '../types/plan.types';

/**
 * Atomic DB operation to save StudyPlan and AnalysisJob metadata.
 * File upload logic is moved outside this transaction for optimal DB connection usage.
 */
export async function createPlanInDb(
  userId: string,
  planId: string,
  input: CreatePlanInput,
  fileKey: string
): Promise<CreatePlanResponse> {
  const deadlineDate = new Date(input.deadline);

  const result = await prisma.$transaction(async (tx) => {
    const plan = await tx.studyPlan.create({
      data: {
        id: planId,
        userId,
        name: input.name,
        deadline: deadlineDate,
        status: 'draft',
      },
    });

    await tx.analysisJob.create({
      data: {
        planDraftId: plan.id,
        fileKey,
        status: 'pending',
      },
    });

    return plan;
  });

  return {
    id: result.id,
    name: result.name,
    deadline: result.deadline,
    status: result.status,
  };
}
```

#### [MODIFY] [plan.controller.ts](file:///home/pn0801/Projects/planning-ai/src/server/src/controllers/plan.controller.ts)

```typescript
import { Request, Response } from 'express';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { createPlanInDb } from '../services/plan.service';
import { createPlanSchema } from '../schemas/plan.schema';
import { createStorageService } from '../services/storage.service';
import { AppError } from '../middleware/errorHandler';

const storageService = createStorageService();

/**
 * POST /api/v1/plans
 * Creates a new StudyPlan and triggers background analysis.
 */
export async function createPlanController(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  if (!req.file) {
    throw new AppError('File is required', 400, 'FILE_REQUIRED');
  }

  const localFilePath = req.file.path;
  let uploadedFileKey: string | null = null;

  try {
    // 1. Validate inputs (Zod) trước khi thực hiện bất kỳ upload/lưu trữ nào
    const input = createPlanSchema.parse(req.body);

    // 2. Generate uuid cho StudyPlan trước để dùng làm folder name lưu file
    const planId = crypto.randomUUID();
    const ext = path.extname(req.file.originalname);
    uploadedFileKey = `plans/${planId}/${Date.now()}${ext}`;

    // 3. Thực hiện upload lên Storage Service (ở ngoài DB transaction)
    await storageService.upload(localFilePath, uploadedFileKey);

    // 4. Lưu metadata vào Database
    const plan = await createPlanInDb(req.userId, planId, input, uploadedFileKey);

    res.status(201).json({
      success: true,
      data: {
        plan,
        message: 'Plan created',
      },
    });
  } catch (error) {
    // 5. Cleanup file rác khi có lỗi xảy ra

    // Dọn dẹp file staging nếu nó chưa được di chuyển đi
    if (fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
      } catch (err) {
        console.error('Failed to delete staging file:', err);
      }
    }

    // Dọn dẹp file đã được upload lên Storage nếu DB transaction/save thất bại
    if (uploadedFileKey) {
      try {
        await storageService.delete(uploadedFileKey);
      } catch (err) {
        console.error('Failed to delete uploaded file key from storage:', err);
      }
    }

    throw error;
  }
}
```

#### [MODIFY] [upload.middleware.ts](file:///home/pn0801/Projects/planning-ai/src/server/src/middleware/upload.middleware.ts)

```typescript
// Chỉ đổi thư mục destination của Multer sang `.staging` tạm thời
const STAGING_DIR = path.resolve(process.cwd(), 'uploads', '.staging');

if (!fs.existsSync(STAGING_DIR)) {
  fs.mkdirSync(STAGING_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, STAGING_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
```

---

## Kế hoạch Kiểm thử & Xác minh (Verification Plan)

### Kiểm thử Tự động (Automated Tests)

Chạy build TypeScript và kiểm tra lints để đảm bảo các lỗi TypeScript build đã hoàn toàn được khắc phục:

```bash
# Di chuyển vào server directory
cd src/server

# 1. Sinh Prisma Client types
npx prisma generate

# 2. Chạy Build
npm run build

# 3. TypeScript typecheck
npx tsc --noEmit

# 4. Lint check
npm run lint
```

### Kiểm thử Thủ công (Manual Testing)

1. **Trường hợp Happy Path:**
   - Upload 1 file hợp lệ (ví dụ: PDF) và thông tin deadline tương lai hợp lệ qua endpoint `POST /api/v1/plans`.
   - Kết quả mong muốn:
     - File tạm trong `uploads/.staging` biến mất.
     - File được lưu tại `uploads/plans/<planId>/<timestamp>.pdf`.
     - DB tạo StudyPlan và AnalysisJob thành công, với cột `file_key` lưu giá trị tương ứng dạng `plans/<planId>/<timestamp>.pdf`.
2. **Trường hợp Validation Thất bại (Zod validation):**
   - Upload file và nhập deadline trong quá khứ.
   - Kết quả mong muốn:
     - Trả về mã lỗi `400 Bad Request`.
     - File tạm trong `uploads/.staging` bị xóa lập tức, không sinh ra file rác.
     - Không có bản ghi nào được tạo trong DB.
3. **Trường hợp Database Transaction Thất bại:**
   - Cố tình kích hoạt lỗi DB (ví dụ: tắt DB hoặc tạo mock error tại hàm `createPlanInDb` sau khi file đã upload lên storage).
   - Kết quả mong muốn:
     - File staging tạm bị xóa.
     - File trên storage thực tế tại `uploads/plans/...` cũng bị xóa hoàn toàn qua `storageService.delete()`.
     - Không có dữ liệu rác trong DB và trên đĩa lưu trữ.
