# PROJECT PROPOSAL

_Recall AI - Trợ lý ôn tập chủ động cho sinh viên_

> **Ngày soạn:** 2026-06-19
> **Người soạn:** PM
> **Môn học:** Nhập môn Công nghệ Phần mềm (24C07)
> **Bài tập:** PA0 - Đăng ký nhóm và Thiết lập công cụ
> **Deadline:** 25/6/2026

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

Recall AI là một web app giúp sinh viên biến tài liệu ôn tập (đề cương, slice, ghi chú) thành một kế hoạch ôn tập có cấu trúc, và quan trọng nhất, giúp họ kiểm chứng xem mình có thực sự nhớ và hiểu kiến thức hay không - thông qua một AI đóng vai trò giám khảo, đặt câu hỏi mở và đối chiếu câu trả lời với tài liệu gốc.

### 2.2 Vấn đề & động lực

- **Học thụ động, ôn tập hời hợt:** Đa số sinh viên ôn tập bằng cách đọc lại hoặc gạch highlight, phương pháp có hiệu quả ghi nhớ thấp so với việc tự kiếm tra (retrieval practice) theo nghiên cứu tâm lý học nhận thức.
- **Không có cách khách quan để tự đánh giá:** Sinh viên khó biết mình đã "thuộc" hay chỉ "quen mặt chữ", vì không có ai để kiểm tra được mức độ hiểu biết của mình.
- **Ôn tập không có kế hoạch:** Trước deadline hoặc kỳ thi, sinh viên thường ôn dồn, không chia nhỏ nội dung theo mức độ ưu tiên hoặc thời gian còn lại.

Ba vấn đề này gấn chặt với nhau, và AI hiện có thể giải quyết đồng thời: đọc hiểu tài liệu để lên kế hoạch, và đóng vai người hỏi bài để kiểm tra kiến thức - điều mà trước đây chỉ con người (giáo viên, bạn học) mới làm được.

### 2.3. Kết quả mong muốn

---

## 3. Đối tượng người dùng

Sinh viên năm 1-2 các ngành kỹ thuật/khoa học tự nhiên, đặc biệt các môn có khối lượng lý thuyết lớn cần ghi nhớ (ví dụ: mạng máy tính, hệ điều hành, cấu trúc dữ liệu, các môn đại cương, ...).

# 4. Giá trị cốt lõi & vòng lặp trải nghiệm

- Plan: AI đọc tài liệu ôn tập, chia thành các phiên học nhỏ theo chủ đề và mức độ ưu tiên (dựa trên deadline người dùng cung cấp).
- Verify (Interview): Sai mỗi phiên học (có hoặc không dùng Pomodoro), AI đóng vai giám khảo, **phỏng vấn vấn đáp nhiều lượt** dựa trên tài liệu đã tải lên, tự quyết định hỏi tiếp hay dừng, và đưa nhận xét tổng hợp cuối phiên.

---

## 5. Các tính năng chính

### 5.1. AI Study Planner

- Đầu vào: text (dán đề cương/ghi chú) hoặc ảnh chụp tài liệu, xử lí trực tiếp qua Gemini.
- AI chia tài liệu thành các phiên ôn tập (topic-based), ước lượng thời gian cần thiết, sắp xếp theo deadline người dùng nhập.
- Người dùng chỉnh sửa, sắp xếp lại thứ tự thủ công nếu muốn

### 5.2. Focus Session

- Có thể lựa chọn các phương pháo học tập (mặc định là Pomodoro).
- Lưu lịch sử phiên học để hiển thị thống kê thời gian ôn tập.

### 5.3. AI Examiner - Interview vấn đáp nhiều lượt (tính năng cốt lõi)

Đây là điểm khác biệt chính của sản phẩm, không phải Q&A rời rạc hỏi 1 câu chấm 1 câu.

- **Hội thoại nhiều lượt (multi-turn), có trạng thái**: AI giữ lịch sử hội thoại trong suốt phiên vấn đáp, không xử lý từng câu độc lập. Dựa trên câu trả lời của người dùng, AI tự quyết định bước tiếp theo: - Nếu câu trả lời tốt -> hỏi đào sâu hơn (Ví dụ: "Bạn vừa nói X, vậy tại sao Y lại xảy ra?"). - Nếu câu trả lời hời hợt/học vẹt -> AI phát hiện và truy vấn thêm để kiếm tra độ hiểu thật, không chấp nhận câu trả lời chung chung. - Nếu câu trả lời sai/thiếu -> AI chỉ ra chỗ sai, có thể họi lại khái niệm nền tảng trước khi tiếp tục.
- **Neo chặt vào tài liệu gốc:** Toàn bộ câu hỏi và đánh giá đều dựa trên đúng nội dung người dùng đã tải lên - đây là khác biệt so với việc tự hỏi ChatGPT/Claude thông thường, vốn không có ngữ cảnh tài liệu cụ thể và không theo dõi trạng thái mức hiểu bài của người đọc qua thời gian.
- **Nhận xét tổng hợp cuối phiên:** Kết thúc, AI đưa đánh giá tổng thể (giống giám khảo thật chốt nhận xét sau buổi vấn đáp): những phần đã nắm vững, những phần còn yếu, gợi ý nên ôn lại gì.
- **Voice input (nice-to-have, không cam kết trong MVP):** Cân nhắc thêm Speech-to-Text để trả lời bằng giọng nói ở giai đoạn sau.
- Lưu kết quả để theo dõi những chủ đề người dùng còn yếu qua thời gian.

### 5.4. Dashboard

- Tiến độ ôn tập theo từng môn/tài liệu, deadline sắp tới.
- Biểu đồ chủ đề mạnh/yếu dựa trên lịch sử AI Examiner - dashboard phản ảnh mức độ hiểu bài thật, không phải chỉ số task đã tick.

### 5.5. Quản lí tài khoản

- Đăng ký/đăng nhập bằng email + mật khẩu, trang hồ sơ cơ bản.

## 5. Yếu tố Agentic

- **AI tự quyết định luồng hỏi trong phiên vấn đáp:** không chạy theo kịch bản câu hỏi cố định soạn sẵn, mà tự chọn hỏi tiếp, đào sâu, hay chuyển chủ đề dựa trên trạng thái hội thoại và chất lượng câu trả lời - đây chính là hành vi agentic ở cấp độ phiên làm việc (session-level).
- **Tự điều chỉnh kế hoạch ôn tập:** Nếu người dùng bỏ lỡ phiên học hoặc đánh giá yếu ở một chủ đề trong buổi Interview, hệ thống tự đề xuất chèn thêm phiên ôn lại chủ đề đó và kế hoạch, thay vì chờ người dùng tự nhận ra.
- **Nhắc nhở chủ động theo ngữ cảnh:** Hệ thống tính toán và nhắc ôn tập dựa trên khoảng thời gian còn lại đến deadline và mức độ ghi nhớ đo được qua Examiner, không phải nhắc theo lịch cố định.

> [!NOTE]
> Đây là phần cần được đầu tư kỹ thuật thật trong sprint giữa (thiết kế state, logic quyết định), và cũng là phần dễ trình bày nhất khi báo cáo để chứng minh sản phẩm không chỉ là giao diện gọi API.

## 6. Phỏng vấn người dùng

### 6.1. Bảng tổng hợp kết quả phỏng vấn

| STT | Tên người được phỏng vấn | Nghề nghiệp / Nền tảng | Ngày phỏng vấn | Hình thức (Trực tiếp / Online) | Link bằng chứng (ghi âm / video / ghi chú) |
| --- | ------------------------ | ---------------------- | -------------- | ------------------------------ | ------------------------------------------ |
| 1   | [Điền tên]               | [Điền]                 | [Điền]         | [Điền]                         | [Điền link hoặc đường dẫn file]            |
| 2   | [Điền tên]               | [Điền]                 | [Điền]         | [Điền]                         | [Điền link hoặc đường dẫn file]            |
| 3   | [Điền tên]               | [Điền]                 | [Điền]         | [Điền]                         | [Điền link hoặc đường dẫn file]            |
| 4   | [Điền tên]               | [Điền]                 | [Điền]         | [Điền]                         | [Điền link hoặc đường dẫn file]            |
| 5   | [Điền tên]               | [Điền]                 | [Điền]         | [Điền]                         |

### 6.2. Các phát hiện chính từ phỏng vấn

<!-- Nhóm CAGT điền sau khi thực hiện phỏng vấn -->

- **Phát hiện 1:** [Mô tả]
- **Phát hiện 2:** [Mô tả]
- **Phát hiện 3:** [Mô tả]

### 6.3. Điều chỉnh dự án dựa trên phản hồi phỏng vấn

<!-- Nhóm CAGT điền sau khi phân tích kết quả phỏng vấn -->

| Ý tưởng/Thay đổi | Nguồn gốc (Từ phỏng vấn nào) | Quyết định (Áp dụng / Bỏ qua) | Lý do   |
| ---------------- | ---------------------------- | ----------------------------- | ------- |
| [Mô tả thay đổi] | [Phỏng vấn số #]             | [Áp dụng / Bỏ qua]            | [Lý do] |

---

## 7. Danh sách màn hình dự kiến (Quy mô hệ thống MVP)

| STT | Màn hình                | Mô tả ngắn                                                                               | Sprint dự kiến          |
| --- | ----------------------- | ---------------------------------------------------------------------------------------- | ----------------------- |
| 1   | Landing Page            | Trang giới thiệu ứng dụng, CTA đăng ký                                                   | 3                       |
| 2   | Login/Register          | Form email + mật khẩu, Google Sign-In                                                    | 3                       |
| 3   | Dashboard               | Tổng quan các kế hoạch đang học, deadline gần nhất, widget chủ đề mạnh/yếu               | 3 -> hoàn thiện dần ở 5 |
| 4   | Create Plan             | Nhập text/ảnh tài liệu/pdf,docx, nhập deadline, gửi cho AI Study Planner xử lý           | 3                       |
| 5   | Focus Session           | Lựa chọn phương pháp học tập (Pomodoro, ...)                                             | 3                       |
| 6   | AI Examiner - Interview | Giao diện hội thoại nhiều lượt giữa người dùng và AI giám khảo, dựa trên tài liệu đã tải | 4                       |
| 7   | Kết quả phiên Interview | Nhận xét tổng hợp cuối phiên: phần đã vững, phần còn yếu, gợi ý ôn lại.                  | 4                       |
| 8   | Lịch sử & tiến độ       | Biểu đồ chủ đề mạnh/yếu theo thời gian, lịch sử các phiên Interview và Focus.            | 5                       |
| 9   | Hồ sơ cá nhân           | Thông tin tài khoản cơ bản, đổi mật khẩu                                                 | 3 (tối giản)            |

## 8. Công nghệ (Tech Stack)

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

### 8.1. Lý do lựa chọn, ưu điểm và rủi ro

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

## 9. Phân công vai trò và Trách nhiệm

### 9.1. Bảng phân công chi tiết

| Thành viên            | Vai trò chính   | Phạm vi trách nhiệm                                                     |
| --------------------- | --------------- | ----------------------------------------------------------------------- |
| Thái Nguyễn Tuấn Kiệt | PM + UI/UX      | Quản lý tiến độ, soạn specs, thiết kế wireframe/UI, báo cáo Sprint      |
| Nguyễn Thế Quân       | Architect + Dev | Thiết kế kiến trúc hệ thống, database schema, API design, dev fullstack |
| Nguyễn Minh Phát      | QA + Dev        | Viết test plan/cases, thực hiện kiểm thử, hỗ trợ dev backend            |
| Nguyễn Phương Gia Bảo | Frontend Leader | Lead team frontend, implement UI components, tích hợp API               |
| Ngô Văn Phong         | Backend Leader  | Lead team backend, implement API endpoints, quản lý database            |

### 9.2. Ma trận RACI (cho các hoạt động chính)

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

## 10. Kế hoạch thực hiện (Project Schedule)

### 10.1. Tổng quan Sprint (RUP + Scrum)

| Sprint | Giai đoạn RUP | Thời gian   | Assignment                                   | Mục tiêu chính                                                                       | Nội dung                                                                                                                                                            |
| ------ | ------------- | ----------- | -------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1      | Inception     | 21/6 - 28/6 | PA0                                          | Project proposal                                                                     | Hoàn thiện đề xuất dự án (tài liệu này)                                                                                                                             |
| 2      | Elaboration   | 29/6 - 12/7 | PA1, PA2                                     | Requirements and initial design                                                      | Đặc tả yêu cầu chi tiết (use case, user story), thiết kế kiến trúc hộ thống, thiết kế database, wireframe cho các màn hình. Chưa code                               |
| 3      | Elaboration   | 13/7 - 26/7 | PA3                                          | Detailed design and test planning. Working software                                  | Thiết kế chi tiết + kế hoạch kiểm thử; dựng working software đầu tiên: Auth, Dashboard khung, AI Study Planner (text input trước, ảnh, pdf/docx sau), Focus Session |
| 4      | Construction  | 27/7 - 9/8  | Working software, Implementation and testing | AI Examiner - Interview vấn đáp nhiều lượt (tính năng lõi), kiểm thử luồng hội thoại |
| 5      | Construction  | 10/8 - 23/8 | PA5                                          | Working software. Implementation and testing                                         | Lớp agentic (tự đề xuất chèn phiên ôn lại, câu hỏi thích ứng), hoàn thiện Dashboard/Lịch sử, kiểm thử toàn bộ hệ thống, chuẩn bị demo                               |

---

## 11. Rủi ro & giả định

- **Chất lượng câu hỏi AI Examiner phụ thuộc chất lượng tài liệu đầu vào**: cần giới hạn đầu vào rõ ràng (text thuần hoặc ảnh chữ rõ) ở MVP để tránh lỗi trích xuất.
- **Đánh giá câu trả lời tự luận bằng AI có thể sai lệch**: cần thử nghiệm prompt kỹ, kiểm soát AI không chấp nhận câu trả lời hời hợt quá dễ dàng, và cho phéo người dùng phản hồi/khiếu nại kết quả chấm.
- **Quản lý ngữ cảnh hội thoại nhiều lượt tốn chi phí API hơn Q&A rời rạc**: cần giới hạn độ dài phiên vấn đáp (ví dụ tối đa 507 lượt hỏi đáp) để kiểm soát chi phí và thời gian phản hồi.
- **Rủi ro trễ tiến độ ở lớp agentic (dồn vào Sprint 5)**: Cần tách rõ tiêu chí "chạy đủ demo" tối thiếu (ví dụ: chỉ cần tự đề xuất chèn lại phiên ôn tập, chưa cần hỏi thích ứng phức tạp) để không kéo lùi toàn bộ dự án nếu gặp khó khăn kỹ thuật.
- **AI Examiner (Sprint 4) và lớp agentic (Sprint 5) liền kề nhau, không có sprint đệm**: nếu Sprint 4 trễ, Sprint 5 sẽ vừa phải hoàn thiện Interview vừa làm agentic - cần ưu tiên chốt xong Interview ổn định trước khi mở rộng, và có thể lùi Voice Input (vốn đã là nice-to-have) ra khỏi kế hoạch hoàn toàn nếu cần.
- **Voice Input (nếu làm) rủi ro Speech-To-Text tiếng Việt sai thuật ngữ chuyên ngành**, có thể khiến AI chấm sai câu trả lời đúng - vì vậy chỉ nên thử nghiệm ở cuối, không đưa vào tiêu chí MVP

---
