import { APP_NAME, APP_TAGLINE } from '@/util/constants';

/** Minimal shell footer. */
export function Footer() {
  return (
    <footer className="flex h-10 items-center justify-between border-t bg-card px-4 text-xs text-muted-foreground">
      <span>
        {APP_NAME} · {APP_TAGLINE}
      </span>
      <span>© {new Date().getFullYear()}</span>
    </footer>
  );
}
