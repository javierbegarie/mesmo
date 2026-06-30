<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

<!-- The guidance below is maintained by hand; the block above is managed by Nx. -->

# Mesmo — guide for AI agents

Mesmo is a small **selection-process app** ("Candidate Tracker"), built AI-first as an **Nx monorepo**. Read this before exploring files; per-project details live in `mesmo/<project>/AGENTS.md`.

## Stack (do not introduce alternatives)

React 19 + TypeScript (strict) · TanStack Router (code-based) · TanStack Query · Tailwind v4 · shadcn/ui · Zustand · Vite · Vitest + Testing Library. Package manager: **npm**.

## Projects & where code goes

All projects live under `mesmo/` and are consumed **as source** (each exports `src/index.ts`; no build step between them).

| Project             | Tags          | Put code here when…                                |
| ------------------- | ------------- | -------------------------------------------------- |
| `mesmo` (shell)     | `type:app`    | it's host/chrome: routing, providers, layout, 404  |
| `@mesmo/candidates` | `type:module` | it's candidate-specific (list, filters, detail)    |
| `@mesmo/ui-kit`     | `type:library`| it's an agnostic, reusable component/hook          |

**Rule of thumb:** a component that knows nothing about candidates and could be reused anywhere → `@mesmo/ui-kit`. Anything candidate-specific → `@mesmo/candidates`. Wiring routes/providers → the shell.

## Folder convention (every project)

| Folder        | Holds                                                   |
| ------------- | ------------------------------------------------------- |
| `core/`       | fundamental setup (router, query client, providers)     |
| `pages/`      | full page views, targetable by the router               |
| `query/`      | data-fetching hooks (TanStack Query)                    |
| `components/` | reusable, single-purpose components                     |
| `hooks/`      | headless hooks that support UI                          |
| `store/`      | Zustand stores                                          |
| `util/`       | additional functions / constants / types                |

Create only the folders a project needs. Tests are colocated as `*.spec.ts(x)` next to the code.

## Module boundaries (enforced by ESLint)

Import order: **`type:library` → `type:module` → `type:app`**. A project may depend on its own tier and lower (more reusable) tiers, never higher: app→{module,library}, module→{library}, library→{library}. Violations fail `nx lint`. Inspect with `npx nx graph`.

## Conventions & gotchas (non-obvious — follow these)

- **Consumed as source.** After adding a cross-project import, run `npx nx sync` to refresh TS project references.
- **Candidate data** is the **mock backend** store (`candidates/store/candidates-backend.ts`, Zustand + `persist`/localStorage), which is the source of truth. The API fetch only **seeds** it once — don't fetch candidates elsewhere.
- **Status & submission date** are **derived deterministically from the candidate id** (`candidates/util/seeded.ts`). Never randomize at runtime.
- **Allowed status transitions** come from the state-machine map (`candidates/util/status-machine.ts`). Don't hardcode transitions in components.
- **Filters** live in a Zustand store synced to the **URL** (`candidates/store/url-sync.ts`) so state stays shareable.
- **A Zustand store shared across projects** must be a `Symbol.for(...)` global singleton (see `ui-kit/store/toast-store.ts`); libraries are evaluated as source and can otherwise duplicate.
- **Tailwind v4** auto-scans the module graph, but code outside the shell folder must be registered with `@source` in `shell/src/styles.css`.
- **shadcn/ui** primitives live in the shell (`components/ui`, via `components.json`). ui-kit components are shadcn-_styled_ but framework/domain-agnostic.

## Running tasks (work autonomously)

```bash
npm run dev                                  # shell on http://localhost:4200
npx nx run-many -t typecheck lint test       # verify everything
npx nx test @mesmo/ui-kit                     # one project
npx nx affected -t test lint                  # only what changed
npx nx graph                                  # dependency graph & boundaries
npx nx sync                                    # refresh TS project references
```

Always run typecheck + lint + test after a change and fix what they report.

## Adding a new module/library

Use an Nx generator (e.g. `npx nx g @nx/react:library mesmo/<name>`), tag it `type:module` or `type:library`, follow the folder convention, register its `src` with `@source` if it ships UI, then `npx nx sync`. Prefer the Nx generator skills over hand-scaffolding.

## More

Per-project guides: `mesmo/shell/AGENTS.md`, `mesmo/candidates/AGENTS.md`, `mesmo/ui-kit/AGENTS.md`. Human docs: `README.md`. AI collaboration log: `PROMPTS.md`.
