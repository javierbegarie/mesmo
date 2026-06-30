import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { useClickOutside } from '../hooks/use-click-outside';

export interface DropdownItem {
  label: string;
  value: string;
}

interface DropdownProps {
  items: DropdownItem[];
  onSelect: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  /** Shown on the trigger when disabled (or when there are no items). */
  disabledPlaceholder?: string;
}

/**
 * Generic single-select action dropdown. Picking an item fires `onSelect` and
 * closes the menu. With no items (or `disabled`), the trigger is disabled and
 * shows `disabledPlaceholder`.
 */
export function Dropdown({
  items,
  onSelect,
  placeholder,
  disabled = false,
  disabledPlaceholder,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  const isDisabled = disabled || items.length === 0;
  const label = isDisabled ? (disabledPlaceholder ?? placeholder) : placeholder;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={isDisabled}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 min-w-40 items-center justify-between gap-2 rounded-md border bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={isDisabled ? 'text-muted-foreground' : ''}>
          {label}
        </span>
        <ChevronDown className="size-4 shrink-0 opacity-50" />
      </button>

      {open && !isDisabled && (
        <ul
          role="menu"
          className="absolute right-0 z-10 mt-1 min-w-40 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
        >
          {items.map((item) => (
            <li key={item.value}>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelect(item.value);
                  setOpen(false);
                }}
                className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
