# Test Cases — Focus Session

> **Module:** Focus Session  
> **Use Cases:** UC-04 — Start Focus Session  
> **Phiên bản:** 1.0

---

## Test Suite 1: Bắt đầu phiên học

> Kiểm thử luồng khởi tạo phiên học: chọn concept, cài thời lượng, liên kết task và bắt đầu timer.

### TC-FOCUS-001: Bắt đầu Focus Session thành công với Pomodoro mặc định

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-FOCUS-001 |
| **Tiêu đề** | Bắt đầu phiên học thành công với cài đặt Pomodoro mặc định (25 phút học / 5 phút nghỉ) |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | User đã đăng nhập. Có ít nhất 1 Study Plan đã được xác nhận (UC-03 hoàn thành). |
| **Các bước thực hiện** | 1. Vào Dashboard, chọn Study Plan.<br>2. Nhấn "Start Session".<br>3. Chọn concept cần học.<br>4. Giữ nguyên thời lượng mặc định (25 phút).<br>5. Nhấn "Start Timer". |
| **Dữ liệu đầu vào** | \- Thời lượng: 25 phút (mặc định) |
| **Kết quả mong đợi** | \- Đồng hồ đếm ngược bắt đầu từ 25:00.<br>\- Concept được học hiển thị rõ ràng.<br>\- Hệ thống lắng nghe sự kiện gián đoạn (tab switch, pause) ở nền. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | — |

---

### TC-FOCUS-002: Bắt đầu Focus Session với thời lượng tùy chỉnh

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-FOCUS-002 |
| **Tiêu đề** | Người dùng tùy chỉnh thời lượng phiên học và đồng hồ chạy đúng thời lượng đã chọn |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | Medium |
| **Điều kiện tiên quyết** | User đã đăng nhập. Có Study Plan đã xác nhận. |
| **Các bước thực hiện** | 1. Vào màn hình bắt đầu session.<br>2. Chọn thời lượng tùy chỉnh: 45 phút.<br>3. Nhấn "Start Timer". |
| **Dữ liệu đầu vào** | \- Thời lượng tùy chỉnh: 45 phút |
| **Kết quả mong đợi** | \- Đồng hồ đếm ngược bắt đầu từ 45:00.<br>\- Timer chạy đúng và đếm ngược chính xác. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | — |

---

### TC-FOCUS-003: Liên kết session với task cụ thể từ Study Plan

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-FOCUS-003 |
| **Tiêu đề** | Người dùng liên kết Focus Session với một task cụ thể từ Study Plan |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | Medium |
| **Điều kiện tiên quyết** | User đã đăng nhập. Study Plan có ít nhất 2 tasks. |
| **Các bước thực hiện** | 1. Bắt đầu tạo session.<br>2. Chọn tùy chọn liên kết với task cụ thể.<br>3. Chọn task từ danh sách.<br>4. Nhấn "Start Timer". |
| **Dữ liệu đầu vào** | \- Task được chọn: một task cụ thể từ Study Plan |
| **Kết quả mong đợi** | \- Session record được tạo với trường `task_id` liên kết đúng task đã chọn.<br>\- Màn hình hiển thị tên task đang được focus. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Kiểm tra database: session record có `task_id` đúng. |

---

## Test Suite 2: Trong phiên học — Gián đoạn

> Kiểm thử cơ chế phát hiện và ghi nhận gián đoạn tự động: Pause thủ công và chuyển tab.

### TC-FOCUS-004: Pause và Resume timer — Ghi nhận sự kiện gián đoạn

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-FOCUS-004 |
| **Tiêu đề** | Người dùng tạm dừng timer và tiếp tục — hệ thống ghi nhận sự kiện gián đoạn manual_pause |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | Focus Session đang chạy. |
| **Các bước thực hiện** | 1. Đang trong phiên học, timer đang chạy.<br>2. Nhấn nút "Pause".<br>3. Quan sát timer và ghi nhận.<br>4. Nhấn "Resume" để tiếp tục. |
| **Dữ liệu đầu vào** | *(không có)* |
| **Kết quả mong đợi** | \- Timer dừng lại khi Pause.<br>\- Sự kiện gián đoạn được ghi nhận: `{timestamp, type: "manual_pause"}`.<br>\- Timer tiếp tục từ điểm dừng khi Resume (không bị reset). |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Cần Dev expose API để xác minh interruption_events được ghi nhận đúng. |

---

### TC-FOCUS-005: Phát hiện chuyển tab (tab switch) tự động

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-FOCUS-005 |
| **Tiêu đề** | Hệ thống tự động phát hiện và ghi nhận sự kiện chuyển tab trong khi Focus Session đang chạy |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | Focus Session đang chạy. |
| **Các bước thực hiện** | 1. Đang trong phiên học, timer đang chạy.<br>2. Chuyển sang tab khác trong trình duyệt trong khoảng 10 giây.<br>3. Quay lại tab ứng dụng. |
| **Dữ liệu đầu vào** | *(không có)* |
| **Kết quả mong đợi** | \- Khi quay lại: hiển thị thông báo: *"Bạn vừa rời khỏi trang trong [X] giây."*<br>\- Sự kiện gián đoạn được ghi nhận: `{timestamp, type: "tab_switch"}`.<br>\- Timer tiếp tục chạy (không dừng khi chuyển tab). |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Kiểm tra số giây hiển thị có chính xác không. Hệ thống KHÔNG tự dừng timer khi chuyển tab. |

---

## Test Suite 3: Kết thúc phiên học

> Kiểm thử các trạng thái kết thúc session: hoàn thành, bỏ dở (Skip), và dời sang sau (Study Later).

### TC-FOCUS-006: Hoàn thành session — Lưu record và hiển thị tóm tắt

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-FOCUS-006 |
| **Tiêu đề** | Khi hết giờ hoặc nhấn Done, hệ thống lưu session record hoàn chỉnh và hiển thị màn hình tóm tắt |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | Focus Session đang chạy (giả lập thời gian ngắn để test nhanh). |
| **Các bước thực hiện** | 1. Đang trong phiên học.<br>2. Nhấn "Done" hoặc đợi hết giờ.<br>3. Quan sát màn hình tóm tắt. |
| **Dữ liệu đầu vào** | *(không có)* |
| **Kết quả mong đợi** | \- Session record được lưu: `{start_time, end_time, duration_actual, concept_id, interruption_events[], status: "complete"}`.<br>\- Màn hình tóm tắt hiển thị: tổng thời gian học, số lần gián đoạn, ước lượng nội dung có thể bị bỏ lỡ.<br>\- Nút "Start Interview" xuất hiện để chuyển sang UC-05. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Kiểm tra database: session record có đủ các trường theo spec. |

---

### TC-FOCUS-007: Bỏ dở session (Skip) — Lưu trạng thái incomplete

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-FOCUS-007 |
| **Tiêu đề** | Khi người dùng nhấn Skip giữa chừng, session được lưu trạng thái incomplete và dữ liệu gián đoạn truyền sang Verify |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | Focus Session đang chạy. |
| **Các bước thực hiện** | 1. Đang trong phiên học (chưa hết giờ).<br>2. Nhấn "Skip" để bỏ dở. |
| **Dữ liệu đầu vào** | *(không có)* |
| **Kết quả mong đợi** | \- Session record được lưu với `status: incomplete` và `session_incomplete: true`.<br>\- Concept vẫn nằm trong queue học.<br>\- Khi chuyển sang Verify, dữ liệu gián đoạn được truyền với flag `session_incomplete: true`. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Kiểm tra payload gửi sang UC-05 có chứa flag `session_incomplete`. |

---

### TC-FOCUS-008: Chọn Study Later — Concept dời xuống cuối queue

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-FOCUS-008 |
| **Tiêu đề** | Khi người dùng chọn Study Later, concept được dời xuống cuối queue và không tạo session record |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | Medium |
| **Điều kiện tiên quyết** | User đang ở màn hình bắt đầu session, chưa nhấn Start Timer. Queue có ít nhất 2 concepts. |
| **Các bước thực hiện** | 1. Ở màn hình chọn concept để học.<br>2. Nhấn "Study Later" thay vì bắt đầu. |
| **Dữ liệu đầu vào** | *(không có)* |
| **Kết quả mong đợi** | \- Concept được dời xuống cuối queue học.<br>\- Không có session record nào được tạo.<br>\- Hệ thống hiển thị concept tiếp theo trong queue. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Kiểm tra thứ tự queue sau khi nhấn Study Later. |

---

## Bảng tóm tắt — Focus Session

| Mã TC | Test Suite | Tiêu đề | Loại | Độ ưu tiên | Trạng thái |
|-------|------------|---------|------|------------|------------|
| TC-FOCUS-001 | Suite 1: Bắt đầu Session | Bắt đầu session thành công — Pomodoro mặc định | Functionality | High | Not Run |
| TC-FOCUS-002 | Suite 1: Bắt đầu Session | Bắt đầu session với thời lượng tùy chỉnh | Functionality | Medium | Not Run |
| TC-FOCUS-003 | Suite 1: Bắt đầu Session | Liên kết session với task cụ thể | Functionality | Medium | Not Run |
| TC-FOCUS-004 | Suite 2: Gián đoạn | Pause và Resume timer — ghi nhận manual_pause | Functionality | High | Not Run |
| TC-FOCUS-005 | Suite 2: Gián đoạn | Phát hiện chuyển tab tự động | Functionality | High | Not Run |
| TC-FOCUS-006 | Suite 3: Kết thúc Session | Hoàn thành session — lưu record và tóm tắt | Functionality | High | Not Run |
| TC-FOCUS-007 | Suite 3: Kết thúc Session | Bỏ dở session (Skip) — lưu trạng thái incomplete | Functionality | High | Not Run |
| TC-FOCUS-008 | Suite 3: Kết thúc Session | Study Later — concept dời xuống cuối queue | Functionality | Medium | Not Run |

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
