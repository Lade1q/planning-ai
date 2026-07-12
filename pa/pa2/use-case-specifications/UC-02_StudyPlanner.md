# MODULE 2: AI Study Planner — Use-Case Specification

> **Hệ thống:** Recall AI  
> **Phiên bản:** 1.0  
> **Ngày:** 2026-07-11

---

## UC SP-01: Tạo Kế hoạch Học tập

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Tạo Kế hoạch Học tập |
| **Brief Description** | Use case này mô tả cách Người dùng (Student) tải tài liệu học tập lên hệ thống để AI tự động phân tích, trích xuất các khái niệm và tạo ra đồ thị kế hoạch học tập dạng DAG (Directed Acyclic Graph). |
| **Actors** | Student, AI Service (Google Gemini), Scheduling & Remediation Engine |

### Pre-conditions

- Người dùng đã đăng nhập thành công vào hệ thống.
- Người dùng có tài liệu học tập ở định dạng PDF, ảnh hoặc văn bản thuần.

### Basic Flow

1. Người dùng truy cập tính năng **"Tạo Kế hoạch Học tập"** và nhấn nút **"Tạo mới"**.
2. Hệ thống hiển thị giao diện tải tài liệu; Người dùng chọn và tải lên file tài liệu (PDF, ảnh, hoặc văn bản).
3. Hệ thống nhận file và gửi yêu cầu phân tích đến AI Service (Google Gemini) để trích xuất các khái niệm (concepts) và mối quan hệ giữa chúng (`extract_concepts`).
4. AI Service xử lý tài liệu và trả về danh sách các khái niệm cùng cấu trúc phụ thuộc (prerequisites).
5. Hệ thống xác thực cấu trúc đồ thị nhận được (Validate DAG) để đảm bảo không có chu trình (cycle check).
6. Hệ thống hiển thị đồ thị kế hoạch học tập sơ bộ trên giao diện react-flow để Người dùng xem xét (include SP-02: Tương tác Đồ thị Kế hoạch).
7. Người dùng xem xét đồ thị, điều chỉnh nếu cần, rồi nhấn **"Xác nhận & Lưu"**.
8. Scheduling & Remediation Engine nhận đồ thị đã xác nhận và tạo lịch ôn tập ban đầu cho Người dùng.
9. Hệ thống hiển thị thông báo: *"Kế hoạch học tập đã được tạo thành công!"* và chuyển hướng đến trang chi tiết kế hoạch.

### Alternative Flows

**Alternative Flow 1: Lỗi API từ AI Service (Google Gemini)**

1. Từ bước 3 của Basic Flow, AI Service trả về lỗi (timeout, lỗi kết nối, hoặc lỗi xử lý).
2. Hệ thống chuyển yêu cầu sang hàng đợi bất đồng bộ (xem SP-05: Xử lý Bất đồng bộ) và thông báo cho Người dùng: *"Hệ thống đang xử lý tài liệu của bạn. Chúng tôi sẽ thông báo khi hoàn tất."*
3. Hệ thống tiếp tục thử gọi lại API theo cơ chế retry và cập nhật trạng thái cho Người dùng.

**Alternative Flow 2: Định dạng file không được hỗ trợ**

1. Từ bước 2 của Basic Flow, Người dùng tải lên file có định dạng không hỗ trợ (ví dụ: .docx, .pptx).
2. Hệ thống từ chối file và hiển thị thông báo lỗi: *"Định dạng file không được hỗ trợ. Vui lòng tải lên file PDF, ảnh (JPG/PNG) hoặc văn bản (.txt)."*
3. Người dùng chọn lại file đúng định dạng và thử lại.

**Alternative Flow 3: Đồ thị DAG chứa chu trình (Cycle Detected)**

1. Từ bước 5 của Basic Flow, hệ thống phát hiện cấu trúc đồ thị có chu trình (cycle), vi phạm tính chất DAG.
2. Hệ thống hiển thị thông báo cảnh báo: *"Cấu trúc kế hoạch có vòng lặp. Vui lòng điều chỉnh các mối quan hệ trước khi lưu."* và highlight các cạnh gây ra chu trình.
3. Người dùng chỉnh sửa đồ thị trong giao diện SP-02 để loại bỏ chu trình, sau đó lưu lại.

### Post-conditions

- Kế hoạch học tập mới được tạo và lưu vào cơ sở dữ liệu.
- Lịch ôn tập ban đầu được Scheduling Engine tạo tự động dựa trên đồ thị.
- Kế hoạch xuất hiện trong danh sách của SP-03: Quản lý Danh sách Kế hoạch.

---

## UC SP-02: Tương tác Đồ thị Kế hoạch

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Tương tác Đồ thị Kế hoạch |
| **Brief Description** | Use case này mô tả cách Người dùng (Student) tương tác trực tiếp với đồ thị kế hoạch học tập trên giao diện react-flow: thêm/xóa node, thêm/xóa cạnh quan hệ, và xác nhận cấu trúc đồ thị. |
| **Actors** | Student |

### Pre-conditions

- Người dùng đã đăng nhập và có ít nhất một kế hoạch học tập trong hệ thống.
- Giao diện đồ thị (react-flow) đã được tải và hiển thị kế hoạch học tập.

### Basic Flow

1. Người dùng mở kế hoạch học tập và hệ thống hiển thị đồ thị các khái niệm trên giao diện react-flow.
2. Người dùng thực hiện các thao tác chỉnh sửa: kéo thả node để sắp xếp, nhấn **"Thêm Node"** để thêm khái niệm mới, hoặc nhấn **"Xóa"** để xóa node/cạnh không cần thiết.
3. Hệ thống cập nhật đồ thị theo thời gian thực và tự động kiểm tra chu trình (cycle check) mỗi khi Người dùng thêm cạnh mới.
4. Người dùng xem xét toàn bộ đồ thị và nhấn **"Xác nhận"** để lưu thay đổi.
5. Hệ thống lưu cấu trúc đồ thị mới vào cơ sở dữ liệu và hiển thị thông báo: *"Đồ thị kế hoạch đã được cập nhật."*

### Alternative Flows

**Alternative Flow 1: Thêm cạnh tạo ra chu trình**

1. Từ bước 3 của Basic Flow, Người dùng kéo thả để tạo một cạnh mới nhưng cạnh này tạo ra chu trình trong đồ thị.
2. Hệ thống ngay lập tức từ chối thao tác và hiển thị thông báo cảnh báo: *"Không thể thêm mối quan hệ này vì sẽ tạo ra vòng lặp trong kế hoạch học tập."*
3. Cạnh bị hủy; Người dùng tiếp tục chỉnh sửa đồ thị theo cách khác.

**Alternative Flow 2: Xóa node có khái niệm đang được học hoặc đã học**

1. Từ bước 2 của Basic Flow, Người dùng cố gắng xóa một node đã có dữ liệu học tập (mastery score > 0).
2. Hệ thống hiển thị hộp thoại xác nhận: *"Khái niệm này đã có dữ liệu học tập. Bạn có chắc muốn xóa không? Thao tác này không thể hoàn tác."*
3. Người dùng xác nhận xóa; hệ thống xóa node và tất cả dữ liệu liên quan (cascade delete).

### Post-conditions

- Cấu trúc đồ thị kế hoạch học tập được cập nhật thành công.
- Đồ thị mới thỏa mãn tính chất DAG (không có chu trình).

---

## UC SP-03: Quản lý Danh sách Kế hoạch

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Quản lý Danh sách Kế hoạch |
| **Brief Description** | Use case này mô tả cách Người dùng (Student) xem, quản lý danh sách các kế hoạch học tập của mình bao gồm: xem tiến độ, xóa kế hoạch (cascade delete) và lưu trữ kế hoạch (soft archive). |
| **Actors** | Student |

### Pre-conditions

- Người dùng đã đăng nhập và có ít nhất một kế hoạch học tập đã tạo.
- Người dùng đang ở trang **"Danh sách Kế hoạch"**.

### Basic Flow

1. Người dùng truy cập trang Danh sách Kế hoạch từ menu điều hướng.
2. Hệ thống hiển thị danh sách tất cả các kế hoạch học tập của Người dùng, kèm theo phần trăm tiến độ hoàn thành (% tiến độ) và trạng thái từng kế hoạch.
3. Người dùng nhấn vào một kế hoạch để xem chi tiết; hệ thống chuyển hướng đến trang chi tiết kế hoạch đó.
4. Người dùng nhấn nút **"Xóa"** bên cạnh kế hoạch muốn xóa.
5. Hệ thống hiển thị hộp thoại xác nhận; Người dùng xác nhận xóa.
6. Hệ thống xóa kế hoạch cùng tất cả dữ liệu liên quan (cascade delete: đồ thị, lịch ôn tập, dữ liệu phiên học).
7. Hệ thống cập nhật lại danh sách và hiển thị thông báo: *"Kế hoạch đã được xóa thành công."*

### Alternative Flows

**Alternative Flow 1: Lưu trữ kế hoạch (Soft Archive)**

1. Từ bước 2 của Basic Flow, Người dùng nhấn nút **"Lưu trữ"** thay vì xóa.
2. Hệ thống đánh dấu kế hoạch là đã lưu trữ (archived) mà không xóa dữ liệu.
3. Kế hoạch bị ẩn khỏi danh sách chính nhưng vẫn có thể truy cập qua bộ lọc **"Đã lưu trữ"**.
4. Hệ thống hiển thị thông báo: *"Kế hoạch đã được lưu trữ. Bạn có thể khôi phục bất cứ lúc nào."*

**Alternative Flow 2: Danh sách rỗng (Không có kế hoạch nào)**

1. Từ bước 1 của Basic Flow, Người dùng chưa tạo kế hoạch nào.
2. Hệ thống hiển thị màn hình trống kèm theo gợi ý: *"Bạn chưa có kế hoạch học tập nào. Nhấn 'Tạo mới' để bắt đầu."*
3. Người dùng nhấn **"Tạo mới"** để chuyển sang SP-01: Tạo Kế hoạch Học tập.

### Post-conditions

- Danh sách kế hoạch được hiển thị chính xác với thông tin tiến độ mới nhất.
- Kế hoạch bị xóa hoặc lưu trữ theo đúng lựa chọn của Người dùng.

---

## UC SP-04: Cập nhật Đồ thị (Re-analyze)

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Cập nhật Đồ thị (Re-analyze) |
| **Brief Description** | Use case này mô tả cách Người dùng (Student) yêu cầu AI phân tích lại một kế hoạch học tập hiện có khi có tài liệu bổ sung hoặc muốn làm mới nội dung. |
| **Actors** | Student, AI Service (Google Gemini) |

### Pre-conditions

- Người dùng đã đăng nhập và đang xem chi tiết một kế hoạch học tập đã có.

### Basic Flow

1. Người dùng mở kế hoạch học tập và nhấn nút **"Phân tích lại"** (Re-analyze).
2. Người dùng có thể tải thêm tài liệu bổ sung hoặc giữ nguyên tài liệu cũ, sau đó xác nhận yêu cầu.
3. Hệ thống gửi yêu cầu phân tích lại (`re-analyze`) đến AI Service (Google Gemini) cùng với tài liệu hiện có.
4. AI Service xử lý và trả về đồ thị khái niệm cập nhật.
5. Hệ thống so sánh đồ thị mới với đồ thị cũ và hiển thị các thay đổi (diff) để Người dùng xem xét (include: review diff đồ thị).
6. Người dùng xem xét sự khác biệt, điều chỉnh nếu cần, rồi nhấn **"Xác nhận cập nhật"**.
7. Hệ thống lưu đồ thị mới và thông báo: *"Kế hoạch học tập đã được cập nhật thành công."*

### Alternative Flows

**Alternative Flow 1: Lỗi API khi phân tích lại**

1. Từ bước 3 của Basic Flow, AI Service trả về lỗi hoặc timeout.
2. Hệ thống chuyển yêu cầu vào hàng đợi bất đồng bộ (SP-05) và thông báo cho Người dùng: *"Hệ thống đang xử lý yêu cầu phân tích lại. Chúng tôi sẽ thông báo khi hoàn tất."*
3. Người dùng tiếp tục sử dụng ứng dụng bình thường trong khi hệ thống xử lý ngầm.

**Alternative Flow 2: Người dùng từ chối cập nhật sau khi xem diff**

1. Từ bước 6 của Basic Flow, Người dùng xem diff nhưng quyết định không áp dụng thay đổi.
2. Người dùng nhấn **"Hủy"**; hệ thống giữ nguyên đồ thị cũ và không lưu bất kỳ thay đổi nào.
3. Hệ thống thông báo: *"Cập nhật đã bị hủy. Kế hoạch hiện tại được giữ nguyên."*

### Post-conditions

- Đồ thị kế hoạch học tập được cập nhật với nội dung mới từ AI phân tích lại.
- Lịch ôn tập được điều chỉnh bởi Scheduling Engine theo đồ thị mới (nếu có thay đổi).

---

## UC SP-05: Xử lý Bất đồng bộ (Async Polling)

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Xử lý Bất đồng bộ (Async Polling) |
| **Brief Description** | Use case này mô tả cách hệ thống xử lý các tác vụ AI tốn thời gian (phân tích tài liệu, re-analyze) theo mô hình bất đồng bộ, cho phép Người dùng tiếp tục sử dụng ứng dụng trong khi tác vụ được xử lý ngầm. |
| **Actors** | Student, AI Service (Google Gemini), Scheduling & Remediation Engine |

### Pre-conditions

- Một tác vụ AI (tạo kế hoạch hoặc re-analyze) đã được khởi tạo và đưa vào hàng đợi bất đồng bộ.
- Người dùng đã đăng nhập và đang sử dụng ứng dụng.

### Basic Flow

1. Hệ thống nhận yêu cầu tác vụ AI và đưa vào hàng đợi xử lý, trả về ngay ID tác vụ cho client.
2. Hệ thống hiển thị trạng thái **"Đang xử lý..."** trên giao diện Người dùng kèm thanh tiến trình.
3. Client định kỳ gửi yêu cầu polling đến server để hỏi trạng thái tác vụ theo ID.
4. AI Service xử lý tác vụ ngầm và Scheduling Engine cập nhật trạng thái (`cập nhật trạng thái`).
5. Khi tác vụ hoàn tất, server trả về trạng thái **"Hoàn thành"** cùng kết quả; client nhận được và hiển thị thông báo: *"Kế hoạch học tập của bạn đã sẵn sàng!"*
6. Người dùng nhấn **"Xem ngay"** để chuyển đến kết quả.

### Alternative Flows

**Alternative Flow 1: Tác vụ thất bại sau nhiều lần thử**

1. Từ bước 4 của Basic Flow, AI Service báo lỗi sau khi hệ thống đã thử lại nhiều lần.
2. Hệ thống cập nhật trạng thái tác vụ thành **"Thất bại"** và gửi thông báo lỗi đến Người dùng: *"Không thể xử lý tài liệu của bạn. Vui lòng thử lại hoặc liên hệ hỗ trợ."*
3. Người dùng có thể chọn thử lại hoặc hủy tác vụ.

**Alternative Flow 2: Người dùng đăng xuất trong khi tác vụ đang chạy**

1. Người dùng đăng xuất trong khi tác vụ đang chạy ngầm.
2. Hệ thống tiếp tục xử lý tác vụ phía server; khi Người dùng đăng nhập lại, hệ thống thông báo về kết quả tác vụ đã hoàn thành.

### Post-conditions

- Tác vụ AI hoàn tất thành công và kết quả được hiển thị cho Người dùng.
- Trạng thái tác vụ được cập nhật chính xác trong cơ sở dữ liệu.

---

## UC SP-06: Quản lý Lịch Ôn tập

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Quản lý Lịch Ôn tập |
| **Brief Description** | Use case này mô tả cách Người dùng (Student) xem và tùy chỉnh lịch ôn tập được tự động tạo bởi hệ thống, bao gồm xem theo dạng danh sách hoặc lịch tháng, chỉnh sửa thủ công bằng kéo thả. |
| **Actors** | Student |

### Pre-conditions

- Người dùng đã đăng nhập và có ít nhất một kế hoạch học tập với lịch ôn tập đã được tạo.

### Basic Flow

1. Người dùng truy cập tính năng **"Lịch Ôn tập"** từ menu điều hướng.
2. Hệ thống hiển thị lịch ôn tập theo chế độ xem mặc định (List hoặc Calendar); Người dùng có thể chuyển đổi giữa hai chế độ.
3. Người dùng xem danh sách các buổi ôn tập được sắp xếp theo thứ tự ưu tiên (priority queue).
4. Người dùng kéo thả một buổi ôn tập sang ngày/giờ khác để chỉnh sửa thủ công.
5. Hệ thống cập nhật lịch ôn tập và đánh dấu buổi đó là "đã chỉnh sửa thủ công" (override flag = true).
6. Hệ thống hiển thị thông báo: *"Lịch ôn tập đã được cập nhật."*

### Alternative Flows

**Alternative Flow 1: Xung đột lịch (Conflict)**

1. Từ bước 4 của Basic Flow, Người dùng kéo một buổi ôn tập vào khung giờ đã có buổi ôn tập khác.
2. Hệ thống hiển thị cảnh báo: *"Khung giờ này đã có buổi ôn tập. Bạn có muốn thay thế không?"*
3. Người dùng xác nhận thay thế hoặc chọn khung giờ khác.

**Alternative Flow 2: Đặt lại lịch về mặc định**

1. Người dùng nhấn **"Đặt lại lịch"** để xóa tất cả chỉnh sửa thủ công.
2. Hệ thống hiển thị hộp thoại xác nhận; Người dùng xác nhận.
3. Hệ thống xóa tất cả override flag và tính toán lại lịch ôn tập tối ưu theo priority queue.

### Post-conditions

- Lịch ôn tập được cập nhật theo thay đổi của Người dùng.
- Các buổi chỉnh sửa thủ công được đánh dấu (override flag = true) để hệ thống biết không ghi đè khi tính toán lại.

---

## UC SP-07: Đặt lại Điểm Thành thạo (Mastery Score)

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Đặt lại Điểm Thành thạo (Mastery Score) |
| **Brief Description** | Use case này mô tả cách Người dùng (Student) đặt lại điểm thành thạo của một hoặc nhiều khái niệm về 0 để bắt đầu ôn tập lại từ đầu. |
| **Actors** | Student |

### Pre-conditions

- Người dùng đã đăng nhập và đang xem chi tiết kế hoạch học tập.
- Kế hoạch có ít nhất một khái niệm với điểm thành thạo > 0.

### Basic Flow

1. Người dùng chọn một khái niệm trong đồ thị hoặc danh sách và nhấn **"Đặt lại điểm"**.
2. Hệ thống hiển thị hộp thoại xác nhận: *"Bạn có chắc muốn đặt lại điểm thành thạo của '[Tên khái niệm]' về 0? Lịch ôn tập sẽ được tính toán lại."*
3. Người dùng xác nhận.
4. Hệ thống cập nhật điểm thành thạo của khái niệm về 0 trong cơ sở dữ liệu.
5. Scheduling & Remediation Engine tính toán lại priority queue và cập nhật lịch ôn tập.
6. Hệ thống hiển thị thông báo: *"Điểm thành thạo đã được đặt lại. Lịch ôn tập đã được cập nhật."*

### Alternative Flows

**Alternative Flow 1: Hủy thao tác đặt lại**

1. Từ bước 3 của Basic Flow, Người dùng nhấn **"Hủy"** trong hộp thoại xác nhận.
2. Hệ thống đóng hộp thoại và không thực hiện bất kỳ thay đổi nào.
3. Điểm thành thạo của khái niệm được giữ nguyên.

### Post-conditions

- Điểm thành thạo của khái niệm được đặt về 0.
- Lịch ôn tập được Scheduling Engine tính toán lại và ưu tiên lại khái niệm đó trong hàng đợi.

---

## UC SP-08: Import Kế hoạch JSON

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Import Kế hoạch JSON |
| **Brief Description** | Use case này mô tả cách Người dùng (Student) nhập (import) một kế hoạch học tập từ file JSON đã xuất trước đó hoặc từ nguồn bên ngoài vào hệ thống Recall AI. |
| **Actors** | Student |

### Pre-conditions

- Người dùng đã đăng nhập vào hệ thống.
- Người dùng có file JSON chứa cấu trúc kế hoạch học tập hợp lệ theo schema của Recall AI.

### Basic Flow

1. Người dùng truy cập trang Danh sách Kế hoạch và nhấn nút **"Import JSON"**.
2. Hệ thống hiển thị hộp thoại chọn file; Người dùng chọn file JSON cần import.
3. Hệ thống đọc và phân tích (parse) file JSON, kiểm tra cấu trúc theo schema quy định.
4. Hệ thống xác thực đồ thị trong file JSON (Validate DAG – cycle check).
5. Hệ thống hiển thị bản xem trước (preview) của kế hoạch sẽ được import; Người dùng xác nhận import.
6. Hệ thống lưu kế hoạch vào cơ sở dữ liệu và tạo lịch ôn tập ban đầu.
7. Hệ thống hiển thị thông báo: *"Kế hoạch đã được import thành công!"* và chuyển đến trang chi tiết kế hoạch mới.

### Alternative Flows

**Alternative Flow 1: File JSON sai định dạng hoặc không hợp lệ**

1. Từ bước 3 của Basic Flow, hệ thống không thể parse file JSON hoặc cấu trúc không khớp với schema.
2. Hệ thống hiển thị thông báo lỗi chi tiết: *"File JSON không hợp lệ. Lỗi tại: [vị trí lỗi]. Vui lòng kiểm tra lại cấu trúc file."*
3. Người dùng chọn lại file khác hoặc chỉnh sửa file JSON và thử lại.

**Alternative Flow 2: Đồ thị trong JSON có chu trình**

1. Từ bước 4 của Basic Flow, hệ thống phát hiện chu trình trong đồ thị của file JSON.
2. Hệ thống từ chối import và thông báo: *"Cấu trúc kế hoạch trong file có vòng lặp và không thể import. Vui lòng kiểm tra lại mối quan hệ giữa các khái niệm."*
3. Người dùng chỉnh sửa file JSON và thử import lại.

### Post-conditions

- Kế hoạch học tập từ file JSON được lưu thành công vào hệ thống.
- Lịch ôn tập ban đầu được tạo tự động dựa trên cấu trúc đồ thị trong file JSON.
