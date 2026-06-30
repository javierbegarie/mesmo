import type { Candidate, CandidateStatus } from '../util/types';

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

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
});

/** Compact summary card for a single candidate. */
export function CandidateCard({ candidate }: { candidate: Candidate }) {
  const submittedAt = new Date(candidate.submittedAt);

  return (
    <article className="flex items-start justify-between gap-4 rounded-lg border bg-card p-4">
      <div className="flex min-w-0 flex-col">
        <span className="font-medium">{candidate.name}</span>
        <a
          href={`mailto:${candidate.email}`}
          className="truncate text-sm text-muted-foreground hover:underline"
        >
          {candidate.email}
        </a>
        <span className="truncate text-sm text-muted-foreground">
          {candidate.company}
        </span>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_BADGE[candidate.status]}`}
        >
          {STATUS_LABELS[candidate.status]}
        </span>
        <time
          dateTime={candidate.submittedAt}
          className="text-xs text-muted-foreground"
        >
          {dateFormatter.format(submittedAt)}
        </time>
      </div>
    </article>
  );
}
