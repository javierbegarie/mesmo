import { render } from '@testing-library/react';

import MesmoCandidates from './candidates';

describe('MesmoCandidates', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MesmoCandidates />);
    expect(baseElement).toBeTruthy();
  });
});
