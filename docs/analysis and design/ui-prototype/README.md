# UI Prototype — RecallAI (PA4 · mục b)

> **Hạn nộp:** 14/08/2026 · **Issue:** #253 · **Rubric:** _"Revise UI prototype — submit the final UI design chosen for the system."_

Thư mục này chứa bản **thiết kế UI cuối cùng** của hệ thống RecallAI, gồm hai phần:

---

## 1. Interactive Prototype (Sprint 4 — 3 màn trọng điểm)

Ba màn mới của Sprint 4, được build thành **prototype có thể click qua được**. Mở trực tiếp bằng trình duyệt (cần server cục bộ hoặc Live Server extension):

| File | Màn hình | Use Case |
|---|---|---|
| `screen-interview.html` | Kiểm tra vấn đáp | UC-04 AI Examiner (AE-01 → AE-05) |
| `screen-focus-session.html` | Phiên học tập trung | UC-03 Focus Session (FS-01) |
| `screen-session-result.html` | Kết quả cuối phiên | UC-04 AI Examiner (AE-08, AE-09) |

### Cách chạy

Từ thư mục gốc của repo, chạy lệnh sau rồi mở trình duyệt:

    python -m http.server 8080

Hoặc dùng VS Code → **Live Server** (chuột phải file → Open with Live Server).

URL mẫu: `http://localhost:8080/docs/analysis%20and%20design/ui-prototype/screen-interview.html`

### Tính năng của từng prototype

**screen-interview.html — AI Examiner**
- State machine 6 trạng thái: asking → loading → graded → paused → fallback → done
- Đồng hồ đếm thời gian phiên (real-time)
- Rail trái: hàng đợi khái niệm + turn tracker với trọng số
- Submit bằng nút hoặc Ctrl+Enter
- AI không phản hồi → fallback sang flashcard tự chấm (AE-05)
- Tạm dừng → overlay 3 lựa chọn: Tiếp tục / Kết thúc / Về Dashboard
- Thanh **State** ở góc dưới-phải để nhảy thẳng vào trạng thái bất kỳ khi demo

**screen-focus-session.html — Focus Session**
- State machine 6 trạng thái: config → running → paused → break → done → cancel
- Form cấu hình Pomodoro (work / short break / long break / cycles) trước khi bắt đầu
- Countdown timer thật với vòng SVG tiến độ và Pomodoro pip meter
- Panel ghi chú nhanh (FS-05) — float bên phải, phím tắt N
- Phím tắt: Space = tạm dừng/tiếp tục, N = mở ghi chú, Esc = đóng panel
- Hết Pomodoro → tự chuyển sang break → tự chuyển sang Pomodoro tiếp
- Kết thúc → link sang screen-interview.html

**screen-session-result.html — Session Result**
- Hiển thị kết quả phiên: traceback khái niệm (AE-08) + nhận xét tổng hợp AI (AE-09)
- Biến thể A/B: có/không có traceback (toggle ở góc)
- **Không** phải screen-history.html (lịch sử DB-03) — đây là màn kết quả ngay sau phiên

---

## 2. Design Spec Sheets (Toàn bộ hệ thống)

Thiết kế đầy đủ của **tất cả màn hình** nằm trong thư mục song song:

    docs/analysis and design/claude-design/

Các file spec sheet hiển thị toàn bộ states theo chiều dọc kèm design rationale, accessibility notes, và tham chiếu UC. Dùng để xem đầy đủ hệ thống.

### Điều hướng trong claude-design

Mỗi file spec sheet có nút **"Màn hình"** ở góc dưới-trái (do `_nav.js` inject tự động). Bấm vào để chuyển sang màn bất kỳ. Các màn có prototype sẽ có thêm nút **"Prototype ↗"** để mở thẳng vào ui-prototype.

### Danh sách màn hình đầy đủ

| Màn hình | File spec | Interactive prototype |
|---|---|---|
| Đăng nhập / Đăng ký | screen-auth.html | — |
| Dashboard | screen-dashboard.html | — |
| Đồ thị khái niệm | screen-concept-graph.html | — |
| Tạo kế hoạch | screen-create-plan.html | — |
| Danh sách kế hoạch | screen-plans.html | — |
| Hàng đợi ôn tập | screen-plan-review-queue.html | — |
| **Phiên học tập trung** | screen-focus-session.html | ✅ ui-prototype/ |
| Lịch sử phiên | screen-history.html | — |
| **Kiểm tra vấn đáp** | screen-interview.html | ✅ ui-prototype/ |
| **Kết quả cuối phiên** | screen-session-result.html | ✅ ui-prototype/ |
| Hồ sơ người dùng | screen-profile.html | — |
| Component Library | components.html | — |

---

## Cấu trúc thư mục

    ui-prototype/
    ├── README.md                    ← file này
    ├── tokens.css                   ← design tokens (màu, font, spacing…)
    ├── screen-interview.html        ← prototype: AI Examiner
    ├── screen-focus-session.html    ← prototype: Focus Session
    └── screen-session-result.html   ← kết quả phiên (copy từ claude-design)

---

## Ghi chú kỹ thuật

- **CSS tokens:** cả 3 prototype đều link tới `tokens.css` cùng thư mục — không có inline style ad-hoc
- **No framework:** thuần HTML + Vanilla JS + CSS — không cần build step, không cần npm
- **Print-safe:** thanh State (proto-bar) ẩn khi in qua @media print
- **Không sửa** `claude-design/*.html` — prototype trong `ui-prototype/` là file viết lại từ đầu, chỉ tái sử dụng CSS class names từ spec sheet để dễ so sánh
