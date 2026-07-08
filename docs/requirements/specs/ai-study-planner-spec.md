# PRD: AI Study Planner

> **Dự án:** Recall AI - Nhóm CAGT

> **Sprint:** Sprint 2 (Elaboration - PA1/PA2)

> **Ngày soạn:** 08/07/2026

> **Trạng thái:** Draft - cần review trước khi Sprint 3 bắt đầu build

> **Người soạn:** PM

> **Tài liệu nguồn:** Project Proposal - Recall AI

---

## 1. Bối cảnh & Vấn đề

Sinh viên năm 1-2 khối kỹ thuật có tài liệu ôn tập (đề cương, slide, ghi chú) nhưng không có cách nào biến chúng thành một kế hoạch ôn tập ưu tiên theo deadline - việc này hiện phải làm thủ công, dễ bỏ sót khái niệm nền hoặc học dồn sát hạn (§2.2).

AI Study Planner là bước đầu tiên trong vòng lặp trải nghiệm sản phẩm - "Ingest & Map" và "Schedule" (§4). Đây không chỉ là một tính năng độc lập: nó là nguồn dữ liệu duy nhất (danh sách khái niệm, quan hệ tiên quyết) mà Concept Graph Engine và AI Examiner ở các sprint sau sẽ dùng lại. Nếu extraction ở đây sai định dạng hoặc chất lượng thấp, toàn bộ chuỗi tính năng phía sau - đặc biệt cơ chế truy ngược ở §5.4, vốn là trọng tâm kỹ thuật của cả dự án - sẽ bị ảnh hưởng dây chuyền. Vì vậy dù trông "đơn giản" hơn AI Examiner hay Concept Graph Engine, mức độ chính xác của spec này quan trọng ngang hàng.

## 2. Mục tiêu & Ngoài phạm vi

### Mục tiêu (Goals)

- **G1.** Biến tài liệu ôn tập thô thành danh sách khái niệm có cấu trúc, kèm quan hệ tiên quyết và độ khó ước lượng, ở định dạng JSON cố định mà hệ thống dùng trực tiếp - không cần diễn giải lại (§5.1).
- **G2.** Cho người dùng xác nhận/chỉnh sửa kết quả AI trước khi lưu - vì Concept Graph Engine ở sprint sau sẽ tin tưởng hoàn toàn dữ liệu này khi truy ngược (§5.4, §11).
- **G3.** Sắp xếp các khái niệm đã xác nhận thành các phiên ôn tập nhỏ, ưu tiên theo deadline và độ khó (§4).
- **G4.** Xử lý graceful khi AI trả sai định dạng, không để cả luồng tạo plan thất bại hoàn toàn (§5.1).

### Ngoài phạm vi (Non-goals)

- Chấm điểm/đánh giá mức hiểu bài - thuộc AI Examiner (§5.3), sẽ có spec riêng.
- Thuật toán truy ngược khái niệm nền (reverse BFS) chạy trong phiên Interview - thuộc Concept Graph Engine (§5.4). Study Planner chỉ **tạo ra** `concepts`/`concept_edges`, không **sử dụng** chúng để remediate.
- Trực quan hóa đồ thị hoàn chỉnh trên Dashboard - thuộc Sprint 5 (§7); ở đây chỉ cần view/edit đủ dùng lúc tạo plan.
- Gộp nhiều tài liệu vào cùng một plan - proposal không đề cập, giả định 1 tài liệu = 1 plan cho MVP (xem Open Question #7).

## 3. User Stories

- **US1.** Là sinh viên sắp thi, tôi muốn tải tài liệu ôn tập lên và nhận danh sách khái niệm cần học, để không phải tự tổng hợp thủ công.
- **US2.** Là sinh viên, tôi muốn xem và sửa lại khái niệm/quan hệ mà AI trích xuất trước khi bắt đầu học, để một suy đoán sai của AI không làm lệch cả kế hoạch ôn tập lẫn việc truy ngược khái niệm nền về sau.
- **US3.** Là sinh viên đang chạy deadline, tôi muốn kế hoạch được sắp xếp ưu tiên theo hạn nộp/thi, để biết nên học gì trước.
- **US4.** Là sinh viên có tài liệu không theo cấu trúc phân tầng rõ ràng, tôi vẫn muốn nhận được một kế hoạch dùng được, dù đồ thị tiên quyết thưa hoặc gần như rỗng.

## 4. Yêu cầu

### 4.1 Functional Requirements

**FR1 - Nhập tài liệu đầu vào**
Hệ thống chấp nhận input dạng text (dán trực tiếp) hoặc ảnh chụp tài liệu hoặc file PDF (§5.1). Người dùng nhập deadline cho kế hoạch tương ứng (§7, màn hình "Tạo kế hoạch ôn tập").

**FR2 - Trích xuất bằng AI**
Gọi Gemini API, yêu cầu output JSON schema cố định: danh sách khái niệm, quan hệ tiên quyết dạng `{concept_id, prerequisite_of: [concept_id, ...]}`, độ khó ước lượng (§5.1, §5.4, §8). Không dùng văn bản tự do cho phần logic hệ thống sử dụng.

**FR3 - Xử lý output lỗi định dạng**
Nếu AI trả sai schema: gọi lại; nếu vẫn lỗi, chia nhỏ tài liệu theo heading/đoạn văn và thử lại theo từng phần (§5.1).
**[Cần chốt]** Chưa có hành vi khi retry + chia nhỏ đều thất bại hết (xem Open Question #2).

**FR4 - Kiểm tra tính hợp lệ của đồ thị (DAG check)**
Trước khi lưu, kiểm tra tập quan hệ tiên quyết AI trả về có tạo đồ thị không chu trình hay không. Nếu phát hiện chu trình: yêu cầu AI sinh lại, hoặc loại cạnh gây chu trình và ghi log để xem xét (§5.4, §11).

**FR5 - Xác nhận & chỉnh sửa thủ công**
Người dùng xem danh sách khái niệm + quan hệ dưới dạng sơ đồ trực quan (react-flow, §8). Cho phép thêm/sửa/xóa khái niệm, sửa/xóa/thêm quan hệ tiên quyết, sắp xếp lại thứ tự thủ công (§5.1, §5.4).
**[Cần chốt]** Nếu user tự sửa tạo ra chu trình mới, FR4 cần chạy lại tại thời điểm edit - proposal chỉ mô tả DAG check cho output của AI, chưa nói rõ có áp dụng lại cho chỉnh sửa thủ công hay không (Open Question #3).

**FR6 - Sinh lịch ôn tập**
Sau khi user xác nhận danh sách khái niệm, dùng priority queue để chia khái niệm thành các phiên ôn tập nhỏ, ưu tiên theo deadline và độ khó ước lượng (§4, §8).
**[Cần chốt]** Công thức priority cụ thể (cách kết hợp deadline + độ khó thành một điểm số) chưa xuất hiện trong proposal. Sprint 2 có liệt kê "thiết kế thuật toán truy ngược trên giấy" (§10) nhưng không nói rõ có bao gồm thuật toán lập lịch hay không - nên xác nhận với Quân (Architect) để không bị sót khỏi phạm vi thiết kế đang làm song song.

**FR7 - Lưu trữ**
Lưu vào PostgreSQL qua Prisma: bảng `concepts (id, plan_id, name, mastery_score, last_tested_at)` và `concept_edges (from_concept_id, to_concept_id)` (§5.4, §8). `mastery_score` và `last_tested_at` khởi tạo null - thuộc quyền cập nhật của AI Examiner, không phải Study Planner.

**FR8 - Dự phòng khi đồ thị thưa**
Nếu tài liệu không tạo được quan hệ tiên quyết đáng kể, không ép buộc - chuyển sang xếp lịch theo cơ chế ôn tập ngắt quãng thông thường cho các khái niệm đó (§11).

### 4.2 Non-functional Requirements

- **NFR1 (Thời gian xử lý):** Toàn bộ luồng từ upload đến khi hiện draft để review hoàn tất "trong vòng vài phút" (§2.4). **[Cần chốt]** cần một con số đo được để viết test case (Open Question #5).
- **NFR2 (Chi phí & rate limit):** Cache kết quả, giới hạn số request mỗi người dùng mỗi ngày (§11).
- **NFR3 (Khả năng thay AI provider):** Gọi Gemini qua một lớp abstraction (AI service layer), không gọi trực tiếp rải rác trong code (§11).
- **NFR4 (Tách AI khỏi logic tất định):** AI chỉ chịu trách nhiệm bước trích xuất. DAG validation và sinh lịch ưu tiên là logic phần mềm thuần, kiểm thử được độc lập, không cần gọi AI thật - nhất quán với cách tách vai trò AI/deterministic logic đã áp dụng cho AI Examiner (§5.3).

## 5. Luồng UX

Gắn với màn hình **"Tạo kế hoạch ôn tập"** (§7, màn hình #4, Sprint 3):

```
Nhập tài liệu + deadline
        │
        ▼
Gọi AI trích xuất (loading state)
        │
        ▼
   Output đúng schema? ──Không──▶ Retry / chia nhỏ tài liệu ──vẫn lỗi──▶ [Open Question #2]
        │ Có
        ▼
   Đồ thị hợp lệ (DAG)? ──Không──▶ Loại cạnh gây chu trình / yêu cầu AI sinh lại
        │ Có
        ▼
Hiển thị đồ thị + danh sách khái niệm để user xem/sửa
        │
        ▼
   User chỉnh sửa? ──Có──▶ Chạy lại DAG check trên dữ liệu đã sửa
        │ Không / đã sửa xong
        ▼
User xác nhận ──▶ Sinh lịch ôn tập (priority queue theo deadline + độ khó)
        │
        ▼
Lưu concepts + concept_edges + schedule
        │
        ▼
Điều hướng vào Dashboard / plan vừa tạo
```

## 6. Edge Cases

| #   | Tình huống                                                             | Nguồn                  | Xử lý đề xuất                                                                  |
| --- | ---------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------ |
| 1   | AI trả sai schema nhiều lần liên tiếp, kể cả sau khi chia nhỏ tài liệu | Suy ra từ §5.1         | Hiển thị lỗi rõ ràng, cho phép nhập khái niệm thủ công thay vì treo màn hình   |
| 2   | Tài liệu vượt giới hạn context của Gemini                              | Chưa có trong proposal | Dùng lại cơ chế chia nhỏ theo heading/đoạn đã có sẵn cho case lỗi định dạng    |
| 3   | Ảnh chụp mờ, không đọc được chữ                                        | §11                    | Nên kiểm tra sơ bộ trước khi gọi AI, thay vì để lộ ra sai ở bước review        |
| 4   | Tài liệu trống hoặc không phải nội dung học thuật                      | Chưa có trong proposal | Cần định nghĩa hành vi (Open Question #6)                                      |
| 5   | User tự sửa đồ thị tạo ra chu trình mới                                | Chưa có trong proposal | DAG check (FR4) phải chạy lại tại thời điểm edit                               |
| 6   | Không nhập deadline                                                    | Chưa có trong proposal | Cần xác nhận bắt buộc/optional (Open Question #4)                              |
| 7   | Đồ thị thưa/rỗng vì tài liệu không phân tầng                           | §11                    | Fallback ôn tập ngắt quãng thông thường (đã có - FR8)                          |
| 8   | User chạm rate-limit cá nhân giữa lúc tạo plan                         | Suy ra từ §11          | Thông báo rõ số lượt còn lại, không mất dữ liệu đã nhập nếu bị chặn giữa chừng |

## 7. Success Metrics

Proposal chưa định nghĩa metric riêng cho feature này - đề xuất dưới đây cần review trước khi chốt:

- **Tỉ lệ trích xuất hợp lệ lần đầu:** % lần gọi AI mà output pass DAG check + đúng schema ngay lần đầu, không cần retry.
- **Tỉ lệ chỉnh sửa sau extraction:** % khái niệm/quan hệ bị user sửa hoặc xóa sau khi AI trả về - càng thấp, extraction càng đáng tin, đồng thời là dữ liệu để tinh chỉnh prompt về sau.
- **Thời gian tạo plan:** từ lúc submit đến lúc thấy draft để review - mục tiêu §2.4 là "vài phút", cần một con số cụ thể (Open Question #5).
- **Tỉ lệ hoàn tất luồng:** % lượt bắt đầu upload thực sự kết thúc bằng một plan được lưu, không bỏ giữa chừng vì lỗi hoặc UX rối.

## 8. Open Questions

1. Fallback khi AI liên tục trả sai định dạng sau khi đã retry + chia nhỏ tài liệu.
2. DAG check có chạy lại khi user tự chỉnh sửa đồ thị hay chỉ chạy một lần lúc AI trả về?
3. Deadline bắt buộc hay optional? Nếu optional, priority queue (FR6) ưu tiên thế nào khi thiếu?
4. Ngưỡng thời gian cụ thể cho "vài phút" (§2.4) - cần số đo được để viết test case.
5. Giới hạn độ dài/kích thước tài liệu đầu vào (số từ, số trang, dung lượng ảnh) - chưa định nghĩa.
6. Một plan có nhận nhiều tài liệu nguồn không, hay bắt buộc 1 tài liệu = 1 plan?
7. "Phiên ôn tập nhỏ" (output của Schedule, §4) có phải cùng khái niệm "session" với Focus Session (§5.2) không? Cần xác nhận trước khi hai bên code interface khác nhau.

## 9. Dependencies

- **Concept Graph Engine (§5.4):** nhận `concepts` + `concept_edges` do Study Planner tạo làm input; sở hữu thuật toán truy ngược, chạy trong phiên Interview - ngoài phạm vi spec này.
- **AI Examiner (§5.3):** cập nhật `mastery_score`/`last_tested_at` cho các concept do Study Planner khởi tạo.
- **Focus Session (§5.2):** tiêu thụ "phiên ôn tập nhỏ" do bước Schedule sinh ra (Open Question #8).
- **Thiết kế kiến trúc / database:** schema `concepts`/`concept_edges` và thuật toán priority queue chi tiết thuộc tài liệu thiết kế kiến trúc soạn song song trong Sprint 2 (§10) - spec này mô tả hành vi, không thay thế tài liệu thiết kế đó.
