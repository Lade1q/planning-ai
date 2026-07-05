# BÁO CÁO NGHIÊN CỨU & THIẾT KẾ CÔNG NGHỆ (RESEARCH REPORT)
## XÁC THỰC (JWT + BCRYPTJS) & TÍCH HỢP GEMINI API

## PHẦN I. NGHIÊN CỨU & THIẾT KẾ XÁC THỰC 

Để phục vụ cho yêu cầu xây dựng hệ thống đăng ký, đăng nhập và bảo vệ tài nguyên người dùng cho Recall AI (Single Page Application trên Desktop, thời gian phát triển 10 tuần), nhóm đề xuất thiết kế xác thực chi tiết dưới đây.

### 1. Phân tích chọn lựa công nghệ

#### 1.1. JWT (Stateless) vs. Session-based Cookie (Stateful)
*   **Lựa chọn:** JWT (Stateless).
*   **Lý do:** Dự án Recall AI là Single Page Application (SPA), hướng tới sự tinh gọn. Việc sử dụng JWT giúp Backend hoàn toàn stateless, không cần lưu trữ trạng thái phiên làm việc (như dùng Redis cho Session-based Cookie), giúp giảm đáng kể chi phí vận hành và tài nguyên server trong 10 tuần.
*   **Cơ chế lưu trữ & truyền tải:** Token được lưu tại `localStorage` ở phía client và được gửi tự động qua header `Authorization: Bearer <token>` mỗi khi client gọi API.

#### 1.2. `bcryptjs` vs. `bcrypt`
*   **Lựa chọn:** `bcryptjs` (thư viện băm mật khẩu viết bằng 100% JavaScript thuần).
*   **Lý do:** Thư viện `bcrypt` gốc yêu cầu biên dịch C++ (`node-gyp`), rất dễ gây lỗi cài đặt (build error) trên môi trường Windows hoặc khi deploy lên hosting nếu các thành viên sử dụng hệ điều hành khác nhau. `bcryptjs` cài đặt ổn định trên mọi hệ điều hành mà vẫn đảm bảo hiệu năng băm mật khẩu bảo mật cho đồ án.

---

### 2. Thông số cấu hình & Thiết kế Database

#### 2.1. Tham số cấu hình tối ưu (định nghĩa trong `.env`)
*   `BCRYPT_SALT_ROUNDS = 10`: Đảm bảo độ trễ khoảng 0.1 giây khi băm mật khẩu để chống brute-force nhưng không gây nghẽn CPU khi nhiều người truy cập cùng lúc.
*   `JWT_EXPIRES_IN = "7d"` (7 ngày): Hạn dùng hợp lý cho mục tiêu học tập, giúp sinh viên không phải đăng nhập lại mỗi ngày.
*   `JWT_SECRET`: Chuỗi khóa bí mật dài tối thiểu 32 ký tự, được sinh ngẫu nhiên bằng lệnh `openssl rand -base64 32`.

#### 2.2. Prisma Schema (`schema.prisma`)
```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String   @map("password_hash")
  name         String
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@map("users")
}
```

---

### 3. Hiện thực mã nguồn tham khảo (TypeScript + Express)

#### 3.1. Middleware xác thực JWT (`src/middlewares/auth.middleware.ts`)
```typescript
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Không tìm thấy token hợp lệ" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Token không hợp lệ hoặc đã hết hạn" });
  }
}
```

#### 3.2. Đăng ký & Đăng nhập (`src/controllers/auth.controller.ts`)
```typescript
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải từ 6 ký tự"),
  name: z.string().min(2, "Tên phải từ 2 ký tự"),
});

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được trống"),
});

export async function register(req: Request, res: Response) {
  const { email, password, name } = registerSchema.parse(req.body);

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ success: false, error: "Email đã tồn tại" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: { email, passwordHash, name },
    select: { id: true, email: true, name: true }
  });

  return res.status(201).json({ success: true, data: newUser });
}

export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ success: false, error: "Email hoặc mật khẩu không đúng" });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  return res.status(200).json({
    success: true,
    data: { token, user: { id: user.id, email: user.email, name: user.name } }
  });
}
```

---

## PHẦN II. NGHIÊN CỨU TÍCH HỢP GEMINI API & QUẢN LÝ KEY (TASK-33)

Tính năng **AI Study Planner** trong Recall AI yêu cầu phân tích tài liệu học tập và trả về một sơ đồ đồ thị khái niệm (Concept Graph) có cấu trúc cố định dạng JSON.

### 1. Phân tích chọn lựa giải pháp
*   **Model:** `gemini-2.5-flash`
    *   *Ưu điểm:* Tốc độ phản hồi cực nhanh (độ trễ thấp), hỗ trợ đa phương thức (xử lý trực tiếp ảnh chụp tài liệu của người dùng), chi phí thấp (đủ điều kiện chạy gói Free Tier trong suốt quá trình làm đồ án).
*   **SDK:** `@google/genai` (thư viện mới và đồng nhất chính thức từ Google, thay thế cho gói `@google/generative-ai` cũ).
*   **Structured Outputs:** SDK hỗ trợ truyền `responseSchema` để bắt buộc Gemini trả về đúng định dạng JSON có cấu trúc.

---

### 2. Thiết kế Schema & API Key Management

#### 2.1. Chiến lược quản lý API Key an toàn
*   **Môi trường phát triển:** Lưu trong file `.env` cục bộ. File này phải được cấu hình trong `.gitignore` để không bao giờ bị đẩy lên GitHub.
*   **Môi trường triển khai (Production):** Thiết lập thông qua cấu hình biến môi trường trên giao diện quản trị (Vercel, Render, Railway...).
*   **Cung cấp file mẫu:** `.env.example` đặt ở thư mục gốc của dự án để hướng dẫn các thành viên cấu hình API Key.

#### 2.2. JSON Schema cho Concept Graph
```typescript
import { Type } from "@google/genai";

const conceptGraphSchema = {
  type: Type.OBJECT,
  properties: {
    concepts: {
      type: Type.ARRAY,
      description: "Danh sách khái niệm được trích xuất từ tài liệu ôn tập.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "ID duy nhất viết liền không dấu." },
          name: { type: Type.STRING, description: "Tên khái niệm." },
          description: { type: Type.STRING, description: "Định nghĩa ngắn gọn khái niệm." },
          prerequisites: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Danh sách id của các khái niệm tiên quyết cần phải học trước khái niệm này."
          },
          difficulty: { type: Type.STRING, enum: ["low", "medium", "high"] }
        },
        required: ["id", "name", "description", "prerequisites", "difficulty"]
      }
    }
  },
  required: ["concepts"]
};
```

---

### 3. Kịch bản chạy thử nghiệm Proof of Concept (PoC)

Nhóm có thể tạo một file kiểm thử tạm thời `gemini-poc.mjs` để kiểm tra độ chính xác của phản hồi JSON từ API trước khi tích hợp vào router chính thức:

```javascript
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI(); // Tự động nhận diện process.env.GEMINI_API_KEY

async function runPoC() {
  const sampleDocument = `
  Chương 1: Biến là vùng nhớ để lưu giá trị. Kiểu dữ liệu xác định loại giá trị (int, float, char).
  Chương 2: Con trỏ dùng để lưu địa chỉ vùng nhớ của biến khác. Cần hiểu Biến và Kiểu dữ liệu trước khi học Con trỏ.
  Chương 3: Cấp phát động (malloc) giúp xin cấp vùng nhớ khi chạy chương trình. Cần hiểu Con trỏ và Kiểu dữ liệu để quản lý bộ nhớ động.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Trích xuất khái niệm và quan hệ tiên quyết từ tài liệu:\n${sampleDocument}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: conceptGraphSchema // conceptGraphSchema định nghĩa ở mục 2.2
      }
    });

    console.log("✔ JSON nhận về hợp lệ:", JSON.parse(response.text));
  } catch (error) {
    console.error("Lỗi gọi API:", error);
  }
}
runPoC();
```

---
