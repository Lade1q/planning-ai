import { useEffect, useState } from 'react';

/**
 * Đồng hồ nhịp cho các cảnh hoạt hoạ của landing.
 *
 * Trả về số nhịp đã trôi qua, tăng mỗi `intervalMs`. Khi người dùng bật
 * `prefers-reduced-motion` thì KHÔNG chạy đồng hồ và trả thẳng `frozenAt` —
 * cảnh đứng yên ở trạng thái cuối (đồ thị đã dựng xong) thay vì mất nội dung,
 * đúng tinh thần khối reduced-motion sẵn có trong `global.css`.
 */
export function useSceneTicker(intervalMs: number, frozenAt: number): number {
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => window.clearInterval(id);
  }, [reduced, intervalMs]);

  return reduced ? frozenAt : tick;
}
