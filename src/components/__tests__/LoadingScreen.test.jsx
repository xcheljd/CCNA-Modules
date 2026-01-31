import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoadingScreen from '../LoadingScreen';

describe('LoadingScreen', () => {
  it('should render with loading status', () => {
    render(<LoadingScreen status="Loading modules..." progress={50} />);

    expect(screen.getByText('Loading modules...')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('should render progress bar', () => {
    render(<LoadingScreen status="Calculating progress..." progress={75} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
  });

  it('should show 0% progress when status is initializing', () => {
    render(<LoadingScreen status="Initializing..." progress={0} />);

    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('should show 100% progress when complete', () => {
    render(<LoadingScreen status="Ready!" progress={100} />);

    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('should handle different status messages', () => {
    const { rerender } = render(
      <LoadingScreen status="Checking course resources..." progress={25} />
    );

    expect(screen.getByText('Checking course resources...')).toBeInTheDocument();

    rerender(<LoadingScreen status="Setting up activity tracking..." progress={50} />);

    expect(screen.getByText('Setting up activity tracking...')).toBeInTheDocument();
  });

  it('should update progress bar fill width', () => {
    const { rerender } = render(<LoadingScreen status="Loading..." progress={50} />);

    const progressBar = screen.getByRole('progressbar');
    const progressFill = progressBar.querySelector('.progress-fill');
    expect(progressFill).toHaveStyle({ width: '50%' });

    rerender(<LoadingScreen status="Loading..." progress={100} />);

    expect(progressFill).toHaveStyle({ width: '100%' });
  });
});
