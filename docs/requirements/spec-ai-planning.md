# ĐẶC TẢ TÍNH NĂNG: AI PLANNING (Specification Document)

> **Phiên bản:** v1.2
> **Ngày tạo:** 2026-07-02
> **Ngày cập nhật:** 2026-07-03
> **Tác giả:** PM Agent
> **Trạng thái:** Draft
> **Module:** AI Planning (Tính năng 1 - Ưu tiên cao nhất)
> **Sprint mục tiêu:** Sprint 2-3 (Elaboration)

---

## Mục lục

1. [Tổng quan tính năng](#1-tổng-quan-tính-năng)
2. [User Stories và Acceptance Criteria](#2-user-stories-và-acceptance-criteria)
3. [Màn hình liên quan](#3-màn-hình-liên-quan)
4. [Chi tiết chức năng](#4-chi-tiết-chức-năng)
5. [Phi chức năng](#5-phi-chức-năng)
6. [API Contracts sơ bộ](#6-api-contracts-sơ-bộ)
7. [Data Model sơ bộ](#7-data-model-sơ-bộ)
8. [Task Breakdown](#8-task-breakdown)
9. [Rủi ro và Giải pháp](#9-rủi-ro-và-giải-pháp)

---

## 1. Tổng quan tính năng

### 1.1. Mô tả

AI Planning là tính năng cốt lõi đầu tiên của Planning AI, cho phép người dùng nhập mục tiêu, deadline hoặc tải lên thông tin liên quan (văn bản, hình ảnh). Hệ thống sử dụng Gemini API để tự động phân tích đầu vào và chuyển đổi thành kế hoạch hành động có cấu trúc, bao gồm danh sách các task đã được phân loại, sắp xếp ưu tiên và chia nhỏ thành subtask.

### 1.2. Giá trị mang lại

- **Giảm thời gian lập kế hoạch:** Người dùng chỉ cần nhập thông tin thô, AI tự động tạo kế hoạch chi tiết thay vì phải tự sắp xếp thủ công.
- **Giải quyết choice paralysis:** Khi đối mặt với mục tiêu lớn, AI giúp chia nhỏ thành các bước cụ thể để người dùng biết bắt đầu từ đâu.
- **Phân loại tự động:** AI tự động phân biệt task học thuật và task sinh hoạt/công việc, phục vụ cho luồng Verify sau này.
- **Hình ảnh minh họa:** Mỗi subtask có thể kèm hình ảnh minh họa giúp người dùng nhìn trực quan hơn.

### 1.3. Đối tượng người dùng mục tiêu

| Nhóm người dùng                   | Nhu cầu chính                                                                                                                  |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Sinh viên đại học                 | Lập kế hoạch học tập, ôn thi, phân loại bài tập từ ảnh chụp bảng/tài liệu                                                     |
| Nhân viên văn phòng trẻ           | Tổ chức công việc, phân loại nhiệm vụ theo mức độ ưu tiên                                                                     |
| Người theo đuổi mục tiêu cá nhân | Xây dựng lộ trình rèn luyện (tập gym, thói quen mới), theo dõi sự tiến bộ trực quan qua hình ảnh (Moment Capture), duy trì động lực |

---

## 2. User Stories và Acceptance Criteria

### US-01: Tạo kế hoạch từ văn bản

**Nhu cầu:** Là một người dùng, tôi muốn nhập mô tả mục tiêu bằng văn bản để AI tự động tạo kế hoạch hành động cho tôi, giúp tôi không phải tự sắp xếp công việc thủ công.

**Acceptance Criteria:**

- [ ] AC-01.1: Người dùng có thể nhập mô tả mục tiêu vào ô văn bản (textarea) với giới hạn tối đa 5000 ký tự.
- [ ] AC-01.2: Người dùng có thể tùy chọn nhập tiêu đề kế hoạch (không bắt buộc, AI sẽ tự tạo nếu để trống).
- [ ] AC-01.3: Người dùng có thể tùy chọn nhập deadline tổng thể cho kế hoạch.
- [ ] AC-01.4: Khi nhấn nút "Tạo kế hoạch", hệ thống gửi dữ liệu đến backend và hiển thị trạng thái đang xử lý (loading).
- [ ] AC-01.5: AI trả về kế hoạch bao gồm: tiêu đề kế hoạch, danh sách các task, mỗi task có tiêu đề, mô tả, phân loại (học thuật / sinh hoạt), mức ưu tiên (cao / trung bình / thấp), và thứ tự thực hiện.
- [ ] AC-01.6: Thời gian phản hồi của AI không vượt quá 30 giây (đối với input chỉ có văn bản).
- [ ] AC-01.7: Nếu AI gặp lỗi, hiển thị thông báo lỗi rõ ràng và cho phép người dùng thử lại.
- [ ] AC-01.8: Nếu người dùng chọn deadline trong quá khứ, hiển thị lỗi "Deadline phải là ngày trong tương lai" và vô hiệu hóa nút tạo.
- [ ] AC-01.9: Nếu mô tả chỉ chứa khoảng trắng (spaces/newlines), nút "Tạo kế hoạch" bị vô hiệu hóa. Hiển thị gợi ý "Vui lòng nhập mô tả mục tiêu".
- [ ] AC-01.10: Khi AI xử lý vượt quá thời gian giới hạn (timeout), hiển thị thông báo "AI mất nhiều thời gian hơn dự kiến. Vui lòng thử lại" kèm nút "Thử lại" và nút "Hủy".

---

### US-02: Tạo kế hoạch từ văn bản kèm hình ảnh

**Nhu cầu:** Là một sinh viên, tôi muốn chụp ảnh bảng/bài tập và tải lên cùng với mô tả để AI phân tích hình ảnh và tạo kế hoạch tự động, giúp tôi không cần gõ lại toàn bộ nội dung.

**Acceptance Criteria:**

- [ ] AC-02.1: Người dùng có thể đính kèm tối đa 4 hình ảnh (JPEG, PNG, WebP) cùng với mô tả văn bản.
- [ ] AC-02.2: Mỗi hình ảnh có kích thước tối đa 10 MB.
- [ ] AC-02.3: Hiển thị preview của hình ảnh sau khi chọn, cho phép xóa hình ảnh đã chọn trước khi gửi.
- [ ] AC-02.4: AI phân tích nội dung hình ảnh (multimodal) kết hợp với văn bản để tạo kế hoạch phù hợp.
- [ ] AC-02.5: Thời gian phản hồi của AI không vượt quá 45 giây (đối với input có hình ảnh).
- [ ] AC-02.6: Nếu hình ảnh không rõ, AI vẫn tạo kế hoạch từ phần văn bản và ghi chú cảnh báo rằng hình ảnh không đủ rõ để phân tích.
- [ ] AC-02.7: Nếu người dùng upload file sai định dạng (ví dụ: PDF, GIF), hiển thị lỗi ngay lập tức "Chỉ chấp nhận ảnh định dạng JPEG, PNG, WebP" mà không gửi lên server.
- [ ] AC-02.8: Nếu một ảnh vượt quá 10MB, hiển thị lỗi "Kích thước ảnh không được vượt quá 10MB" và tự động loại bỏ ảnh đó khỏi danh sách.

---

### US-03: Xem chi tiết kế hoạch

**Nhu cầu:** Là một người dùng, tôi muốn xem chi tiết kế hoạch đã tạo bao gồm danh sách các task, trạng thái, mức ưu tiên và mô tả, để theo dõi tiến độ thực hiện.

**Acceptance Criteria:**

- [ ] AC-03.1: Màn hình hiển thị tiêu đề kế hoạch, mô tả gốc (input của người dùng), ngày tạo và trạng thái tổng thể.
- [ ] AC-03.2: Danh sách task mặc định hiển thị theo thứ tự thực hiện (order) với các thông tin: tiêu đề, mức ưu tiên (cao, trung bình, thấp), phân loại (học thuật / sinh hoạt), trạng thái (chưa bắt đầu / đang làm / hoàn thành).
- [ ] AC-03.3: Mỗi task có thể mở rộng để xem mô tả chi tiết và hình ảnh minh họa (nếu có).
- [ ] AC-03.4: Hiển thị thanh tiến độ (progress bar) phần trăm hoàn thành dựa trên số task đã hoàn thành / tổng số task.
- [ ] AC-03.5: Có nút quay về danh sách các kế hoạch (Dashboard hoặc danh sách Plans).
- [ ] AC-03.6: Khi truy cập một kế hoạch không tồn tại (đã xóa hoặc ID sai), hiển thị trang lỗi 404 với thông báo "Kế hoạch không tồn tại hoặc đã bị xóa" và nút quay về Dashboard.

---

### US-04: Chỉnh sửa kế hoạch thủ công

**Nhu cầu:** Là một người dùng, tôi muốn chỉnh sửa lại kế hoạch mà AI đã tạo (sửa tiêu đề, mô tả, xóa task, thêm task, thay đổi thứ tự) để kế hoạch phù hợp với nhu cầu thực tế của tôi.

**Acceptance Criteria:**

- [ ] AC-04.1: Người dùng có thể sửa tiêu đề và mô tả của kế hoạch.
- [ ] AC-04.2: Người dùng có thể sửa tiêu đề, mô tả, mức ưu tiên và phân loại của từng task.
- [ ] AC-04.3: Người dùng có thể xóa một task khỏi kế hoạch (có hộp thoại xác nhận trước khi xóa).
- [ ] AC-04.4: Người dùng có thể thêm một task mới vào kế hoạch (thủ công, không cần AI).
- [ ] AC-04.5: Người dùng có thể kéo-thả (drag and drop) để sắp xếp lại thứ tự các task trong cùng một kế hoạch. Không hỗ trợ kéo task sang kế hoạch khác.
- [ ] AC-04.6: Mỗi thay đổi được lưu tự động hoặc qua nút "Lưu thay đổi" rõ ràng.
- [ ] AC-04.7: Người dùng có thể thay đổi hình ảnh minh họa của task (upload ảnh mới hoặc xóa ảnh).
- [ ] AC-04.8: Khi lưu thay đổi (tự động hoặc thủ công) bị lỗi do mất kết nối mạng, hiển thị cảnh báo "Chưa thể lưu thay đổi, vui lòng kiểm tra kết nối" và giữ lại dữ liệu chưa lưu để người dùng thử lại.

---

### US-05: Quản lý trạng thái task

**Nhu cầu:** Là một người dùng, tôi muốn đánh dấu trạng thái hoàn thành cho từng task để theo dõi tiến độ thực hiện kế hoạch.

**Acceptance Criteria:**

- [ ] AC-05.1: Mỗi task có 3 trạng thái: "Chưa bắt đầu" (mặc định), "Đang làm", "Hoàn thành".
- [ ] AC-05.2: Người dùng có thể chuyển trạng thái task bằng cách click vào checkbox hoặc nút trạng thái.
- [ ] AC-05.3: Khi hoàn thành BẤT KỲ task nào (học thuật hay sinh hoạt), hệ thống luôn hiển thị Celebration Screen kèm tùy chọn Moment Capture (chụp ảnh khoảnh khắc để lưu giữ kỷ niệm, tạo dòng thời gian phát triển).
- [ ] AC-05.4: SAU Celebration, nếu task có phân loại "Học kiến thức" (academic + sub-type learning), hệ thống GỢI Ý AI Examiner (tùy chọn, không bắt buộc). Người dùng có thể tham gia hoặc bỏ qua.
- [ ] AC-05.5: Nếu task là "Làm bài tập" (academic + sub-type practice) hoặc "Sinh hoạt" (lifestyle), hệ thống chỉ hiển thị Celebration Screen, KHÔNG gợi ý AI Examiner.
- [ ] AC-05.6: Trạng thái kế hoạch tự động cập nhật khi tất cả task đều "Hoàn thành".
- [ ] AC-05.7: Người dùng có thể bỏ đánh dấu hoàn thành (Uncheck) cho task đã hoàn thành. Khi Uncheck, trạng thái task quay lại "Đang làm" và trạng thái tổng thể của kế hoạch tự động cập nhật tương ứng.
- [ ] AC-05.8: Khi cập nhật trạng thái task (Check/Uncheck) bị lỗi mạng, giao diện tự động hoàn tác (revert) trạng thái checkbox về giá trị cũ và hiển thị thông báo lỗi.

---

### US-06: Xóa kế hoạch

**Nhu cầu:** Là một người dùng, tôi muốn xóa một kế hoạch không còn cần thiết để giữ giao diện gọn gàng.

**Acceptance Criteria:**

- [ ] AC-06.1: Người dùng có thể xóa kế hoạch từ màn hình danh sách hoặc màn hình chi tiết.
- [ ] AC-06.2: Hiển thị hộp thoại xác nhận "Bạn có chắc chắn muốn xóa kế hoạch này? Toàn bộ task sẽ bị xóa." trước khi thực hiện.
- [ ] AC-06.3: Khi xóa kế hoạch, toàn bộ task liên quan cũng bị xóa (cascade delete).
- [ ] AC-06.4: Sau khi xóa, chuyển hướng người dùng về Dashboard.

---

### US-07: Xem danh sách kế hoạch

**Nhu cầu:** Là một người dùng, tôi muốn xem danh sách tất cả các kế hoạch đã tạo để dễ dàng truy cập và quản lý chúng.

**Acceptance Criteria:**

- [ ] AC-07.1: Dashboard hiển thị danh sách các kế hoạch của người dùng, sắp xếp theo ngày tạo (mới nhất lên trước).
- [ ] AC-07.2: Mỗi kế hoạch hiển thị: tiêu đề, ngày tạo, số task hoàn thành / tổng số task, trạng thái tổng thể.
- [ ] AC-07.3: Click vào kế hoạch sẽ chuyển đến màn hình Plan Details.
- [ ] AC-07.4: Khi không có kế hoạch nào, hiển thị Empty State với thông báo và nút "Tạo kế hoạch mới".
- [ ] AC-07.5: Danh sách kế hoạch sử dụng cơ chế phân trang (pagination) với nút chuyển trang khi số lượng kế hoạch vượt quá 10 mục.
- [ ] AC-07.6: Khi tải danh sách bị lỗi mạng, hiển thị trạng thái lỗi (Error State) kèm nút "Thử lại".

---

## 3. Màn hình liên quan

### 3.1. Tổng quan luồng màn hình

```
Dashboard (#4) --[Nút "Tạo kế hoạch mới"]--> Create Plan (#5)
Create Plan (#5) --[AI xử lý xong]--> Plan Details (#6)
Plan Details (#6) --[Click task]--> Task Management (#7)
Task Management (#7) --[Bắt đầu Focus]--> Focus Session (#8)
Focus Session (#8) --[Hoàn thành]--> Task Management (#7) + [Modal] Celebration Screen
[Modal] Celebration --[Chụp ảnh (tùy chọn)]--> [Modal] Moment Capture
[Modal] Celebration --[Nếu task 'Học kiến thức': Gợi ý]--> [Modal] AI Examiner
[Modal] Celebration/Examiner --[Đóng]--> Task Management (#7)
Plan Details (#6) --[Quay lại]--> Dashboard (#4)
```

> **Ghi chú thiết kế:** Các bước Celebration Screen, Moment Capture và gợi ý AI Examiner được thiết kế dưới dạng Modal/Overlay trên màn hình Task Management (#7), KHÔNG phải trang riêng biệt. Điều này giúp tránh làm rác Browser History và người dùng luôn ở lại đúng trang cần thiết sau khi đóng modal.

### 3.2. Màn hình #5: Create Plan (Tạo kế hoạch)

**Mục đích:** Cho phép người dùng nhập đầu vào (văn bản + hình ảnh) để AI tạo kế hoạch.

**Các thành phần giao diện:**

| Thành phần         | Loại                         | Mô tả                                                                                                                  |
| ------------------ | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Tiêu đề kế hoạch   | Input text (không bắt buộc)  | Placeholder: "Ví dụ: Ôn thi Giải tích cuối kỳ"                                                                         |
| Mô tả mục tiêu     | Textarea (bắt buộc)          | Placeholder: "Mô tả những gì bạn muốn hoàn thành...". Giới hạn 5000 ký tự. Hiển thị đếm ký tự.                         |
| Deadline           | Date picker (không bắt buộc) | Chọn ngày deadline cho kế hoạch                                                                                        |
| Đính kèm hình ảnh  | File upload zone             | Kéo-thả hoặc click để chọn. Tối đa 4 ảnh, mỗi ảnh tối đa 10MB. Định dạng: JPEG, PNG, WebP. Hiển thị preview thumbnail. |
| Nút "Tạo kế hoạch" | Button (primary)             | Bị vô hiệu hóa khi mô tả trống. Khi nhấn, gửi request và hiển thị loading.                                             |
| Trạng thái Loading | Loading overlay              | Hiển thị animation và thông báo "AI đang phân tích và tạo kế hoạch cho bạn..." với thanh tiến độ ước tính.             |
| Thông báo lỗi      | Alert/Toast                  | Hiển thị khi AI gặp lỗi, kèm nút "Thử lại".                                                                            |

**Hành vi đặc biệt:**

- Khi AI xử lý xong thành công, tự động chuyển sang màn hình Plan Details (#6).
- Khi mất kết nối mạng giữa lúc đang xử lý, hiển thị thông báo lỗi và cho phép thử lại.
- Validate phía client: mô tả không được trống, kích thước ảnh không vượt quá giới hạn.
- Validate deadline: không cho phép chọn ngày trong quá khứ. Nếu chọn ngày hôm nay, tự động set thành cuối ngày (23:59:59).

### 3.3. Màn hình #6: Plan Details (Chi tiết kế hoạch)

**Mục đích:** Hiển thị kế hoạch đã tạo, cho phép xem chi tiết và chỉnh sửa.

**Các thành phần giao diện:**

| Thành phần         | Loại                   | Mô tả                                                                                                                 |
| ------------------ | ---------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Tiêu đề kế hoạch   | Heading (có thể sửa)   | Click vào để chuyển sang chế độ chỉnh sửa (inline edit)                                                               |
| Mô tả kế hoạch     | Paragraph (có thể sửa) | Click vào để chuyển sang chế độ chỉnh sửa                                                                             |
| Thông tin meta     | Text                   | Ngày tạo, deadline (nếu có), trạng thái tổng thể                                                                      |
| Progress bar       | Progress indicator     | Hiển thị % hoàn thành (số task done / tổng)                                                                           |
| Danh sách task     | Card list              | Mỗi task là 1 card với: checkbox trạng thái, tiêu đề, badge phân loại, badge mức ưu tiên. Hỗ trợ kéo-thả sắp xếp lại. |
| Nút "Thêm task"    | Button (secondary)     | Mở form thêm task mới thủ công                                                                                        |
| Nút "Xóa kế hoạch" | Button (destructive)   | Hiển thị hộp thoại xác nhận trước khi xóa                                                                             |
| Nút "Quay lại"     | Button (ghost)         | Quay về Dashboard                                                                                                     |

**Hành vi đặc biệt:**

- Click vào 1 task card sẽ chuyển sang màn hình Task Management (#7) với chi tiết của task đó.
- Kéo-thả task card để thay đổi thứ tự, hệ thống tự động lưu vị trí mới.
- Badge phân loại hiển thị màu sắc khác nhau: học thuật (xanh dương), sinh hoạt (xanh lá).
- Badge mức ưu tiên hiển thị màu sắc khác nhau: cao (đỏ), trung bình (vàng), thấp (xám).

### 3.4. Màn hình #7: Task Management (Quản lý task)

**Mục đích:** Xem và chỉnh sửa chi tiết một task cụ thể.

**Các thành phần giao diện:**

| Thành phần          | Loại                        | Mô tả                                                                    |
| ------------------- | --------------------------- | ------------------------------------------------------------------------ |
| Tiêu đề task        | Heading (có thể sửa)        | Inline edit                                                              |
| Mô tả task          | Textarea (có thể sửa)       | Mô tả chi tiết công việc cần làm                                         |
| Hình ảnh minh họa   | Image (có thể thay đổi)     | Hiển thị hình ảnh minh họa của subtask. Nút upload ảnh mới hoặc xóa ảnh. |
| Phân loại           | Select dropdown             | Học thuật / Sinh hoạt                                                    |
| Mức ưu tiên         | Select dropdown             | Cao / Trung bình / Thấp                                                  |
| Trạng thái          | Select dropdown hoặc toggle | Chưa bắt đầu / Đang làm / Hoàn thành                                     |
| Thời gian ước tính  | Input number                | Số phút ước tính để hoàn thành task                                      |
| Deadline task       | Date picker                 | Deadline riêng cho task này                                              |
| Nút "Bắt đầu Focus" | Button (primary)            | Chuyển sang màn hình Focus Session (#8) với task này                     |
| Nút "Lưu thay đổi"  | Button                      | Lưu các chỉnh sửa                                                        |
| Nút "Xóa task"      | Button (destructive)        | Hộp thoại xác nhận trước khi xóa                                         |
| Nút "Quay lại"      | Button (ghost)              | Quay về Plan Details (#6)                                                |

**Hành vi đặc biệt:**

- Khi chuyển trạng thái sang "Hoàn thành":
  - BẤT KỲ loại task nào: Hiển thị Celebration Screen với tùy chọn Moment Capture (chụp ảnh khoảnh khắc).
  - Sau Celebration, nếu task là "Học kiến thức" (academic + sub-type learning): Hiển thị gợi ý "Bạn muốn AI kiểm tra kiến thức về task này không?" với nút "Kiểm tra ngay" (-> AI Examiner) và "Để sau".
  - Nếu task là "Làm bài tập" (academic + sub-type practice) hoặc "Sinh hoạt" (lifestyle): Chỉ hiển thị Celebration, không gợi ý Examiner.
- Nút "Bắt đầu Focus" chỉ hiển thị khi task chưa hoàn thành.

---

## 4. Chi tiết chức năng

### 4.1. Nhập đầu vào

**MVP (Sprint 2-3):**

| Loại đầu vào | Định dạng hỗ trợ | Giới hạn                   | Ghi chú                               |
| ------------ | ---------------- | -------------------------- | ------------------------------------- |
| Văn bản      | Plain text       | 5000 ký tự                 | Bắt buộc có ít nhất mô tả mục tiêu    |
| Hình ảnh     | JPEG, PNG, WebP  | Tối đa 4 ảnh, mỗi ảnh 10MB | Gemini API xử lý trực tiếp multimodal |

**Phase 2 (Sprint 4-5):**

| Loại đầu vào | Định dạng hỗ trợ | Giới hạn            | Ghi chú                        |
| ------------ | ---------------- | ------------------- | ------------------------------ |
| Tài liệu     | PDF, DOCX        | Tối đa 1 file, 20MB | Cần thêm file processing layer |

### 4.2. AI phân tích và tạo kế hoạch

**Luồng xử lý:**

```
1. Người dùng nhập mô tả + (tùy chọn) hình ảnh + (tùy chọn) deadline
2. Frontend validate dữ liệu và gửi POST /api/v1/plans
3. Backend nhận request, validate lại, chuẩn bị prompt
4. Backend gửi prompt + đầu vào multimodal đến Gemini API
5. Gemini API trả về kết quả dạng JSON (structured output)
6. Backend parse và validate kết quả AI
7. Backend lưu Plan + Tasks vào database
8. Backend trả về response cho Frontend
9. Frontend hiển thị kế hoạch trên màn hình Plan Details
```

**Yêu cầu đối với AI output:**

AI phải trả về dạng JSON với cấu trúc sau (backend BẮT BUỘC sử dụng tính năng Structured Outputs của Gemini API (truyền tham số `response_mime_type: 'application/json'` kèm `response_schema`) để đảm bảo 100% trả về JSON hợp lệ. Kết hợp thêm validation layer ở backend để kiểm tra nội dung):

```json
{
  "planTitle": "Tiêu đề kế hoạch (nếu người dùng không nhập)",
  "tasks": [
    {
      "title": "Tiêu đề task",
      "description": "Mô tả chi tiết công việc cần làm",
      "category": "academic | lifestyle",
      "subCategory": "learning | practice | general",
      "priority": "high | medium | low",
      "order": 1,
      "estimatedMinutes": 60,
      "imageDescription": "Mô tả hình ảnh minh họa (để AI sinh hoặc để Frontend hiển thị placeholder)"
    }
  ]
}
```

**Quy tắc phân loại task:**

- `academic` (học thuật): Các task liên quan đến học tập, nghiên cứu, ôn thi, đọc tài liệu, làm bài tập, viết báo cáo học thuật.
- `lifestyle` (sinh hoạt): Các task liên quan đến cuộc sống hàng ngày, công việc văn phòng, tập thể dục, mua sắm, dọn dẹp.

**Quy tắc phân loại phụ (subCategory):**

- `learning`: Các task liên quan đến việc tiếp thu kiến thức mới (ôn bài, đọc tài liệu, học lý thuyết, xem bài giảng).
- `practice`: Các task liên quan đến thực hành, làm bài tập, code, viết báo cáo.
- `general`: Mặc định cho tất cả task lifestyle.

**Quy tắc mức ưu tiên:**

- `high` (cao): Task có deadline gần, quan trọng, là tiền đề cho các task khác.
- `medium` (trung bình): Task cần làm nhưng không gấp.
- `low` (thấp): Task có thể hoãn lại, bổ sung.

### 4.3. Hình ảnh minh họa cho subtask

**MVP (Sprint 2-3):** AI tạo mô tả ảnh dạng text-based (`imageDescription`) cho mỗi subtask để người dùng hình dung nội dung cần làm. Nếu người dùng upload ảnh kèm input (ví dụ: ảnh chụp bảng, ảnh bài tập), hệ thống crop và gắn ảnh liên quan cho subtask tương ứng. Người dùng cũng có thể tự upload ảnh cho từng subtask.

**Phase 2 (Sprint 4-5):** Hỗ trợ xử lý file PDF/DOCX. Hệ thống tự động nhận diện cấu trúc tài liệu, crop đề bài từ từng phần và gán vào subtask tương ứng. Ví dụ: nếu người dùng tải lên file PDF bài tập, mỗi subtask sẽ hiển thị ảnh crop đề bài tương ứng.

### 4.4. Chỉnh sửa kế hoạch thủ công

- **Sửa tiêu đề/mô tả kế hoạch:** Inline edit, click vào text để chuyển sang input, click ngoài hoặc nhấn Enter để lưu.
- **Sửa task:** Chỉnh sửa từng trường (tiêu đề, mô tả, phân loại, mức ưu tiên, hình ảnh).
- **Xóa task:** Hộp thoại xác nhận -> Gọi DELETE API -> Cập nhật UI.
- **Thêm task mới:** Form modal với các trường: tiêu đề (bắt buộc), mô tả, phân loại, mức ưu tiên.
- **Sắp xếp lại:** Drag and drop các task card -> Gửi PATCH API cập nhật thứ tự.

### 4.5. CRUD Operations

| Thao tác | Đối tượng | Mô tả                                                                |
| -------- | --------- | -------------------------------------------------------------------- |
| Create   | Plan      | Tạo kế hoạch mới qua AI hoặc thủ công                                |
| Read     | Plan      | Xem danh sách kế hoạch, xem chi tiết 1 kế hoạch                      |
| Update   | Plan      | Sửa tiêu đề, mô tả, trạng thái kế hoạch                              |
| Delete   | Plan      | Xóa kế hoạch (cascade xóa tất cả task)                               |
| Create   | Task      | Thêm task mới thủ công vào kế hoạch                                  |
| Read     | Task      | Xem danh sách task, xem chi tiết 1 task                              |
| Update   | Task      | Sửa tiêu đề, mô tả, phân loại, ưu tiên, trạng thái, thứ tự, hình ảnh |
| Delete   | Task      | Xóa 1 task khỏi kế hoạch                                             |

---

## 5. Phi chức năng

### 5.1. Hiệu năng (Performance)

| Chỉ số                                     | Yêu cầu              | Ghi chú                                                  |
| ------------------------------------------ | -------------------- | -------------------------------------------------------- |
| Thời gian phản hồi AI (chỉ văn bản)        | Dưới 30 giây         | Tính từ lúc người dùng nhấn nút đến khi hiển thị kết quả |
| Thời gian phản hồi AI (văn bản + hình ảnh) | Dưới 45 giây         | Gemini xử lý multimodal chậm hơn                         |
| Thời gian tải trang Plan Details           | Dưới 2 giây          | Gồm cả API call và render                                |
| Thời gian lưu chỉnh sửa task               | Dưới 1 giây          | Feedback tức thời cho người dùng                         |
| Kích thước ảnh upload                      | Tối đa 10MB/ảnh      | Client-side validation trước khi upload                  |
| Tổng số kế hoạch / người dùng              | Không giới hạn (MVP) | Có thể cần pagination khi danh sách lớn                  |

### 5.2. Bảo mật (Security)

| Yêu cầu                    | Chi tiết                                                                                             |
| -------------------------- | ---------------------------------------------------------------------------------------------------- |
| Authentication             | Mọi API endpoint module AI Planning yêu cầu JWT token hợp lệ                                         |
| Authorization              | Người dùng chỉ có thể truy cập kế hoạch và task của chính mình                                       |
| Input validation (Backend) | Validate tất cả input: độ dài văn bản, định dạng ảnh, kích thước ảnh, kiểu dữ liệu                   |
| Rate limiting              | Giới hạn tạo kế hoạch AI: tối đa 10 lần/người dùng/giờ (phòng tránh lạm dụng Gemini API)             |
| File upload                | Chỉ chấp nhận định dạng JPEG, PNG, WebP. Kiểm tra MIME type thực tế (không chỉ dựa vào phần mở rộng) |
| SQL Injection              | Prisma ORM đã xử lý sẵn, nhưng vẫn cần review các raw query (nếu có)                                 |
| XSS                        | Escape output khi hiển thị nội dung do AI tạo ra                                                     |

### 5.3. Trải nghiệm người dùng (UX)

| Tình huống                  | Xử lý                                                                                                       |
| --------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Đang tải kế hoạch (Loading) | Hiển thị skeleton loading hoặc spinner với thông báo "AI đang phân tích..."                                 |
| AI gặp lỗi                  | Hiển thị thông báo lỗi cụ thể (ví dụ: "AI tạm thời không khả dụng, vui lòng thử lại sau") với nút "Thử lại" |
| Lỗi mạng                    | Hiển thị thông báo "Mất kết nối mạng. Vui lòng kiểm tra và thử lại."                                        |
| Không có kế hoạch nào       | Hiển thị Empty State: "Bạn chưa có kế hoạch nào. Hãy tạo kế hoạch đầu tiên!" với nút CTA                    |
| Xóa kế hoạch/task           | Hộp thoại xác nhận 2 bước để tránh xóa nhầm                                                                 |
| Form validation             | Hiển thị lỗi ngay dưới trường input sai, nút submit bị vô hiệu hóa khi form chưa hợp lệ                     |
| Offline                     | Không hỗ trợ offline cho MVP. Hiển thị thông báo khi mất mạng.                                              |

---

## 6. API Contracts sơ bộ

> **Lưu ý:** Đây là bản sơ bộ. Architect Agent sẽ chốt chính thức các endpoint, request/response schema và error codes.

### 6.1. Tạo kế hoạch mới (AI-powered)

```
POST /api/v1/plans
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Body:**

| Trường      | Kiểu              | Bắt buộc | Mô tả                                  |
| ----------- | ----------------- | -------- | -------------------------------------- |
| title       | string            | Không    | Tiêu đề kế hoạch (AI tự tạo nếu trống) |
| description | string            | Có       | Mô tả mục tiêu (tối đa 5000 ký tự)     |
| deadline    | string (ISO 8601) | Không    | Deadline tổng thể                      |
| images      | File[]            | Không    | Tối đa 4 file ảnh                      |

**Response thành công (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Tiêu đề kế hoạch",
    "description": "Mô tả gốc",
    "status": "active",
    "deadline": "2026-07-15T00:00:00Z",
    "progress": 0,
    "tasks": [
      {
        "id": "uuid",
        "title": "Tiêu đề task",
        "description": "Mô tả chi tiết",
        "category": "academic",
        "subCategory": "learning",
        "priority": "high",
        "status": "todo",
        "order": 1,
        "estimatedMinutes": 60,
        "imageUrl": null
      }
    ],
    "createdAt": "2026-07-02T10:00:00Z"
  }
}
```

**Response lỗi:**

| HTTP Status | Mã lỗi           | Mô tả                                                        |
| ----------- | ---------------- | ------------------------------------------------------------ |
| 400         | VALIDATION_ERROR | Input không hợp lệ (thiếu mô tả, ảnh quá lớn, sai định dạng) |
| 401         | UNAUTHORIZED     | Token không hợp lệ hoặc hết hạn                              |
| 429         | RATE_LIMITED     | Vượt quá giới hạn tạo kế hoạch (10 lần/giờ)                  |
| 500         | AI_SERVICE_ERROR | Gemini API gặp lỗi                                           |
| 503         | AI_UNAVAILABLE   | Gemini API không khả dụng                                    |

---

### 6.2. Lấy danh sách kế hoạch

```
GET /api/v1/plans
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

| Trường | Kiểu   | Mô tả                                                       |
| ------ | ------ | ----------------------------------------------------------- |
| page   | number | Trang hiện tại (mặc định: 1)                                |
| limit  | number | Số kế hoạch / trang (mặc định: 10, tối đa: 50)              |
| status | string | Lọc theo trạng thái: active, completed, all (mặc định: all) |

**Response thành công (200 OK):**

```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "uuid",
        "title": "Tiêu đề kế hoạch",
        "status": "active",
        "progress": 40,
        "totalTasks": 5,
        "completedTasks": 2,
        "createdAt": "2026-07-02T10:00:00Z",
        "deadline": "2026-07-15T00:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25
    }
  }
}
```

---

### 6.3. Lấy chi tiết kế hoạch

```
GET /api/v1/plans/:planId
Authorization: Bearer <jwt_token>
```

**Response thành công (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Tiêu đề kế hoạch",
    "description": "Mô tả gốc",
    "status": "active",
    "deadline": "2026-07-15T00:00:00Z",
    "progress": 40,
    "aiRawResponse": "...",
    "tasks": [
      {
        "id": "uuid",
        "title": "Tiêu đề task",
        "description": "Mô tả chi tiết",
        "category": "academic",
        "subCategory": "learning",
        "priority": "high",
        "status": "todo",
        "order": 1,
        "estimatedMinutes": 60,
        "imageUrl": "https://r2.example.com/tasks/uuid.jpg",
        "dueDate": "2026-07-10T00:00:00Z"
      }
    ],
    "createdAt": "2026-07-02T10:00:00Z",
    "updatedAt": "2026-07-03T08:00:00Z"
  }
}
```

**Response lỗi:**

| HTTP Status | Mã lỗi         | Mô tả                                                 |
| ----------- | -------------- | ----------------------------------------------------- |
| 404         | PLAN_NOT_FOUND | Kế hoạch không tồn tại hoặc không thuộc về người dùng |

---

### 6.4. Cập nhật kế hoạch

```
PATCH /api/v1/plans/:planId
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body (chỉ gửi các trường cần sửa):**

```json
{
  "title": "Tiêu đề mới",
  "description": "Mô tả mới",
  "status": "completed",
  "deadline": "2026-07-20T00:00:00Z"
}
```

**Response thành công (200 OK):** Trả về kế hoạch đã cập nhật (cùng format với GET chi tiết).

---

### 6.5. Xóa kế hoạch

```
DELETE /api/v1/plans/:planId
Authorization: Bearer <jwt_token>
```

**Response thành công (200 OK):**

```json
{
  "success": true,
  "message": "Kế hoạch đã được xóa thành công."
}
```

---

### 6.6. Thêm task mới (thủ công)

```
POST /api/v1/plans/:planId/tasks
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Tiêu đề task mới",
  "description": "Mô tả chi tiết",
  "category": "academic",
  "subCategory": "practice",
  "priority": "medium",
  "estimatedMinutes": 30,
  "dueDate": "2026-07-10T00:00:00Z"
}
```

**Response thành công (201 Created):** Trả về task vừa tạo.

---

### 6.7. Cập nhật task

```
PATCH /api/v1/plans/:planId/tasks/:taskId
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body (chỉ gửi các trường cần sửa):**

```json
{
  "title": "Tiêu đề mới",
  "status": "in_progress",
  "priority": "high",
  "subCategory": "learning",
  "order": 3
}
```

---

### 6.8. Xóa task

```
DELETE /api/v1/plans/:planId/tasks/:taskId
Authorization: Bearer <jwt_token>
```

**Response thành công (200 OK):**

```json
{
  "success": true,
  "message": "Task đã được xóa thành công."
}
```

---

### 6.9. Lấy URL upload ảnh cho task (Presigned URL)

```
GET /api/v1/plans/:planId/tasks/:taskId/upload-url
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

| Trường   | Kiểu   | Mô tả                              |
| -------- | ------ | ---------------------------------- |
| fileType | string | Định dạng ảnh: jpeg, png, webp     |

**Response thành công (200 OK):**

```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://r2.example.com/signed-url?...",
    "publicUrl": "https://r2.example.com/tasks/uuid.jpg",
    "expiresIn": 300
  }
}
```

> **Ghi chú:** Frontend sử dụng `uploadUrl` để PUT file trực tiếp lên Cloudflare R2. Sau khi upload thành công, gọi `PATCH /api/v1/plans/:planId/tasks/:taskId` để cập nhật `imageUrl` = `publicUrl`. URL ký không hết hạn sau 5 phút (300 giây).

**Response lỗi:**

| HTTP Status | Mã lỗi             | Mô tả                              |
| ----------- | ------------------- | ---------------------------------- |
| 400         | INVALID_FILE_TYPE   | Định dạng file không được hỗ trợ   |
| 404         | TASK_NOT_FOUND      | Task không tồn tại                 |

---

### 6.10. Sắp xếp lại thứ tự task (batch update)

```
PATCH /api/v1/plans/:planId/tasks/reorder
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "taskOrders": [
    { "taskId": "uuid-1", "order": 1 },
    { "taskId": "uuid-2", "order": 2 },
    { "taskId": "uuid-3", "order": 3 }
  ]
}
```

**Response thành công (200 OK):**

```json
{
  "success": true,
  "message": "Thứ tự task đã được cập nhật."
}
```

> **Ghi chú kỹ thuật:** Backend bắt buộc sử dụng `prisma.$transaction([...])` để cập nhật đồng thời toàn bộ thứ tự, đảm bảo tính toàn vẹn dữ liệu khi nhiều task thay đổi order cùng lúc.

---

## 7. Data Model sơ bộ

> **Tham chiếu:** ERD từ `docs/analysis and design/high-level-architecture.md` (Mục 4.3)
> **Lưu ý:** Đây là bản sơ bộ. Architect Agent sẽ chốt chính thức schema Prisma.

### 7.1. Bảng PLAN

| Trường          | Kiểu         | Ràng buộc                  | Mô tả                                       |
| --------------- | ------------ | -------------------------- | ------------------------------------------- |
| id              | UUID         | PK, auto-gen               | Khóa chính                                  |
| user_id         | UUID         | FK -> USER.id, NOT NULL    | Người tạo kế hoạch                          |
| title           | VARCHAR(255) | NOT NULL                   | Tiêu đề kế hoạch                            |
| description     | TEXT         | NOT NULL                   | Mô tả gốc (input của người dùng)            |
| ai_raw_response | JSONB        | Nullable                   | Response gốc từ Gemini API (để debug/audit, truy vấn trực tiếp trong PostgreSQL) |
| status          | ENUM         | NOT NULL, default 'active' | Giá trị: 'active', 'completed', 'archived'  |
| deadline        | TIMESTAMP    | Nullable                   | Deadline tổng thể                           |
| created_at      | TIMESTAMP    | NOT NULL, default now()    | Ngày tạo                                    |
| updated_at      | TIMESTAMP    | NOT NULL, auto-update      | Ngày cập nhật                               |

### 7.2. Bảng TASK

| Trường            | Kiểu         | Ràng buộc                                  | Mô tả                                  |
| ----------------- | ------------ | ------------------------------------------ | -------------------------------------- |
| id                | UUID         | PK, auto-gen                               | Khóa chính                             |
| plan_id           | UUID         | FK -> PLAN.id, NOT NULL, ON DELETE CASCADE | Kế hoạch cha                           |
| title             | VARCHAR(255) | NOT NULL                                   | Tiêu đề task                           |
| description       | TEXT         | Nullable                                   | Mô tả chi tiết                         |
| image_url         | VARCHAR(500) | Nullable                                   | Đường dẫn hình ảnh minh họa            |
| category          | ENUM         | NOT NULL                                   | Giá trị: 'academic', 'lifestyle'       |
| sub_category      | ENUM         | NOT NULL, default 'general'                | Phân loại phụ: 'learning', 'practice', 'general'. 'learning' = học kiến thức (ôn bài, đọc tài liệu), 'practice' = làm bài tập/thực hành, 'general' = mặc định cho lifestyle. |
| priority          | ENUM         | NOT NULL, default 'medium'                 | Giá trị: 'high', 'medium', 'low'       |
| status            | ENUM         | NOT NULL, default 'todo'                   | Giá trị: 'todo', 'in_progress', 'done' |
| order             | INTEGER      | NOT NULL                                   | Thứ tự hiển thị trong kế hoạch         |
| estimated_minutes | INTEGER      | Nullable                                   | Thời gian ước tính (phút)              |
| due_date          | TIMESTAMP    | Nullable                                   | Deadline riêng cho task                |
| created_at        | TIMESTAMP    | NOT NULL, default now()                    | Ngày tạo                               |
| updated_at        | TIMESTAMP    | NOT NULL, auto-update                      | Ngày cập nhật                          |

### 7.3. Bảng MOMENT

| Trường     | Kiểu         | Ràng buộc                                  | Mô tả                                              |
| ---------- | ------------ | ------------------------------------------ | -------------------------------------------------- |
| id         | UUID         | PK, auto-gen                               | Khóa chính                                         |
| task_id    | UUID         | FK -> TASK.id, NOT NULL, ON DELETE CASCADE | Task liên quan                                     |
| user_id    | UUID         | FK -> USER.id, NOT NULL                    | Người dùng tạo khoảnh khắc                         |
| image_url  | VARCHAR(500) | NOT NULL                                   | Đường dẫn ảnh trên Cloudflare R2                   |
| note       | TEXT         | Nullable                                   | Ghi chú kèm theo ảnh khoảnh khắc                  |
| created_at | TIMESTAMP    | NOT NULL, default now()                    | Ngày tạo                                           |

### 7.4. Quan hệ

```
USER (1) ---> (N) PLAN: Một người dùng có nhiều kế hoạch
PLAN (1) ---> (N) TASK: Một kế hoạch có nhiều task
TASK (1) ---> (N) FOCUS_SESSION: Một task có nhiều phiên tập trung (module Focus)
TASK (1) ---> (N) VERIFICATION: Một task có nhiều lần xác nhận (module Verify)
TASK (1) ---> (N) MOMENT: Một task có nhiều ảnh khoảnh khắc (Moment Capture)
```

### 7.5. Bổ sung so với ERD gốc

So với ERD trong high-level-architecture.md, bản spec này bổ sung:

- **PLAN**: Thêm trường `deadline` (TIMESTAMP) và `updated_at` (TIMESTAMP), đổi `status` từ string sang ENUM cố định. Đổi kiểu `ai_raw_response` từ TEXT sang JSONB.
- **TASK**: Thêm trường `order` (INTEGER) để hỗ trợ sắp xếp lại, đổi `category`, `priority`, `status` từ string sang ENUM cố định. Thêm `updated_at` (TIMESTAMP). Lưu ý: `image_url` trỏ đến Cloudflare R2. Bổ sung thêm trường `sub_category` (ENUM: 'learning', 'practice', 'general') để hỗ trợ phân loại phụ phục vụ luồng AI Examiner.
- **MOMENT**: Bảng mới, lưu ảnh khoảnh khắc khi người dùng hoàn thành task (Moment Capture). Trường `image_url` trỏ đến Cloudflare R2, tương tự `image_url` trong bảng TASK.

---

## 8. Task Breakdown

> **Phương pháp:** Scope of Impact Slicing - Phân tách theo phạm vi tác động thay vì đếm dòng code.
> **Ưu tiên:** DB Migration -> Backend API -> Frontend UI -> AI Integration
> **Format task ID:** `[TEAM]-[số thứ tự]`

### 8.1. Setup và Refactoring

| Task ID   | Tiêu đề                             | Mô tả                                                                                                                                              | Acceptance Criteria                                                                        | Dependencies | Effort   |
| --------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------ | -------- |
| SETUP-001 | Thiết lập cấu trúc thư mục Backend  | Tạo cấu trúc routes/, controllers/, services/, middlewares/, validators/ cho Backend Express.js. Cấu hình ESLint, Prettier.                        | Cấu trúc thư mục đã tạo, linter chạy không lỗi, có file README hướng dẫn                   | Không        | 0.5 ngày |
| SETUP-002 | Thiết lập cấu trúc thư mục Frontend | Tạo cấu trúc pages/, components/, hooks/, services/, types/ cho Frontend React. Cấu hình shadcn/ui, Tailwind, React Router.                        | Cấu trúc thư mục đã tạo, có trang demo Hello World, router hoạt động                       | Không        | 0.5 ngày |
| SETUP-003 | Cấu hình Gemini API Service Layer   | Tạo lớp abstraction (service layer) cho Gemini API để cách ly sự phụ thuộc vào provider AI. Bao gồm cấu hình API key, retry logic, error handling. | Service layer hoạt động, có thể gọi Gemini API thành công từ backend, có mock mode để test | Không        | 1 ngày   |

### 8.2. Database Migration

| Task ID | Tiêu đề                                         | Mô tả                                                                                                                             | Acceptance Criteria                                                                                          | Dependencies | Effort   |
| ------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------ | -------- |
| DB-001  | Tạo Prisma schema và migration cho Plan và Task | Định nghĩa model Plan và Task trong Prisma schema với đầy đủ các trường, ràng buộc và quan hệ như mục 7. Chạy migration tạo bảng. | Migration chạy thành công, bảng Plan và Task đã tồn tại trong PostgreSQL với đúng cấu trúc, có seed data mẫu | SETUP-001    | 0.5 ngày |

### 8.3. Backend API

| Task ID | Tiêu đề                                                 | Mô tả                                                                                                                                                                                                                       | Acceptance Criteria                                                                                                                                                                                            | Dependencies      | Effort   |
| ------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | -------- |
| BE-001  | Implement API tạo kế hoạch với AI (POST /plans)         | Xây dựng endpoint nhận input (text + images), gửi đến Gemini API, parse kết quả, lưu Plan + Tasks vào database, trả về response. Bao gồm: input validation (Zod), file upload (multer), prompt engineering, error handling. | API tạo kế hoạch thành công với input chỉ text; API tạo kế hoạch thành công với input text + ảnh; Trả về lỗi 400 khi thiếu mô tả; Trả về lỗi 429 khi vượt rate limit; Trả về lỗi 503 khi Gemini không khả dụng | DB-001, SETUP-003 | 3 ngày   |
| BE-002  | Implement API CRUD kế hoạch (GET, PATCH, DELETE /plans) | Xây dựng các endpoint: lấy danh sách kế hoạch (có pagination, filter), lấy chi tiết kế hoạch (kèm tasks), cập nhật kế hoạch, xóa kế hoạch (cascade).                                                                        | GET danh sách trả về đúng cấu trúc với pagination; GET chi tiết trả về plan + tasks sắp xếp theo order; PATCH cập nhật thành công; DELETE xóa plan và tất cả task liên quan; Trả về 404 khi plan không tồn tại | DB-001            | 1.5 ngày |
| BE-003  | Implement API CRUD task (POST, PATCH, DELETE /tasks)    | Xây dựng các endpoint: thêm task mới thủ công, cập nhật task (tiêu đề, mô tả, trạng thái, ưu tiên, phân loại), xóa task, sắp xếp lại thứ tự task (batch reorder).                                                           | Thêm task mới thành công với validation; Cập nhật trạng thái task hoạt động đúng; Xóa task hoạt động với cascade check; Reorder batch cập nhật đúng thứ tự; Trả về 404 khi task không tồn tại                  | DB-001            | 1.5 ngày |
| BE-004  | Implement API upload hình ảnh task                      | Xây dựng endpoint upload hình ảnh cho task: nhận file, validate (định dạng, MIME type, kích thước), lưu file, cập nhật image_url trong database.                                                                            | Upload ảnh thành công với JPEG, PNG, WebP; Từ chối file không hợp lệ (sai định dạng, quá lớn); Trả về đường dẫn ảnh sau khi upload                                                                             | DB-001, SETUP-001 | 1 ngày   |
| BE-005  | Implement middleware rate limiting cho AI endpoints     | Tạo middleware giới hạn số lần gọi AI endpoints (10 lần/người dùng/giờ). Sử dụng in-memory store (hoặc Redis nếu cần).                                                                                                      | Cho phép 10 request/giờ; Trả về 429 với thông báo rõ ràng khi vượt giới hạn; Rate limit riêng biệt cho từng người dùng                                                                                         | SETUP-001         | 0.5 ngày |

### 8.4. Frontend UI

| Task ID | Tiêu đề                                    | Mô tả                                                                                                                                                                                                                          | Acceptance Criteria                                                                                                                                                                                                                                        | Dependencies                                           | Effort   |
| ------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | -------- |
| FE-001  | Implement màn hình Create Plan (#5)        | Xây dựng giao diện nhập liệu: textarea mô tả, input tiêu đề, date picker deadline, khu vực upload ảnh (drag-drop, preview, xóa), nút "Tạo kế hoạch", trạng thái loading.                                                       | Form hiển thị đúng các thành phần theo spec; Validation hoạt động (mô tả bắt buộc, giới hạn ký tự, giới hạn ảnh); Preview ảnh hiển thị và có thể xóa; Loading state hiển thị khi đang xử lý; Chuyển sang Plan Details khi thành công                       | SETUP-002                                              | 2 ngày   |
| FE-002  | Implement màn hình Plan Details (#6)       | Xây dựng giao diện chi tiết kế hoạch: header với tiêu đề (inline edit), progress bar, danh sách task dạng card (với badge phân loại và ưu tiên), drag-and-drop sắp xếp, các nút thêm/xóa.                                      | Hiển thị đúng thông tin kế hoạch; Progress bar cập nhật đúng khi thay đổi trạng thái task; Inline edit tiêu đề hoạt động; Task cards hiển thị đúng badges; Drag-and-drop sắp xếp hoạt động và lưu thứ tự mới                                               | SETUP-002, FE-001                                      | 2.5 ngày |
| FE-003  | Implement màn hình Task Management (#7)    | Xây dựng giao diện chi tiết task: form sửa tiêu đề, mô tả, dropdown phân loại/ưu tiên/trạng thái, khu vực hình ảnh, nút Focus, nút xóa. Xử lý sự kiện khi chuyển trạng thái sang "Hoàn thành" (gợi ý Verify hoặc Celebration). | Form hiển thị đúng thông tin task; Sửa các trường và lưu thành công; Chuyển trạng thái hiển thị dialog phù hợp (học thuật -> gợi ý Verify, sinh hoạt -> Celebration); Upload/thay đổi ảnh hoạt động; Nút "Bắt đầu Focus" chỉ hiện khi task chưa hoàn thành | SETUP-002, FE-002                                      | 2 ngày   |
| FE-004  | Tích hợp API Backend vào Frontend          | Kết nối các màn hình FE với API Backend: tạo kế hoạch, lấy danh sách, lấy chi tiết, cập nhật, xóa kế hoạch, CRUD task, upload ảnh. Xử lý lỗi API, hiển thị loading/error states.                                               | Tạo kế hoạch từ FE gọi API thành công; Danh sách kế hoạch hiển thị dữ liệu thực; Chỉnh sửa và xóa hoạt động đúng; Error states hiển thị khi API lỗi; Loading states hiển thị trong quá trình gọi API                                                       | FE-001, FE-002, FE-003, BE-001, BE-002, BE-003, BE-004 | 2 ngày   |
| FE-005  | Implement Empty State và Error Handling UI | Xây dựng các trạng thái: Empty state (không có kế hoạch), Error state (API lỗi, mất mạng), Confirmation dialogs (xác nhận xóa).                                                                                                | Empty state hiển thị đúng với CTA; Error state hiển thị thông báo và nút thử lại; Confirmation dialog hiển thị trước khi xóa; Mất mạng hiển thị cảnh báo                                                                                                   | SETUP-002                                              | 1 ngày   |

### 8.5. AI Integration

| Task ID | Tiêu đề                                   | Mô tả                                                                                                                                                                                               | Acceptance Criteria                                                                                                                                              | Dependencies      | Effort   |
| ------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | -------- |
| AI-001  | Thiết kế và tối ưu prompt cho AI Planning | Thiết kế prompt template để Gemini API tạo kế hoạch có cấu trúc (JSON), phân loại task, đề xuất ưu tiên, ước lượng thời gian. Thử nghiệm và tinh chỉnh prompt để đảm bảo chất lượng output ổn định. | Prompt tạo ra JSON hợp lệ 95% các lần; Phân loại academic/lifestyle chính xác; Mức ưu tiên hợp lý; Thời gian ước tính thực tế; Hỗ trợ cả tiếng Việt và tiếng Anh | SETUP-003         | 2 ngày   |
| AI-002  | Implement xử lý multimodal (text + image) | Bổ sung khả năng gửi hình ảnh cùng với text đến Gemini API. Xử lý các trường hợp: ảnh rõ, ảnh mờ, nhiều ảnh, ảnh không liên quan.                                                                   | AI phân tích đúng nội dung ảnh kết hợp text; Cảnh báo khi ảnh không đủ rõ; Xử lý được nhiều ảnh trong 1 request; Fallback về chỉ text khi ảnh gặp lỗi            | SETUP-003, AI-001 | 1.5 ngày |

### 8.6. Tóm tắt Effort

| Nhóm                 | Số task | Tổng effort ước tính |
| -------------------- | ------- | -------------------- |
| Setup và Refactoring | 3       | 2 ngày               |
| Database Migration   | 1       | 0.5 ngày             |
| Backend API          | 5       | 7.5 ngày             |
| Frontend UI          | 5       | 9.5 ngày             |
| AI Integration       | 2       | 3.5 ngày             |
| **Tổng cộng**        | **16**  | **23 ngày công**     |

### 8.7. Biểu đồ phụ thuộc (Dependency Graph)

```
SETUP-001 ──> DB-001 ──> BE-001 ──> FE-004
              │          BE-002 ──> FE-004
              │          BE-003 ──> FE-004
              │          BE-004 ──> FE-004
              │
SETUP-002 ──> FE-001 ──> FE-002 ──> FE-003 ──> FE-004
              │
              FE-005
              │
SETUP-003 ──> AI-001 ──> AI-002
              │          │
              └──────────> BE-001
              │
              BE-005
```

### 8.8. Đề xuất thứ tự thực hiện

**Đợt 1 (Song song, ngày 1-2):** SETUP-001 + SETUP-002 + SETUP-003

**Đợt 2 (Song song, ngày 2-3):** DB-001 + FE-001 + AI-001

**Đợt 3 (Song song, ngày 3-6):** BE-001 + BE-002 + BE-003 + FE-002 + AI-002

**Đợt 4 (Song song, ngày 6-8):** BE-004 + BE-005 + FE-003 + FE-005

**Đợt 5 (Tích hợp, ngày 8-10):** FE-004 (tích hợp toàn bộ FE + BE)

---

## 9. Rủi ro và Giải pháp

| STT | Rủi ro                                                                   | Mức độ     | Xác suất   | Giải pháp giảm thiểu                                                                                                                                                       |
| --- | ------------------------------------------------------------------------ | ---------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Gemini API trả về JSON không hợp lệ hoặc cấu trúc sai                    | Cao        | Trung bình | Sử dụng Structured Outputs của Gemini API (`response_mime_type: 'application/json'` + `response_schema`) để đảm bảo 100% trả về JSON hợp lệ. Thêm validation layer ở backend để kiểm tra nội dung và cấu trúc. Có fallback response mặc định khi nội dung không hợp lý. |
| 2   | Gemini API không khả dụng (downtime, rate limit)                         | Cao        | Thấp       | Implement retry logic với exponential backoff (3 lần). Hiển thị thông báo lỗi thân thiện. Lưu response AI để tránh gọi lại. Cache kết quả thành công.                      |
| 3   | Chất lượng AI output không ổn định (phân loại sai, ưu tiên không hợp lý) | Trung bình | Trung bình | Cho phép người dùng chỉnh sửa toàn bộ output của AI (tiêu đề, mô tả, phân loại, ưu tiên). Prompt engineering cẩn thận với nhiều ví dụ. Thử nghiệm kỹ với nhiều kiểu input. |
| 4   | Thời gian phản hồi AI quá lâu (vượt quá 45 giây)                         | Trung bình | Trung bình | Đặt timeout 60 giây cho Gemini API call. Hiển thị thanh tiến độ ước tính. Cho phép người dùng hủy request. Giảm kích thước ảnh trước khi gửi (client-side compression).    |
| 5   | Upload hình ảnh gặp lỗi (file quá lớn, định dạng sai, lỗi mạng)          | Thấp       | Trung bình | Validate kích thước và định dạng phía client trước khi upload. Hiển thị progress bar khi upload. Cho phép thử lại khi thất bại.                                            |
| 6   | Drag-and-drop sắp xếp task không hoạt động trên một số trình duyệt       | Thấp       | Thấp       | Sử dụng thư viện đã được kiểm chứng (ví dụ: dnd-kit hoặc react-beautiful-dnd). Test trên Chrome, Edge, Firefox. Có fallback là nút di chuyển lên/xuống.                    |
| 7   | Xung đột dữ liệu khi nhiều tab cùng mở 1 kế hoạch                        | Thấp       | Thấp       | MVP không xử lý real-time sync. Sử dụng chiến lược "last write wins". Hiển thị cảnh báo nếu dữ liệu đã thay đổi trên server.                                               |
| 8   | File ảnh "mồ côi" (orphan) trên Cloudflare R2 khi người dùng hủy thao tác upload giữa chừng | Thấp | Trung bình | Thiết lập Lifecycle Rule (TTL) trên Cloudflare R2: tự động xóa file trong thư mục tạm (temp/) sau 24 giờ nếu chưa được xác nhận gán vào thực thể chính thức trong database. |

---

> **Ghi chú cuối:** Đây là bản spec v1.2 cho module AI Planning. Các thay đổi chính so với v1.1: (1) Thêm trường subCategory vào Data Model, AI Schema và API để hỗ trợ phân biệt 'Học kiến thức' và 'Làm bài tập', (2) Đổi API upload ảnh sang cơ chế Presigned URL để giảm tải cho Backend, (3) Ép Gemini sử dụng Structured Outputs (response_mime_type + response_schema), (4) Celebration/Moment Capture/AI Examiner thiết kế dạng Modal thay vì page riêng biệt, (5) Bổ sung hàng loạt Error Paths và Edge Cases cho các User Stories, (6) Đổi kiểu ai_raw_response từ TEXT sang JSONB, (7) Thêm rủi ro file orphan trên R2, (8) Sửa mặc định sắp xếp task theo order thay vì priority. Sau khi User duyệt, PM sẽ tạo GitHub Issues tương ứng với các task trong mục 8 và bàn giao cho Architect Agent để chốt chi tiết kỹ thuật.
