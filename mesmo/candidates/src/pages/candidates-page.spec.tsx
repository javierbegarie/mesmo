import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';

import { CandidatesPage } from './candidates-page';
import type { ApiUser } from '../util/types';

const SAMPLE_USERS: ApiUser[] = [
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    phone: '1-770-736-8031',
    website: 'hildegard.org',
    address: { city: 'Gwenborough' },
    company: { name: 'Romaguera-Crona', catchPhrase: 'Multi-layered client-server' },
  },
];

function renderPage() {
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
  return render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe('CandidatesPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => SAMPLE_USERS,
      })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the heading and the fetched candidate details', async () => {
    renderPage();

    expect(
      await screen.findByRole('heading', { name: /candidates/i }),
    ).toBeTruthy();

    await waitFor(() =>
      expect(screen.getByText('Leanne Graham')).toBeTruthy(),
    );
    expect(screen.getByText('Sincere@april.biz')).toBeTruthy();
    expect(screen.getByText('Romaguera-Crona')).toBeTruthy();
  });
});
