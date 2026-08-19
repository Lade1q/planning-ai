import { useMemo } from 'react';
import { DayPanel } from './DayPanel';
import { MonthGrid } from './MonthGrid';
import { useSchedule } from '../hooks/useSchedule';
import { useScheduleViewState } from '../hooks/useScheduleViewState';
import type { ScheduleDay, ScheduleItem } from '../types/schedule.types';
import { formatDayLabel, groupByDateKey } from '../utils/schedule-date';

/**
 * View "Lịch" của `/plans` (#400) — **chủ sở hữu toàn bộ state của màn** (`useScheduleViewState`).
 *
 * `MonthGrid` và `DayPanel` không giữ state nào: lưới và panel phải kể cùng một câu chuyện (ô
 * ngày đang chọn ↔ panel đang mở ↔ mục đang mở rộng), mà hai cây state song song thì chỉ đồng bộ
 * đúng cho tới lần sửa thứ hai.
 *
 * Ở Giai đoạn 0 (#401) hai con còn rỗng — #404 dựng lưới, #405 dựng panel + thanh "Còn nợ" + bộ
 * lọc, cả hai cắm vào đúng chữ ký đã có sẵn ở đây.
 */
export function ScheduleView() {
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

  const panel = buildPanel(days, state.selectedDateKey, todayDateKey, state.debtOpen);

  return (
    <>
      <MonthGrid
        monthCursor={state.monthCursor}
        todayDateKey={todayDateKey}
        selectedDateKey={state.selectedDateKey}
        days={days}
        onSelectDay={state.selectDay}
      />
      {panel !== null && (
        <DayPanel
          title={panel.title}
          subtitle={panel.subtitle}
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

interface PanelContent {
  title: string;
  subtitle: string;
  items: ScheduleItem[];
}

/**
 * Nội dung panel: nhóm "Còn nợ", hoặc một ngày, hoặc không mở.
 *
 * Tiêu đề/phụ đề dựng ở phía chủ state vì `DayPanel` dùng chung cho cả hai ca và không được tự
 * suy mình đang là ca nào. Câu chữ ở đây là mức tối thiểu để hợp đồng có nghĩa — **#405 sở hữu
 * microcopy cuối** (đếm ngày quá hạn, câu cho ngày trống).
 */
function buildPanel(
  days: ScheduleDay[],
  selectedDateKey: string | null,
  todayDateKey: string,
  debtOpen: boolean
): PanelContent | null {
  if (debtOpen) {
    // "Còn nợ" gom mọi ngày quá hạn — đọc `isOverdue` mà `groupByDateKey` đã tính, để luật "quá
    // hạn" chỉ nằm ở một chỗ; lưới và panel không thể nói hai con số khác nhau.
    const overdue = days.filter((day) => day.isOverdue);
    return {
      title: 'Còn nợ',
      subtitle: summarise(
        overdue.reduce((count, day) => count + day.items.length, 0),
        overdue.reduce((minutes, day) => minutes + day.totalMinutes, 0)
      ),
      items: overdue.flatMap((day) => day.items),
    };
  }
  if (selectedDateKey === null) return null;

  const day = days.find((d) => d.dateKey === selectedDateKey);
  return {
    title: selectedDateKey === todayDateKey ? 'Hôm nay' : formatDayLabel(selectedDateKey),
    subtitle: day ? summarise(day.items.length, day.totalMinutes) : 'không có gì được xếp',
    items: day?.items ?? [],
  };
}

function summarise(conceptCount: number, minutes: number): string {
  return `${conceptCount} khái niệm · ≈ ${minutes} phút`;
}
