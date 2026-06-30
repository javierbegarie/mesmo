import { useCandidatesBackend } from './use-candidates-backend';

/** Reads a single candidate from the mock backend (ensuring it's seeded). */
export function useCandidate(id: string) {
  const { candidates, isPending, isError } = useCandidatesBackend();

  return {
    candidate: candidates.find((candidate) => candidate.id === id),
    isPending,
    isError,
  };
}
