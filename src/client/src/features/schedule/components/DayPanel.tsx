import type { ScheduleItem } from '../types/schedule.types';

export interface DayPanelProps {
  /** "Hôm nay" · "T4, 20/08" · "Còn nợ" — người gọi quyết, panel không tự suy. */
  title: string;
  /** Dòng phụ dưới tiêu đề: "3 khái niệm · ≈ 26 phút · quá hạn 2 ngày". */
  subtitle: string;
  items: ScheduleItem[];
  /** `id` của mục đang mở rộng tại chỗ, `null` khi không mục nào mở. */
  expandedItemId: string | null;
  onToggleItem: (id: string) => void;
  onClose: () => void;
  onReschedule: (item: ScheduleItem) => void;
  onRemove: (item: ScheduleItem) => void;
}

/**
 * Panel chi tiết — **khung rỗng của Giai đoạn 0 (#401)**. Nội dung thật là việc của #405.
 *
 * DÙNG CHUNG cho cả panel-theo-ngày lẫn panel-"Còn nợ": hai thứ đó khác nhau đúng ở `title`/
 * `subtitle` và ở mảng `items` được truyền vào, nên tách làm hai component là nhân đôi cùng một
 * danh sách. Đó là lý do panel nhận `title`/`subtitle` dựng sẵn thay vì tự suy từ một `dateKey`.
 *
 * Không giữ state nào — kể cả `expandedItemId`: nó sống ở `ScheduleView` để mở một mục rồi đổi
 * ngày không để lại một mục mở lơ lửng.
 */
export function DayPanel(_props: DayPanelProps) {
  return null;
}
