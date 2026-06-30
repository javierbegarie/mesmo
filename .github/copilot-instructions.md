# Copilot instructions — Mesmo

Mesmo is an Nx monorepo (React 19 + TS strict · TanStack Router/Query · Tailwind v4 · shadcn/ui · Zustand · Vite · Vitest). **Read `AGENTS.md` at the repo root for the full conventions**; per-project details are in `mesmo/<project>/AGENTS.md`.

Key rules:

- Projects under `mesmo/`: `mesmo` (shell, `type:app`), `@mesmo/candidates` (`type:module`), `@mesmo/ui-kit` (`type:library`). Allowed import order: **library → module → app** (enforced by ESLint).
- Agnostic/reusable components → `@mesmo/ui-kit`; candidate-specific code → `@mesmo/candidates`; routing/providers → the shell.
- Every project follows the folder convention: `core/ pages/ query/ components/ hooks/ store/ util/`. Tests are colocated `*.spec.ts(x)`.
- Candidate data is the mock backend store (Zustand + localStorage); the fetch only seeds it. Status/date are derived from the candidate id. Status transitions come from the state-machine map. Filters sync to the URL.
- A Zustand store shared across projects must be a `Symbol.for(...)` global singleton.
- Verify with `npx nx run-many -t typecheck lint test`; after cross-project imports run `npx nx sync`.
