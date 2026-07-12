# MODULE 5: Dashboard & Tracking — Use-Case Specification

> **Hệ thống:** Recall AI  
> **Phiên bản:** 1.0  
> **Ngày:** 2026-07-11

---

## UC DB-01: Xem Tổng quan Dashboard

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Xem Tổng quan Dashboard |
| **Brief Description** | Use case này mô tả cách Người dùng (Student) xem trang tổng quan (Dashboard) sau khi đăng nhập, bao gồm trạng thái học tập hôm nay, tiến độ các kế hoạch và mini-graph đồ thị khái niệm. |
| **Actors** | Student |

### Pre-conditions

- Người dùng đã đăng nhập thành công vào hệ thống.
- Người dùng có ít nhất một kế hoạch học tập đang hoạt động.

### Basic Flow

1. Hệ thống tự động chuyển hướng Người dùng đến trang Dashboard sau khi đăng nhập thành công.
2. Hệ thống tải và hiển thị các thông tin tổng quan: streak học tập, số khái niệm cần ôn hôm nay, tiến độ tổng thể (%) của từng kế hoạch học tập đang hoạt động.
3. Hệ thống hiển thị mini-graph đồ thị khái niệm của kế hoạch gần nhất; Người dùng có thể xem nhanh cấu trúc tổng thể.
4. Người dùng nhấn vào một kế hoạch để xem chi tiết hoặc nhấn **"Bắt đầu học ngay"** để chuyển sang phiên học (FS-01/AE-01).
5. Người dùng nhấn vào mini-graph để mở rộng đồ thị đầy đủ (extend: click mini graph → DB-02).

### Alternative Flows

**Alternative Flow 1: Người dùng chưa có kế hoạch học tập nào**

1. Từ bước 2 của Basic Flow, hệ thống không tìm thấy kế hoạch học tập nào của Người dùng.
2. Hệ thống hiển thị màn hình onboarding với thông báo: *"Chào mừng bạn đến với Recall AI! Hãy tạo kế hoạch học tập đầu tiên để bắt đầu."*
3. Hệ thống hiển thị nút **"Tạo kế hoạch đầu tiên"**; Người dùng nhấn và được chuyển đến SP-01.

**Alternative Flow 2: Người dùng đã hoàn thành tất cả bài học hôm nay**

1. Từ bước 2 của Basic Flow, hệ thống xác định không còn khái niệm nào cần ôn hôm nay.
2. Hệ thống hiển thị thông báo khích lệ: *"Xuất sắc! Bạn đã hoàn thành tất cả bài học hôm nay. Hãy quay lại vào ngày mai!"*
3. Hệ thống hiển thị thời gian đến lần ôn tập tiếp theo.

### Post-conditions

- Dashboard được hiển thị với thông tin học tập cập nhật nhất.
- Người dùng có thể điều hướng đến các tính năng khác từ Dashboard.

---

## UC DB-02: Tương tác Đồ thị Khái niệm

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Tương tác Đồ thị Khái niệm |
| **Brief Description** | Use case này mô tả cách Người dùng (Student) khám phá và tương tác với đồ thị khái niệm đầy đủ từ Dashboard, bao gồm zoom/pan, hover để xem tooltip, lọc/tìm kiếm khái niệm và xem chi tiết lịch sử và prerequisites của từng node. |
| **Actors** | Student |

### Pre-conditions

- Người dùng đã đăng nhập vào hệ thống.
- Người dùng đã nhấn vào mini-graph trên Dashboard (extend từ DB-01) hoặc truy cập trực tiếp trang đồ thị.
- Giao diện đồ thị khái niệm (react-flow) đã được tải.

### Basic Flow

1. Hệ thống mở rộng đồ thị khái niệm đầy đủ; Người dùng thấy toàn bộ các node khái niệm và cạnh quan hệ.
2. Người dùng sử dụng chuột để zoom in/zoom out và pan (kéo) để điều hướng trong đồ thị lớn.
3. Người dùng di chuột hover lên một node; hệ thống hiển thị tooltip với thông tin nhanh: tên khái niệm, điểm thành thạo hiện tại và ngày ôn tập gần nhất.
4. Người dùng nhập từ khóa vào ô tìm kiếm trên đồ thị; hệ thống lọc và highlight các node khớp với từ khóa, làm mờ các node không liên quan.
5. Người dùng nhấn vào một node để xem chi tiết; hệ thống mở panel bên phải hiển thị: lịch sử học tập (History), danh sách Prerequisites và biểu đồ tiến độ mastery.
6. Người dùng nhấn **"Bắt đầu ôn tập"** từ panel chi tiết; hệ thống chuyển sang FS-01 với khái niệm đã chọn.

### Alternative Flows

**Alternative Flow 1: Lọc theo Mastery Score**

1. Từ bước 4 của Basic Flow, Người dùng sử dụng bộ lọc theo mức điểm thành thạo (ví dụ: chỉ hiển thị khái niệm có mastery < 50%).
2. Hệ thống ẩn các node có điểm thành thạo cao và chỉ hiển thị các node yếu cần ôn tập.
3. Người dùng dễ dàng xác định điểm yếu cần cải thiện trong kế hoạch học tập.

**Alternative Flow 2: Đồ thị quá lớn, khó điều hướng**

1. Từ bước 2 của Basic Flow, đồ thị có quá nhiều node (ví dụ: > 100 node) khiến việc điều hướng khó khăn.
2. Người dùng nhấn **"Mini-map"** để hiển thị bản đồ thu nhỏ ở góc màn hình.
3. Người dùng nhấn vào vị trí trên mini-map để nhanh chóng điều hướng đến vùng cần xem.

### Post-conditions

- Người dùng đã khám phá đồ thị khái niệm và nắm được tổng quan kiến thức.
- Không có thay đổi dữ liệu (chỉ đọc), trừ khi Người dùng chuyển sang phiên học/kiểm tra.

---

## UC DB-03: Xem Lịch sử Học tập

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Xem Lịch sử Học tập |
| **Brief Description** | Use case này mô tả cách Người dùng (Student) xem lịch sử toàn bộ các phiên học tập và kiểm tra đã thực hiện, lọc theo thời gian và xem biểu đồ tiến độ mastery theo từng khái niệm. |
| **Actors** | Student |

### Pre-conditions

- Người dùng đã đăng nhập vào hệ thống.
- Người dùng đã thực hiện ít nhất một phiên học (Focus Session) hoặc phiên kiểm tra (Interview/AI Examiner) trước đó.

### Basic Flow

1. Người dùng truy cập **"Lịch sử Học tập"** từ menu Dashboard.
2. Hệ thống hiển thị danh sách tổng hợp tất cả các phiên học (Focus Session) và phiên vấn đáp (Interview) đã thực hiện, sắp xếp theo thời gian (mới nhất lên trước).
3. Người dùng xem thống kê tổng quát: tổng số phiên, tổng giờ học, biểu đồ mastery theo thời gian.
4. Người dùng nhấn vào một phiên cụ thể để xem chi tiết: thời lượng, danh sách khái niệm đã ôn, kết quả câu hỏi và ghi chú.
5. Người dùng sử dụng bộ lọc theo khoảng thời gian (7 ngày, 30 ngày, tùy chỉnh) để thu hẹp danh sách.

### Alternative Flows

**Alternative Flow 1: Lọc theo loại phiên học**

1. Từ bước 2 của Basic Flow, Người dùng chọn bộ lọc **"Phiên Vấn đáp"** hoặc **"Phiên Tập trung"** riêng biệt.
2. Hệ thống chỉ hiển thị các phiên thuộc loại đã chọn; thống kê tổng quát được cập nhật theo bộ lọc.

**Alternative Flow 2: Xuất lịch sử ra file**

1. Từ bước 3 của Basic Flow, Người dùng nhấn **"Xuất dữ liệu"** (Export).
2. Hệ thống tạo file CSV hoặc PDF chứa lịch sử học tập và cho Người dùng tải về.

**Alternative Flow 3: Chưa có lịch sử nào**

1. Từ bước 1 của Basic Flow, Người dùng chưa có phiên học nào.
2. Hệ thống hiển thị màn hình trống với thông báo: *"Chưa có lịch sử học tập. Hãy bắt đầu phiên học đầu tiên!"*

### Post-conditions

- Người dùng đã xem xét lịch sử học tập của mình.
- Không có thay đổi dữ liệu (chỉ đọc).

---

## UC DB-04: Nhận Nhắc nhở Ôn tập

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Nhận Nhắc nhở Ôn tập |
| **Brief Description** | Use case này mô tả cách Người dùng (Student) nhận thông báo nhắc nhở từ hệ thống về các khái niệm cần ôn tập quan trọng nhất, được kích hoạt khi đăng nhập hoặc theo lịch tự động vào 7 giờ sáng hàng ngày. |
| **Actors** | Student, Scheduling & Remediation Engine |

### Pre-conditions

- Người dùng đã đăng nhập hoặc lịch cron 7 giờ sáng vừa được kích hoạt.
- Scheduling & Remediation Engine đã tính toán danh sách Top-K khái niệm cần ôn.

### Basic Flow

1. Scheduling & Remediation Engine tính toán và gửi nhắc nhở (`Tính toán & Gửi nhắc nhở`) đến hệ thống, bao gồm danh sách Top-K khái niệm cần ôn tập nhất.
2. Hệ thống hiển thị thông báo nhắc nhở nổi bật cho Người dùng (push notification hoặc banner trong ứng dụng): *"Hôm nay bạn có [K] khái niệm cần ôn: [Danh sách tên khái niệm]. Hãy bắt đầu ngay!"*
3. Người dùng nhấn **"Bắt đầu ôn tập"** từ thông báo; hệ thống chuyển đến FS-01 hoặc AE-01 với danh sách khái niệm được pre-select.
4. Hệ thống đánh dấu thông báo là đã đọc.

### Alternative Flows

**Alternative Flow 1: Người dùng bỏ qua thông báo (Dismiss)**

1. Từ bước 2 của Basic Flow, Người dùng nhấn **"Bỏ qua"** (Dismiss) trên thông báo nhắc nhở.
2. Hệ thống đóng thông báo và ghi nhận rằng Người dùng đã bỏ qua nhắc nhở hôm nay.
3. Thông báo không hiện lại trong ngày; sẽ được tính toán lại và hiển thị vào ngày hôm sau.

**Alternative Flow 2: Người dùng hẹn lại thông báo (Snooze)**

1. Từ bước 2 của Basic Flow, Người dùng nhấn **"Hẹn lại"** (Snooze) và chọn thời gian hẹn lại (ví dụ: sau 1 giờ, sau 3 giờ).
2. Hệ thống ẩn thông báo và đặt lịch hiển thị lại sau thời gian Người dùng chọn.
3. Khi đến giờ hẹn, thông báo xuất hiện lại với nội dung cập nhật.

**Alternative Flow 3: Không có khái niệm nào cần ôn**

1. Từ bước 1 của Basic Flow, Scheduling Engine xác định Người dùng đã ôn đầy đủ, không có khái niệm nào cần nhắc.
2. Hệ thống không gửi thông báo nhắc nhở; Người dùng tiếp tục sử dụng ứng dụng bình thường.

### Post-conditions

- Người dùng đã nhận và xử lý thông báo nhắc nhở (đọc, bỏ qua hoặc snooze).
- Trạng thái thông báo được lưu vào hệ thống để tránh gửi trùng lặp trong ngày.

---

## UC DB-05: Xem Lịch & Deadline

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Xem Lịch & Deadline |
| **Brief Description** | Use case này mô tả cách Người dùng (Student) xem lịch học tập và các deadline ôn tập sắp tới, được hiển thị theo dạng lịch tháng/tuần kết hợp với danh sách deadline theo thứ tự ưu tiên. |
| **Actors** | Student |

### Pre-conditions

- Người dùng đã đăng nhập vào hệ thống.
- Người dùng có ít nhất một kế hoạch học tập với lịch ôn tập đã được tạo bởi Scheduling Engine.

### Basic Flow

1. Người dùng truy cập **"Lịch & Deadline"** từ menu Dashboard.
2. Hệ thống hiển thị giao diện lịch (dạng tháng hoặc tuần) với các sự kiện ôn tập được đánh dấu trên từng ngày.
3. Người dùng nhấn vào một ngày trên lịch; hệ thống hiển thị danh sách các khái niệm cần ôn trong ngày đó, sắp xếp theo thứ tự ưu tiên.
4. Hệ thống hiển thị panel **"Deadline sắp tới"** bên cạnh lịch, liệt kê các khái niệm có hạn ôn tập sắp đến gần nhất theo thứ tự tăng dần.
5. Người dùng nhấn vào một deadline; hệ thống hiển thị thông tin chi tiết về khái niệm và nút **"Bắt đầu ôn ngay"**.
6. Người dùng nhấn **"Bắt đầu ôn ngay"**; hệ thống chuyển đến FS-01 với khái niệm được chọn.

### Alternative Flows

**Alternative Flow 1: Chuyển đổi chế độ xem lịch**

1. Từ bước 2 của Basic Flow, Người dùng nhấn vào nút chuyển đổi **"Tháng"** / **"Tuần"** / **"Ngày"**.
2. Hệ thống cập nhật giao diện lịch theo chế độ xem Người dùng chọn và giữ nguyên ngày đang xem.

**Alternative Flow 2: Không có deadline sắp tới**

1. Từ bước 4 của Basic Flow, Scheduling Engine xác nhận không có khái niệm nào có deadline trong tuần tới.
2. Hệ thống hiển thị thông báo: *"Không có deadline ôn tập nào sắp tới. Tiếp tục duy trì streak học tập nhé!"*

**Alternative Flow 3: Xem lịch ôn tập liên kết với DB-04 (Nhắc nhở)**

1. Từ bước 3 của Basic Flow, Người dùng thấy một ngày có thông báo nhắc nhở đặc biệt từ DB-04.
2. Hệ thống hiển thị icon thông báo trên ngày đó; Người dùng nhấn để xem nội dung nhắc nhở chi tiết.

### Post-conditions

- Người dùng đã xem tổng quan lịch học tập và các deadline sắp tới.
- Người dùng có thể chủ động lên kế hoạch học tập dựa trên thông tin lịch đã xem.
- Không có thay đổi dữ liệu (chỉ đọc), trừ khi Người dùng chuyển sang phiên học.
