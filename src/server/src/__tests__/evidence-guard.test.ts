import { sanitizeEvidence } from '../utils/evidence-guard';

// Cases spec'd by the co-planning session from the spike S0 findings. Every marker added to
// UNCERTAINTY_MARKERS must gain a case here — that is the guarantee the list stays phrase-level.
describe('sanitizeEvidence — deterministic INV-2 + enum backstop (spike S0)', () => {
  it('1. spike case: probed-then-still-unsure → downgraded, not punished', () => {
    const result = sanitizeEvidence({
      status: 'contradicted',
      quote: '…2 mũ m gì đó, quên phải trừ mấy…|…không chắc nữa',
    });
    expect(result).toEqual({ kind: 'downgraded' });
  });

  it('2. a demonstrated misconception is kept as contradicted', () => {
    const result = sanitizeEvidence({
      status: 'contradicted',
      quote: 'Lớp B octet đầu 192 tới 223',
    });
    expect(result).toEqual({ kind: 'kept', status: 'contradicted' });
  });

  it('3. a confident assertion is kept — "chắc chắn" must not match the marker "chắc là"', () => {
    const result = sanitizeEvidence({ status: 'covered', quote: 'chắc chắn là 2 mũ m trừ 2' });
    expect(result).toEqual({ kind: 'kept', status: 'covered' });
  });

  it('4. symmetric: a covered fire with an uncertain quote is downgraded too', () => {
    const result = sanitizeEvidence({
      status: 'covered',
      quote: 'hình như 2 mũ m gì đó, không chắc',
    });
    expect(result).toEqual({ kind: 'downgraded' });
  });

  it('5. one-directional: kept preserves status exactly; never upgrades, never flips', () => {
    const inputs = [
      { status: 'covered', quote: 'đúng rồi, hai octet đầu là mạng' },
      { status: 'contradicted', quote: 'lớp B là 192 tới 223' },
      { status: 'covered', quote: 'không nhớ' },
      { status: 'contradicted', quote: 'hình như vậy' },
      { status: 'Running', quote: 'bất kỳ' },
      { status: 'covered' },
    ];
    for (const fire of inputs) {
      const result = sanitizeEvidence(fire);
      if (result.kind === 'kept') {
        expect(result.status).toBe(fire.status); // covered stays covered, contradicted stays contradicted
      } else {
        expect(['downgraded', 'dropped']).toContain(result.kind);
      }
    }
  });

  it('6. enum-drop runs before the quote check: a status outside the enum is dropped', () => {
    const result = sanitizeEvidence({ status: 'Running', quote: 'một câu hoàn toàn hợp lệ' });
    expect(result).toEqual({ kind: 'dropped' });
  });

  it('a missing quote is treated as empty, never a crash', () => {
    expect(sanitizeEvidence({ status: 'covered' })).toEqual({ kind: 'kept', status: 'covered' });
    expect(sanitizeEvidence({ status: 'covered', quote: null })).toEqual({
      kind: 'kept',
      status: 'covered',
    });
  });
});
