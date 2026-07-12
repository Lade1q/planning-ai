# MODULE 3: Focus Session — Use-Case Specification

> **Hệ thống:** Recall AI  
> **Phiên bản:** 1.0  
> **Ngày:** 2026-07-11

---

## UC FS-01: Thực hiện Phiên học

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Thực hiện Phiên học |
| **Brief Description** | Use case này mô tả cách Người dùng (Student) thực hiện một phiên học tập tập trung: chọn khái niệm cần ôn, vận hành bộ đếm thời gian Pomodoro, xem tài liệu gốc, ghi chú nhanh và kết thúc phiên để lưu kết quả. |
| **Actors** | Student, Scheduling & Remediation Engine |

### Pre-conditions

- Người dùng đã đăng nhập thành công vào hệ thống.
- Người dùng có ít nhất một kế hoạch học tập với các khái niệm cần ôn tập.

### Basic Flow

1. Người dùng truy cập tính năng **"Bắt đầu Phiên học"** từ Dashboard hoặc trang lịch ôn tập.
2. Hệ thống hiển thị danh sách các khái niệm cần ôn theo lịch hôm nay; Người dùng chọn một khái niệm và nhấn **"Bắt đầu"**.
3. Hệ thống hiển thị giao diện phiên học với tài liệu gốc PDF (chế độ side-by-side), bộ đếm thời gian Pomodoro và khu vực ghi chú.
4. Người dùng nhấn nút **"Bắt đầu"** trên bộ đếm thời gian; đồng hồ đếm ngược bắt đầu chạy.
5. Người dùng học tài liệu và có thể ghi chú nhanh vào khu vực ghi chú (ghi chú được liên kết với khái niệm hiện tại).
6. Khi hết thời gian Pomodoro, hệ thống phát âm thanh thông báo và hiển thị tùy chọn: **"Nghỉ giải lao"** hoặc **"Tiếp tục"**.
7. Người dùng nhấn **"Kết thúc phiên"** sau khi hoàn thành học.
8. Hệ thống lưu kết quả phiên học (thời gian học, ghi chú) và gửi thông tin đến Scheduling & Remediation Engine để cập nhật điểm thành thạo (`cập nhật mastery`).
9. Hệ thống hiển thị tóm tắt phiên học và thông báo: *"Phiên học hoàn tất! Điểm thành thạo của bạn đã được cập nhật."*

### Alternative Flows

**Alternative Flow 1: Tạm dừng phiên học**

1. Từ bước 4 đến 6 của Basic Flow, Người dùng nhấn nút **"Tạm dừng"** trên bộ đếm thời gian.
2. Hệ thống dừng đồng hồ và lưu trạng thái hiện tại của phiên học.
3. Người dùng nhấn **"Tiếp tục"** để đồng hồ chạy lại từ thời điểm đã tạm dừng.

**Alternative Flow 2: Kích hoạt Strict Mode (Chặn web khác)**

1. Từ bước 2 của Basic Flow, Người dùng bật tùy chọn **"Strict Mode"** trước khi bắt đầu (extend sang FS-04).
2. Hệ thống kích hoạt tính năng chặn các trang web gây xao nhãng trong suốt thời gian phiên học.
3. Khi Người dùng cố truy cập trang web bị chặn, hệ thống hiển thị thông báo nhắc nhở và chuyển hướng về giao diện phiên học.

**Alternative Flow 3: Kết thúc sớm không lưu kết quả**

1. Từ bước 4 đến 7 của Basic Flow, Người dùng nhấn **"Hủy phiên"** thay vì kết thúc bình thường.
2. Hệ thống hiển thị hộp thoại xác nhận: *"Bạn có chắc muốn hủy phiên học này? Tiến độ sẽ không được lưu."*
3. Người dùng xác nhận hủy; hệ thống không cập nhật điểm thành thạo và trở về trang trước.

### Post-conditions

- Bản ghi phiên học được lưu vào cơ sở dữ liệu (thời lượng, khái niệm đã ôn, ghi chú).
- Điểm thành thạo của khái niệm được Scheduling Engine cập nhật dựa trên kết quả phiên học.
- Lịch ôn tập tiếp theo được tính toán lại theo điểm thành thạo mới.

---

## UC FS-02: Cấu hình Pomodoro

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Cấu hình Pomodoro |
| **Brief Description** | Use case này mô tả cách Người dùng (Student) tùy chỉnh các thông số của bộ đếm thời gian Pomodoro bao gồm thời gian học, thời gian nghỉ ngắn và thời gian nghỉ dài. |
| **Actors** | Student |

### Pre-conditions

- Người dùng đã đăng nhập vào hệ thống.
- Người dùng đang ở trang Cấu hình Pomodoro (có thể truy cập từ Hồ sơ hoặc giao diện phiên học).

### Basic Flow

1. Người dùng mở trang cấu hình Pomodoro từ menu Hồ sơ hoặc biểu tượng cài đặt trong phiên học.
2. Hệ thống hiển thị các thông số Pomodoro hiện tại: thời gian tập trung (mặc định 25 phút), thời gian nghỉ ngắn (mặc định 5 phút) và thời gian nghỉ dài (mặc định 15 phút).
3. Người dùng điều chỉnh các thông số bằng cách nhập giá trị mới hoặc dùng nút tăng/giảm.
4. Người dùng nhấn **"Lưu cấu hình"**.
5. Hệ thống xác thực giá trị đầu vào (trong khoảng cho phép) và lưu cấu hình mới.
6. Hệ thống hiển thị thông báo: *"Cấu hình Pomodoro đã được lưu và sẽ áp dụng từ phiên học tiếp theo."*

### Alternative Flows

**Alternative Flow 1: Giá trị cấu hình ngoài giới hạn cho phép**

1. Từ bước 5 của Basic Flow, hệ thống phát hiện giá trị nhập vào không hợp lệ (ví dụ: thời gian tập trung < 1 phút hoặc > 90 phút).
2. Hệ thống hiển thị thông báo lỗi: *"Thời gian tập trung phải nằm trong khoảng 1 đến 90 phút."*
3. Người dùng điều chỉnh lại giá trị và nhấn **"Lưu"** để tiếp tục.

**Alternative Flow 2: Đặt lại về mặc định**

1. Người dùng nhấn **"Đặt lại mặc định"** để khôi phục cấu hình gốc.
2. Hệ thống đặt lại tất cả thông số về giá trị mặc định (25/5/15 phút).
3. Hệ thống hiển thị thông báo: *"Cấu hình Pomodoro đã được đặt lại về mặc định."*

### Post-conditions

- Cấu hình Pomodoro mới được lưu vào hồ sơ Người dùng.
- Các phiên học tiếp theo sẽ sử dụng cấu hình mới.

---

## UC FS-03: Xem Thống kê & Lịch sử

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Xem Thống kê & Lịch sử |
| **Brief Description** | Use case này mô tả cách Người dùng (Student) xem thống kê học tập tổng thể và lịch sử các phiên học trước đây, bao gồm streak, tổng giờ học và danh sách phiên theo ngày. |
| **Actors** | Student |

### Pre-conditions

- Người dùng đã đăng nhập vào hệ thống.
- Người dùng đã thực hiện ít nhất một phiên học trước đó.

### Basic Flow

1. Người dùng truy cập tính năng **"Thống kê & Lịch sử"** từ menu điều hướng.
2. Hệ thống hiển thị tổng quan thống kê: streak hiện tại (số ngày học liên tiếp), tổng số giờ đã học và biểu đồ hoạt động theo tuần/tháng.
3. Hệ thống hiển thị danh sách các phiên học đã thực hiện, sắp xếp theo ngày (mới nhất lên trước).
4. Người dùng nhấn vào một phiên học để xem chi tiết: thời lượng, khái niệm đã ôn, ghi chú đã tạo trong phiên đó.
5. Người dùng sử dụng bộ lọc để xem lịch sử theo kế hoạch học tập cụ thể hoặc theo khái niệm.

### Alternative Flows

**Alternative Flow 1: Chưa có lịch sử phiên học**

1. Từ bước 2 của Basic Flow, Người dùng chưa có phiên học nào.
2. Hệ thống hiển thị màn hình trống với thông báo: *"Bạn chưa có phiên học nào. Hãy bắt đầu phiên học đầu tiên!"* kèm nút tắt tắt dẫn đến FS-01.

**Alternative Flow 2: Lọc theo kế hoạch hoặc khái niệm**

1. Từ bước 5 của Basic Flow, Người dùng chọn bộ lọc theo kế hoạch hoặc khái niệm.
2. Hệ thống lọc danh sách phiên học và chỉ hiển thị các phiên thuộc kế hoạch/khái niệm đã chọn.
3. Hệ thống cập nhật lại thống kê tổng quan theo phạm vi bộ lọc.

### Post-conditions

- Người dùng xem được đầy đủ thống kê và lịch sử học tập của mình.
- Không có thay đổi dữ liệu (chỉ đọc).

---

## UC FS-04: Bật Strict Mode

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Bật Strict Mode |
| **Brief Description** | Use case này mô tả cách hệ thống kích hoạt chế độ Strict Mode để chặn các trang web gây xao nhãng trong suốt thời gian diễn ra phiên học, giúp Người dùng duy trì sự tập trung. |
| **Actors** | Student |

### Pre-conditions

- Người dùng đang trong quá trình thiết lập phiên học (FS-01) và đã bật tùy chọn Strict Mode.
- Phiên học đang chạy (bộ đếm thời gian đã được khởi động).

### Basic Flow

1. Người dùng bật toggle **"Strict Mode"** trong màn hình thiết lập phiên học (extend từ FS-01).
2. Hệ thống hiển thị danh sách các trang web sẽ bị chặn và yêu cầu Người dùng xác nhận: *"Strict Mode sẽ chặn các trang web gây xao nhãng trong suốt phiên học. Bạn có muốn tiếp tục?"*
3. Người dùng xác nhận; hệ thống kích hoạt cơ chế chặn trang web.
4. Trong suốt phiên học, khi Người dùng cố truy cập trang web bị chặn, hệ thống chặn và hiển thị trang thông báo: *"Bạn đang trong phiên học tập trung. Hãy quay lại sau khi kết thúc phiên!"*
5. Khi phiên học kết thúc (FS-01 bước 7), hệ thống tự động tắt Strict Mode và khôi phục quyền truy cập thông thường.

### Alternative Flows

**Alternative Flow 1: Người dùng cố tắt Strict Mode trong phiên học**

1. Từ bước 4 của Basic Flow, Người dùng cố tắt Strict Mode trong khi phiên học đang chạy.
2. Hệ thống hiển thị cảnh báo: *"Strict Mode đang hoạt động để giúp bạn tập trung. Bạn có chắc muốn tắt không?"*
3. Người dùng xác nhận tắt; hệ thống vô hiệu hóa Strict Mode và ghi nhận vào lịch sử phiên học.

**Alternative Flow 2: Trang web không nằm trong danh sách chặn**

1. Từ bước 4 của Basic Flow, Người dùng truy cập trang web không có trong danh sách chặn mặc định.
2. Hệ thống cho phép truy cập bình thường; trang web hiển thị như thường lệ.

### Post-conditions

- Strict Mode được kích hoạt/vô hiệu hóa đúng theo trạng thái phiên học.
- Lịch sử phiên học ghi nhận thông tin về việc sử dụng Strict Mode.

---

## UC FS-05: Xem Gợi ý Concept

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Xem Gợi ý Concept |
| **Brief Description** | Use case này mô tả cách Người dùng (Student) xem danh sách các khái niệm được hệ thống gợi ý để ôn tập, dựa trên điểm thành thạo và lịch ôn tập được tính toán bởi Scheduling & Remediation Engine. |
| **Actors** | Student, Scheduling & Remediation Engine |

### Pre-conditions

- Người dùng đã đăng nhập vào hệ thống.
- Người dùng có ít nhất một kế hoạch học tập đang hoạt động.

### Basic Flow

1. Người dùng truy cập tính năng **"Gợi ý Concept"** hoặc xem phần gợi ý trên Dashboard.
2. Scheduling & Remediation Engine cung cấp danh sách (`Cung cấp danh sách`) các khái niệm được gợi ý, sắp xếp theo mức độ ưu tiên (dựa trên điểm thành thạo thấp và thời gian quá hạn ôn tập).
3. Hệ thống hiển thị danh sách gợi ý kèm thông tin: tên khái niệm, điểm thành thạo hiện tại, ngày ôn tập cuối cùng và lý do được gợi ý.
4. Người dùng nhấn vào một khái niệm gợi ý để chọn bài học.
5. Hệ thống chuyển sang giao diện bắt đầu phiên học (FS-01) với khái niệm đã chọn được pre-selected (extend sang FS-01).

### Alternative Flows

**Alternative Flow 1: Không có khái niệm nào cần ôn**

1. Từ bước 2 của Basic Flow, Scheduling Engine xác định tất cả khái niệm đều có điểm thành thạo cao và chưa đến lịch ôn.
2. Hệ thống hiển thị thông báo: *"Tuyệt vời! Bạn đã ôn tập đầy đủ các khái niệm hôm nay. Hãy quay lại vào ngày mai."*
3. Hệ thống hiển thị khái niệm tiếp theo cần ôn kèm thời gian còn lại.

**Alternative Flow 2: Người dùng bỏ qua gợi ý**

1. Từ bước 3 của Basic Flow, Người dùng không muốn học các khái niệm được gợi ý và nhấn **"Bỏ qua"**.
2. Hệ thống cho phép Người dùng tự chọn khái niệm từ danh sách kế hoạch học tập thay vì theo gợi ý.

### Post-conditions

- Người dùng đã xem danh sách gợi ý và có thể bắt đầu phiên học với khái niệm được chọn.
- Không có thay đổi dữ liệu trừ khi Người dùng chọn bắt đầu phiên học.
