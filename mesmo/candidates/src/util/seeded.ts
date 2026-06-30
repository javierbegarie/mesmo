import type { CandidateStatus } from './types';

const STATUSES: CandidateStatus[] = ['pending', 'approved', 'rejected'];

// Fixed window for generated submission dates so values never drift over time.
const SUBMISSION_START = Date.UTC(2025, 0, 1); // 2025-01-01
const SUBMISSION_END = Date.UTC(2025, 11, 31); // 2025-12-31

/**
 * mulberry32 — a tiny deterministic PRNG. The same seed always produces the
 * same sequence, which is what lets us derive stable values from a candidate id.
 */
function mulberry32(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface DerivedCandidateFields {
  status: CandidateStatus;
  submittedAt: string;
}

/**
 * Derive a stable status and submission date from a candidate id. Seeding the
 * PRNG with the id guarantees the same candidate always gets the same values.
 */
export function deriveFromId(id: number): DerivedCandidateFields {
  const random = mulberry32(id);
  const status = STATUSES[Math.floor(random() * STATUSES.length)];
  const submittedAt = new Date(
    SUBMISSION_START + random() * (SUBMISSION_END - SUBMISSION_START),
  ).toISOString();

  return { status, submittedAt };
}
