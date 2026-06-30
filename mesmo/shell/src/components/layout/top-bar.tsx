import { BrandLogo } from '@/components/brand-logo';
import { SettingsMenu } from '@/components/layout/settings-menu';
import { useClock } from '@/hooks/use-clock';

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

/** Shell top bar: branding, live clock, and the settings menu. */
export function TopBar() {
  const now = useClock();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-4">
      <BrandLogo />

      <div className="flex items-center gap-2">
        <time
          className="font-mono text-sm tabular-nums text-muted-foreground"
          dateTime={now.toISOString()}
        >
          {timeFormatter.format(now)}
        </time>
        <SettingsMenu />
      </div>
    </header>
  );
}
