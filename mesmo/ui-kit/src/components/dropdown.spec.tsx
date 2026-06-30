import { render, screen, fireEvent } from '@testing-library/react';

import { Dropdown, type DropdownItem } from './dropdown';

const ITEMS: DropdownItem[] = [
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

describe('Dropdown', () => {
  it('opens and emits the chosen value', () => {
    const onSelect = vi.fn();
    render(
      <Dropdown items={ITEMS} onSelect={onSelect} placeholder="Change status" />,
    );

    fireEvent.click(screen.getByRole('button', { name: /change status/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Rejected' }));

    expect(onSelect).toHaveBeenCalledWith('rejected');
  });

  it('is disabled with an alternate placeholder when there are no items', () => {
    render(
      <Dropdown
        items={[]}
        onSelect={() => undefined}
        placeholder="Change status"
        disabledPlaceholder="No changes available"
      />,
    );

    const trigger = screen.getByRole<HTMLButtonElement>('button', {
      name: /no changes available/i,
    });
    expect(trigger.disabled).toBe(true);
  });
});
