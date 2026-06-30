import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

import { useClickOutside } from '../hooks/use-click-outside';

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onToggle: (value: string) => void;
  placeholder?: string;
}

/** Generic dropdown multiselect with checkbox-style options. */
export function MultiSelect({
  options,
  selected,
  onToggle,
  placeholder = 'Select…',
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  const summary =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? options.find((option) => option.value === selected[0])?.label
        : `${selected.length} selected`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 w-full min-w-44 items-center justify-between gap-2 rounded-md border bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <span className={selected.length === 0 ? 'text-muted-foreground' : ''}>
          {summary}
        </span>
        <ChevronDown className="size-4 shrink-0 opacity-50" />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-multiselectable="true"
          className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
        >
          {options.map((option) => {
            const isSelected = selected.includes(option.value);
            return (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onToggle(option.value)}
                  className="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <span>{option.label}</span>
                  {isSelected && <Check className="size-4" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
