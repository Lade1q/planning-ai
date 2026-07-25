# TÍNH NĂNG ĐĂNG NHẬP (LOGIN)

#### 1. Login thành công (Happy Path)

- **Mục tiêu:** Kiểm tra đăng nhập với tài khoản hợp lệ.
- **Dữ liệu test (Test Data):**
  - `Email`: `testuser01@example.com` _(tài khoản đã đăng ký thành công)_
  - `Password`: `Password123!`
- **Các bước:** Nhập Email & Password ➔ Bấm nút **Đăng nhập (Login)**.
- **Kết quả mong đợi:**
  - Đăng nhập thành công, chuyển hướng vào trang **Dashboard** / trang chủ.
  - Tên người dùng (`Nguyen Van A`) hoặc Avatar hiển thị ở Header/Sidebar.

---

#### 2. Login thất bại — Sai Mật khẩu (Incorrect Password)

- **Mục tiêu:** Kiểm tra báo lỗi khi nhập đúng email nhưng sai password.
- **Dữ liệu test (Test Data):**
  - `Email`: `testuser01@example.com`
  - `Password`: `WrongPassword999!`
- **Các bước:** Nhập thông tin ➔ Bấm nút **Đăng nhập**.
- **Kết quả mong đợi:**
  - Hiển thị thông báo lỗi chung: _"Email hoặc mật khẩu không chính xác"_ (tránh ghi chi tiết "Sai mật khẩu" để bảo mật).
  - Không cho phép truy cập vào Dashboard.

---

#### 3. Login thất bại — Email chưa từng đăng ký (Non-existent Email)

- **Mục tiêu:** Kiểm tra đăng nhập với email chưa có trong CSDL.
- **Dữ liệu test (Test Data):**
  - `Email`: `notfound_user999@example.com`
  - `Password`: `Password123!`
- **Các bước:** Nhập thông tin ➔ Bấm nút **Đăng nhập**.
- **Kết quả mong đợi:** Hiển thị thông báo lỗi: _"Email hoặc mật khẩu không chính xác"_.

---

#### 4. Login thất bại — Để trống các trường bắt buộc

- **Mục tiêu:** Kiểm tra validate các ô input trống.
- **Dữ liệu test (Test Data):**
  - Case A: Đặt Email = rỗng, Password = `Password123!`
  - Case B: Đặt Email = `testuser01@example.com`, Password = rỗng
- **Các bước:** Bấm nút **Đăng nhập**.
- **Kết quả mong đợi:**
  - Hiển thị báo lỗi: _"Vui lòng nhập Email / Mật khẩu"_.
  - Hệ thống không gửi request lên backend.
