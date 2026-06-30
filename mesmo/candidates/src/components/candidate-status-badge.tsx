import type { CandidateStatus } from '../util/types';

const STATUS_LABELS: Record<CandidateStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

// Semantic colours per status. Plain Tailwind palette utilities keep the badge
// readable in both light and dark themes.
const STATUS_BADGE: Record<CandidateStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  approved:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
};

/** Coloured pill conveying a candidate's status. */
export function CandidateStatusBadge({ status }: { status: CandidateStatus }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_BADGE[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
