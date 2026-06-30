import type { Candidate, CandidateStatus } from './types';

/**
 * The statuses a candidate can move to from a given status. Either a static
 * list, or a function of the candidate for cases that need more logic — so we
 * can grow the rules without a refactor.
 */
export type CandidateStatusResolution =
  | CandidateStatus[]
  | ((candidate: Candidate) => CandidateStatus[]);

/**
 * Maps each origin status to its allowed next statuses. Statuses absent from
 * the map (e.g. approved/rejected) are terminal — no further moves.
 */
export const candidateStatusMachine = new Map<
  CandidateStatus,
  CandidateStatusResolution
>([['pending', ['approved', 'rejected']]]);

/**
 * Resolves the statuses `candidate` may transition to. The machine is a
 * parameter (defaulting to the real one) so the logic stays easy to test.
 */
export function getAllowedTransitions(
  candidate: Candidate,
  machine: Map<
    CandidateStatus,
    CandidateStatusResolution
  > = candidateStatusMachine,
): CandidateStatus[] {
  const resolution = machine.get(candidate.status);
  if (!resolution) return [];
  return typeof resolution === 'function' ? resolution(candidate) : resolution;
}
