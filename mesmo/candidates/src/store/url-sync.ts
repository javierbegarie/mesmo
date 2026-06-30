import type { StateCreator } from 'zustand';

export interface UrlSyncOptions<T> {
  /** Build the slice of state that lives in the URL on initial load. */
  read: (params: URLSearchParams) => Partial<T>;
  /** Mutate `params` to reflect the current state (set/delete owned keys). */
  write: (state: T, params: URLSearchParams) => void;
}

/**
 * Zustand middleware that keeps a store in sync with the URL query string:
 * it hydrates the initial state from the current URL and, on every change,
 * writes the relevant keys back using `history.replaceState` (so filtering
 * never pollutes the browser history).
 */
export function urlSync<T>(
  initializer: StateCreator<T, [], []>,
  { read, write }: UrlSyncOptions<T>,
): StateCreator<T, [], []> {
  return (set, get, api) => {
    const state = initializer(set, get, api);

    if (typeof window === 'undefined') {
      return state;
    }

    // Hydrate from the URL present when the store is created.
    Object.assign(
      state as object,
      read(new URLSearchParams(window.location.search)),
    );

    // Push subsequent changes back to the URL.
    api.subscribe(() => {
      const params = new URLSearchParams(window.location.search);
      write(get(), params);
      const query = params.toString();
      const url = `${window.location.pathname}${query ? `?${query}` : ''}`;
      window.history.replaceState(window.history.state, '', url);
    });

    return state;
  };
}
