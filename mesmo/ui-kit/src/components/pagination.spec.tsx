import { render, screen, fireEvent } from '@testing-library/react';

import { Pagination } from './pagination';

describe('Pagination', () => {
  it('renders one button per page plus prev/next', () => {
    render(<Pagination page={1} pageCount={3} onPageChange={() => undefined} />);
    expect(screen.getByRole('button', { name: '1' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '2' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '3' })).toBeTruthy();
    expect(screen.getByRole('button', { name: /previous page/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /next page/i })).toBeTruthy();
  });

  it('disables prev on the first page and next on the last', () => {
    const { rerender } = render(
      <Pagination page={1} pageCount={3} onPageChange={() => undefined} />,
    );
    expect(
      screen.getByRole<HTMLButtonElement>('button', { name: /previous page/i })
        .disabled,
    ).toBe(true);

    rerender(
      <Pagination page={3} pageCount={3} onPageChange={() => undefined} />,
    );
    expect(
      screen.getByRole<HTMLButtonElement>('button', { name: /next page/i })
        .disabled,
    ).toBe(true);
  });

  it('emits the chosen page', () => {
    const onPageChange = vi.fn();
    render(<Pagination page={1} pageCount={3} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByRole('button', { name: '2' }));
    expect(onPageChange).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
