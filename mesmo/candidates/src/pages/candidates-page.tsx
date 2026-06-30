import { useEffect, useState } from 'react';
import { Pagination } from '@mesmo/ui-kit';

import { CandidateCard } from '../components/candidate-card';
import { CandidateFilters } from '../components/candidate-filters';
import { useFilteredCandidates } from '../hooks/use-filtered-candidates';
import { useFiltersStore } from '../store/filters-store';
import { paginate } from '../util/paginate';

/** Full-page view for the Candidates module — the shell's default view. */
export function CandidatesPage() {
  const { data: candidates, isPending, isError } = useFilteredCandidates();

  const [page, setPage] = useState(1);
  const text = useFiltersStore((state) => state.text);
  const statuses = useFiltersStore((state) => state.statuses);

  // Reset to the first page whenever the filters change the result set.
  useEffect(() => setPage(1), [text, statuses]);

  const {
    items: visible,
    page: currentPage,
    pageCount,
  } = paginate(candidates, page);

  return (
    <section className="mx-auto flex min-h-full w-full max-w-3xl flex-col p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Candidates</h1>
        <p className="text-sm text-muted-foreground">
          People currently in the selection process.
        </p>
      </header>

      <div className="mb-6">
        <CandidateFilters />
      </div>

      {isPending && (
        <p className="text-sm text-muted-foreground">Loading candidates…</p>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          Something went wrong loading candidates.
        </p>
      )}

      {!isPending && !isError && candidates.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No candidates match the current filters.
        </p>
      )}

      {visible.length > 0 && (
        <ul className="flex flex-col gap-3">
          {visible.map((candidate) => (
            <li key={candidate.id}>
              <CandidateCard candidate={candidate} />
            </li>
          ))}
        </ul>
      )}

      {pageCount > 1 && (
        <div className="sticky bottom-0 -mx-6 mt-auto border-t bg-background/95 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        </div>
      )}
    </section>
  );
}

export default CandidatesPage;
