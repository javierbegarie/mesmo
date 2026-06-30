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
    <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
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

      <div className="flex shrink-0 flex-col items-center gap-0.5">
        <CandidateStatusBadge status={candidate.status} />
        <time
          dateTime={candidate.submittedAt}
          className="text-xs text-muted-foreground"
        >
          {dateFormatter.format(new Date(candidate.submittedAt))}
        </time>
      </div>

      <div className="flex shrink-1 flex-col items-end basis-4/12">
        <CandidateStatusDropdown candidate={candidate} />
      </div>
    </div>
  );
}
