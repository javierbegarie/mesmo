# `mesmo` (shell) — `type:app`

The host application: chrome + routing + global providers. It mounts feature modules.
Read the repo-root `AGENTS.md` first for workspace-wide conventions.

## Structure

- `core/router.tsx` — **code-based** TanStack Router. Root route renders `AppShell` (chrome); child routes render module pages through `<Outlet/>`. The router's `Register` augmentation lives here.
- `core/query-client.ts`, `core/providers.tsx` — TanStack Query client + app-wide providers.
- `components/layout/` — `AppShell` (`TopBar` + scrollable `<main>` + pinned `Footer` + `<Toaster/>`), `TopBar`, `Footer`.
- `components/ui/` — shadcn primitives (managed by `components.json`); `brand-logo.tsx`.
- `hooks/` `use-clock` · `store/` `settings-store` · `util/` `constants` + `utils` (`cn`) · `pages/` `not-found-page`.
- `src/styles.css` — Tailwind v4 globals, shadcn tokens, and the `@source` lines that register module/library sources.

## Rules

- **Register a new module route** in `core/router.tsx`: import the module's page from its package, `createRoute({ getParentRoute: () => rootRoute, path, component })`, and add it to `rootRoute.addChildren([...])`.
- The 404 page is the router's `defaultNotFoundComponent` (`pages/not-found-page.tsx`).
- Add shadcn components with the shadcn CLI; aliases in `components.json` map `cn` → `@/util/utils` and ui → `@/components/ui`.
- The shell may import `@mesmo/candidates` and `@mesmo/ui-kit`. When you add a Tailwind-using project, add an `@source` line to `styles.css`.
