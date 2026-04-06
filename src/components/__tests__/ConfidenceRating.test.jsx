import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfidenceRating from '../ConfidenceRating';

describe('ConfidenceRating', () => {
  const mockOnRate = jest.fn();
  const defaultModuleId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all rating options', () => {
    render(<ConfidenceRating confidence={0} onRate={mockOnRate} compact={false} />);

    expect(screen.getByText('How confident are you with this module?')).toBeInTheDocument();
    expect(screen.getByText('Need Review')).toBeInTheDocument();
    expect(screen.getByText('Unsure')).toBeInTheDocument();
    expect(screen.getByText('Okay')).toBeInTheDocument();
    expect(screen.getByText('Confident')).toBeInTheDocument();
    expect(screen.getByText('Mastered')).toBeInTheDocument();
  });

  it('should call onRate with selected rating', async () => {
    const user = userEvent.setup();

    render(<ConfidenceRating confidence={0} onRate={mockOnRate} compact={false} />);

    const confidentButton = screen.getByText('Confident');
    await user.click(confidentButton);

    expect(mockOnRate).toHaveBeenCalledWith(4);
  });

  it('should display selected rating', () => {
    render(<ConfidenceRating confidence={4} onRate={mockOnRate} compact={false} />);

    const confidentButton = screen.getByText('Confident');
    expect(confidentButton.closest('button')).toHaveClass('selected');
  });

  it('should show clear button when rating is set', () => {
    render(<ConfidenceRating confidence={4} onRate={mockOnRate} compact={false} />);

    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('should not show clear button when no rating is set', () => {
    render(<ConfidenceRating confidence={0} onRate={mockOnRate} compact={false} />);

    expect(screen.queryByText('Clear')).not.toBeInTheDocument();
  });

  it('should clear rating when clear button is clicked', async () => {
    const user = userEvent.setup();

    render(<ConfidenceRating confidence={4} onRate={mockOnRate} compact={false} />);

    const clearButton = screen.getByText('Clear');
    await user.click(clearButton);

    expect(mockOnRate).toHaveBeenCalledWith(0);
  });

  it('should show appropriate hint for low confidence', () => {
    render(<ConfidenceRating confidence={1} onRate={mockOnRate} compact={false} />);

    expect(screen.getByText(/marked for review/i)).toBeInTheDocument();
  });

  it('should show appropriate hint for moderate confidence', () => {
    render(<ConfidenceRating confidence={3} onRate={mockOnRate} compact={false} />);

    expect(screen.getByText(/Keep practicing to improve your confidence/i)).toBeInTheDocument();
  });

  it('should show appropriate hint for high confidence', () => {
    render(<ConfidenceRating confidence={5} onRate={mockOnRate} compact={false} />);

    expect(screen.getByText(/You have strong confidence in this module/i)).toBeInTheDocument();
  });

  it('should render compact view', () => {
    render(<ConfidenceRating confidence={4} onRate={mockOnRate} compact={true} />);

    expect(screen.queryByText('How confident are you with this module?')).not.toBeInTheDocument();
    expect(screen.queryByText('Need Review')).not.toBeInTheDocument();
  });

  it('should return null for compact view with no confidence', () => {
    const { container } = render(
      <ConfidenceRating confidence={0} onRate={mockOnRate} compact={true} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should display emoji in compact view', () => {
    render(<ConfidenceRating confidence={4} onRate={mockOnRate} compact={true} />);

    expect(screen.getByText('😊')).toBeInTheDocument();
  });
});
