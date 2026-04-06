import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider } from '../../components/ui/toast';
import ModuleList from '../ModuleList';
import ProgressTracker from '../../utils/progressTracker';
import { mockModules } from '../../__tests__/test-utils';

function ModuleListWrapper(props) {
  return (
    <ToastProvider>
      <ModuleList {...props} />
    </ToastProvider>
  );
}

describe('ModuleList', () => {
  const mockOnModuleSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should render all modules', () => {
    render(<ModuleListWrapper modules={mockModules} onModuleSelect={mockOnModuleSelect} />);

    expect(screen.getByText('Network Devices')).toBeInTheDocument();
    expect(screen.getByText('OSI Model')).toBeInTheDocument();
  });

  it('should show module progress', () => {
    ProgressTracker.markVideoComplete(1, 'H8W9oMNSuwo');
    ProgressTracker.markLabComplete(1);
    ProgressTracker.markFlashcardsAdded(1);

    render(<ModuleListWrapper modules={mockModules} onModuleSelect={mockOnModuleSelect} />);

    const progressElement = screen.getByText('100%');
    expect(progressElement).toBeInTheDocument();
  });

  it('should filter modules by search query', async () => {
    const user = userEvent.setup();

    render(<ModuleListWrapper modules={mockModules} onModuleSelect={mockOnModuleSelect} />);

    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, 'OSI');

    expect(screen.getByText('OSI Model')).toBeVisible();
    expect(screen.queryByText('Network Devices')).not.toBeInTheDocument();
  });

  it('should toggle view mode between grid and list', async () => {
    const user = userEvent.setup();

    render(<ModuleListWrapper modules={mockModules} onModuleSelect={mockOnModuleSelect} />);

    const gridButton = screen.getByRole('button', { name: /Grid view/i });
    const listButton = screen.getByRole('button', { name: /List view/i });

    await user.click(listButton);
    await waitFor(
      () => {
        expect(listButton).toHaveClass('active');
      },
      { timeout: 300 }
    );

    await user.click(gridButton);
    await waitFor(
      () => {
        expect(gridButton).toHaveClass('active');
      },
      { timeout: 300 }
    );
  });

  it('should show no results message when no modules match', async () => {
    const user = userEvent.setup();

    render(<ModuleListWrapper modules={mockModules} onModuleSelect={mockOnModuleSelect} />);

    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, 'XYZNOTFOUND');

    expect(screen.getByText('No modules found matching your criteria.')).toBeInTheDocument();
  });

  it('should call onModuleSelect when module card is clicked', async () => {
    const user = userEvent.setup();

    render(<ModuleListWrapper modules={mockModules} onModuleSelect={mockOnModuleSelect} />);

    const firstModule = screen.getByText('Network Devices');
    await user.click(firstModule);

    expect(mockOnModuleSelect).toHaveBeenCalledWith(mockModules[0]);
  });

  it('should display module info (day, videos, lab, flashcards)', () => {
    render(<ModuleListWrapper modules={mockModules} onModuleSelect={mockOnModuleSelect} />);

    expect(screen.getByText('Day 1')).toBeInTheDocument();
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Lab').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Cards').length).toBeGreaterThan(0);
  });

  it('should handle empty modules list', () => {
    render(<ModuleListWrapper modules={[]} onModuleSelect={mockOnModuleSelect} />);

    expect(screen.queryByText('Network Devices')).not.toBeInTheDocument();
  });
});
