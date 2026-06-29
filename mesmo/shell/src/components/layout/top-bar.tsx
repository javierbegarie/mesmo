import { Settings } from 'lucide-react';

import { BrandLogo } from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import { useClock } from '@/hooks/use-clock';
import { useSettingsStore } from '@/store/settings-store';

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

/** Shell top bar: branding, live clock, and a (future) settings entry point. */
export function TopBar() {
  const now = useClock();
  const toggleSettings = useSettingsStore((state) => state.toggleSettings);

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4">
      <BrandLogo />

      <div className="flex items-center gap-2">
        <time
          className="font-mono text-sm tabular-nums text-muted-foreground"
          dateTime={now.toISOString()}
        >
          {timeFormatter.format(now)}
        </time>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open settings"
          onClick={toggleSettings}
        >
          <Settings />
        </Button>
      </div>
    </header>
  );
}
