# Prompts

Every prompt from the session, verbatim, each followed by a collapsible summary of
the work it produced. Back to the [README](./README.md).

---

## Prompt 1 — Task zero: basic structure

```
I'm working in a selection process app, so it should be quite simple and small. For this session we will be working on the main branch only.
I have already started the project with NX (for structure, solid CLI commands and AI readiness) and React.

The following tasks will have to be completed using the additional stack:

* TanStack Router.
* TanStack Query.
* Tailwind
* shadcn/ui for components.

* zustand for state management

And follow the next folder convention for every project:

/core: For fundamental libraries and tools setup.
/pages: Full pages views, can be targeted by the router.
/query: Hooks with the purpose of fetching data. We most probably make use of TanStack Query here.
/components: Reusable components with a single specific purpose.
/hooks: For headless components, meant to support UI.
/store: For state management stores.
/util: for additional functions or constants.

The task zero is to create the basic structure of the app. We have the shell project which represents the holder of all the modules (or microfrontend apps in the future). It will have a top bar (one that shows a branding icon, the time and potentially in the future a gear icon for openning the settings menu). At the bottom a small footer with minimal data.


As for now, we only have the Candidates module, which is the one that has to be shown by default at the beginning.

Complete the task without going outside the tech stack and the conventions
```

<details>
<summary>What I did</summary>

- Explored the existing Nx workspace (pre-scaffolded `mesmo/shell` app + `mesmo/candidates` module) and confirmed npm + React 19.
- Installed the stack: TanStack Router & Query, Tailwind v4 (`@tailwindcss/vite`), Zustand, and shadcn dependencies.
- **Shell:** Tailwind v4 + shadcn setup (`components.json`, `cn` in `/util`, a `Button`), `@/` path alias, **code-based** TanStack Router (root layout → index route renders Candidates), Query provider, `TopBar` (branding + live clock + settings gear wired to a Zustand store), `Footer`; removed `react-router-dom`.
- **Candidates:** restructured to the folder convention; exported a `CandidatesPage` with a mock `useCandidates` query.
- Verified lint/typecheck/test/build and confirmed the dev server renders.
</details>

---

## Prompt 2 — Task 1: fetch real candidates

```
Awesome. Now we need to work on the first task:

You did already a simple Candidates list, I need from you to fetch data from this URL: https://jsonplaceholder.typicode.com/users

Every item should show: name, email, company, status badge, submission date

For the status badge: Add a random status and submission-date. However, make use of their ID as a seed for the random generation so we always get the same value for the same item
```

<details>
<summary>What I did</summary>

- `useCandidates` now fetches `/users` and maps to the domain model.
- Card shows name, email, company, a status badge and a submission date.
- Added `util/seeded.ts`: a `mulberry32` PRNG **seeded by the candidate id** so status + submission date are random but **stable per candidate** (and anchored to a fixed date window so they never drift).
- Added a determinism unit test and a page test (mocked `fetch`); verified in the browser.
</details>

---

## Prompt 3 — Status values

```
Oh, I forgot to tell, the statuses are: pending, approved, rejected
```

<details>
<summary>What I did</summary>

- Reduced the statuses to `pending | approved | rejected` and renamed the field `stage → status` (`CandidateStage → CandidateStatus`) across types, the seeded generator, badge, exports and tests.
- Updated badge colours (amber / emerald / red); verified.
</details>

---

## Prompt 4 — Task 2: filters

```
Perfect. Now for the 2nd task:

We need to be able to filter the list by some candidate attributes.

* Text filter that should work for name or email.
* Status filter (make use of a multiselect).

Make a CandidateFilters component that should hold those 2 filters and be ready to have more.

Make use of Zustand to store the filters state and add a middleware to sync the filters state with the URL.
```

<details>
<summary>What I did</summary>

- Built `CandidateFilters` (text filter on name/email + a status **multiselect**), structured so more filters drop in easily.
- Added a Zustand filters store with a **reusable `urlSync` middleware** that hydrates from the URL on load and writes changes back via `history.replaceState` (`?q=` + repeated `?status=`).
- Added a self-contained `MultiSelect` + `useClickOutside` hook, a pure `filterCandidates` util (with tests), and a `useFilteredCandidates` hook.
- Verified text/status filtering, multi-value URLs, and rehydration on reload.
</details>

---

## Prompt 5 — Move to ui-kit + enforce boundaries

```
Excellent. I added through a nx command a new module (a new react library). It's called ui-kit, it's in mesmo/ui-kit. The idea is to move there any agnostic self-contained component we develop in this session and which is also a candidate to be reused in all the other projects. So you can move the Multiselect component there.

Also, I think it's convenient to start enforcing module boundaries using the type:* tags.

The allowed import order will be: type:library => type:module => type:app
```

<details>
<summary>What I did</summary>

- Moved `MultiSelect` (and its `useClickOutside` dependency) into `@mesmo/ui-kit`; updated the candidates import to `@mesmo/ui-kit`.
- Gave ui-kit the DOM lib in its tsconfigs and registered `mesmo/ui-kit/src` with Tailwind's `@source` in the shell.
- Enforced `@nx/enforce-module-boundaries` in the root ESLint with the order `type:library → type:module → type:app` (each tier may depend on its own + lower tiers).
- Ran `nx sync`; verified all projects, including a negative test proving an illegal `library → module` import is rejected.
</details>

---

## Prompt 6 — Task 3: candidate detail

```
Perfect. Now we move to the 3rd task. We need to craft a candidate detail view.

The route should be /candidates/:id

We have to show all the candidate information plus their posts, which can be found in this url:

https://jsonplaceholder.typicode.com/posts?userId={id}

If you come with a new agnostic self-contained component please add it to the ui-kit.

We will need for this view:

* Another query in separate file.
* A back button (I'm guessing we don't need to do anything to preserve the filters when navigating back, but ensure we keep them when we do).
* Add an avatar placeholder.

Feel free to craft the view as you find is the best ux pattern.
```

<details>
<summary>What I did</summary>

- Registered `/candidates/$id` in the shell; a thin wrapper reads the param and passes `id` to the module's `CandidateDetailPage`.
- Detail view shows full candidate info + their **posts**; added separate query files `use-candidate.ts` and `use-candidate-posts.ts`, plus a shared `toCandidate` mapper.
- Made the list card a `Link`; extracted `CandidateStatusBadge`.
- Back button uses `useCanGoBack()` + `router.history.back()` (falls back to `/`), so the list URL and its filters are preserved; the Zustand store keeps filters in memory regardless.
- Added an agnostic `Avatar` (initials/placeholder) to ui-kit. Verified the journey, including filters surviving back-navigation.
</details>

---

## Prompt 7 — Task 4: status updates + mock backend

```
Excellent. Now it comes the tricky 4th task. We need to be able to update the candidate status (as we were moving him/her through the selection process). The only allowed movements are from pending to approved/rejected.

The thing is we only have for now a "read-only" backend. So my idea is to create a new store to take the role of our backend, the fetching of candidates will only be used to initialize this mock-backend. This store will have a localStorage middleware to simulate the persistence of data.

That solves the data-management challenge.

Now about the UI, I'd like to have a Dropdown, which will be shown in the Candidate list and in the Candidate detail page. This dropdown will be the one allowing us to change the status of a candidate. If there are no possible status to move, we just show the dropdown disabled (it can have a different placeholder in that state as well)

However, I'd like to avoid to hardcode the possible status movements. So, my idea and as a middle-ground between scalability and maintainability and the fact his is a home project is to have a typed map constant with the following shape:

export type CandidateStatusResolution = CandidateStatus[] | (candidate: Candidate) => CandidateStatus[];

export const stateMachine = new Map<CandidateStatus,  CandidateStatusResolution>([
   ['pending',  ['approved', 'rejected'] ]
]);

I hope you get my idea. The concept is to have a basic direct mapping between an origin state and it's possible following states, but if the developer needs to introduce more complexity he/she is invited to do it through a function that takes the candidate and may return some other states. This is for the case more states are introduced but we want to prevent a big refactor.
```

<details>
<summary>What I did</summary>

- Added a **mock-backend store** (Zustand + `persist`/localStorage) seeded **once** from the fetch; once seeded, the network fetch is skipped (`enabled: !seeded`). `setStatus` validates moves against the state machine.
- Implemented the typed **state machine** map exactly as requested, plus `getAllowedTransitions(candidate)` that resolves both the array and function forms (`pending → approved | rejected`).
- Added a generic agnostic `Dropdown` to ui-kit (disabled state + alternate placeholder when no moves); wired `CandidateStatusDropdown` into the list card and the detail header.
- Rewired the data layer so the list/detail read from the store. Tests + browser checks confirmed the change is reactive and **persists across reloads**.
</details>

---

## Prompt 8 — Task 5 (part 1): error handling

```
Excellent. That was the trickiest part. Now we enter the 5th task which will be done in 2 parts as there's a lot of simple things to cover.

First we will be focusing on error handling:

* Candidates List: If there was an error fetching, just show an error message in the same way we show the loading state.
* Candidate Details: Here we have 2 parts, if there's an error showing the candidate detail, (any sort of error while navigating to the details, because I know we're not refetching a candidate) show a red toast and keep the user in the list (it the user tried to access through URL send him/her to the list). The 2nd part is about the posts. If we can show the candidate information then let's allow to enter to the detail but let's show an error like "It was not possible to fetch the candidate posts right now".
* A Not-Found page for non-existent or invalid urls.
* A red toast for the case an user is trying to change the status of a candidate that already changed from another user action (I know in the case of our mock-backend, will probably be the case of an user that is using 2 different tabs, if this is not feasible, discard it)
```

<details>
<summary>What I did</summary>

- **List:** inline error message (same pattern as loading) + an automated test.
- **Detail:** any failure to show a candidate (load error or unknown id, incl. deep links) raises a **red toast** and redirects to the list, guarded by a `useRef` so it fires once (taming StrictMode).
- **Posts:** inline error with the exact requested copy while the candidate still renders.
- **Not-Found page** wired via the router's `defaultNotFoundComponent`.
- **Conflict toast:** `setStatus` reads the freshest persisted state and returns `applied | conflict`; on conflict it re-syncs and the dropdown raises a red toast. Added a `storage` listener for live cross-tab sync.
- Built a toast system in ui-kit. **Fixed a real bug:** the toast store was duplicated across project boundaries (libraries consumed as source) — made it a `Symbol.for(...)` **global singleton**. Verified every scenario in the browser.
</details>

---

## Prompt 9 — Task 6: wrap-up (tests + cosmetics)

```
Ok, now we enter the 6th task, which is wrapping up everything to present this project.

I will need from you to do now is:

* Integration tests: 1st: ensure a candidate in the list can be transitioned from pending to approved. 2nd: ensure a candidate in rejected can't change its status.
* Unit tests: Multiselect component. 1st: Ensure the component renders the options as expected. 2nd: ensure we can select multiple values and outputs it properly. 3rd ensure we can unselect already selected values.
* Cosmetic improvements: shell: Make the footer always visible, just make the content between the top bar and the footer scrollable. Candidate list: put the dropdown at the end of the card, we should have the candidate info + status + dropdown in the same horizontal line. Candidate detail: Put the detail and the posts side by side. Make only the posts column scrollable.
```

<details>
<summary>What I did</summary>

- **Integration tests** (real list page + router + query + store): a pending candidate transitions to approved via the dropdown; a rejected candidate's dropdown is disabled and unchangeable.
- **MultiSelect unit tests** via a controlled harness: renders options, selects multiple + outputs them, and unselects an already-selected value.
- **Cosmetics:** shell now pins the top bar/footer with the middle as the only scroll area; the list card is a single horizontal line with the dropdown at the end; the detail view is two columns (profile + posts) with **only the posts column scrolling**.
- Verified in the browser at 1280px (main doesn't scroll on detail, posts column does, footer pinned).
</details>

---

## Prompt 10 — Documentation

```
Following this 6th task, I will need to write documentation about the project and the prompts made here.

I will need from you to work in the README.md file to be more accurate and concise.

At the beginning, as a subtitle if you wish, please add this line:

Mesmo: Porque não é o contrário.

Please update the file with the instructions on how to start from zero (npm install, npm run dev).

Enumerate other commands of interest for the interviewer.

Then add a section explaining why NX (benefits of its structure, scalability, maintainability, how it helps to keep a solid structure along a fast growing application) and why it helps with the project readiness for most AI agents.

Then another section with every nx project and its role in this small app and some of the decisions I took for it.

Then one last section explaning the test strategy which was:

* Cover with integration tests the "most important" feature first, as it was the Cancidate list with the dropdown.
* Cover with unit tests a component in the ui-kit, as components from these libraries have high changes of being reused by a lot of developers, therefore their quality should be rock solid.
* And if I had the time to add e2e would've been with Playwright and I'd have tested that the statuses changes are persisted through reloads.

Then I will need from you to create a PROMPTS.md which can be reached from README.md. This new Markdown file has to be at the root of the repository and what you will write there is the next:

Every single of my prompts in this sessions verbatim.
And for every prompt of mine, a collapsable and summarized information of your actions per each one.
```

<details>
<summary>What I did</summary>

- Rewrote `README.md` for Mesmo: subtitle line, from-zero instructions (`npm install`, `npm run dev`), commands of interest, a **Why Nx** section (structure / scalability / maintainability / AI readiness), a **Projects** section (role + decisions per Nx project), and the **test strategy**.
- Created this `PROMPTS.md` (linked from the README) with every prompt verbatim and a collapsible action summary for each.
</details>
