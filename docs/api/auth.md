# Đặc tả API Authentication (API Endpoints Spec)

Tất cả các API xác thực đều có tiền tố `/api/v1/auth`.

### 1. Đăng ký tài khoản (Register)

- **Endpoint:** `POST /api/v1/auth/register`
- **Xác thực:** Không yêu cầu
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "Full Name"
  }
  ```
  _(Zod Validation: `email` hợp lệ, `password` >= 8 ký tự, `name` >= 2 ký tự)_
- **Response thành công (HTTP 201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "uuid-string-here",
        "email": "user@example.com",
        "name": "Full Name"
      },
      "accessToken": "jwt-access-token-expires-15m",
      "refreshToken": "jwt-refresh-token-expires-7d"
    }
  }
  ```
- **Lỗi trùng Email (HTTP 409 Conflict):**
  ```json
  {
    "success": false,
    "error": {
      "code": "EMAIL_CONFLICT",
      "message": "Email already exists"
    }
  }
  ```
- **Lỗi Validation (HTTP 400 Bad Request):**
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid input data",
      "details": [ ... thông tin chi tiết lỗi validation ... ]
    }
  }
  ```

---

### 2. Đăng nhập (Login)

- **Endpoint:** `POST /api/v1/auth/login`
- **Xác thực:** Không yêu cầu
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response thành công (HTTP 200 OK):**
  Trả về thông tin user cùng cặp tokens tương tự API Register.
- **Response thất bại (HTTP 401 Unauthorized):**
  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Email or password incorrect"
    }
  }
  ```

---

### 3. Làm mới Token (Session Refresh)

Dùng để lấy `accessToken` mới khi token cũ hết hạn (15 phút) bằng cách gửi `refreshToken`.

- **Endpoint:** `POST /api/v1/auth/refresh`
- **Xác thực:** Không yêu cầu
- **Request Body:**
  ```json
  {
    "refreshToken": "jwt-refresh-token-here"
  }
  ```
- **Response thành công (HTTP 200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "accessToken": "new-jwt-access-token-here"
    }
  }
  ```
- **Response thất bại (HTTP 401 Unauthorized):**
  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Invalid or expired refresh token"
    }
  }
  ```

---

### 4. Lấy thông tin cá nhân hiện tại (Get Me)

- **Endpoint:** `GET /api/v1/auth/me`
- **Xác thực:** Yêu cầu header `Authorization` chứa Bearer Access Token.
- **Request Header:**
  ```http
  Authorization: Bearer <access_token_ở_đây>
  ```
- **Response thành công (HTTP 200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid-string-here",
      "email": "user@example.com",
      "name": "Full Name"
    }
  }
  ```
- **Response thất bại (HTTP 401 Unauthorized - Khi token thiếu, sai hoặc hết hạn):**
  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Token not provided" // hoặc "Invalid or expired token"
    }
  }
  ```
