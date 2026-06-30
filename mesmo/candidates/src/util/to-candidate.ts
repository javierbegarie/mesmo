import type { ApiUser, CandidateDetail } from './types';
import { deriveFromId } from './seeded';

/** Maps a raw API user to a full candidate record (used to seed the backend). */
export function toCandidateDetail(user: ApiUser): CandidateDetail {
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    company: user.company.name,
    username: user.username,
    phone: user.phone,
    website: user.website,
    city: user.address.city,
    catchPhrase: user.company.catchPhrase,
    // Status and submission date aren't provided by the API, so we derive them
    // deterministically from the user's id (see deriveFromId).
    ...deriveFromId(user.id),
  };
}
