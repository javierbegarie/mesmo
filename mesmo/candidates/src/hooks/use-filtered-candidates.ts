import { useMemo } from 'react';

import { useCandidatesBackend } from './use-candidates-backend';
import { useFiltersStore } from '../store/filters-store';
import { filterCandidates } from '../util/filter-candidates';

/**
 * Returns the backend candidates with the active filters applied, along with
 * the loading/error state of the initial seed.
 */
export function useFilteredCandidates() {
  const { candidates, isPending, isError } = useCandidatesBackend();
  const text = useFiltersStore((state) => state.text);
  const statuses = useFiltersStore((state) => state.statuses);

  const data = useMemo(
    () => filterCandidates(candidates, { text, statuses }),
    [candidates, text, statuses],
  );

  return { data, isPending, isError };
}
