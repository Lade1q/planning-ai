import type { ScheduleDay } from '../types/schedule.types';
import type { MonthCursor } from '../utils/schedule-date';

export interface MonthGridProps {
  monthCursor: MonthCursor;
  todayDateKey: string;
  /** `null` khi chưa chọn ngày nào — panel bên cạnh lúc đó đóng. */
  selectedDateKey: string | null;
  /**
   * ĐÃ NHÓM SẴN (`groupByDateKey`) — lưới không tự nhóm, và mảng này là của TRỌN lịch, không bị
   * cắt theo `monthCursor`. Nhờ thế đổi lưới-tháng sang dải-ngày chỉ là đổi hàm render này.
   */
  days: ScheduleDay[];
  onSelectDay: (dateKey: string) => void;
}

/**
 * Lưới tháng — **khung rỗng của Giai đoạn 0 (#401)**. Nội dung thật là việc của #404.
 *
 * Chữ ký trên là **giao kèo** giữa hai luồng frontend, không phải gợi ý: #404 dựng lưới, #405 dựng
 * panel, hai người không gặp nhau cho tới lúc ghép. Đổi chữ ký thì báo trước khi sửa.
 *
 * Không giữ state nào — mọi state của màn Lịch nằm ở `ScheduleView`.
 */
export function MonthGrid(_props: MonthGridProps) {
  return null;
}
