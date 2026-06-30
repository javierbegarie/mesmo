/** Domain types for the Candidates module. */

export type CandidateStatus = 'pending' | 'approved' | 'rejected';

/** A candidate as rendered by the UI (API data + derived fields). */
export interface Candidate {
  id: string;
  name: string;
  email: string;
  company: string;
  /** Random but deterministic (seeded by id). */
  status: CandidateStatus;
  /** Random but deterministic ISO date (seeded by id). */
  submittedAt: string;
}

/** Shape of a user returned by jsonplaceholder.typicode.com/users (subset). */
export interface ApiUser {
  id: number;
  name: string;
  email: string;
  company: {
    name: string;
  };
}
