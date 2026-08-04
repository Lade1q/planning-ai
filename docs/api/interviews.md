# Đặc tả API Interview (API Endpoints Spec)

Tất cả các API dưới đây có tiền tố `/api/v1/interviews` và yêu cầu xác thực người dùng qua
Header `Authorization: Bearer <TOKEN>`.

> Tài liệu này hiện mô tả endpoint **AE-09 (I6.5) — Kết quả tổng hợp cuối phiên** (§1) và
> trường **`sourceCitation`** dùng chung cho các endpoint hỏi–đáp (§2). Bản đặc tả đầy đủ của
> các endpoint còn lại (`POST /`, `GET /:id`, `POST /:id/answers`, `.../pause`, `.../resume` —
> I6.3/#115, AE-05/#116) sẽ được bổ sung khi I9.2 (#128) tổng hợp toàn bộ API spec.

---

### 1. Lấy Kết quả Tổng hợp của một Phiên (Get Session Summary)

- **Endpoint:** `GET /api/v1/interviews/:id/summary`
- **Xác thực:** ✅ Yêu cầu Bearer Token
- **Path params:**
  - `id` (string, UUID, required): id của `InterviewSession`.

- **Dùng để:** màn kết quả tổng hợp cuối phiên Interview (I6.7 / UC-14) — hiển thị bảng điểm
  từng khái niệm, nhận xét bằng ngôn ngữ tự nhiên do AI viết, và danh sách khái niệm mà
  Traceback (AE-08 / I7.2) đã đề xuất ôn lại cho phiên tiếp theo.

- **Ràng buộc quan trọng:**
  - Chỉ gọi được khi phiên đã `status = 'completed'` — gọi khi phiên còn dở trả về `409`.
  - `summarize_session` (lời gọi AI thứ 4 và cuối cùng — UC-Overview §5.1) chỉ nhận điểm số và
    verdict **đã tính xong**, không gửi lại tài liệu gốc, và không được phép tự sinh/sửa
    `mastery_score` (C4).
  - Nhận xét AI được sinh **một lần duy nhất** và cache lại — gọi endpoint này lần thứ 2 trở đi
    **không** tốn thêm lượt gọi Gemini nào (risk R01).
  - AI lỗi không làm request thất bại: vẫn trả `200` kèm bảng điểm structured đầy đủ,
    `summary.generatedByAi = false`, `summary.text = null`.

- **Response thành công (HTTP 200 OK):**

  ```json
  {
    "success": true,
    "data": {
      "sessionId": "7c9e6679-...-uuid",
      "status": "completed",
      "durationMinutes": 12,
      "concepts": [
        {
          "conceptId": "b2d3e4f5-...-uuid",
          "name": "Đạo hàm riêng",
          "masteryScore": 0.83,
          "turns": [{ "turnIndex": 1, "score": 0.7, "verdict": "shallow" }]
        }
      ],
      "summary": {
        "text": "Bạn nắm khá chắc phần Đạo hàm riêng...",
        "strengths": ["Đạo hàm riêng"],
        "weaknesses": [],
        "recommendations": ["Ôn lại phần ứng dụng thực tế của đạo hàm."],
        "generatedByAi": true,
        "message": null
      },
      "traceback": [
        {
          "conceptId": "c4e5f6a7-...-uuid",
          "name": "Giới hạn hàm số",
          "reason": "traceback",
          "depth": 1,
          "sourceConceptName": "Đạo hàm riêng",
          "status": "pending"
        }
      ]
    }
  }
  ```

  `summary.generatedByAi = false` khi `summarize_session` lỗi (sau retry) hoặc khi phiên kết
  thúc trước khi có khái niệm nào được chấm (UC-12 E1) — khi đó `summary.text` là `null` và
  `summary.message` chứa nguyên văn: _"Không thể tổng hợp nhận xét lúc này."_ Bảng điểm
  (`concepts`) vẫn luôn đầy đủ và chính xác trong mọi trường hợp.

  `traceback` đọc thẳng từ `ReviewQueueItem` (đã ghi bởi I7.2 khi từng khái niệm kết thúc trong
  phiên này) — không tính lại. Rỗng nếu phiên không có khái niệm nào cần truy ngược.

- **Response lỗi:**

  ```jsonc
  // 404 — phiên không tồn tại hoặc không thuộc user hiện tại (không phân biệt 2 trường hợp)
  { "success": false, "error": { "code": "NOT_FOUND", "message": "Interview session not found" } }

  // 409 — phiên chưa kết thúc
  {
    "success": false,
    "error": {
      "code": "SESSION_NOT_COMPLETED",
      "message": "This interview session has not finished yet"
    }
  }
  ```

- **Liên quan:**
  - [`src/server/src/services/session-summary.service.ts`](../../src/server/src/services/session-summary.service.ts) — logic đầy đủ.
  - [`src/server/src/services/gemini.service.ts`](../../src/server/src/services/gemini.service.ts) — `summarizeSession()`.
  - [`src/server/src/services/concept-result.service.ts`](../../src/server/src/services/concept-result.service.ts) (I7.2) — nơi ghi `mastery_score` và `ReviewQueueItem` mà endpoint này chỉ đọc lại.

---

### 2. Neo nguồn trích dẫn của câu hỏi (`sourceCitation` — C5)

> Mô tả **một trường dùng chung**, không phải một endpoint. Ba endpoint mang nó — `POST /`
> (`question`), `GET /:id` (`currentQuestion` và từng phần tử của `turns`), `POST /:id/answers`
> (`nextQuestion`) — sẽ được đặc tả đầy đủ ở I9.2 (#128).

- **Dùng để:** đóng ràng buộc cứng **C5 ("AI không bịa")** ngay trên màn phỏng vấn (I6.6) —
  dưới mỗi câu hỏi, sinh viên thấy được câu hỏi đó hỏi về khái niệm lấy ra từ **tài liệu nào,
  trang nào**. Dữ liệu đọc thẳng từ `concept_sources` (do `extract_concepts` ghi lúc phân tích),
  không phát sinh lời gọi AI nào ⇒ **không ảnh hưởng C4** (vẫn 4 lời gọi cố định).

- **Shape:**

  ```jsonc
  {
    "turnId": "5f1c2d3e-...-uuid",
    "conceptId": "b2d3e4f5-...-uuid",
    "conceptName": "Đạo hàm riêng",
    "turnIndex": 1,
    "questionText": "Đạo hàm riêng của f theo x nghĩa là gì?",
    "questionType": "recall",
    "source": "ai",
    "sourceCitation": {
      "documentId": "9a8b7c6d-...-uuid",
      "filename": "giai-tich-1.pdf",
      "kind": "pdf", // pdf | image | text
      "pageFrom": 7,
      "pageTo": 7,
    },
  }
  ```

- **Khi nào là `null`** — cả hai đều là **trạng thái hợp lệ**, không phải lỗi; client chỉ việc
  không render khối trích dẫn:
  - **Chế độ Flashcard (AE-05, `source: "cache_fallback"`):** `InterviewTurn` không lưu câu hỏi
    được lấy từ hàng `question_cache` nào, mà cache thì sống sót qua lần đổi tài liệu (#216) —
    gắn neo nguồn _hiện tại_ của khái niệm vào câu hỏi sinh từ tài liệu _cũ_ chính là trích dẫn
    bịa mà C5 cấm. Sau khi #216 xong, điều kiện này bỏ được.
  - **Khái niệm không có neo:** khái niệm thêm thủ công (#172), hoặc `extract_concepts` không
    trả về cả trang lẫn trích đoạn cho nó.

- **Lưu ý:**
  - **Không có `excerpt`.** Transcript tối đa 5 khái niệm × 3 lượt; kèm trích đoạn nguyên văn
    (tới 2000 ký tự) cho từng lượt là ~30KB không ai đọc. Trích đoạn nguyên văn thuộc về panel
    chi tiết khái niệm (DB-06) và màn tập trung (FS-04) — nơi chỉ hiển thị một khái niệm.
  - **Không có trường chương/mục.** Model chỉ có `filename` / `pageFrom` / `pageTo`; hiển thị
    đúng thứ đang có (`{filename} · tr. N`). Bịa thêm tên chương là đúng thứ C5 cấm.
  - Khái niệm được neo trong nhiều tài liệu thì lấy neo **đầu tiên theo `createdAt`** — cùng
    thứ tự panel DB-06 (`getConceptDetail`) đang dùng, để một khái niệm chỉ có một trích dẫn.

- **Liên quan:**
  - [`src/server/src/utils/question-citation.ts`](../../src/server/src/utils/question-citation.ts) — quy tắc chọn/ẩn neo nguồn (pure, không đụng DB).
  - [`src/server/src/services/interview.service.ts`](../../src/server/src/services/interview.service.ts) — `buildView()` đọc `concept_sources` cho cả hàng đợi khái niệm của phiên.
  - [`src/server/src/utils/concept-source.ts`](../../src/server/src/utils/concept-source.ts) — nơi neo nguồn được ghi ra lúc phân tích tài liệu.
