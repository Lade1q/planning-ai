# Test Cases — Dashboard & Reminders

> **Module:** Dashboard & Reminders  
> **Use Cases:** UC-07 — View Dashboard & Progress · UC-08 — Receive Proactive Review Reminder  
> **Phiên bản:** 1.0

---

## Test Suite 1: Dashboard & Tiến độ học tập (UC-07)

> Kiểm thử màn hình tổng quan: hiển thị Study Plans, Concept Graph với màu mastery, thống kê phiên học, và điều hướng sang session tiếp theo.

### TC-DASH-001: Dashboard load thành công trong vòng 2 giây

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-DASH-001 |
| **Tiêu đề** | Dashboard tải đầy đủ dữ liệu trong vòng 2 giây sau khi đăng nhập |
| **Loại kiểm thử** | Performance |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | User đã đăng nhập. Có ít nhất 1 Study Plan đã tạo. |
| **Các bước thực hiện** | 1. Đăng nhập vào ứng dụng.<br>2. Bắt đầu đo thời gian khi redirect về Dashboard.<br>3. Đợi Dashboard load hoàn toàn. |
| **Dữ liệu đầu vào** | *(không có)* |
| **Kết quả mong đợi** | \- Dashboard hiển thị đầy đủ trong vòng 2 giây.<br>\- Danh sách Study Plans đang active hiển thị.<br>\- Progress bar (% concepts mastered) cho từng plan hiển thị. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Dùng DevTools Network Tab để đo thời gian load. |

---

### TC-DASH-002: Hiển thị tổng quan Study Plans và 3 deadline sắp tới

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-DASH-002 |
| **Tiêu đề** | Dashboard hiển thị đúng danh sách Study Plans và tối đa 3 deadline sắp tới gần nhất |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | User đã đăng nhập. Có ít nhất 3 Study Plans với deadline khác nhau. |
| **Các bước thực hiện** | 1. Vào Dashboard.<br>2. Quan sát khu vực hiển thị Study Plans và deadline. |
| **Dữ liệu đầu vào** | *(không có)* |
| **Kết quả mong đợi** | \- Danh sách Study Plans active hiển thị với progress bar chính xác.<br>\- Tối đa 3 plan có deadline gần nhất được hiển thị nổi bật.<br>\- Deadline được sắp xếp theo thứ tự gần nhất trước. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Kiểm tra progress bar % có khớp với số concepts đã mastered trong database không. |

---

### TC-DASH-003: Concept Graph hiển thị màu sắc phân loại mastery đúng

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-DASH-003 |
| **Tiêu đề** | Concept Graph hiển thị đúng màu sắc cho từng node theo mastery_score |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | Có Study Plan với concepts có mastery_score khác nhau: ≥0.8, 0.6-0.8, <0.6, và null. |
| **Các bước thực hiện** | 1. Vào Dashboard.<br>2. Chọn 1 Study Plan.<br>3. Quan sát Concept Graph. |
| **Dữ liệu đầu vào** | \- Concepts có mastery_score: 0.9 (solid), 0.7 (cần review), 0.4 (yếu), null (chưa học) |
| **Kết quả mong đợi** | \- Node có score ≥ 0.8: màu xanh lá.<br>\- Node có 0.6 ≤ score < 0.8: màu vàng.<br>\- Node có score < 0.6: màu đỏ.<br>\- Node chưa học (null): màu xám. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Cần chuẩn bị sẵn test data với đủ 4 loại mastery_score. |

---

### TC-DASH-004: Click vào node — Xem chi tiết concept và lịch sử điểm

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-DASH-004 |
| **Tiêu đề** | Click vào node trên Concept Graph hiển thị chi tiết lịch sử điểm và câu hỏi từng được hỏi |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | Medium |
| **Điều kiện tiên quyết** | Concept Graph đang hiển thị. Có ít nhất 1 concept đã qua phiên Verify. |
| **Các bước thực hiện** | 1. Xem Concept Graph trên Dashboard.<br>2. Click vào một node đã có mastery_score. |
| **Dữ liệu đầu vào** | *(không có)* |
| **Kết quả mong đợi** | \- Panel chi tiết hiện ra cho concept được chọn.<br>\- Hiển thị: lịch sử điểm qua các lần Verify, câu hỏi từng được hỏi.<br>\- Dữ liệu khớp với lịch sử trong database. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | — |

---

### TC-DASH-005: Thống kê phiên học và so sánh thời gian học tuần

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-DASH-005 |
| **Tiêu đề** | Dashboard hiển thị lịch sử phiên học và thống kê tổng thời gian học theo tuần, so sánh với tuần trước |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | Medium |
| **Điều kiện tiên quyết** | User đã có lịch sử học trong ít nhất 2 tuần. |
| **Các bước thực hiện** | 1. Vào Dashboard.<br>2. Kéo xuống khu vực thống kê / lịch sử. |
| **Dữ liệu đầu vào** | *(không có)* |
| **Kết quả mong đợi** | \- Lịch sử phiên học và kiểm chứng theo thời gian hiển thị đúng.<br>\- Tổng thời gian học tuần hiện tại hiển thị.<br>\- So sánh với tuần trước: tăng/giảm bao nhiêu %. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Kiểm tra logic tính tuần: đúng 7 ngày hay theo tuần lịch (Mon-Sun)? |

---

### TC-DASH-006: Nút Continue Studying điều hướng đến session tiếp theo

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-DASH-006 |
| **Tiêu đề** | Nhấn "Continue Studying" từ Dashboard điều hướng đúng đến màn hình bắt đầu Focus Session |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | User đã đăng nhập. Có Study Plan đã xác nhận với concept chưa mastered. |
| **Các bước thực hiện** | 1. Vào Dashboard.<br>2. Nhấn "Continue Studying" trên Study Plan. |
| **Dữ liệu đầu vào** | *(không có)* |
| **Kết quả mong đợi** | \- Hệ thống điều hướng đến màn hình bắt đầu Focus Session (UC-04).<br>\- Concept được gợi ý tiếp theo theo đúng thứ tự ưu tiên: deadline gần + mastery_score thấp + thứ tự trong đồ thị. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | — |

---

### TC-DASH-007: Empty state — Chưa có Study Plan nào

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-DASH-007 |
| **Tiêu đề** | Dashboard hiển thị empty state và nút CTA khi người dùng chưa có Study Plan nào |
| **Loại kiểm thử** | Usability |
| **Độ ưu tiên** | Medium |
| **Điều kiện tiên quyết** | User đã đăng nhập nhưng chưa tạo Study Plan nào. |
| **Các bước thực hiện** | 1. Đăng nhập bằng tài khoản mới chưa có Study Plan.<br>2. Vào Dashboard. |
| **Dữ liệu đầu vào** | *(không có)* |
| **Kết quả mong đợi** | \- Dashboard hiển thị empty state rõ ràng (không hiển thị trang trống hoặc lỗi).<br>\- Có nút CTA: *"Create your first Study Plan"* dẫn đến màn hình tạo Plan. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | — |

---

## Test Suite 2: Proactive Review Reminder (UC-08)

> Kiểm thử hệ thống nhắc nhở tự động: gửi notification khi urgency cao, điều hướng đến session, snooze, và congratulation khi tất cả concepts đã vững.

### TC-DASH-008: Nhận in-app notification nhắc ôn tập khi urgency cao

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-DASH-008 |
| **Tiêu đề** | Hệ thống gửi in-app notification nhắc ôn tập khi concept có urgency cao |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | User có Study Plan. Concept có deadline gần (3 ngày), mastery_score thấp, lâu không được test. |
| **Các bước thực hiện** | 1. Giả lập điều kiện: deadline trong 3 ngày, mastery_score = 0.3, last_tested_at = 7 ngày trước.<br>2. Trigger scheduling engine (hoặc chờ tự động chạy).<br>3. User vào app và quan sát. |
| **Dữ liệu đầu vào** | \- deadline = ngày hiện tại + 3<br>\- mastery_score = 0.3<br>\- last_tested_at = 7 ngày trước |
| **Kết quả mong đợi** | \- In-app notification xuất hiện: *"[Concept X] trong môn [Y] cần được ôn lại — còn [Z] ngày đến deadline, điểm hiện tại: [score%]."*<br>\- Nội dung notification đúng với concept và deadline thực tế. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Cần phối hợp với Dev để trigger scheduling engine trong môi trường test. |

---

### TC-DASH-009: Click notification — Điều hướng thẳng đến session của concept

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-DASH-009 |
| **Tiêu đề** | Nhấn vào notification nhắc ôn tập điều hướng thẳng đến Focus Session của concept được nhắc |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | Có in-app notification nhắc ôn tập đang hiển thị. |
| **Các bước thực hiện** | 1. Có notification nhắc ôn concept X.<br>2. Nhấn vào notification. |
| **Dữ liệu đầu vào** | *(không có)* |
| **Kết quả mong đợi** | \- Hệ thống điều hướng thẳng đến màn hình Focus Session của concept X (không qua Dashboard).<br>\- Concept X được pre-select sẵn. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | — |

---

### TC-DASH-010: Snooze notification — Không gửi lại trong 2 giờ

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-DASH-010 |
| **Tiêu đề** | Khi người dùng chọn Snooze, hệ thống không gửi lại notification trong 2 giờ tiếp theo |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | Medium |
| **Điều kiện tiên quyết** | Có in-app notification nhắc ôn tập đang hiển thị. |
| **Các bước thực hiện** | 1. Notification nhắc ôn xuất hiện.<br>2. Nhấn "Snooze 2 giờ".<br>3. Kiểm tra sau 30 phút: có notification mới không.<br>4. Kiểm tra sau 2 giờ: notification có xuất hiện lại không. |
| **Dữ liệu đầu vào** | *(không có)* |
| **Kết quả mong đợi** | \- Sau khi Snooze: notification biến mất.<br>\- Trong vòng 2 giờ: không gửi lại notification cho concept đó.<br>\- Sau 2 giờ: notification xuất hiện lại nếu urgency vẫn cao. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Cần giả lập thời gian hoặc chỉnh database để test nhanh. |

---

### TC-DASH-011: Congratulation notification khi tất cả concepts solid trước deadline 2 ngày

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-DASH-011 |
| **Tiêu đề** | Hệ thống gửi congratulation notification thay vì reminder khi tất cả concepts đã solid (≥ 0.8) trước deadline 2 ngày |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | Low |
| **Điều kiện tiên quyết** | Tất cả concepts trong Study Plan có mastery_score ≥ 0.8. Deadline còn 2 ngày. |
| **Các bước thực hiện** | 1. Giả lập: tất cả mastery_score ≥ 0.8, deadline = ngày hiện tại + 2.<br>2. Trigger scheduling engine. |
| **Dữ liệu đầu vào** | \- Tất cả mastery_score ≥ 0.8<br>\- deadline = ngày hiện tại + 2 |
| **Kết quả mong đợi** | \- Hệ thống gửi congratulation notification thay vì reminder.<br>\- Nội dung thể hiện sự chúc mừng, không phải cảnh báo. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | — |

---

## Bảng tóm tắt — Dashboard & Reminders

| Mã TC | Test Suite | Tiêu đề | Loại | Độ ưu tiên | Trạng thái |
|-------|------------|---------|------|------------|------------|
| TC-DASH-001 | Suite 1: Dashboard | Dashboard load trong 2 giây | Performance | High | Not Run |
| TC-DASH-002 | Suite 1: Dashboard | Hiển thị Study Plans và 3 deadline sắp tới | Functionality | High | Not Run |
| TC-DASH-003 | Suite 1: Dashboard | Concept Graph màu sắc phân loại mastery | Functionality | High | Not Run |
| TC-DASH-004 | Suite 1: Dashboard | Click node — xem chi tiết concept | Functionality | Medium | Not Run |
| TC-DASH-005 | Suite 1: Dashboard | Thống kê phiên học và so sánh tuần | Functionality | Medium | Not Run |
| TC-DASH-006 | Suite 1: Dashboard | Nút Continue Studying điều hướng đúng | Functionality | High | Not Run |
| TC-DASH-007 | Suite 1: Dashboard | Empty state khi chưa có Study Plan | Usability | Medium | Not Run |
| TC-DASH-008 | Suite 2: Reminders | Nhận in-app notification nhắc ôn tập | Functionality | High | Not Run |
| TC-DASH-009 | Suite 2: Reminders | Click notification — điều hướng đến session | Functionality | High | Not Run |
| TC-DASH-010 | Suite 2: Reminders | Snooze — không gửi lại trong 2 giờ | Functionality | Medium | Not Run |
| TC-DASH-011 | Suite 2: Reminders | Congratulation notification khi tất cả solid | Functionality | Low | Not Run |

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

