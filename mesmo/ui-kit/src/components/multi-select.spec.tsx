import { render, screen, fireEvent } from '@testing-library/react';

import { MultiSelect, type MultiSelectOption } from './multi-select';

const OPTIONS: MultiSelectOption[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
];

describe('MultiSelect', () => {
  it('shows the placeholder when nothing is selected', () => {
    render(
      <MultiSelect
        options={OPTIONS}
        selected={[]}
        onToggle={() => undefined}
        placeholder="All statuses"
      />,
    );
    expect(screen.getByText('All statuses')).toBeTruthy();
  });

  it('opens on click and emits the toggled value', () => {
    const onToggle = vi.fn();
    render(
      <MultiSelect options={OPTIONS} selected={[]} onToggle={onToggle} />,
    );

    fireEvent.click(screen.getByRole('button', { name: /select/i }));
    fireEvent.click(screen.getByRole('option', { name: 'Approved' }));

    expect(onToggle).toHaveBeenCalledWith('approved');
  });

  it('summarises a single selection by its label', () => {
    render(
      <MultiSelect
        options={OPTIONS}
        selected={['pending']}
        onToggle={() => undefined}
      />,
    );
    expect(screen.getByText('Pending')).toBeTruthy();
  });
});
