# Test Cases — AI Verify (AI Examiner & Trace-back)

> **Module:** AI Verify  
> **Use Cases:** UC-05 — Conduct AI Examiner Interview · UC-06 — Trigger Trace-back Remediation  
> **Phiên bản:** 1.0

---

## Test Suite 1: AI Examiner Interview (UC-05)

> Kiểm thử luồng phỏng vấn kiến thức do AI thực hiện: generate câu hỏi, chấm điểm câu trả lời, phản hồi tức thì, hint, fallback và bỏ dở giữa chừng.

### TC-VERIFY-001: Phỏng vấn AI khởi động và hiển thị câu hỏi đầu tiên

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-VERIFY-001 |
| **Tiêu đề** | Phiên AI Examiner khởi động và hiển thị câu hỏi đầu tiên sau khi Focus Session kết thúc |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | Focus Session (UC-04) vừa kết thúc. Gemini API hoạt động và có quota. Tài liệu gốc có trong database. |
| **Các bước thực hiện** | 1. Hoàn thành Focus Session.<br>2. Nhấn "Start Interview" trên màn hình tóm tắt session. |
| **Dữ liệu đầu vào** | \- Concept vừa học và tài liệu gốc lưu trong database |
| **Kết quả mong đợi** | \- Gemini API được gọi để generate câu hỏi.<br>\- Câu hỏi đầu tiên hiển thị, bám sát nội dung tài liệu gốc (không hỏi chung chung).<br>\- Ô nhập câu trả lời dạng text xuất hiện. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Kiểm tra câu hỏi có liên quan trực tiếp đến nội dung đã học, không hỏi ngoài phạm vi. |

---

### TC-VERIFY-002: Trả lời đúng — Nhận phản hồi tích cực và câu follow-up sâu hơn

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-VERIFY-002 |
| **Tiêu đề** | Khi trả lời đúng, hệ thống hiển thị phản hồi tích cực và đặt câu hỏi follow-up sâu hơn |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | Phiên AI Examiner đang diễn ra, câu hỏi đã được hiển thị. |
| **Các bước thực hiện** | 1. Nhập câu trả lời chính xác và đầy đủ vào ô text.<br>2. Submit câu trả lời. |
| **Dữ liệu đầu vào** | \- Câu trả lời chính xác và đầy đủ cho câu hỏi |
| **Kết quả mong đợi** | \- Gemini API chấm điểm: `{score: cao, is_genuine: true, feedback: ...}`.<br>\- Phản hồi tức thì hiển thị: đúng + giải thích điểm nào tốt.<br>\- mastery_score được cập nhật tăng lên.<br>\- Nếu còn turns: câu hỏi follow-up sâu hơn xuất hiện (turn+1). |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | — |

---

### TC-VERIFY-003: Trả lời sai — Phản hồi chỉ rõ điểm sai và đặt câu hỏi probe

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-VERIFY-003 |
| **Tiêu đề** | Khi trả lời sai, hệ thống hiển thị giải thích cụ thể điểm sai và đặt câu hỏi probe |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | Phiên AI Examiner đang diễn ra. |
| **Các bước thực hiện** | 1. Nhập câu trả lời sai hoặc không đầy đủ.<br>2. Submit câu trả lời. |
| **Dữ liệu đầu vào** | \- Câu trả lời sai hoặc thiếu |
| **Kết quả mong đợi** | \- Phản hồi hiển thị: sai + giải thích cụ thể điểm nào sai (không chỉ nói "Sai").<br>\- mastery_score giảm hoặc không tăng.<br>\- Câu hỏi probe để xác nhận mức độ hiểu thực xuất hiện. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Phản hồi phải chỉ rõ điểm sai cụ thể. |

---

### TC-VERIFY-004: Kết thúc sau 3 turns — Hiển thị End-of-Session Summary

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-VERIFY-004 |
| **Tiêu đề** | Sau khi hoàn thành giới hạn 3 turns, hệ thống tạo và hiển thị tóm tắt phiên |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | Phiên AI Examiner đang diễn ra với 1 concept. |
| **Các bước thực hiện** | 1. Trả lời 3 câu hỏi liên tiếp (3 turns).<br>2. Quan sát khi hết turn. |
| **Dữ liệu đầu vào** | *(câu trả lời qua 3 turns)* |
| **Kết quả mong đợi** | \- Sau turn 3: phiên phỏng vấn kết thúc tự động.<br>\- End-of-session summary hiển thị: concept nào solid (≥80%), trung bình (50-79%), yếu (<50%), gợi ý ôn tập.<br>\- Summary được tạo từ scores đã lưu (không fabricate từ memory hội thoại). |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Kiểm tra logic phân loại: solid/trung bình/yếu đúng ngưỡng 80% và 50%. |

---

### TC-VERIFY-005: Verify thủ công — Chọn concept bất kỳ để kiểm tra

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-VERIFY-005 |
| **Tiêu đề** | Người dùng chủ động chọn Verify thủ công cho concept bất kỳ mà không cần đi qua Focus Session |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | Medium |
| **Điều kiện tiên quyết** | User đã đăng nhập. Có Study Plan với ít nhất 1 concept. |
| **Các bước thực hiện** | 1. Từ Dashboard hoặc Study Plan, chọn "Verify thủ công".<br>2. Chọn concept bất kỳ từ danh sách.<br>3. Phiên Verify bắt đầu. |
| **Dữ liệu đầu vào** | \- Concept được chọn thủ công |
| **Kết quả mong đợi** | \- Phiên AI Examiner bắt đầu từ bước generate câu hỏi (không cần qua Focus Session).<br>\- Hoạt động bình thường như phiên Verify sau Focus Session. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | — |

---

### TC-VERIFY-006: Hint — Highlight tài liệu, không đưa đáp án

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-VERIFY-006 |
| **Tiêu đề** | Khi yêu cầu hint, hệ thống highlight đoạn liên quan trong tài liệu gốc mà không đưa đáp án thẳng |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | Medium |
| **Điều kiện tiên quyết** | Phiên AI Examiner đang diễn ra, câu hỏi đã được hiển thị. |
| **Các bước thực hiện** | 1. Xem câu hỏi nhưng chưa trả lời.<br>2. Nhấn nút "Hint". |
| **Dữ liệu đầu vào** | *(không có)* |
| **Kết quả mong đợi** | \- Đoạn liên quan trong source material được highlight hoặc hiển thị tham chiếu.<br>\- Hệ thống KHÔNG đưa đáp án trực tiếp.<br>\- Người dùng vẫn phải tự nhập câu trả lời. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Đây là yêu cầu UX quan trọng: hint không được lộ đáp án. |

---

### TC-VERIFY-007: Gemini API lỗi — Fallback sang flashcard tĩnh

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-VERIFY-007 |
| **Tiêu đề** | Khi Gemini API lỗi hoặc hết quota, hệ thống chuyển sang flashcard tĩnh và vẫn cập nhật mastery_score |
| **Loại kiểm thử** | Interface |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | Môi trường giả lập Gemini API lỗi / hết quota. |
| **Các bước thực hiện** | 1. Bắt đầu phiên AI Examiner.<br>2. Gemini API trả về lỗi (giả lập).<br>3. Quan sát hành vi hệ thống. |
| **Dữ liệu đầu vào** | \- Gemini API mock: error / quota exceeded |
| **Kết quả mong đợi** | \- Hệ thống chuyển sang fallback mode: hiển thị flashcard tĩnh với câu hỏi được generate trước.<br>\- Người dùng tự đánh giá đúng/sai.<br>\- mastery_score vẫn được cập nhật dựa trên tự đánh giá. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Cần xác nhận: câu hỏi fallback được generate trước và lưu sẵn chưa? |

---

### TC-VERIFY-008: Bỏ dở giữa phiên Verify — Tính điểm từ turns đã hoàn thành

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-VERIFY-008 |
| **Tiêu đề** | Khi người dùng bỏ dở giữa phiên Verify, mastery_score được tính từ các turns đã hoàn thành và hiển thị cảnh báo |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | Medium |
| **Điều kiện tiên quyết** | Phiên AI Examiner đang diễn ra, đã hoàn thành ít nhất 1 turn. |
| **Các bước thực hiện** | 1. Hoàn thành 1 trong 3 turns.<br>2. Thoát khỏi phiên Verify (đóng tab / điều hướng sang trang khác). |
| **Dữ liệu đầu vào** | *(không có)* |
| **Kết quả mong đợi** | \- mastery_score được tính từ turns đã hoàn thành.<br>\- Summary hiển thị dữ liệu không đầy đủ kèm cảnh báo rõ ràng.<br>\- Dữ liệu không bị mất. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | — |

---

## Test Suite 2: Trace-back Remediation (UC-06)

> Kiểm thử cơ chế tự động điều chỉnh queue học khi phát hiện kiến thức nền yếu, bao gồm các trường hợp biên của BFS và leaf node.

### TC-VERIFY-009: Trace-back kích hoạt khi mastery_score < 60%

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-VERIFY-009 |
| **Tiêu đề** | Hệ thống tự động kích hoạt Trace-back và chèn prerequisite concepts vào đầu queue khi mastery_score < 60% |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | Phiên Verify hoàn thành với mastery_score(C) < 0.6. Concept C có ít nhất 1 prerequisite P. mastery_score(P) < 0.6 hoặc P chưa được test. |
| **Các bước thực hiện** | 1. Hoàn thành phiên Verify cho concept C với câu trả lời yếu.<br>2. mastery_score(C) < 0.6.<br>3. Quan sát thông báo và queue học tiếp theo. |
| **Dữ liệu đầu vào** | \- mastery_score(C) = 0.4<br>\- Concept Graph: P→C (P chưa test) |
| **Kết quả mong đợi** | \- Hệ thống thông báo: *"Hệ thống phát hiện bạn có thể đang thiếu kiến thức nền ở [P]. Buổi học tiếp theo sẽ ôn lại [P] trước khi quay lại [C]."*<br>\- Queue học được cập nhật: P được chèn vào trước C.<br>\- Database phản ánh thứ tự queue mới. |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | Kiểm tra database: queue học có thứ tự đúng [P, C, ...]. |

---

### TC-VERIFY-010: Trace-back không kích hoạt khi tất cả prerequisites đã vững

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-VERIFY-010 |
| **Tiêu đề** | Khi tất cả prerequisites đã vững (score ≥ 0.6), hệ thống không insert thêm gì và chỉ schedule spaced repetition |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | High |
| **Điều kiện tiên quyết** | mastery_score(C) < 0.6. Tất cả prerequisites P của C đều có mastery_score(P) >= 0.6. |
| **Các bước thực hiện** | 1. Hoàn thành Verify cho concept C với điểm yếu.<br>2. Tất cả prerequisites của C đều đã vững. |
| **Dữ liệu đầu vào** | \- mastery_score(C) = 0.4<br>\- Tất cả mastery_score(P) = 0.8 |
| **Kết quả mong đợi** | \- Hệ thống KHÔNG chèn thêm bất kỳ concept nào vào queue.<br>\- Chỉ schedule C theo spaced repetition sau X ngày.<br>\- Thông báo: *"[C] sẽ được nhắc ôn lại sau X ngày."* |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | — |

---

### TC-VERIFY-011: Trace-back với leaf node — Áp dụng spaced repetition

| Trường | Nội dung |
|--------|---------|
| **Mã TC** | TC-VERIFY-011 |
| **Tiêu đề** | Khi concept yếu là leaf node (không có prerequisite), hệ thống áp dụng spaced repetition thông thường |
| **Loại kiểm thử** | Functionality |
| **Độ ưu tiên** | Medium |
| **Điều kiện tiên quyết** | mastery_score(C) < 0.6. C là node không có prerequisite nào trong Concept Graph. |
| **Các bước thực hiện** | 1. Hoàn thành Verify cho concept C (leaf node) với điểm yếu. |
| **Dữ liệu đầu vào** | \- mastery_score(C) = 0.3<br>\- C là leaf node |
| **Kết quả mong đợi** | \- Hệ thống áp dụng spaced repetition ngay lập tức cho C.<br>\- C được schedule review lại sau X ngày.<br>\- Không có thông báo trace-back (vì không có prerequisite). |
| **Kết quả thực tế** | *(điền sau khi test)* |
| **Trạng thái** | Not Run |
| **Ghi chú** | — |

---

## Bảng tóm tắt — AI Verify

| Mã TC | Test Suite | Tiêu đề | Loại | Độ ưu tiên | Trạng thái |
|-------|------------|---------|------|------------|------------|
| TC-VERIFY-001 | Suite 1: AI Examiner | Phỏng vấn AI khởi động và hiển thị câu hỏi đầu tiên | Functionality | High | Not Run |
| TC-VERIFY-002 | Suite 1: AI Examiner | Trả lời đúng — phản hồi tích cực và follow-up sâu hơn | Functionality | High | Not Run |
| TC-VERIFY-003 | Suite 1: AI Examiner | Trả lời sai — phản hồi chỉ rõ điểm sai và câu probe | Functionality | High | Not Run |
| TC-VERIFY-004 | Suite 1: AI Examiner | Kết thúc sau 3 turns — End-of-Session Summary | Functionality | High | Not Run |
| TC-VERIFY-005 | Suite 1: AI Examiner | Verify thủ công — chọn concept bất kỳ | Functionality | Medium | Not Run |
| TC-VERIFY-006 | Suite 1: AI Examiner | Hint — highlight tài liệu, không đưa đáp án | Functionality | Medium | Not Run |
| TC-VERIFY-007 | Suite 1: AI Examiner | Gemini API lỗi — fallback sang flashcard tĩnh | Interface | High | Not Run |
| TC-VERIFY-008 | Suite 1: AI Examiner | Bỏ dở Verify — tính điểm từ turns đã hoàn thành | Functionality | Medium | Not Run |
| TC-VERIFY-009 | Suite 2: Trace-back | Trace-back kích hoạt khi mastery_score < 60% | Functionality | High | Not Run |
| TC-VERIFY-010 | Suite 2: Trace-back | Trace-back không kích hoạt khi prerequisites đã vững | Functionality | High | Not Run |
| TC-VERIFY-011 | Suite 2: Trace-back | Trace-back với leaf node — spaced repetition | Functionality | Medium | Not Run |

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
