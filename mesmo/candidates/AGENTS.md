# `@mesmo/candidates` — `type:module`

The Candidates feature: list, filters, detail + posts, and status updates.
Read the repo-root `AGENTS.md` first. May import `@mesmo/ui-kit`; must **not** import the shell.

## Structure

- `pages/` — `candidates-page` (list), `candidate-detail-page` (`/candidates/:id`, with posts).
- `query/` — `use-candidates` (fetch used only to **seed** the backend), `use-candidate-posts`.
- `store/` — `candidates-backend` (mock backend, **source of truth**, persisted to localStorage), `filters-store` + `url-sync` (filters synced to the URL).
- `hooks/` — `use-candidates-backend` (seeds + reads the store), `use-candidate`, `use-filtered-candidates`.
- `components/` — `candidate-card`, `candidate-filters`, `candidate-status-badge`, `candidate-status-dropdown`.
- `util/` — `types`, `seeded` (deterministic status/date from id), `to-candidate`, `status` (labels), `status-machine` (allowed transitions), `filter-candidates` (pure filter), `paginate` (client-side pagination, `CANDIDATES_PAGE_SIZE`).

## Rules

- Read candidates from the **backend store via the hooks**, not from the query directly (the query only seeds the store once).
- Add or change allowed status transitions in `util/status-machine.ts`; never hardcode them in components.
- Keep filter state shareable — route it through `store/filters-store.ts` (URL-synced).
- Derived fields (status, submission date) come from `util/seeded.ts`; map raw users with `util/to-candidate.ts`.
- If a new component is agnostic/reusable, put it in `@mesmo/ui-kit`, not here.
