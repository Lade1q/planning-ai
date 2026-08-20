import { useEffect, useState } from 'react';
import { scheduleApi } from '../api/schedule.api';
import type { ScheduleItem, ScheduleResponse } from '../types/schedule.types';

export interface UseScheduleReturn {
  /**
   * Hôm nay theo giờ VN, do server chốt. `null` khi chưa tải xong — **không** thay bằng một ngày
   * client tự cắt: cả cây `src/client` không có chỗ nào biết `Asia/Ho_Chi_Minh`, và một giá trị
   * tạm sai sẽ chốt cứng con trỏ tháng (xem `ScheduleView`).
   */
  todayDateKey: string | null;
  /**
   * Mảng phẳng, đã sắp sẵn từ server (`dateKey` tăng, trong ngày theo `sortReviewItems`).
   * Bộ lọc kế hoạch (#405) chạy trên chính mảng này.
   *
   * `readonly` để không ai `.sort()` tại chỗ rồi phá thứ tự hai tầng mà server vừa cam kết.
   */
  items: readonly ScheduleItem[];
  /** Chỉ cho lần tải ĐẦU TIÊN — theo đúng khuôn `useReviewQueue`. */
  isLoading: boolean;
  /** Chỉ bật khi lần tải đầu tiên thất bại, tức không có gì để hiện. */
  hasError: boolean;
  reload: () => Promise<void>;
}

const EMPTY_ITEMS: readonly ScheduleItem[] = [];

/**
 * Nguồn dữ liệu của màn Lịch ôn tập (#402).
 *
 * CỐ Ý không trả `days` đã nhóm sẵn: nhóm phải chạy SAU khi lọc `hiddenPlanIds`, mà bộ lọc đó là
 * state của màn. Một `days` nhóm trên mảng thô ở đây sẽ là cái tên hiển nhiên nhất để cắm vào
 * lưới, và bộ lọc kế hoạch im lặng mất tác dụng — không lỗi biên dịch, không test nào bắt.
 *
 * Không dùng React Query/Zustand — theo convention hiện tại của repo (`useReviewQueue`,
 * `PlansPage`): `useState` + promise chain INLINE trong `useEffect`, tránh lint
 * `react-hooks/set-state-in-effect`.
 */
export function useSchedule(): UseScheduleReturn {
  const [data, setData] = useState<ScheduleResponse | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    scheduleApi
      .getSchedule()
      .then((schedule) => {
        if (!isMounted) return;
        setData(schedule);
        setHasError(false);
      })
      .catch((error: unknown) => {
        console.error('Failed to load review schedule', error);
        if (isMounted) setHasError(true);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const reload = async (): Promise<void> => {
    const schedule = await scheduleApi.getSchedule();
    setData(schedule);
    setHasError(false);
  };

  return {
    todayDateKey: data?.todayDateKey ?? null,
    items: data?.items ?? EMPTY_ITEMS,
    isLoading: data === null && !hasError,
    hasError,
    reload,
  };
}
