import { Link } from '@tanstack/react-router';

/** Shown for any URL that doesn't match a route. */
export function NotFoundPage() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 p-16 text-center">
      <p className="text-5xl font-semibold tracking-tight">404</p>
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="text-sm text-muted-foreground">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <Link to="/" className="mt-2 text-sm font-medium underline">
        Back to candidates
      </Link>
    </section>
  );
}
