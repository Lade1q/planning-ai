import { useMemo } from 'react';
import { SCHEDULE_SAMPLE } from '../__fixtures__/schedule-sample';
import type { ScheduleDay, ScheduleItem } from '../types/schedule.types';
import { groupByDateKey } from '../utils/schedule-date';

export interface UseScheduleReturn {
  /** Hôm nay theo giờ VN, do server chốt (fixture: `2026-08-18`). */
  todayDateKey: string;
  /** Mảng phẳng, đã sắp sẵn từ server. Bộ lọc kế hoạch (#405) chạy trên chính mảng này. */
  items: ScheduleItem[];
  /** Cùng dữ liệu, đã nhóm theo ngày — thứ `MonthGrid` nhận. */
  days: ScheduleDay[];
}

/**
 * Nguồn dữ liệu của màn Lịch ôn tập (#400).
 *
 * **Đang chạy trên fixture, chưa gọi API.** `GET /api/v1/review-queue/schedule` là việc của #402;
 * dựng hook ngay từ Giai đoạn 0 để #404 và #405 mở nhánh là có dữ liệu thật-hình-dạng ngay, không
 * ai phải chờ backend và không ai tự bịa một mảng riêng.
 *
 * Khi #402 xong, chỗ phải sửa là **duy nhất thân hook này** (fixture → `scheduleApi.getSchedule`,
 * kèm `isLoading`/`hasError` như `useReviewQueue` đang làm). Mọi component chỉ đọc ba trường trên
 * nên không đụng tới.
 *
 * Cố ý CHƯA có `isLoading`/`hasError`: fixture thì hai cờ đó chỉ có một giá trị, và một cờ luôn
 * `false` là thứ người sau tưởng đã xử lý rồi.
 */
export function useSchedule(): UseScheduleReturn {
  const { todayDateKey, items } = SCHEDULE_SAMPLE;
  const days = useMemo(() => groupByDateKey(items, todayDateKey), [items, todayDateKey]);
  return { todayDateKey, items, days };
}
