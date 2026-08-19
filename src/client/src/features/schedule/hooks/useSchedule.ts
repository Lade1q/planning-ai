import { SCHEDULE_SAMPLE } from '../__fixtures__/schedule-sample';
import type { ScheduleItem } from '../types/schedule.types';

export interface UseScheduleReturn {
  /** Hôm nay theo giờ VN, do server chốt (fixture: `2026-08-18`). */
  todayDateKey: string;
  /** Mảng phẳng, đã sắp sẵn từ server. Bộ lọc kế hoạch (#405) chạy trên chính mảng này. */
  items: ScheduleItem[];
}

/**
 * Nguồn dữ liệu của màn Lịch ôn tập (#400).
 *
 * **Đang chạy trên fixture, chưa gọi API.** `GET /api/v1/review-queue/schedule` là việc của #402;
 * dựng hook ngay từ Giai đoạn 0 để #404 và #405 mở nhánh là có dữ liệu đúng hình dạng ngay, không
 * ai phải chờ backend và không ai tự bịa một mảng riêng.
 *
 * CỐ Ý không trả `days` đã nhóm sẵn: nhóm phải chạy SAU khi lọc `hiddenPlanIds`, mà bộ lọc đó là
 * state của màn. Một `days` nhóm trên mảng thô ở đây sẽ là cái tên hiển nhiên nhất để #404 cắm
 * vào lưới, và bộ lọc kế hoạch của #405 im lặng mất tác dụng — không lỗi biên dịch, không test
 * nào bắt.
 *
 * Cố ý CHƯA có `isLoading`/`hasError`: trên fixture hai cờ đó chỉ có một giá trị, và một cờ luôn
 * `false` là thứ người sau tưởng đã được xử lý.
 *
 * ⚠️ Khi #402 thay fixture bằng `scheduleApi.getSchedule()`: `ScheduleView` gieo con trỏ tháng từ
 * `todayDateKey` **một lần lúc mount**, nên nơi gọi phải chờ có `todayDateKey` rồi mới render
 * `ScheduleView` (hoặc `key` lại nó). Render trước khi có dữ liệu sẽ chốt lưới vào một tháng rác
 * và nó không tự sửa khi dữ liệu về.
 */
export function useSchedule(): UseScheduleReturn {
  return SCHEDULE_SAMPLE;
}
