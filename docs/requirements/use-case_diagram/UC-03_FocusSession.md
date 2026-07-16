# UC-03: Module Focus Session

> **Module:** Focus Session
> **Sprint:** 3
> **DB liên quan:** `focus_sessions`

---

## UC-09: Bắt đầu phiên học (Focus Session)

| Trường | Nội dung |
|---|---|
| **Actor** | Student, System |
| **Mục tiêu** | Ghi nhận thời gian ôn tập có cấu trúc (Pomodoro hoặc free timer) |
| **Điều kiện tiên quyết** | Student đã đăng nhập, đã có ít nhất một kế hoạch |
| **Điều kiện kết thúc (thành công)** | Phiên học được ghi lại vào DB với thời gian bắt đầu, kết thúc, khái niệm liên quan |

### Luồng chính
1. Student chọn khái niệm / nhóm khái niệm cần ôn trong phiên này
2. Chọn phương pháp học (mặc định: Pomodoro 25 phút)
3. Click "Bắt đầu" → timer chạy trên giao diện
4. Student tự ôn tập theo tài liệu của mình trong thời gian timer
5. Hết giờ → hệ thống phát thông báo (âm thanh hoặc visual)
6. Hệ thống ghi lại phiên: `{user_id, concept_ids, started_at, ended_at, duration_minutes}`
7. Đề xuất bước tiếp theo: "Bạn có muốn bắt đầu phiên Interview ngay không?"

### Luồng thay thế
- **[A1] Student kết thúc sớm trước khi hết giờ:**
  1. Click "Kết thúc phiên"
  2. Hệ thống ghi lại thời gian thực tế đã học (không phải toàn bộ 25 phút)
- **[A2] Student tạm dừng giữa chừng:**
  1. Click "Tạm dừng" → timer dừng lại
  2. Click "Tiếp tục" → timer chạy tiếp
  3. Tổng thời gian được cộng dồn (không tính thời gian pause)
- **[A3] Chế độ Free Timer (không Pomodoro):**
  - Student chọn "Không giới hạn thời gian", tự bấm kết thúc khi xong

### Luồng ngoại lệ
- **[E1] Mất kết nối Internet trong lúc timer đang chạy:**
  - Timer vẫn chạy ở client (JavaScript interval không cần mạng)
  - Khi có kết nối lại, kết quả phiên được sync lên server
- **[E2] Student đóng tab hoặc browser:**
  - Lưu `started_at` vào `localStorage`
  - Lần sau mở lại: hỏi "Bạn có phiên học bị gián đoạn, bạn có muốn ghi nhận không?"

---

## UC-10: Xem lịch sử phiên học

| Trường | Nội dung |
|---|---|
| **Actor** | Student |
| **Mục tiêu** | Theo dõi thói quen học tập và thời gian đầu tư |
| **Điều kiện tiên quyết** | Student đã có ít nhất một phiên học đã hoàn thành |

### Luồng chính
1. Student vào trang "Lịch sử & Tiến độ" (màn hình 8)
2. Xem danh sách các Focus Session theo ngày (hoặc tuần)
3. Xem thống kê tổng hợp:
   - Tổng thời gian ôn tập hôm nay / 7 ngày qua
   - Số phiên Pomodoro hoàn thành
   - Khái niệm đã được ôn trong các phiên

### Luồng ngoại lệ
- **[E1] Chưa có phiên học nào:** Hiển thị trạng thái rỗng kèm CTA "Bắt đầu phiên đầu tiên"
