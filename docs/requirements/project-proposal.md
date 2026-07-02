# ĐỀ XUẤT DỰ ÁN: PLANNING AI - PLAN / FOCUS / VERIFY

> **Trạng thái:** BẢN NHÁP - Chờ convert interview xong
> **Phiên bản:** 1.5
> **Ngày soạn:** 2026-06-19
> **Người soạn:** PM
> **Môn học:** Nhập môn Công nghệ Phần mềm (24C07)
> **Bài tập:** PA0 - Đăng ký nhóm và Thiết lập công cụ
> **Hạn chót:** 25/6/2026

---

## Mục lục

1. [Thông tin nhóm](#1-thông-tin-nhóm)
2. [Giới thiệu dự án](#2-giới-thiệu-dự-án)
3. [Người dùng mục tiêu và Môi trường hoạt động](#3-người-dùng-mục-tiêu-và-môi-trường-hoạt-động)
4. [Các tính năng chính](#4-các-tính-năng-chính)
5. [Phỏng vấn người dùng](#5-phỏng-vấn-người-dùng)
6. [Danh sách màn hình dự kiến](#6-danh-sách-màn-hình-dự-kiến-quy-mô-hệ-thống-mvp)
7. [Công nghệ đề xuất (Tech Stack)](#7-công-nghệ-đề-xuất-tech-stack)
8. [Phân công vai trò và Trách nhiệm](#8-phân-công-vai-trò-và-trách-nhiệm)
9. [Kế hoạch thực hiện (Project Schedule)](#9-kế-hoạch-thực-hiện-project-schedule)
10. [Phân tích rủi ro](#10-phân-tích-rủi-ro)
11. [Giá trị kỳ vọng và Định hướng MVP](#11-giá-trị-kỳ-vọng-và-định-hướng-mvp)

---

## 1. Thông tin nhóm

- **Tên nhóm:** CAGT
- **Số lượng thành viên:** 5

| STT | Họ và Tên             | Vai trò chính    | Vai trò phụ         |
| --- | --------------------- | ---------------- | ------------------- |
| 1   | Thái Nguyễn Tuấn Kiệt | Project Manager  | UI/UX Designer      |
| 2   | Nguyễn Thế Quân       | System Architect | Fullstack Developer |
| 3   | Nguyễn Minh Phát      | QA/Tester        | Fullstack Developer |
| 4   | Nguyễn Phương Gia Bảo | Frontend Leader  | -                   |
| 5   | Ngô Văn Phong         | Backend Leader   | -                   |

---

## 2. Giới thiệu dự án

### 2.1. Khái quát ý tưởng

Planning AI là một nền tảng web hỗ trợ người dùng chuyển đổi từ **ý định sang hành động** thông qua quy trình ba bước:

- **Plan (Lập kế hoạch):** AI phân tích thông tin đầu vào và tạo kế hoạch hành động có cấu trúc. Đồng thời phân loại task tự động.
- **Focus (Tập trung):** Hỗ trợ phiên làm việc tập trung theo phương pháp Pomodoro, gắn liền với nhiệm vụ cụ thể.
- **Verify (Xác nhận & Ăn mừng):** Đánh dấu khoảnh khắc hoàn thành nhiệm vụ. Mọi task khi hoàn thành đều dẫn đến màn hình Celebration với tùy chọn "Moment Capture" (chụp ảnh lưu giữ kỷ niệm, tạo dòng thời gian phát triển). Đặc biệt với task học thuật, hệ thống cung cấp thêm tùy chọn AI Examiner (AI đóng vai trò người kiểm tra kiến thức) nếu người dùng muốn tự đánh giá sâu hơn.

### 2.2. Lý do thực hiện

Qua quan sát ban đầu, sinh viên và nhân viên văn phòng thường gặp các vấn đề:

1. **Quá tải thông tin:** Thông tin phân tán từ nhiều nguồn (chat nhóm, email, tài liệu, ghi chú, ảnh chụp màn hình) khiến việc tổ chức trở nên khó khăn.
2. **Không biết bắt đầu từ đâu:** Khi đối mặt với mục tiêu lớn, người dùng thường bị tê liệt lựa chọn (choice paralysis).
3. **Tốn thời gian sắp xếp:** Việc phân loại và ưu tiên công việc thủ công mất nhiều thời gian.
4. **Mất tập trung:** Mạng xã hội, thông báo và các yếu tố bên ngoài gây phân tâm.
5. **Khó tự đánh giá & Thiếu động lực dài hạn:** Người dùng không có công cụ khách quan để kiểm tra mức độ hiểu bài, cũng như thiếu cách thức lưu giữ lại hành trình nỗ lực (như sự tiến bộ về thể hình, thói quen) khiến họ dễ nản chí.

> [!IMPORTANT]
> **Điểm khác biệt cốt lõi:** Planning AI không chỉ là một to-do list thông thường. Giá trị độc đáo nằm ở việc kết hợp 3 bước Plan-Focus-Verify thành một quy trình liền mạch, tận dụng AI để cá nhân hóa trải nghiệm.

### 2.3. Kết quả mong muốn

Người dùng cần một giải pháp đơn giản, dễ tiếp cận, có khả năng chuyển đổi thông tin phân tán thành kế hoạch hành động rõ ràng, hỗ trợ họ duy trì sự tập trung trong quá trình thực hiện thông qua các phiên Pomodoro hoặc môi trường làm việc tối giản, đồng thời tạo cảm giác thành tựu qua bước Verify (với tính năng lưu giữ khoảnh khắc Moment Capture và tùy chọn AI Examiner kiểm tra kiến thức ngắn gọn).

---

## 3. Người dùng mục tiêu và Môi trường hoạt động

### 3.1. Người dùng mục tiêu (Target Users)

| Nhóm người dùng         | Đặc điểm                                                      | Nhu cầu chính                                  |
| ----------------------- | ------------------------------------------------------------- | ---------------------------------------------- |
| Sinh viên đại học       | Quản lý bài tập, dự án nhóm, kỳ thi, mục tiêu học tập         | Lập kế hoạch học tập, ôn thi, theo dõi tiến độ |
| Nhân viên văn phòng trẻ | Xử lý nhiều nhiệm vụ, deadline và dự án cùng lúc              | Tổ chức công việc, duy trì tập trung           |
| Người theo đuổi mục tiêu cá nhân | Người muốn rèn luyện sức khỏe (tập gym), xây dựng thói quen mới | Xây dựng lộ trình rõ ràng, theo dõi sự tiến bộ trực quan qua hình ảnh (Moment Capture), duy trì động lực |
| Người tự học (Optional) | Tự định hướng việc học, không có người hướng dẫn thường xuyên | Lập kế hoạch, tự đánh giá mức độ hiểu biết     |

### 3.2. Môi trường hoạt động

- **Loại ứng dụng:** Web Application
- **Trình duyệt hỗ trợ:** Chrome, Edge, Firefox (Không hỗ trợ Safari)
- **Thiết bị:** Desktop (Chỉ hỗ trợ Desktop cho MVP)

---

## 4. Các tính năng chính

### 4.1. Tính năng 1: AI Planning

**Mô tả:** Người dùng nhập mục tiêu, deadline hoặc tải lên thông tin liên quan. AI tự động phân tích và chuyển đổi thành kế hoạch hành động cụ thể.

**Chi tiết chức năng:**

- Nhập đầu vào: MVP (Sprint 2-3) hỗ trợ Text và Image (ảnh chụp bảng, bài tập - do Gemini xử lý trực tiếp). Xử lý file PDF/DOCX sẽ đưa vào Phase 2 (Sprint 4-5).
- AI tự động phân tích và phân loại task thành "học thuật" hoặc "sinh hoạt/công việc".
- Tự động chia nhỏ nhiệm vụ lớn thành các task nhỏ hơn.
- **Hình ảnh minh họa cho subtask:** Khi AI tạo subtask, mỗi subtask có thể kèm theo hình ảnh minh họa liên quan. Tính năng này được phân kỳ như sau:
  - **MVP (Sprint 2-3):** AI tạo mô tả ảnh cho mỗi subtask (text-based description) để người dùng hình dung nội dung cần làm. Nếu người dùng upload ảnh kèm input (ví dụ: ảnh chụp bảng, ảnh bài tập), hệ thống có thể crop và gán ảnh liên quan cho subtask tương ứng. Người dùng cũng có thể tự upload ảnh cho từng subtask.
  - **Phase 2 (Sprint 4-5):** Hỗ trợ xử lý file PDF/DOCX. Hệ thống tự động nhận diện cấu trúc tài liệu, crop đề bài từ từng phần của tài liệu và gán vào subtask tương ứng. Ví dụ: Nếu người dùng tải lên file PDF bài tập, mỗi subtask sẽ hiển thị ảnh crop đề bài tương ứng để người dùng nhìn trực tiếp mà không cần chuyển sang nơi khác.
  - Với kế hoạch tập gym, mỗi bài tập sẽ kèm ảnh minh họa động tác hoặc máy tập (nguồn: AI generate description hoặc người dùng tự upload). Người dùng có thể chỉnh sửa/thay thế ảnh của từng subtask.
- Đề xuất mức độ ưu tiên và thứ tự thực hiện.
- Hỗ trợ chỉnh sửa, sắp xếp lại kế hoạch thủ công.

### 4.2. Tính năng 2: Focus Session (Pomodoro Focus)

**Mô tả:** Hỗ trợ phiên làm việc tập trung theo phương pháp Pomodoro, gắn với nhiệm vụ cụ thể từ AI Planning.

**Chi tiết chức năng:**

- Tạo phiên tập trung với thời gian tùy chỉnh.
- Gắn phiên với một nhiệm vụ cụ thể từ kế hoạch.
- Đếm ngược thời gian với giao diện tối giản.
- Tùy chọn không gian làm việc ảo (Ambient theme: hình nền tĩnh và nhạc lo-fi) - tính năng nice-to-have trong Sprint 5. Tuyệt đối không làm 3D/interactive.
- Lưu lịch sử các phiên tập trung và hiển thị thống kê.

### 4.3. Tính năng 3: Verify (AI Examiner & Celebration)

**Mô tả:** AI hỗ trợ xác nhận mức độ hoàn thành công việc, kết hợp trải nghiệm gamification khi hoàn thành task.

> [!IMPORTANT]
> **Nguyên tắc cốt lõi:** Verify luôn là TÙY CHỌN (optional). Hệ thống gợi ý người dùng thực hiện Verify sau khi hoàn thành task, nhưng người dùng có quyền bỏ qua bất kỳ lúc nào. Không có bước Verify nào bị bắt buộc tự động.

**Chi tiết chức năng:**

- **Màn hình Chúc mừng (Celebration Screen) & Moment Capture (Luôn khả dụng):** BẤT KỲ loại task nào (học thuật hay sinh hoạt) khi được đánh dấu hoàn thành đều sẽ hiển thị màn hình Celebration đầu tiên. Tại đây, người dùng luôn có tùy chọn **"Chụp ảnh khoảnh khắc" (Moment Capture)**. Tính năng này cho phép lưu lại hình ảnh kỷ niệm, tạo thành bộ sưu tập theo timeline (ví dụ: người tập gym chụp ảnh sau mỗi buổi tập để theo dõi tiến độ thể hình, sinh viên chụp ảnh bài tập đã giải xong).
- **Phân luồng tùy chọn AI Examiner (Chỉ dành cho task học thuật):** Sau màn hình Celebration, tùy thuộc vào nhãn task mà hệ thống xử lý tiếp:
  - **Đối với task học thuật - "Học kiến thức" (ôn bài, lý thuyết):** Hệ thống GỢI Ý kích hoạt thêm **AI Examiner**. AI đặt câu hỏi kiểm tra kiến thức dựa trên tài liệu. Người dùng có thể tự nguyện tham gia để test kiến thức hoặc bỏ qua.
  - **Đối với task học thuật - "Làm bài tập/Thực hành" & task sinh hoạt:** Hệ thống KHÔNG gợi ý AI Examiner. Người dùng hoàn thành việc chụp ảnh khoảnh khắc (hoặc bỏ qua) là kết thúc quy trình Verify một cách nhẹ nhàng.
- Lưu kết quả đánh giá (AI Examiner) và ảnh khoảnh khắc (Celebration) để hiển thị lên Dashboard.

### 4.4. Tính năng 4: Dashboard

**Mô tả:** Trang tổng quan hiển thị toàn cảnh hoạt động của người dùng.

**Chi tiết chức năng:**

- Hiển thị các nhiệm vụ đang thực hiện và deadline sắp tới
- Thống kê tiến độ hoàn thành kế hoạch
- Tổng hợp lịch sử Focus Session (biểu đồ)
- Tổng hợp kết quả Verify (xu hướng tiến bộ)
- Widget nhanh: bắt đầu phiên Focus, tạo kế hoạch mới
- **Widget "Hành trình của tôi" (My Journey):** Hiển thị timeline ảnh khoảnh khắc gần đây của người dùng. Widget này giúp người dùng nhìn lại quá trình phát triển của mình một cách trực quan, tạo động lực tiếp tục duy trì thói quen. Nhấn vào widget để mở màn hình Moment Gallery (xem chi tiết Section 6, màn hình số 13).

### 4.5. Tính năng 5: Quản lý tài khoản (Authentication & Profile)

**Mô tả:** Hệ thống đăng ký, đăng nhập và quản lý thông tin cá nhân.

**Chi tiết chức năng:**

- Đăng ký tài khoản (email + mật khẩu)
- Đăng nhập / Đăng xuất
- Trang hồ sơ cá nhân (thông tin cơ bản, đổi mật khẩu)

### 4.6. Luồng tích hợp Plan-Focus-Verify

**Mô tả:** Đây là vòng lặp task-level mô tả cách người dùng di chuyển liền mạch giữa các tính năng cốt lõi của hệ thống. Thay vì sử dụng từng tính năng rời rạc, người dùng trải nghiệm một luồng liên tục từ việc chọn task trong kế hoạch, tập trung thực hiện, đến chúc mừng/xác nhận hoàn thành, rồi quay lại task tiếp theo.

**Vòng lặp task-level:**

```
Danh sách Task trong Plan
      |
      v
Chọn task cần thực hiện
      |
      v
Nhấn "Bắt đầu" -> Vào Focus Session
      |
      v
Tập trung làm việc (Pomodoro timer, nghe nhạc lo-fi...)
      |
      v
Hoàn thành task -> Nhấn "Đã xong"
      |
      v
Celebration Screen (Chúc mừng!)
      |
      v
"Bạn có muốn lưu giữ khoảnh khắc không?" -> Chụp ảnh (tùy chọn)
      |
      v
[Nếu task học thuật - "Học kiến thức": Gợi ý AI Examiner (tùy chọn)]
[Nếu task học thuật - "Làm bài tập": Bỏ qua Examiner, chỉ Celebration]
[Nếu task sinh hoạt: Chỉ Celebration]
      |
      v
Quay lại danh sách task -> Chọn task tiếp theo
      |
      v
(Lặp lại vòng lặp cho đến khi hoàn thành tất cả task trong Plan)
```

**Ví dụ hành trình người dùng thực tế:**

#### Ví dụ 1: Người mới tập gym

Anh Minh (22 tuổi, sinh viên) muốn bắt đầu tập gym nhưng không biết bắt đầu từ đâu. Anh mở Planning AI và nhập: "Tôi muốn tập gym 4 ngày/tuần, mục tiêu tăng cơ, có 1 tháng".

1. **Plan:** AI tạo kế hoạch tập 4 ngày/tuần (Thứ 2: Ngực + Tay trước, Thứ 4: Lưng + Tay sau, Thứ 6: Chân, Chủ Nhật: Cardio). Mỗi ngày có 5-6 bài tập cụ thể, mỗi bài kèm mô tả động tác (text-based, MVP) hoặc ảnh minh họa (tự upload).
2. **Focus:** Hôm nay là Thứ 2. Minh mở kế hoạch, thấy danh sách bài tập ngày hôm nay. Nhấn vào "Bench Press - 4x12" -> Nhấn "Bắt đầu" -> Vào Focus Session. Đồng hồ bắt đầu đếm, có thể bật nhạc lo-fi để tập trung.
3. **Celebration:** Hoàn thành set cuối cùng, nhấn "Đã xong". Màn hình Celebration hiện lên: "Tuyệt vời! Bạn đã hoàn thành Bench Press!". Hệ thống hỏi: "Bạn có muốn lưu giữ khoảnh khắc không?". Minh chụp một tấm selfie tại phòng tập.
4. **Tiếp tục:** Quay lại danh sách bài tập -> Chọn "Incline Dumbbell Press - 3x10" -> Bắt đầu Focus -> Hoàn thành -> Celebration -> Chụp ảnh (hoặc bỏ qua) -> Task tiếp theo...
5. **Sau 1 tháng:** Minh vào Dashboard, xem widget "Hành trình của tôi" và mở Moment Gallery. Anh thấy bộ sưu tập ảnh từ ngày đầu đến nay, cảm thấy có động lực tiếp tục vì nhìn thấy sự tiến bộ rõ ràng.

#### Ví dụ 2: Sinh viên cần làm bài tập 2 môn trước deadline

Hoa (20 tuổi, sinh viên năm 2) có bài tập môn Toán và môn Lập trình cần nộp trong tuần này. Cô chụp ảnh đề bài Toán và copy link bài tập Lập trình, sau đó nhập vào Planning AI kèm mô tả: "Bài tập Toán - nộp thứ 5, Bài tập Lập trình - nộp thứ 6".

1. **Plan:** AI phân tích và tạo kế hoạch: Môn Toán có 5 bài (ưu tiên trước vì deadline sớm hơn), môn Lập trình có 3 bài. Mỗi subtask hiển thị ảnh crop đề bài tương ứng (MVP: từ ảnh người dùng đã upload, hệ thống crop và gán cho từng subtask).
2. **Focus:** Hoa chọn bài Toán số 1. Màn hình hiển thị ảnh đề bài ngay trong task. Nhấn "Bắt đầu" -> Vào Focus Session với Pomodoro 25 phút.
3. **Celebration:** Hoàn thành bài 1, nhấn "Đã xong". Màn hình Celebration hiện lên. Vì đây là task "Làm bài tập" (không phải "Học kiến thức"), hệ thống KHÔNG gợi ý AI Examiner mà chỉ hiện Celebration. Hoa có thể tự bật AI Examiner nếu muốn kiểm tra lại, nhưng không bắt buộc.
4. **Tiếp tục:** Quay lại danh sách -> Bài Toán số 2 -> Focus -> Hoàn thành -> Celebration -> ... cho đến khi xong cả 2 môn.

#### Ví dụ 3: Học thuộc kiến thức (Học sinh cấp 3 ôn thi Lịch sử)

Nam (17 tuổi, học sinh lớp 11) cần học thuộc đề cương môn Lịch sử cho bài kiểm tra 1 tiết sắp tới. Nam tải file đề cương lên Planning AI và nhập yêu cầu: "Giúp mình ôn thi Lịch sử".

1. **Plan:** AI phân tích nội dung đề cương và chia nhỏ thành các phiên học ngắn hạn (ví dụ: Bài 1 - Chiến tranh thế giới thứ nhất, Bài 2 - Chiến tranh thế giới thứ hai).
2. **Focus:** Nam chọn Bài 2 và bắt đầu phiên tập trung. Màn hình Focus hiện lên kèm đếm ngược Pomodoro.
3. **Celebration:** Khi hết thời gian và Nam đánh dấu hoàn thành, màn hình chúc mừng hiện ra. Nam sử dụng tính năng chụp ảnh khoảnh khắc để chụp lại bàn học của mình nhằm lưu giữ kỷ niệm nỗ lực.
4. **Verify (AI Examiner):** Vì đặc thù của task này được AI phân loại là "Học kiến thức", hệ thống chủ động gợi ý tính năng AI Examiner. Nam đồng ý. AI đóng vai trò giám khảo vấn đáp và đặt câu hỏi: "Hãy nêu nguyên nhân bùng nổ Thế chiến 2?". Nam gõ hoặc nói câu trả lời. AI đối chiếu với tài liệu gốc, đánh giá mức độ chính xác và chỉ ra những ý còn thiếu để xác nhận xem Nam đã thực sự thuộc bài chưa.

**Điểm then chốt:**

- Người dùng không cần rời khỏi ứng dụng để tìm đề bài, tài liệu -- mọi thứ hiển thị ngay trong subtask.
- Luồng chuyển đổi giữa các màn hình là tự động và liền mạch: Task -> Focus -> Celebrate -> Task tiếp theo.
- Verify (AI Examiner) chỉ là tùy chọn, không bao giờ ép buộc người dùng.

---

## 5. Phỏng vấn người dùng

> [!IMPORTANT]
> **YÊU CẦU BẮT BUỘC CỦA ĐỀ BÀI:** Cần phỏng vấn ít nhất 5 người dùng hoặc khách hàng tiềm năng để xác nhận hoặc khám phá các ý tưởng mới cho dự án. Bản mô tả dự án phải bao gồm bằng chứng về các cuộc phỏng vấn.

### 5.1. UX Problem Statement

- **Who (Đối tượng người dùng):** Người dùng từ sinh viên đại học đến nhân viên văn phòng trẻ thường xuyên phải quản lý nhiều nhiệm vụ, deadline, mục tiêu học tập và mục tiêu cá nhân, nhưng thường thiếu một quy trình đơn giản và hiệu quả để chuyển đổi ý định thành hành động thực tế.
- **Situation (Ngữ cảnh):** Khi đối mặt với các cột mốc quan trọng như kỳ thi, bài nộp dự án hoặc deadline công việc, người dùng nhận được lượng lớn thông tin hỗn loạn và phi cấu trúc từ nhiều nguồn như chat nhóm, email, tài liệu, ảnh chụp màn hình, ghi chú và tài liệu chuyên môn. Họ phải tự tổng hợp thông tin, xác định điều gì quan trọng, xây dựng kế hoạch hành động, bắt đầu thực hiện, duy trì sự tập trung và sau đó kiểm tra xem mình đã thực sự hiểu hoặc hoàn thành công việc tốt hay chưa.
- **Pain Points (Điểm đau cốt lõi):**
  - Người dùng gặp tình trạng quá tải thông tin (information overload).
  - Người dùng rơi vào trạng thái tê liệt phân tích (analysis paralysis) và không biết bắt đầu từ đâu.
  - Tốn nhiều công sức và thời gian cho việc tổ chức, sắp xếp nhiệm vụ thủ công.
  - Các công cụ năng suất hiện tại yêu cầu thiết lập phức tạp, khó duy trì thói quen dài hạn.
  - Thường xuyên bị phân tâm bởi các tác nhân bên ngoài và khó duy trì động lực.
  - Thiếu cách thức hiệu quả để tự kiểm tra mức độ hiểu bài hoặc chất lượng hoàn thành công việc sau mỗi phiên học tập/làm việc.
- **Impact (Hệ quả xấu):**
  - Các nhiệm vụ quan trọng bị trì hoãn, hoàn thành sát deadline hoặc bị bỏ sót hoàn toàn.
  - Chất lượng công việc suy giảm và mức độ căng thẳng (stress) của người dùng gia tăng.
  - Người dùng nhanh chóng từ bỏ các công cụ lập kế hoạch hiện có vì cảm thấy quá nặng nề và phức tạp.
  - Đối với học tập, người dùng dễ gặp ảo tưởng đã hiểu bài nhưng thực tế không thể giải thích hay áp dụng kiến thức.
- **Desired Outcome (Kết quả kỳ vọng):** Người dùng cần một giải pháp đơn giản, dễ tiếp cận có khả năng chuyển đổi thông tin hỗn loạn thành kế hoạch hành động rõ ràng (kèm hình ảnh minh họa cho từng subtask), hỗ trợ họ tập trung thực hiện thông qua các phiên Pomodoro tối giản, đồng thời xác minh mức độ hiểu bài thông qua AI Examiner với phản hồi ngắn gọn và tạo trải nghiệm chúc mừng tích cực khi hoàn thành task.

### 5.2. Mục tiêu nghiên cứu (Research Goal & Objectives)

#### 5.2.1. Research Goal (Mục tiêu tổng quát)

- Hiểu các rào cản về nhận thức, hành vi và cảm xúc khiến người dùng gặp khó khăn trong việc:
  - Chuyển đổi thông tin hỗn loạn, nhiệm vụ và deadline thành hành động cụ thể.
  - Duy trì sự tập trung trong quá trình thực hiện.
  - Xác minh mức độ hiểu biết sau khi hoàn thành một phiên học tập hoặc làm việc.
- Nghiên cứu cần xác định cách một quy trình tích hợp **Plan - Focus - Verify** có thể giảm bớt ma sát thông qua lập kế hoạch bằng AI, hỗ trợ tập trung dựa trên Pomodoro và vấn đáp bằng AI.

#### 5.2.2. Research Objectives (Mục tiêu cụ thể)

1. Xác định cảm xúc và hành vi của người dùng khi phải quản lý đồng thời nhiều nhiệm vụ, deadline, mục tiêu học tập hoặc trách nhiệm dự án.
2. Khám phá các công cụ và phương pháp mà người dùng hiện đang sử dụng để lập kế hoạch, quản lý nhiệm vụ, duy trì tập trung, tự kiểm tra kiến thức và lý do tại sao chúng chưa đáp ứng tốt nhu cầu.
3. Làm rõ các điểm ma sát về nhận thức và tương tác khiến các công cụ năng suất hiện tại khó duy trì sử dụng lâu dài (thiết lập thủ công, chia nhỏ nhiệm vụ, chuyển đổi ngữ cảnh...).
4. Khám phá các tác nhân gây phân tâm khiến người dùng khó bắt đầu hoặc duy trì công việc (thông báo, mạng xã hội, môi trường...).
5. Tìm hiểu xem các phiên Pomodoro và phòng học tập ảo đơn giản có thực sự giúp người dùng bắt đầu công việc nhanh hơn và duy trì sự chú ý tốt hơn không.
6. Hiểu cách người dùng hiện tại kiểm tra xem họ đã thực sự học được hay hoàn thành tốt một nhiệm vụ sau khi kết thúc phiên làm việc/học tập hay chưa.
7. Đánh giá kỳ vọng của người dùng đối với AI Oral Examiner, bao gồm phong cách đặt câu hỏi, hình thức trả lời, giọng điệu phản hồi, cách đánh giá và gợi ý ôn tập.
8. Xác định chi tiết yêu cầu sản phẩm cho luồng MVP Plan - Focus - Verify và phân tách rõ các tính năng bắt buộc và các tính năng mở rộng.

#### 5.2.3. MVP Research Focus (Trọng tâm nghiên cứu MVP)

Trong giai đoạn Discovery của Sprint 1, nhóm cần ưu tiên thu thập bằng chứng để xác thực ba giả định:

1. Người dùng cần được hỗ trợ tạo ra kế hoạch hành động đầu tiên một cách nhanh chóng.
2. Người dùng hưởng lợi từ một nghi thức tập trung đơn giản, ít ma sát và gắn liền với một nhiệm vụ cụ thể.
3. Người dùng đánh giá cao việc nhận được phản hồi ngay sau khi học tập hoặc hoàn thành các công việc đòi hỏi xử lý kiến thức.

### 5.3. Screener Survey (Khảo sát sàng lọc người tham gia)

> [!NOTE]
> Mục tiêu của Screener Survey là lọc đúng nhóm người dùng mục tiêu trước khi tiến hành phỏng vấn sâu. Chỉ những người đáp ứng đủ tiêu chí mới được mời phỏng vấn.

#### Tiêu chí đủ điều kiện tham gia (Eligibility Criteria)

Người tham gia phỏng vấn phải đáp ứng ít nhất một trong các điều kiện sau:

- Là sinh viên đại học/cao đẳng đang theo học.
- Là nhân viên văn phòng (đi làm toàn thời gian hoặc bán thời gian).
- Có nhu cầu tự học hoặc phát triển kỹ năng cá nhân ngoài giờ làm việc.

Và phải đáp ứng **tất cả** các điều kiện sau:

- Thường xuyên phải quản lý nhiều nhiệm vụ/deadline cùng lúc (ít nhất 3 lần/tuần).
- Sử dụng máy tính (desktop/laptop) là thiết bị chính để học tập hoặc làm việc.

#### Câu hỏi sàng lọc

**Phần A – Thông tin cơ bản**

| #   | Câu hỏi                                                                                                           | Loại        | Tiêu chí lọc                                                                                        |
| --- | ----------------------------------------------------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------- |
| S1  | Bạn hiện tại là: (a) Sinh viên đại học/cao đẳng, (b) Nhân viên văn phòng, (c) Vừa đi học vừa đi làm, (d) Khác     | Trắc nghiệm | Chọn (a), (b) hoặc (c) → Đủ điều kiện. Chọn (d) → Hỏi thêm. Follow-up: Sinh viên năm mấy? Ngành gì? |
| S2  | Bạn thuộc nhóm tuổi nào? (a) Dưới 18, (b) 18–24, (c) 25–35, (d) Trên 35                                           | Trắc nghiệm | Ưu tiên (b) và (c)                                                                                  |
| S3  | Thiết bị chính bạn dùng để học tập/làm việc là gì? (a) Máy tính để bàn/laptop, (b) Điện thoại di động, (c) Cả hai | Trắc nghiệm | Chọn (a) hoặc (c) → Đủ điều kiện. Chỉ (b) → Loại                                                    |

**Phần B – Hành vi quản lý công việc**

| #   | Câu hỏi                                                                                                                                                 | Loại                        | Tiêu chí lọc                                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | -------------------------------------------------------- |
| S4  | Trung bình mỗi tuần, bạn có bao nhiêu nhiệm vụ/deadline cần quản lý cùng lúc? (a) 1–2, (b) 3–5, (c) Hơn 5                                               | Trắc nghiệm                 | Chọn (b) hoặc (c) → Đủ điều kiện. Chọn (a) → Có thể loại |
| S5  | Bạn có bao giờ cảm thấy không biết bắt đầu từ đâu khi nhận một nhiệm vụ lớn không? (a) Thường xuyên, (b) Thỉnh thoảng, (c) Hiếm khi, (d) Không bao giờ  | Trắc nghiệm                 | Chọn (a) hoặc (b) → Đủ điều kiện                         |
| S6  | Bạn có hiện đang sử dụng bất kỳ công cụ nào để lập kế hoạch/quản lý công việc không? (Ví dụ: Notion, Trello, Google Calendar, Todoist, ghi chú giấy...) | Có/Không + Điền tên công cụ | Không bắt buộc, dùng để phân nhóm                        |

**Phần C – Hành vi tập trung và tự đánh giá**

| #   | Câu hỏi                                                                                                                                                                   | Loại        | Tiêu chí lọc                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------- |
| S7  | Khi học bài hoặc làm việc, bạn thường bị phân tâm trong bao lâu? (a) Dưới 15 phút, (b) 15–30 phút, (c) Hơn 30 phút, (d) Tôi có thể tập trung tốt, không bị phân tâm nhiều | Trắc nghiệm | Ưu tiên (b) và (c), (d) vẫn có thể tham gia |
| S8  | Bạn có thường tự hỏi "Mình đã thực sự hiểu bài/hoàn thành tốt chưa?" sau khi học hoặc làm việc không? (a) Thường xuyên, (b) Thỉnh thoảng, (c) Hiếm khi                    | Trắc nghiệm | Chọn (a) hoặc (b) → Ưu tiên cao             |

---

### 5.4. Câu hỏi phỏng vấn sâu (Interview Questions)

> [!NOTE]
> Phỏng vấn theo hình thức bán cấu trúc (semi-structured). Thời gian dự kiến: 20–30 phút/người. Người phỏng vấn nên linh hoạt theo dõi câu trả lời và đặt thêm câu hỏi follow-up khi cần thiết.

#### Hướng dẫn mở đầu (Introduction Script)

> _"Xin chào, cảm ơn bạn đã dành thời gian tham gia. Tôi đang thực hiện một nghiên cứu về cách mọi người quản lý công việc, duy trì sự tập trung và tự đánh giá hiệu quả sau khi hoàn thành nhiệm vụ. Không có câu trả lời đúng hay sai – tôi chỉ muốn hiểu trải nghiệm thực tế của bạn. Bạn có cho phép tôi ghi âm/ghi hình buổi nói chuyện này không?"_

---

#### Phần 1 – Khởi động (Warm-up) | 3–5 phút

_Mục tiêu: Làm quen, khai thác bối cảnh cá nhân của người được phỏng vấn._

| #   | Câu hỏi                                                                         | Research Objective |
| --- | ------------------------------------------------------------------------------- | ------------------ |
| W1  | Một ngày làm việc/học tập điển hình của bạn trông như thế nào?                  | RO1                |
| W2  | Bạn thường có bao nhiêu nhiệm vụ cần xử lý cùng lúc? Đó là những loại task nào? | RO1                |

---

#### Phần 2 – Lập kế hoạch và Tổ chức công việc | 7–10 phút

_Mục tiêu: Khám phá quy trình hiện tại, công cụ đang dùng và các điểm ma sát (RO1, RO2, RO3)._

| #   | Câu hỏi                                                                                                               | Research Objective |
| --- | --------------------------------------------------------------------------------------------------------------------- | ------------------ |
| P1  | Khi nhận một nhiệm vụ lớn hoặc mục tiêu mới, bạn thường làm gì đầu tiên? Bạn có thể mô tả quy trình của bạn không?    | RO1, RO2           |
| P2  | Bạn hiện dùng công cụ gì để lập kế hoạch hoặc quản lý công việc? (Nếu có)                                             | RO2                |
| P3  | Điều gì bạn thích nhất ở công cụ đó? Điều gì khiến bạn thấy bất tiện hoặc ngại dùng?                                  | RO2, RO3           |
| P4  | Kể cho tôi nghe về một lần bạn đã lên kế hoạch cho một nhiệm vụ. Quá trình thực hiện kế hoạch đó diễn ra như thế nào? | RO3                |
| P5  | Khi bạn phải đối mặt với một lượng lớn công việc cùng một lúc, bạn thường bắt đầu như thế nào?                        | RO1, RO3           |
| P6  | Bạn thường mất bao lâu để tổ chức và phân chia nhiệm vụ trước khi bắt tay vào làm?                                    | RO3                |

---

#### Phần 3 – Tập trung và Phân tâm | 5–7 phút

_Mục tiêu: Hiểu các tác nhân gây phân tâm và thói quen duy trì tập trung (RO4, RO5)._

| #   | Câu hỏi                                                                                                                                 | Research Objective |
| --- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| F1  | Khi đang học bài hoặc làm việc, điều gì thường khiến bạn mất tập trung nhất?                                                            | RO4                |
| F2  | Bạn thường làm gì để lấy lại sự tập trung sau khi bị phân tâm?                                                                          | RO4                |
| F3  | Bạn đã từng thử các phương pháp hoặc kỹ thuật nào để duy trì sự tập trung khi làm việc chưa? Trải nghiệm của bạn với chúng như thế nào? | RO5                |
| F4  | Theo bạn, một môi trường hoặc công cụ lý tưởng để giúp bạn tập trung khi làm việc/học bài sẽ trông như thế nào?                         | RO5                |
| F5  | Bạn thích học/làm việc một mình hay trong môi trường có người khác xung quanh (như thư viện, quán cà phê)? Tại sao?                     | RO5                |

---

#### Phần 4 – Tự đánh giá sau khi hoàn thành | 5–7 phút

_Mục tiêu: Hiểu thói quen tự kiểm tra và kỳ vọng về AI Verify (RO6, RO7)._

| #   | Câu hỏi                                                                                                                                                                                                                                                                                                                                                                                                                 | Research Objective |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| V1  | Sau khi học xong một chủ đề hoặc hoàn thành một nhiệm vụ, bạn thường làm gì? Bạn có tự kiểm tra kết quả không?                                                                                                                                                                                                                                                                                                          | RO6                |
| V2  | Sau khi hoàn thành một buổi học hoặc làm việc, bạn thường cảm thấy như thế nào về kết quả của mình? Bạn đánh giá mức độ hoàn thành ra sao?                                                                                                                                                                                                                                                                              | RO6                |
| V3  | Tưởng tượng rằng sau khi bạn học xong một chủ đề, một AI sẽ tương tác với bạn để giúp bạn kiểm tra mức độ hiểu. Ví dụ: nếu bạn vừa học về kiến trúc REST API, AI có thể hỏi _"Em hãy giải thích sự khác nhau giữa PUT và PATCH"_, hoặc nếu bạn vừa đọc xong một chương sách, AI hỏi _"Ý chính của phần này là gì và nó liên quan đến cuộc sống của bạn như thế nào?"_. Bạn cảm thấy thế nào về hình thức tương tác này? | RO7                |
| V4  | Bạn muốn AI phản hồi theo phong cách nào? (a) Trực tiếp, chỉ ra điểm sai ngay, (b) Khích lệ và gợi ý từng bước, (c) Đặt thêm câu hỏi để bạn tự suy nghĩ                                                                                                                                                                                                                                                                 | RO7                |
| V5  | Đối với các công việc không phải học thuật (như lên kế hoạch cá nhân, dọn phòng, tập thể dục...), bạn có muốn AI đặt câu hỏi phản chiếu để bạn tự review lại không? (Ví dụ: "Bạn đã hoàn thành đủ các yêu cầu chưa? Có điểm nào cần rút kinh nghiệm?")                                                                                                                                                                  | RO7                |

---

#### Phần 5 – Phản hồi về ý tưởng sản phẩm | 3–5 phút

_Mục tiêu: Thu thập phản hồi về khái niệm Planning AI và xác định yêu cầu MVP (RO8)._

| #   | Câu hỏi                                                                                                                                                                                                                                                                                                                                      | Research Objective |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| A1  | Tôi muốn giới thiệu ý tưởng Planning AI: một ứng dụng cho phép bạn nhập mục tiêu hoặc tải ảnh bài tập lên, AI tự động tạo kế hoạch hành động, sau đó bạn dùng bộ đếm giờ tập trung (Pomodoro) gắn với từng nhiệm vụ, và cuối cùng AI sẽ hỏi vài câu để kiểm tra bạn hoặc giúp bạn tự review. Cảm nhận đầu tiên của bạn về ý tưởng này là gì? | RO8                |
| A2  | Trong 3 tính năng đó (Lập kế hoạch / Tập trung / Kiểm tra – Phản chiếu), tính năng nào bạn thấy hữu ích nhất? Tại sao?                                                                                                                                                                                                                       | RO8                |
| A3  | Bạn thấy điều gì ở ý tưởng này chưa phù hợp hoặc cần cải thiện so với nhu cầu thực tế của bạn?                                                                                                                                                                                                                                               | RO8                |
| A4  | Nếu ứng dụng này tồn tại ngay bây giờ, điều đầu tiên bạn muốn nó làm được là gì?                                                                                                                                                                                                                                                             | RO8                |
| A5  | Bạn có điều gì muốn thêm hoặc bất kỳ gợi ý nào cho sản phẩm này không?                                                                                                                                                                                                                                                                       | RO8                |

---

### 5.5. Đặc điểm người tham gia mục tiêu (Participant Characteristics)

| Đặc điểm                 | Tiêu chí                                                                               |
| ------------------------ | -------------------------------------------------------------------------------------- |
| **Nhóm chính**           | Sinh viên đại học năm 2–4; Nhân viên văn phòng 22–32 tuổi                              |
| **Số lượng**             | Tối thiểu 5 người (khuyến nghị 3 sinh viên + 2 nhân viên văn phòng để đảm bảo đa dạng) |
| **Thiết bị**             | Chủ yếu dùng máy tính (desktop/laptop) để học tập/làm việc                             |
| **Tần suất đa nhiệm**    | Quản lý ≥ 3 nhiệm vụ/deadline/tuần                                                     |
| **Kinh nghiệm với tool** | Có hoặc không có đều được (để so sánh 2 nhóm)                                          |
| **Ngôn ngữ phỏng vấn**   | Tiếng Việt                                                                             |
| **Hình thức**            | Trực tiếp hoặc Online (Google Meet / Zoom)                                             |

---

### 5.6. Bảng tổng hợp kết quả phỏng vấn

| STT | Tên người được phỏng vấn | Nghề nghiệp / Nền tảng | Ngày phỏng vấn | Hình thức (Trực tiếp / Online) | Link bằng chứng (ghi âm / video / ghi chú) |
| --- | ------------------------ | ---------------------- | -------------- | ------------------------------ | ------------------------------------------ |
| 1   | [Điền tên]               | [Điền]                 | [Điền]         | [Điền]                         | [Điền link hoặc đường dẫn file]            |
| 2   | [Điền tên]               | [Điền]                 | [Điền]         | [Điền]                         | [Điền link hoặc đường dẫn file]            |
| 3   | [Điền tên]               | [Điền]                 | [Điền]         | [Điền]                         | [Điền link hoặc đường dẫn file]            |
| 4   | [Điền tên]               | [Điền]                 | [Điền]         | [Điền]                         | [Điền link hoặc đường dẫn file]            |
| 5   | [Điền tên]               | [Điền]                 | [Điền]         | [Điền]                         |

### 5.7. Các phát hiện chính từ phỏng vấn

<!-- Nhóm CAGT điền sau khi thực hiện phỏng vấn -->

- **Phát hiện 1:** [Mô tả]
- **Phát hiện 2:** [Mô tả]
- **Phát hiện 3:** [Mô tả]

### 5.8. Điều chỉnh dự án dựa trên phản hồi phỏng vấn

<!-- Nhóm CAGT điền sau khi phân tích kết quả phỏng vấn -->

| Ý tưởng/Thay đổi | Nguồn gốc (Từ phỏng vấn nào) | Quyết định (Áp dụng / Bỏ qua) | Lý do   |
| ---------------- | ---------------------------- | ----------------------------- | ------- |
| [Mô tả thay đổi] | [Phỏng vấn số #]             | [Áp dụng / Bỏ qua]            | [Lý do] |

---

## 6. Danh sách màn hình dự kiến (Quy mô hệ thống MVP)

**Tổng cộng: 13 màn hình cốt lõi**

| STT | Màn hình           | Nhóm tính năng | Ghi chú                                           |
| --- | ------------------ | -------------- | ------------------------------------------------- |
| 1   | Landing Page       | Marketing      | Giới thiệu sản phẩm, CTA đăng ký                  |
| 2   | Login              | Authentication | Đăng nhập bằng email/mật khẩu                     |
| 3   | Register           | Authentication | Đăng ký tài khoản mới                             |
| 4   | Dashboard          | Dashboard      | Tổng quan hoạt động + Widget "Hành trình của tôi" |
| 5   | Create Plan        | AI Planning    | Nhập mục tiêu, AI tạo kế hoạch                    |
| 6   | Plan Details       | AI Planning    | Xem chi tiết kế hoạch + task list                 |
| 7   | Task Management    | AI Planning    | Quản lý, chỉnh sửa, đánh dấu task                 |
| 8   | Focus Session      | Focus          | Giao diện Pomodoro timer                          |
| 9   | AI Verify Setup    | Verify         | Màn hình chuẩn bị cho Verify                      |
| 10  | AI Exam Session    | Verify         | Hỏi-đáp với AI (Học thuật - tùy chọn)             |
| 11  | Celebration Screen | Verify         | Chúc mừng hoàn thành + Chụp ảnh khoảnh khắc       |
| 12  | Verify Result      | Verify         | Kết quả đánh giá chung                            |
| 13  | Moment Gallery     | Dashboard      | Bộ sưu tập ảnh khoảnh khắc theo timeline          |

**Navigation flow liền mạch (vòng lặp task-level):**

```
Plan Details (6) -> Chọn task -> Task Management (7)
    -> Nhấn "Bắt đầu" -> Focus Session (8)
    -> Hoàn thành -> Celebration Screen (11)
    -> [Tùy chọn: AI Verify Setup (9) -> AI Exam Session (10) -> Verify Result (12)]
    -> Quay lại Plan Details (6) -> Chọn task tiếp theo
```

Moment Gallery (13) có thể truy cập từ Dashboard (4) qua widget "Hành trình của tôi" hoặc từ Celebration Screen (11) sau khi chụp ảnh.

---

## 7. Công nghệ (Tech Stack)

| Thành phần     | Công nghệ                                                                   |
| -------------- | --------------------------------------------------------------------------- |
| Frontend       | React (Vite) + TypeScript + Tailwind CSS + shadcn/ui + React Router + Axios |
| Backend        | Node.js + Express.js                                                        |
| Database       | PostgreSQL + Prisma ORM                                                     |
| Authentication | JWT + bcrypt                                                                |
| AI Services    | Gemini API (Google) - hỗ trợ Text và Image                                  |
| Source Control | Git + GitHub (đã thiết lập)                                                 |
| Project Mgmt   | JIRA (đã thiết lập)                                                         |
| Design         | Figma                                                                       |
| Communication  | Discord (đã thiết lập)                                                      |

### 7.1. Lý do lựa chọn, ưu điểm và rủi ro

#### Frontend: React (Vite) + TypeScript + Tailwind CSS + shadcn/ui

**Lý do lựa chọn:** Planning AI là ứng dụng Single Page Application (SPA) không cần SEO. React kết hợp Vite là giải pháp gọn nhẹ nhất cho SPA. Việc bổ sung TypeScript giúp bắt lỗi chặt chẽ, giảm bug tiềm ẩn. Thêm shadcn/ui giúp xây dựng 12 màn hình giao diện cao cấp (Premium UI) nhanh chóng mà không cần code các component phức tạp từ đầu.

**Ưu điểm:**

- TypeScript đảm bảo type-safety, giúp FE và BE dễ dàng đồng bộ cấu trúc dữ liệu, IntelliSense hỗ trợ dev nhanh hơn.
- shadcn/ui cung cấp component có sẵn chất lượng cao, có tính tùy biến tuyệt đối vì code component nằm ngay trong dự án.
- Vite cung cấp Hot Module Replacement (HMR) cực nhanh.
- Tailwind CSS cho phép xây dựng giao diện nhanh chóng, tích hợp hoàn hảo với shadcn/ui.

**Rủi ro:**

- TypeScript có learning curve (đường cong học tập) nhất định với người mới. Biện pháp giảm thiểu: Các thành viên cứng (FE Lead) sẽ setup các type cơ bản và hướng dẫn cặp (pair programming).
- Bị ngợp với số lượng code sinh ra từ shadcn/ui. Biện pháp: Chỉ cài đặt các component thật sự cần thiết, không cài toàn bộ thư viện.

#### Backend: Node.js + Express.js

**Lý do lựa chọn:** Express.js là framework tối giản, linh hoạt và có learning curve thấp nhất trong hệ sinh thái Node.js. Với thời gian 10 tuần và nhóm 5 người, việc sử dụng framework nặng hơn như NestJS sẽ tốn thời gian học thay vì tập trung vào logic nghiệp vụ.

**Ưu điểm:**

- Cùng ngôn ngữ JavaScript/TypeScript với frontend, cho phép chia sẻ kiến thức và thậm chí các type/interface giữa hai tầng.
- Cộng đồng lớn, có sẵn hàng nghìn middleware (cors, helmet, morgan, multer...) giúp giải quyết nhanh các bài toán phổ biến.
- Kiến trúc không áp đặt (un-opinionated), cho phép nhóm tổ chức code theo cách phù hợp nhất.

**Rủi ro:**

- Không có cấu trúc dự án mặc định, dễ dẫn đến code không nhất quán giữa các thành viên. Giảm thiểu bằng cách thiết lập quy ước thư mục rõ ràng (routes/, controllers/, services/, middlewares/) và ESLint/Prettier ngay từ đầu.
- Xử lý lỗi và validation cần cấu hình thủ công. Giảm thiểu bằng cách sử dụng thư viện hỗ trợ như Joi hoặc Zod cho validation.

#### Database: PostgreSQL + Prisma ORM

**Lý do lựa chọn:** Dữ liệu của Planning AI có quan hệ rõ ràng (User -> Plan -> Task -> FocusSession -> VerifyResult). PostgreSQL là hệ quản trị cơ sở dữ liệu quan hệ mạnh mẽ, đảm bảo tính toàn vẹn dữ liệu (data integrity) tốt hơn so với NoSQL. Prisma ORM được chọn vì khả năng auto-generate TypeScript types từ schema, giúp phát hiện lỗi ngay lúc code thay vì lúc chạy.

**Ưu điểm:**

- PostgreSQL hỗ trợ ACID transactions, đảm bảo dữ liệu nhất quán khi nhiều thao tác xảy ra đồng thời.
- Prisma Migrate tự động hóa việc quản lý thay đổi database schema qua các Sprint, tránh xung đột khi nhiều người cùng phát triển.
- Prisma Client sinh ra các truy vấn type-safe, giảm thiểu lỗi runtime liên quan đến database.

**Rủi ro:**

- Prisma có schema language riêng (`.prisma`), đòi hỏi thời gian làm quen ban đầu. Giảm thiểu bằng cách dành thời gian trong Sprint 2 để thiết kế schema cẩn thận.
- Thay đổi schema giữa các Sprint có thể gây migration conflicts. Giảm thiểu bằng cách thiết kế database schema kỹ lưỡng ở giai đoạn Elaboration và hạn chế thay đổi lớn ở giai đoạn Construction.

#### Authentication: JWT + bcrypt

**Lý do lựa chọn:** Tự xây dựng hệ thống xác thực giúp nhóm hiểu sâu về cơ chế bảo mật - đây là kiến thức quan trọng trong môn Nhập môn Công nghệ Phần mềm. Đồng thời không phát sinh chi phí dịch vụ bên thứ ba và không phụ thuộc vào hạ tầng ngoài.

**Ưu điểm:**

- Toàn quyền kiểm soát luồng xác thực, dễ tùy chỉnh theo yêu cầu cụ thể.
- bcrypt là thuật toán hash mật khẩu đã được chứng minh an toàn, tự động thêm salt.
- JWT cho phép xác thực stateless, giảm tải cho server khi không cần lưu session.

**Rủi ro:**

- Cần tự triển khai các cơ chế bảo mật như refresh token rotation, token blacklist khi đăng xuất, và bảo vệ chống CSRF/XSS. Giảm thiểu bằng cách tuân thủ các best practices đã có sẵn tài liệu hướng dẫn và review code kỹ phần authentication.
- Lỗ hổng bảo mật tiềm ẩn nếu triển khai không đúng cách. Giảm thiểu bằng cách đưa phần authentication vào review ưu tiên cao nhất.

#### AI Services: Gemini API (Google)

**Lý do lựa chọn:** Gemini là model multimodal (hỗ trợ cả text và image), phù hợp hoàn hảo với yêu cầu của AI Planning (người dùng có thể chụp ảnh bảng hoặc nhập văn bản). Tier miễn phí đủ cho giai đoạn phát triển và demo.

**Ưu điểm:**

- Hỗ trợ tiếng Việt tốt, quan trọng cho sản phẩm nhắm đến người dùng Việt Nam.
- API đơn giản, tài liệu rõ ràng, tích hợp nhanh.
- Xử lý đa phương thức (text + image) trong cùng một API call, không cần pipeline OCR riêng.

**Rủi ro:**

- Phụ thuộc vào dịch vụ bên ngoài: nếu API gặp sự cố hoặc thay đổi pricing, ứng dụng sẽ bị ảnh hưởng. Giảm thiểu bằng cách thiết kế lớp abstraction (AI service layer) để có thể chuyển sang provider khác nếu cần.
- Rate limit trên tier miễn phí có thể giới hạn số lượng request. Giảm thiểu bằng cách cache kết quả AI và giới hạn số request mỗi người dùng mỗi ngày.
- Chất lượng output của AI không đồng đều, đặc biệt với input phức tạp hoặc ảnh chất lượng thấp. Giảm thiểu bằng cách thiết kế prompt kỹ lưỡng và cho phép người dùng chỉnh sửa kết quả AI tạo ra.|

---

## 8. Phân công vai trò và Trách nhiệm

### 8.1. Bảng phân công chi tiết

| Thành viên            | Vai trò chính   | Phạm vi trách nhiệm                                                     |
| --------------------- | --------------- | ----------------------------------------------------------------------- |
| Thái Nguyễn Tuấn Kiệt | PM + UI/UX      | Quản lý tiến độ, soạn specs, thiết kế wireframe/UI, báo cáo Sprint      |
| Nguyễn Thế Quân       | Architect + Dev | Thiết kế kiến trúc hệ thống, database schema, API design, dev fullstack |
| Nguyễn Minh Phát      | QA + Dev        | Viết test plan/cases, thực hiện kiểm thử, hỗ trợ dev backend            |
| Nguyễn Phương Gia Bảo | Frontend Leader | Lead team frontend, implement UI components, tích hợp API               |
| Ngô Văn Phong         | Backend Leader  | Lead team backend, implement API endpoints, quản lý database            |

### 8.2. Ma trận RACI (cho các hoạt động chính)

| Hoạt động                | Kiệt (PM) | Quân (Arch) | Phát (QA) | Bảo (FE) | Phong (BE) |
| ------------------------ | --------- | ----------- | --------- | -------- | ---------- |
| Quản lý tiến độ Sprint   | R/A       | C           | I         | I        | I          |
| Thiết kế kiến trúc       | C         | R/A         | I         | C        | C          |
| Thiết kế UI/UX           | R/A       | C           | I         | C        | I          |
| Phát triển Frontend      | I         | C           | I         | R/A      | I          |
| Phát triển Backend       | I         | C           | I         | I        | R/A        |
| Tích hợp AI (Gemini API) | I         | R           | I         | C        | A          |
| Kiểm thử (Testing)       | I         | I           | R/A       | C        | C          |
| Báo cáo & Tài liệu       | R/A       | C           | C         | I        | I          |

_R = Responsible (Thực hiện), A = Accountable (Chịu trách nhiệm), C = Consulted (Tham vấn), I = Informed (Được thông báo)_

---

## 9. Kế hoạch thực hiện (Project Schedule)

### 9.1. Tổng quan Sprint (RUP + Scrum)

| Giai đoạn (RUP)         | Sprint | Bắt đầu | Kết thúc | Bài tập  | Mục tiêu chính                                         |
| ----------------------- | ------ | ------- | -------- | -------- | ------------------------------------------------------ |
| Inception (Khởi tạo)    | 1      | 21/6    | 28/6     | PA0      | Đề xuất dự án, thiết lập công cụ, phỏng vấn người dùng |
| Elaboration (Phác thảo) | 2      | 29/6    | 12/7     | PA1, PA2 | Tài liệu yêu cầu, Use Cases, thiết kế ban đầu          |
| Elaboration (Phác thảo) | 3      | 13/7    | 26/7     | PA3      | Thiết kế chi tiết, test plan, working software v1      |
| Construction (Xây dựng) | 4      | 27/7    | 9/8      | PA4      | Implement core features, testing                       |
| Construction (Xây dựng) | 5      | 10/8    | 23/8     | PA5      | Hoàn thiện, kiểm thử, triển khai                       |

### 9.2. Chi tiết Sprint 1 (21/6 - 28/6) - Hiện tại

| Task                   | Người phụ trách | Trạng thái   |
| ---------------------- | --------------- | ------------ |
| Đăng ký nhóm           | Kiệt (PM)       | Hoàn thành   |
| Soạn đề xuất dự án     | Kiệt (PM)       | Hoàn thành   |
| Phỏng vấn 5 người dùng | Cả nhóm         | Chưa bắt đầu |
| Thiết lập GitHub repo  | Quân (Arch)     | Hoàn thành   |
| Thiết lập JIRA board   | Kiệt (PM)       | Hoàn thành   |
| Thiết lập Discord      | Kiệt (PM)       | Hoàn thành   |

---

## 10. Phân tích rủi ro

| STT | Rủi ro                                      | Mức độ     | Xác suất   | Biện pháp giảm thiểu                                          |
| --- | ------------------------------------------- | ---------- | ---------- | ------------------------------------------------------------- |
| 1   | Vượt quá khả năng thực hiện (scope creep)   | Cao        | Cao        | Định nghĩa rõ MVP, ưu tiên tính năng, review mỗi Sprint       |
| 2   | Tích hợp AI không ổn định (Gemini API)      | Cao        | Trung bình | Có phương án fallback (mock data), xử lý lỗi graceful         |
| 3   | Thành viên thiếu kinh nghiệm với tech stack | Trung bình | Trung bình | Dành thời gian Sprint 1-2 để học, pair programming            |
| 4   | Xung đột lịch trình các thành viên          | Trung bình | Cao        | Họp daily standup ngắn, dùng tool async (Discord)             |
| 5   | Database schema thay đổi giữa các Sprint    | Trung bình | Trung bình | Sử dụng Prisma migration, thiết kế schema cẩn thận ở Sprint 2 |
| 6   | Bảo mật dữ liệu người dùng                  | Cao        | Thấp       | Sử dụng HTTPS, hash password, validate input, CORS config     |
| 7   | API rate limit của Gemini                   | Trung bình | Trung bình | Cache kết quả AI, giới hạn số request/user/ngày               |

---

## 11. Giá trị kỳ vọng và Định hướng MVP

### 11.1. Giá trị kỳ vọng

Planning AI hướng tới việc giúp người dùng:

- Giảm thời gian lập kế hoạch thủ công nhờ AI phân tích tự động
- Bắt đầu công việc nhanh hơn với kế hoạch hành động rõ ràng
- Duy trì sự tập trung tốt hơn với Focus Session tích hợp
- Hoàn thành công việc đúng hạn nhờ theo dõi tiến độ trực quan
- Xác nhận mức độ hoàn thành và ăn mừng thành quả với Celebration & Moment Capture (cùng tùy chọn AI Examiner)
- Xây dựng quy trình làm việc Plan - Focus - Verify đơn giản và dễ duy trì

### 11.2. Định hướng MVP

Trong giai đoạn đầu, nhóm tập trung xác thực ba giả thuyết chính:

1. **Giả thuyết 1:** Người dùng cần được hỗ trợ tạo kế hoạch hành động đầu tiên một cách nhanh chóng (-> AI Planning)
2. **Giả thuyết 2:** Người dùng hưởng lợi từ một quy trình tập trung đơn giản và ít ma sát (-> Focus Session)
3. **Giả thuyết 3:** Người dùng đánh giá cao việc nhìn lại quá trình, lưu giữ khoảnh khắc và xác nhận kết quả sau khi hoàn thành công việc (-> Celebration, Moment Capture & AI Verify)

**Phạm vi MVP (Thực hiện tuần tự Plan > Focus > Verify):**

- 3 tính năng cốt lõi: AI Planning, Focus Session, AI Verify
- Dashboard tổng hợp
- Hệ thống Authentication cơ bản
- 13 màn hình chính (bao gồm Moment Gallery)

---

## Phụ lục

### A. Checklist nộp PA0

- [x] Đăng ký nhóm qua Google Sheet
- [ ] Bản mô tả dự án hoàn chỉnh
- [ ] Phỏng vấn ít nhất 5 người dùng + bằng chứng
- [x] Thiết lập GitHub repo với cấu trúc /src, /docs, /pa
- [x] Thiết lập JIRA board
- [x] Thiết lập kênh Discord

### B. Các công việc còn lại

1. **Phỏng vấn người dùng:** Nhóm cần thực hiện khảo sát sàng lọc, lập bộ câu hỏi và phỏng vấn 5 người. Sau đó điền kết quả vào mục 5.

---

> **Ghi chú cuối:** Tài liệu này là bản cập nhật v1.5. Thay đổi chính so với v1.4: (1) Bổ sung Section 4.6 mô tả luồng tích hợp Plan-Focus-Verify liền mạch với 2 ví dụ hành trình người dùng thực tế (Gym và Sinh viên deadline), (2) Mở rộng mô tả Ảnh Khoảnh Khắc với timeline/gallery và thêm màn hình Moment Gallery (màn hình số 13), (3) Tinh chỉnh Verify phân biệt rõ 2 sub-type task học thuật (Học kiến thức vs Làm bài tập) và nhấn mạnh Verify luôn là tùy chọn, (4) Làm rõ phân kỳ ảnh minh họa subtask: MVP (text-based + user upload) vs Phase 2 (PDF/DOCX auto-crop). Cần bổ sung phần Phỏng vấn người dùng trước khi nộp PA0.
