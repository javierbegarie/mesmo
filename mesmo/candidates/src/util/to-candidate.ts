import type { ApiUser, Candidate } from './types';
import { deriveFromId } from './seeded';

/** Maps a raw API user to the minimal Candidate used across the module. */
export function toCandidate(user: ApiUser): Candidate {
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    company: user.company.name,
    // Status and submission date aren't provided by the API, so we derive them
    // deterministically from the user's id (see deriveFromId).
    ...deriveFromId(user.id),
  };
}
