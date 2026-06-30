import { useQuery } from '@tanstack/react-query';

import type { ApiUser, Candidate } from '../util/types';
import { toCandidate } from '../util/to-candidate';

/** Shared query key so cache entries can be invalidated from anywhere. */
export const candidatesQueryKey = ['candidates'] as const;

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

async function fetchCandidates(): Promise<Candidate[]> {
  const response = await fetch(USERS_URL);
  if (!response.ok) {
    throw new Error(`Failed to load candidates (${response.status})`);
  }

  const users = (await response.json()) as ApiUser[];
  return users.map(toCandidate);
}

/** Fetches the list of candidates via TanStack Query. */
export function useCandidates() {
  return useQuery({
    queryKey: candidatesQueryKey,
    queryFn: fetchCandidates,
  });
}
