# INTERVIEW FINDINGS - User Stories – Recall AI
> **Phiên bản:** 1.0  
> **Ngày tạo:** 04/07/2026  
> **Trạng thái:** Draft  
> **Nguồn dữ liệu:** Kết quả phỏng vấn 5 người dùng

---

## Mục lục

- [1. Ghi chú](#1-ghi-chú)
- [2. Đặc điểm ứng viên](#2-đặc-điểm-ứng-viên)
- [3. Các Modules chính](#3-các-modules-chính)
   - [3.1. Module: Auth – Xác thực & Tài khoản](#31-module-auth--xác-thực--tài-khoản)
   - [3.2. Module: AI Planning – Lập kế hoạch học tập bằng AI](#32-module-ai-planning--lập-kế-hoạch-học-tập-bằng-ai)
   - [3.3. Module: Focus Session – Phiên tập trung](#33-module-focus-session--phiên-tập-trung)
   - [3.4. Module: Verify – Kiểm chứng kiến thức](#34-module-verify--kiểm-chứng-kiến-thức)
   - [3.5. Module: Dashboard – Tổng quan tiến độ](#35-module-dashboard--tổng-quan-tiến-độ)
- [4. Tổng hợp danh sách User Stories](#4-tổng-hợp-danh-sách-user-stories)
- [5. Những điểm cần lưu ý từ phỏng vấn (Constraints & Insights)](#5-những-điểm-cần-lưu-ý-từ-phỏng-vấn-constraints--insights)

---

## 1. Ghi chú

Mỗi user story được viết theo định dạng chuẩn:
> **"As a [user], I want [feature] so that [benefit]."**

Mức độ ưu tiên được xác định dựa trên tần suất đề cập và mức đánh giá từ 5 người dùng phỏng vấn:
- **Cao (High)** – Đa số người dùng đánh giá là tính năng quan trọng nhất.
- **Trung bình (Medium)** – Một số người dùng đề cập, hữu ích nhưng không thiết yếu.
- **Thấp (Low)** – Ít được đề cập hoặc chỉ là nice-to-have.

**Chú thích**  
| Thuật ngữ | Giải thích |
| --- | --- |
| **US** | User story - suy nghĩ của người dùng về tính năng |
| **AC** | Acceptance Criteria - tiêu chí chấp nhận |
| **Task** | Nhiệm vụ - có thể là các nội dung bài học / khái niệm mà người dùng cần học |
---
## 2. Đặc điểm ứng viên

| Thuộc tính | Mô tả |
|---|---|
| **Tên gọi** | Sinh viên |
| **Nhóm tuổi** | 18–22 |
| **Bối cảnh** | Sinh viên năm 1–2 các ngành |
| **Đặc điểm** | Có khối lượng lý thuyết, bài học lớn, dễ học vẹt, thiếu phương pháp tự kiểm tra |
| **Mục tiêu** | Nắm vững kiến thức, không chỉ "đọc qua" tài liệu |
| **Nỗi lo** | Không biết mình có thực sự hiểu hay chỉ "quen mặt chữ", không có phương pháp quản lý tốt |

---

## 3. Các Modules chính

### 3.1. Module: Auth – Xác thực & Tài khoản

> **Bối cảnh từ phỏng vấn:** Tất cả người dùng đều cần một không gian cá nhân để lưu kế hoạch, lịch sử phiên học và kết quả kiểm chứng. Sự riêng tư được đề cập mạnh mẽ – không muốn AI can thiệp vào đời tư.

---

#### **3.1.1. US-AUTH-01 – Đăng ký tài khoản**

| Trường | Nội dung |
|---|---|
| **ID** | US-AUTH-01 |
| **User Story** | Là một sinh viên mới, tôi muốn đăng ký tài khoản bằng email và mật khẩu để tôi có thể lưu trữ kế hoạch học tập và lịch sử phiên học một cách an toàn. |
| **Ưu tiên** | Cao |
| **Nguồn phỏng vấn** | Tất cả 5 người dùng (ngầm định – cần tài khoản để lưu dữ liệu cá nhân) |

**Tiêu chí chấp nhận (Acceptance Criteria):**
- [ ] AC1: Người dùng có thể nhập email, mật khẩu và xác nhận mật khẩu.
- [ ] AC2: Hệ thống kiểm tra email hợp lệ và mật khẩu đủ mạnh (tối thiểu 8 ký tự).
- [ ] AC3: Hiển thị thông báo lỗi rõ ràng nếu email đã tồn tại.
- [ ] AC4: Sau khi đăng ký thành công, hệ thống tự động đăng nhập và chuyển đến Dashboard.

---

#### **3.1.2. US-AUTH-02 – Đăng nhập tài khoản**

| Trường | Nội dung |
|---|---|
| **ID** | US-AUTH-02 |
| **User Story** | Là người dùng đã có tài khoản, tôi muốn đăng nhập bằng email và mật khẩu để truy cập dữ liệu học tập cá nhân và tiếp tục từ nơi tôi đã dừng lại. |
| **Ưu tiên** | Cao |
| **Nguồn phỏng vấn** | Tất cả 5 người dùng |

**Tiêu chí chấp nhận:**
- [ ] AC1: Người dùng có thể đăng nhập bằng email và mật khẩu đã đăng ký.
- [ ] AC2: Hiển thị thông báo lỗi nếu email không tồn tại hoặc mật khẩu sai.
- [ ] AC3: Tùy chọn "Ghi nhớ đăng nhập" để không cần xác thực lại mỗi lần truy cập.
- [ ] AC4: Sau khi đăng nhập thành công, hệ thống chuyển hướng đến Dashboard.

---

#### **3.1.3. US-AUTH-03 – Đăng xuất tài khoản**

| Trường | Nội dung |
|---|---|
| **ID** | US-AUTH-03 |
| **User Story** | Là người dùng đã đăng nhập, tôi muốn đăng xuất khỏi tài khoản để dữ liệu cá nhân của tôi được bảo mật khi sử dụng thiết bị chung. |
| **Ưu tiên** | Trung bình |
| **Nguồn phỏng vấn** | Phạm Chí Tâm, Nguyễn Phi Hùng (đề cập quyền riêng tư) |

**Tiêu chí chấp nhận:**
- [ ] AC1: Người dùng có thể nhấn nút "Đăng xuất" từ bất kỳ trang nào trong ứng dụng.
- [ ] AC2: Sau khi đăng xuất, session bị hủy và người dùng được chuyển về trang đăng nhập hoặc Landing Page.
- [ ] AC3: Không thể truy cập các trang yêu cầu xác thực sau khi đăng xuất.

---

#### **3.1.4. US-AUTH-04 – Quản lý hồ sơ cá nhân**

| Trường | Nội dung |
|---|---|
| **ID** | US-AUTH-04 |
| **User Story** | Là người dùng, tôi muốn xem và cập nhật thông tin hồ sơ cá nhân để tài khoản phản ánh đúng thông tin hiện tại của tôi. |
| **Ưu tiên** | Thấp |
| **Nguồn phỏng vấn** | Ngầm định từ cấu trúc hệ thống |

**Tiêu chí chấp nhận:**
- [ ] AC1: Người dùng có thể xem tên, email trong trang hồ sơ.
- [ ] AC2: Người dùng có thể thay đổi mật khẩu sau khi xác nhận mật khẩu cũ.

---

### 3.2. Module: AI Planning – Lập kế hoạch học tập bằng AI

> **Bối cảnh từ phỏng vấn:** Đây là tính năng được **đánh giá cao nhất** bởi 4/5 người dùng (Tạ Minh Đạt, Ngô Văn Phong, Nguyễn Minh Phát xếp thứ 1; Nguyễn Phi Hùng xếp thứ 2). Người dùng gặp khó khăn khi không biết bắt đầu từ đâu với các bài tập phức tạp, thường làm theo cảm tính. Họ muốn AI phân tích tài liệu và tạo ra cấu trúc rõ ràng, linh hoạt – **không ép buộc chi tiết từng phút** (Nguyễn Phi Hùng). Nguyễn Minh Phát đề xuất hiển thị **trực quan dạng cây/hộp** thay vì văn bản thuần.

---

#### **3.2.1. US-PLAN-01 – Tạo kế hoạch học tập từ tài liệu**

| Trường | Nội dung |
|---|---|
| **ID** | US-PLAN-01 |
| **User Story** | Là sinh viên, tôi muốn tải lên tài liệu học tập (văn bản, file hoặc hình ảnh) và để AI tạo ra danh sách task có cấu trúc để tôi biết chính xác bắt đầu từ đâu và làm gì tiếp theo. |
| **Ưu tiên** | Cao |
| **Nguồn phỏng vấn** | Tạ Minh Đạt, Ngô Văn Phong, Nguyễn Minh Phát, Nguyễn Phi Hùng |

**Tiêu chí chấp nhận:**
- [ ] AC1: Người dùng có thể nhập văn bản hoặc tải lên file ảnh/tài liệu.
- [ ] AC2: AI phân tích nội dung và trả về danh sách các task (khái niệm) và xác định **quan hệ tiên quyết** giữa chúng để tạo thành một đồ thị.
- [ ] AC3: Kết quả hiển thị dưới dạng trực quan (**dạng sơ đồ cây / hộp phân cấp**), không chỉ là văn bản thuần (theo đề xuất của Nguyễn Minh Phát).
- [ ] AC4: Mỗi task có tên rõ ràng, mô tả ngắn và thứ tự đề xuất thực hiện.
- [ ] AC5: Quá trình phân tích AI hoàn thành trong vòng [10 giây].

---

#### **3.2.2. US-PLAN-02 – Chỉnh sửa kế hoạch do AI tạo ra**

| Trường | Nội dung |
|---|---|
| **ID** | US-PLAN-02 |
| **User Story** | Là sinh viên, tôi muốn chỉnh sửa, sắp xếp lại hoặc xóa các task trong kế hoạch AI tạo ra để kế hoạch phù hợp với lịch thực tế và sở thích của tôi. |
| **Ưu tiên** | Cao |
| **Nguồn phỏng vấn** | Nguyễn Phi Hùng (kế hoạch cần linh hoạt, không ép buộc), Nguyễn Minh Phát |

**Tiêu chí chấp nhận:**
- [ ] AC1: Người dùng có thể thêm, xóa, hoặc đổi tên task bất kỳ.
- [ ] AC2: Người dùng có thể kéo thả để sắp xếp lại thứ tự các task.
- [ ] AC3: Thay đổi được lưu tự động sau mỗi hành động chỉnh sửa.

---

#### **3.2.3. US-PLAN-03 – Đánh dấu hoàn thành task**

| Trường | Nội dung |
|---|---|
| **ID** | US-PLAN-03 |
| **User Story** | Là sinh viên, tôi muốn đánh dấu task là đã hoàn thành để theo dõi tiến độ học tập và cảm nhận được sự tiến bộ của bản thân. |
| **Ưu tiên** | Cao |
| **Nguồn phỏng vấn** | Ngô Văn Phong (đang dùng app To-do), Phạm Chí Tâm |

**Tiêu chí chấp nhận:**
- [ ] AC1: Người dùng có thể click để đánh dấu hoàn thành từng task.
- [ ] AC2: Task đã hoàn thành hiển thị trạng thái khác biệt rõ ràng (ví dụ: gạch ngang, màu mờ,...).
- [ ] AC3: Tiến độ hoàn thành tổng thể được cập nhật và hiển thị ngay lập tức.
- [ ] AC4: Người dùng có thể bỏ đánh dấu hoàn thành nếu cần xem lại.

---

#### **3.2.4. US-PLAN-04 – Xem lại lịch sử kế hoạch đã tạo**

| Trường | Nội dung |
|---|---|
| **ID** | US-PLAN-04 |
| **User Story** | Là sinh viên, tôi muốn xem lại các kế hoạch học tập đã tạo trước đây để có thể quay lại hoặc tiếp tục các task cũ mà không mất lịch sử làm việc. |
| **Ưu tiên** | Trung bình |
| **Nguồn phỏng vấn** | Nguyễn Minh Phát (hay bị trôi lịch sử chat khi dùng ChatGPT) |

**Tiêu chí chấp nhận:**
- [ ] AC1: Danh sách tất cả kế hoạch đã tạo được hiển thị theo thứ tự thời gian (mới nhất trước).
- [ ] AC2: Người dùng có thể mở lại kế hoạch cũ để xem toàn bộ chi tiết.
- [ ] AC3: Người dùng có thể xóa kế hoạch không còn cần thiết.

---

#### **3.2.5. US-PLAN-05 – Ưu tiên task theo deadline**

| Trường | Nội dung |
|---|---|
| **ID** | US-PLAN-05 |
| **User Story** | Là sinh viên có nhiều bài tập cùng lúc, tôi muốn AI gợi ý thứ tự ưu tiên các task dựa trên deadline và độ khó để tôi tập trung vào việc cấp bách hoặc phù hợp với năng lực hiện tại. |
| **Ưu tiên** | Cao |
| **Nguồn phỏng vấn** | Phạm Chí Tâm (ưu tiên bài dễ/deadline gần), Nguyễn Minh Phát (ưu tiên task khó/deadline gần) |

**Tiêu chí chấp nhận:**
- [ ] AC1: Người dùng có thể nhập/chọn deadline và AI tự động ước lượng độ khó cho từng task.
- [ ] AC2: AI cho phép sắp xếp thứ tự task theo độ cấp bách của deadline hoặc theo độ khó.
- [ ] AC3: Hiển thị nhãn cảnh báo cho task sắp đến hạn (ví dụ: còn dưới 24h, còn 3 ngày).

---

### 3.3. Module: Focus Session – Phiên tập trung

> **Bối cảnh từ phỏng vấn:** Tính năng này có ý kiến **chia rẽ** nhất. Ngô Văn Phong xếp thứ 2 (rất cần), nhưng Tạ Minh Đạt, Phạm Chí Tâm, và Nguyễn Minh Phát cho rằng không cần thiết vì mỗi người có nhịp học riêng. Nguyễn Phi Hùng đề xuất thêm tính năng **ghi chú thời điểm xao nhãng** trong phiên để AI sử dụng dữ liệu đó để kiểm chứng sau. Tất cả đều thích môi trường yên tĩnh, tối giản và một số muốn công cụ có khả năng **ràng buộc mạnh** (khóa app).

---

#### **3.3.1. US-FOCUS-01 – Bắt đầu phiên tập trung (Pomodoro)**

| Trường | Nội dung |
|---|---|
| **ID** | US-FOCUS-01 |
| **User Story** | Là sinh viên hay bị xao nhãng, tôi muốn bắt đầu một phiên học có giới hạn thời gian để làm việc theo các khoảng thời gian có cấu trúc và tránh mất quá nhiều thời gian vào mạng xã hội. |
| **Ưu tiên** | Trung bình |
| **Nguồn phỏng vấn** | Ngô Văn Phong (rất cần), Nguyễn Phi Hùng (hữu ích nhưng cần linh hoạt) |

**Tiêu chí chấp nhận:**
- [ ] AC1: Người dùng có thể chọn thời lượng phiên học (mặc định 25 phút) và thời gian nghỉ (mặc định 5 phút).
- [ ] AC2: Đồng hồ đếm ngược hiển thị rõ ràng thời gian còn lại.
- [ ] AC3: Người dùng có thể tạm dừng (Pause) và tiếp tục (Resume) phiên học.
- [ ] AC4: Khi hết giờ, hệ thống phát thông báo âm thanh/hiển thị để báo hiệu.
- [ ] AC5: Người dùng có thể tùy chỉnh độ dài phiên học và nghỉ giải lao.

---

#### **3.3.2. US-FOCUS-02 – Ghi chú thời điểm xao nhãng trong phiên**

| Trường | Nội dung |
|---|---|
| **ID** | US-FOCUS-02 |
| **User Story** | Là sinh viên, tôi muốn ghi lại những khoảnh khắc tôi bị xao nhãng trong phiên học để AI có thể dùng dữ liệu đó để kiểm tra tôi đúng vào phần nội dung tôi đã bỏ lỡ. |
| **Ưu tiên** | Trung bình |
| **Nguồn phỏng vấn** | Nguyễn Phi Hùng (đề xuất trực tiếp tính năng này) |

**Tiêu chí chấp nhận:**
- [ ] AC1: Trong phiên đang chạy, người dùng có thể nhấn nút "Ghi chú xao nhãng" với một click.
- [ ] AC2: Hệ thống tự động ghi lại timestamp và cho phép người dùng thêm ghi chú ngắn (tùy chọn).
- [ ] AC3: Danh sách các mốc xao nhãng được lưu lại và hiển thị sau khi phiên kết thúc.
- [ ] AC4: Dữ liệu xao nhãng được truyền sang module Verify để AI ưu tiên kiểm tra phần nội dung đó.

---

#### **3.3.3. US-FOCUS-03 – Xem tóm tắt sau phiên học**

| Trường | Nội dung |
|---|---|
| **ID** | US-FOCUS-03 |
| **User Story** | Là sinh viên, tôi muốn xem tóm tắt phiên học sau khi kết thúc để nhìn lại hiệu suất học tập và quyết định có muốn bắt đầu phiên kiểm chứng không. |
| **Ưu tiên** | Trung bình |
| **Nguồn phỏng vấn** | Ngô Văn Phong, Nguyễn Phi Hùng |

**Tiêu chí chấp nhận:**
- [ ] AC1: Sau khi phiên kết thúc, hiển thị màn hình tóm tắt gồm: tổng thời gian học, số lần tạm dừng, số lần xao nhãng được ghi.
- [ ] AC2: Có nút chuyển nhanh sang module Verify để kiểm chứng kiến thức ngay.
- [ ] AC3: Dữ liệu phiên học được lưu vào lịch sử để hiển thị trên Dashboard.

---

#### **3.3.4. US-FOCUS-04 – Liên kết phiên học với task trong kế hoạch**

| Trường | Nội dung |
|---|---|
| **ID** | US-FOCUS-04 |
| **User Story** | Là sinh viên, tôi muốn liên kết một phiên học với một task cụ thể trong kế hoạch của tôi để việc theo dõi thời gian được gắn với chủ đề học tập thực tế. |
| **Ưu tiên** | Thấp |
| **Nguồn phỏng vấn** | Ngô Văn Phong (cần công cụ hướng dẫn và kiểm tra kết quả) |

**Tiêu chí chấp nhận:**
- [ ] AC1: Trước khi bắt đầu phiên, người dùng có thể chọn task liên quan từ kế hoạch hiện tại (tùy chọn).
- [ ] AC2: Thời gian của phiên học được tính vào tổng thời gian đã học của task đó.
- [ ] AC3: Nếu không chọn task, phiên vẫn chạy bình thường như phiên độc lập.

---

### 3.4. Module: Verify – Kiểm chứng kiến thức

> **Bối cảnh từ phỏng vấn:** Đây là tính năng **độc đáo nhất** của ứng dụng và được tất cả 5 người dùng đánh giá cao. Tạ Minh Đạt so sánh nó với vai trò của "người giáo viên lấp đầy lỗ hổng kiến thức". Phạm Chí Tâm ưa thích AI **chỉ ra trực tiếp lỗi sai** hoặc đặt câu hỏi mở rộng. Nguyễn Phi Hùng yêu cầu câu hỏi phải **cốt lõi, đi thẳng vào vấn đề** – không hỏi chung chung như "bạn có hiểu không?". Ngô Văn Phong muốn AI có thể **kiểm tra đáp án** chính xác để khỏi phải tra cứu nhiều nguồn.

---

#### **3.4.1. US-VERIFY-01 – Bắt đầu phiên kiểm chứng kiến thức với AI**

| Trường | Nội dung |
|---|---|
| **ID** | US-VERIFY-01 |
| **User Story** | Là sinh viên vừa học xong, tôi muốn bắt đầu phiên vấn đáp do AI dẫn dắt về chủ đề vừa học để xác nhận mức độ hiểu bài và tìm ra lỗ hổng kiến thức trước khi chuyển sang bài tiếp theo. |
| **Ưu tiên** | Cao |
| **Nguồn phỏng vấn** | Tất cả 5 người dùng |

**Tiêu chí chấp nhận:**
- [ ] AC1: Người dùng có thể nhập chủ đề hoặc nội dung vừa học để bắt đầu phiên.
- [ ] AC2: AI đặt câu hỏi theo từng lượt, mỗi lượt chờ người dùng trả lời trước khi đặt câu tiếp.
- [ ] AC3: Câu hỏi tập trung vào kiến thức cốt lõi, không hỏi chung chung.
- [ ] AC4: Người dùng nhận được phản hồi ngay sau mỗi câu trả lời (đúng/sai/gợi ý).
- [ ] AC5: Phiên kiểm chứng có thể dừng bất kỳ lúc nào.
- [ ] AC6: Phiên vấn đáp có **giới hạn tối đa số lượt hỏi-đáp cho mỗi khái niệm** (ví dụ 3 lượt) để kiểm soát thời gian và đảm bảo AI không hỏi lan man.

---

#### **3.4.2. US-VERIFY-02 – AI chỉ ra lỗi sai và giải thích cụ thể**

| Trường | Nội dung |
|---|---|
| **ID** | US-VERIFY-02 |
| **User Story** | Là sinh viên, tôi muốn AI chỉ ra trực tiếp lỗi sai của tôi và giải thích tại sao sai để tôi có thể sửa ngay mà không cần đoán mò. |
| **Ưu tiên** | Cao |
| **Nguồn phỏng vấn** | Phạm Chí Tâm (AI chỉ ra trực tiếp lỗi), Tạ Minh Đạt (lấp đầy lỗ hổng) |

**Tiêu chí chấp nhận:**
- [ ] AC1: Khi câu trả lời sai, AI phải giải thích cụ thể điểm nào sai và tại sao.
- [ ] AC2: AI cung cấp đáp án đúng kèm giải thích rõ ràng, không mơ hồ.
- [ ] AC3: AI có thể đặt thêm câu hỏi mở rộng (follow-up) nếu câu trả lời chỉ đúng một phần.
- [ ] AC4: Người dùng có thể yêu cầu giải thích thêm nếu chưa hiểu.

---

#### **3.4.3. US-VERIFY-03 – Tóm tắt kết quả sau phiên kiểm chứng**

| Trường | Nội dung |
|---|---|
| **ID** | US-VERIFY-03 |
| **User Story** | Là sinh viên, tôi muốn xem tóm tắt kết quả sau phiên kiểm chứng để biết chủ đề nào tôi cần ôn tập thêm. |
| **Ưu tiên** | Cao |
| **Nguồn phỏng vấn** | Phạm Chí Tâm (nhớ bài lâu hơn), Nguyễn Phi Hùng (tổng hợp ý chính nhanh) |

**Tiêu chí chấp nhận:**
- [ ] AC1: Sau phiên, hiển thị tóm tắt gồm: tổng số câu hỏi, số câu đúng/sai, tỷ lệ %.
- [ ] AC2: Liệt kê các chủ đề/điểm kiến thức mà người dùng trả lời sai.
- [ ] AC3: Đề xuất hành động tiếp theo: ôn lại phần yếu, hoặc chuyển sang task tiếp theo.
- [ ] AC4: Kết quả được lưu vào hệ thống để hiển thị trên Dashboard.

---

#### **3.4.4. US-VERIFY-04 – Kiểm chứng tập trung vào phần bị xao nhãng**

| Trường | Nội dung |
|---|---|
| **ID** | US-VERIFY-04 |
| **User Story** | Là sinh viên, tôi muốn AI ưu tiên đặt câu hỏi về phần nội dung mà tôi bị xao nhãng trong lúc học để tôi không bỏ lỡ kiến thức quan trọng từ những khoảnh khắc không tập trung. |
| **Ưu tiên** | Trung bình |
| **Nguồn phỏng vấn** | Nguyễn Phi Hùng (đề xuất tích hợp dữ liệu xao nhãng từ Focus Session) |

**Tiêu chí chấp nhận:**
- [ ] AC1: Khi bắt đầu phiên Verify sau Focus Session, AI nhận dữ liệu xao nhãng từ phiên trước.
- [ ] AC2: AI ưu tiên đặt câu hỏi về nội dung tại các mốc thời gian bị xao nhãng.
- [ ] AC3: Tính năng này chỉ kích hoạt khi có dữ liệu xao nhãng; nếu không, Verify hoạt động bình thường.

---

#### **3.4.5. US-VERIFY-05 – Lựa chọn chủ đề kiểm chứng thủ công**

| Trường | Nội dung |
|---|---|
| **ID** | US-VERIFY-05 |
| **User Story** | Là sinh viên đang chuẩn bị thi, tôi muốn chọn thủ công một chủ đề hoặc task để kiểm chứng để tôi có thể tập trung vào đúng phần yếu mà tôi muốn củng cố. |
| **Ưu tiên** | Trung bình |
| **Nguồn phỏng vấn** | Nguyễn Phi Hùng (hiếm khi ôn trừ khi thi), Phạm Chí Tâm |

**Tiêu chí chấp nhận:**
- [ ] AC1: Người dùng có thể chọn chủ đề/task bất kỳ từ kế hoạch để bắt đầu phiên Verify độc lập.
- [ ] AC2: Người dùng có thể nhập văn bản tự do để bắt đầu Verify mà không cần có kế hoạch từ trước.
- [ ] AC3: Phiên Verify độc lập hoạt động đầy đủ như phiên Verify thông thường.

---

#### **3.4.6. US-VERIFY-06 – AI phát hiện và lấp lỗ hổng kiến thức nền tảng**

| Trường | Nội dung |
|---|---|
| **ID** | US-VERIFY-06 |
| **User Story** | Là sinh viên, khi tôi không hiểu bài, tôi muốn AI đóng vai trò như một giáo viên phát hiện ra lỗ hổng kiến thức nền tảng của tôi và hướng dẫn ôn lại phần đó, để tôi hiểu sâu bản chất thay vì bị hổng kiến thức rời rạc. |
| **Ưu tiên** | Cao |
| **Nguồn phỏng vấn** | Tạ Minh Đạt ("giáo viên lấp đầy lỗ hổng kiến thức"), Nguyễn Minh Phát ("tránh kiến thức rời rạc, mau quên") |

**Tiêu chí chấp nhận:**
- [ ] AC1: Khi người dùng trả lời sai một khái niệm, AI không chỉ sửa lỗi mà còn phân tích xem người dùng có bị hổng kiến thức nền tảng (khái niệm tiên quyết) hay không.
- [ ] AC2: Hệ thống tự động đề xuất và chèn khái niệm nền tảng bị hổng đó vào danh sách ưu tiên ôn tập ở phiên tiếp theo.
- [ ] AC3: Hiển thị thông báo giải thích lý do hệ thống khuyên nên ôn lại kiến thức nền tảng đó.

---

### 3.5. Module: Dashboard – Tổng quan tiến độ

> **Bối cảnh từ phỏng vấn:** Người dùng muốn thấy được mình đang tiến bộ ở đâu. Ngô Văn Phong nhận ra ứng dụng hiện tại không kiểm soát được **chất lượng** hoàn thành, chỉ là tick lừa app. Phạm Chí Tâm muốn AI **không theo dõi sinh hoạt đời tư** – Dashboard chỉ nên tập trung vào **học tập**. Nguyễn Minh Phát muốn giao diện **tối giản, trực quan** với màu tối.

---

#### **3.5.1. US-DASH-01 – Xem tổng quan tiến độ học tập**

| Trường | Nội dung |
|---|---|
| **ID** | US-DASH-01 |
| **User Story** | Là sinh viên, tôi muốn xem tổng quan tiến độ học tập trên Dashboard để tôi nhanh chóng hiểu mình đã hoàn thành bao nhiêu và còn bao nhiêu việc chưa làm. |
| **Ưu tiên** | Cao |
| **Nguồn phỏng vấn** | Ngô Văn Phong (cần kiểm soát chất lượng), Nguyễn Minh Phát (theo dõi thực lực) |

**Tiêu chí chấp nhận:**
- [ ] AC1: Dashboard hiển thị số task đã hoàn thành / tổng số task theo từng kế hoạch.
- [ ] AC2: Hiển thị tỷ lệ phần trăm hoàn thành tổng thể dưới dạng biểu đồ trực quan (ví dụ: progress bar, donut chart).
- [ ] AC3: Dashboard tải trong vòng 2 giây khi người dùng đăng nhập.
- [ ] AC4: Giao diện tối giản, ưu tiên màu tối (dark mode), dễ đọc.

---

#### **3.5.2. US-DASH-02 – Xem điểm mạnh/yếu theo chủ đề**

| Trường | Nội dung |
|---|---|
| **ID** | US-DASH-02 |
| **User Story** | Là sinh viên, tôi muốn xem mình đang mạnh hoặc yếu ở chủ đề nào dựa trên kết quả các phiên kiểm chứng để tôi ưu tiên thời gian học còn lại một cách hiệu quả. |
| **Ưu tiên** | Cao |
| **Nguồn phỏng vấn** | Phạm Chí Tâm (review giúp nhớ lâu hơn), Nguyễn Minh Phát (theo dõi thực lực) |

**Tiêu chí chấp nhận:**
- [ ] AC1: Liệt kê các chủ đề đã được kiểm chứng kèm điểm số trung bình.
- [ ] AC2: Phân loại rõ ràng: chủ đề "Mạnh" [(≥ 80% đúng)], "Trung bình" [(50–79%)], "Yếu" [(< 50%)].
- [ ] AC3: Hiển thị biểu đồ trực quan bằng **sơ đồ đồ thị khái niệm**, trong đó mỗi khái niệm (node) được **tô màu theo mức độ vững/yếu** (mastery score).
- [ ] AC4: Gợi ý các chủ đề yếu cần ôn tập thêm.

---

#### **3.5.3. US-DASH-03 – Xem lịch sử phiên học và phiên kiểm chứng**

| Trường | Nội dung |
|---|---|
| **ID** | US-DASH-03 |
| **User Story** | Là sinh viên, tôi muốn xem lịch sử các phiên học và phiên kiểm chứng theo thời gian để theo dõi thói quen học tập của mình. |
| **Ưu tiên** | Trung bình |
| **Nguồn phỏng vấn** | Nguyễn Phi Hùng, Ngô Văn Phong |

**Tiêu chí chấp nhận:**
- [ ] AC1: Hiển thị danh sách lịch sử phiên học (Focus Sessions) với: ngày giờ, thời lượng, task liên quan (nếu có).
- [ ] AC2: Hiển thị danh sách lịch sử phiên kiểm chứng (Verify Sessions) với: chủ đề, điểm số, ngày thực hiện.
- [ ] AC3: Lọc lịch sử theo khoảng thời gian (7 ngày, 30 ngày, tất cả).

---

#### **3.5.4. US-DASH-04 – Xem thống kê tổng thời gian học**

| Trường | Nội dung |
|---|---|
| **ID** | US-DASH-04 |
| **User Story** | Là sinh viên, tôi muốn xem tổng thời gian học mỗi tuần để hiểu thói quen học tập và điều chỉnh nếu cần. |
| **Ưu tiên** | Trung bình |
| **Nguồn phỏng vấn** | Ngô Văn Phong (cần công cụ kiểm tra kết quả), Nguyễn Phi Hùng |

**Tiêu chí chấp nhận:**
- [ ] AC1: Hiển thị tổng thời gian học trong tuần hiện tại dưới dạng số và biểu đồ theo ngày.
- [ ] AC2: So sánh với tuần trước để thấy xu hướng tăng/giảm.
- [ ] AC3: Dữ liệu chỉ dựa trên thời gian Focus Session đã hoàn thành, không tính thời gian tạm dừng.

---

## 4. Tổng hợp danh sách User Stories

| ID | Module | Mô tả ngắn | Ưu tiên |
|---|---|---|---|
| US-AUTH-01 | Auth | Đăng ký tài khoản | Cao |
| US-AUTH-02 | Auth | Đăng nhập tài khoản | Cao |
| US-AUTH-03 | Auth | Đăng xuất tài khoản | Trung bình |
| US-AUTH-04 | Auth | Quản lý hồ sơ cá nhân | Thấp |
| US-PLAN-01 | AI Planning | Tạo kế hoạch từ tài liệu | Cao |
| US-PLAN-02 | AI Planning | Chỉnh sửa kế hoạch | Cao |
| US-PLAN-03 | AI Planning | Đánh dấu hoàn thành task | Cao |
| US-PLAN-04 | AI Planning | Xem lịch sử kế hoạch | Trung bình |
| US-PLAN-05 | AI Planning | Ưu tiên task theo deadline | Cao |
| US-FOCUS-01 | Focus Session | Bắt đầu phiên Pomodoro | Trung bình |
| US-FOCUS-02 | Focus Session | Ghi chú thời điểm xao nhãng | Trung bình |
| US-FOCUS-03 | Focus Session | Tóm tắt sau phiên học | Trung bình |
| US-FOCUS-04 | Focus Session | Liên kết phiên học với task | Thấp |
| US-VERIFY-01 | Verify | Bắt đầu phiên vấn đáp AI | Cao |
| US-VERIFY-02 | Verify | AI chỉ ra lỗi sai cụ thể | Cao |
| US-VERIFY-03 | Verify | Tóm tắt kết quả kiểm chứng | Cao |
| US-VERIFY-04 | Verify | Kiểm chứng phần bị xao nhãng | Trung bình |
| US-VERIFY-05 | Verify | Chọn chủ đề kiểm chứng thủ công | Trung bình |
| US-VERIFY-06 | Verify | Phát hiện lỗ hổng kiến thức nền | Cao |
| US-DASH-01 | Dashboard | Tổng quan tiến độ học tập | Cao |
| US-DASH-02 | Dashboard | Điểm mạnh/yếu theo chủ đề | Cao |
| US-DASH-03 | Dashboard | Lịch sử phiên học & kiểm chứng | Trung bình |
| US-DASH-04 | Dashboard | Thống kê tổng thời gian học | Trung bình |

**Tổng cộng: 23 User Stories** | 12 Cao · 9 Trung bình · 2 Thấp

---

## 5. Những điểm cần lưu ý từ phỏng vấn (Constraints & Insights)

### Ràng buộc về AI (AI Constraints) - Quan trọng nhất!
- **Neo chặt tài liệu gốc:** tránh được điểm mà Chatgpt và Gemini mắc phải là hay bịa thông tin.
- **AI Examiner không được tự sáng tác:**: toàn bộ câu hỏi và đáp án phải dựa 100% vào tài liệu sinh viên đã tải lên.
- **Giới hạn bối cảnh (Context Constraint)**: AI thường "quên yêu cầu gốc nếu chat quá dài", nên phiên Verify bắt buộc phải giới hạn số lượt hỏi-đáp (vd: tối đa 3 lượt / khái niệm) để đảm bảo chất lượng phản hồi và kiểm soát chi phí API .

### Ràng buộc về Kỹ thuật & Luồng người dùng (System Constraints)
- **Yếu tố Human-in-the-loop**: vì AI có thể trích xuất sai các khái niệm, nên bước **Người dùng xác nhận/chỉnh sửa Đồ thị** ở giai đoạn Lập kế hoạch là bắt buộc, không được bỏ qua.

### Thiết kế cần chú ý
- **Kế hoạch phải linh hoạt**: không ép buộc thực hiện từng phút – tránh biến người dùng thành "robot".
- **Giao diện phải trực quan**: Hiển thị dạng cây/thẻ thay vì văn bản thuần túy.
- **Câu hỏi Verify phải cốt lõi**: Không hỏi chung chung như "bạn có hiểu không?".
