# Đặc tả API Study Plans (API Endpoints Spec)

Tất cả các API quản lý Study Plan đều có tiền tố `/api/v1/plans` và yêu cầu xác thực người dùng qua Header `Authorization: Bearer <TOKEN>`.

---

### 1. Tạo Study Plan Mới (Create Study Plan + File Upload)

- **Endpoint:** `POST /api/v1/plans`
- **Xác thực:** ✅ Yêu cầu Bearer Token
- **Content-Type:** `multipart/form-data`
- **Request Fields:**
  - `name` (string, required): Tên kế hoạch học tập (1 - 255 ký tự).
  - `deadline` (string, required): Thời hạn học tập dưới dạng ISO Date (phải là ngày trong tương lai).
  - `file` (file upload, required): File tài liệu học tập đính kèm (hỗ trợ `.pdf`, `.txt`, `.png`, `.jpg`, tối đa 10MB).

- **Response thành công (HTTP 201 Created):**

  ```json
  {
    "success": true,
    "data": {
      "plan": {
        "id": "c1f8a8b1-3e4d-4b5a-9a8b-1c2d3e4f5a6b",
        "name": "Kế hoạch ôn thi Giải tích",
        "deadline": "2026-08-30T00:00:00.000Z",
        "status": "draft"
      },
      "message": "Plan created"
    }
  }
  ```

- **Lỗi thiếu file (HTTP 400 Bad Request):**

  ```json
  {
    "success": false,
    "error": {
      "code": "FILE_REQUIRED",
      "message": "File is required"
    }
  }
  ```

- **Lỗi vượt quá dung lượng 10MB (HTTP 400 Bad Request):**

  ```json
  {
    "success": false,
    "error": {
      "code": "FILE_TOO_LARGE",
      "message": "File size exceeds maximum limit of 10MB"
    }
  }
  ```

- **Lỗi định dạng file không cho phép (HTTP 400 Bad Request):**

  ```json
  {
    "success": false,
    "error": {
      "code": "INVALID_FILE_TYPE",
      "message": "File format not allowed. Accepted: .pdf, .txt, .png, .jpg"
    }
  }
  ```

- **Lỗi Validation Body (HTTP 400 Bad Request):**
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid input data",
      "details": [ ... ]
    }
  }
  ```

---

### 2. Danh sách Study Plans của User (List Study Plans)

- **Endpoint:** `GET /api/v1/plans`
- **Xác thực:** ✅ Yêu cầu Bearer Token

- **Response thành công (HTTP 200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "plans": [
        {
          "id": "c1f8a8b1-3e4d-4b5a-9a8b-1c2d3e4f5a6b",
          "name": "Kế hoạch ôn thi Giải tích",
          "deadline": "2026-08-30T00:00:00.000Z",
          "status": "draft",
          "conceptCount": 0,
          "createdAt": "2026-07-20T21:00:00.000Z"
        }
      ]
    }
  }
  ```

---

### 3. Lấy Chi tiết Study Plan (Get Study Plan Details)

- **Endpoint:** `GET /api/v1/plans/:id`
- **Xác thực:** ✅ Yêu cầu Bearer Token

- **Response thành công (HTTP 200 OK):**

  ```json
  {
    "success": true,
    "data": {
      "id": "c1f8a8b1-3e4d-4b5a-9a8b-1c2d3e4f5a6b",
      "userId": "u1f8a8b1-3e4d-4b5a-9a8b-1c2d3e4f5a6b",
      "name": "Kế hoạch ôn thi Giải tích",
      "deadline": "2026-08-30T00:00:00.000Z",
      "status": "draft",
      "dagAutoFixed": false,
      "tracebackEnabled": true,
      "createdAt": "2026-07-20T21:00:00.000Z",
      "updatedAt": "2026-07-20T21:00:00.000Z",
      "concepts": [],
      "edges": []
    }
  }
  ```

- **Lỗi không tìm thấy Plan (HTTP 404 Not Found):**

  ```json
  {
    "success": false,
    "error": {
      "code": "NOT_FOUND",
      "message": "Study plan not found"
    }
  }
  ```

- **Lỗi truy cập Plan người khác (HTTP 403 Forbidden):**
  ```json
  {
    "success": false,
    "error": {
      "code": "FORBIDDEN",
      "message": "Access denied to this study plan"
    }
  }
  ```
