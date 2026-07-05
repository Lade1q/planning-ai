# NON-FUNCTIONAL REQUIREMENTS (NFR)

_Recall AI – Trợ lý ôn tập chủ động, truy ngược tận gốc kiến thức còn yếu_

> **Môn học:** Nhập môn Công nghệ Phần mềm  
> **Phiên bản:** 1.0

---

## Mục lục

- [Chú thích](#chú-thích)
- [1. Hiệu năng (Performance)](#1-hiệu-năng-performance)
- [2. Bảo mật (Security)](#2-bảo-mật-security)
- [3. Khả năng sử dụng (Usability)](#3-khả-năng-sử-dụng-usability)
- [4. Khả năng sẵn sàng & Độ tin cậy (Availability & Reliability)](#4-khả-năng-sẵn-sàng--độ-tin-cậy-availability--reliability)
- [5. Khả năng bảo trì & Mở rộng (Maintainability & Scalability)](#5-khả-năng-bảo-trì--mở-rộng-maintainability--scalability)
- [6. Tóm tắt chỉ số & Ràng buộc MVP](#6-tóm-tắt-chỉ-số--ràng-buộc-mvp)

---

## Chú thích

| Thuật ngữ / Viết tắt | Giải nghĩa tiếng Anh | Giải nghĩa tiếng Việt / Ý nghĩa trong dự án |
| --- | --- | --- |
| **NFR** | Non-Functional Requirement | Yêu cầu phi chức năng (hiệu năng, bảo mật, khả dụng, v.v.). |
| **MVP** | Minimum Viable Product | Sản phẩm khả thi tối thiểu (phiên bản đủ tính năng cốt lõi để demo). |
| **FCP** | First Contentful Paint | Thời gian tính từ lúc điều hướng đến khi nội dung đầu tiên được hiển thị trên màn hình. |
| **TTI** | Time to Interactive | Thời gian tính từ lúc trang bắt đầu tải đến khi người dùng có thể tương tác đầy đủ. |
| **API** | Application Programming Interface | Giao diện lập trình ứng dụng, phương thức để FE và BE giao tiếp với nhau. |
| **JWT** | JSON Web Token | Chuỗi mã hóa dùng để xác thực phiên đăng nhập của người dùng an toàn. |
| **DB** | Database | Cơ sở dữ liệu (trong dự án này là PostgreSQL). |
| **ORM** | Object-Relational Mapping | Kỹ thuật ánh xạ cấu trúc bảng DB vào các đối tượng code (sử dụng Prisma). |
| **CORS** | Cross-Origin Resource Sharing | Cơ chế bảo mật trình duyệt kiểm soát việc chia sẻ tài nguyên giữa các domain. |
| **WCAG** | Web Content Accessibility Guidelines | Bộ tiêu chuẩn về khả năng tiếp cận nội dung web cho mọi đối tượng. |
| **UI/UX** | User Interface / User Experience | Giao diện người dùng / Trải nghiệm người dùng. |
| **FE / BE** | Frontend / Backend | Tầng hiển thị giao diện (client) / Tầng xử lý logic máy chủ (server). |
| **TLS** | Transport Layer Security | Giao thức bảo mật mã hóa an toàn ở tầng truyền tải (nền tảng của HTTPS). |
| **CSP** | Content Security Policy | Chính sách bảo mật nội dung nhằm ngăn chặn các cuộc tấn công XSS. |
| **BFS** | Breadth-First Search | Thuật toán duyệt đồ thị theo chiều rộng (áp dụng cho Concept Graph Engine). |
| **DAG** | Directed Acyclic Graph | Đồ thị có hướng không có chu trình (cấu trúc cốt lõi của bản đồ khái niệm). |

---

## 1. Hiệu năng (Performance)

### 1.1 Tải trang & Phản hồi giao diện

| ID | Yêu cầu | Ngưỡng mục tiêu | Ghi chú |
| ------ | --------------------------------------------------------------------------------------------------------- | --------------- | -------------------------------------------------------------- |
| NFR-P1 | **Thời gian tải trang ban đầu** (First Contentful Paint – FCP) của các màn hình chính (Dashboard, Auth) | ≤ 3 giây | Đo trên kết nối mạng thông thường (Ethernet/Wi-Fi 25 Mbps) |
| NFR-P2 | **Time to Interactive (TTI)** — người dùng có thể tương tác với giao diện | ≤ 4 giây | Tính từ khi người dùng mở URL đến khi trang phản hồi |
| NFR-P3 | Thao tác điều hướng giữa các trang (client-side routing với React Router) | ≤ 500 ms | Không gọi API mới, chỉ render lại component |
| NFR-P4 | Hiển thị đồ thị khái niệm (react-flow) với tối đa 50 node/cạnh | ≤ 2 giây | Đây là giới hạn node MVP; đồ thị lớn hơn không thuộc phạm vi |

### 1.2 Phản hồi API Backend

| ID | Yêu cầu | Ngưỡng mục tiêu | Ghi chú |
| ------ | -------------------------------------------------------------------------------------------------------------------- | --------------- | ---------------------------------------------------------- |
| NFR-P5 | Các API xác thực (đăng nhập, đăng ký) | ≤ 500 ms | Không bao gồm độ trễ mạng phía người dùng |
| NFR-P6 | Các API CRUD thông thường (tạo kế hoạch, lưu phiên học, lấy lịch sử) | ≤ 1 giây | Truy vấn PostgreSQL tối ưu với Prisma ORM |
| NFR-P7 | API thuật toán truy ngược (BFS ngược trên Concept Graph Engine, ≤ 50 node, ≤ 2 tầng) | ≤ 500 ms | Chạy in-memory sau khi tải đồ thị từ DB |
| NFR-P8 | **Phản hồi từ Gemini API** (AI Study Planner: trích xuất khái niệm & đồ thị; AI Examiner: sinh câu hỏi, chấm điểm) | ≤ 15 giây | Độ trễ phụ thuộc Gemini API; hiển thị trạng thái loading |

> **Lưu ý MVP:** Ràng buộc hiệu năng được thiết kế phù hợp với quy mô MVP — một tài liệu ôn tập, ≤ 50 khái niệm, ≤ 3 lượt hỏi-đáp mỗi khái niệm. Các ngưỡng có thể cần xem xét lại khi mở rộng quy mô.

### 1.3 Kiểm soát chi phí & Rate Limit

| ID | Yêu cầu | Ghi chú |
| ------- | ------------------ | ---------------------------------------------------- |
| NFR-P9 | Cache kết quả AI (trích xuất đồ thị khái niệm) để không gọi lại API cho cùng tài liệu | Giảm chi phí và tránh vượt rate limit Gemini miễn phí |
| NFR-P10 | Giới hạn số lượt gọi AI Examiner mỗi người dùng mỗi ngày (có thể bỏ qua trong quá trình triển khai để tránh mỗi lần test phải đổi nhiều tài khoản) | Giá trị mặc định xác định ở Sprint 3 |

---

## 2. Bảo mật (Security)

### 2.1 Truyền tải dữ liệu

| ID | Yêu cầu | Ghi chú |
| ------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| NFR-S1 | **Toàn bộ giao tiếp giữa trình duyệt và server phải sử dụng HTTPS (TLS 1.2 trở lên)** | Bắt buộc trên môi trường staging/production; localhost có thể dùng HTTP để dev |
| NFR-S2 | Các API key và secret (Gemini API key, JWT secret, database URL) không được commit lên Git | Quản lý qua biến môi trường (`.env`); thêm `.env` vào `.gitignore` ngay từ Sprint 1 |

### 2.2 Xác thực & Phân quyền

| ID | Yêu cầu | Ghi chú |
| ------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| NFR-S3 | **Mật khẩu người dùng phải được hash bằng bcrypt** trước khi lưu vào database | Cost factor ≥ 10; không lưu mật khẩu dạng plaintext ở bất kỳ bước nào |
| NFR-S4 | Xác thực session bằng **JWT** (access token ngắn hạn + refresh token dài hạn) | Access token TTL ≤ 15 phút; refresh token TTL ≤ 7 ngày |
| NFR-S5 | Mỗi người dùng chỉ truy cập được dữ liệu của chính mình (kế hoạch, phiên học, đồ thị) | Kiểm tra `userId` ở tầng service/middleware trước mọi truy vấn DB |
| NFR-S6 | Endpoint nhạy cảm (đổi mật khẩu, xóa tài khoản) yêu cầu xác thực lại mật khẩu hiện tại | Bảo vệ trường hợp token bị lộ nhưng chưa hết hạn |

### 2.3 Bảo vệ đầu vào

| ID | Yêu cầu | Ghi chú |
| ------ | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| NFR-S7 | Validate và sanitize toàn bộ dữ liệu đầu vào phía backend bằng **Zod** trước khi xử lý | Không tin tưởng dữ liệu từ client, kể cả đã validate ở FE |
| NFR-S8 | Sử dụng **Prisma ORM** cho mọi truy vấn database; không dùng raw SQL nội suy chuỗi từ input | Phòng SQL Injection; nếu cần raw query, phải dùng parameterized |
| NFR-S9 | **Giới hạn kích thước file tài liệu** tải lên (text/ảnh) ở tầng middleware (multer) | Mức mặc định: ≤ 10 MB/file; điều chỉnh theo khảo sát thực tế |

### 2.4 HTTP Headers & CORS

| ID | Yêu cầu | Ghi chú |
| ------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| NFR-S10 | Cài đặt **helmet.js** trên Express để tự động thêm các HTTP security headers | Bao gồm: `X-Content-Type-Options`, `X-Frame-Options`, `CSP` cơ bản |
| NFR-S11 | Cấu hình **CORS** chỉ cho phép origin của frontend (không dùng `*` trên production) | Whitelist domain cụ thể; khác nhau giữa môi trường dev và prod |

---

## 3. Khả năng sử dụng (Usability)

### 3.1 Hỗ trợ trình duyệt

| ID | Yêu cầu | Ghi chú |
| ------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| NFR-U1 | Ứng dụng yêu cầu **hoạt động đúng và hiển thị tốt trên Chrome** | Tối ưu thời gian cho MVP. Hỗ trợ cross-browser (Edge, Firefox) được xếp vào diện Optional (có thể làm nếu dư thời gian) |
| NFR-U2 | Không bắt buộc hỗ trợ Safari hoặc các trình duyệt cũ (IE11, pre-Chromium Edge) ở giai đoạn MVP | Có thể xem xét sau nếu có người dùng phản hồi |

### 3.2 Thiết kế giao diện

| ID | Yêu cầu | Ghi chú |
| ------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| NFR-U3 | **Desktop-first**: Giao diện được thiết kế và kiểm thử chủ yếu trên màn hình ≥ 1280px (laptop/desktop) | Đối tượng người dùng (sinh viên) chủ yếu dùng laptop khi ôn tập |
| NFR-U4 | Giao diện có thể dùng được trên màn hình tablet (≥ 768px) nhưng **không bắt buộc tối ưu cho mobile** ở giai đoạn MVP | Responsive cơ bản với Tailwind CSS nhưng mobile không phải ưu tiên |
| NFR-U5 | Thông báo lỗi phải **rõ ràng, bằng tiếng Việt**, chỉ rõ người dùng cần làm gì tiếp theo (không chỉ mã lỗi kỹ thuật) | Ví dụ: "File quá lớn (tối đa 10 MB), vui lòng chọn file khác." |
| NFR-U6 | Các thao tác tốn thời gian (gọi AI, tải file) phải hiển thị **trạng thái loading** rõ ràng cho người dùng | Spinner, skeleton screen, hoặc thanh tiến trình tùy ngữ cảnh |
| NFR-U7 | Hành động không thể hoàn tác (xóa kế hoạch, xóa tài khoản) phải có **bước xác nhận** trước khi thực hiện | Dialog xác nhận với mô tả hậu quả cụ thể |

### 3.3 Khả năng tiếp cận (Accessibility)

| ID | Yêu cầu | Ghi chú |
| ------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| NFR-U8 | Các form, button và link có **label/aria-label** rõ ràng để hỗ trợ screen reader ở mức cơ bản | Tận dụng semantic HTML và các thuộc tính ARIA sẵn có trong shadcn/ui |
| NFR-U9 | Tỷ lệ tương phản màu chữ/nền đạt tối thiểu **WCAG 2.1 AA** (contrast ratio ≥ 4.5:1 cho text thường) | Kiểm tra với công cụ Figma hoặc browser DevTools khi thiết kế UI |

### 3.4 Ngôn ngữ & Nội dung

| ID | Yêu cầu | Ghi chú |
| ------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| NFR-U10 | Ngôn ngữ giao diện chính là **tiếng Việt** | Bao gồm label, placeholder, thông báo lỗi, tooltip; có thể có một số thuật ngữ kỹ thuật tiếng Anh |
| NFR-U11 | Câu hỏi và nhận xét từ AI Examiner phải **trả về bằng tiếng Việt** (hoặc ngôn ngữ khớp với tài liệu người dùng tải lên) | Điều khiển qua system prompt của Gemini API |

---

## 4. Khả năng sẵn sàng & Độ tin cậy (Availability & Reliability)

### 4.1 Mức độ sẵn sàng (MVP)

| ID | Yêu cầu | Ghi chú |
| ------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| NFR-A1 | **Đảm bảo 100% uptime trong các buổi báo cáo/demo Sprint** | Đây là thời điểm quan trọng nhất; trước giờ demo không được phép deploy code mới chưa qua test. |
| NFR-A2 | Hoạt động bảo trì/deploy lên staging cần **được thông báo trước trên nhóm chat** | Tránh làm gián đoạn quá trình test (QA) của các thành viên khác; không áp dụng khái niệm "giờ cao điểm" do tính chất làm việc linh hoạt của sinh viên. |

### 4.2 Xử lý lỗi & Dự phòng

| ID | Yêu cầu | Ghi chú |
| ------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| NFR-A3 | Khi **Gemini API lỗi hoặc hết quota**, hệ thống tự động chuyển sang chế độ flashcard tĩnh (câu hỏi đã sinh sẵn) | Cơ chế dự phòng đã định nghĩa trong mục 5.3 của project proposal |
| NFR-A4 | AI sinh sai định dạng JSON schema → hệ thống thử lại tối đa **3 lần** hoặc chia nhỏ tài liệu theo heading | Cơ chế retry đã định nghĩa trong mục 5.1 của project proposal |
| NFR-A5 | Mọi lỗi không xử lý được ở backend phải trả về **HTTP status code phù hợp** và message lỗi dạng JSON chuẩn | Không để Express trả về HTML error page mặc định ra client |
| NFR-A6 | Dữ liệu người dùng (kế hoạch, đồ thị, phiên học) phải được **lưu ngay khi hoàn thành** mỗi bước | Tránh mất dữ liệu nếu người dùng đóng tab giữa chừng |

### 4.3 Sao lưu dữ liệu

| ID | Yêu cầu | Ghi chú |
| ------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| NFR-A7 | Database PostgreSQL phải được **backup thủ công** trước mỗi Sprint demo | Phù hợp với quy mô MVP/môn học; không yêu cầu backup tự động |

---

## 5. Khả năng bảo trì & Mở rộng (Maintainability & Scalability)

### 5.1 Chất lượng mã nguồn

| ID | Yêu cầu | Ghi chú |
| ------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| NFR-M1 | Áp dụng **ESLint + Prettier** thống nhất cho toàn bộ codebase (Frontend và Backend) ngay từ Sprint 1 | Cấu hình chung được Architect thiết lập và không được override cá nhân |
| NFR-M2 | Tuân thủ cấu trúc thư mục quy ước: Backend (`routes/`, `controllers/`, `services/`), Frontend (`components/`, `pages/`, `hooks/`) | Giảm rủi ro "code không nhất quán" đã nêu trong mục 9.2 proposal |
| NFR-M3 | Các hàm/module có logic phức tạp (thuật toán BFS truy ngược, state machine Interview) phải có **comment giải thích** | Không yêu cầu JSDoc đầy đủ, nhưng phải đủ để người khác trong nhóm đọc hiểu |
| NFR-M4 | **Thuật toán Concept Graph Engine** (BFS truy ngược) phải có **unit test** với dữ liệu đồ thị và `mastery_score` giả lập | Không cần gọi AI thật; test-ability là yêu cầu thiết kế của thuật toán |

### 5.2 Khả năng cấu hình

| ID | Yêu cầu | Ghi chú |
| ------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| NFR-M5 | Các tham số nghiệp vụ quan trọng phải **cấu hình được qua biến môi trường** (không hardcode trong logic) | Ví dụ: `MASTERY_THRESHOLD` (ngưỡng điểm yếu, mặc định 0.6), `MAX_INTERVIEW_TURNS` (mặc định 3), `MAX_REMEDIATION_DEPTH` (mặc định 2 tầng) |
| NFR-M6 | Lớp gọi AI phải được **bọc trong AI service layer** (abstraction) tách biệt với business logic | Cho phép chuyển provider từ Gemini sang provider khác mà không cần sửa nhiều |

### 5.3 Kiểm thử (Testing)

| ID | Yêu cầu | Ghi chú |
| ------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| NFR-M7 | Mỗi tính năng hoàn thành trong một Sprint phải có **test case tương ứng** trong test plan (QA/Tester phụ trách) | Không yêu cầu coverage % cụ thể ở MVP, nhưng các happy path phải được test |
| NFR-M8 | Toàn bộ các luồng QA/Testing yêu cầu thực hiện trên **Chrome** | Việc test các trình duyệt khác là Optional. QA dồn chủ yếu vào test luồng tính năng, API và prompt AI để bảo vệ tính năng lõi |

---

## 6. Tóm tắt chỉ số & Ràng buộc MVP

Bảng dưới tổng hợp các chỉ số định lượng quan trọng nhất, phù hợp với phạm vi MVP 10 tuần của nhóm CAGT.

| Nhóm NFR | Chỉ số chính | Ngưỡng MVP |
| ------------ | -------------------------------------------------------- | ----------------- |
| Hiệu năng | FCP trang chính (Dashboard, Auth) | ≤ 3 giây |
| Hiệu năng | Phản hồi API thông thường | ≤ 1 giây |
| Hiệu năng | Phản hồi Gemini API (AI tính năng) | ≤ 15 giây |
| Hiệu năng | Thuật toán BFS truy ngược (≤ 50 node, ≤ 2 tầng) | ≤ 500 ms |
| Bảo mật | Truyền tải dữ liệu | HTTPS bắt buộc |
| Bảo mật | Lưu trữ mật khẩu | bcrypt, cost ≥ 10 |
| Bảo mật | Xác thực session | JWT (access + refresh) |
| Khả dụng | Trình duyệt hỗ trợ | Bắt buộc Chrome (các trình duyệt khác Optional) |
| Khả dụng | Nền tảng ưu tiên | Desktop-first (≥ 1280px) |
| Sẵn sàng | Uptime trong các buổi báo cáo/demo Sprint | Đảm bảo 100% |
| Sẵn sàng | Dự phòng khi AI lỗi | Fallback flashcard tĩnh |
| Bảo trì | Unit test thuật toán Concept Graph Engine | Bắt buộc |
| Bảo trì | Cross-browser test | Optional |

> **Ghi chú về phạm vi MVP:** Tất cả các ràng buộc trên được thiết kế phù hợp với một nhóm 5 sinh viên, thời gian 10 tuần, môi trường staging (không phải production thương mại). Các NFR có thể được xem xét và điều chỉnh khi dự án chuyển sang giai đoạn triển khai thực tế.

---