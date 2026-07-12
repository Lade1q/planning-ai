# MODULE 4: AI Examiner — Use-Case Specification

> **Hệ thống:** Recall AI  
> **Phiên bản:** 1.0  
> **Ngày:** 2026-07-11

---

## UC AE-01: Cấu hình Phiên Kiểm tra

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Cấu hình Phiên Kiểm tra |
| **Brief Description** | Use case này mô tả cách Người dùng (Student) thiết lập các thông số cho phiên kiểm tra AI trước khi bắt đầu, bao gồm chọn kế hoạch học tập, phạm vi các khái niệm kiểm tra và chế độ kiểm tra. |
| **Actors** | Student, Scheduling & Remediation Engine |

### Pre-conditions

- Người dùng đã đăng nhập thành công vào hệ thống.
- Người dùng có ít nhất một kế hoạch học tập đang hoạt động với các khái niệm đã được học.

### Basic Flow

1. Người dùng truy cập tính năng **"Kiểm tra AI"** từ menu điều hướng và nhấn **"Bắt đầu Kiểm tra"**.
2. Hệ thống hiển thị màn hình cấu hình phiên kiểm tra.
3. Người dùng chọn kế hoạch học tập muốn kiểm tra và phạm vi khái niệm (tất cả hoặc một số khái niệm cụ thể).
4. Scheduling & Remediation Engine tạo ordered queue — danh sách câu hỏi theo thứ tự ưu tiên dựa trên điểm thành thạo của từng khái niệm.
5. Người dùng xem xét cấu hình và nhấn **"Bắt đầu"** để chuyển sang phiên kiểm tra (AE-02).

### Alternative Flows

**Alternative Flow 1: Không có khái niệm nào thỏa mãn điều kiện kiểm tra**

1. Từ bước 4 của Basic Flow, Scheduling Engine không thể tạo ordered queue vì không có khái niệm nào đủ điều kiện (ví dụ: chưa học lần nào).
2. Hệ thống hiển thị thông báo: *"Bạn chưa có đủ dữ liệu học tập để bắt đầu kiểm tra. Hãy hoàn thành ít nhất một phiên học trước."*
3. Hệ thống gợi ý Người dùng chuyển sang FS-01 để bắt đầu học.

### Post-conditions

- Cấu hình phiên kiểm tra được thiết lập hoàn chỉnh.
- Ordered queue các câu hỏi đã được tạo bởi Scheduling Engine.
- Hệ thống sẵn sàng chuyển sang AE-02: Thực hiện Phiên Kiểm tra.

---

## UC AE-02: Thực hiện Phiên Kiểm tra (Vấn đáp nhiều lượt)

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Thực hiện Phiên Kiểm tra (Vấn đáp nhiều lượt) |
| **Brief Description** | Use case này mô tả cách Người dùng (Student) tham gia phiên vấn đáp nhiều lượt với AI Examiner: AI sinh câu hỏi, Người dùng trả lời và AI chấm điểm, với các tùy chọn tạm dừng, bỏ qua hoặc khiếu nại kết quả chấm. |
| **Actors** | Student, AI Service (Google Gemini) |

### Pre-conditions

- Phiên kiểm tra đã được cấu hình (AE-01) và ordered queue đã được tạo.
- Cache câu hỏi đã được pre-generate trước bởi AE-04 (nếu có).

### Basic Flow

1. Hệ thống khởi tạo phiên kiểm tra với State Machine (12 trạng thái) và hiển thị câu hỏi đầu tiên được AI sinh ra (`generate_question`).
2. Hệ thống hiển thị câu hỏi về một khái niệm cho Người dùng; Người dùng đọc câu hỏi và nhập câu trả lời vào ô text.
3. Người dùng nhấn **"Gửi câu trả lời"**; hệ thống gửi câu trả lời đến AI Service để chấm điểm (`grade_answer`).
4. AI Service trả về kết quả chấm điểm (đúng/sai/bán phần) và giải thích; hệ thống hiển thị feedback ngay cho Người dùng.
5. Nếu câu trả lời bị đánh giá là sai, hệ thống tự động include AE-05 (Truy ngược Lỗ hổng) để phân tích nguyên nhân.
6. Người dùng xem kết quả và nhấn **"Câu tiếp theo"**; hệ thống lấy câu hỏi tiếp theo từ queue.
7. Vòng lặp bước 2–6 tiếp tục cho đến khi hết tất cả câu hỏi trong queue.
8. Hệ thống kết thúc phiên kiểm tra và tự động chuyển đến AE-06 (Xem Tổng hợp Cuối phiên).

### Alternative Flows

**Alternative Flow 1: Lỗi API từ AI Service (Timeout/Lỗi)**

1. Từ bước 3 hoặc 4 của Basic Flow, AI Service không phản hồi hoặc trả về lỗi.
2. Hệ thống kích hoạt AE-03 (Sử dụng Fallback – Flashcard tĩnh) thay thế (extend: khi AI timeout/lỗi).
3. Hệ thống thông báo cho Người dùng: *"AI đang không khả dụng. Chuyển sang chế độ Flashcard tĩnh."*
4. Người dùng tiếp tục phiên kiểm tra bằng chế độ flashcard (xem AE-03).

**Alternative Flow 2: Người dùng bỏ qua câu hỏi (Skip)**

1. Từ bước 2 của Basic Flow, Người dùng không muốn trả lời câu hỏi hiện tại và nhấn **"Bỏ qua"**.
2. Hệ thống ghi nhận câu hỏi đã bị bỏ qua và chuyển sang câu hỏi tiếp theo.
3. Câu hỏi bị bỏ qua được đưa về cuối queue để hỏi lại sau nếu còn thời gian.

**Alternative Flow 3: Người dùng tạm dừng phiên kiểm tra**

1. Từ bước 2 đến 6 của Basic Flow, Người dùng nhấn **"Tạm dừng"**.
2. Hệ thống lưu trạng thái phiên kiểm tra hiện tại (vị trí trong queue, điểm số đã tích lũy).
3. Người dùng có thể tiếp tục phiên kiểm tra sau bằng cách nhấn **"Tiếp tục"**.

**Alternative Flow 4: Người dùng khiếu nại kết quả chấm điểm**

1. Từ bước 4 của Basic Flow, Người dùng không đồng ý với kết quả chấm và nhấn **"Khiếu nại"**.
2. Hệ thống gửi lại câu trả lời và ngữ cảnh câu hỏi đến AI Service để chấm lại lần 2.
3. AI Service trả về kết quả chấm mới; hệ thống hiển thị kết quả đã xem xét lại cho Người dùng.

### Post-conditions

- Toàn bộ câu hỏi trong queue đã được giải đáp hoặc bỏ qua.
- Kết quả phiên kiểm tra (điểm số, số câu đúng/sai) được lưu vào cơ sở dữ liệu.
- Điểm thành thạo của các khái niệm được cập nhật theo kết quả chấm điểm.

---

## UC AE-03: Sử dụng Fallback (Flashcard tĩnh)

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Sử dụng Fallback (Flashcard tĩnh) |
| **Brief Description** | Use case này mô tả cách hệ thống tự động chuyển sang chế độ flashcard tĩnh (không dùng AI) khi AI Service bị lỗi hoặc timeout, đảm bảo Người dùng có thể tiếp tục phiên kiểm tra mà không bị gián đoạn. |
| **Actors** | Student |

### Pre-conditions

- Đang trong phiên kiểm tra AE-02 và AI Service không khả dụng (timeout hoặc lỗi API).
- Hệ thống đã detect lỗi và trigger cơ chế fallback (extend: khi AI timeout/lỗi).

### Basic Flow

1. Hệ thống phát hiện lỗi AI và thông báo cho Người dùng: *"AI đang không khả dụng. Chuyển sang chế độ Flashcard tĩnh để tiếp tục."*
2. Hệ thống tải các flashcard được tạo sẵn từ cơ sở dữ liệu cho các khái niệm trong queue.
3. Hệ thống hiển thị mặt trước của flashcard (câu hỏi đã được chuẩn bị sẵn); Người dùng đọc câu hỏi và tự đánh giá mức độ nắm vững.
4. Người dùng lật flashcard để xem đáp án mặt sau.
5. Người dùng tự chấm điểm bằng cách nhấn **"Dễ"**, **"Khó"** hoặc **"Không biết"**.
6. Hệ thống ghi nhận kết quả tự chấm và chuyển sang flashcard tiếp theo.
7. Sau khi hết tất cả flashcard, hệ thống tổng hợp kết quả và chuyển đến AE-06.

### Alternative Flows

**Alternative Flow 1: Không có flashcard tĩnh cho khái niệm cần kiểm tra**

1. Từ bước 2 của Basic Flow, hệ thống không tìm thấy flashcard nào được tạo sẵn.
2. Hệ thống hiển thị thông báo: *"Không có dữ liệu flashcard cho các khái niệm này. Phiên kiểm tra không thể tiếp tục."*
3. Hệ thống hỏi Người dùng có muốn thử lại khi AI khả dụng hoặc hủy phiên kiểm tra.

**Alternative Flow 2: AI Service phục hồi trong khi đang dùng Fallback**

1. Từ bước 3–6 của Basic Flow, AI Service phục hồi.
2. Hệ thống thông báo cho Người dùng: *"AI đã sẵn sàng. Bạn có muốn chuyển lại chế độ AI Examiner không?"*
3. Người dùng xác nhận; hệ thống chuyển về AE-02 và tiếp tục từ câu hỏi tiếp theo.

### Post-conditions

- Phiên kiểm tra được hoàn thành với kết quả tự chấm điểm qua flashcard.
- Kết quả được ghi nhận vào lịch sử kiểm tra (có đánh dấu là "Chế độ Fallback").

---

## UC AE-04: Pre-generate & Cache Câu hỏi

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Pre-generate & Cache Câu hỏi |
| **Brief Description** | Use case này mô tả cách hệ thống chủ động tạo sẵn (pre-generate) và lưu vào cache các câu hỏi kiểm tra trước khi Người dùng bắt đầu phiên kiểm tra, nhằm giảm độ trễ trong phiên kiểm tra thực tế. |
| **Actors** | AI Service (Google Gemini), Scheduling & Remediation Engine |

### Pre-conditions

- Người dùng đã có kế hoạch học tập đang hoạt động.
- AI Service đang khả dụng.
- Scheduling Engine đã tính toán ordered queue cho các khái niệm cần kiểm tra.

### Basic Flow

1. Scheduling & Remediation Engine xác định các khái niệm có khả năng sẽ được kiểm tra sắp tới (dựa trên lịch ôn tập và điểm thành thạo).
2. Hệ thống gửi yêu cầu `pre-generate` đến AI Service để sinh câu hỏi cho từng khái niệm trong danh sách.
3. AI Service sinh câu hỏi và trả về kết quả; hệ thống lưu câu hỏi vào cache với TTL (thời gian hết hạn) phù hợp.
4. Khi Người dùng bắt đầu phiên kiểm tra (AE-01, AE-02), hệ thống ưu tiên lấy câu hỏi từ cache thay vì gọi API thời gian thực.
5. Cache được làm mới định kỳ hoặc khi điểm thành thạo của khái niệm thay đổi đáng kể.

### Alternative Flows

**Alternative Flow 1: AI Service không khả dụng khi pre-generate**

1. Từ bước 2 của Basic Flow, AI Service trả về lỗi hoặc timeout.
2. Hệ thống bỏ qua bước pre-generate cho batch hiện tại và thử lại sau theo lịch.
3. Phiên kiểm tra vẫn có thể diễn ra nhưng sẽ gọi API thời gian thực thay vì dùng cache.

**Alternative Flow 2: Cache hết hạn hoặc không có câu hỏi trong cache**

1. Từ bước 4 của Basic Flow, không có câu hỏi trong cache cho khái niệm cần kiểm tra.
2. Hệ thống gọi AI Service trực tiếp trong thời gian thực để sinh câu hỏi.
3. Người dùng có thể thấy độ trễ ngắn trong lúc chờ AI sinh câu hỏi; hệ thống hiển thị trạng thái **"Đang tạo câu hỏi..."**

### Post-conditions

- Cache câu hỏi được cập nhật với câu hỏi mới cho các khái niệm quan trọng nhất.
- Phiên kiểm tra tiếp theo sẽ có trải nghiệm mượt mà hơn nhờ dùng câu hỏi từ cache.

---

## UC AE-05: Truy ngược Lỗ hổng (Concept Traceback)

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Truy ngược Lỗ hổng (Concept Traceback) |
| **Brief Description** | Use case này mô tả cách hệ thống tự động phân tích khi Người dùng trả lời sai để truy ngược (traceback) các khái niệm tiên quyết (prerequisites) còn thiếu, giúp Người dùng hiểu nguyên nhân gốc rễ của lỗ hổng kiến thức. |
| **Actors** | Student, Scheduling & Remediation Engine |

### Pre-conditions

- Đang trong phiên kiểm tra AE-02 và AI Service vừa đánh giá câu trả lời của Người dùng là sai (include: nếu đánh giá = sai).
- Khái niệm vừa trả lời sai có các khái niệm tiên quyết (prerequisites) trong đồ thị kế hoạch học tập.

### Basic Flow

1. Hệ thống phát hiện câu trả lời của Người dùng bị đánh giá là sai và tự động kích hoạt Concept Traceback.
2. Scheduling & Remediation Engine thực hiện thuật toán BFS ngược (BFS ngược prereqs, max_depth=2) trên đồ thị kế hoạch để tìm các khái niệm tiên quyết bị thiếu.
3. Hệ thống tổng hợp danh sách các khái niệm tiên quyết yếu (điểm thành thạo thấp) và hiển thị cho Người dùng (include: hiển thị info traceback).
4. Hệ thống hiển thị thông báo: *"Có vẻ bạn cần củng cố các khái niệm nền tảng sau: [Danh sách khái niệm tiên quyết]. Bạn có muốn ôn tập các khái niệm này không?"*
5. Người dùng xem xét danh sách và có thể xác nhận ôn tập hoặc bỏ qua để tiếp tục phiên kiểm tra.
6. Nếu Người dùng xác nhận, hệ thống ghi nhận các khái niệm tiên quyết cần ôn vào lịch ôn tập với độ ưu tiên cao.

### Alternative Flows

**Alternative Flow 1: Không tìm thấy khái niệm tiên quyết yếu**

1. Từ bước 2 của Basic Flow, BFS ngược không tìm thấy khái niệm tiên quyết nào có điểm thành thạo thấp.
2. Hệ thống kết luận lỗi không liên quan đến kiến thức tiên quyết và chỉ hiển thị giải thích đáp án đúng.
3. Phiên kiểm tra tiếp tục bình thường.

**Alternative Flow 2: Người dùng bỏ qua gợi ý traceback**

1. Từ bước 5 của Basic Flow, Người dùng nhấn **"Bỏ qua"** và không muốn xem danh sách tiên quyết.
2. Hệ thống đóng thông báo traceback và tiếp tục phiên kiểm tra với câu hỏi tiếp theo.
3. Thông tin traceback vẫn được lưu vào báo cáo tổng hợp cuối phiên (AE-06).

### Post-conditions

- Danh sách khái niệm tiên quyết yếu được lưu vào báo cáo phiên kiểm tra.
- Nếu Người dùng xác nhận, các khái niệm tiên quyết được ưu tiên trong lịch ôn tập tiếp theo.

---

## UC AE-06: Xem Tổng hợp Cuối phiên

| Trường | Nội dung |
|---|---|
| **Use Case Name** | Xem Tổng hợp Cuối phiên |
| **Brief Description** | Use case này mô tả cách Người dùng (Student) xem báo cáo tổng hợp sau khi kết thúc phiên kiểm tra, bao gồm điểm số, danh sách câu hỏi đã làm, lỗ hổng kiến thức phát hiện và gợi ý ôn tập tiếp theo. |
| **Actors** | Student, AI Service (Google Gemini) |

### Pre-conditions

- Phiên kiểm tra AE-02 đã kết thúc (hoàn thành toàn bộ queue hoặc Người dùng chủ động kết thúc).

### Basic Flow

1. Hệ thống tự động chuyển đến màn hình tổng hợp sau khi phiên kiểm tra kết thúc.
2. AI Service xử lý toàn bộ dữ liệu phiên kiểm tra và sinh báo cáo tổng hợp (`summarize_session`).
3. Hệ thống hiển thị báo cáo tổng hợp bao gồm: tổng điểm, số câu đúng/sai/bỏ qua, danh sách khái niệm theo mức độ nắm vững và các lỗ hổng kiến thức phát hiện qua AE-05.
4. Hệ thống hiển thị gợi ý ôn tập: *"Dựa trên kết quả kiểm tra, bạn nên ôn tập thêm: [Danh sách khái niệm ưu tiên]."*
5. Người dùng có thể nhấn **"Xem chi tiết"** từng câu hỏi để xem lại câu hỏi, câu trả lời đã nộp và đáp án đúng.
6. Người dùng nhấn **"Hoàn tất"** để kết thúc và quay về Dashboard.

### Alternative Flows

**Alternative Flow 1: Lỗi API khi tổng hợp phiên (summarize_session)**

1. Từ bước 2 của Basic Flow, AI Service trả về lỗi khi tổng hợp phiên.
2. Hệ thống hiển thị báo cáo cơ bản (điểm số và thống kê thô) mà không cần AI sinh mô tả tổng hợp.
3. Hệ thống thông báo: *"Không thể tạo báo cáo chi tiết lúc này. Kết quả cơ bản đã được lưu."*

**Alternative Flow 2: Người dùng muốn bắt đầu phiên kiểm tra mới ngay**

1. Từ bước 6 của Basic Flow, Người dùng nhấn **"Kiểm tra lại"** thay vì **"Hoàn tất"**.
2. Hệ thống chuyển trở về AE-01 để Người dùng cấu hình phiên kiểm tra mới.

### Post-conditions

- Báo cáo tổng hợp phiên kiểm tra được lưu vào lịch sử và có thể xem lại bất cứ lúc nào.
- Điểm thành thạo các khái niệm được cập nhật theo kết quả kiểm tra.
- Lịch ôn tập được Scheduling Engine điều chỉnh dựa trên các lỗ hổng kiến thức vừa phát hiện.
