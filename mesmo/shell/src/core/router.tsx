import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { CandidatesPage } from '@mesmo/candidates';

import { AppShell } from '@/components/layout/app-shell';

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

const routeTree = rootRoute.addChildren([candidatesRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
