import { render, screen } from '@testing-library/react';

import { Avatar } from './avatar';

describe('Avatar', () => {
  it('renders initials from the first and last name', () => {
    render(<Avatar name="Ada Lovelace" />);
    expect(screen.getByText('AL')).toBeTruthy();
  });

  it('renders a single initial for a one-word name', () => {
    render(<Avatar name="Cher" />);
    expect(screen.getByText('C')).toBeTruthy();
  });
});
