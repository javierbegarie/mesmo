import type { ReactNode } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';

import { CandidatesPage } from './candidates-page';
import { useCandidatesBackendStore } from '../store/candidates-backend';
import type { CandidateDetail, CandidateStatus } from '../util/types';

function candidate(
  id: string,
  status: CandidateStatus,
  name: string,
): CandidateDetail {
  return {
    id,
    name,
    email: `${name.toLowerCase().replace(/\s/g, '.')}@example.com`,
    company: 'Example Inc',
    status,
    submittedAt: '2025-01-01T00:00:00.000Z',
    username: name.toLowerCase().replace(/\s/g, ''),
    phone: '000',
    website: 'example.com',
    city: 'Townsville',
    catchPhrase: 'Doing things',
  };
}

function renderListWith(candidates: CandidateDetail[]) {
  useCandidatesBackendStore.setState({ candidates, seeded: true });

  const rootRoute = createRootRoute();
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: CandidatesPage,
  });
  const detailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/candidates/$id',
    component: () => null,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, detailRoute]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  });
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  }

  return render(<RouterProvider router={router} />, { wrapper: Wrapper });
}

describe('Candidates list — status transitions (integration)', () => {
  beforeEach(() => {
    localStorage.clear();
    useCandidatesBackendStore.setState({ candidates: [], seeded: false });
  });

  it('moves a pending candidate to approved from the list', async () => {
    renderListWith([
      candidate('1', 'pending', 'Pending Pat'),
      candidate('2', 'rejected', 'Rejected Rita'),
    ]);

    expect(await screen.findByText('Pending Pat')).toBeTruthy();

    // Only the pending candidate exposes an actionable dropdown.
    fireEvent.click(screen.getByRole('button', { name: /change status/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Approved' }));

    // The backend now reflects the transition...
    expect(
      useCandidatesBackendStore
        .getState()
        .candidates.find((c) => c.id === '1')?.status,
    ).toBe('approved');

    // ...and the row is no longer actionable (terminal status).
    expect(
      screen.queryByRole('button', { name: /change status/i }),
    ).toBeNull();
  });

  it('does not let a rejected candidate change status', async () => {
    renderListWith([candidate('1', 'rejected', 'Rejected Rita')]);

    expect(await screen.findByText('Rejected Rita')).toBeTruthy();

    const trigger = screen.getByRole<HTMLButtonElement>('button', {
      name: /no changes available/i,
    });
    expect(trigger.disabled).toBe(true);

    // There is no actionable dropdown and no menu to open.
    expect(
      screen.queryByRole('button', { name: /change status/i }),
    ).toBeNull();
    fireEvent.click(trigger);
    expect(screen.queryByRole('menuitem')).toBeNull();
  });
});
