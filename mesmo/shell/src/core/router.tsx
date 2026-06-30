import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { CandidatesPage, CandidateDetailPage } from '@mesmo/candidates';

import { AppShell } from '@/components/layout/app-shell';
import { NotFoundPage } from '@/pages/not-found-page';

/** Root route renders the shell chrome; modules mount inside its <Outlet />. */
const rootRoute = createRootRoute({
  component: AppShell,
});

/**
 * The Candidates module is the default view shown at the root path.
 * Future modules register their own routes alongside this one.
 */
const candidatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: CandidatesPage,
});

/** Detail view for a single candidate. */
const candidateDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/candidates/$id',
  component: CandidateDetailRoute,
});

function CandidateDetailRoute() {
  const { id } = candidateDetailRoute.useParams();
  return <CandidateDetailPage id={id} />;
}

const routeTree = rootRoute.addChildren([
  candidatesRoute,
  candidateDetailRoute,
]);

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundPage,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
