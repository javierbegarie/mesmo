import { render, screen } from '@testing-library/react';

import { BrandLogo } from './brand-logo';
import { APP_NAME } from '@/util/constants';

describe('BrandLogo', () => {
  it('renders the app name', () => {
    render(<BrandLogo />);
    expect(screen.getByText(APP_NAME)).toBeTruthy();
  });
});
