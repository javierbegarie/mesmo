import { create } from 'zustand';

import type { CandidateStatus } from '../util/types';
import type { CandidateFilters } from '../util/filter-candidates';
import { urlSync } from './url-sync';

const STATUS_VALUES: CandidateStatus[] = ['pending', 'approved', 'rejected'];

function isStatus(value: string): value is CandidateStatus {
  return (STATUS_VALUES as string[]).includes(value);
}

interface FiltersStore extends CandidateFilters {
  setText: (text: string) => void;
  toggleStatus: (status: CandidateStatus) => void;
  clear: () => void;
}

export const useFiltersStore = create<FiltersStore>()(
  urlSync(
    (set) => ({
      text: '',
      statuses: [],
      setText: (text) => set({ text }),
      toggleStatus: (status) =>
        set((state) => ({
          statuses: state.statuses.includes(status)
            ? state.statuses.filter((value) => value !== status)
            : [...state.statuses, status],
        })),
      clear: () => set({ text: '', statuses: [] }),
    }),
    {
      read: (params) => {
        const next: Partial<FiltersStore> = {};
        const text = params.get('q');
        if (text) {
          next.text = text;
        }
        const statuses = params.getAll('status').filter(isStatus);
        if (statuses.length > 0) {
          next.statuses = statuses;
        }
        return next;
      },
      write: (state, params) => {
        if (state.text.trim()) {
          params.set('q', state.text);
        } else {
          params.delete('q');
        }
        params.delete('status');
        state.statuses.forEach((status) => params.append('status', status));
      },
    },
  ),
);
