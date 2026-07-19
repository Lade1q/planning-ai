# Recall AI - Backend Developer Guide

Tài liệu này hướng dẫn cách thiết lập môi trường phát triển (Development Setup) cho Backend của dự án **Recall AI**, hỗ trợ đầy đủ cho các thành viên sử dụng **Windows, macOS, và Linux (Arch, Ubuntu,...)**.

---

## 1. Yêu cầu hệ thống (Prerequisites)
Đảm bảo máy của bạn đã cài đặt:
* **Node.js** (Phiên bản v18 trở lên)
* **npm** (đi kèm Node.js)
* **Docker** (Khuyên dùng để đồng bộ môi trường DB giữa các hệ điều hành) hoặc **PostgreSQL** cài trực tiếp.

---

## 2. Thiết lập Database (PostgreSQL)

Chọn **Một trong hai** cách bên dưới để thiết lập database PostgreSQL:

### Cách A: Sử dụng Docker (Khuyên dùng - Chạy giống nhau trên Windows, Mac, Linux)
Chỉ cần chạy 1 câu lệnh duy nhất để khởi tạo PostgreSQL container đồng bộ cấu hình với dự án:
```bash
docker run --name recall-postgres \
  -e POSTGRES_PASSWORD=postgrespassword \
  -e POSTGRES_DB=recall_ai \
  -p 5432:5432 \
  -d postgres
```

### Cách B: Cài đặt trực tiếp (Native) trên hệ điều hành

####  Cho macOS (Sử dụng Homebrew)
```bash
# 1. Cài đặt postgresql
brew install postgresql@16

# 2. Khởi động service
brew services start postgresql@16

# 3. Đặt mật khẩu và tạo DB
psql postgres -c "ALTER USER postgres WITH PASSWORD 'postgrespassword';"
createdb recall_ai
```

#### ⊞ Cho Windows
1. Tải bộ cài đặt PostgreSQL từ [trang chủ](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).
2. Trong quá trình cài đặt, thiết lập mật khẩu của user `postgres` là `postgrespassword`.
3. Mở công cụ **pgAdmin** hoặc chạy SQL Shell (psql) để tạo database tên `recall_ai`:
   ```sql
   CREATE DATABASE recall_ai;
   ```

#### 🐧 Cho Linux (Arch Linux)
```bash
# 1. Cài đặt
sudo pacman -S postgresql

# 2. Khởi tạo cluster (chạy dưới quyền user postgres)
sudo -i -u postgres initdb --locale=$LANG -E UTF8 -D /var/lib/postgres/data

# 3. Khởi động service
sudo systemctl enable --now postgresql

# 4. Đặt mật khẩu và tạo DB
sudo -i -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgrespassword';"
sudo -i -u postgres createdb recall_ai
```

---

## 3. Thiết lập biến môi trường (Environment Variables)

1. Copy file cấu hình mẫu:
   * **Linux/macOS/Windows Git Bash:** `cp .env.example .env`
   * **Windows CMD:** `copy .env.example .env`
   * **Windows PowerShell:** `Copy-Item .env.example .env`
2. Kiểm tra/chỉnh sửa file `.env` đảm bảo các biến sau chính xác:
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

### Bước 2: Đồng bộ cấu trúc Database (Prisma Migrations)
Lệnh này sẽ tạo các bảng vào database `recall_ai` của bạn:
```bash
npx prisma migrate dev --name init
```

### Bước 3: Chạy server ở chế độ Development
```bash
npm run dev
```
Server sẽ khởi động tại địa chỉ: `http://localhost:3001`

---

## 5. Đặc tả API Authentication (API Endpoints Spec)

Tất cả các API xác thực đều có tiền tố `/api/auth`.

### 1. Đăng ký tài khoản (Register)
* **Endpoint:** `POST /api/auth/register`
* **Xác thực:** Không yêu cầu
* **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "Full Name"
  }
  ```
  *(Zod Validation: `email` hợp lệ, `password` >= 8 ký tự, `name` >= 2 ký tự)*
* **Response thành công (HTTP 201 Created):**
  ```json
  {
    "user": {
      "id": "uuid-string-here",
      "email": "user@example.com",
      "name": "Full Name"
    },
    "accessToken": "jwt-access-token-expires-15m",
    "refreshToken": "jwt-refresh-token-expires-7d"
  }
  ```
* **Lỗi trùng Email (HTTP 409 Conflict):**
  ```json
  {
    "error": "Email already exists"
  }
  ```
* **Lỗi Validation (HTTP 400 Bad Request):**
  ```json
  {
    "error": "Invalid input",
    "details": [ ... thông tin chi tiết lỗi validation ... ]
  }
  ```

---

### 2. Đăng nhập (Login)
* **Endpoint:** `POST /api/auth/login`
* **Xác thực:** Không yêu cầu
* **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
* **Response thành công (HTTP 200 OK):**
  Trả về thông tin user cùng cặp tokens tương tự API Register.
* **Response thất bại (HTTP 401 Unauthorized):**
  ```json
  {
    "error": "Email or password incorrect"
  }
  ```

---

### 3. Làm mới Token (Session Refresh)
Dùng để lấy `accessToken` mới khi token cũ hết hạn (15 phút) bằng cách gửi `refreshToken`.
* **Endpoint:** `POST /api/auth/refresh`
* **Xác thực:** Không yêu cầu
* **Request Body:**
  ```json
  {
    "refreshToken": "jwt-refresh-token-here"
  }
  ```
* **Response thành công (HTTP 200 OK):**
  ```json
  {
    "accessToken": "new-jwt-access-token-here"
  }
  ```
* **Response thất bại (HTTP 401 Unauthorized):**
  ```json
  {
    "error": "Invalid or expired refresh token"
  }
  ```

---

### 4. Lấy thông tin cá nhân hiện tại (Get Me)
* **Endpoint:** `GET /api/auth/me`
* **Xác thực:** Yêu cầu header `Authorization` chứa Bearer Access Token.
* **Request Header:**
  ```http
  Authorization: Bearer <access_token_ở_đây>
  ```
* **Response thành công (HTTP 200 OK):**
  ```json
  {
    "id": "uuid-string-here",
    "email": "user@example.com",
    "name": "Full Name"
  }
  ```
* **Response thất bại (HTTP 401 Unauthorized - Khi token thiếu, sai hoặc hết hạn):**
  ```json
  {
    "error": "Unauthorized"
  }
  ```
  hoặc
  ```json
  {
    "error": "Invalid or expired token"
  }
  ```

---

## 6. Hướng dẫn chạy Script Kiểm Thử (Verification script)

Dự án đã tích hợp sẵn script kiểm thử tự động bằng curl tại `scratch/verify.sh`.

### Trên Linux / macOS / Windows Git Bash:
Đảm bảo server backend đang chạy ở terminal khác, sau đó thực thi:
```bash
./scratch/verify.sh
```

### Trên Windows (CMD hoặc PowerShell):
Khuyến nghị chạy script qua công cụ **Git Bash** (đi kèm khi cài Git trên Windows) để tương thích tốt nhất với định dạng Bash script.
