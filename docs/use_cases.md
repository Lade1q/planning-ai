# Recall AI — Use Case Specification

> **Phiên bản:** 2.0 | **Cập nhật:** 08/07/2026
> **Cơ sở:** PA2 requirements (RUP template), user-stories.md v1.0, PA0-Group07 Project Proposal
> Format: Name · Actors · Preconditions · Basic Flow · Alternative Flows · Postconditions

---

## Use Case Diagram (Overview)

```
                        ┌─────────────────────────────────────────┐
                        │            RECALL AI SYSTEM             │
                        │                                         │
          ┌──────────┐  │  ┌─────────┐    ┌──────────────────┐  │
          │          │──┼─►│ UC-01   │    │  UC-02           │  │
          │          │  │  │ Register│    │  Create Study    │  │
          │          │  │  │ / Login │    │  Plan            │  │
          │          │  │  └─────────┘    └────────┬─────────┘  │
          │ Student  │  │                           │«extends»   │
          │          │  │                  ┌────────▼─────────┐  │
          │(Primary  │  │                  │  UC-03           │  │
          │ Actor)   │  │                  │  Edit Concept    │  │
          │          │  │                  │  Graph           │  │
          │          │  │  ┌───────────────┴──────────────────┘  │
          │          │  │  │                                      │
          │          │──┼─►│ UC-04 Start Focus Session           │  ◄── AI System
          │          │  │  │   «includes» UC-05 AI Examiner      │  ◄── (Gemini)
          │          │  │  │       «includes» UC-06 Trace-back   │
          │          │  │  └──────────────────────────────────────┤
          │          │  │                                         │
          │          │──┼─►│ UC-07 View Dashboard                │
          │          │  │                                         │
          └──────────┘  │  UC-08 Proactive Reminder ◄── System  │
                        │         (Agentic, auto-triggered)       │
                        └─────────────────────────────────────────┘
```

| UC ID | Tên Use Case | User Stories | Mức ưu tiên |
|---|---|---|---|
| UC-01 | Register / Login Account | US-AUTH-01, US-AUTH-02, US-AUTH-03 | Cao |
| UC-02 | Create Study Plan | US-PLAN-01, US-PLAN-05 | Cao |
| UC-03 | Edit Concept Graph | US-PLAN-02, US-PLAN-03 | Cao |
| UC-04 | Start Focus Session | US-FOCUS-01, US-FOCUS-02, US-FOCUS-03, US-FOCUS-04 | Trung bình |
| UC-05 | Conduct AI Examiner Interview | US-VERIFY-01, US-VERIFY-02, US-VERIFY-03 | Cao |
| UC-06 | Trigger Trace-back Remediation | US-VERIFY-05 | Cao |
| UC-07 | View Dashboard & Progress | US-DASH-01, US-DASH-02, US-DASH-03, US-DASH-04 | Cao |
| UC-08 | Receive Proactive Review Reminder | US-PLAN-05 (deadline context) | Trung bình |

---

## UC-01: Register / Login Account

| Field | Detail |
|---|---|
| **Use Case ID** | UC-01 |
| **Use Case Name** | Register / Login Account |
| **Actor(s)** | Student (primary) |
| **User Stories** | US-AUTH-01, US-AUTH-02, US-AUTH-03, US-AUTH-04 |

**Preconditions:**
- Student chưa đăng nhập vào hệ thống.
- Hệ thống đang hoạt động và kết nối database thành công.

**Postconditions:**
- Student được xác thực, có JWT access token hợp lệ.
- Student được chuyển hướng đến Dashboard cá nhân.

**Basic Flow (Register):**
1. Student truy cập trang chủ, nhấn "Sign Up".
2. Student nhập email, mật khẩu và xác nhận mật khẩu.
3. System kiểm tra: email hợp lệ, mật khẩu ≥ 8 ký tự, email chưa tồn tại trong database.
4. System hash mật khẩu (bcrypt) và lưu tài khoản mới.
5. System tạo JWT access token + refresh token.
6. System tự động đăng nhập và chuyển hướng đến Dashboard (trống).

**Basic Flow (Login):**
1. Student nhấn "Sign In", nhập email và mật khẩu đã đăng ký.
2. System xác thực credentials so với database.
3. System tạo JWT token mới và trả về cho client.
4. System chuyển hướng đến Dashboard.

**Alternative Flows:**
- **A1 – Email đã tồn tại (Register):** System hiển thị lỗi "Email đã được đăng ký. Vui lòng đăng nhập."
- **A2 – Mật khẩu không khớp (Register):** System hiển thị lỗi "Xác nhận mật khẩu không khớp."
- **A3 – Sai mật khẩu (Login):** System hiển thị "Email hoặc mật khẩu không đúng." Không tiết lộ field nào sai.
- **A4 – JWT hết hạn (trong session):** System tự động gọi refresh token endpoint; nếu refresh token cũng hết hạn, redirect về trang Login.

---

## UC-02: Create Study Plan (AI Study Planner)

| Field | Detail |
|---|---|
| **Use Case ID** | UC-02 |
| **Use Case Name** | Create Study Plan |
| **Actor(s)** | Student (primary), AI System / Gemini API (secondary) |
| **User Stories** | US-PLAN-01, US-PLAN-05 |

**Preconditions:**
- Student đã đăng nhập (UC-01 đã hoàn thành).
- Gemini API đang hoạt động và có quota.

**Postconditions:**
- Study Plan mới được lưu vào database với danh sách `concepts` và `concept_edges`.
- Deadline của Plan được ghi nhận để tính urgency cho UC-08.
- Concept Graph được hiển thị, sẵn sàng cho UC-03 (chỉnh sửa).

**Basic Flow:**
1. Student chọn "Create New Study Plan", nhập tên môn học và deadline.
2. Student upload tài liệu theo một trong hai hình thức:
   - Paste văn bản (outline/notes) trực tiếp vào text area.
   - Upload file ảnh chụp tài liệu.
3. Student nhấn "Generate Plan".
4. System gửi tài liệu đến Gemini API với structured prompt, yêu cầu trả về JSON schema cố định:
   ```json
   { "concepts": [{"id", "name", "difficulty"}],
     "edges": [{"from_id", "to_id"}] }
   ```
5. AI System trả về JSON response.
6. System validate JSON: kiểm tra cấu trúc hợp lệ và đồ thị không có chu trình (DAG check).
7. System lưu vào bảng `concepts` và `concept_edges` trong PostgreSQL.
8. System hiển thị Concept Graph dạng node-link (dùng react-flow) và danh sách tasks theo thứ tự ưu tiên deadline + độ khó.
9. Student xem xét kết quả. Use case kết thúc; Student có thể chuyển sang UC-03.

**Alternative Flows:**
- **A1 – AI trả về sai format JSON:** System retry tối đa 2 lần. Nếu vẫn sai, tự động split tài liệu theo heading/paragraph và retry từng đoạn.
- **A2 – DAG check phát hiện chu trình:** System loại bỏ edge gây chu trình, log lại, hiển thị cảnh báo: *"Hệ thống đã loại bỏ 1 quan hệ tiên quyết có thể tạo vòng lặp. Vui lòng kiểm tra lại trong bước chỉnh sửa."*
- **A3 – Tài liệu quá ngắn/không rõ nội dung:** AI không thể trích xuất được khái niệm nào, System trả về thông báo yêu cầu bổ sung nội dung.
- **A4 – Gemini API không phản hồi (timeout):** System hiển thị thông báo lỗi và cho phép Student thử lại.

---

## UC-03: Edit Concept Graph

| Field | Detail |
|---|---|
| **Use Case ID** | UC-03 |
| **Use Case Name** | Edit Concept Graph |
| **Actor(s)** | Student (primary) |
| **User Stories** | US-PLAN-02, US-PLAN-03 |
| **Relationship** | `<<extends>>` UC-02 — Student có thể bỏ qua bước này |

**Preconditions:**
- UC-02 đã hoàn thành; Concept Graph đang được hiển thị.

**Postconditions:**
- Concept Graph trong database phản ánh đúng đánh giá của Student về cấu trúc kiến thức.
- Human-in-the-loop step hoàn tất — đây là bước bắt buộc theo PA0 Section 5.4 trước khi bắt đầu học.

**Basic Flow:**
1. Student xem Concept Graph vừa được AI tạo ra.
2. Student thực hiện một hoặc nhiều thao tác chỉnh sửa:
   - Kéo thả node để sắp xếp lại layout trực quan.
   - Thêm concept mới: nhấn "Add Node", nhập tên.
   - Đổi tên concept: double-click vào node.
   - Xóa concept: chọn node, nhấn "Delete" (đồng thời xóa các edges liên quan).
   - Thêm quan hệ tiên quyết (edge): kéo từ node A sang node B (A là prerequisite của B).
   - Xóa quan hệ: chọn edge, nhấn "Delete".
3. Sau mỗi thao tác thêm edge, System kiểm tra DAG. Nếu tạo chu trình, hiển thị cảnh báo và không lưu edge đó.
4. Thay đổi được lưu tự động (auto-save) sau mỗi hành động.
5. Student nhấn "Confirm & Start Studying" để xác nhận Graph và chuyển sang học.

**Alternative Flows:**
- **A1 – Tạo edge gây chu trình:** System hiển thị tooltip đỏ "Không thể thêm: quan hệ này tạo chu trình trong đồ thị." Edge không được lưu.
- **A2 – Graph rỗng (xóa hết concepts):** Nút "Confirm" bị disable; System hiển thị "Cần có ít nhất 1 khái niệm để bắt đầu học."
- **A3 – Student muốn khôi phục bản gốc:** Nút "Reset to AI Suggestion" khôi phục lại graph ban đầu từ UC-02, xóa toàn bộ chỉnh sửa thủ công.

---

## UC-04: Start Focus Session

| Field | Detail |
|---|---|
| **Use Case ID** | UC-04 |
| **Use Case Name** | Start Focus Session |
| **Actor(s)** | Student (primary) |
| **User Stories** | US-FOCUS-01, US-FOCUS-02, US-FOCUS-03, US-FOCUS-04 |

**Preconditions:**
- Student đã đăng nhập và có ít nhất 1 Study Plan đã được xác nhận (UC-03 hoàn thành).

**Postconditions:**
- Session record được lưu: `{start_time, end_time, duration_actual, concept_id, interruption_events[], status}`.
- Nếu session hoàn thành: Student được chuyển sang UC-05 (AI Examiner).
- Nếu session bị gián đoạn: dữ liệu `interruption_events` được truyền sang UC-05 để AI ưu tiên kiểm tra phần nội dung có thể bị bỏ lỡ.

**Basic Flow:**
1. Student vào Dashboard, chọn Study Plan, nhấn "Start Session".
2. System hiển thị concept cần học tiếp theo (ưu tiên: deadline gần + mastery_score thấp + thứ tự trong đồ thị).
3. Student tùy chọn liên kết session với task cụ thể từ kế hoạch (US-FOCUS-04).
4. Student chọn thời lượng phiên: Pomodoro mặc định (25 phút học / 5 phút nghỉ) hoặc tùy chỉnh.
5. Student nhấn "Start Timer". Đồng hồ đếm ngược bắt đầu.
6. **[Tự động - nền]** System lắng nghe sự kiện `visibilitychange` (tab mất focus) và sự kiện Pause của người dùng để phát hiện gián đoạn.
7. Khi hết giờ hoặc Student nhấn "Done", System lưu session record hoàn chỉnh.
8. System hiển thị màn hình tóm tắt phiên (US-FOCUS-03): tổng thời gian học, số lần gián đoạn phát hiện được, ước lượng phần nội dung có thể bị bỏ lỡ.
9. System hỏi: "Bạn đã sẵn sàng kiểm chứng kiến thức chưa?" — Student nhấn "Start Interview" (chuyển sang UC-05).

**Alternative Flows:**
- **A1 – Student nhấn Pause:** Timer dừng. System ghi nhận sự kiện gián đoạn: `{timestamp, type: "manual_pause"}`. Student nhấn "Resume" để tiếp tục.
- **A2 – Tab mất focus / Student chuyển sang tab khác:** System phát hiện qua `visibilitychange` event. Ghi nhận: `{timestamp, type: "tab_switch"}`. Khi Student quay lại, hiển thị thông báo nhẹ: *"Bạn vừa rời khỏi trang trong [X] giây."*
- **A3 – Student nhấn "Skip" bỏ dở session:** Session được lưu là `status: incomplete`. Concept vẫn nằm trong queue học; dữ liệu gián đoạn được truyền sang Verify với flag `session_incomplete: true`.
- **A4 – Student chọn "Study Later":** Concept được dời xuống cuối queue; không có session record được tạo.

> **Lưu ý thiết kế (từ US-FOCUS-02):** Hệ thống **không yêu cầu người dùng tự ghi nhận xao nhãng**. Toàn bộ việc phát hiện gián đoạn là tự động dựa trên hành vi (Pause, tab switch, abandon). Cơ chế này phù hợp với thực tế: người dùng bị xao nhãng thường không còn khả năng tự giác ghi lại.

---

## UC-05: Conduct AI Examiner Interview

| Field | Detail |
|---|---|
| **Use Case ID** | UC-05 |
| **Use Case Name** | Conduct AI Examiner Interview |
| **Actor(s)** | Student (primary), AI System / Gemini API (secondary) |
| **User Stories** | US-VERIFY-01, US-VERIFY-02, US-VERIFY-03, US-VERIFY-04 |
| **Relationship** | `<<includes>>` UC-04 — tự động kích hoạt sau Focus Session |

**Preconditions:**
- Focus Session (UC-04) vừa kết thúc, hoặc Student chủ động chọn Verify thủ công (US-VERIFY-04).
- Tài liệu gốc (source material) và concept cần kiểm tra có sẵn trong database.

**Postconditions:**
- `mastery_score` của concept được cập nhật trong bảng `concepts`.
- Session summary được tạo và lưu vào lịch sử.
- Nếu `mastery_score < 0.6`: UC-06 (Trace-back) được kích hoạt tự động.

**Basic Flow:**
1. System kiểm tra `interruption_events` từ UC-04. Nếu có gián đoạn, chuẩn bị ưu tiên câu hỏi về phần nội dung sau thời điểm gián đoạn.
2. System gọi Gemini API: `generate_question(concept, source_material, turn=1, priority_section?)` → AI trả về câu hỏi theo JSON schema cố định.
3. System hiển thị câu hỏi cho Student. Câu hỏi bám sát nội dung tài liệu gốc, không hỏi chung chung.
4. Student nhập câu trả lời dạng text.
5. System gọi Gemini API: `grade_answer(question, answer, rubric, source_material)` → AI trả về `{score: float, is_genuine: bool, feedback: string}`.
6. System hiển thị phản hồi tức thì: đúng/sai/gợi ý + giải thích cụ thể điểm nào sai (US-VERIFY-02).
7. System cập nhật running `mastery_score` cho concept.
8. **Quyết định tiếp theo (deterministic logic — không phải AI):**
   - `is_genuine = true` + còn turns → hỏi câu follow-up sâu hơn (quay lại bước 2, turn+1).
   - `is_genuine = false` + còn turns → hỏi câu probe để xác nhận mức độ hiểu thực.
   - Hết giới hạn turns (mặc định 3 turns/concept) → kết thúc Interview cho concept này.
   - Câu trả lời sai liên quan đến prerequisite → kết thúc sớm, kích hoạt UC-06.
9. Sau khi hoàn thành tất cả concepts trong session, System tạo end-of-session summary (AI rewrite từ scores đã lưu — không fabricate từ conversational memory).
10. Student xem tóm tắt: concept nào solid (≥ 80%), trung bình (50–79%), yếu (<50%), gợi ý ôn tập.

**Alternative Flows:**
- **A1 – Gemini API lỗi / hết quota:** System chuyển sang fallback mode: hiển thị flashcard tĩnh với câu hỏi được generate trước. Student tự đánh giá đúng/sai. System vẫn cập nhật `mastery_score`.
- **A2 – Student bỏ dở giữa phiên Verify:** `mastery_score` được tính từ các turns đã hoàn thành. Summary hiển thị dữ liệu không đầy đủ với cảnh báo.
- **A3 – Student yêu cầu hint:** System highlight đoạn liên quan trong source material (không đưa đáp án thẳng).
- **A4 – Student chọn Verify thủ công (US-VERIFY-04):** Student chọn concept bất kỳ từ danh sách hoặc nhập văn bản tự do. Phiên Verify chạy bình thường từ bước 2.

---

## UC-06: Trigger Trace-back Remediation

| Field | Detail |
|---|---|
| **Use Case ID** | UC-06 |
| **Use Case Name** | Trigger Trace-back Remediation |
| **Actor(s)** | System (tự động — không cần Student chủ động) |
| **User Stories** | US-VERIFY-05 |
| **Relationship** | `<<includes>>` UC-05 — tự động kích hoạt sau mỗi grading turn |

**Preconditions:**
- UC-05 vừa chấm điểm một câu trả lời với kết quả `mastery_score(C) < 0.6`.
- Concept Graph đã có ít nhất 1 prerequisite edge liên quan đến C.

**Postconditions:**
- Queue học tiếp theo được cập nhật: prerequisite concepts yếu được chèn vào trước C.
- Student nhận thông báo giải thích lý do lịch học thay đổi.
- Nếu không tìm thấy prerequisite nào cần review: C được đưa vào spaced repetition schedule.

**Basic Flow:**
1. Sau mỗi grading turn, System kiểm tra: `mastery_score(C) < 0.6`?
2. Nếu đúng, System khởi tạo hàng đợi Q = [direct prerequisites của C từ `concept_edges`].
3. System duyệt Q theo BFS, giới hạn tối đa 2 levels:
   - Với mỗi prerequisite P trong Q:
     - Nếu P chưa từng được test (`last_tested_at IS NULL`) HOẶC `mastery_score(P) < 0.6` → INSERT P vào đầu session queue (trước C).
     - Ngược lại → skip (P đã vững, không cần review).
4. Nếu không tìm thấy prerequisite nào cần review → áp dụng spaced repetition: schedule C review lại sau X ngày dựa trên `mastery_score`.
5. System cập nhật Study Plan queue trong database.
6. System hiển thị thông báo cho Student: *"Hệ thống phát hiện bạn có thể đang thiếu kiến thức nền ở [P]. Buổi học tiếp theo sẽ ôn lại [P] trước khi quay lại [C]."*

**Alternative Flows:**
- **A1 – Tất cả prerequisites đã vững (score ≥ 0.6):** System không insert thêm gì. Chỉ schedule C theo spaced repetition. Thông báo: *"[C] sẽ được nhắc ôn lại sau X ngày."*
- **A2 – Graph không có prerequisite nào cho C (leaf node):** Áp dụng spaced repetition thông thường cho C ngay lập tức.
- **A3 – BFS depth limit đạt 2 levels:** Dừng trace-back để tránh session quá dài. Log lại các node chưa được check để xem xét trong lần review tiếp theo.

---

## UC-07: View Dashboard & Progress

| Field | Detail |
|---|---|
| **Use Case ID** | UC-07 |
| **Use Case Name** | View Dashboard & Progress |
| **Actor(s)** | Student (primary) |
| **User Stories** | US-DASH-01, US-DASH-02, US-DASH-03, US-DASH-04 |

**Preconditions:**
- Student đã đăng nhập.
- Có ít nhất 1 Study Plan đã được tạo.

**Postconditions:**
- Không thay đổi dữ liệu (read-only view).
- Student có bức tranh tổng thể về mức độ nắm vững kiến thức và có thể quyết định bước tiếp theo.

**Basic Flow:**
1. Student đăng nhập → được chuyển hướng đến Dashboard. Dashboard tải trong vòng 2 giây.
2. System hiển thị tổng quan (US-DASH-01):
   - Danh sách Study Plans đang active, mỗi plan có progress bar (% concepts mastered).
   - Deadline sắp tới (3 plan gần nhất).
3. Student chọn 1 Study Plan để xem chi tiết.
4. System hiển thị Concept Graph (US-DASH-02):
   - Node màu **xanh lá** (🟢): `mastery_score ≥ 0.8` — solid.
   - Node màu **vàng** (🟡): `0.6 ≤ score < 0.8` — needs review.
   - Node màu **đỏ** (🔴): `score < 0.6` — weak, trace-back đã/sẽ kích hoạt.
   - Node màu **xám** (⚪): chưa học.
5. Student click vào node để xem chi tiết concept: lịch sử điểm qua các lần Verify, câu hỏi từng được hỏi.
6. System hiển thị lịch sử phiên học và kiểm chứng theo thời gian (US-DASH-03).
7. System hiển thị thống kê tổng thời gian học theo tuần, so sánh với tuần trước (US-DASH-04).
8. Student có thể nhấn "Continue Studying" để bắt đầu session tiếp theo (UC-04).

**Alternative Flows:**
- **A1 – Chưa có Study Plan nào:** Dashboard hiển thị empty state với CTA "Create your first Study Plan".
- **A2 – Chưa có lịch sử Verify:** Concept Graph hiển thị toàn bộ nodes màu xám. Gợi ý: *"Bắt đầu phiên học để theo dõi tiến độ."*

---

## UC-08: Receive Proactive Review Reminder

| Field | Detail |
|---|---|
| **Use Case ID** | UC-08 |
| **Use Case Name** | Receive Proactive Review Reminder |
| **Actor(s)** | System (agentic, tự động), Student (nhận thông báo) |
| **User Stories** | Derived from US-PLAN-05 (deadline context), US-VERIFY-05 |

**Preconditions:**
- Student có ít nhất 1 Study Plan với deadline.
- Có ít nhất 1 concept đã có `mastery_score` từ UC-05.

**Postconditions:**
- Student nhận thông báo và (tùy chọn) bắt đầu session ôn ngay.
- Reminder event được log lại để tránh gửi lại quá nhiều lần.

**Basic Flow:**
1. System định kỳ chạy agentic scheduling engine (background job).
2. Engine tính urgency score cho mỗi concept:
   ```
   urgency = f(days_to_deadline, mastery_score, last_tested_at)
   ```
   - Deadline gần + mastery thấp + lâu không ôn → urgency cao.
3. Với concept có urgency vượt ngưỡng: System tạo in-app notification:
   *"[Concept X] trong môn [Y] cần được ôn lại — còn [Z] ngày đến deadline, điểm hiện tại: [score%]."*
4. Student nhấn notification → được chuyển thẳng đến session của concept đó (UC-04).
5. Student có thể chọn "Snooze 2 giờ" hoặc "Bỏ qua".

**Alternative Flows:**
- **A1 – Tất cả concepts đã solid (≥ 0.8) trước deadline 2 ngày:** System gửi congratulation notification thay vì reminder.
- **A2 – Deadline đã qua:** Concept được archive; hệ thống ngừng gửi reminder cho plan đó.
- **A3 – Student đã Snooze:** System không gửi lại trong 2 giờ tiếp theo, bất kể urgency score.

---

## Bảng tổng hợp Use Cases — Mapping với User Stories

| UC | User Stories | Priority | Sprint |
|---|---|---|---|
| UC-01 | US-AUTH-01, 02, 03, 04 | Cao | Sprint 3 |
| UC-02 | US-PLAN-01, 05 | Cao | Sprint 3 |
| UC-03 | US-PLAN-02, 03, 04 | Cao | Sprint 3 |
| UC-04 | US-FOCUS-01, **02**, 03, 04 | Trung bình | Sprint 3–4 |
| UC-05 | US-VERIFY-01, 02, 03, 04 | Cao | Sprint 4 |
| UC-06 | US-VERIFY-05 | Cao | Sprint 4 |
| UC-07 | US-DASH-01, 02, 03, 04 | Cao | Sprint 5 |
| UC-08 | (Derived) | Trung bình | Sprint 5 |

> **Ghi chú US-FOCUS-02:** UC-04 đã tích hợp cơ chế phát hiện gián đoạn **tự động** (Pause event, tab switch, session abandon) thay thế cho yêu cầu người dùng tự ghi nhận thủ công. Dữ liệu gián đoạn được truyền sang UC-05 để AI ưu tiên kiểm tra phần nội dung có nguy cơ bị bỏ lỡ.