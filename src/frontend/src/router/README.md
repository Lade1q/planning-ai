# Thư mục Router

Thư mục này quản lý hệ thống định tuyến (Routing) của ứng dụng Frontend.

## 💡 Vai trò chính

*   Định nghĩa các đường dẫn URL ứng với từng Page tương ứng (ví dụ: `/dashboard` -> `DashboardPage`).
*   Xử lý phân quyền truy cập (Route Guards): Bảo vệ các Private Routes (chỉ cho phép user đã đăng nhập truy cập) và Public Routes (như trang Login).
