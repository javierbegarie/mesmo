# `@mesmo/ui-kit` — `type:library`

Agnostic, reusable UI consumed by any project. Read the repo-root `AGENTS.md` first.
May only import other `type:library` projects.

## Contents

- `components/` — `Avatar`, `Dropdown`, `MultiSelect`, `Pagination`, `Toaster`.
- `hooks/` — `useClickOutside`.
- `store/` — `toast-store` (the imperative `toast` API).
- `index.ts` — every public component/hook/type is exported here.

## Rules

- **Stay agnostic:** no imports of app, router, domain types, or feature code. Components receive data via props.
- shadcn-_styled_ with the same Tailwind tokens (`bg-popover`, `border`, `ring`, …); consumers' Tailwind must `@source` this `src`.
- Size with props/inline styles where utility classes would conflict (there's no `tailwind-merge` here) — see `Avatar`.
- **State shared across projects** (e.g. the toast store) must be a `Symbol.for(...)` global singleton, because this library is evaluated as source and can otherwise duplicate.
- Export every new public component/hook/type from `src/index.ts`.
