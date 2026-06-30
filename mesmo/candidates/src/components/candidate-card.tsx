import { Link } from '@tanstack/react-router';
import { Avatar } from '@mesmo/ui-kit';

import type { Candidate } from '../util/types';
import { CandidateStatusBadge } from './candidate-status-badge';
import { CandidateStatusDropdown } from './candidate-status-dropdown';

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
});

/** Summary row: a link to the detail view plus the status changer. */
export function CandidateCard({ candidate }: { candidate: Candidate }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border bg-card p-4">
      <Link
        to={`/candidates/${candidate.id}`}
        className="flex min-w-0 flex-1 items-center gap-3 transition-opacity hover:opacity-70"
      >
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
      </Link>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <div className="flex flex-col items-end gap-1">
          <CandidateStatusBadge status={candidate.status} />
          <time
            dateTime={candidate.submittedAt}
            className="text-xs text-muted-foreground"
          >
            {dateFormatter.format(new Date(candidate.submittedAt))}
          </time>
        </div>
        <CandidateStatusDropdown candidate={candidate} />
      </div>
    </div>
  );
}
