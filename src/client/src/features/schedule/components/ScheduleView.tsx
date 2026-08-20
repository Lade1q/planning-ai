import { useMemo } from 'react';
import { DayPanel, type DayPanelScope } from './DayPanel';
import { MonthGrid } from './MonthGrid';
import { useSchedule } from '../hooks/useSchedule';
import { useScheduleViewState } from '../hooks/useScheduleViewState';
import type { PlanSummary } from '@/features/study-planner/types/concept';
import type { ScheduleDay, ScheduleItem } from '../types/schedule.types';
import { groupByDateKey } from '../utils/schedule-date';

export interface ScheduleViewProps {
  /**
   * Danh sách kế hoạch của `GET /plans`, do `PlansPage` đã tải sẵn — truyền xuống chứ KHÔNG gọi
   * lại: #400 cấm nhân đôi metadata kế hoạch vào payload lịch, và gọi `/plans` lần thứ hai trên
   * cùng một trang chính là cùng một lỗi ở dạng khác.
   *
   * Hai người tiêu thụ đều thuộc #405: bộ lọc "hiện kế hoạch nào trên lịch" (phải liệt kê **cả
   * kế hoạch 0 mục** — chúng chưa có buổi ôn nào, không phải bị ẩn, nên không suy ra được từ
   * `items`) và banner đếm kế hoạch `draft`. Giai đoạn 0 chưa dùng tới.
   */
  plans: readonly PlanSummary[];
}

/**
 * View "Lịch" của `/plans` (#400) — **chủ sở hữu toàn bộ state của màn** (`useScheduleViewState`).
 *
 * `MonthGrid` và `DayPanel` không giữ state nào: lưới và panel phải kể cùng một câu chuyện (ô
 * ngày đang chọn ↔ panel đang mở ↔ mục đang mở rộng), mà hai cây state song song thì chỉ đồng bộ
 * đúng cho tới lần sửa thứ hai.
 *
 * Ngược lại, tệp này KHÔNG giữ câu chữ nào: panel tự dựng microcopy của nó. Ranh giới đặt ở đây
 * để #404 (lưới) và #405 (panel) không phải quay lại sửa cùng một tệp.
 *
 * Ở Giai đoạn 0 (#401) hai con còn rỗng — cả hai cắm vào đúng chữ ký đã có sẵn ở đây.
 */
export function ScheduleView({ plans: _plans }: ScheduleViewProps) {
  const { todayDateKey, items } = useSchedule();
  const state = useScheduleViewState(todayDateKey);

  const visibleItems = useMemo(
    () => items.filter((item) => !state.hiddenPlanIds.has(item.planId)),
    [items, state.hiddenPlanIds]
  );
  // Nhóm trên TRỌN mảng, không cắt theo `monthCursor` — xem `groupByDateKey`.
  const days = useMemo(
    () => groupByDateKey(visibleItems, todayDateKey),
    [visibleItems, todayDateKey]
  );

  const panel = resolvePanel(days, state.selectedDateKey, state.debtOpen);

  return (
    <>
      <MonthGrid
        monthCursor={state.monthCursor}
        todayDateKey={todayDateKey}
        selectedDateKey={state.selectedDateKey}
        days={days}
        onSelectDay={state.selectDay}
        onShiftMonth={state.shiftMonth}
      />
      {panel !== null && (
        <DayPanel
          scope={panel.scope}
          todayDateKey={todayDateKey}
          items={panel.items}
          expandedItemId={state.expandedItemId}
          onToggleItem={state.toggleItem}
          onClose={state.closePanel}
          onReschedule={noop}
          onRemove={noop}
        />
      )}
    </>
  );
}

/** "Dời sang ngày…" cần `PATCH scheduledFor` (#403); "Gỡ khỏi lịch" cần luồng gỡ của #405. */
function noop(): void {}

/**
 * Panel đang mở nói về cái gì, và với những mục nào. Chỉ chọn dữ liệu — câu chữ là của `DayPanel`.
 */
function resolvePanel(
  days: ScheduleDay[],
  selectedDateKey: string | null,
  debtOpen: boolean
): { scope: DayPanelScope; items: ScheduleItem[] } | null {
  if (debtOpen) {
    // "Còn nợ" gom mọi ngày quá hạn — đọc `isOverdue` mà `groupByDateKey` đã tính, để luật "quá
    // hạn" chỉ nằm ở một chỗ; lưới và panel không thể nói hai con số khác nhau.
    return {
      scope: { kind: 'debt' },
      items: days.filter((day) => day.isOverdue).flatMap((day) => day.items),
    };
  }
  if (selectedDateKey === null) return null;

  return {
    scope: { kind: 'day', dateKey: selectedDateKey },
    // Ngày không có mục nào thì không có `ScheduleDay` nào — panel nhận mảng rỗng và tự nói câu
    // cho ngày trống.
    items: days.find((day) => day.dateKey === selectedDateKey)?.items ?? [],
  };
}
