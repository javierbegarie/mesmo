/** How many candidates are shown per page. */
export const CANDIDATES_PAGE_SIZE = 30;

export interface Paginated<T> {
  items: T[];
  /** The (clamped) 1-based current page. */
  page: number;
  /** Total number of pages (always >= 1). */
  pageCount: number;
}

/** Pure client-side pagination: slices `items` for the requested page. */
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number = CANDIDATES_PAGE_SIZE,
): Paginated<T> {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, page), pageCount);
  const start = (current - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: current,
    pageCount,
  };
}
