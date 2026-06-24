# Thư mục Services

Thư mục này chịu trách nhiệm giao tiếp với hệ thống Backend thông qua các API endpoint.

## 💡 Vai trò chính

*   Chứa các cấu hình HTTP Client (sử dụng Axios hoặc Fetch API).
*   Định nghĩa các hàm gọi API (gửi request GET/POST/PUT/DELETE) tới server.
*   Xử lý tập trung các lỗi từ API (như token hết hạn, lỗi server 500, v.v.).
