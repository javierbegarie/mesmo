import type { ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { CandidatesPage } from './candidates-page';
import type { ApiUser } from '../util/types';

const SAMPLE_USERS: ApiUser[] = [
  {
    id: 1,
    name: 'Leanne Graham',
    email: 'Sincere@april.biz',
    company: { name: 'Romaguera-Crona' },
  },
];

function renderWithQuery(ui: ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
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
    renderWithQuery(<CandidatesPage />);

    expect(
      screen.getByRole('heading', { name: /candidates/i }),
    ).toBeTruthy();

    await waitFor(() =>
      expect(screen.getByText('Leanne Graham')).toBeTruthy(),
    );
    expect(screen.getByText('Sincere@april.biz')).toBeTruthy();
    expect(screen.getByText('Romaguera-Crona')).toBeTruthy();
  });
});
