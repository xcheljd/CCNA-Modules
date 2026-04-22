import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingScreen from '../LoadingScreen';

describe('LoadingScreen', () => {
  it('should render the title', () => {
    render(<LoadingScreen />);
    expect(screen.getByText('CCNA 200-301 Course')).toBeInTheDocument();
  });

  it('should render the network icon', () => {
    const { container } = render(<LoadingScreen />);
    expect(container.querySelector('.network-lines')).toBeInTheDocument();
  });

  it('should render the pulsing progress bar', () => {
    const { container } = render(<LoadingScreen />);
    expect(
      container.querySelector('.animate-\\[loadingPulse_2s_ease-in-out_infinite\\]')
    ).toBeInTheDocument();
  });
});
