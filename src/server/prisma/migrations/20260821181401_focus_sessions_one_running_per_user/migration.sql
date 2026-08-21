-- #328: chặn N request THỰC SỰ đồng thời (cùng round-trip DB, ví dụ Promise.all) tạo N hàng
-- `running` cho cùng user. App-level check trong `createFocusSession` (#371) đã đóng phần
-- double-click/2-tab tuần tự, nhưng `reap -> findFirst -> create` không nằm trong 1 transaction
-- nên N request thực sự song song vẫn cùng thấy "chưa có phiên nào" rồi cùng ghi.
--
-- Đây là partial unique index (`WHERE status = 'running'`) nên KHÔNG thể khai báo qua
-- `@@unique` trong schema.prisma (Prisma không hỗ trợ điều kiện `WHERE` trên unique constraint) -
-- viết raw SQL là ngoại lệ hợp lệ theo docs/guidelines/coding-conventions.md §5.3.
--
-- Scope là per-user (không phải per-user+plan+concept) vì `concept_ids` là cột Json
-- (`string[]`), không đặt được ràng buộc duy nhất lên phần tử mảng JSON mà không chuẩn hoá lại
-- mô hình dữ liệu - và per-user đã khớp đúng ngữ nghĩa "một người chỉ tập trung một lúc" mà #371
-- chọn.
CREATE UNIQUE INDEX "focus_sessions_one_running_per_user"
  ON "focus_sessions" ("user_id")
  WHERE "status" = 'running';
