# MODULE 1: Account Management — Use-Case Specification

> **Hệ thống:** Recall AI  
> **Phiên bản:** 1.0  
> **Ngày:** 2026-07-11

---

## UC AM-01: Đăng ký Tài khoản

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Đăng ký Tài khoản |
| **Brief Description** | Use case này mô tả cách Người dùng (Student) tạo tài khoản mới trên hệ thống Recall AI, thông qua email/mật khẩu hoặc xác thực Google OAuth. |
| **Actors** | Student, Google OAuth |

### Pre-conditions

- Người dùng chưa có tài khoản trên hệ thống Recall AI.
- Người dùng đã truy cập vào trang đăng ký của ứng dụng.

### Basic Flow

1. Người dùng truy cập trang đăng ký và chọn phương thức đăng ký (Email hoặc Google OAuth).
2. **[Nhánh A – Email]** Người dùng nhập địa chỉ email và mật khẩu vào form đăng ký, sau đó nhấn nút **"Đăng ký"**.
3. Hệ thống kiểm tra định dạng email và độ mạnh mật khẩu; nếu hợp lệ, hệ thống tạo tài khoản mới và lưu vào cơ sở dữ liệu.
4. Hệ thống gửi email xác nhận đến địa chỉ email vừa đăng ký và thông báo cho Người dùng kiểm tra hộp thư.
5. **[Nhánh B – Google OAuth]** Người dùng nhấn nút **"Đăng ký bằng Google"**; hệ thống chuyển hướng Người dùng đến trang xác thực của Google OAuth.
6. Người dùng chọn tài khoản Google và cấp quyền truy cập cho ứng dụng.
7. Google OAuth trả về thông tin hồ sơ (email, tên) cho hệ thống; hệ thống tự động tạo tài khoản mới.
8. Hệ thống hiển thị thông báo đăng ký thành công và tự động đăng nhập Người dùng vào ứng dụng.

### Alternative Flows

**Alternative Flow 1: Email đã tồn tại trong hệ thống**

1. Từ bước 3 của Basic Flow, hệ thống phát hiện địa chỉ email đã được đăng ký trước đó.
2. Hệ thống hiển thị thông báo chung: *"Email này đã được sử dụng. Vui lòng đăng nhập hoặc sử dụng email khác."*
3. Người dùng có thể chọn quay lại trang đăng nhập hoặc nhập email khác để tiếp tục.

**Alternative Flow 2: Google Email trùng với tài khoản Email có sẵn (Silent Merge)**

1. Từ bước 7 của Basic Flow, hệ thống phát hiện email Google trùng với một tài khoản email/mật khẩu đã tồn tại.
2. Hệ thống tự động liên kết (silent merge) tài khoản Google vào tài khoản email hiện có mà không tạo tài khoản trùng lặp.
3. Hệ thống thông báo cho Người dùng rằng tài khoản Google đã được liên kết với tài khoản hiện có và tiến hành đăng nhập.

**Alternative Flow 3: Dữ liệu đầu vào không hợp lệ**

1. Từ bước 3 của Basic Flow, hệ thống phát hiện email sai định dạng hoặc mật khẩu không đạt yêu cầu độ mạnh.
2. Hệ thống hiển thị thông báo lỗi tương ứng bên cạnh trường nhập liệu bị lỗi (ví dụ: *"Email không hợp lệ"*, *"Mật khẩu cần ít nhất 8 ký tự"*).
3. Người dùng chỉnh sửa thông tin và nhấn lại nút **"Đăng ký"** để tiếp tục.

### Post-conditions

- Tài khoản mới được tạo thành công và lưu vào cơ sở dữ liệu.
- Người dùng được tự động đăng nhập vào hệ thống.
- Hồ sơ người dùng mặc định được khởi tạo với thông tin cơ bản.

---

## UC AM-02: Đăng nhập Hệ thống

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Đăng nhập Hệ thống |
| **Brief Description** | Use case này mô tả cách Người dùng (Student) xác thực danh tính để truy cập vào hệ thống Recall AI, thông qua email/mật khẩu hoặc Google OAuth. |
| **Actors** | Student, Google OAuth |

### Pre-conditions

- Người dùng đã có tài khoản hợp lệ trên hệ thống Recall AI.
- Người dùng đã truy cập vào trang đăng nhập của ứng dụng.

### Basic Flow

1. Người dùng truy cập trang đăng nhập và chọn phương thức xác thực (Email/Mật khẩu hoặc Google OAuth).
2. **[Nhánh A – Email/Mật khẩu]** Người dùng nhập địa chỉ email và mật khẩu, sau đó nhấn nút **"Đăng nhập"**.
3. Hệ thống xác minh thông tin đăng nhập với cơ sở dữ liệu; nếu hợp lệ, hệ thống tạo JWT (JSON Web Token) và lưu vào cookie/local storage của trình duyệt.
4. **[Nhánh B – Google OAuth]** Người dùng nhấn nút **"Đăng nhập bằng Google"**; hệ thống chuyển hướng đến trang xác thực của Google OAuth.
5. Người dùng chọn tài khoản Google và xác nhận quyền truy cập.
6. Google OAuth trả về token cho hệ thống; hệ thống xác minh token và lấy thông tin tài khoản tương ứng.
7. Hệ thống chuyển hướng Người dùng đến trang Dashboard chính của ứng dụng.

### Alternative Flows

**Alternative Flow 1: Sai email hoặc mật khẩu**

1. Từ bước 3 của Basic Flow, hệ thống không tìm thấy tài khoản phù hợp hoặc mật khẩu không khớp.
2. Hệ thống hiển thị thông báo lỗi: *"Email hoặc mật khẩu không đúng. Vui lòng thử lại."*
3. Người dùng nhập lại thông tin đăng nhập và thử lại.

**Alternative Flow 2: Quá giới hạn số lần đăng nhập sai (Rate Limit)**

1. Từ bước 3 của Basic Flow, hệ thống phát hiện Người dùng đã đăng nhập sai quá nhiều lần liên tiếp.
2. Hệ thống tạm khóa tính năng đăng nhập và hiển thị thông báo: *"Bạn đã đăng nhập sai quá nhiều lần. Vui lòng thử lại sau [X] phút."*
3. Người dùng chờ hết thời gian khóa hoặc sử dụng tính năng "Quên mật khẩu" để khôi phục tài khoản.

**Alternative Flow 3: JWT hết hạn trong phiên làm việc**

1. Người dùng đang sử dụng ứng dụng thì JWT hết hạn.
2. Hệ thống phát hiện token không hợp lệ và tự động chuyển hướng Người dùng về trang đăng nhập.
3. Hệ thống hiển thị thông báo: *"Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."*
4. Người dùng thực hiện lại Basic Flow từ bước 1.

### Post-conditions

- Người dùng được xác thực thành công và có JWT hợp lệ trong phiên làm việc.
- Người dùng được chuyển hướng đến trang Dashboard chính.

---

## UC AM-03: Quản lý Hồ sơ

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Quản lý Hồ sơ |
| **Brief Description** | Use case này mô tả cách Người dùng (Student) xem và cập nhật thông tin cá nhân, thay đổi mật khẩu, cấu hình Pomodoro và quản lý liên kết tài khoản Google. |
| **Actors** | Student, Google OAuth |

### Pre-conditions

- Người dùng đã đăng nhập thành công vào hệ thống.
- Người dùng đã truy cập vào trang Hồ sơ cá nhân (Profile).

### Basic Flow

1. Người dùng truy cập trang Hồ sơ cá nhân từ menu điều hướng.
2. Hệ thống hiển thị thông tin hiện tại của Người dùng bao gồm: tên hiển thị, email, cài đặt Pomodoro và trạng thái liên kết Google.
3. Người dùng chỉnh sửa thông tin mong muốn (tên hiển thị, mật khẩu, cấu hình thời gian Pomodoro) và nhấn nút **"Lưu thay đổi"**.
4. Hệ thống xác thực dữ liệu đầu vào; nếu hợp lệ, hệ thống cập nhật thông tin vào cơ sở dữ liệu.
5. Hệ thống hiển thị thông báo: *"Hồ sơ đã được cập nhật thành công."*

### Alternative Flows

**Alternative Flow 1: Mật khẩu hiện tại không đúng khi đổi mật khẩu**

1. Từ bước 4 của Basic Flow, Người dùng nhập mật khẩu hiện tại sai khi thực hiện đổi mật khẩu.
2. Hệ thống hiển thị thông báo lỗi: *"Mật khẩu hiện tại không đúng. Vui lòng kiểm tra lại."*
3. Người dùng nhập lại mật khẩu hiện tại đúng và thử lại.

**Alternative Flow 2: Liên kết tài khoản Google**

1. Từ bước 2 của Basic Flow, Người dùng nhấn nút **"Liên kết với Google"** trong phần quản lý liên kết.
2. Hệ thống chuyển hướng Người dùng đến trang xác thực của Google OAuth.
3. Người dùng chọn tài khoản Google và cấp quyền truy cập.
4. Google OAuth trả về token; hệ thống liên kết tài khoản Google vào hồ sơ hiện có.
5. Hệ thống hiển thị thông báo: *"Tài khoản Google đã được liên kết thành công."*

**Alternative Flow 3: Dữ liệu cập nhật không hợp lệ**

1. Từ bước 4 của Basic Flow, hệ thống phát hiện dữ liệu không hợp lệ (ví dụ: tên rỗng, thời gian Pomodoro vượt giới hạn cho phép).
2. Hệ thống hiển thị thông báo lỗi tương ứng và giữ nguyên các thay đổi trên form để Người dùng chỉnh sửa.
3. Người dùng chỉnh sửa lại thông tin và nhấn **"Lưu thay đổi"** để tiếp tục.

### Post-conditions

- Thông tin hồ sơ của Người dùng được cập nhật thành công trong cơ sở dữ liệu.
- Các thay đổi cấu hình Pomodoro được áp dụng ngay cho các phiên học tiếp theo.

---

## UC AM-04: Khôi phục Mật khẩu

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Khôi phục Mật khẩu |
| **Brief Description** | Use case này mô tả cách Người dùng (Student) khôi phục quyền truy cập tài khoản khi quên mật khẩu, thông qua việc nhận email chứa link reset mật khẩu có giới hạn thời gian. |
| **Actors** | Student |

### Pre-conditions

- Người dùng có tài khoản đã đăng ký bằng email/mật khẩu (không áp dụng cho tài khoản Google OAuth thuần).
- Người dùng đã nhấn vào link **"Quên mật khẩu?"** từ trang Đăng nhập (extend từ AM-02).

### Basic Flow

1. Hệ thống hiển thị form nhập địa chỉ email để yêu cầu khôi phục mật khẩu.
2. Người dùng nhập địa chỉ email đã đăng ký và nhấn nút **"Gửi yêu cầu"**.
3. Hệ thống kiểm tra email tồn tại trong cơ sở dữ liệu; nếu hợp lệ, hệ thống tạo reset token ngẫu nhiên 32 bytes với TTL = 15 phút và lưu vào cơ sở dữ liệu.
4. Hệ thống gửi email chứa link khôi phục mật khẩu đến địa chỉ email của Người dùng.
5. Hệ thống hiển thị thông báo: *"Email khôi phục đã được gửi. Vui lòng kiểm tra hộp thư của bạn."*
6. Người dùng mở email và nhấn vào link khôi phục.
7. Hệ thống xác minh reset token; nếu hợp lệ và chưa hết hạn, hệ thống hiển thị form đặt mật khẩu mới.
8. Người dùng nhập mật khẩu mới và xác nhận mật khẩu, sau đó nhấn **"Đặt lại Mật khẩu"**.
9. Hệ thống cập nhật mật khẩu mới và xóa reset token khỏi cơ sở dữ liệu.
10. Hệ thống hiển thị thông báo thành công và chuyển hướng Người dùng đến trang đăng nhập.

### Alternative Flows

**Alternative Flow 1: Email không tồn tại trong hệ thống**

1. Từ bước 3 của Basic Flow, hệ thống không tìm thấy email trong cơ sở dữ liệu.
2. Vì lý do bảo mật, hệ thống vẫn hiển thị thông báo chung: *"Nếu email này tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn khôi phục."* (không tiết lộ trạng thái email).
3. Use case kết thúc.

**Alternative Flow 2: Quá giới hạn yêu cầu (Rate Limit – 3 req/giờ/email)**

1. Từ bước 3 của Basic Flow, hệ thống phát hiện Người dùng đã gửi quá 3 yêu cầu khôi phục trong vòng 1 giờ cho cùng một email.
2. Hệ thống từ chối yêu cầu và hiển thị thông báo: *"Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 1 giờ."*
3. Use case kết thúc.

**Alternative Flow 3: Reset Token hết hạn hoặc không hợp lệ**

1. Từ bước 7 của Basic Flow, hệ thống phát hiện token đã hết hạn (quá 15 phút) hoặc đã được sử dụng trước đó.
2. Hệ thống hiển thị thông báo lỗi: *"Link khôi phục đã hết hạn hoặc không hợp lệ. Vui lòng gửi yêu cầu mới."*
3. Người dùng được chuyển hướng về form nhập email để thực hiện lại từ bước 2.

### Post-conditions

- Mật khẩu tài khoản của Người dùng được cập nhật thành công.
- Reset token bị xóa khỏi cơ sở dữ liệu để không thể tái sử dụng.
- Người dùng có thể đăng nhập bằng mật khẩu mới.

---

## UC AM-05: Đăng xuất

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Đăng xuất |
| **Brief Description** | Use case này mô tả cách Người dùng (Student) kết thúc phiên làm việc và đăng xuất khỏi hệ thống Recall AI một cách an toàn. |
| **Actors** | Student |

### Pre-conditions

- Người dùng đang đăng nhập vào hệ thống và có JWT hợp lệ trong phiên làm việc hiện tại.

### Basic Flow

1. Người dùng nhấn vào nút **"Đăng xuất"** từ menu người dùng hoặc trang Hồ sơ.
2. Hệ thống xóa JWT khỏi cookie/local storage của trình duyệt và vô hiệu hóa token phía máy chủ.
3. Hệ thống xóa toàn bộ dữ liệu phiên làm việc khỏi bộ nhớ tạm của trình duyệt.
4. Hệ thống chuyển hướng Người dùng đến trang đăng nhập và hiển thị thông báo: *"Bạn đã đăng xuất thành công."*

### Alternative Flows

**Alternative Flow 1: Mất kết nối mạng khi đăng xuất**

1. Từ bước 2 của Basic Flow, hệ thống không thể kết nối đến máy chủ để vô hiệu hóa token phía máy chủ.
2. Hệ thống vẫn xóa JWT khỏi local storage của trình duyệt để bảo vệ phiên làm việc phía client.
3. Hệ thống chuyển hướng Người dùng về trang đăng nhập và hiển thị thông báo cảnh báo về lỗi kết nối.

### Post-conditions

- JWT của Người dùng bị xóa và phiên làm việc kết thúc.
- Người dùng được chuyển hướng về trang đăng nhập và không thể truy cập các trang yêu cầu xác thực mà không đăng nhập lại.
