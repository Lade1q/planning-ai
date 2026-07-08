# FUNCTIONAL REQUIREMENTS (Yêu cầu chức năng) – Recall AI
> **Phiên bản:** 1.0  
> **Trạng thái:** Draft  

---

## Mục lục

- [1. Ghi chú & Quy ước](#1-ghi-chú--quy-ước)
- [2. Các Modules chức năng](#2-các-modules-chức-năng)
   - [2.1. Module: Auth – Xác thực & Tài khoản](#21-module-auth--xác-thực--tài-khoản)
   - [2.2. Module: AI Planning – Lập kế hoạch học tập bằng AI](#22-module-ai-planning--lập-kế-hoạch-học-tập-bằng-ai)
   - [2.3. Module: Focus Session – Phiên tập trung](#23-module-focus-session--phiên-tập-trung)
   - [2.4. Module: Verify – Kiểm chứng kiến thức](#24-module-verify--kiểm-chứng-kiến-thức)
   - [2.5. Module: Dashboard – Tổng quan tiến độ](#25-module-dashboard--tổng-quan-tiến-độ)
- [3. Ràng buộc hệ thống & Quy tắc nghiệp vụ](#3-ràng-buộc-hệ-thống--quy-tắc-nghiệp-vụ)

---

## 1. Ghi chú & Quy ước

Mỗi yêu cầu chức năng được viết theo định dạng:
> **"Hệ thống phải (The system shall)..."**

Mức độ ưu tiên được phân loại:
- **Cao (High):** Chức năng cốt lõi, bắt buộc phải có trong MVP.
- **Trung bình (Medium):** Chức năng quan trọng, giúp tăng giá trị sản phẩm.
- **Thấp (Low):** Chức năng nice-to-have, có thể xem xét trong các giai đoạn sau.

**Chú thích:**
| Thuật ngữ | Giải thích |
| --- | --- |
| **FR** | Functional Requirement - Yêu cầu chức năng |
| **AC** | Acceptance Criteria - Tiêu chí chấp nhận |
| **Task** | Khái niệm/nhiệm vụ nhỏ mà người dùng cần học |

---

## 2. Các Modules chức năng

### 2.1. Module: Auth – Xác thực & Tài khoản

#### **FR-AUTH-01 – Đăng ký tài khoản**

| Trường | Nội dung |
|---|---|
| **ID** | FR-AUTH-01 |
| **Mô tả chức năng** | Hệ thống phải cho phép người dùng chưa có tài khoản đăng ký mới bằng email và mật khẩu. |
| **Mức độ ưu tiên** | Cao |

**Tiêu chí chấp nhận (Acceptance Criteria):**
- [ ] AC1: Người dùng có thể nhập email, mật khẩu và xác nhận mật khẩu.
- [ ] AC2: Hệ thống kiểm tra định dạng email hợp lệ và mật khẩu đủ mạnh (tối thiểu 8 ký tự).
- [ ] AC3: Hệ thống hiển thị thông báo lỗi rõ ràng nếu email đã tồn tại trong cơ sở dữ liệu.
- [ ] AC4: Sau khi đăng ký thành công, hệ thống tự động đăng nhập và chuyển hướng đến Dashboard.

---

#### **FR-AUTH-02 – Đăng nhập tài khoản**

| Trường | Nội dung |
|---|---|
| **ID** | FR-AUTH-02 |
| **Mô tả chức năng** | Hệ thống phải cho phép người dùng đăng nhập vào ứng dụng bằng tài khoản (email và mật khẩu) đã được đăng ký. |
| **Mức độ ưu tiên** | Cao |

**Tiêu chí chấp nhận:**
- [ ] AC1: Người dùng có thể đăng nhập bằng email và mật khẩu hợp lệ.
- [ ] AC2: Hệ thống hiển thị thông báo lỗi nếu email không tồn tại hoặc sai mật khẩu.
- [ ] AC3: Hệ thống hỗ trợ tùy chọn "Ghi nhớ đăng nhập" để duy trì phiên làm việc.
- [ ] AC4: Sau khi đăng nhập thành công, hệ thống chuyển hướng người dùng đến Dashboard.

---

#### **FR-AUTH-03 – Đăng xuất tài khoản**

| Trường | Nội dung |
|---|---|
| **ID** | FR-AUTH-03 |
| **Mô tả chức năng** | Hệ thống phải cung cấp tính năng để người dùng đăng xuất khỏi phiên làm việc hiện tại nhằm bảo mật dữ liệu. |
| **Mức độ ưu tiên** | Trung bình |

**Tiêu chí chấp nhận:**
- [ ] AC1: Nút "Đăng xuất" phải có sẵn từ bất kỳ trang nào bên trong ứng dụng sau khi đã xác thực.
- [ ] AC2: Sau khi nhấn đăng xuất, session của người dùng bị hủy và hệ thống chuyển về trang đăng nhập hoặc Landing Page.
- [ ] AC3: Hệ thống phải ngăn chặn truy cập vào các trang yêu cầu xác thực sau khi đã đăng xuất.

---

#### **FR-AUTH-04 – Quản lý hồ sơ cá nhân**

| Trường | Nội dung |
|---|---|
| **ID** | FR-AUTH-04 |
| **Mô tả chức năng** | Hệ thống phải cho phép người dùng xem và cập nhật thông tin tài khoản cá nhân. |
| **Mức độ ưu tiên** | Thấp |

**Tiêu chí chấp nhận:**
- [ ] AC1: Người dùng có thể xem tên hiển thị và địa chỉ email ở trang hồ sơ.
- [ ] AC2: Người dùng có thể thay đổi mật khẩu sau khi nhập chính xác mật khẩu hiện tại.

---

### 2.2. Module: AI Planning – Lập kế hoạch học tập bằng AI

#### **FR-PLAN-01 – Tạo kế hoạch học tập từ tài liệu bằng AI**

| Trường | Nội dung |
|---|---|
| **ID** | FR-PLAN-01 |
| **Mô tả chức năng** | Hệ thống phải sử dụng AI để phân tích tài liệu đầu vào (văn bản, hình ảnh, file) và tự động tạo ra một kế hoạch học tập có cấu trúc (Concept Graph). |
| **Mức độ ưu tiên** | Cao |

**Tiêu chí chấp nhận:**
- [ ] AC1: Người dùng có thể nhập văn bản trực tiếp hoặc tải lên file (ảnh/tài liệu).
- [ ] AC2: AI phải phân tích nội dung, trích xuất danh sách các khái niệm (task) và xác định **quan hệ tiên quyết** giữa chúng.
- [ ] AC3: Kết quả phải được render và hiển thị trực quan dưới dạng **sơ đồ cây / đồ thị phân cấp**, không phải văn bản thuần túy.
- [ ] AC4: Mỗi task có tên, mô tả ngắn và đề xuất thứ tự học tập.
- [ ] AC5: Toàn bộ quá trình xử lý của AI phải hoàn thành trong vòng tối đa [10 giây].

---

#### **FR-PLAN-02 – Chỉnh sửa kế hoạch do AI tạo ra**

| Trường | Nội dung |
|---|---|
| **ID** | FR-PLAN-02 |
| **Mô tả chức năng** | Hệ thống phải cho phép người dùng chỉnh sửa đồ thị/kế hoạch học tập mà AI vừa tạo ra để đảm bảo tính chính xác và cá nhân hóa. |
| **Mức độ ưu tiên** | Cao |

**Tiêu chí chấp nhận:**
- [ ] AC1: Người dùng có thể thêm mới, xóa bỏ hoặc đổi tên bất kỳ task/khái niệm nào.
- [ ] AC2: Người dùng có thể thay đổi thứ tự và quan hệ kết nối giữa các task bằng cách kéo thả.
- [ ] AC3: Mọi thay đổi sẽ được lưu tự động sau mỗi hành động chỉnh sửa.

---

#### **FR-PLAN-03 – Đánh dấu hoàn thành task**

| Trường | Nội dung |
|---|---|
| **ID** | FR-PLAN-03 |
| **Mô tả chức năng** | Hệ thống phải cho phép người dùng chủ động đánh dấu trạng thái hoàn thành cho các task trong kế hoạch. |
| **Mức độ ưu tiên** | Cao |

**Tiêu chí chấp nhận:**
- [ ] AC1: Cung cấp nút thao tác để người dùng check/đánh dấu hoàn thành từng task.
- [ ] AC2: Các task đã hoàn thành phải hiển thị khác biệt về mặt giao diện (vd: gạch ngang chữ, đổi màu).
- [ ] AC3: Tiến độ (progress) tổng thể của kế hoạch phải được tính toán lại và hiển thị ngay lập tức.
- [ ] AC4: Cho phép người dùng bỏ đánh dấu (uncheck) hoàn thành nếu nhầm lẫn hoặc muốn học lại.

---

#### **FR-PLAN-04 – Xem lại lịch sử kế hoạch đã tạo**

| Trường | Nội dung |
|---|---|
| **ID** | FR-PLAN-04 |
| **Mô tả chức năng** | Hệ thống phải lưu trữ và cho phép người dùng truy xuất danh sách các kế hoạch học tập đã được tạo trước đó. |
| **Mức độ ưu tiên** | Trung bình |

**Tiêu chí chấp nhận:**
- [ ] AC1: Danh sách các kế hoạch được hiển thị sắp xếp theo thứ tự thời gian (mới nhất hiển thị trước).
- [ ] AC2: Người dùng có thể click mở để xem chi tiết và tiếp tục học dựa trên kế hoạch cũ.
- [ ] AC3: Cung cấp tính năng xóa bỏ các kế hoạch không còn sử dụng.

---

#### **FR-PLAN-05 – Gợi ý thứ tự ưu tiên task dựa trên deadline**

| Trường | Nội dung |
|---|---|
| **ID** | FR-PLAN-05 |
| **Mô tả chức năng** | Hệ thống phải hỗ trợ phân tích và gợi ý thứ tự ưu tiên học tập dựa trên deadline do người dùng cung cấp và độ khó ước tính bởi AI. |
| **Mức độ ưu tiên** | Cao |

**Tiêu chí chấp nhận:**
- [ ] AC1: Người dùng có thể gán deadline cho các task hoặc cho toàn bộ kế hoạch.
- [ ] AC2: Hệ thống phải có khả năng sắp xếp/lọc task dựa trên độ cấp bách của deadline hoặc độ khó của task.
- [ ] AC3: Hiển thị các nhãn/cảnh báo trực quan (ví dụ: cờ đỏ) cho những task sắp đến hạn (vd: dưới 24h, 3 ngày).

---

### 2.3. Module: Focus Session – Phiên tập trung

#### **FR-FOCUS-01 – Bắt đầu phiên tập trung (Timer)**

| Trường | Nội dung |
|---|---|
| **ID** | FR-FOCUS-01 |
| **Mô tả chức năng** | Hệ thống phải cung cấp công cụ đếm ngược thời gian hỗ trợ phương pháp học tập ngắt quãng (vd: Pomodoro). |
| **Mức độ ưu tiên** | Trung bình |

**Tiêu chí chấp nhận:**
- [ ] AC1: Cho phép người dùng chọn thời lượng phiên học tập (mặc định 25 phút) và nghỉ giải lao (mặc định 5 phút).
- [ ] AC2: Hiển thị đồng hồ đếm ngược trực quan trong suốt thời gian học.
- [ ] AC3: Cung cấp các thao tác điều khiển: Tạm dừng (Pause), Tiếp tục (Resume) và Hủy (Cancel).
- [ ] AC4: Phát ra âm thanh báo hiệu hoặc hiển thị thông báo push khi hết giờ đếm ngược.

---

#### **FR-FOCUS-02 – Ghi chú thời điểm xao nhãng trong phiên**

| Trường | Nội dung |
|---|---|
| **ID** | FR-FOCUS-02 |
| **Mô tả chức năng** | Hệ thống phải cho phép người dùng ghi lại nhanh (bookmark) những thời điểm bị xao nhãng (mất tập trung) trong lúc phiên học đang diễn ra. |
| **Mức độ ưu tiên** | Trung bình |

**Tiêu chí chấp nhận:**
- [ ] AC1: Cung cấp nút thao tác nhanh "Ghi chú xao nhãng" trên giao diện phiên đếm ngược.
- [ ] AC2: Hệ thống sẽ tự động lưu lại timestamp tại thời điểm người dùng click, kèm theo ô input tùy chọn để người dùng nhập ghi chú nhỏ.
- [ ] AC3: Danh sách các mốc thời gian xao nhãng được tổng hợp vào bản báo cáo sau phiên.
- [ ] AC4: Hệ thống tự động truyền (map) dữ liệu thời điểm xao nhãng này sang Module Verify.

---

#### **FR-FOCUS-03 – Xem tóm tắt sau phiên học**

| Trường | Nội dung |
|---|---|
| **ID** | FR-FOCUS-03 |
| **Mô tả chức năng** | Hệ thống phải hiển thị bản báo cáo tóm tắt hiệu suất ngay sau khi người dùng kết thúc một phiên học tập trung. |
| **Mức độ ưu tiên** | Trung bình |

**Tiêu chí chấp nhận:**
- [ ] AC1: Màn hình tóm tắt phải hiển thị: tổng thời gian tập trung thực tế, số lần bấm tạm dừng, số lần ghi nhận xao nhãng.
- [ ] AC2: Cung cấp nút CTA (Call To Action) hướng dẫn người dùng chuyển thẳng sang Module Verify để kiểm chứng kiến thức.
- [ ] AC3: Dữ liệu của phiên phải được lưu lại vào cơ sở dữ liệu để tổng hợp trên Dashboard sau này.

---

#### **FR-FOCUS-04 – Liên kết phiên học với task cụ thể**

| Trường | Nội dung |
|---|---|
| **ID** | FR-FOCUS-04 |
| **Mô tả chức năng** | Hệ thống phải cho phép người dùng gắn một phiên học tập với một task cụ thể nằm trong kế hoạch học tập (Concept Graph). |
| **Mức độ ưu tiên** | Thấp |

**Tiêu chí chấp nhận:**
- [ ] AC1: Trước khi bắt đầu Start Timer, người dùng có tùy chọn "Chọn task liên quan" từ danh sách kế hoạch hiện tại.
- [ ] AC2: Nếu có liên kết, thời lượng học của phiên sẽ được cộng dồn vào tổng thời gian đã dành cho task đó.
- [ ] AC3: Tính năng này không bắt buộc, người dùng vẫn có thể bắt đầu phiên đếm ngược tự do (độc lập).

---

### 2.4. Module: Verify – Kiểm chứng kiến thức

#### **FR-VERIFY-01 – Bắt đầu phiên kiểm chứng kiến thức với AI (AI Examiner)**

| Trường | Nội dung |
|---|---|
| **ID** | FR-VERIFY-01 |
| **Mô tả chức năng** | Hệ thống phải có một trợ lý AI vấn đáp, chủ động đặt câu hỏi dựa trên tài liệu người dùng đã học để kiểm tra kiến thức. |
| **Mức độ ưu tiên** | Cao |

**Tiêu chí chấp nhận:**
- [ ] AC1: Trợ lý AI (AI Examiner) sẽ đặt câu hỏi kiểm tra dựa trên nội dung đã được trích xuất ở Module Planning.
- [ ] AC2: Phiên vấn đáp diễn ra theo mô hình turn-based (AI hỏi -> Người dùng trả lời -> AI feedback -> AI hỏi tiếp).
- [ ] AC3: AI phản hồi ngay lập tức tính Đúng/Sai sau mỗi câu trả lời của người dùng.
- [ ] AC4: Giới hạn phiên vấn đáp ở mức tối đa [N lượt hỏi-đáp] (vd: 3 lượt) trên mỗi khái niệm để tránh vòng lặp lan man.
- [ ] AC5: Người dùng có thể nhấn nút "Kết thúc phiên kiểm chứng" bất kỳ lúc nào.

---

#### **FR-VERIFY-02 – Nhận diện lỗi sai và giải thích cụ thể**

| Trường | Nội dung |
|---|---|
| **ID** | FR-VERIFY-02 |
| **Mô tả chức năng** | Khi người dùng trả lời sai hoặc thiếu ý, hệ thống AI phải phân tích câu trả lời, chỉ ra điểm sai cụ thể và cung cấp giải thích đính kèm trích dẫn gốc. |
| **Mức độ ưu tiên** | Cao |

**Tiêu chí chấp nhận:**
- [ ] AC1: Với đáp án sai, AI phải phản hồi rõ "Sai ở đâu" và "Tại sao sai".
- [ ] AC2: AI phải cung cấp đáp án đúng và đính kèm nội dung tham chiếu (citation) từ tài liệu gốc.
- [ ] AC3: Nếu đáp án chỉ đúng một phần, AI có khả năng đặt ra câu hỏi "follow-up" để dẫn dắt người dùng đi đúng hướng.

---

#### **FR-VERIFY-03 – Báo cáo kết quả sau phiên kiểm chứng**

| Trường | Nội dung |
|---|---|
| **ID** | FR-VERIFY-03 |
| **Mô tả chức năng** | Hệ thống phải tạo ra một bản báo cáo tổng kết chi tiết ngay khi người dùng kết thúc phiên Verify, giúp họ định hình điểm yếu. |
| **Mức độ ưu tiên** | Cao |

**Tiêu chí chấp nhận:**
- [ ] AC1: Bản tóm tắt phải hiển thị số liệu thống kê: tổng số lượt hỏi, số câu đúng hoàn toàn, số câu sai/thiếu sót.
- [ ] AC2: Tổng hợp và liệt kê rõ ràng các "Khái niệm / Task bị trả lời sai".
- [ ] AC3: Hệ thống đưa ra đề xuất tiếp theo (Ví dụ: "Học lại bài X" hoặc "Hoàn thành tốt, chuyển sang bài Y").
- [ ] AC4: Kết quả (bao gồm `mastery_score` của task) được cập nhật và lưu trữ vào DB.

---

#### **FR-VERIFY-04 – Kiểm chứng tự động vào khoảng thời gian xao nhãng**

| Trường | Nội dung |
|---|---|
| **ID** | FR-VERIFY-04 |
| **Mô tả chức năng** | Hệ thống phải sử dụng dữ liệu "timestamp xao nhãng" (từ Module Focus) để định hướng AI Examiner đặt câu hỏi tập trung vào nội dung tương ứng. |
| **Mức độ ưu tiên** | Trung bình |

**Tiêu chí chấp nhận:**
- [ ] AC1: Nếu người dùng bắt đầu Verify ngay sau Focus Session có ghi nhận xao nhãng, AI sẽ nhận được context dữ liệu này.
- [ ] AC2: Trọng số của các câu hỏi liên quan đến nội dung tài liệu ở mốc thời gian xao nhãng phải được ưu tiên sinh ra trước.
- [ ] AC3: Chỉ kích hoạt tính năng này khi có liên kết dữ liệu giữa Focus Session và Verify.

---

#### **FR-VERIFY-05 – Lựa chọn chủ đề kiểm chứng thủ công**

| Trường | Nội dung |
|---|---|
| **ID** | FR-VERIFY-05 |
| **Mô tả chức năng** | Hệ thống phải cho phép người dùng chủ động chọn bất kỳ chủ đề/khái niệm nào để khởi tạo một phiên vấn đáp kiểm tra tự do. |
| **Mức độ ưu tiên** | Trung bình |

**Tiêu chí chấp nhận:**
- [ ] AC1: Cung cấp giao diện để người dùng chọn nhanh một hay nhiều task/khái niệm từ danh sách hoặc từ cây đồ thị kế hoạch.
- [ ] AC2: Khởi tạo phiên Verify hoạt động độc lập (không cần thông qua Focus Session) dựa trên các task được chọn.

---

#### **FR-VERIFY-06 – Phân tích lỗ hổng kiến thức nền tảng (Auto-Remediation)**

| Trường | Nội dung |
|---|---|
| **ID** | FR-VERIFY-06 |
| **Mô tả chức năng** | Hệ thống phải tự động rà soát đồ thị khái niệm (Concept Graph) để phát hiện và nhắc khoá ôn lại kiến thức tiên quyết (nền tảng) nếu người dùng liên tục trả lời sai khái niệm ở cấp cao hơn. |
| **Mức độ ưu tiên** | Cao |

**Tiêu chí chấp nhận:**
- [ ] AC1: Khi một concept bị đánh giá "Yếu" (mastery score thấp) sau phiên Verify, AI phải kiểm tra các node (khái niệm) tiên quyết kết nối trước nó trong Graph.
- [ ] AC2: Hệ thống tự động đẩy các concept nền tảng đó vào danh sách "Ưu tiên ôn tập".
- [ ] AC3: Hiển thị thông báo giải thích rõ cho người dùng lý do tại sao hệ thống lại gợi ý quay ngược lại học bài cũ.

---

### 2.5. Module: Dashboard – Tổng quan tiến độ

#### **FR-DASH-01 – Xem tổng quan tiến độ học tập**

| Trường | Nội dung |
|---|---|
| **ID** | FR-DASH-01 |
| **Mô tả chức năng** | Hệ thống phải cung cấp Dashboard tổng hợp hiển thị tiến độ hoàn thành các kế hoạch học tập của người dùng. |
| **Mức độ ưu tiên** | Cao |

**Tiêu chí chấp nhận:**
- [ ] AC1: Hiển thị tổng quan số lượng task (hoàn thành / tổng số) cho mỗi kế hoạch học tập hiện tại.
- [ ] AC2: Tỷ lệ hoàn thành được render thành biểu đồ (progress bar hoặc hình vòng tròn).
- [ ] AC3: Dashboard áp dụng nguyên tắc thiết kế tối giản, hỗ trợ giao diện tối (Dark mode) và tải xong dữ liệu trong dưới 2 giây.

---

#### **FR-DASH-02 – Báo cáo Điểm mạnh & Điểm yếu (Knowledge Map)**

| Trường | Nội dung |
|---|---|
| **ID** | FR-DASH-02 |
| **Mô tả chức năng** | Hệ thống phải phản ánh thực trạng năng lực người dùng thông qua các chỉ số "Vững" (mastery) từ kết quả kiểm chứng. |
| **Mức độ ưu tiên** | Cao |

**Tiêu chí chấp nhận:**
- [ ] AC1: Tính toán và lưu trữ `mastery_score` (điểm thông hiểu) cho từng chủ đề/khái niệm.
- [ ] AC2: Phân nhóm tự động các chủ đề thành: "Mạnh" (Điểm cao), "Trung bình", và "Yếu" (Điểm thấp).
- [ ] AC3: Render kết quả lên một đồ thị (Concept Graph thu nhỏ) với mã màu hiển thị trực quan mức độ thông hiểu ở từng node.
- [ ] AC4: Cung cấp danh sách các chủ đề "Yếu" kèm nút CTA (Action button) để người dùng ôn tập lại ngay.

---

#### **FR-DASH-03 – Lịch sử phiên học và kiểm chứng**

| Trường | Nội dung |
|---|---|
| **ID** | FR-DASH-03 |
| **Mô tả chức năng** | Hệ thống phải cung cấp nhật ký (log) theo dõi mọi hoạt động tương tác của người dùng với hệ thống (phiên học, phiên kiểm chứng). |
| **Mức độ ưu tiên** | Trung bình |

**Tiêu chí chấp nhận:**
- [ ] AC1: Hiển thị dạng bảng (Table/List) danh sách các Focus Sessions (có ngày giờ, thời lượng thực tế).
- [ ] AC2: Hiển thị dạng bảng (Table/List) danh sách các Verify Sessions (có điểm số/kết quả, chủ đề kiểm tra).
- [ ] AC3: Cung cấp tính năng bộ lọc theo thời gian (7 ngày qua, 30 ngày qua, tất cả).

---

#### **FR-DASH-04 – Thống kê thời gian học tập tích lũy**

| Trường | Nội dung |
|---|---|
| **ID** | FR-DASH-04 |
| **Mô tả chức năng** | Hệ thống phải tính toán và biểu đồ hóa tổng thời gian học tập thực tế của người dùng theo thời gian (tuần/tháng). |
| **Mức độ ưu tiên** | Trung bình |

**Tiêu chí chấp nhận:**
- [ ] AC1: Tính tổng thời lượng học tập từ các Focus Sessions đã hoàn tất trong khoảng thời gian xác định.
- [ ] AC2: Hiển thị biểu đồ dạng cột/đường cho thấy sự phân bổ thời gian học các ngày trong tuần.
- [ ] AC3: Đưa ra chỉ số so sánh (trend) với khung thời gian trước đó (vd: +15% so với tuần trước).

---

## 3. Ràng buộc hệ thống & Quy tắc nghiệp vụ

Dựa trên yêu cầu, các chức năng hệ thống bị ràng buộc bởi các quy tắc kỹ thuật và AI sau:

1. **Ràng buộc Hallucination (Grounded AI)**: Toàn bộ quá trình sinh kế hoạch và sinh câu hỏi kiểm chứng bắt buộc phải neo (grounded) 100% vào tài liệu gốc mà người dùng đã tải lên. AI Examiner không được phép tự sáng tác câu hỏi dựa trên kiến thức bên ngoài (trừ khi liên quan đến logic suy luận cơ bản).
2. **Ràng buộc Token & Chi phí**: Phiên AI Verify phải giới hạn số lượt context qua lại (vd: max 3-5 lượt cho một concept) để quản lý chi phí API và tránh lỗi LLM bị "trôi context" khi chat quá dài.
3. **Quy tắc Human-in-the-loop**: Hệ thống không tự động thay đổi lịch học một cách cứng nhắc. Việc tái cơ cấu kế hoạch (như thêm bài ôn tập) phải được người dùng phê duyệt hoặc điều chỉnh linh hoạt thủ công (như tính năng FR-PLAN-02).


---

