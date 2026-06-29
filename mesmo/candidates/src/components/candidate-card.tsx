import type { Candidate } from '../util/types';

const STAGE_LABELS: Record<Candidate['stage'], string> = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected',
};

/** Compact summary card for a single candidate. */
export function CandidateCard({ candidate }: { candidate: Candidate }) {
  return (
    <article className="flex items-center justify-between rounded-lg border bg-card p-4">
      <div className="flex flex-col">
        <span className="font-medium">{candidate.name}</span>
        <span className="text-sm text-muted-foreground">{candidate.role}</span>
      </div>
      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
        {STAGE_LABELS[candidate.stage]}
      </span>
    </article>
  );
}
