import { Settings, Trash2 } from 'lucide-react';
import { useClickOutside } from '@mesmo/ui-kit';

import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/store/settings-store';

/**
 * Removes the app's persisted state (the mock backend lives under `mesmo.*`
 * keys) and reloads, so the candidates are re-seeded from the API. Handy for
 * the evaluator: inject a large dataset, then flush it back to the original.
 */
function clearSavedData() {
  Object.keys(localStorage)
    .filter((key) => key.startsWith('mesmo.'))
    .forEach((key) => localStorage.removeItem(key));
  window.location.reload();
}

/** Top-bar settings dropdown. */
export function SettingsMenu() {
  const isOpen = useSettingsStore((state) => state.isSettingsOpen);
  const toggle = useSettingsStore((state) => state.toggleSettings);
  const close = useSettingsStore((state) => state.closeSettings);
  const ref = useClickOutside<HTMLDivElement>(close);

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open settings"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={toggle}
      >
        <Settings />
      </Button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1 w-60 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
        >
          <button
            type="button"
            role="menuitem"
            onClick={clearSavedData}
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
          >
            <Trash2 className="size-4" />
            Clear saved data
          </button>
          <p className="px-2 py-1 text-xs text-muted-foreground">
            Flushes the mock backend and refetches candidates.
          </p>
        </div>
      )}
    </div>
  );
}
