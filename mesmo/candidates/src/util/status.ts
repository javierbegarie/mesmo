import type { CandidateStatus } from './types';

/** Human-readable labels for each status, shared across the module. */
export const STATUS_LABELS: Record<CandidateStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};
