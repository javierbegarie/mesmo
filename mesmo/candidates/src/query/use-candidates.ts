import { useQuery } from '@tanstack/react-query';

import type { Candidate } from '../util/types';

/** Shared query key so cache entries can be invalidated from anywhere. */
export const candidatesQueryKey = ['candidates'] as const;

// Placeholder data source. Swap for a real API call once the backend exists.
const MOCK_CANDIDATES: Candidate[] = [
  { id: '1', name: 'Ada Lovelace', role: 'Frontend Engineer', stage: 'interview' },
  { id: '2', name: 'Alan Turing', role: 'Platform Engineer', stage: 'screening' },
  { id: '3', name: 'Grace Hopper', role: 'Engineering Manager', stage: 'offer' },
  { id: '4', name: 'Katherine Johnson', role: 'Data Engineer', stage: 'applied' },
];

async function fetchCandidates(): Promise<Candidate[]> {
  // Simulate latency so loading states are exercised during development.
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_CANDIDATES;
}

/** Fetches the list of candidates via TanStack Query. */
export function useCandidates() {
  return useQuery({
    queryKey: candidatesQueryKey,
    queryFn: fetchCandidates,
  });
}
