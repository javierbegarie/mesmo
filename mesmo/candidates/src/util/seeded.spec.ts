import { deriveFromId } from './seeded';

describe('deriveFromId', () => {
  it('is deterministic — the same id always yields the same values', () => {
    expect(deriveFromId(1)).toEqual(deriveFromId(1));
    expect(deriveFromId(42)).toEqual(deriveFromId(42));
  });

  it('produces different values for different ids', () => {
    expect(deriveFromId(1)).not.toEqual(deriveFromId(2));
  });

  it('returns a valid status and an ISO submission date', () => {
    const { status, submittedAt } = deriveFromId(7);

    expect(['pending', 'approved', 'rejected']).toContain(status);
    expect(Number.isNaN(Date.parse(submittedAt))).toBe(false);
  });
});
