import type { ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { CandidatesPage } from './candidates-page';

function renderWithQuery(ui: ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
}

describe('CandidatesPage', () => {
  it('renders the heading and loads candidates', async () => {
    renderWithQuery(<CandidatesPage />);

    expect(
      screen.getByRole('heading', { name: /candidates/i }),
    ).toBeTruthy();

    await waitFor(() =>
      expect(screen.getByText('Ada Lovelace')).toBeTruthy(),
    );
  });
});
