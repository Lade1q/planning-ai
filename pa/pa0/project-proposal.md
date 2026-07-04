# PROJECT PROPOSAL

_Recall AI - Trợ lý ôn tập chủ động, truy ngược tận gốc kiến thức còn yếu_

> **Môn học:** Nhập môn Công nghệ Phần mềm
> **Nhóm:** CAGT

---

## Mục lục

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

### 2.1. Tóm tắt ý tưởng

Recall AI là một web app giúp sinh viên biến tài liệu ôn tập (đề cương, slide, ghi chú) thành một kế hoạch ôn tập có cấu trúc, giúp sinh viên kiểm chứng xem mình thực sự hiểu kiến thức hay chỉ mới quen mặt chữ. Hệ thống dùng AI đóng vai trò giám khảo, đặt câu hỏi vấn đáp nhiều lượt dựa trên đúng tài liệu người dùng tải lên, đồng thời xây dựng một đồ thị quan hệ tiên quyết giữa các khái niệm trong tài liệu đó

Khi sinh viên trả lời sai, hệ thống không chỉ hẹn lại đúng câu đó sau vài ngày như phần lớn công cụ ôn tập hiện có - hệ thống truy ngược theo đồ thị để kiểm tra xem sinh viên có đang hổng một khái niệm nền hay không, và tự động chèn phần ôn lại khái niệm nền đó vào lịch trước khi quay lại với câu hỏi ban đầu. Đây là cơ chế được trình bày chi tiết ở mục 5.4, và là trọng tâm kỹ thuật của toàn bộ dự án.

### 2.2. Vấn đề & động lực

- **Học thụ động, ôn tập hời hợt:** Đa số sinh viên ôn tập bằng cách đọc lại hoặc gạch highlight - phương pháo có hiệu quả ghi nhớ thấp so với tự kiểm tra (retrieval practice) theo nghiên cứu tâm lý học nhận thức.
- **Không có cách khách quan để tự đánh giá:** Sinh viên khó biết mình đã "thuộc" hay chỉ "quen mặt chữ", vì không có ai kiểm tra được mức độ hiểu biết thực sự của mình.
- **Ôn tập không có kế hoạch:** Trước deadline hoặc kỳ thi, sinh viên thường ôn dồn, không chia nhỏ nội dung theo mức độ ưu tiên hoặc thời gian còn lại.

Ba vấn đề trên gắn chặt với nhau. AI ngày nay cóa thể giải quyết đồng thời hai phần: đọc hiểu tài liệu để lên kế hoạch, và đóng vai người hỏi để kiểm tra kiến thức - điều mà trước đây chỉ con người mới làm được. Tuy nhiên, như trình bày ở mục 2.3, việc "AI hỏi bài dựa trên tài liệu người dùng tải lên" hiện đã được nhiều công cụ thương mại triển khai ở mức vô cùng tốt. Khoảng trống mà nhóm xác định - và do đó là trọng tâm kỹ thuật của dự án - là: chưa công cụ nào truy vết được một câu trả lời sai về đúng khái niệm nền tảng gây ra nó, để ôn đúng gốc rễ thay vì lặp lại đúng triệu chứng.

### 2.3 Phân tích đối thủ cạnh tranh

Trước khi chốt hướng kỹ thuật, nhóm khảo sát các công cụ ôn tập bằng AI đang được sử dụng rộng rãi, cập nhật tính đến tháng 6/2026: Google NotebookLM, Quizlet (Q-Chat, Learn Mode), RemNote,, và phương án tự dùng Custom GPT/Claude Project. Kết quả khảo sát:

| Tiêu chí                                                   | NotebookLM                                                          | Quizlet                                  | RemNote                                                       | Tự tạo Custom GPT/Claude Project              | **Recall AI**                                               |
| ---------------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------- |
| Sinh câu hỏi/thẻ từ tài liệu riêng của người dùng          | Có                                                                  | Có (Magic Notes)                         | Có                                                            | Có, nhưng thủ công mỗi lần dán lại            | Có                                                          |
| Lặp lại ngắt quãng (spaced repetition)                     | Một phần (lọc "câu đã sai", chưa phải thuật toán khoảng lặp đầy đủ) | Có, trưởng thành từ 2017 (Learn Mode)    | Có, mô hình theo 3 trục: khả năng nhớ lại, độ ổn định, độ khó | Không có, phải tự nhớ mở lại                  | Có — bắt buộc phải làm tốt, không phải điểm khác biệt chính |
| Câu hỏi vận dụng/transfer, không chỉ hỏi định nghĩa        | Cần người dùng tự viết prompt tùy chỉnh                             | Có sẵn (chế độ "Apply My Knowledge")     | Không có                                                      | Cần tự biết prompt                            | Có sẵn, mặc định                                            |
| Vấn đáp hội thoại nhiều lượt, có trạng thái                | Rất mới (Learning Guide, 07/2026), chưa rõ độ sâu                   | Có, là chế độ tùy chọn người dùng tự bật | Không có (chỉ ghi chú + thẻ)                                  | Có, nhưng người dùng phải tự điều khiển luồng | Có, mặc định, giới hạn lượt rõ ràng                         |
| **Truy ngược khái niệm tiên quyết khi trả lời sai**        | **Không**                                                           | **Không**                                | **Không**                                                     | **Không**                                     | **Có**                                                      |
| Tối ưu cho tiếng Việt và thuật ngữ ngành kỹ thuật Việt Nam | Không phải trọng tâm                                                | Không phải trọng tâm                     | Không phải trọng tâm                                          | Tùy model, không chuyên biệt                  | Ngách hẹp, có thể đầu tư tốt hơn                            |

Trên 5 trong 6 tiêu chí so sánh, các công cụ hiện có - đặc biệt NotebookLM. Quizlet và RemNote - đã triển khai ở mức tốt, với nguồn lực và dữ liệu người dùng vượt xa quy mô một nhóm 5 sinh viên có thể đạt được trong 10 tuần. Vì vậy, nhóm không xem các tiêu chí này là điểm khác biệt của Recall AI, dù vẫn phải triển khai ở mức tốt để sản phẩm dùng được. Tiêu chí duy nhất chưa công cụ nào triển khai cho tài liệu tự do người dùng tải lên là **truy ngược theo quan hệ tiên quyết giữa các khái niệm khi phát hiện ra điểm yếu** - đây được chọn làm trọng tâm kỹ thuật của dự án, trình bày chi tiết ở mục 5.4.

Cơ chế truy ngược theo quan hệ tiên quyết không phải là một ý tưởng hoàn toàn mới trong khoa học giáo dục. Knowledge Space Theory - áp dụng trong nền tảng ALEKS suốt hơn 25 năm - dùng đúng nguyên lý này để mô hình hóa một đồ thị kỹ năng có quan hệ tiên quyết cho từng học sinh. Khác biệt của Recall AI là áp dụng nguyên lý này cho **tài liệu bất kỳ do người dùng tải lên**, thông qua trích xuất tự động bằng AI, thay vì yêu cầu một chương trình học được chuyên gia dựng sẵn như ALEKS chỉ áp dụng cho toán, hóa, thống kê.

### 2.4 Kết quả mong muốn

- Sinh viên tải tài liệu ôn tập lên và nhận được một kế hoạch ôn tập có cấu trúc, sắp xếp theo deadline, trong vòng vài phút.
- Luân phiên vấn đáp nhiều lượt, hệ thống phân biệt được câu trả lời học vẹt và câu trả lời thực sự hiểu bản chất, dựa trên bằng chứng cụ thể trong hội thoại.
- Khi phát hiện một khái niệm bị yếu, hệ thống tự động xác định và đề xuất ôn lại đúng khái niệm nền tảng gây ra điểm yếu đó, không chờ sinh viên tự nhận ra.
- Đến cuối kỳ ôn tập, sinh viên có một bức tranh trực quan (đồ thị khái niệm tô màu theo mức độ vững/yếu) về toàn bộ môn học, thay vì một danh sách điểm số rời rạc.
- Nhóm chứng minh được năng lực thiết kế và cài đặt một hệ thống có logic điều phối thật (thuật toán lập lịch, truy ngược đồ thị) đứng sau lớp giao diện gọi AI.

---

## 3. Đối tượng người dùng

Sinh viên năm 1-2 các ngành kỹ thuật/khoa học tự nhiên, đặc biệt có các môn có khối lượng lý thuyết lớn và có cấu trúc khái niệm phân tầng rõ ràng - nghĩa là việc hiểu một khái niệm thường đòi hỏi đã nắm vững khái niệm trước đó (ví dụ: mạng máy tính, hệ điều hành, DSA, các môn đại cương). Đặc điểm "phân tầng" này là điều kiện để tính năng truy ngược the quan hệ tiên quyết (mục 5.4) phát huy giá trị; với các môn có nội dung rời rạc, không phụ thuộc nhau, hệ thống vẫn hoạt động nhưng vận hành gần với một công cụ ôn tập bằng AI thông thường.

---

## 4. Giá trị cốt lõi & vòng lặp trải nghiệm

1. **Ingest & Map:** AI đọc tài liệu ôn tập (text hoặc ảnh chụp), trích xuất danh sách khái niệm và quan hệ tiên quyết giữa chúng. Người dùng xem lại và có thể chỉnh sửa đồ thị trước khi bắt đầu học.

2. **Schedule:** Hệ thống xếp các khái niệm thành các phiên ôn tập nhỏ, ưu tiên theo deadline người dùng cung cấp và độ khó ước lượng.

3. **Verify (Interview):** Sau mỗi phiên học (có hoặc không dùng Pomodoro), AI đóng vai giám khảo, phỏng vấn vấn đáp nhiều lượt dựa trên tài liệu đã tải lên, trong giới hạn số lượt được cấu hình trước, và ghi nhận điểm số hiểu bài cho từng khái niệm.

4. **Remediate:** Khi một khái niệm có điểm số dưới ngưỡng, hệ thống truy ngược theo đồ thị quan hệ tiên quyết để kiểm tra các khái niệm nền liên quan, và tự động chèn phần ôn lại khái niệm đó và lịch trước khi hỏi lại khái niệm ban đầu.

5. **Reflect:** Dashboard hiển thị trực quan đồ thị khái niệm, tô màu theo mức độ vững/yếu, giúp sinh viên nhìn thấy ngay bức tranh tổng thể về môn học.

## 5. Các tính năng chính

### 5.1. AI Study Planner

- Đầu vào: text (dán đề cương/ghi chú) hoặc ảnh chụp tài liệu, xử lí trực tiếp qua LLM.
- AI trả về kết quả dạng JSON có cấu trúc cố định: danh sách khái niệm, quan hệ tiên quyết giữa chúng, độ khó ước lượng - không phải văn bản tự do, để hệ thống dùng trực tiếp cho bước lập lịch mà không cần diễn giải lại.
- Nếu AI trả sai định dạng, hệ thống thử lại hoặc chia nhỏ tài liệu theo heading/đoạn văn để không làm cả tính năng thất bại.
- Người dùng chỉnh sửa, sắp xếp lại thứ tự thủ công nếu muốn.

### 5.2 Focus Session

- Có thể lựa chọn phương pháp học tập (mặc định là Pomodoro).
- Lưu lịch sử phiên học để hiển thị thống kê thời gian ôn tập.

### 5.3 AI Examiner - Interview vấn đáp nhiều lượt

AI Examiner là tính năng vận hành trực tiếp cơ chế kiểm chứng kiến thức của sản phẩm, khác việc hỏi-đáp rời rạc từng câu độc lập:

- **Hội thoại nhiều lượt, có trạng thái, giới hạn rõ ràng**: Dựa trên câu trả lời của người dùng, hệ thống quyết định bước tiếp theo trong phạm vi một máy trạng thái có giới hạn: tối đa N lượt hỏi-đáp cho mỗi khái niệm (ví dụ 3 lượt),, nhằm kiểm soát chi phí gọi AI và thời gian phản hồi.
  - Câu trả lời thể mức hiểu bản chất -> hỏi đào sâu hơn trong giới hạn lượt còn lại (ví dụ: "Bạn vừa nói X, vây tại sao Y lại xảy ra?").
  - Câu trả lời hời hợt/học vẹt -> AI truy vấn thêm để kiểm tra độ hiểu thật, không chấp nhận câu trả lời chung chung.
  - Câu trả lời thiếu/sai -> AI chỉ ra chỗ sai; nếu liên quan đến khái niệm nền, hệ thống chuyển sang cơ chế truy ngược ở mục 5.4 thay vì để AI tự quyết định hỏi lại khái niệm nào.
- **Tách vai trò AI khỏi vai trò điều phối:** AI chỉ được gọi cho hai nhiệm vụ hẹp, có schema output cố định - sinh câu hỏi (`generate_question`) và chấm câu trả lời theo rubric trích từ tài liệu gốc (`grade_answer`). Quyết định khi nào dừng, khi nào chuyển khái niệm là logic phần mềm tất định, giúp hành vi hệ thống kiểm thử được, không phụ thuộc vào việc AI có trả lời nhất quán hay không giữa các lần gọi.
- **Neo chặt vào tài liệu gốc:** Toàn bộ câu hỏi và tiêu chí chấm đều dựa trên đúng nội dung người dùng đã tải lên.
- **Nhận xét tổng hợp cuối phiên:** Được tổng hợp từ điểm số đã lưu cho từng khái niệm, sau đó AI chỉ viết lại thành nhận xét tự nhiên - phần đã vững, phần còn yếu, gợi ý nên ôn lại gì - không tự bịa đánh giá từ trí nhớ hội thoại.
- **Cơ chế dự phòng khi AI lỗi/hết quota** Hệ thống chuyển sang chế độ tự chấm bằng câu hỏi đã sinh sẵn từ lần trước (dạng flashcard tĩnh); người dùng tự đánh giá đúng/sai, hệ thống vẫn cập nhật lịch ôn tập bình thường.
- **Voice Input:** Cân nhắc bổ sung Speech-To-Text ở giai đoạn sau, không đưa vào tiêu chí MVP.

### 5.4 Concept Graph Engine

Đây là thành phần được đầu tư kỹ thuật nhiều nhất trong dự án, và là cơ sở để Recall AI khác biệt so với các công cụ đã khảo sát ở mục 2.3.

**Cơ chế:**

- 1. **Trích xuất:** Ở bước Ingest, ngoài danh sách khái niệm, AI được yêu cầu trả về thêm quan hệ tiên quyest giữa các khái niệm, dạng `{concept_id, prerequisite_of:[concept_id, ...]}`. Hệ thống kiểm tra đầu ra này tạo thành một đồ thị không chu trình (DAG) trước khi lưu; nếu phát hiện quan hệ vòng, hệ thống yêu cầu sinh lại hoặc loại bỏ cạnh gây vòng và ghi log để xem xét.
- 2. **Xác nhận thủ công:** Người dùng xem đồ thị dưới dạng sơ đồ trực quan, có thể sửa, xóa hoặc thêm quan hệ trước khi bắt đầu học. Hệ thống không tự động tin tưởng hoàn taonf vào kết quả AI sinh ra.
- 3. **Lưu trữ:** Đồ thị được lưu trong PostgreSQL bằng hai bảng quan hệ, không cần graph database riêng:
  - `concepts (id, plan_id, name, mastery_score, last_tested_at)`
  - `concept_edges (from_concept_id, to_concept_id)` - trong đó `from` là tiên quyết của `to`.
- 4. **Thuật toán truy ngược**, chạy sau mỗi lượt chấm điểm trong phiên Interview:

```text
KHI concept C có mastery_score < ngưỡng (ví dụ 0.6):
    Q = hàng đợi rỗng
    ĐƯA các tiên quyết trực tiếp của C (từ concept_edges) vào Q
    DUYỆT Q, giới hạn tối đa 2 tầng để tránh phiên học phình quá dài:
        NẾU tiên quyết P chưa từng được kiểm tra HOẶC mastery_score(P) < ngưỡng:
            CHÈN P vào đầu danh sách hàng đợi của phiên học tiếp theo, ưu tiên trước C
        NGƯỢC LẠI:
            bỏ quan P (đã vững, không cần ôn lại)

        NẾU không tìm thấy tiên quyết nào cần ôn thêm:
            xử lý như cơ chế ôn tập ngắt quãng thông thường - hẹn ôn lại C sau X ngày
```

Đây là thuật toán tìm kiếm theo chiều rộng (BFS) ngược trên đồ thị, có giới hạn độ sau để tránh phiên học kéo dài quá mức. Thuật toán độc lập với chất lượng AI - có thể viết unit test bằng dữ liệu `mastery_score` và quan hệ giả lập, không cần gọi AI thật.

**Giới hạn cần lưu ý:** đây là phiên bản đơn giản hóa, lấy cảm hứng từ Knowledge Space Theory, không phải cài đặt đầy đủ mô hình xác suất như ALEKS (mục 2.3). Chất lượng của cơ chế phụ thuộc vào việc AI trích xuất đúng quan hệ tiên quyết, do đó bước xác nhận thủ công ở trên là bắt buộc, không phải tùy chọn.

### 5.5. Dashboard

- Tiến độ ôn tập theo từng môn/tài liệu, deadline sắp tới.
- Sơ đồ đồ thị khái niệm, tô màu theo mức độ vững/yếu dựa trên `mastery_score` - phản ánh mức độ hiểu bài thật và vị trí của điểm yếu trong chuỗi kiến thức, không chỉ mọt danh sách chủ đề rời rạc.

### 5.6 Quản lý tài khoản

- Đăng nhập/đăng ký bằng email + mật khẩu (hoặc tài khoản Google), trang hồ sơ cơ bản.

## 6. Yếu tố Agentic

- **Truy ngược và điều hướng phiên học dựa trên đồ thị:** Hệ thống tự chèn khái niệm tiên quyết vài lịch khi phát hiện điểm yếu bắt nguồn từ gốc, không chờ người dùng tự nhận ra hoặc tự yêu cầu (mục 5.4). Đây là hành vi agentic có thể chỉ trực tiếp vào thuật toán khi báo cáo, không chỉ vào một system prompt.
- **AI tự quyết định trong phạm vi hẹp ở mỗi lượt hỏi-đáp:** đào sâu hay chuyển ý, nhưng luôn nằm trong khung số lượt cố định do phần mềm áp đặt (mục 5.3).
- **Nhắc nhở chủ động theo ngữ cảnh:** Hệ thống tính toán và nhắc ôn tập dựa trên khoảng thời gian còn lại đến deadline và mức độ ghi nhớ đo được qua Examiner, không phải nhắc theo lịch cố định.

> Ghi chú: Đây là phần được đầu tư kỹ thuật trong giai đoạn giữa dự án (thiết kế schema đồ thị, thuật toán truy ngược), và cững là phần dễ chứng minh nhất khi báo cáo rằng sản phẩm không chỉ là giao diện gọi API.

## 7. Phỏng vấn người dùng

### 7.1 Bảng tổng hợp kế quả phỏng vấn

| STT | Tên người được phỏng vấn | Nghề nghiệp / Nền tảng | Ngày phỏng vấn | Hình thức (Trực tiếp/Online) | Link bằng chứng |
| --- | ------------------------ | ---------------------- | -------------- | ---------------------------- | --------------- |
| 1   | [Điền tên]               | [Điền]                 | [Điền]         | [Điền]                       | [Điền link]     |
| 2   | [Điền tên]               | [Điền]                 | [Điền]         | [Điền]                       | [Điền link]     |
| 3   | [Điền tên]               | [Điền]                 | [Điền]         | [Điền]                       | [Điền link]     |
| 4   | [Điền tên]               | [Điền]                 | [Điền]         | [Điền]                       | [Điền link]     |
| 5   | [Điền tên]               | [Điền]                 | [Điền]         | [Điền]                       | [Điền link]     |

### 7.2. Các phát hiện chính từ phỏng vấn

_(Nhóm điền sau khi thực hiện phỏng vấn)_

- **Phát hiện 1:** [Mô tả]
- **Phát hiện 2:** [Mô tả]
- **Phát hiện 3:** [Mô tả]

### 7.3. Điều chỉnh dự án dựa trên phản hồi phỏng vấn

_(Nhóm điền sau khi phân tích kết quả phỏng vấn)_

| Ý tưởng/Thay đổi | Nguồn gốc (Từ phỏng vấn nào) | Quyết định (Áp dụng/Bỏ qua) | Lý do   |
| ---------------- | ---------------------------- | --------------------------- | ------- |
| [Mô tả thay đổi] | [Phỏng vấn số #]             | [Áp dụng/Bỏ qua]            | [Lý do] |

---

## 8. Danh sách màn hình dự kiến (Quy mô hệ thống MVP)

| STT | Màn hình                | Mô tả ngắn                                                                                                                      | Sprint dự kiến                         |
| --- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| 1   | Landing Page            | Trang giới thiệu ứng dụng, CTA đăng ký                                                                                          | 3                                      |
| 2   | Đăng ký / Đăng nhập     | Form email + mật khẩu                                                                                                           | 3                                      |
| 3   | Dashboard               | Tổng quan các kế hoạch đang học, deadline gần nhất, đồ thị khái niệm tô màu theo mức độ vững/yếu                                | 3 -> hoàn thiện phần đồ thị ở Sprint 5 |
| 4   | AI Study Planner        | Nhập text/ảnh/pdf/docx tài liệu, nhập deadline, xem và chỉnh sửa đồ thị khái niệm do AI đề xuất, gửi cho AI Study Planner xử lý | 3                                      |
| 5   | Focus Session           | Lựa chọn phương pháo học tập (Pomodoro, ...)                                                                                    | 3                                      |
| 6   | AI Examiner - Interview | Giao diện hội thoại nhiều lượt giữa người dùng và AI giám khảo, dựa trên tài liệu đã tải                                        | 4                                      |
| 7   | Kết quả phiên Interview | Nhận xét tổng hợp cuối phiên: phần đã vững, phần còn yếu, gợi ý ôn lại                                                          | 4                                      |
| 8   | Lịch sử & tiến độ       | Đồ thị khái niệm theo thời gian, lịch sử các phiên Interview và Focus Session                                                   | 5                                      |
| 9   | Hồ sơ các nhân          | Thông tin tài khoản cơ bản, đổi mật khẩu                                                                                        | 3 (tối giản)                           |

## 9. Công nghệ (Tech Stack)

### 9.1. Bảng tổng quan

| Thành phần                      | Công nghệ                                                                                                                                     |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend                        | React (Vite) + TypeScript + Tailwind CSS + shadcn/ui + React Router + Axios                                                                   |
| Graph visualization             | react-flow                                                                                                                                    |
| Backend                         | Node.js + Express.js                                                                                                                          |
| Database                        | PostgreSQL + Prisma ORM (bao gồm 2 bảng cho Concept Graph Engine: `concepts`, `concept_edges`)                                                |
| Authentication                  | JWT + bcrypt                                                                                                                                  |
| AI Services                     | Gemini API — output bắt buộc theo JSON schema cố định (khái niệm, quan hệ tiên quyết, câu hỏi, chấm điểm), không dùng văn bản tự do cho logic |
| Scheduling & Remediation Engine | Thuật toán tự viết: priority queue (lập lịch) + BFS ngược có giới hạn độ sâu (truy ngược tiên quyết)                                          |
| Source Control                  | Git + GitHub                                                                                                                                  |
| Project Mgmt                    | JIRA                                                                                                                                          |
| Design                          | Figma, Stitch                                                                                                                                        |
| Communication                   | Discord                                                                                                                                       |

### 9.2. Lý do lựa chọn, ưu điểm và rủi ro

#### Frontend: React (Vite) + TypeScript + Tailwind CSS + shadcn/ui

**Lý do lựa chọn:** Recall AI là ứng dụng Single Page Application (SPA) không cần SEO. React kết hợp Vite là giải pháp gọn nhẹ nhất cho SPA. TypeScript giúp bắt lỗi chặt chẽ, giảm bug tiềm ẩn. shadcn/ui giúp xây dựng các màn hình giao diện chất lượng cao nhanh chóng mà không cần code component phức tạp từ đầu.

**Ưu điểm:**

- TypeScript đảm bảo type-safety, giúp Frontend và Backend đồng bộ cấu trúc dữ liệu, IntelliSense hỗ trợ dev nhanh hơn.
- shadcn/ui cung cấp component có sẵn chất lượng cao, tùy biến được vì code component nằm ngay trong dự án.
- Vite cung cấp Hot Module Replacement (HMR) nhanh.
- Tailwind CSS cho phép xây dựng giao diện nhanh, tích hợp tốt với shadcn/ui.
  **Rủi ro:**
- TypeScript có đường cong học tập nhất định với người mới — giảm thiểu bằng cách Frontend Leader thiết lập các type cơ bản và hướng dẫn cặp (pair programming).
- Dễ ngợp với lượng code sinh ra từ shadcn/ui — giảm thiểu bằng cách chỉ cài các component thật sự cần thiết.

#### Backend: Node.js + Express.js

**Lý do lựa chọn:** Express.js là framework tối giản, linh hoạt, có đường cong học tập thấp nhất trong hệ sinh thái Node.js. Với thời gian 10 tuần và nhóm 5 người, một framework nặng hơn như NestJS sẽ tốn thời gian học thay vì tập trung vào logic nghiệp vụ.

**Ưu điểm:**

- Cùng ngôn ngữ JavaScript/TypeScript với Frontend, chia sẻ được type/interface giữa hai tầng.
- Cộng đồng lớn, có sẵn middleware phổ biến (cors, helmet, morgan, multer...).
- Kiến trúc không áp đặt, cho phép nhóm tổ chức code theo cách phù hợp nhất.
  **Rủi ro:**
- Không có cấu trúc dự án mặc định, dễ dẫn đến code không nhất quán — giảm thiểu bằng quy ước thư mục rõ ràng (`routes/`, `controllers/`, `services/`, `middlewares/`) và ESLint/Prettier ngay từ đầu.
- Xử lý lỗi và validation cần cấu hình thủ công — giảm thiểu bằng thư viện validation như Zod.

#### Database: PostgreSQL + Prisma ORM

**Lý do lựa chọn:** Dữ liệu của Recall AI có quan hệ rõ ràng (User → Plan → Concept → ConceptEdge → FocusSession → VerifyResult). PostgreSQL đảm bảo tính toàn vẹn dữ liệu tốt hơn NoSQL cho mô hình quan hệ này, bao gồm cả việc biểu diễn đồ thị khái niệm bằng hai bảng quan hệ thay vì một graph database riêng. Prisma ORM tự sinh TypeScript types từ schema, giúp phát hiện lỗi lúc code thay vì lúc chạy.

**Ưu điểm:**

- PostgreSQL hỗ trợ ACID transactions, đảm bảo dữ liệu nhất quán khi nhiều thao tác xảy ra đồng thời.
- Prisma Migrate tự động hóa quản lý thay đổi schema qua các Sprint.
- Prisma Client sinh truy vấn type-safe, giảm lỗi runtime liên quan đến database.
- Không phát sinh thêm một loại cơ sở dữ liệu mới trong hệ thống chỉ để phục vụ đồ thị khái niệm, giữ kiến trúc đơn giản, phù hợp với một nhóm 5 người trong 10 tuần.
  **Rủi ro:**
- Prisma có ngôn ngữ schema riêng (`.prisma`), cần thời gian làm quen — giảm thiểu bằng cách dành thời gian ở Sprint 2 để thiết kế schema cẩn thận, bao gồm cả bảng `concepts`/`concept_edges`.
- Thay đổi schema giữa các Sprint có thể gây migration conflict — giảm thiểu bằng cách thiết kế kỹ ở giai đoạn Elaboration, hạn chế thay đổi lớn ở giai đoạn Construction.
- Với đồ thị rất lớn, truy vấn quan hệ đệ quy trên bảng quan hệ sẽ chậm hơn một graph database chuyên dụng; ở quy mô MVP (một tài liệu ôn tập, thường dưới 50 khái niệm) rủi ro này không đáng kể.

#### Authentication: JWT + bcrypt

**Lý do lựa chọn:** Tự xây dựng hệ thống xác thực giúp nhóm hiểu sâu cơ chế bảo mật — kiến thức quan trọng của môn học — đồng thời không phát sinh chi phí dịch vụ bên thứ ba.

**Ưu điểm:**

- Toàn quyền kiểm soát luồng xác thực, dễ tùy chỉnh.
- bcrypt là thuật toán hash mật khẩu đã được chứng minh an toàn, tự động thêm salt.
- JWT cho phép xác thực stateless, giảm tải cho server.
  **Rủi ro:**
- Cần tự triển khai refresh token rotation, token blacklist khi đăng xuất, và bảo vệ chống CSRF/XSS — giảm thiểu bằng cách tuân thủ best practices có sẵn tài liệu và review code kỹ phần authentication.
- Lỗ hổng bảo mật tiềm ẩn nếu triển khai không đúng cách — giảm thiểu bằng cách ưu tiên review phần authentication cao nhất.

#### AI Services: Gemini API (Google)

**Lý do lựa chọn:** Gemini là model đa phương thức (text và image), phù hợp với yêu cầu AI Study Planner (người dùng có thể chụp ảnh tài liệu hoặc nhập văn bản). Tier miễn phí đủ cho giai đoạn phát triển và demo.

**Ưu điểm:**

- Hỗ trợ tiếng Việt tốt, quan trọng cho sản phẩm nhắm đến người dùng Việt Nam.
- API đơn giản, tài liệu rõ ràng, tích hợp nhanh.
- Xử lý đa phương thức (text + image) trong cùng một API call, không cần pipeline OCR riêng.
  **Rủi ro:**
- Phụ thuộc dịch vụ bên ngoài: nếu API gặp sự cố hoặc đổi pricing, ứng dụng bị ảnh hưởng — giảm thiểu bằng một lớp abstraction (AI service layer) để có thể chuyển provider nếu cần.
- Rate limit trên tier miễn phí có thể giới hạn số request — giảm thiểu bằng cache kết quả AI và giới hạn request mỗi người dùng mỗi ngày.
- Chất lượng output không đồng đều, đặc biệt với input phức tạp hoặc ảnh chất lượng thấp — giảm thiểu bằng cách thiết kế prompt kỹ và luôn bắt buộc output theo JSON schema có thể validate.

#### Concept Graph & Trực quan hóa: PostgreSQL (bảng quan hệ) + react-flow

**Lý do lựa chọn:** Quan hệ tiên quyết giữa các khái niệm biểu diễn đầy đủ bằng hai bảng quan hệ (`concepts`, `concept_edges`) trong PostgreSQL đã chọn cho toàn hệ thống — không cần đầu tư một graph database riêng (ví dụ Neo4j), vốn làm tăng độ phức tạp vận hành không cần thiết ở quy mô MVP. Để trực quan hóa đồ thị trên Dashboard, nhóm dùng react-flow — thư viện React dựng sẵn cho giao diện node-link — nhằm dồn thời gian phát triển cho thuật toán truy ngược thay vì tự vẽ từ đầu.

**Ưu điểm:**

- Không phát sinh thêm loại cơ sở dữ liệu mới, giữ kiến trúc đơn giản.
- Prisma ORM truy vấn các bảng này như mọi bảng khác, không cần driver riêng.
- react-flow xử lý sẵn bố cục, tương tác kéo-thả và zoom cho sơ đồ node-link.

**Rủi ro:**

- react-flow có đường cong học tập riêng cho nhóm Frontend — giảm thiểu bằng cách chỉ dùng API cơ bản (node, edge, tô màu) cần cho MVP.

---

## 10. Phân công vai trò và trách nhiệm

### 10.1. Bảng phân công chi tiết

| Thành viên            | Vai trò chính   | Phạm vi trách nhiệm                                                                                      |
| --------------------- | --------------- | -------------------------------------------------------------------------------------------------------- |
| Thái Nguyễn Tuấn Kiệt | PM + UI/UX      | Quản lý tiến độ, soạn specs, thiết kế wireframe/UI, báo cáo Sprint                                       |
| Nguyễn Thế Quân       | Architect + Dev | Thiết kế kiến trúc hệ thống, database schema, thuật toán Concept Graph Engine, API design, dev fullstack |
| Nguyễn Minh Phát      | QA + Dev        | Viết test plan/cases, thực hiện kiểm thử, hỗ trợ dev backend                                             |
| Nguyễn Phương Gia Bảo | Frontend Leader | Lead team frontend, implement UI components, trực quan hóa đồ thị khái niệm, tích hợp API                |
| Ngô Văn Phong         | Backend Leader  | Lead team backend, implement API endpoints, quản lý database                                             |

### 10.2. Ma trận RACI (cho các hoạt động chính)

| Hoạt động                               | Kiệt (PM) | Quân (Arch) | Phát (QA) | Bảo (FE) | Phong (BE) |
| --------------------------------------- | --------- | ----------- | --------- | -------- | ---------- |
| Quản lý tiến độ Sprint                  | R/A       | C           | I         | I        | I          |
| Thiết kế kiến trúc                      | C         | R/A         | I         | C        | C          |
| Thiết kế UI/UX                          | R/A       | C           | C         | C        | C          |
| Thiết kế & cài đặt Concept Graph Engine | C         | R/A         | C         | I        | C          |
| Trực quan hóa đồ thị trên Dashboard     | I         | C           | I         | R/A      | C          |
| Phát triển Frontend                     | I         | C           | I         | R/A      | I          |
| Phát triển Backend                      | I         | C           | I         | I        | R/A        |
| Tích hợp AI (Gemini API)                | I         | R           | I         | C        | A          |
| Kiểm thử (Testing)                      | I         | I           | R/A       | C        | C          |
| Báo cáo & Tài liệu                      | R/A       | C           | C         | I        | I          |

_R = Responsible (Thực hiện), A = Accountable (Chịu trách nhiệm), C = Consulted (Tham vấn), I = Informed (Được thông báo)_

---

## 11. Kế hoạch thực hiện (Project Schedule)

| Sprint | Giai đoạn RUP | Thời gian   | Assignment | Mục tiêu chính                                      | Nội dung                                                                                                                                                                                                                                                                                       |
| ------ | ------------- | ----------- | ---------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1      | Inception     | 21/6 – 28/6 | PA0        | Project proposal                                    | Hoàn thiện đề xuất dự án (tài liệu này)                                                                                                                                                                                                                                                        |
| 2      | Elaboration   | 29/6 – 12/7 | PA1, PA2   | Requirements and initial design                     | Đặc tả yêu cầu chi tiết (use case, user story), thiết kế kiến trúc hệ thống, thiết kế database (bao gồm bảng lưu khái niệm và quan hệ tiên quyết), thiết kế thuật toán truy ngược trên giấy, wireframe cho các màn hình. Chưa code.                                                            |
| 3      | Elaboration   | 13/7 – 26/7 | PA3        | Detailed design and test planning. Working software | Thiết kế chi tiết + kế hoạch kiểm thử; dựng working software đầu tiên: Auth, Dashboard khung, AI Study Planner (JSON schema, trích xuất khái niệm và quan hệ tiên quyết), Concept Graph Engine phiên bản đầu (lưu đồ thị, thuật toán truy ngược chạy được với dữ liệu giả lập), Focus Session. |
| 4      | Construction  | 27/7 – 9/8  | PA4        | Working software. Implementation and testing        | AI Examiner – Interview vấn đáp nhiều lượt (state machine giới hạn lượt), nối kết quả chấm điểm vào Concept Graph Engine đã dựng ở Sprint 3, kiểm thử luồng hội thoại.                                                                                                                         |
| 5      | Construction  | 10/8 – 23/8 | PA5        | Working software. Implementation and testing        | Trực quan hóa đồ thị khái niệm trên Dashboard, hoàn thiện lớp agentic (tự đề xuất chèn phiên ôn lại dựa trên đồ thị), kiểm thử toàn bộ hệ thống bằng dữ liệu thật, chuẩn bị demo.                                                                                                              |

Concept Graph Engine — thành phần rủi ro cao nhất và giá trị cao nhất của dự án — được dựng khung từ Sprint 3 và kiểm thử bằng dữ liệu giả lập, trước khi AI Examiner (Sprint 4) tạo ra dữ liệu điểm số thật để nối vào. Cách sắp xếp này tách rủi ro "thuật toán truy ngược sai" ra khỏi rủi ro "AI Examiner chưa mượt", để hai rủi ro không cùng dồn vào Sprint cuối.

---

## 12. Rủi ro & giả định

- **Chất lượng câu hỏi AI Examiner phụ thuộc chất lượng tài liệu đầu vào:** giới hạn đầu vào rõ ràng ở MVP (text thuần hoặc ảnh chữ rõ) để tránh lỗi trích xuất.
- **Đánh giá câu trả lời tự luận bằng AI có thể sai lệch:** rubric được trích xuất từ tài liệu gốc một lần ở bước Ingest, hạn chế AI tự đặt tiêu chí chấm tùy tiện mỗi lượt; cho phép người dùng phản hồi/khiếu nại kết quả chấm.
- **Quản lý hội thoại nhiều lượt tốn chi phí API hơn Q&A rời rạc:** giới hạn tối đa số lượt hỏi-đáp cho mỗi khái niệm (ví dụ 3 lượt) và số khái niệm được hỏi mỗi phiên, để kiểm soát chi phí và thời gian phản hồi.
- **AI trích xuất sai quan hệ tiên quyết giữa các khái niệm:** người dùng bắt buộc xác nhận/chỉnh sửa đồ thị trước khi bắt đầu học; hệ thống không tự động tin tưởng hoàn toàn kết quả AI sinh ra.
- **Đồ thị khái niệm có thể chứa chu trình** (A là tiên quyết của B, B là tiên quyết của A): hệ thống kiểm tra tính chất không chu trình (DAG) khi lưu, từ chối hoặc gắn cờ các cạnh gây chu trình.
- **Một số tài liệu/môn học không có cấu trúc phân tầng rõ**, khiến đồ thị quá thưa: với các trường hợp này, hệ thống áp dụng cơ chế ôn tập ngắt quãng thông thường cho khái niệm đó, không ép buộc phải có quan hệ tiên quyết.
- **Rủi ro tiến độ ở Concept Graph Engine** (thuật toán trung tâm của đề tài): nếu Sprint 3 gặp khó khăn, tiêu chí demo tối thiểu là đồ thị lưu đúng và thuật toán truy ngược chạy đúng với dữ liệu giả lập; phần trực quan hóa trên Dashboard có thể lùi sang Sprint 5 mà không ảnh hưởng luận điểm kỹ thuật chính.
- **AI Examiner (Sprint 4) và hoàn thiện hệ thống (Sprint 5) liền kề nhau, không có sprint đệm:** ưu tiên chốt ổn định Interview trước khi mở rộng; có thể loại Voice Input khỏi phạm vi MVP hoàn toàn nếu cần thêm thời gian.
- **Voice Input (nếu triển khai) có rủi ro nhận dạng giọng nói tiếng Việt sai thuật ngữ chuyên ngành**, có thể khiến AI chấm sai câu trả lời đúng: không đưa vào tiêu chí MVP, chỉ thử nghiệm ở giai đoạn sau nếu còn thời gian.
- **Rủi ro phụ thuộc dịch vụ AI bên ngoài (Gemini API):** thiết kế lớp abstraction (AI service layer) để có thể chuyển provider nếu cần; cache kết quả và giới hạn request mỗi người dùng mỗi ngày để kiểm soát rate limit.

---
