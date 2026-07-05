# Hướng dẫn Thiết lập Môi trường Phát triển Backend (Backend Onboarding)

Tài liệu này hướng dẫn chi tiết các bước cài đặt và cấu hình môi trường phát triển ứng dụng Backend (Node.js + Express + Prisma + PostgreSQL) ở máy tính cá nhân (local).

---

## 1. Cài đặt Runtime (Node.js & NPM)

Dự án Recall AI sử dụng các tính năng JavaScript hiện đại và yêu cầu sự thống nhất về phiên bản Runtime để tránh lỗi tương thích phiên bản.

*   **Phiên bản yêu cầu:** **Node.js v20 LTS** (Iron).
*   **Phương thức cài đặt:**
    *   **Đối với Windows:** Tải bộ cài `.msi` trực tiếp từ [Trang chủ Node.js](https://nodejs.org/).
    *   **Đối với macOS / Linux:** Khuyến nghị cài đặt thông qua **NVM (Node Version Manager)** để dễ dàng chuyển đổi phiên bản:
        ```bash
        # Cài đặt Node.js v20 qua nvm
        nvm install 20
        nvm use 20
        nvm alias default 20
        ```
*   **Kiểm tra cài đặt:** Mở Terminal và chạy các lệnh sau để xác nhận:
    ```bash
    node -v # Phải trả về kết quả dạng v20.x.x
    npm -v  # Trả về phiên bản npm đi kèm
    ```

---

## 2. Thiết lập Cơ sở dữ liệu (PostgreSQL)

Để chạy dự án ở local, bạn cần có một dịch vụ PostgreSQL hoạt động trên cổng mặc định `5432`. Bạn có thể lựa chọn 1 trong 2 phương án dưới đây.

### Phương án 1 (Khuyến nghị): Sử dụng Docker Compose
Sử dụng Docker giúp khởi chạy nhanh chóng một instance database độc lập, sạch sẽ và không gây xung đột dịch vụ chạy ngầm của hệ điều hành.

1.  **Yêu cầu:** Đã cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/macOS) hoặc Docker Engine (Linux).
2.  **Khởi chạy:** Tạo hoặc sử dụng file `docker-compose.yml` ở thư mục gốc của dự án với nội dung:
    ```yaml
    version: '3.8'
    services:
      db:
        image: postgres:16-alpine
        container_name: recall_ai_db
        restart: always
        environment:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgrespassword
          POSTGRES_DB: recall_ai
        ports:
          - "5432:5432"
        volumes:
          - pgdata:/var/lib/postgresql/data

    volumes:
      pgdata:
    ```
3.  Chạy lệnh sau tại thư mục gốc để khởi động container ở chế độ chạy ngầm:
    ```bash
    docker compose up -d
    ```

### Phương án 2 (Dự phòng): Cài đặt trực tiếp (Native PostgreSQL)
Nếu máy tính của bạn không sử dụng Docker:

1.  Tải bộ cài đặt phù hợp từ [PostgreSQL Downloads](https://www.postgresql.org/download/). Chọn phiên bản **PostgreSQL 15** hoặc **16**.
2.  Trong quá trình cài đặt, ghi nhớ các thông tin sau:
    *   **Port:** `5432` (Mặc định).
    *   **Password:** Đặt mật khẩu cho tài khoản quản trị hệ thống `postgres` (ví dụ: `postgrespassword`).
3.  Sử dụng công cụ **pgAdmin** đi kèm hoặc mở CLI để tạo một database mới có tên là `recall_ai`.

---

## 3. Cấu hình biến môi trường (`.env`)

Mọi cấu hình kết nối nhạy cảm tuyệt đối không được commit lên GitHub. Bạn cần thiết lập file `.env` cá nhân.

1.  Tại thư mục gốc của dự án, sao chép file cấu hình mẫu:
    ```bash
    cp .env.example .env
    ```
2.  Mở file `.env` vừa tạo và cập nhật các thông số phù hợp:

```env
# Cổng chạy backend server ở local
PORT=3000

# Chuỗi kết nối Database PostgreSQL (Database URL)
# Định dạng: postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE_NAME]?schema=public
# - Đối với Docker Compose đề xuất ở trên:
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/recall_ai?schema=public"

# - Đối với PostgreSQL Native (thay thế mật khẩu thật của bạn):
# DATABASE_URL="postgresql://postgres:mat_khau_cua_ban@localhost:5432/recall_ai?schema=public"

# Khóa bí mật ký JWT Token (Yêu cầu độ dài >= 32 ký tự)
# Lệnh tự sinh chuỗi an toàn: openssl rand -base64 32
JWT_SECRET="your_jwt_secret_minimum_32_characters"
JWT_EXPIRES_IN="7d"

# API Key cho Google Gemini AI (dùng cho planner và chấm bài vấn đáp)
# Lấy miễn phí tại: https://aistudio.google.com/
GEMINI_API_KEY="insert_your_actual_gemini_api_key_here"
```

---

## 4. Cài đặt dependencies & Thiết lập Prisma ORM

Prisma đóng vai trò quản lý schema cơ sở dữ liệu và tự động sinh mã nguồn (Client) phục vụ cho các truy vấn type-safe trong dự án.

1.  **Cài đặt các gói phụ thuộc:**
    ```bash
    npm install
    ```
2.  **Đồng bộ Schema và chạy Migrations:**  
    Lệnh này sẽ quét file `prisma/schema.prisma` và tự động tạo các cấu trúc bảng tương ứng trong cơ sở dữ liệu PostgreSQL local của bạn:
    ```bash
    npx prisma migrate dev --name init
    ```
3.  **Tự động sinh Prisma Client:**
    ```bash
    npx prisma generate
    ```
4.  **Sử dụng Prisma Studio (Tùy chọn debug trực quan):**  
    Nhóm khuyến nghị sử dụng Prisma Studio để xem, chỉnh sửa dữ liệu trực quan bằng giao diện web thay vì cài đặt thêm pgAdmin hay DBeaver:
    ```bash
    npx prisma studio
    ```
    *Giao diện quản lý DB sẽ tự động mở tại địa chỉ:* `http://localhost:5555`

---

## 5. Khởi chạy Ứng dụng ở Local

Sau khi hoàn thành tất cả các bước cấu hình trên, bạn tiến hành chạy thử server phát triển:

```bash
npm run dev
```

Server backend sẽ khởi chạy và lắng nghe kết nối tại cổng cấu hình trong `.env` (ví dụ: `http://localhost:3000`). Bạn có thể dùng Postman hoặc curl để kiểm tra endpoint đầu tiên của server.

---

## 6. Xử lý sự cố thường gặp (Troubleshooting)

*   **Lỗi: `Port 5432 is already in use`**
    *   *Nguyên nhân:* Có một dịch vụ PostgreSQL native khác đang chạy ngầm trên máy của bạn chiếm cổng 5432, khiến Docker container không thể binding cổng.
    *   *Cách xử lý:* Tắt dịch vụ Postgres native đang chạy ngầm (trên Windows: Mở Services ➔ Tìm `postgresql` ➔ Chọn `Stop`; trên macOS: Chạy `brew services stop postgresql`). Hoặc sửa cổng binding trong file `docker-compose.yml` từ `"5432:5432"` thành `"5433:5432"` (và nhớ sửa lại `DATABASE_URL` trong `.env` sử dụng cổng `5433`).
*   **Lỗi: `Prisma schema has not been found`**
    *   *Cách xử lý:* Đảm bảo bạn đang đứng ở thư mục gốc của dự án có chứa thư mục `prisma` chứa file `schema.prisma`.

