import { Link } from '@tanstack/react-router';
import { Avatar } from '@mesmo/ui-kit';

import type { Candidate } from '../util/types';
import { CandidateStatusBadge } from './candidate-status-badge';

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
});

/** Compact summary card linking to a candidate's detail view. */
export function CandidateCard({ candidate }: { candidate: Candidate }) {
  return (
    <Link
      to={`/candidates/${candidate.id}`}
      className="flex items-start justify-between gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
    >
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={candidate.name} />
        <div className="flex min-w-0 flex-col">
          <span className="font-medium">{candidate.name}</span>
          <span className="truncate text-sm text-muted-foreground">
            {candidate.email}
          </span>
          <span className="truncate text-sm text-muted-foreground">
            {candidate.company}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <CandidateStatusBadge status={candidate.status} />
        <time
          dateTime={candidate.submittedAt}
          className="text-xs text-muted-foreground"
        >
          {dateFormatter.format(new Date(candidate.submittedAt))}
        </time>
      </div>
    </Link>
  );
}
