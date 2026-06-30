import {
  CANDIDATES_BACKEND_STORAGE_KEY,
  useCandidatesBackendStore,
} from './candidates-backend';
import type { CandidateDetail } from '../util/types';

function detail(overrides: Partial<CandidateDetail> = {}): CandidateDetail {
  return {
    id: '1',
    name: 'Ada Lovelace',
    email: 'ada@analytical.engine',
    company: 'Analytical Engine',
    status: 'pending',
    submittedAt: '2025-01-01T00:00:00.000Z',
    username: 'ada',
    phone: '123',
    website: 'ada.dev',
    city: 'London',
    catchPhrase: 'First programmer',
    ...overrides,
  };
}

describe('candidates-backend store', () => {
  beforeEach(() => {
    localStorage.clear();
    useCandidatesBackendStore.setState({ candidates: [], seeded: false });
  });

  it('seeds only once', () => {
    const { seed } = useCandidatesBackendStore.getState();
    seed([detail({ id: '1' })]);
    seed([detail({ id: '2' }), detail({ id: '3' })]);

    const { candidates, seeded } = useCandidatesBackendStore.getState();
    expect(seeded).toBe(true);
    expect(candidates.map((c) => c.id)).toEqual(['1']);
  });

  it('applies an allowed status change', () => {
    const { seed, setStatus } = useCandidatesBackendStore.getState();
    seed([detail({ id: '1', status: 'pending' })]);

    expect(setStatus('1', 'approved')).toBe('applied');
    expect(useCandidatesBackendStore.getState().candidates[0].status).toBe(
      'approved',
    );
  });

  it('reports a conflict and re-syncs when the candidate changed elsewhere', () => {
    const { seed, setStatus } = useCandidatesBackendStore.getState();
    seed([detail({ id: '1', status: 'pending' })]);

    // Simulate another tab approving the candidate behind our back.
    localStorage.setItem(
      CANDIDATES_BACKEND_STORAGE_KEY,
      JSON.stringify({
        state: { candidates: [detail({ id: '1', status: 'approved' })], seeded: true },
        version: 0,
      }),
    );

    expect(setStatus('1', 'rejected')).toBe('conflict');
    // Our in-memory state is re-synced to the latest, not overwritten.
    expect(useCandidatesBackendStore.getState().candidates[0].status).toBe(
      'approved',
    );
  });
});
