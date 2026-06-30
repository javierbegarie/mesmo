import { useMemo } from 'react';

import { useCandidates } from '../query/use-candidates';
import { useFiltersStore } from '../store/filters-store';
import { filterCandidates } from '../util/filter-candidates';

/**
 * Combines the fetched candidates with the active filter state and returns the
 * query result with `data` narrowed to the filtered list.
 */
export function useFilteredCandidates() {
  const query = useCandidates();
  const text = useFiltersStore((state) => state.text);
  const statuses = useFiltersStore((state) => state.statuses);

  const data = useMemo(
    () =>
      query.data ? filterCandidates(query.data, { text, statuses }) : undefined,
    [query.data, text, statuses],
  );

  return { ...query, data };
}
