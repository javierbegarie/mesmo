import { useQuery } from '@tanstack/react-query';

import type { ApiUser, CandidateDetail } from '../util/types';
import { toCandidateDetail } from '../util/to-candidate';

/** Shared query key so cache entries can be invalidated from anywhere. */
export const candidatesQueryKey = ['candidates'] as const;

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

async function fetchCandidates(): Promise<CandidateDetail[]> {
  const response = await fetch(USERS_URL);
  if (!response.ok) {
    throw new Error(`Failed to load candidates (${response.status})`);
  }

  const users = (await response.json()) as ApiUser[];
  return users.map(toCandidateDetail);
}

/**
 * Fetches the candidates from the API. This is used only to seed the
 * mock backend (see useCandidatesBackend), so it can be disabled once the
 * backend has data.
 */
export function useCandidates({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: candidatesQueryKey,
    queryFn: fetchCandidates,
    enabled,
  });
}
