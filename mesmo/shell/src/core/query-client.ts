import { QueryClient } from '@tanstack/react-query';

/** Single shared TanStack Query client for the whole shell. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});
