import type { Candidate, CandidateStatus } from './types';

export interface CandidateFilters {
  /** Free text matched against name and email (case-insensitive). */
  text: string;
  /** Selected statuses; empty means "all statuses". */
  statuses: CandidateStatus[];
}

/** Pure, side-effect-free filtering so it stays trivial to unit test. */
export function filterCandidates(
  candidates: Candidate[],
  filters: CandidateFilters,
): Candidate[] {
  const text = filters.text.trim().toLowerCase();

  return candidates.filter((candidate) => {
    const matchesText =
      text === '' ||
      candidate.name.toLowerCase().includes(text) ||
      candidate.email.toLowerCase().includes(text);

    const matchesStatus =
      filters.statuses.length === 0 ||
      filters.statuses.includes(candidate.status);

    return matchesText && matchesStatus;
  });
}
