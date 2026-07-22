# Recall AI - Backend Developer Guide

Tài liệu này hướng dẫn cách thiết lập môi trường phát triển (Development Setup) cho Backend của dự án **Recall AI**.

---

## 1. Yêu cầu hệ thống (Prerequisites)

Đảm bảo máy của bạn đã cài đặt:

- **Node.js** (Phiên bản v18 trở lên)
- **npm** (đi kèm Node.js)
- **Docker** (Khuyên dùng) hoặc **PostgreSQL** (cài đặt trực tiếp)

---

## 2. Thiết lập Database (PostgreSQL)

### Cách A: Sử dụng Docker (Khuyên dùng)

Chạy lệnh sau để khởi tạo PostgreSQL container:

```bash
docker run --name recall-postgres \
  -e POSTGRES_PASSWORD=postgrespassword \
  -e POSTGRES_DB=recall_ai \
  -p 5432:5432 \
  -d postgres
```

### Cách B: Cài đặt trực tiếp (Native)

Nếu cài trực tiếp PostgreSQL trên hệ điều hành, hãy tạo một user với mật khẩu `postgrespassword` và tạo database có tên `recall_ai`.

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
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/recall_ai?schema=public"
JWT_SECRET="tối_thiểu_32_ký_tự_ngẫu_nhiên_ở_đây"
JWT_REFRESH_SECRET="tối_thiểu_32_ký_tự_ngẫu_nhiên_khác_ở_đây"
```

---

## 4. Khởi chạy dự án

Từ thư mục `src/server`, thực hiện các lệnh sau:

### Bước 1: Cài đặt thư viện

```bash
npm install
```

### Bước 2: Đồng bộ Database và Generate Prisma Client

Mỗi khi setup mới hoặc kéo (pull) code có sự thay đổi về Database Schema, bạn cần chạy:

```bash
# Tạo/cập nhật bảng trong DB
npx prisma migrate dev

# Sinh ra các kiểu dữ liệu TypeScript mới nhất cho Prisma Client
npx prisma generate
```

### Bước 3: Chạy server ở chế độ Development

```bash
npm run dev
```

Server sẽ khởi động tại địa chỉ: `http://localhost:3001`
