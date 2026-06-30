import { render, screen, fireEvent, act } from '@testing-library/react';

import { Toaster } from './toaster';
import { toast, useToastStore } from '../store/toast-store';

describe('Toaster', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  it('shows a raised error toast as an alert', () => {
    render(<Toaster />);
    act(() => toast.error('Something went wrong'));

    const alert = screen.getByRole('alert');
    expect(alert.textContent).toContain('Something went wrong');
  });

  it('removes a toast when dismissed', () => {
    render(<Toaster />);
    act(() => toast.info('Heads up'));

    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(screen.queryByText('Heads up')).toBeNull();
  });
});
