import { useEffect } from 'react';

import { useCandidates } from '../query/use-candidates';
import {
  CANDIDATES_BACKEND_STORAGE_KEY,
  useCandidatesBackendStore,
} from '../store/candidates-backend';

/**
 * Bridges the API fetch and the mock backend: it seeds the store the first time
 * (when localStorage is empty) and skips the network entirely once seeded.
 * Components read candidates from here, not from the query directly.
 */
export function useCandidatesBackend() {
  const seeded = useCandidatesBackendStore((state) => state.seeded);
  const candidates = useCandidatesBackendStore((state) => state.candidates);
  const seed = useCandidatesBackendStore((state) => state.seed);

  const query = useCandidates({ enabled: !seeded });

  useEffect(() => {
    if (!seeded && query.data) {
      seed(query.data);
    }
  }, [seeded, query.data, seed]);

  // Keep tabs in sync: when another tab persists a change, re-read it here.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === CANDIDATES_BACKEND_STORAGE_KEY) {
        useCandidatesBackendStore.persist.rehydrate();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return {
    candidates,
    isPending: !seeded && query.isPending,
    isError: query.isError,
  };
}
