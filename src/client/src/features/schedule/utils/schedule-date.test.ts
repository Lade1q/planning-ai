import { describe, expect, it } from 'vitest';
import { SCHEDULE_SAMPLE } from '../__fixtures__/schedule-sample';
import type { ScheduleItem } from '../types/schedule.types';
import {
  formatDayLabel,
  groupByDateKey,
  monthCursorFromDateKey,
  shiftMonthCursor,
} from './schedule-date';

function item(dateKey: string, name: string, estimatedMinutes: number): ScheduleItem {
  return {
    id: `${dateKey}-${name}`,
    conceptId: name,
    name,
    planId: 'plan',
    planName: 'Kế hoạch',
    priority: 0.5,
    reason: 'spaced_repetition',
    reasonText: '',
    sourceConceptName: null,
    depth: null,
    masteryScore: 0.5,
    status: 'pending',
    estimatedMinutes,
    sourceSessionEndedAt: null,
    scheduledFor: `${dateKey}T03:00:00.000Z`,
    dateKey,
  };
}

describe('monthCursor', () => {
  it('reads year and 1-based month off a dateKey', () => {
    expect(monthCursorFromDateKey('2026-08-18')).toEqual({ year: 2026, month: 8 });
  });

  it('rolls the year forward past December', () => {
    expect(shiftMonthCursor({ year: 2026, month: 12 }, 1)).toEqual({ year: 2027, month: 1 });
  });

  it('rolls the year backward past January', () => {
    expect(shiftMonthCursor({ year: 2026, month: 1 }, -1)).toEqual({ year: 2025, month: 12 });
  });
});

describe('formatDayLabel', () => {
  it('names the weekday of the VN calendar day, not of a re-shifted instant', () => {
    // 18/08/2026 là thứ Ba.
    expect(formatDayLabel('2026-08-18')).toBe('T3, 18/08');
  });
});

describe('groupByDateKey', () => {
  const today = '2026-08-18';

  it('puts every item of a day in one bucket and sums its minutes', () => {
    const days = groupByDateKey(
      [item('2026-08-20', 'A', 14), item('2026-08-20', 'B', 9), item('2026-08-21', 'C', 3)],
      today
    );
    expect(days).toHaveLength(2);
    expect(days[0]).toMatchObject({ dateKey: '2026-08-20', totalMinutes: 23 });
    expect(days[1]).toMatchObject({ dateKey: '2026-08-21', totalMinutes: 3 });
  });

  it('keeps the order the server sent inside a day — the two-tier sort is not redone here', () => {
    const days = groupByDateKey(
      [item('2026-08-20', 'first', 1), item('2026-08-20', 'second', 1)],
      today
    );
    expect(days[0].items.map((i) => i.name)).toEqual(['first', 'second']);
  });

  it('marks a day before today as overdue, and today itself as not', () => {
    const days = groupByDateKey([item('2026-08-17', 'A', 1), item(today, 'B', 1)], today);
    expect(days.map((d) => d.isOverdue)).toEqual([true, false]);
  });

  // Ghim HƯỚNG của phép so, không chỉ ghim "hôm nay thì không quá hạn": đổi `<` thành `!==` cũng
  // qua được ca trên. Hệ quả thật nếu để lọt — `resolvePanel` gom thanh "Còn nợ" bằng
  // `days.filter(d => d.isOverdue)`, nên một phép so sai hướng làm nó hốt cả lịch tương lai.
  it('does not call a future day overdue', () => {
    const days = groupByDateKey([item('2026-08-25', 'A', 1)], today);
    expect(days[0].isOverdue).toBe(false);
  });

  it('sorts days by dateKey even when the input arrives out of order', () => {
    const days = groupByDateKey(
      [item('2026-08-25', 'C', 1), item('2026-08-12', 'A', 1), item('2026-08-19', 'B', 1)],
      today
    );
    expect(days.map((d) => d.dateKey)).toEqual(['2026-08-12', '2026-08-19', '2026-08-25']);
  });

  it('groups the real payload into 3 quá hạn · 2 hôm nay · 5 sắp tới', () => {
    const days = groupByDateKey(SCHEDULE_SAMPLE.items, SCHEDULE_SAMPLE.todayDateKey);
    const count = (predicate: (dateKey: string) => boolean): number =>
      days.filter((d) => predicate(d.dateKey)).reduce((sum, d) => sum + d.items.length, 0);

    expect(count((k) => k < SCHEDULE_SAMPLE.todayDateKey)).toBe(3);
    expect(count((k) => k === SCHEDULE_SAMPLE.todayDateKey)).toBe(2);
    expect(count((k) => k > SCHEDULE_SAMPLE.todayDateKey)).toBe(5);
  });
});
