# Tài liệu Use Cases - Planning AI

> **Tài liệu:** Danh sách và Chi tiết Use Cases
> **Dự án:** Planning AI
> **Trạng thái:** Draft
> **Cập nhật:** v1.1 (Đồng bộ Spec v1.2, Kiến trúc)

---

## 1. Tổng quan (Overview)

Tài liệu này mô tả chi tiết các Use Cases (Ca sử dụng) cốt lõi của hệ thống Planning AI. Mục đích của tài liệu là cung cấp cái nhìn toàn diện về cách thức người dùng tương tác với hệ thống, cũng như cách hệ thống phản hồi lại các thao tác đó. Tài liệu này tập trung vào các tính năng thuộc giai đoạn MVP, bao gồm luồng làm việc chính: Plan (Lập kế hoạch), Focus (Tập trung) và Verify (Xác nhận & Ăn mừng).

---

## 2. Danh sách Tác nhân (Actors)

| Tác nhân (Actor) | Mô tả |
| --- | --- |
| **Người dùng (User)** | Sinh viên, nhân viên văn phòng, hoặc người có nhu cầu quản lý thời gian, công việc và tự kiểm tra kiến thức. Họ tương tác trực tiếp với giao diện của Planning AI. |
| **Hệ thống AI (AI System)** | Đóng vai trò phân tích thông tin đầu vào (văn bản, hình ảnh), tạo kế hoạch, phân loại task và đóng vai trò người kiểm tra kiến thức (AI Examiner). Cụ thể ở đây là Gemini API. |
| **Hệ thống lưu trữ đám mây (Cloud Storage)** | Hệ thống bên ngoài (Cloudflare R2) chịu trách nhiệm lưu trữ hình ảnh thông qua cơ chế Presigned POST Policy. |

---

## 3. Danh sách Use Cases (Use Case Inventory)

Bảng dưới đây tổng hợp các Use Cases cốt lõi của hệ thống trong giai đoạn MVP:

| ID | Tên Use Case | Nhóm tính năng | Mức độ ưu tiên |
| --- | --- | --- | --- |
| UC-01 | Tạo kế hoạch bằng văn bản và hình ảnh | AI Planning | Cao (High) |
| UC-02 | Chỉnh sửa kế hoạch và quản lý task thủ công | AI Planning | Cao (High) |
| UC-03 | Bắt đầu Focus Session (Pomodoro) | Focus | Cao (High) |
| UC-04 | Hoàn thành Task & Moment Capture | Verify | Cao (High) |
| UC-05 | Đánh giá kiến thức với AI Examiner | Verify | Cao (High) |
| UC-06 | Xem tổng quan trên Dashboard | Dashboard | Trung bình (Medium) |
| UC-07 | Đăng ký và Đăng nhập tài khoản | Authentication | Cao (High) |

---

## 4. Chi tiết Use Cases (Detailed Use Cases)

Dưới đây là đặc tả chi tiết cho các Use Cases quan trọng nhất của luồng Plan - Focus - Verify.

### UC-01: Tạo kế hoạch bằng văn bản/hình ảnh

*   **ID:** UC-01
*   **Tên Use Case:** Tạo kế hoạch bằng văn bản và hình ảnh (AI Planning)
*   **Tóm tắt:** Người dùng cung cấp mô tả mục tiêu và đính kèm hình ảnh. AI phân tích và trả về kế hoạch, tự động phân loại task.
*   **Tác nhân:** User, AI System, Cloud Storage
*   **Tiền điều kiện (Preconditions):**
    *   Người dùng đã đăng nhập vào hệ thống.
    *   Hệ thống Backend kết nối ổn định với Database và R2.
*   **Hậu điều kiện (Postconditions):**
    *   Một kế hoạch mới cùng danh sách task con được lưu vào DB (sử dụng **Database Transaction** để đảm bảo tính All-or-Nothing).
    *   Lưu trữ `raw_response` của AI dưới định dạng **JSONB** để audit.
*   **Luồng cơ bản (Happy Path):**
    1.  Người dùng nhập mô tả mục tiêu (bắt buộc).
    2.  Người dùng đính kèm hình ảnh (tối đa 4 ảnh).
    3.  Frontend gọi API Backend xin **Presigned POST Policy** (giới hạn cứng 10MB) để đẩy ảnh lên Cloudflare R2 kèm Progress Bar tải lên.
    4.  Người dùng chọn deadline tổng thể và nhấn "Tạo kế hoạch".
    5.  Hệ thống hiển thị **Full-screen Overlay Loading** (kèm thông điệp vui nhộn).
    6.  Backend gửi văn bản và URL hình ảnh đến Gemini API (lưu ý: Timeout > 45s).
    7.  AI trả về JSON chứa cấu trúc kế hoạch. Backend lưu Plan và Task qua Transaction, đồng thời lưu `raw_response` JSONB.
    8.  Chuyển hướng đến màn hình Plan Details.
*   **Các luồng phụ/ngoại lệ (Alternative/Error Paths):**
    *   *Deadline trong quá khứ:* Hệ thống vô hiệu hóa nút tạo, hiển thị lỗi "Deadline phải là ngày trong tương lai".
    *   *Lỗi thiếu dữ liệu:* Bỏ trống mô tả -> hiển thị gợi ý "Vui lòng nhập mô tả mục tiêu".
    *   *Hình ảnh sai định dạng/Kích thước:* Vượt quá 10MB hoặc sai định dạng (PDF, GIF) -> từ chối tải lên ngay lập tức tại Client.
    *   *Hình ảnh mờ/Không rõ:* AI phân tích không được ảnh, trả về kế hoạch từ text và kèm theo trường cảnh báo. Frontend hiển thị cảnh báo cho người dùng.
    *   *AI Timeout/Lỗi:* Mất quá 45s hoặc AI từ chối, hiển thị "AI mất nhiều thời gian hơn dự kiến, vui lòng thử lại".

### UC-02: Chỉnh sửa kế hoạch và quản lý task thủ công

*   **ID:** UC-02
*   **Tên Use Case:** Chỉnh sửa kế hoạch và quản lý task thủ công
*   **Tóm tắt:** Người dùng tùy chỉnh kế hoạch, sắp xếp lại thứ tự task, đổi tên, thay đổi độ ưu tiên.
*   **Tác nhân:** User
*   **Tiền điều kiện (Preconditions):**
    *   Người dùng đang xem danh sách kế hoạch hoặc chi tiết kế hoạch.
*   **Hậu điều kiện (Postconditions):**
    *   Thay đổi được lưu vào cơ sở dữ liệu.
*   **Luồng cơ bản (Happy Path):**
    1.  Người dùng truy cập vào chi tiết kế hoạch.
    2.  Người dùng thực hiện Inline Edit tiêu đề, hoặc kéo thả (Drag & Drop) để sắp xếp lại Task.
    3.  Hệ thống gọi API để cập nhật.
    4.  Trạng thái thay đổi thành công.
*   **Các luồng phụ/ngoại lệ (Alternative/Error Paths):**
    *   *Lỗi 404 Kế hoạch không tồn tại:* Truy cập sai ID hoặc kế hoạch đã xóa -> chuyển đến trang báo lỗi 404.
    *   *Mất mạng khi lưu thay đổi (Drag & Drop / Edit):* Giao diện hiển thị cảnh báo "Chưa thể lưu thay đổi, vui lòng kiểm tra kết nối", giữ lại state chưa lưu để người dùng thử lại.
    *   *Lỗi tải danh sách kế hoạch:* Mất mạng -> Hiển thị Error State kèm nút "Thử lại".

### UC-03: Bắt đầu Focus Session

*   **ID:** UC-03
*   **Tên Use Case:** Bắt đầu phiên tập trung (Focus Session)
*   **Tóm tắt:** Người dùng đếm ngược thời gian Pomodoro để tập trung làm task.
*   **Tác nhân:** User
*   **Tiền điều kiện (Preconditions):**
    *   Task ở trạng thái "Chưa bắt đầu" hoặc "Đang làm".
*   **Hậu điều kiện (Postconditions):**
    *   Thời gian tập trung được cập nhật.
*   **Luồng cơ bản (Happy Path):**
    1.  Người dùng nhấn "Bắt đầu Focus" trên task.
    2.  Đồng hồ bắt đầu chạy. **Ghi chú kỹ thuật:** Frontend lưu state đếm ngược vào `localStorage` hoặc `Service Worker` để đảm bảo đồng hồ vẫn chạy nếu người dùng chuyển tab hoặc lỡ tải lại trang.
    3.  Khi hết giờ, hệ thống dùng **Web Audio API** để phát âm thanh báo thức kể cả khi tab đang chạy ngầm.
*   **Các luồng phụ/ngoại lệ (Alternative/Error Paths):**
    *   *Dừng phiên sớm:* Nhấn Hủy -> Phiên không được tính.

### UC-04: Hoàn thành Task & Moment Capture

*   **ID:** UC-04
*   **Tên Use Case:** Hoàn thành Task & Moment Capture
*   **Tóm tắt:** Đánh dấu hoàn thành task, mở Modal Celebration chung. Nếu task học thuật thì hiển thị thêm nút "Bắt đầu AI Examiner" ngay trong Modal này để chống Modal Fatigue.
*   **Tác nhân:** User, Cloud Storage
*   **Tiền điều kiện (Preconditions):**
    *   Task đang không bị hoàn thành.
*   **Hậu điều kiện (Postconditions):**
    *   Task chuyển trạng thái, điểm thưởng/XP sinh ra được bọc trong **Database Transaction**.
*   **Luồng cơ bản (Happy Path):**
    1.  Người dùng tick chọn hoàn thành task.
    2.  Hệ thống hiển thị **Modal Celebration** (Overlay) duy nhất.
    3.  Trong Modal, hệ thống cung cấp tính năng Wizard gồm 2 phần: Chụp ảnh khoảnh khắc và tuỳ chọn AI Examiner (nếu task là `learning`).
    4.  Người dùng chọn Chụp ảnh khoảnh khắc, Frontend xin **Presigned POST Policy**, hiển thị Progress bar và tải ảnh thẳng lên R2 (Giới hạn 10MB).
    5.  Hệ thống đóng Modal, chuyển hướng về Task Management.
*   **Các luồng phụ/ngoại lệ (Alternative/Error Paths):**
    *   *Bỏ đánh dấu (Uncheck) task hoàn thành:* Người dùng uncheck task đã xong -> Task lùi về "Đang làm", trạng thái kế hoạch tự lùi tương ứng (bọc Transaction).
    *   *Mất mạng khi Check/Uncheck:* Frontend dùng Optimistic UI, nếu API lỗi sẽ revert lại trạng thái check trước đó và báo lỗi "Mất kết nối mạng".
    *   *Lỗi Upload Ảnh Moment Capture:* Gặp lỗi mạng khi đang đẩy lên R2 -> Báo lỗi "Không thể tải ảnh lên" và cho phép thử lại.
    *   *Bỏ qua Moment Capture:* Người dùng có thể nhấn Đóng Modal bất kỳ lúc nào.

### UC-05: Đánh giá kiến thức với AI Examiner

*   **ID:** UC-05
*   **Tên Use Case:** Xác nhận mức độ hiểu bài với AI Examiner
*   **Tóm tắt:** Vấn đáp bằng AI cho các task học tập. Nằm trong Modal Celebration.
*   **Tác nhân:** User, AI System
*   **Tiền điều kiện (Preconditions):**
    *   Người dùng nhấn "Bắt đầu AI Examiner" từ Modal Celebration (UC-04).
*   **Hậu điều kiện (Postconditions):**
    *   Kết quả vấn đáp được lưu vào Database, raw data dạng JSONB.
*   **Luồng cơ bản (Happy Path):**
    1.  Frontend kích hoạt luồng AI Examiner ngay từ UC-04.
    2.  Backend gọi Gemini API sinh câu hỏi vấn đáp (Timeout > 45s). Frontend hiển thị hiệu ứng **AI Typing Indicator** (AI đang gõ/suy nghĩ).
    3.  Người dùng trả lời, AI phân tích đúng/sai và khen ngợi.
    4.  Kết quả được lưu lại, đóng màn hình.
*   **Các luồng phụ/ngoại lệ (Alternative/Error Paths):**
    *   *Task không thuộc loại học kiến thức:* Nút "Bắt đầu AI Examiner" bị ẩn đi trong Modal Celebration ngay từ đầu.
