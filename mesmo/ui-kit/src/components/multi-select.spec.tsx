import { useState } from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';

import { MultiSelect, type MultiSelectOption } from './multi-select';

const OPTIONS: MultiSelectOption[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

/** Controlled harness so we can observe what the component outputs over time. */
function Harness({ initial = [] }: { initial?: string[] }) {
  const [selected, setSelected] = useState<string[]>(initial);
  return (
    <>
      <MultiSelect
        options={OPTIONS}
        selected={selected}
        onToggle={(value) =>
          setSelected((current) =>
            current.includes(value)
              ? current.filter((entry) => entry !== value)
              : [...current, value],
          )
        }
        placeholder="All statuses"
      />
      <output data-testid="selected">{selected.join(',')}</output>
    </>
  );
}

function openMenu() {
  fireEvent.click(screen.getByRole('button'));
}

describe('MultiSelect', () => {
  it('renders the options as expected', () => {
    render(<Harness />);
    openMenu();

    const options = screen.getAllByRole('option');
    expect(options.map((option) => option.textContent)).toEqual([
      'Pending',
      'Approved',
      'Rejected',
    ]);
  });

  it('selects multiple values and outputs them', () => {
    render(<Harness />);
    openMenu();

    fireEvent.click(screen.getByRole('option', { name: 'Pending' }));
    fireEvent.click(screen.getByRole('option', { name: 'Rejected' }));

    expect(screen.getByTestId('selected').textContent).toBe('pending,rejected');
    // Two selected collapses the trigger label into a count.
    expect(screen.getByRole('button').textContent).toContain('2 selected');
    // Both chosen options are marked selected.
    expect(
      screen.getByRole('option', { name: 'Pending' }).getAttribute('aria-selected'),
    ).toBe('true');
    expect(
      screen.getByRole('option', { name: 'Rejected' }).getAttribute('aria-selected'),
    ).toBe('true');
  });

  it('unselects an already selected value', () => {
    render(<Harness initial={['pending', 'approved']} />);
    openMenu();

    expect(screen.getByTestId('selected').textContent).toBe('pending,approved');

    fireEvent.click(screen.getByRole('option', { name: 'Pending' }));

    expect(screen.getByTestId('selected').textContent).toBe('approved');
    expect(
      screen.getByRole('option', { name: 'Pending' }).getAttribute('aria-selected'),
    ).toBe('false');
    // A single remaining selection shows its label on the trigger.
    expect(
      within(screen.getByRole('button')).getByText('Approved'),
    ).toBeTruthy();
  });
});
