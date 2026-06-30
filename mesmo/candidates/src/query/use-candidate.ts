import { useQuery } from '@tanstack/react-query';

import type { ApiUser, CandidateDetail } from '../util/types';
import { toCandidate } from '../util/to-candidate';

export const candidateQueryKey = (id: string) => ['candidate', id] as const;

const USER_URL = (id: string) =>
  `https://jsonplaceholder.typicode.com/users/${id}`;

async function fetchCandidate(id: string): Promise<CandidateDetail> {
  const response = await fetch(USER_URL(id));
  if (!response.ok) {
    throw new Error(`Failed to load candidate ${id} (${response.status})`);
  }

  const user = (await response.json()) as ApiUser;
  return {
    ...toCandidate(user),
    username: user.username,
    phone: user.phone,
    website: user.website,
    city: user.address.city,
    catchPhrase: user.company.catchPhrase,
  };
}

/** Fetches a single candidate's full details via TanStack Query. */
export function useCandidate(id: string) {
  return useQuery({
    queryKey: candidateQueryKey(id),
    queryFn: () => fetchCandidate(id),
  });
}
