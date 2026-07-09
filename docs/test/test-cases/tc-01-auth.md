# Test Cases — Authentication

> **Module:** Authentication  
> **Use Cases:** UC-01 — Register / Login Account  
> **Phiên bản:** 1.0

---

## Test Suite 1: Đăng ký tài khoản (Register)

> Kiểm thử luồng tạo tài khoản mới, bao gồm các trường hợp thành công và các lỗi validation đầu vào.

### TC-AUTH-001: Đăng ký thành công với thông tin hợp lệ

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-AUTH-001 |
| **Tiêu đề** | Đăng ký tài khoản mới thành công với email chưa tồn tại và mật khẩu hợp lệ |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | App đang chạy. Hệ thống kết nối database thành công. Email `newuser@test.com` chưa tồn tại trong database. |
| **Các bước thực hiện** | 1. Truy cập trang chủ.<br>2. Nhấn "Sign Up".<br>3. Nhập Email, Mật khẩu và Xác nhận mật khẩu hợp lệ.<br>4. Nhấn nút "Đăng ký". |
| **Dữ liệu đầu vào** | \- Email: `newuser@test.com`<br>\- Mật khẩu: `Test@12345`<br>\- Xác nhận: `Test@12345` |
| **Kết quả mong đợi** | \- Tài khoản được tạo thành công trong database.<br>\- Hệ thống tự động đăng nhập và chuyển hướng đến Dashboard (trống).<br>\- JWT access token + refresh token được tạo. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Kiểm tra database thực tế để xác nhận record đã được tạo. |

---

### TC-AUTH-002: Đăng ký thất bại — Email đã tồn tại

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-AUTH-002 |
| **Tiêu đề** | Hệ thống từ chối đăng ký khi email đã được đăng ký trước đó |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | Đã có tài khoản với email `existing@test.com` trong database. |
| **Các bước thực hiện** | 1. Nhấn "Sign Up".<br>2. Nhập email đã tồn tại, mật khẩu hợp lệ và xác nhận mật khẩu.<br>3. Nhấn "Đăng ký". |
| **Dữ liệu đầu vào** | \- Email: `existing@test.com`<br>\- Mật khẩu: `Test@12345`<br>\- Xác nhận: `Test@12345` |
| **Kết quả mong đợi** | \- Hệ thống hiển thị thông báo lỗi: *"Email đã được đăng ký. Vui lòng đăng nhập."*<br>\- Không tạo tài khoản mới trong database.<br>\- Người dùng vẫn ở lại trang đăng ký. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Kiểm tra nội dung thông báo lỗi có khớp chính xác không. |

---

### TC-AUTH-003: Đăng ký thất bại — Mật khẩu xác nhận không khớp

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-AUTH-003 |
| **Tiêu đề** | Hệ thống từ chối đăng ký khi mật khẩu và xác nhận mật khẩu không khớp nhau |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | App đang chạy. |
| **Các bước thực hiện** | 1. Nhấn "Sign Up".<br>2. Nhập email hợp lệ.<br>3. Nhập mật khẩu và xác nhận mật khẩu khác nhau.<br>4. Nhấn "Đăng ký". |
| **Dữ liệu đầu vào** | \- Email: `newuser@test.com`<br>\- Mật khẩu: `Test@12345`<br>\- Xác nhận: `WrongPass99` |
| **Kết quả mong đợi** | \- Hệ thống hiển thị thông báo lỗi: *"Xác nhận mật khẩu không khớp."*<br>\- Không tạo tài khoản.<br>\- Người dùng vẫn ở lại trang đăng ký. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | — |

---

### TC-AUTH-004: Đăng ký thất bại — Mật khẩu quá ngắn (< 8 ký tự)

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-AUTH-004 |
| **Tiêu đề** | Hệ thống từ chối đăng ký khi mật khẩu ít hơn 8 ký tự |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | Medium |
| **Điều kiện tiên quyết** | App đang chạy. |
| **Các bước thực hiện** | 1. Nhấn "Sign Up".<br>2. Nhập email hợp lệ.<br>3. Nhập mật khẩu ngắn hơn 8 ký tự.<br>4. Nhấn "Đăng ký". |
| **Dữ liệu đầu vào** | \- Email: `newuser@test.com`<br>\- Mật khẩu: `abc123` (6 ký tự)<br>\- Xác nhận: `abc123` |
| **Kết quả mong đợi** | \- Hệ thống hiển thị thông báo lỗi yêu cầu mật khẩu tối thiểu 8 ký tự.<br>\- Không tạo tài khoản. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Kiểm tra trường hợp biên: mật khẩu đúng 8 ký tự phải được chấp nhận (pass). |

---

## Test Suite 2: Đăng nhập tài khoản (Login)

> Kiểm thử luồng xác thực với tài khoản đã có, bao gồm trường hợp thành công và thất bại do sai thông tin.

### TC-AUTH-005: Đăng nhập thành công với tài khoản hợp lệ

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-AUTH-005 |
| **Tiêu đề** | Đăng nhập thành công khi nhập đúng email và mật khẩu đã đăng ký |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | Đã có tài khoản `testuser@test.com` / `Test@12345` trong database. App đang chạy. |
| **Các bước thực hiện** | 1. Truy cập trang chủ, nhấn "Sign In".<br>2. Nhập email và mật khẩu đúng.<br>3. Nhấn "Đăng nhập". |
| **Dữ liệu đầu vào** | \- Email: `testuser@test.com`<br>\- Mật khẩu: `Test@12345` |
| **Kết quả mong đợi** | \- JWT access token và refresh token được tạo và lưu phía client.<br>\- Hệ thống chuyển hướng đến Dashboard cá nhân.<br>\- Header hiển thị đúng thông tin tài khoản. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Dùng DevTools Application Tab để xác minh token được lưu. |

---

### TC-AUTH-006: Đăng nhập thất bại — Sai mật khẩu (kiểm tra thông báo bảo mật)

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-AUTH-006 |
| **Tiêu đề** | Hệ thống từ chối đăng nhập khi mật khẩu sai và không tiết lộ field nào bị sai |
| **Loại kiểm thử** | Security |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | Đã có tài khoản `testuser@test.com` trong database. |
| **Các bước thực hiện** | 1. Nhấn "Sign In".<br>2. Nhập email đúng, mật khẩu sai.<br>3. Nhấn "Đăng nhập". |
| **Dữ liệu đầu vào** | \- Email: `testuser@test.com`<br>\- Mật khẩu: `WrongPassword` |
| **Kết quả mong đợi** | \- Hệ thống hiển thị thông báo chung: *"Email hoặc mật khẩu không đúng."* (không chỉ rõ field nào sai).<br>\- Không cấp quyền truy cập.<br>\- Người dùng vẫn ở trang đăng nhập. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Thông báo lỗi KHÔNG được gợi ý field nào sai — đây là yêu cầu bảo mật (tránh user enumeration attack). |

---

## Test Suite 3: Quản lý phiên & JWT Token

> Kiểm thử cơ chế tự động làm mới token và xử lý phiên hết hạn.

### TC-AUTH-007: JWT hết hạn trong phiên — Tự động refresh token thành công

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-AUTH-007 |
| **Tiêu đề** | Hệ thống tự động refresh JWT khi access token hết hạn, không làm gián đoạn trải nghiệm người dùng |
| **Loại kiểm thử** | Interface |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | User đang đăng nhập. Access token đã hết hạn (giả lập). Refresh token còn hợp lệ. |
| **Các bước thực hiện** | 1. User đang dùng app với access token đã hết hạn.<br>2. User thực hiện hành động cần xác thực (VD: tải Dashboard).<br>3. Quan sát hành vi hệ thống trong Network Tab. |
| **Dữ liệu đầu vào** | \- Access token hết hạn<br>\- Refresh token còn hợp lệ |
| **Kết quả mong đợi** | \- Hệ thống tự động gọi refresh token endpoint ở nền.<br>\- Access token mới được cấp và lưu lại.<br>\- Hành động của user tiếp tục thành công, không bị gián đoạn hay redirect về Login. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Dùng DevTools Network Tab để xác nhận có request gọi refresh endpoint. |

---

### TC-AUTH-008: Cả access token và refresh token hết hạn — Redirect về Login

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-AUTH-008 |
| **Tiêu đề** | Hệ thống tự động đăng xuất và redirect về trang Login khi cả hai token đều hết hạn |
| **Loại kiểm thử** | Security |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | Cả access token và refresh token đều đã hết hạn. |
| **Các bước thực hiện** | 1. User thực hiện hành động cần xác thực.<br>2. Access token hết hạn → hệ thống thử refresh.<br>3. Refresh token cũng hết hạn → quan sát hành vi. |
| **Dữ liệu đầu vào** | \- Access token hết hạn<br>\- Refresh token hết hạn |
| **Kết quả mong đợi** | \- Hệ thống xóa toàn bộ token khỏi client (logout tự động).<br>\- Redirect về trang Login.<br>\- Có thể hiển thị thông báo: *"Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."* |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | — |

---

## Bảng tóm tắt — Authentication

| Mã TC | Test Suite | Tiêu đề | Loại | Độ ưu tiên | Trạng thái |
|-------|------------|---------|------|------------|------------|
| TC-AUTH-001 | Suite 1: Đăng ký | Đăng ký thành công với thông tin hợp lệ | Functionality | High | Not Run |
| TC-AUTH-002 | Suite 1: Đăng ký | Đăng ký thất bại — Email đã tồn tại | Functionality | High | Not Run |
| TC-AUTH-003 | Suite 1: Đăng ký | Đăng ký thất bại — Mật khẩu xác nhận không khớp | Functionality | High | Not Run |
| TC-AUTH-004 | Suite 1: Đăng ký | Đăng ký thất bại — Mật khẩu quá ngắn | Functionality | Medium | Not Run |
| TC-AUTH-005 | Suite 2: Đăng nhập | Đăng nhập thành công với tài khoản hợp lệ | Functionality | High | Not Run |
| TC-AUTH-006 | Suite 2: Đăng nhập | Đăng nhập thất bại — Sai mật khẩu (bảo mật thông báo) | Security | High | Not Run |
| TC-AUTH-007 | Suite 3: JWT/Session | JWT hết hạn — Tự động refresh token thành công | Interface | High | Not Run |
| TC-AUTH-008 | Suite 3: JWT/Session | JWT hết hạn — Redirect về Login khi refresh token hết hạn | Security | High | Not Run |

---

## Chú thích trạng thái

| Trạng thái | Ý nghĩa |
|-----------|---------|
| Not Run | Chưa thực hiện test |
| Pass | Test qua — kết quả thực tế khớp với kết quả mong đợi |
| Fail | Test không qua — có bug → tạo bug report |
| Blocked | Không thể test — phụ thuộc vào phần khác chưa hoàn thành |

---

## Chú thích loại kiểm thử

| Loại kiểm thử | Kiểm tra điều gì | Ví dụ trong dự án |
|--------------|-----------------|------------------|
| **Functionality** | Tính năng có hoạt động đúng như mô tả không? | Đăng nhập thành công với email/mật khẩu hợp lệ |
| **Security** | Dữ liệu người dùng có được bảo vệ không? | Người dùng A không truy cập được data của người dùng B |
| **Usability** | Người dùng có dễ sử dụng, dễ hiểu không? | Thông báo lỗi có rõ ràng không? |
| **Interface** | Các thành phần hệ thống có giao tiếp đúng không? | Frontend gửi dữ liệu → Backend nhận và xử lý đúng |
| **Database** | Dữ liệu có được lưu/đọc/xóa đúng không? | Sau khi tạo plan, database có record đúng không? |
| **Compatibility** | App có chạy đúng trên các trình duyệt khác nhau không? | Tính năng upload ảnh có hoạt động trên Firefox không? |
| **Performance** | App có chạy nhanh, không bị lag không? | Trang Dashboard load dưới 2 giây? |

---
