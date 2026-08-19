import { useState } from 'react';
import type { MonthCursor } from '../utils/schedule-date';

export interface ScheduleViewState {
  /** Tháng lưới đang hiện. KHÔNG cắt dữ liệu — chỉ quyết định 42 ô nào được vẽ (#404). */
  monthCursor: MonthCursor;
  setMonthCursor: (cursor: MonthCursor) => void;
  /** Ngày đang chọn, `null` khi panel đóng. */
  selectedDateKey: string | null;
  /** Panel đang hiện nhóm "Còn nợ" thay cho một ngày. */
  debtOpen: boolean;
  /**
   * Kế hoạch bị TẮT trên lịch (#405). Lưu id bị **ẩn** chứ không phải id được hiện: kế hoạch mới
   * tạo phải tự có mặt trên lịch, không phải chờ ai đó tick nó vào.
   */
  hiddenPlanIds: Set<string>;
  setHiddenPlanIds: (planIds: Set<string>) => void;
  /** `id` mục đang mở rộng tại chỗ trong panel, `null` khi không mục nào mở. */
  expandedItemId: string | null;
  selectDay: (dateKey: string) => void;
  openDebt: () => void;
  closePanel: () => void;
  toggleItem: (id: string) => void;
}

/**
 * Toàn bộ state của màn Lịch, gom một chỗ (#401).
 *
 * Tách khỏi `ScheduleView` chỉ để mô tả được **bề mặt state** thành một type: `MonthGrid` và
 * `DayPanel` không giữ state nào, nên mỗi khi #404/#405 cần nhớ thêm thứ gì thì chỗ thêm vào là
 * đây — không phải trong con.
 *
 * Ba hàm cuối là các chuyển trạng thái mà **nhiều state đổi cùng lúc**; để nơi gọi tự gọi ba
 * setter theo đúng thứ tự là cách chắc chắn nhất để một trong ba bị quên. Cụ thể: chọn ngày phải
 * đóng "Còn nợ" (một panel, hai nội dung loại trừ nhau) và phải đóng mục đang mở rộng, nếu không
 * đổi ngày xong còn lại một mục mở lơ lửng của ngày cũ.
 */
export function useScheduleViewState(initialMonth: MonthCursor): ScheduleViewState {
  const [monthCursor, setMonthCursor] = useState<MonthCursor>(initialMonth);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [debtOpen, setDebtOpen] = useState(false);
  const [hiddenPlanIds, setHiddenPlanIds] = useState<Set<string>>(() => new Set());
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  return {
    monthCursor,
    setMonthCursor,
    selectedDateKey,
    debtOpen,
    hiddenPlanIds,
    setHiddenPlanIds,
    expandedItemId,
    selectDay: (dateKey) => {
      setSelectedDateKey(dateKey);
      setDebtOpen(false);
      setExpandedItemId(null);
    },
    openDebt: () => {
      setDebtOpen(true);
      setSelectedDateKey(null);
      setExpandedItemId(null);
    },
    closePanel: () => {
      setSelectedDateKey(null);
      setDebtOpen(false);
      setExpandedItemId(null);
    },
    toggleItem: (id) => setExpandedItemId((prev) => (prev === id ? null : id)),
  };
}
