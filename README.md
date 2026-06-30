# Mesmo

> **Mesmo: Porque não é o contrário.**

A small **selection-process** app: browse candidates, filter them, open a candidate's
detail with their posts, and move each one through the pipeline
(`pending → approved | rejected`).

Built as an **Nx** monorepo with **React 19**, **TanStack Router**, **TanStack Query**,
**Tailwind v4**, **shadcn/ui** and **Zustand**. The backend is read-only
([jsonplaceholder](https://jsonplaceholder.typicode.com)), so status changes are
persisted client-side in a mock backend (Zustand + `localStorage`).

## Getting started (from zero)

```bash
npm install      # install dependencies
npm run dev      # start the shell app on http://localhost:4200
```

`npm run dev` runs the `mesmo` shell, which mounts the Candidates module at `/`.

## Commands of interest

```bash
# Run the whole workspace (all projects)
npx nx run-many -t typecheck lint test      # verify everything
npx nx run-many -t build                     # build everything

# A single project (mesmo | @mesmo/candidates | @mesmo/ui-kit)
npx nx test @mesmo/ui-kit                     # unit tests for the ui-kit
npx nx lint @mesmo/candidates                 # lint one project
npx nx build mesmo                            # production build of the shell

# Only what your change affects (great for CI)
npx nx affected -t test lint

# Explore the workspace
npx nx graph                                  # interactive dependency graph
npx nx show project mesmo                     # a project's targets & metadata
npx nx sync                                   # refresh TS project references

# Convenience scripts (package.json) — all scoped to the shell
npm run build | npm run test | npm run lint | npm run format
```

## Why Nx

Nx gives a small app the structure to grow into a large one **without** a rewrite:

- **Solid, enforced structure.** Projects are tagged (`type:app | type:module | type:library`)
  and a single ESLint rule enforces the allowed dependency direction
  (`type:library → type:module → type:app`). The architecture is checked by the
  linter, not by convention or code review.
- **Scalability.** Each feature is its own project (today a library, tomorrow a
  micro-frontend) with clear inputs/outputs. The project graph plus
  `nx affected` means CI only rebuilds/retests what actually changed, so the
  pipeline stays fast as the codebase grows.
- **Maintainability.** One consistent CLI for every task (`build`, `test`, `lint`,
  `typecheck`), generators that scaffold projects the same way every time, and
  task caching that keeps local/CI runs cheap.
- **AI readiness.** Nx ships agent-facing context out of the box — `AGENTS.md` /
  `CLAUDE.md`, an MCP server, and skills — so coding agents can query the project
  graph, find the right generator, and respect module boundaries instead of
  guessing. The same metadata that helps humans navigate the repo helps agents
  do the same.

## Projects

All projects live under `mesmo/` and are consumed **as source** (each exports
`src/index.ts`), so there's no build step between them in dev.

| Project            | Tags                            | Role                              |
| ------------------ | ------------------------------- | --------------------------------- |
| `mesmo` (shell)    | `scope:shell`, `type:app`       | Host application / chrome         |
| `@mesmo/candidates`| `scope:candidates`, `type:module` | The Candidates feature module   |
| `@mesmo/ui-kit`    | `scope:components`, `type:library`| Agnostic, reusable UI            |

**`mesmo` — the shell (`type:app`).** The host that holds every module. Top bar
(branding + live clock + a stubbed settings gear), a pinned footer, the TanStack
Query provider, the app-wide `<Toaster/>`, and the router.
_Decisions:_ **code-based** TanStack Router (no codegen) where modules mount through
an `<Outlet/>`; the shell owns Tailwind/shadcn setup and the `404` page.

**`@mesmo/candidates` — the feature module (`type:module`).** Everything candidate-related:
list + filters, detail view + posts, and status transitions.
_Decisions:_ a **mock backend** (`Zustand` + `persist`/localStorage) seeded once from
the fetch is the source of truth for mutable data; filters live in a Zustand store
synced to the **URL** via a small custom middleware; the status/submission-date are
**deterministically derived from the candidate id**; allowed transitions come from a
typed **state machine** map (array _or_ `(candidate) => statuses[]`) to avoid
hardcoding the flow.

**`@mesmo/ui-kit` — the design library (`type:library`).** Self-contained components
with no app knowledge: `MultiSelect`, `Dropdown`, `Avatar`, `Pagination`, `Toaster`
(+ `toast`), and the `useClickOutside` hook.
_Decisions:_ kept framework/domain-agnostic so any project can reuse them; the toast
store is a `Symbol.for(...)` **global singleton** so a single `<Toaster/>` works even
though the library is consumed as source across projects.

## Mock backend & resetting data

There's no real backend, so writes (status changes) are persisted in a **Zustand +
`localStorage`** store under the key **`mesmo.candidates-backend`**. The API fetch
only **seeds** this store the first time; after that, the store is the source of
truth and the network call is skipped.

**Resetting:** the **gear menu** in the top bar has a **"Clear saved data"** action
that removes the `mesmo.*` keys and reloads, which re-seeds the candidates from the
API. Use it to get back to the original 10 users.

**Trying pagination with a large dataset:** because there are only 10 users, the
paginator stays hidden (it appears at 2+ pages, 30 per page). To exercise it, you can
seed a bigger dataset by hand — e.g. in the browser console, set
`mesmo.candidates-backend` to a `{ "state": { "candidates": [ …2000 items… ], "seeded": true }, "version": 0 }`
payload and reload, then **"Clear saved data"** to flush it.

> ⚠️ **Pagination and filtering are client-side.** The whole candidate set lives in
> the store in memory and is filtered/paged in the browser. That's intentional given
> the mock backend (seeded once, with local status writes), but it means a very large
> injected dataset (e.g. 2000+) is held and processed entirely client-side — fine for
> a demo, but not how a real server-paginated list would behave.

## Test strategy

Given the time box, testing was prioritised by impact rather than coverage numbers:

- **Integration tests first, on the most important feature** — the Candidate list
  with the status dropdown (`pending → approved`, and a rejected candidate that
  can't change). This is the core user journey, so it's covered end-to-end
  (router + query + store + UI).
- **Unit tests on a `ui-kit` component** (`MultiSelect`) — library components are
  likely to be reused by many developers, so their quality has to be rock solid.
  Tests cover rendering options, selecting multiple values, and unselecting.
- **E2E (not implemented, time permitting)** — would be **Playwright**, asserting
  that **status changes persist across reloads** (the localStorage mock backend).

## Prompts

This project was built conversationally. Every prompt from the session, with a
summary of the work each one produced, is documented in **[PROMPTS.md](./PROMPTS.md)**.

## Notes & intentional gaps

A few conscious trade-offs, given the time-box and the brief's "don't over-engineer" note:

- **Pagination** — the list paginates **client-side** over the filtered candidates
  (page size 30), with a sticky paginator shown only when there are 2+ pages. It's
  client-side because the mock-backend store is the source of truth (seeded once,
  with local status writes + client filtering), so server `_page`/`_limit` wouldn't
  fit. JSONPlaceholder only returns 10 users, so in practice it stays on one page
  and the paginator is hidden — but it's correct for larger datasets.
- **shadcn/ui coverage** — shadcn is set up (`mesmo/shell/components.json`) and used for
  primitives (e.g. `Button`). A few components shadcn doesn't ship (or that would pull in
  extra dependencies) are hand-built in `@mesmo/ui-kit` as agnostic, shadcn-styled components:
  - **`MultiSelect`** — shadcn has no multi-select (you compose `Popover` + `Command`); a
    self-contained one keeps the library dependency-light.
  - **`Dropdown`** (status changer) — a minimal menu instead of shadcn's `DropdownMenu`, to
    avoid extra Radix dependencies in the shared library.
  - **`Avatar`** — shadcn's `Avatar` is image-first; we needed an initials/icon **placeholder**.
  - **`Toaster` / `toast`** — a tiny toast store instead of pulling in `sonner`.
- **E2E tests** — not implemented (see [Test strategy](#test-strategy)). Would be Playwright,
  asserting status changes persist across reloads.
