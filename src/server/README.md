# Recall AI - Backend Developer Guide

Tài liệu này hướng dẫn cách thiết lập môi trường phát triển (Development Setup) cho Backend của dự án **Recall AI**.

---

## 1. Yêu cầu hệ thống (Prerequisites)

Đảm bảo máy của bạn đã cài đặt:

- **Node.js** (Phiên bản v18 trở lên)
- **npm** (đi kèm Node.js)
- **Docker** hoặc **PostgreSQL** — chỉ cần khi bạn phải _tạo_ migration mới (xem §5).
  Phát triển hằng ngày không cần Postgres trên máy: team dùng chung một database trên Supabase.

---

## 2. Database: một Supabase dùng chung cho cả team

Trước đây mỗi người chạy một Postgres riêng. Cách đó hỏng theo một kiểu khó chịu: ai nghỉ vài ngày
rồi `git pull` sẽ có code mới trên một DB cũ, và lỗi hiện ra ở tận tầng truy vấn
(`column ... does not exist`) chứ không nói thẳng rằng DB đang thiếu mấy migration.

Từ nay **cả team trỏ vào cùng một database trên Supabase**. Không còn phiên bản schema riêng theo
từng máy, nên loại lỗi trên biến mất theo định nghĩa chứ không phải nhờ ai đó nhớ chạy lệnh.

### 2.1. Lấy chuỗi kết nối

1. Supabase Dashboard → chọn project của team.
2. Bấm **Connect** → tab **ORMs** → **Prisma** (hoặc tab **Connection string**).
3. Chọn **Session pooler**, copy chuỗi, thay `[YOUR-PASSWORD]` bằng **database password**.
   Đó không phải mật khẩu đăng nhập Supabase; quên thì đặt lại ở Settings → Database →
   Reset database password.

```
postgresql://postgres.<project-ref>:<password>@aws-1-<region>.pooler.supabase.com:5432/postgres
```

### 2.2. Vì sao là "Session pooler", không phải hai lựa chọn kia

| Lựa chọn           | Cổng | Dùng được không                                                                                                                                                             |
| ------------------ | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Session pooler** | 5432 | ✅ Chạy được cả app lẫn `prisma migrate`. Đây là thứ điền vào `DATABASE_URL`.                                                                                               |
| Direct connection  | 5432 | ❌ Supabase chỉ cấp IPv6 cho nó. Mạng nhà và runner GitHub Actions phần lớn chưa có IPv6 — kết nối treo rồi `ENETUNREACH`.                                                  |
| Transaction pooler | 6543 | ⚠️ App chạy được, `prisma migrate` thì không: migrate khoá bằng advisory lock, lock đó chết ngay khi pooler trả connection về pool. Muốn dùng, phải khai thêm `DIRECT_URL`. |

### 2.3. Postgres trên máy mình — khi nào còn cần

Đúng một việc: **soạn migration mới** (§5). `prisma migrate dev` phải dựng được _shadow database_
để so schema, mà tài khoản Supabase đi qua pooler không có quyền tạo database. Nên: soạn migration
ở DB local, còn _áp_ migration thì lên Supabase.

Chưa có DB local thì dựng khi nào cần:

```bash
docker run --name recall-postgres \
  -e POSTGRES_PASSWORD=postgrespassword \
  -e POSTGRES_DB=recall_ai_dev \
  -p 5432:5432 \
  -d postgres
```

### 2.4. Migration vẫn do Prisma quản, không phải Supabase

Repo có link với project Supabase, nhưng **không dùng hệ migration của Supabase CLI**
(`supabase/migrations`). Nguồn sự thật duy nhất của schema là `prisma/migrations` + `schema.prisma`.
Hai hệ migration cùng ghi vào một DB là cách chắc chắn nhất để không ai còn biết schema thật đang ở
đâu — nên thư mục `supabase/` cố ý không tồn tại trong repo này.

---

## 3. Thiết lập biến môi trường (Environment Variables)

Copy file cấu hình mẫu và điền thông tin:

```bash
cp .env.example .env
```

Kiểm tra file `.env` đảm bảo các biến sau chính xác:

```env
PORT=3001
NODE_ENV=development
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-1-<region>.pooler.supabase.com:5432/postgres"
JWT_SECRET="tối_thiểu_32_ký_tự_ngẫu_nhiên_ở_đây"
JWT_REFRESH_SECRET="tối_thiểu_32_ký_tự_ngẫu_nhiên_khác_ở_đây"
```

### Biến môi trường cho AI (Gemini)

```env
GEMINI_API_KEY="khoá_thật_của_bạn"
USE_MOCK_AI=false
GEMINI_MODEL_EXTRACT="gemini-flash-latest"
GEMINI_MODEL_INTERVIEW="gemini-flash-latest"
```

- `GEMINI_API_KEY` **chỉ tồn tại ở backend**, tuyệt đối không đưa sang client (bundle Vite là công khai).
- **Luôn dùng alias `-latest`**, không ghim tên model có ngày tháng. Google khai tử model ID cũ rất nhanh — đã xác nhận 25/07/2026: `gemini-2.5-flash` trả HTTP 404 với API key mới.
- `GEMINI_MODEL_EXTRACT` dùng cho `extract_concepts`; `GEMINI_MODEL_INTERVIEW` dùng cho `generate_question` + `grade_answer`.

### Phát triển không tốn quota (`USE_MOCK_AI`)

Đặt `USE_MOCK_AI=true` để toàn bộ lời gọi AI trả dữ liệu mẫu cố định, **không gọi Gemini và không tốn quota**:

```env
USE_MOCK_AI=true
```

- `extract_concepts` trả một DAG mẫu cố định (Variable → Loop → Array → …).
- `grade_answer` chấm theo **độ dài câu trả lời**, không phải chất lượng: dưới 20 ký tự → `wrong`, từ 20 → `shallow`, từ 120 → `deep`. Quy tắc này chỉ nhằm giúp bạn chạm được cả ba nhánh verdict khi phát triển; đừng dùng nó để đánh giá chất lượng chấm điểm thật.
- Khi cần kiểm chứng chất lượng AI thật, phải đặt lại `USE_MOCK_AI=false` và dùng khoá thật.

---

## 4. Khởi chạy dự án

Từ thư mục `src/server`:

```bash
npm install      # 1. Cài thư viện
npm run db:sync  # 2. Áp migration còn thiếu + sinh lại Prisma Client
npm run dev      # 3. Server chạy ở http://localhost:3001
```

`npm run db:sync` chính là `prisma migrate deploy && prisma generate`. Chạy nó **mỗi lần `git pull`
về code có migration mới** — hoặc cứ chạy cho chắc: DB đã khớp thì nó không làm gì.

> ⚠️ **`deploy`, không phải `dev`.** `prisma migrate deploy` chỉ áp những migration đã commit; nó
> không tự sinh migration và không bao giờ reset dữ liệu. Trên một DB dùng chung thì
> `prisma migrate dev` là lệnh nguy hiểm: gặp lệch schema là nó đề nghị **reset**, tức xoá dữ liệu
> của cả team. Đừng gõ nó khi `DATABASE_URL` đang trỏ Supabase.

Vẫn phải chạy `prisma generate` sau khi kéo code đổi schema — `db:sync` đã gộp sẵn. Bỏ bước này thì
DB đúng nhưng `tsc` báo lỗi kiểu cho cột vừa thêm (ví dụ `'languageDetected' does not exist in type ...`).

### Chốt chặn tự động

`npm run dev` chạy `prisma migrate status` trước (npm script `predev`). DB thiếu migration hoặc
không kết nối được thì server **không khởi động**, và Prisma in ra đúng migration nào còn thiếu —
thay vì để bạn gặp một lỗi truy vấn khó hiểu nửa tiếng sau đó.

Bỏ qua chốt này khi cần (mất mạng, chỉ muốn server chạy để xem UI):

```bash
npm run dev:nocheck
```

Kiểm tra thủ công bất cứ lúc nào: `npm run db:status`.

---

## 5. Khi cần đổi schema (tạo migration mới)

Chỉ người sửa `schema.prisma` mới đụng tới mục này. Ba bước, và bước 1 cố tình không chạm Supabase.

**Bước 1 — soạn migration trên DB local.** Trỏ tạm `DATABASE_URL` sang Postgres máy mình, gói gọn
trong đúng một lệnh:

```bash
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/recall_ai_dev" \
  npx prisma migrate dev --name mo_ta_ngan_thay_doi
```

Lệnh này sinh `prisma/migrations/<timestamp>_mo_ta_ngan_thay_doi/migration.sql`. **Mở file đó ra
đọc** trước khi đi tiếp, nhất là khi nó chứa `DROP` hoặc thêm `NOT NULL` vào bảng đã có dữ liệu.

**Bước 2 — commit migration cùng với code dùng nó.** `migration.sql` và `schema.prisma` phải nằm
chung commit với code. Tách ra là tự tạo lại đúng cái lỗi mà cả trò này đang muốn dẹp.

**Bước 3 — áp lên Supabase sau khi PR merge:**

```bash
npm run db:sync
```

Rồi nhắn team một câu: _"có migration mới, mọi người chạy `npm run db:sync`"_. Ai chưa chạy sẽ bị
`predev` chặn lại, chứ không chạy sai âm thầm.

### Ba chỗ dễ vấp

- **Đừng sửa `migration.sql` đã merge.** Prisma ghi checksum; sửa xong thì mọi máy đã áp migration
  đó sẽ báo lệch. Cần sửa thì viết migration mới đè lên.
- **Thay đổi phá vỡ tương thích thì chia hai nhịp.** DB dùng chung nghĩa là schema đổi _ngay lập
  tức_ với cả người đang chạy code cũ. Thêm cột nullable → an toàn. Đổi tên hoặc xoá cột → người
  khác gãy tức thì: thêm cột mới trước, dọn cột cũ ở nhịp sau.
- **`prisma migrate reset` xoá sạch DB.** Trên Supabase nó xoá dữ liệu của cả team, kể cả dữ liệu
  demo. Không có lý do chính đáng nào để gõ nó lúc này.

---

## 6. Kiểm thử & chất lượng code

```bash
npm test        # Jest — unit test cho logic thuần (DAG, chấm điểm, schema AI)
npm run lint    # ESLint
npm run format  # Prettier
```

Bộ test cố tình **không cần DB và không cần API key**: phần logic quyết định của hệ thống (Concept Graph Engine, điều phối phiên vấn đáp) là code thuần định trước theo ràng buộc **C4**, nên phải chứng minh được độc lập với Gemini và Postgres. Lời gọi Gemini được test bằng cách mock `@google/genai`.

---

## 7. Phụ lục — dọn nhà lên Supabase (chỉ một người, chỉ một lần)

Chỉ người đang giữ dữ liệu demo cần làm mục này. Người còn lại đi thẳng vào §3–§4.

### 7.1. Dựng schema trên Supabase

```bash
cd src/server
npm run db:sync
```

Xong bước này, Supabase có đủ 14 migration và bảng `_prisma_migrations` ghi nhận đúng.

### 7.2. Chuyển dữ liệu đang có

```bash
# Xuất DỮ LIỆU (không kèm schema — schema vừa do migration dựng)
pg_dump --data-only --disable-triggers \
  --exclude-table=_prisma_migrations \
  "postgresql://postgres:postgrespassword@localhost:5432/recall_ai_dev" \
  > "$HOME/recall-data.sql"

# Nạp vào Supabase
psql "<DATABASE_URL của Supabase>" -v ON_ERROR_STOP=1 -f "$HOME/recall-data.sql"
```

`--exclude-table=_prisma_migrations` là **bắt buộc**: bảng đó vừa được `db:sync` ghi đúng, đè bản
local lên sẽ làm Prisma hiểu sai DB đang ở phiên bản nào.

Bản dump `--data-only` gần như chỉ gồm lệnh `COPY` nên ít kén phiên bản Postgres. Nếu `pg_dump` từ
chối vì lệch version với server local, dùng `pg_dump` cùng dòng phiên bản với DB đang dump.

Đếm lại cho chắc:

```bash
psql "<DATABASE_URL>" -c "select count(*) from users;" -c "select count(*) from study_plans;"
```

### 7.3. Việc CHƯA giải quyết: file tài liệu không đi theo DB

Tài liệu người dùng tải lên nằm trên đĩa của máy chạy server (`src/server/uploads/` — thời điểm
viết là ~13MB / 31 file trên máy giữ dữ liệu demo), còn `documents.file_key` trong DB chỉ là tên
của object. **Dùng chung DB không làm file đi theo.**

Hệ quả cụ thể: sau khi chuyển, máy khác mở một plan có tài liệu sẽ thấy hàng `documents` tồn tại
nhưng đọc file thất bại — đúng triệu chứng issue #411.

**Đã chốt 20/08: đưa object lên Cloudflare R2** — xem EPIC #413 và 6 sub-issue của nó (#414–#419).
Hướng này khớp với thiết kế sẵn có: `src/services/storage.service.ts` đã là một tầng trừu tượng,
và stub `R2StorageService` nằm sẵn trong đó từ Sprint 4.

Hạn mức miễn phí của R2 (10 GB-month · 1 triệu Class A · 10 triệu Class B, egress miễn phí) thừa xa
mức đang dùng, nhưng Cloudflare **bắt gắn thẻ tín dụng** mới bật được R2. Nếu vướng chỗ đó thì
Supabase Storage đỡ được ngay mà không phải viết lại: cả hai đều nói S3 API, nên #416 cố ý đặt tên
`S3StorageService` và chọn nhà cung cấp bằng biến môi trường.

Cho tới khi #413 xong, hai cách chống cháy: **chép tay thư mục `uploads/`** cho từng người (13MB,
zip qua Drive — phải chép lại mỗi lần có người upload file mới), hoặc **demo trên đúng một máy**.
