import { Search } from 'lucide-react';

import { useFiltersStore } from '../store/filters-store';
import type { CandidateStatus } from '../util/types';
import { MultiSelect, type MultiSelectOption } from './multi-select';

const STATUS_OPTIONS: MultiSelectOption[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

/**
 * Filter bar for the candidates list. Each filter is a self-contained control
 * bound to the filters store — add another by dropping a new control here.
 */
export function CandidateFilters() {
  const text = useFiltersStore((state) => state.text);
  const statuses = useFiltersStore((state) => state.statuses);
  const setText = useFiltersStore((state) => state.setText);
  const toggleStatus = useFiltersStore((state) => state.toggleStatus);

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex flex-1 flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Search</span>
        <span className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Filter by name or email…"
            className="h-9 w-full rounded-md border bg-background pl-9 pr-3 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        </span>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Status</span>
        <MultiSelect
          options={STATUS_OPTIONS}
          selected={statuses}
          onToggle={(value) => toggleStatus(value as CandidateStatus)}
          placeholder="All statuses"
        />
      </label>
    </div>
  );
}
