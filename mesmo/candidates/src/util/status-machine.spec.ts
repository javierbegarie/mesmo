import {
  getAllowedTransitions,
  type CandidateStatusResolution,
} from './status-machine';
import type { Candidate, CandidateStatus } from './types';

function candidate(overrides: Partial<Candidate> = {}): Candidate {
  return {
    id: '1',
    name: 'Ada Lovelace',
    email: 'ada@analytical.engine',
    company: 'Analytical Engine',
    status: 'pending',
    submittedAt: '2025-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('getAllowedTransitions', () => {
  it('allows pending to move to approved or rejected', () => {
    expect(getAllowedTransitions(candidate({ status: 'pending' }))).toEqual([
      'approved',
      'rejected',
    ]);
  });

  it('treats approved and rejected as terminal', () => {
    expect(getAllowedTransitions(candidate({ status: 'approved' }))).toEqual([]);
    expect(getAllowedTransitions(candidate({ status: 'rejected' }))).toEqual([]);
  });

  it('supports a function resolution that depends on the candidate', () => {
    const machine = new Map<CandidateStatus, CandidateStatusResolution>([
      [
        'pending',
        (c) => (c.email.includes('vip') ? ['approved'] : ['rejected']),
      ],
    ]);

    expect(
      getAllowedTransitions(candidate({ email: 'vip@corp.io' }), machine),
    ).toEqual(['approved']);
    expect(
      getAllowedTransitions(candidate({ email: 'jo@corp.io' }), machine),
    ).toEqual(['rejected']);
  });
});
