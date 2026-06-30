/** Domain types for the Candidates module. */

export type CandidateStatus = 'pending' | 'approved' | 'rejected';

/** A candidate as rendered in the list (API data + derived fields). */
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

/** A candidate with the extra fields shown on the detail view. */
export interface CandidateDetail extends Candidate {
  username: string;
  phone: string;
  website: string;
  city: string;
  catchPhrase: string;
}

/** A post authored by a candidate. */
export interface Post {
  id: number;
  title: string;
  body: string;
}

/** Shape of a user returned by jsonplaceholder.typicode.com/users (subset). */
export interface ApiUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    city: string;
  };
  company: {
    name: string;
    catchPhrase: string;
  };
}

/** Shape of a post returned by jsonplaceholder.typicode.com/posts. */
export interface ApiPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}
