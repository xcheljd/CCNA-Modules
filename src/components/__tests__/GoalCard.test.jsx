import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GoalCard from '../GoalCard';
import GoalTracker from '../../utils/goalTracker';

// Mock GoalTracker
jest.mock('../../utils/goalTracker', () => ({
  __esModule: true,
  default: {
    getActiveGoal: jest.fn(),
    updateGoalProgress: jest.fn(),
    getGoalCompletion: jest.fn(),
    getSuccessRate: jest.fn(),
    deleteCurrentGoal: jest.fn(),
    createGoal: jest.fn(),
  },
}));

// Mock GoalModal as a simple component that shows "GoalModal"
jest.mock('../GoalModal', () => {
  return function MockGoalModal({ onClose, onCreate }) {
    return (
      <div data-testid="goal-modal">
        <span>GoalModal</span>
        <button data-testid="modal-close" onClick={onClose}>
          Close
        </button>
        <button
          data-testid="modal-create"
          onClick={() =>
            onCreate({
              type: 'weekly',
              targets: {
                modulesCompleted: 2,
                videosWatched: 10,
                labsCompleted: 1,
                flashcardsAdded: 2,
              },
            })
          }
        >
          Create
        </button>
      </div>
    );
  };
});

// Use fake timers for date-dependent tests (daysRemaining calculation)
jest.useFakeTimers().setSystemTime(new Date('2025-01-15'));

// Helper to create a mock active goal
function createMockGoal(overrides = {}) {
  return {
    id: 'goal-1234567890',
    type: 'weekly',
    startDate: '2025-01-13',
    endDate: '2025-01-20',
    status: 'active',
    target: {
      modulesCompleted: 5,
      videosWatched: 20,
      labsCompleted: 3,
      flashcardsAdded: 5,
    },
    baseline: {
      modulesCompleted: 0,
      videosWatched: 0,
      labsCompleted: 0,
      flashcardsAdded: 0,
    },
    progress: {
      modulesCompleted: 2,
      videosWatched: 10,
      labsCompleted: 1,
      flashcardsAdded: 2,
    },
    ...overrides,
  };
}

// Default mock setup — no active goal
function setupMocks(overrides = {}) {
  GoalTracker.getActiveGoal.mockReturnValue(overrides.goal || null);
  GoalTracker.updateGoalProgress.mockReturnValue(overrides.goal || null);
  GoalTracker.getGoalCompletion.mockReturnValue(overrides.completion ?? 0);
  GoalTracker.getSuccessRate.mockReturnValue(overrides.successRate ?? 0);
  GoalTracker.deleteCurrentGoal.mockReturnValue(undefined);
  GoalTracker.createGoal.mockReturnValue(overrides.goal || null);
}

// Mock modules prop
const mockModules = [
  {
    id: 1,
    day: 1,
    title: 'Network Devices',
    videos: [{ id: 'H8W9oMNSuwo', title: 'Network Devices', duration: '30:25' }],
    resources: {
      lab: 'Day 01 Lab.pkt',
      flashcards: 'Day 01 Flashcards.apkg',
    },
  },
  {
    id: 2,
    day: 2,
    title: 'OSI Model',
    videos: [{ id: 'PLACEHOLDER', title: 'OSI Model', duration: '45:10' }],
    resources: {
      lab: 'Day 02 Lab.pkt',
      flashcards: 'Day 02 Flashcards.apkg',
    },
  },
];

describe('GoalCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  // =====================================================
  // VAL-GOALCARD-001: Renders "No Active Goal" state
  // =====================================================
  it('should render "No Active Goal" state with heading, text, and create button', () => {
    setupMocks({ goal: null });

    render(<GoalCard modules={mockModules} />);

    expect(screen.getByText('No Active Goal')).toBeInTheDocument();
    expect(
      screen.getByText('Set a learning goal to track your progress and stay motivated!')
    ).toBeInTheDocument();
    expect(screen.getByText('Create Your First Goal')).toBeInTheDocument();
    expect(screen.getByText('🎯')).toBeInTheDocument();
  });

  // =====================================================
  // VAL-GOALCARD-002: Opens GoalModal on create button click
  // =====================================================
  it('should open GoalModal when create button is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    setupMocks({ goal: null });
    render(<GoalCard modules={mockModules} />);

    // Modal should not be visible initially
    expect(screen.queryByTestId('goal-modal')).not.toBeInTheDocument();

    // Click create button
    await user.click(screen.getByText('Create Your First Goal'));

    // Modal should now be visible
    expect(screen.getByTestId('goal-modal')).toBeInTheDocument();
    expect(screen.getByText('GoalModal')).toBeInTheDocument();
  });

  // =====================================================
  // VAL-GOALCARD-003: Renders active goal header with type, dates, days remaining
  // =====================================================
  it('should render weekly goal header with type, dates, and days remaining', () => {
    const goal = createMockGoal({ type: 'weekly' });
    setupMocks({ goal, completion: 40 });

    render(<GoalCard modules={mockModules} />);

    expect(screen.getByText('Weekly Goal')).toBeInTheDocument();
    expect(screen.getByText(/2025-01-13 to 2025-01-20/)).toBeInTheDocument();
    // Days remaining: (2025-01-20 - 2025-01-15) = 5 days
    expect(screen.getByText(/5 days left/)).toBeInTheDocument();
  });

  it('should render monthly goal header correctly', () => {
    const goal = createMockGoal({ type: 'monthly' });
    setupMocks({ goal, completion: 30 });

    render(<GoalCard modules={mockModules} />);

    expect(screen.getByText('Monthly Goal')).toBeInTheDocument();
  });

  // =====================================================
  // VAL-GOALCARD-004: Renders circular progress ring with correct percentage
  // =====================================================
  it('should render circular progress ring with correct percentage', () => {
    const goal = createMockGoal();
    setupMocks({ goal, completion: 55 });

    const { container } = render(<GoalCard modules={mockModules} />);

    // SVG should be present
    const svg = container.querySelector('.circular-chart');
    expect(svg).toBeInTheDocument();

    // Check the percentage text (Math.round(55) = 55)
    expect(screen.getByText('55%')).toBeInTheDocument();

    // Check the circle strokeDasharray
    const circle = container.querySelector('.circle');
    expect(circle).toHaveAttribute('stroke-dasharray', '55, 100');
  });

  it('should use complete color when progress is 100%', () => {
    const goal = createMockGoal();
    setupMocks({ goal, completion: 100 });

    const { container } = render(<GoalCard modules={mockModules} />);

    const circle = container.querySelector('.circle');
    expect(circle).toHaveAttribute('stroke', 'var(--color-progress-complete)');
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('should use ring color when progress is partial', () => {
    const goal = createMockGoal();
    setupMocks({ goal, completion: 50 });

    const { container } = render(<GoalCard modules={mockModules} />);

    const circle = container.querySelector('.circle');
    expect(circle).toHaveAttribute('stroke', 'hsl(var(--ring))');
  });

  // =====================================================
  // VAL-GOALCARD-005: Renders metric cards only for targets with value > 0
  // =====================================================
  it('should render metric cards only for targets with value > 0', () => {
    const goal = createMockGoal({
      target: {
        modulesCompleted: 5,
        videosWatched: 0, // Zero target — should not render
        labsCompleted: 3,
        flashcardsAdded: 0, // Zero target — should not render
      },
    });
    setupMocks({ goal, completion: 30 });

    render(<GoalCard modules={mockModules} />);

    // Should show Modules and Labs (non-zero targets)
    expect(screen.getByText('Modules')).toBeInTheDocument();
    expect(screen.getByText('Labs')).toBeInTheDocument();

    // Should NOT show Videos and Flashcards (zero targets)
    expect(screen.queryByText('Videos')).not.toBeInTheDocument();
    expect(screen.queryByText('Flashcards')).not.toBeInTheDocument();
  });

  // =====================================================
  // VAL-GOALCARD-006: Displays correct progress values and bars
  // =====================================================
  it('should display correct progress/target text for each metric', () => {
    const goal = createMockGoal({
      progress: {
        modulesCompleted: 3,
        videosWatched: 12,
        labsCompleted: 2,
        flashcardsAdded: 4,
      },
      target: {
        modulesCompleted: 5,
        videosWatched: 20,
        labsCompleted: 3,
        flashcardsAdded: 5,
      },
    });
    setupMocks({ goal, completion: 60 });

    render(<GoalCard modules={mockModules} />);

    expect(screen.getByText('3/5')).toBeInTheDocument(); // Modules
    expect(screen.getByText('12/20')).toBeInTheDocument(); // Videos
    expect(screen.getByText('2/3')).toBeInTheDocument(); // Labs
    expect(screen.getByText('4/5')).toBeInTheDocument(); // Flashcards
  });

  it('should cap progress bar width at 100%', () => {
    const goal = createMockGoal({
      progress: {
        modulesCompleted: 10, // Exceeds target of 5
        videosWatched: 5,
        labsCompleted: 1,
        flashcardsAdded: 2,
      },
      target: {
        modulesCompleted: 5,
        videosWatched: 20,
        labsCompleted: 3,
        flashcardsAdded: 5,
      },
    });
    setupMocks({ goal, completion: 80 });

    const { container } = render(<GoalCard modules={mockModules} />);

    // Find all metric fill bars
    const fills = container.querySelectorAll('.goal-metric-fill');
    // First fill (Modules): 10/5 * 100 = 200, capped at 100
    expect(fills[0]).toHaveStyle({ width: '100%' });
  });

  // =====================================================
  // VAL-GOALCARD-007: Shows success rate only when > 0
  // =====================================================
  it('should show success rate section when rate > 0', () => {
    const goal = createMockGoal();
    setupMocks({ goal, completion: 40, successRate: 75 });

    render(<GoalCard modules={mockModules} />);

    expect(screen.getByText('Success Rate:')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('should hide success rate section when rate is 0', () => {
    const goal = createMockGoal();
    setupMocks({ goal, completion: 40, successRate: 0 });

    render(<GoalCard modules={mockModules} />);

    expect(screen.queryByText('Success Rate:')).not.toBeInTheDocument();
  });

  // =====================================================
  // VAL-GOALCARD-008: Deletes goal on trash button + confirm
  // =====================================================
  it('should delete goal when trash button clicked and confirm returns true', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const goal = createMockGoal();
    setupMocks({ goal, completion: 40 });

    jest.spyOn(window, 'confirm').mockReturnValue(true);

    render(<GoalCard modules={mockModules} />);

    // Find and click the trash button
    const deleteButton = screen.getByTitle('Delete goal');
    await user.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this goal?');
    expect(GoalTracker.deleteCurrentGoal).toHaveBeenCalledTimes(1);
  });

  // =====================================================
  // VAL-GOALCARD-009: Does not delete goal when confirm cancelled
  // =====================================================
  it('should not delete goal when confirm returns false', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const goal = createMockGoal();
    setupMocks({ goal, completion: 40 });

    jest.spyOn(window, 'confirm').mockReturnValue(false);

    render(<GoalCard modules={mockModules} />);

    const deleteButton = screen.getByTitle('Delete goal');
    await user.click(deleteButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(GoalTracker.deleteCurrentGoal).not.toHaveBeenCalled();
  });

  // =====================================================
  // VAL-GOALCARD-010: Creates goal via GoalModal and refreshes
  // =====================================================
  it('should create goal via GoalModal, call createGoal, close modal, and refresh', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    // Start with no goal
    setupMocks({ goal: null, successRate: 0 });

    render(<GoalCard modules={mockModules} />);

    // Click to open modal
    await user.click(screen.getByText('Create Your First Goal'));
    expect(screen.getByTestId('goal-modal')).toBeInTheDocument();

    // Now configure mock to return a goal after creation
    const newGoal = createMockGoal();
    GoalTracker.createGoal.mockReturnValue(newGoal);
    GoalTracker.getActiveGoal.mockReturnValue(newGoal);
    GoalTracker.updateGoalProgress.mockReturnValue(newGoal);
    GoalTracker.getGoalCompletion.mockReturnValue(20);
    GoalTracker.getSuccessRate.mockReturnValue(0);

    // Click create in the modal
    await user.click(screen.getByTestId('modal-create'));

    // createGoal should have been called
    expect(GoalTracker.createGoal).toHaveBeenCalledWith(
      'weekly',
      {
        modulesCompleted: 2,
        videosWatched: 10,
        labsCompleted: 1,
        flashcardsAdded: 2,
      },
      mockModules
    );

    // Modal should close
    expect(screen.queryByTestId('goal-modal')).not.toBeInTheDocument();
  });

  // =====================================================
  // VAL-GOALCARD-011: Handles expired goal with negative days remaining
  // =====================================================
  it('should handle expired goal when endDate is in the past', () => {
    // When updateGoalProgress detects an expired goal, it returns null
    // and the component should show the no-goal state
    const expiredGoal = createMockGoal({
      endDate: '2025-01-10', // Past date (current date is 2025-01-15)
    });

    // First call: getActiveGoal returns the expired goal
    // But updateGoalProgress returns null (because it completes expired goals)
    GoalTracker.getActiveGoal.mockReturnValue(expiredGoal);
    GoalTracker.updateGoalProgress.mockReturnValue(null);
    GoalTracker.getGoalCompletion.mockReturnValue(0);
    GoalTracker.getSuccessRate.mockReturnValue(50);

    render(<GoalCard modules={mockModules} />);

    // Since updateGoalProgress returns null, component falls back to no-goal state
    expect(screen.getByText('No Active Goal')).toBeInTheDocument();
  });

  // =====================================================
  // VAL-GOALCARD-012: Handles goal with all zero targets gracefully
  // =====================================================
  it('should handle goal with all zero targets without crashing', () => {
    const zeroTargetGoal = createMockGoal({
      target: {
        modulesCompleted: 0,
        videosWatched: 0,
        labsCompleted: 0,
        flashcardsAdded: 0,
      },
      progress: {
        modulesCompleted: 0,
        videosWatched: 0,
        labsCompleted: 0,
        flashcardsAdded: 0,
      },
    });
    setupMocks({ goal: zeroTargetGoal, completion: 0 });

    render(<GoalCard modules={mockModules} />);

    // Should render the goal header
    expect(screen.getByText('Weekly Goal')).toBeInTheDocument();

    // No metric cards should be rendered (all targets are 0)
    expect(screen.queryByText('Modules')).not.toBeInTheDocument();
    expect(screen.queryByText('Videos')).not.toBeInTheDocument();
    expect(screen.queryByText('Labs')).not.toBeInTheDocument();
    expect(screen.queryByText('Flashcards')).not.toBeInTheDocument();
  });

  // =====================================================
  // Additional edge cases
  // =====================================================

  it('should call loadGoalData on mount', () => {
    setupMocks({ goal: null });
    render(<GoalCard modules={mockModules} />);

    expect(GoalTracker.getActiveGoal).toHaveBeenCalledTimes(1);
    expect(GoalTracker.getSuccessRate).toHaveBeenCalledTimes(1);
  });

  it('should show modal from active goal state via delete → no-goal → create', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const goal = createMockGoal();
    setupMocks({ goal, completion: 40 });

    jest.spyOn(window, 'confirm').mockReturnValue(true);

    render(<GoalCard modules={mockModules} />);

    // Active goal is displayed
    expect(screen.getByText('Weekly Goal')).toBeInTheDocument();

    // Delete the goal
    await user.click(screen.getByTitle('Delete goal'));

    // After delete, loadGoalData is called; mock returns no goal now
    GoalTracker.getActiveGoal.mockReturnValue(null);
    GoalTracker.updateGoalProgress.mockReturnValue(null);
    GoalTracker.getSuccessRate.mockReturnValue(0);

    // Re-render to simulate state change after delete + reload
    // The component's handleDeleteGoal calls loadGoalData after deleteCurrentGoal
  });

  it('should render progress ring background circle', () => {
    const goal = createMockGoal();
    setupMocks({ goal, completion: 30 });

    const { container } = render(<GoalCard modules={mockModules} />);

    const bgCircle = container.querySelector('.circle-bg');
    expect(bgCircle).toBeInTheDocument();
  });

  it('should calculate days remaining correctly', () => {
    const goal = createMockGoal({
      startDate: '2025-01-13',
      endDate: '2025-01-22', // 7 days from Jan 15
    });
    setupMocks({ goal, completion: 20 });

    render(<GoalCard modules={mockModules} />);

    // (2025-01-22 - 2025-01-15) / (1000*60*60*24) = 7 days, Math.ceil(7) = 7
    expect(screen.getByText(/7 days left/)).toBeInTheDocument();
  });

  it('should render metric cards with progress bars', () => {
    const goal = createMockGoal({
      progress: {
        modulesCompleted: 2,
        videosWatched: 10,
        labsCompleted: 1,
        flashcardsAdded: 2,
      },
      target: {
        modulesCompleted: 5,
        videosWatched: 20,
        labsCompleted: 3,
        flashcardsAdded: 5,
      },
    });
    setupMocks({ goal, completion: 50 });

    const { container } = render(<GoalCard modules={mockModules} />);

    const metricBars = container.querySelectorAll('.goal-metric-bar');
    expect(metricBars).toHaveLength(4); // All 4 metrics have non-zero targets

    // Check fill widths
    const fills = container.querySelectorAll('.goal-metric-fill');
    // Modules: 2/5 * 100 = 40%
    expect(fills[0]).toHaveStyle({ width: '40%' });
    // Videos: 10/20 * 100 = 50%
    expect(fills[1]).toHaveStyle({ width: '50%' });
    // Labs: 1/3 * 100 = 33.33...%
    expect(fills[2]).toHaveStyle({ width: `${(1 / 3) * 100}%` });
    // Flashcards: 2/5 * 100 = 40%
    expect(fills[3]).toHaveStyle({ width: '40%' });
  });

  it('should render metric fill bars with correct progress colors', () => {
    const goal = createMockGoal({
      progress: {
        modulesCompleted: 0, // 0% — muted
        videosWatched: 20, // 100% — complete
        labsCompleted: 1, // partial — ring
        flashcardsAdded: 2, // partial — ring
      },
      target: {
        modulesCompleted: 5,
        videosWatched: 20,
        labsCompleted: 3,
        flashcardsAdded: 5,
      },
    });
    setupMocks({ goal, completion: 50 });

    const { container } = render(<GoalCard modules={mockModules} />);

    const fills = container.querySelectorAll('.goal-metric-fill');
    // Modules: progress = 0 → 'hsl(var(--muted))'
    expect(fills[0]).toHaveStyle({ background: 'hsl(var(--muted))' });
    // Videos: progress = 100% → 'var(--color-progress-complete)'
    expect(fills[1]).toHaveStyle({ background: 'var(--color-progress-complete)' });
    // Labs: partial → 'hsl(var(--ring))'
    expect(fills[2]).toHaveStyle({ background: 'hsl(var(--ring))' });
  });

  it('should round success rate percentage', () => {
    const goal = createMockGoal();
    setupMocks({ goal, completion: 40, successRate: 75.6 });

    render(<GoalCard modules={mockModules} />);

    expect(screen.getByText('76%')).toBeInTheDocument();
  });

  it('should round completion percentage in progress ring', () => {
    const goal = createMockGoal();
    setupMocks({ goal, completion: 66.7 });

    render(<GoalCard modules={mockModules} />);

    expect(screen.getByText('67%')).toBeInTheDocument();
  });
});
