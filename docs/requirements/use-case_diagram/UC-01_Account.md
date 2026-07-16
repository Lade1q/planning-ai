# UC-01: Module Account Management

> **Module:** Account Management
> **Sprint:** 3 (tối giản)
> **DB liên quan:** `users`

---

## UC-01: Đăng ký tài khoản

| Trường | Nội dung |
|---|---|
| **Actor** | Student |
| **Mục tiêu** | Tạo tài khoản mới để sử dụng hệ thống |
| **Điều kiện tiên quyết** | Người dùng chưa có tài khoản |
| **Điều kiện kết thúc (thành công)** | Tài khoản được tạo, người dùng được redirect về Dashboard |

### Luồng chính
1. Student truy cập trang Đăng ký
2. Nhập email và mật khẩu (+ xác nhận mật khẩu)
3. Hệ thống kiểm tra email chưa tồn tại trong DB
4. Hệ thống hash mật khẩu bằng bcrypt, lưu user vào DB
5. Hệ thống cấp JWT token, lưu vào client
6. Redirect về Dashboard

### Luồng thay thế
- **[A1] Đăng ký bằng Google OAuth:**
  1. Student click "Đăng nhập bằng Google"
  2. Google OAuth trả về profile (email, name)
  3. Hệ thống tạo tài khoản từ Google profile (không có mật khẩu)
  4. Redirect về Dashboard

### Luồng ngoại lệ
- **[E1] Email đã tồn tại:** Hệ thống hiển thị lỗi "Email này đã được đăng ký", giữ nguyên form, đề nghị đăng nhập
- **[E2] Mật khẩu không đạt yêu cầu** (ví dụ: < 8 ký tự): Hiển thị yêu cầu cụ thể, không gửi lên server
- **[E3] Hai trường mật khẩu không khớp:** Hiển thị lỗi inline, không submit
- **[E4] Lỗi server / timeout:** Hiển thị thông báo "Đã xảy ra lỗi, vui lòng thử lại"

---

## UC-02: Đăng nhập

| Trường | Nội dung |
|---|---|
| **Actor** | Student |
| **Mục tiêu** | Xác thực danh tính và vào hệ thống |
| **Điều kiện tiên quyết** | Người dùng đã có tài khoản |
| **Điều kiện kết thúc (thành công)** | Nhận JWT token, vào Dashboard |

### Luồng chính
1. Student nhập email + mật khẩu
2. Hệ thống so khớp email trong DB
3. Hệ thống verify mật khẩu với bcrypt hash
4. Cấp JWT token (lưu vào localStorage/httpOnly cookie)
5. Redirect về Dashboard (hoặc trang đang truy cập trước đó)

### Luồng thay thế
- **[A1] Đăng nhập bằng Google OAuth:** Tương tự UC-01[A1], nếu email đã tồn tại thì liên kết với tài khoản cũ

### Luồng ngoại lệ
- **[E1] Email không tồn tại hoặc mật khẩu sai:** Hiển thị lỗi chung "Email hoặc mật khẩu không đúng" (không phân biệt để bảo mật), giữ nguyên email đã nhập
- **[E2] Tài khoản bị khóa / chưa xác thực:** Hiển thị trạng thái tương ứng và hướng dẫn xử lý
- **[E3] Lỗi server:** Hiển thị thông báo lỗi chung

---

## UC-03: Quản lý hồ sơ cá nhân

| Trường | Nội dung |
|---|---|
| **Actor** | Student |
| **Mục tiêu** | Xem và chỉnh sửa thông tin cá nhân |
| **Điều kiện tiên quyết** | Student đã đăng nhập |

### Luồng chính
1. Student vào trang "Hồ sơ cá nhân"
2. Xem thông tin hiện tại (tên, email)
3. (Tùy chọn) Nhập mật khẩu cũ → mật khẩu mới → xác nhận → lưu

### Luồng ngoại lệ
- **[E1] Mật khẩu cũ nhập sai:** Từ chối cập nhật, hiển thị lỗi
- **[E2] Mật khẩu mới không đạt yêu cầu:** Hiển thị yêu cầu, không lưu

---

## UC-04: Đăng xuất

| Trường | Nội dung |
|---|---|
| **Actor** | Student |
| **Mục tiêu** | Kết thúc phiên làm việc |
| **Điều kiện tiên quyết** | Student đang đăng nhập |

### Luồng chính
1. Student click "Đăng xuất"
2. Hệ thống xóa JWT token ở client
3. Redirect về Landing Page / trang Đăng nhập
