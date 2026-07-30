import { createPlanSchema } from '../schemas/plan.schema';

const VN_OFFSET_MS = 7 * 60 * 60 * 1000;

/** Builds the ISO string a browser in Vietnam sends for local midnight of `daysFromToday`. */
function vnLocalMidnightIso(daysFromToday: number): string {
  const nowVn = new Date(Date.now() + VN_OFFSET_MS);
  const vnMidnightUtc = Date.UTC(
    nowVn.getUTCFullYear(),
    nowVn.getUTCMonth(),
    nowVn.getUTCDate() + daysFromToday
  );
  return new Date(vnMidnightUtc - VN_OFFSET_MS).toISOString();
}

describe('createPlanSchema deadline', () => {
  const base = { name: 'Test plan' };

  it('accepts a deadline of today (Vietnam local midnight), matching the client-allowed choice', () => {
    expect(() =>
      createPlanSchema.parse({ ...base, deadline: vnLocalMidnightIso(0) })
    ).not.toThrow();
  });

  it('accepts a deadline in the future', () => {
    expect(() =>
      createPlanSchema.parse({ ...base, deadline: vnLocalMidnightIso(5) })
    ).not.toThrow();
  });

  it('rejects a deadline of yesterday', () => {
    expect(() => createPlanSchema.parse({ ...base, deadline: vnLocalMidnightIso(-1) })).toThrow(
      /future date/
    );
  });

  it('rejects an invalid date string', () => {
    expect(() => createPlanSchema.parse({ ...base, deadline: 'not-a-date' })).toThrow();
  });

  it('rejects an empty deadline', () => {
    expect(() => createPlanSchema.parse({ ...base, deadline: '' })).toThrow(/required/);
  });
});
