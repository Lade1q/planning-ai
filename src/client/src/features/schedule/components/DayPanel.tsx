import type { ScheduleItem } from '../types/schedule.types';

/**
 * Panel đang nói về cái gì. Union có nhãn chứ không phải hai component: hai ca khác nhau đúng ở
 * tiêu đề và ở mảng `items` được truyền vào, tách đôi là nhân đôi cùng một danh sách.
 */
export type DayPanelScope = { kind: 'debt' } | { kind: 'day'; dateKey: string };

export interface DayPanelProps {
  scope: DayPanelScope;
  /** Hôm nay theo giờ VN — để panel tự biết "Hôm nay" và tự đếm số ngày quá hạn. */
  todayDateKey: string;
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
 * DÙNG CHUNG cho cả panel-theo-ngày lẫn panel-"Còn nợ", phân biệt bằng `scope`.
 *
 * Panel tự dựng LẤY câu chữ của mình — tiêu đề, "N khái niệm · ≈ M phút", "quá hạn N ngày", câu
 * cho ngày trống — từ `scope` + `items` + `todayDateKey`. Cố ý KHÔNG nhận `title`/`subtitle` dựng
 * sẵn: #405 sở hữu microcopy, nên microcopy phải nằm trong tệp #405 sở hữu, chứ không phải trong
 * `ScheduleView.tsx` mà #404 cũng đang sửa. (Bản chữ ký đầu tiên nhận chuỗi, và chính ví dụ của
 * nó — `"… · quá hạn 2 ngày"` — là thứ `ScheduleView` không dựng nổi vì không có `dateKey`.)
 *
 * Cũng vì vậy KHÔNG nhận props đếm sẵn: số mục và tổng phút suy từ `items`, một nguồn.
 * `formatDayLabel` (`utils/schedule-date.ts`) là hàm dựng tiêu đề ngày, đã có test biên múi giờ.
 *
 * Không giữ state nào — kể cả `expandedItemId`: nó sống ở `ScheduleView` để mở một mục rồi đổi
 * ngày không để lại một mục mở lơ lửng.
 */
export function DayPanel(_props: DayPanelProps) {
  return null;
}
