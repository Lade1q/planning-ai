# Test Cases — Study Plan (AI Planner & Concept Graph)

> **Module:** Study Plan  
> **Use Cases:** UC-02 — Create Study Plan · UC-03 — Edit Concept Graph  
> **Phiên bản:** 1.0

---

## Test Suite 1: Tạo Study Plan bằng AI (UC-02)

> Kiểm thử luồng tạo lộ trình học tập tự động qua Gemini API, bao gồm các trường hợp thành công, lỗi AI, và lỗi format.

### TC-PLAN-001: Tạo Study Plan thành công bằng văn bản

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-PLAN-001 |
| **Tiêu đề** | Tạo Study Plan thành công khi nhập văn bản outline hợp lệ |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | User đã đăng nhập. Gemini API đang hoạt động và có quota. |
| **Các bước thực hiện** | 1. Chọn "Create New Study Plan".<br>2. Nhập tên môn học và deadline.<br>3. Paste văn bản outline vào text area.<br>4. Nhấn "Generate Plan". |
| **Dữ liệu đầu vào** | \- Tên môn: `Lập trình Web`<br>\- Deadline: `2026-08-01`<br>\- Nội dung: *(outline 200+ từ về HTML, CSS, JavaScript)* |
| **Kết quả mong đợi** | \- Gemini API được gọi và trả về JSON hợp lệ.<br>\- Concept Graph hiển thị dạng node-link với các khái niệm được trích xuất.<br>\- Danh sách tasks xuất hiện theo thứ tự ưu tiên deadline + độ khó.<br>\- Study Plan được lưu vào database. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Kiểm tra database: bảng `concepts` và `concept_edges` có records mới. |

---

### TC-PLAN-002: Tạo Study Plan thành công bằng upload ảnh

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-PLAN-002 |
| **Tiêu đề** | Tạo Study Plan thành công khi upload ảnh chụp tài liệu rõ nét |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | User đã đăng nhập. Gemini API có quota. Có file ảnh tài liệu rõ nét. |
| **Các bước thực hiện** | 1. Chọn "Create New Study Plan", nhập tên môn và deadline.<br>2. Chọn hình thức upload ảnh.<br>3. Upload file ảnh chụp tài liệu.<br>4. Nhấn "Generate Plan". |
| **Dữ liệu đầu vào** | \- Deadline: `2026-08-15`<br>\- File: ảnh JPG chụp giáo trình rõ nét |
| **Kết quả mong đợi** | \- AI xử lý ảnh và trích xuất được các khái niệm.<br>\- Concept Graph hiển thị đúng.<br>\- Plan được lưu vào database. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | — |

---

### TC-PLAN-003: AI trả về JSON sai format — Hệ thống tự động retry

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-PLAN-003 |
| **Tiêu đề** | Hệ thống tự động retry khi Gemini API trả về JSON sai format |
| **Loại kiểm thử** | Interface |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | User đã đăng nhập. Môi trường giả lập AI trả về JSON sai định dạng. |
| **Các bước thực hiện** | 1. Tạo Study Plan với dữ liệu hợp lệ.<br>2. Gemini API mock trả về JSON không đúng schema.<br>3. Quan sát hành vi hệ thống. |
| **Dữ liệu đầu vào** | \- Tài liệu hợp lệ<br>\- Gemini mock response: JSON sai schema |
| **Kết quả mong đợi** | \- Hệ thống retry tối đa 2 lần.<br>\- Nếu retry thành công: hiển thị Concept Graph bình thường.<br>\- Nếu vẫn sai sau 2 lần: tự động split tài liệu và retry từng phần. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Cần phối hợp với Dev để giả lập mock response. |

---

### TC-PLAN-004: AI phát hiện chu trình trong đồ thị — DAG check

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-PLAN-004 |
| **Tiêu đề** | Hệ thống loại bỏ edge gây chu trình và cảnh báo người dùng khi AI tạo đồ thị có vòng lặp |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | Môi trường giả lập AI trả về JSON có edge gây chu trình (A→B→C→A). |
| **Các bước thực hiện** | 1. Tạo Study Plan với tài liệu.<br>2. Mock AI response có chu trình trong edges.<br>3. Quan sát hành vi hệ thống. |
| **Dữ liệu đầu vào** | \- Mock AI response có chu trình: edges [A→B, B→C, C→A] |
| **Kết quả mong đợi** | \- System loại bỏ edge gây chu trình.<br>\- Cảnh báo hiển thị: *"Hệ thống đã loại bỏ 1 quan hệ tiên quyết có thể tạo vòng lặp. Vui lòng kiểm tra lại trong bước chỉnh sửa."*<br>\- Concept Graph hiển thị với các edges hợp lệ còn lại. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | — |

---

### TC-PLAN-005: Tài liệu quá ngắn — AI không trích xuất được khái niệm

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-PLAN-005 |
| **Tiêu đề** | Hệ thống thông báo yêu cầu bổ sung nội dung khi tài liệu quá ngắn hoặc không liên quan |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | Medium |
| **Điều kiện tiên quyết** | User đã đăng nhập. Gemini API hoạt động. |
| **Các bước thực hiện** | 1. Tạo Study Plan.<br>2. Nhập nội dung quá ngắn hoặc không liên quan học thuật.<br>3. Nhấn "Generate Plan". |
| **Dữ liệu đầu vào** | \- Nội dung: `"abc"` hoặc `"xin chào"` |
| **Kết quả mong đợi** | \- AI không trích xuất được khái niệm nào.<br>\- Hệ thống hiển thị thông báo yêu cầu bổ sung nội dung.<br>\- Không tạo Plan trong database. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | — |

---

### TC-PLAN-006: Gemini API timeout — Hiển thị lỗi và cho phép retry

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-PLAN-006 |
| **Tiêu đề** | Hệ thống hiển thị thông báo lỗi và cho phép thử lại khi Gemini API timeout |
| **Loại kiểm thử** | Interface |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | Môi trường giả lập Gemini API timeout. User đã đăng nhập. |
| **Các bước thực hiện** | 1. Tạo Study Plan với dữ liệu hợp lệ.<br>2. Gemini API bị timeout (giả lập).<br>3. Quan sát hành vi hệ thống. |
| **Dữ liệu đầu vào** | \- Tài liệu hợp lệ<br>\- Gemini API mock: timeout |
| **Kết quả mong đợi** | \- Hệ thống hiển thị thông báo lỗi rõ ràng về việc AI không phản hồi.<br>\- Có nút "Thử lại" để người dùng gửi lại request.<br>\- Không tạo Plan dang dở trong database. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | — |

---

## Test Suite 2: Chỉnh sửa Concept Graph (UC-03)

> Kiểm thử các thao tác chỉnh sửa thủ công đồ thị kiến thức: thêm/xóa node, thêm/xóa edge, kiểm soát chu trình, và reset về bản gốc.

### TC-PLAN-007: Chỉnh sửa Graph — Thêm node mới

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-PLAN-007 |
| **Tiêu đề** | Người dùng thêm concept node mới vào Concept Graph thành công |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | UC-02 đã hoàn thành. Concept Graph đang hiển thị. |
| **Các bước thực hiện** | 1. Nhấn nút "Add Node".<br>2. Nhập tên concept mới.<br>3. Xác nhận. |
| **Dữ liệu đầu vào** | \- Tên node mới: `"Async/Await"` |
| **Kết quả mong đợi** | \- Node mới xuất hiện trên Concept Graph.<br>\- Thay đổi được auto-save vào database ngay lập tức.<br>\- Graph vẫn là DAG hợp lệ. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Kiểm tra database xác nhận node mới đã được lưu. |

---

### TC-PLAN-008: Chỉnh sửa Graph — Xóa node (và các edges liên quan)

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-PLAN-008 |
| **Tiêu đề** | Người dùng xóa concept node và các edges liên quan được xóa theo |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | Concept Graph đang hiển thị. Có ít nhất 2 nodes và 1 edge kết nối. |
| **Các bước thực hiện** | 1. Chọn một node trên Graph.<br>2. Nhấn "Delete". |
| **Dữ liệu đầu vào** | \- Node có ít nhất 1 edge kết nối với node khác |
| **Kết quả mong đợi** | \- Node bị xóa khỏi Graph.<br>\- Tất cả edges kết nối với node đó cũng bị xóa đồng thời.<br>\- Thay đổi được auto-save. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | — |

---

### TC-PLAN-009: Chỉnh sửa Graph — Thêm edge hợp lệ (không tạo chu trình)

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-PLAN-009 |
| **Tiêu đề** | Người dùng thêm quan hệ tiên quyết (edge) giữa hai node hợp lệ |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | Concept Graph đang hiển thị. Có ít nhất 2 nodes chưa có chu trình tiềm năng. |
| **Các bước thực hiện** | 1. Kéo từ node A sang node B để tạo edge (A là prerequisite của B).<br>2. Thả chuột để xác nhận. |
| **Dữ liệu đầu vào** | \- Node A: `"HTML cơ bản"` → Node B: `"CSS nâng cao"` (không tạo chu trình) |
| **Kết quả mong đợi** | \- Edge mới được thêm vào Graph.<br>\- DAG check pass — không có chu trình.<br>\- Auto-save thành công. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | — |

---

### TC-PLAN-010: Chỉnh sửa Graph — Thêm edge gây chu trình bị từ chối

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-PLAN-010 |
| **Tiêu đề** | Hệ thống từ chối lưu edge khi hành động tạo chu trình trong đồ thị |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | Concept Graph đang có: A→B→C. |
| **Các bước thực hiện** | 1. Kéo từ node C sang node A để tạo edge gây chu trình C→A. |
| **Dữ liệu đầu vào** | \- Graph hiện tại: A→B→C. Thao tác: tạo edge C→A. |
| **Kết quả mong đợi** | \- Hệ thống hiển thị tooltip đỏ: *"Không thể thêm: quan hệ này tạo chu trình trong đồ thị."*<br>\- Edge KHÔNG được lưu.<br>\- Graph giữ nguyên trạng thái trước đó. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | — |

---

### TC-PLAN-011: Graph rỗng — Nút Confirm bị disable

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-PLAN-011 |
| **Tiêu đề** | Nút "Confirm & Start Studying" bị disable khi không còn concept nào trong Graph |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | Medium |
| **Điều kiện tiên quyết** | Concept Graph đang hiển thị và còn ít nhất 1 node. |
| **Các bước thực hiện** | 1. Xóa tất cả nodes khỏi Concept Graph.<br>2. Quan sát trạng thái nút "Confirm". |
| **Dữ liệu đầu vào** | *(không có — thao tác xóa)* |
| **Kết quả mong đợi** | \- Nút "Confirm & Start Studying" bị disable (không thể click).<br>\- Hệ thống hiển thị thông báo: *"Cần có ít nhất 1 khái niệm để bắt đầu học."* |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | — |

---

### TC-PLAN-012: Reset Graph về bản gốc AI

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-PLAN-012 |
| **Tiêu đề** | Nút "Reset to AI Suggestion" khôi phục lại toàn bộ Graph về trạng thái AI tạo ra ban đầu |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | Medium |
| **Điều kiện tiên quyết** | Người dùng đã chỉnh sửa Graph (thêm/xóa node hoặc edge). |
| **Các bước thực hiện** | 1. Thực hiện một số thay đổi trên Graph.<br>2. Nhấn "Reset to AI Suggestion".<br>3. Xác nhận hành động (nếu có dialog xác nhận). |
| **Dữ liệu đầu vào** | *(không có)* |
| **Kết quả mong đợi** | \- Graph khôi phục về trạng thái ban đầu AI tạo ra (từ UC-02).<br>\- Tất cả chỉnh sửa thủ công bị hủy bỏ.<br>\- Database được cập nhật về bản gốc. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Cần xác nhận với PM/Dev: có dialog xác nhận trước khi reset không? |

---

## Bảng tóm tắt — Study Plan

| Mã TC | Test Suite | Tiêu đề | Loại | Độ ưu tiên | Trạng thái |
|-------|------------|---------|------|------------|------------|
| TC-PLAN-001 | Suite 1: Tạo Plan | Tạo Study Plan thành công bằng văn bản | Functionality | High | Not Run |
| TC-PLAN-002 | Suite 1: Tạo Plan | Tạo Study Plan thành công bằng upload ảnh | Functionality | High | Not Run |
| TC-PLAN-003 | Suite 1: Tạo Plan | AI trả về JSON sai format — tự động retry | Interface | High | Not Run |
| TC-PLAN-004 | Suite 1: Tạo Plan | AI tạo chu trình — hệ thống loại bỏ và cảnh báo | Functionality | High | Not Run |
| TC-PLAN-005 | Suite 1: Tạo Plan | Tài liệu quá ngắn — yêu cầu bổ sung | Functionality | Medium | Not Run |
| TC-PLAN-006 | Suite 1: Tạo Plan | Gemini API timeout — hiển thị lỗi và cho phép retry | Interface | High | Not Run |
| TC-PLAN-007 | Suite 2: Chỉnh sửa Graph | Thêm node mới vào Graph | Functionality | High | Not Run |
| TC-PLAN-008 | Suite 2: Chỉnh sửa Graph | Xóa node (và edges liên quan) | Functionality | High | Not Run |
| TC-PLAN-009 | Suite 2: Chỉnh sửa Graph | Thêm edge hợp lệ | Functionality | High | Not Run |
| TC-PLAN-010 | Suite 2: Chỉnh sửa Graph | Thêm edge gây chu trình bị từ chối | Functionality | High | Not Run |
| TC-PLAN-011 | Suite 2: Chỉnh sửa Graph | Graph rỗng — nút Confirm bị disable | Functionality | Medium | Not Run |
| TC-PLAN-012 | Suite 2: Chỉnh sửa Graph | Reset Graph về bản gốc AI | Functionality | Medium | Not Run |

---

## Chú thích trạng thái

| Trạng thái | Ý nghĩa |
|-----------|---------|
| Not Run | Chưa thực hiện test |
| Pass | Test qua — kết quả thực tế khớp với kết quả mong đợi |
| Fail | Test không qua — có bug → tạo bug report |
| Blocked | Không thể test — phụ thuộc vào phần khác chưa hoàn thành |

---

## Chú thích loại kiểm thử

| Loại kiểm thử | Kiểm tra điều gì | Ví dụ trong dự án |
|--------------|-----------------|------------------|
| **Functionality** | Tính năng có hoạt động đúng như mô tả không? | Đăng nhập thành công với email/mật khẩu hợp lệ |
| **Security** | Dữ liệu người dùng có được bảo vệ không? | Người dùng A không truy cập được data của người dùng B |
| **Usability** | Người dùng có dễ sử dụng, dễ hiểu không? | Thông báo lỗi có rõ ràng không? |
| **Interface** | Các thành phần hệ thống có giao tiếp đúng không? | Frontend gửi dữ liệu → Backend nhận và xử lý đúng |
| **Database** | Dữ liệu có được lưu/đọc/xóa đúng không? | Sau khi tạo plan, database có record đúng không? |
| **Compatibility** | App có chạy đúng trên các trình duyệt khác nhau không? | Tính năng upload ảnh có hoạt động trên Firefox không? |
| **Performance** | App có chạy nhanh, không bị lag không? | Trang Dashboard load dưới 2 giây? |

---
