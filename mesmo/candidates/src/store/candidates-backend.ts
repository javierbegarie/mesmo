import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { CandidateDetail, CandidateStatus } from '../util/types';
import { getAllowedTransitions } from '../util/status-machine';

/** Key under which the persisted backend lives (shared with the storage sync). */
export const CANDIDATES_BACKEND_STORAGE_KEY = 'mesmo.candidates-backend';

export type SetStatusResult = 'applied' | 'conflict';

/**
 * Reads the freshest persisted candidates straight from localStorage. This lets
 * us notice a change made by another tab before applying our own.
 */
function readPersistedCandidates(): CandidateDetail[] | null {
  try {
    const raw = localStorage.getItem(CANDIDATES_BACKEND_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      state?: { candidates?: CandidateDetail[] };
    };
    return parsed.state?.candidates ?? null;
  } catch {
    return null;
  }
}

/**
 * Stands in for a writable backend. Seeded once from the candidates fetch and
 * persisted to localStorage, so status changes survive reloads. Status updates
 * are validated against the state machine — the same rule the UI enforces.
 */
interface CandidatesBackendState {
  candidates: CandidateDetail[];
  seeded: boolean;
  /** Populate the backend from fetched data — only the first time. */
  seed: (candidates: CandidateDetail[]) => void;
  /**
   * Applies a status change against the freshest data. If the candidate was
   * already moved (e.g. from another tab), it reports a conflict and re-syncs
   * to that latest state instead of overwriting it.
   */
  setStatus: (id: string, status: CandidateStatus) => SetStatusResult;
}

export const useCandidatesBackendStore = create<CandidatesBackendState>()(
  persist(
    (set, get) => ({
      candidates: [],
      seeded: false,
      seed: (candidates) => {
        if (get().seeded) return;
        set({ candidates, seeded: true });
      },
      setStatus: (id, status) => {
        const latest = readPersistedCandidates() ?? get().candidates;
        const candidate = latest.find((entry) => entry.id === id);

        if (!candidate || !getAllowedTransitions(candidate).includes(status)) {
          // Sync to the latest known state so the UI reflects reality.
          set({ candidates: latest });
          return 'conflict';
        }

        set({
          candidates: latest.map((entry) =>
            entry.id === id ? { ...entry, status } : entry,
          ),
        });
        return 'applied';
      },
    }),
    {
      name: CANDIDATES_BACKEND_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
