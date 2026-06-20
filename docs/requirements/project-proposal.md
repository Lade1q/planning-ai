# ĐỀ XUẤT DỰ ÁN: PLANNING AI - PLAN / FOCUS / VERIFY

> **Trạng thái:** BẢN NHÁP - Chờ User duyệt
> **Phiên bản:** 1.2
> **Ngày soạn:** 2026-06-20
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
6. [Danh sách màn hình dự kiến](#6-danh-sách-màn-hình-dự-kiến)
7. [Công nghệ đề xuất (Tech Stack)](#7-công-nghệ-đề-xuất-tech-stack)
8. [Phân công vai trò và Trách nhiệm](#8-phân-công-vai-trò-và-trách-nhiệm)
9. [Kế hoạch thực hiện (Project Schedule)](#9-kế-hoạch-thực-hiện-project-schedule)
10. [Phân tích rủi ro](#10-phân-tích-rủi-ro)
11. [Giá trị kỳ vọng và Định hướng MVP](#11-giá-trị-kỳ-vọng-và-định-hướng-mvp)

---

## 1. Thông tin nhóm

- **Tên nhóm:** CAGT
- **Số lượng thành viên:** 5

| STT | Họ và Tên             | Vai trò chính               | Vai trò phụ         |
| --- | --------------------- | --------------------------- | ------------------- |
| 1   | Thái Nguyễn Tuấn Kiệt | Project Manager             | UI/UX Designer      |
| 2   | Nguyễn Thế Quân       | System Designer (Architect) | Fullstack Developer |
| 3   | Nguyễn Minh Phát      | QA/Tester                   | Fullstack Developer |
| 4   | Nguyễn Phương Gia Bảo | Frontend Leader             | -                   |
| 5   | Ngô Văn Phong         | Backend Leader              | -                   |

> [!NOTE]
> **Phân tích phân công:** Nhóm có 5 thành viên với sự phân bố vai trò hợp lý.

---

## 2. Giới thiệu dự án

### 2.1. Khái quát ý tưởng

Planning AI là một nền tảng web hỗ trợ người dùng chuyển đổi từ **ý định sang hành động** thông qua quy trình ba bước:

- **Plan (Lập kế hoạch):** AI phân tích thông tin đầu vào và tạo kế hoạch hành động có cấu trúc. Đồng thời phân loại task tự động.
- **Focus (Tập trung):** Hỗ trợ phiên làm việc tập trung theo phương pháp Pomodoro, gắn liền với nhiệm vụ cụ thể.
- **Verify (Xác nhận):** Xác nhận mức độ hoàn thành. Với task học thuật, AI đóng vai trò người kiểm tra kiến thức. Với task sinh hoạt, AI đưa ra các câu hỏi phản chiếu (reflection) để tự đánh giá.

### 2.2. Lý do thực hiện

Qua quan sát ban đầu, sinh viên và nhân viên văn phòng thường gặp các vấn đề:

1. **Quá tải thông tin:** Thông tin phân tán từ nhiều nguồn (chat nhóm, email, tài liệu, ghi chú, ảnh chụp màn hình) khiến việc tổ chức trở nên khó khăn.
2. **Không biết bắt đầu từ đâu:** Khi đối mặt với mục tiêu lớn, người dùng thường bị tê liệt lựa chọn (choice paralysis).
3. **Tốn thời gian sắp xếp:** Việc phân loại và ưu tiên công việc thủ công mất nhiều thời gian.
4. **Mất tập trung:** Mạng xã hội, thông báo và các yếu tố bên ngoài gây phân tâm.
5. **Khó tự đánh giá:** Người dùng không có công cụ khách quan để kiểm tra mức độ hiểu bài hoặc chất lượng hoàn thành công việc.

> [!IMPORTANT]
> **Điểm khác biệt cốt lõi:** Planning AI không chỉ là một to-do list thông thường. Giá trị độc đáo nằm ở việc kết hợp 3 bước Plan-Focus-Verify thành một quy trình liền mạch, tận dụng AI để cá nhân hóa trải nghiệm.

---

## 3. Người dùng mục tiêu và Môi trường hoạt động

### 3.1. Người dùng mục tiêu (Target Users)

| Nhóm người dùng         | Đặc điểm                                                      | Nhu cầu chính                                  |
| ----------------------- | ------------------------------------------------------------- | ---------------------------------------------- |
| Sinh viên đại học       | Quản lý bài tập, dự án nhóm, kỳ thi, mục tiêu học tập         | Lập kế hoạch học tập, ôn thi, theo dõi tiến độ |
| Nhân viên văn phòng trẻ | Xử lý nhiều nhiệm vụ, deadline và dự án cùng lúc              | Tổ chức công việc, duy trì tập trung           |
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

### 4.3. Tính năng 3: Verify (AI Oral Examiner & AI Reflection)

**Mô tả:** AI hỗ trợ xác nhận mức độ hoàn thành công việc.

**Chi tiết chức năng:**

- Phân luồng tính năng Verify dựa trên nhãn task:
  - **Đối với task học thuật:** Kích hoạt **AI Oral Examiner**. AI đặt câu hỏi kiểm tra kiến thức dựa trên tài liệu/bài tập, đánh giá câu trả lời và đề xuất ôn tập.
  - **Đối với task sinh hoạt/công việc:** Kích hoạt **AI Reflection**. AI đặt các câu hỏi phản chiếu (Ví dụ: "Bạn đã hoàn thành đủ các yêu cầu chưa?", "Có điểm nào cần rút kinh nghiệm?") để người dùng tự review (self-review).
- Lưu kết quả đánh giá để hiển thị lên Dashboard.

### 4.4. Tính năng 4: Dashboard

**Mô tả:** Trang tổng quan hiển thị toàn cảnh hoạt động của người dùng.

**Chi tiết chức năng:**

- Hiển thị các nhiệm vụ đang thực hiện và deadline sắp tới
- Thống kê tiến độ hoàn thành kế hoạch
- Tổng hợp lịch sử Focus Session (biểu đồ)
- Tổng hợp kết quả Verify (xu hướng tiến bộ)
- Widget nhanh: bắt đầu phiên Focus, tạo kế hoạch mới

### 4.5. Tính năng 5: Quản lý tài khoản (Authentication & Profile)

**Mô tả:** Hệ thống đăng ký, đăng nhập và quản lý thông tin cá nhân.

**Chi tiết chức năng:**

- Đăng ký tài khoản (email + mật khẩu)
- Đăng nhập / Đăng xuất
- Trang hồ sơ cá nhân (thông tin cơ bản, đổi mật khẩu)

---

## 5. Phỏng vấn người dùng

> [!IMPORTANT]
> **YÊU CẦU BẮT BUỘC CỦA ĐỀ BÀI:** Cần phỏng vấn ít nhất 5 người dùng hoặc khách hàng tiềm năng để xác nhận hoặc khám phá các ý tưởng mới cho dự án. Bản mô tả dự án phải bao gồm bằng chứng về các cuộc phỏng vấn.

### 5.1. Mục tiêu phỏng vấn (Research Goal & Objectives)

- Xác nhận các vấn đề (pain points) đã nêu ở mục 2.2 có thực sự tồn tại
- Khám phá nhu cầu thực tế của người dùng về việc lập kế hoạch, tập trung và tự đánh giá
- Thu thập phản hồi về ý tưởng 3 tính năng chính (Plan / Focus / Verify)
- Phát hiện các ý tưởng hoặc yêu cầu mới từ góc nhìn người dùng

### 5.2. Bộ câu hỏi phỏng vấn gợi ý (Interview Questions)

*(Ghi chú: Nên có form Screener Survey để lọc đúng nhóm người dùng trước khi phỏng vấn sâu. Kết hợp cả Quantitative và Qualitative).*

1. Bạn thường làm gì khi nhận được một nhiệm vụ lớn hoặc mục tiêu mới? (Quy trình hiện tại)
2. Bạn có gặp khó khăn gì khi tổ chức và sắp xếp công việc không? (Xác nhận pain point)
3. Bạn đã từng sử dụng công cụ nào để lập kế hoạch chưa? Điều gì bạn thích/không thích? (Competitive insight)
4. Khi học bài hoặc làm việc, bạn có thường bị mất tập trung không? Bạn làm gì để khắc phục? (Focus need)
5. Bạn nghĩ sao về việc AI đặt câu hỏi để kiểm tra kiến thức hoặc phản chiếu sau khi làm việc? (Verify need)
6. Nếu có một ứng dụng kết hợp cả 3 chức năng trên, bạn có sử dụng không? Điều gì là quan trọng nhất? (Priority)
7. Bạn thường sử dụng thiết bị nào để học tập/làm việc? (Platform preference)

### 5.3. Bảng tổng hợp kết quả phỏng vấn

| STT | Tên người được phỏng vấn | Nghề nghiệp / Nền tảng | Ngày phỏng vấn | Hình thức (Trực tiếp / Online) | Link bằng chứng (ghi âm / video / ghi chú) |
| --- | ------------------------ | ---------------------- | -------------- | ------------------------------ | ------------------------------------------ |
| 1   | [Điền tên]               | [Điền]                 | [Điền]         | [Điền]                         | [Điền link hoặc đường dẫn file]            |
| 2   | [Điền tên]               | [Điền]                 | [Điền]         | [Điền]                         | [Điền link hoặc đường dẫn file]            |
| 3   | [Điền tên]               | [Điền]                 | [Điền]         | [Điền]                         | [Điền link hoặc đường dẫn file]            |
| 4   | [Điền tên]               | [Điền]                 | [Điền]         | [Điền]                         | [Điền link hoặc đường dẫn file]            |
| 5   | [Điền tên]               | [Điền]                 | [Điền]         | [Điền]                         | [Điền link hoặc đường dẫn file]            |

### 5.4. Các phát hiện chính từ phỏng vấn

<!-- Nhóm CAGT điền sau khi thực hiện phỏng vấn -->

- **Phát hiện 1:** [Mô tả]
- **Phát hiện 2:** [Mô tả]
- **Phát hiện 3:** [Mô tả]

### 5.5. Điều chỉnh dự án dựa trên phản hồi phỏng vấn

<!-- Nhóm CAGT điền sau khi phân tích kết quả phỏng vấn -->

| Ý tưởng/Thay đổi | Nguồn gốc (Từ phỏng vấn nào) | Quyết định (Áp dụng / Bỏ qua) | Lý do   |
| ---------------- | ---------------------------- | ----------------------------- | ------- |
| [Mô tả thay đổi] | [Phỏng vấn số #]             | [Áp dụng / Bỏ qua]            | [Lý do] |

---

## 6. Danh sách màn hình dự kiến (Quy mô hệ thống MVP)

**Tổng cộng: 12 màn hình cốt lõi**

| STT | Màn hình               | Nhóm tính năng | Ghi chú                           |
| --- | ---------------------- | -------------- | --------------------------------- |
| 1   | Landing Page           | Marketing      | Giới thiệu sản phẩm, CTA đăng ký  |
| 2   | Login                  | Authentication | Đăng nhập bằng email/mật khẩu     |
| 3   | Register               | Authentication | Đăng ký tài khoản mới             |
| 4   | Dashboard              | Dashboard      | Tổng quan hoạt động               |
| 5   | Create Plan            | AI Planning    | Nhập mục tiêu, AI tạo kế hoạch    |
| 6   | Plan Details           | AI Planning    | Xem chi tiết kế hoạch + task list |
| 7   | Task Management        | AI Planning    | Quản lý, chỉnh sửa, đánh dấu task |
| 8   | Focus Session          | Focus          | Giao diện Pomodoro timer          |
| 9   | AI Verify Setup        | Verify         | Màn hình chuẩn bị cho Verify      |
| 10  | AI Oral Exam Session   | Verify         | Hỏi-đáp với AI (Học thuật)        |
| 11  | AI Reflection Session  | Verify         | Câu hỏi phản chiếu (Sinh hoạt)    |
| 12  | Verify Result          | Verify         | Kết quả đánh giá chung            |

---

## 7. Công nghệ đề xuất (Tech Stack)

> [!IMPORTANT]
> **Lưu ý:** Quyết định cuối cùng về tech stack sẽ do Architect Agent xác định. Dưới đây là các phương án để User tham khảo và cho ý kiến.

### 7.1. Frontend

| Phương án       | Công nghệ                   | Ưu điểm                                        | Nhược điểm                                          |
| --------------- | --------------------------- | ---------------------------------------------- | --------------------------------------------------- |
| A (Đề xuất gốc) | React (Vite) + Tailwind CSS | Hệ sinh thái lớn, nhiều tài liệu, nhóm đã quen | Tailwind có thể gây khó khi maintain CSS phức tạp   |
| B               | Next.js + Tailwind CSS      | SSR/SSG hỗ trợ SEO, routing tích hợp           | Phức tạp hơn cho người mới, có thể overkill cho SPA |

**Framework bổ sung (cả 2 phương án):** React Router (hoặc Next.js built-in), Axios (hoặc fetch API)

### 7.2. Backend

| Phương án       | Công nghệ            | Ưu điểm                                                      | Nhược điểm                                               |
| --------------- | -------------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| A (Đề xuất gốc) | Node.js + Express.js | Đơn giản, nhẹ, nhóm đã quen                                  | Cần cấu hình thủ công nhiều (validation, error handling) |
| B               | Node.js + NestJS     | Có cấu trúc rõ ràng, dependency injection, TypeScript native | Learning curve cao hơn                                   |

### 7.3. Database

| Phương án       | Công nghệ               | Ưu điểm                                             | Nhược điểm                                                 |
| --------------- | ----------------------- | --------------------------------------------------- | ---------------------------------------------------------- |
| A (Đề xuất gốc) | PostgreSQL + Prisma ORM | Type-safe, migration tốt, hỗ trợ tốt với TypeScript | Cần hiểu Prisma schema language                            |
| B               | MongoDB + Mongoose      | Linh hoạt schema, phù hợp dữ liệu bán cấu trúc      | Khó đảm bảo data integrity, không phù hợp quan hệ phức tạp |

### 7.4. Authentication

| Phương án       | Công nghệ                         | Ưu điểm                             | Nhược điểm                                     |
| --------------- | --------------------------------- | ----------------------------------- | ---------------------------------------------- |
| A (Đề xuất gốc) | JWT + bcrypt (tự build)           | Hiểu rõ cơ chế, tùy chỉnh toàn diện | Cần tự xử lý refresh token, blacklist, bảo mật |
| B               | Clerk / Auth0 (dịch vụ bên thứ 3) | Nhanh chóng tích hợp, bảo mật cao   | Phụ thuộc dịch vụ ngoài, có thể có chi phí     |

### 7.5. AI Services

- **Đề xuất:** Gemini API (Google)
- **Lý do:** Miễn phí cho mức sử dụng cơ bản, hỗ trợ input Text và Image tốt, API đơn giản

### 7.6. Version Control và Collaboration

- **Source Control:** Git + GitHub (đã thiết lập)
- **Project Management:** JIRA (đã thiết lập)
- **Design:** Figma
- **Communication:** Discord (đã thiết lập)

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
| Soạn đề xuất dự án     | Kiệt (PM)       | Hoàn thành     |
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
- Xác nhận mức độ hoàn thành hiệu quả với AI Verify (Oral Examiner & Reflection)
- Xây dựng quy trình làm việc Plan - Focus - Verify đơn giản và dễ duy trì

### 11.2. Định hướng MVP

Trong giai đoạn đầu, nhóm tập trung xác thực ba giả thuyết chính:

1. **Giả thuyết 1:** Người dùng cần được hỗ trợ tạo kế hoạch hành động đầu tiên một cách nhanh chóng (-> AI Planning)
2. **Giả thuyết 2:** Người dùng hưởng lợi từ một quy trình tập trung đơn giản và ít ma sát (-> Focus Session)
3. **Giả thuyết 3:** Người dùng đánh giá cao việc nhìn lại và xác nhận kết quả sau khi hoàn thành công việc (-> AI Verify)

**Phạm vi MVP (Thực hiện tuần tự Plan > Focus > Verify):**

- 3 tính năng cốt lõi: AI Planning, Focus Session, AI Verify
- Dashboard tổng hợp
- Hệ thống Authentication cơ bản
- 12 màn hình chính

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
2. **Tech stack:** Cần sự tham gia của Architect để chốt các phương án Frontend, Backend, Database, Auth.

---

> **Ghi chú cuối:** Tài liệu này là bản cập nhật v1.2, cần bổ sung phần Phỏng vấn người dùng và chốt Tech Stack trước khi nộp PA0.
