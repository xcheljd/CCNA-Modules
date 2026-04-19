import React from 'react';
import { render, screen } from '@testing-library/react';
import StudyStreak from '../StudyStreak';
import StreakTracker from '../../utils/streakTracker';

// Mock StreakTracker
jest.mock('../../utils/streakTracker', () => ({
  __esModule: true,
  default: {
    getStreakInfo: jest.fn(),
    getRecentActivity: jest.fn(),
    isStreakAtRisk: jest.fn(),
    getStreakMilestones: jest.fn(),
  },
}));

// Default mock return values
function setupMocks(overrides = {}) {
  const defaultStreakInfo = {
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: null,
  };

  const defaultRecentActivity = [
    { date: '2025-01-09', activitiesCompleted: 0, hasActivity: false },
    { date: '2025-01-10', activitiesCompleted: 0, hasActivity: false },
    { date: '2025-01-11', activitiesCompleted: 0, hasActivity: false },
    { date: '2025-01-12', activitiesCompleted: 0, hasActivity: false },
    { date: '2025-01-13', activitiesCompleted: 0, hasActivity: false },
    { date: '2025-01-14', activitiesCompleted: 0, hasActivity: false },
    { date: '2025-01-15', activitiesCompleted: 0, hasActivity: false },
  ];

  const defaultMilestones = [
    { days: 7, name: '7-Day Warrior', achieved: false, progress: 0 },
    { days: 14, name: '2-Week Champion', achieved: false, progress: 0 },
    { days: 30, name: 'Monthly Master', achieved: false, progress: 0 },
    { days: 60, name: '60-Day Dedication', achieved: false, progress: 0 },
    { days: 100, name: 'Century Scholar', achieved: false, progress: 0 },
  ];

  StreakTracker.getStreakInfo.mockReturnValue(overrides.streakInfo || defaultStreakInfo);
  StreakTracker.getRecentActivity.mockReturnValue(
    overrides.recentActivity || defaultRecentActivity
  );
  StreakTracker.isStreakAtRisk.mockReturnValue(overrides.atRisk ?? false);
  StreakTracker.getStreakMilestones.mockReturnValue(overrides.milestones || defaultMilestones);
}

// Use fake timers to control date for getDayLabel
jest.useFakeTimers().setSystemTime(new Date('2025-01-15')); // Wednesday

describe('StudyStreak', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  // VAL-STREAK-COMP-001: Displays current streak number and label
  it('should display current streak number and "day streak" label', () => {
    setupMocks({
      streakInfo: { currentStreak: 5, longestStreak: 10, lastStudyDate: '2025-01-15' },
    });

    render(<StudyStreak />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('day streak')).toBeInTheDocument();
  });

  // VAL-STREAK-COMP-001: Displays streak number 0
  it('should display 0 when no streak exists', () => {
    setupMocks({
      streakInfo: { currentStreak: 0, longestStreak: 0, lastStudyDate: null },
    });

    render(<StudyStreak />);

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('day streak')).toBeInTheDocument();
  });

  // VAL-STREAK-COMP-002: Shows correct emoji for streak ranges
  it('should show 📚 emoji when streak is 0', () => {
    setupMocks({
      streakInfo: { currentStreak: 0, longestStreak: 0, lastStudyDate: null },
    });

    render(<StudyStreak />);

    expect(screen.getByText('📚')).toBeInTheDocument();
  });

  // VAL-STREAK-COMP-002: Shows correct emoji for streak ranges
  it('should show 🔥 for streak 1-6', () => {
    for (let i = 1; i <= 6; i++) {
      setupMocks({
        streakInfo: { currentStreak: i, longestStreak: i, lastStudyDate: '2025-01-15' },
      });

      const { unmount } = render(<StudyStreak />);
      // Only one 🔥 should be present (not 🔥🔥 or 🔥🔥🔥)
      expect(screen.getByText('🔥')).toBeInTheDocument();
      expect(screen.queryByText('🔥🔥')).not.toBeInTheDocument();
      expect(screen.queryByText('🔥🔥🔥')).not.toBeInTheDocument();
      unmount();
    }
  });

  // VAL-STREAK-COMP-002: Shows correct emoji for streak ranges
  it('should show 🔥🔥 for streak 7-29', () => {
    for (const streak of [7, 14, 29]) {
      setupMocks({
        streakInfo: { currentStreak: streak, longestStreak: streak, lastStudyDate: '2025-01-15' },
      });

      const { unmount } = render(<StudyStreak />);
      // 🔥🔥 appears as text content (two fire emojis)
      expect(screen.getByText('🔥🔥')).toBeInTheDocument();
      unmount();
    }
  });

  // VAL-STREAK-COMP-002: Shows correct emoji for streak ranges
  it('should show 🔥🔥🔥 for streak 30+', () => {
    for (const streak of [30, 60, 100]) {
      setupMocks({
        streakInfo: { currentStreak: streak, longestStreak: streak, lastStudyDate: '2025-01-15' },
      });

      const { unmount } = render(<StudyStreak />);
      expect(screen.getByText('🔥🔥🔥')).toBeInTheDocument();
      unmount();
    }
  });

  // VAL-STREAK-COMP-003: Displays appropriate streak message per state
  it('should show "Start your learning journey" when streak is 0', () => {
    setupMocks({
      streakInfo: { currentStreak: 0, longestStreak: 0, lastStudyDate: null },
      atRisk: false,
    });

    render(<StudyStreak />);

    expect(screen.getByText('Start your learning journey today!')).toBeInTheDocument();
  });

  // VAL-STREAK-COMP-003: At-risk message
  it('should show at-risk message when streak is at risk', () => {
    setupMocks({
      streakInfo: { currentStreak: 5, longestStreak: 10, lastStudyDate: '2025-01-14' },
      atRisk: true,
    });

    render(<StudyStreak />);

    expect(screen.getByText("Don't break your streak! Study today!")).toBeInTheDocument();
  });

  // VAL-STREAK-COMP-003: Day 1 message
  it('should show "Great start" message when streak is 1 and not at risk', () => {
    setupMocks({
      streakInfo: { currentStreak: 1, longestStreak: 1, lastStudyDate: '2025-01-15' },
      atRisk: false,
    });

    render(<StudyStreak />);

    expect(screen.getByText('Great start! Come back tomorrow!')).toBeInTheDocument();
  });

  // VAL-STREAK-COMP-003: Days to badge message
  it('should show "more days to earn your first badge" for streak 2-6', () => {
    setupMocks({
      streakInfo: { currentStreak: 3, longestStreak: 3, lastStudyDate: '2025-01-15' },
      atRisk: false,
    });

    render(<StudyStreak />);

    expect(screen.getByText(`${7 - 3} more days to earn your first badge!`)).toBeInTheDocument();
  });

  // VAL-STREAK-COMP-003: Amazing dedication message
  it('should show "Amazing dedication" message for streak >= 7 and not at risk', () => {
    setupMocks({
      streakInfo: { currentStreak: 10, longestStreak: 10, lastStudyDate: '2025-01-15' },
      atRisk: false,
    });

    render(<StudyStreak />);

    expect(screen.getByText('Amazing dedication! Keep it up!')).toBeInTheDocument();
  });

  // VAL-STREAK-COMP-004: Shows longest streak only when > 0
  it('should show longest streak section when longestStreak > 0', () => {
    setupMocks({
      streakInfo: { currentStreak: 3, longestStreak: 10, lastStudyDate: '2025-01-15' },
    });

    render(<StudyStreak />);

    expect(screen.getByText('Longest Streak')).toBeInTheDocument();
    expect(screen.getByText(/10 days/)).toBeInTheDocument();
  });

  // VAL-STREAK-COMP-004: Hides longest streak when 0
  it('should hide longest streak section when longestStreak is 0', () => {
    setupMocks({
      streakInfo: { currentStreak: 0, longestStreak: 0, lastStudyDate: null },
    });

    render(<StudyStreak />);

    expect(screen.queryByText('Longest Streak')).not.toBeInTheDocument();
  });

  // VAL-STREAK-COMP-005: Renders 7-day activity calendar with day labels
  it('should render 7-day activity calendar with correct day-of-week abbreviations', () => {
    // System time is 2025-01-15 (Wednesday)
    // Last 7 days: Jan 9 (Thu), 10 (Fri), 11 (Sat), 12 (Sun), 13 (Mon), 14 (Tue), 15 (Wed)
    setupMocks({
      recentActivity: [
        { date: '2025-01-09', activitiesCompleted: 1, hasActivity: true },
        { date: '2025-01-10', activitiesCompleted: 2, hasActivity: true },
        { date: '2025-01-11', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-12', activitiesCompleted: 3, hasActivity: true },
        { date: '2025-01-13', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-14', activitiesCompleted: 4, hasActivity: true },
        { date: '2025-01-15', activitiesCompleted: 0, hasActivity: false },
      ],
    });

    render(<StudyStreak />);

    expect(screen.getByText('Last 7 Days')).toBeInTheDocument();
    // Verify day-of-week labels (date.getDay() for each date)
    expect(screen.getByText('Thu')).toBeInTheDocument(); // Jan 9
    expect(screen.getByText('Fri')).toBeInTheDocument(); // Jan 10
    expect(screen.getByText('Sat')).toBeInTheDocument(); // Jan 11
    expect(screen.getByText('Sun')).toBeInTheDocument(); // Jan 12
    expect(screen.getByText('Mon')).toBeInTheDocument(); // Jan 13
    expect(screen.getByText('Tue')).toBeInTheDocument(); // Jan 14
    expect(screen.getByText('Wed')).toBeInTheDocument(); // Jan 15
  });

  // VAL-STREAK-COMP-006: Applies correct intensity CSS classes
  it('should apply "bg-card" class for 0 activities (empty)', () => {
    const { container } = render(<StudyStreak />);

    const emptyCells = container.querySelectorAll('.bg-card');
    // All 7 activity cells have 0 activities → bg-card
    expect(emptyCells.length).toBe(7);
  });

  // VAL-STREAK-COMP-006: Applies correct intensity CSS classes
  it('should apply low-intensity bg class for 1-2 activities', () => {
    setupMocks({
      recentActivity: [
        { date: '2025-01-09', activitiesCompleted: 1, hasActivity: true },
        { date: '2025-01-10', activitiesCompleted: 2, hasActivity: true },
        { date: '2025-01-11', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-12', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-13', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-14', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-15', activitiesCompleted: 0, hasActivity: false },
      ],
    });

    const { container } = render(<StudyStreak />);

    // Low intensity cells (1-2 activities) get bg-[hsl(var(--primary)/0.3)]
    // Find the 52x52 activity cells and check their classList
    const cells = container.querySelectorAll('[title*="activities"]');
    const lowCells = Array.from(cells).filter(cell =>
      Array.from(cell.classList).some(cls => cls.includes('--primary') && cls.includes('0.3'))
    );
    expect(lowCells).toHaveLength(2);
  });

  // VAL-STREAK-COMP-006: Applies correct intensity CSS classes
  it('should apply medium-intensity bg class for 3-5 activities', () => {
    setupMocks({
      recentActivity: [
        { date: '2025-01-09', activitiesCompleted: 3, hasActivity: true },
        { date: '2025-01-10', activitiesCompleted: 5, hasActivity: true },
        { date: '2025-01-11', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-12', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-13', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-14', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-15', activitiesCompleted: 0, hasActivity: false },
      ],
    });

    const { container } = render(<StudyStreak />);

    // Medium intensity cells (3-5 activities) get bg-[hsl(var(--primary)/0.5)]
    const cells = container.querySelectorAll('[title*="activities"]');
    const mediumCells = Array.from(cells).filter(cell =>
      Array.from(cell.classList).some(cls => cls.includes('--primary') && cls.includes('0.5'))
    );
    expect(mediumCells).toHaveLength(2);
  });

  // VAL-STREAK-COMP-006: Applies correct intensity CSS classes
  it('should apply "bg-primary" class for 6+ activities (high)', () => {
    setupMocks({
      recentActivity: [
        { date: '2025-01-09', activitiesCompleted: 6, hasActivity: true },
        { date: '2025-01-10', activitiesCompleted: 10, hasActivity: true },
        { date: '2025-01-11', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-12', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-13', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-14', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-15', activitiesCompleted: 0, hasActivity: false },
      ],
    });

    const { container } = render(<StudyStreak />);

    // High-intensity cells get bg-primary plus bg-card on the milestone bar,
    // so count only the activity cells (w-[52px] h-[52px] with bg-primary)
    const allPrimary = container.querySelectorAll('.bg-primary');
    // 2 activity cells + 1 milestone bar = 3
    expect(allPrimary.length).toBeGreaterThanOrEqual(2);
  });

  // VAL-STREAK-COMP-007: Shows activity count badge only when > 0
  it('should show activity count for days with activity', () => {
    setupMocks({
      recentActivity: [
        { date: '2025-01-09', activitiesCompleted: 3, hasActivity: true },
        { date: '2025-01-10', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-11', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-12', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-13', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-14', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-15', activitiesCompleted: 0, hasActivity: false },
      ],
    });

    render(<StudyStreak />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  // VAL-STREAK-COMP-007: No badge for 0-activity days
  it('should not show activity count span for days with 0 activities', () => {
    setupMocks({
      recentActivity: [
        { date: '2025-01-09', activitiesCompleted: 3, hasActivity: true },
        { date: '2025-01-10', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-11', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-12', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-13', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-14', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-15', activitiesCompleted: 0, hasActivity: false },
      ],
    });

    const { container } = render(<StudyStreak />);

    // Activity cells show count spans only when activitiesCompleted > 0
    // Count only the "3" text that appears inside the activity cells
    const cells = container.querySelectorAll('[title*="activities"]');
    const cellsWithSpans = Array.from(cells).filter(cell => cell.querySelector('span'));
    expect(cellsWithSpans).toHaveLength(1);
  });

  // VAL-STREAK-COMP-008: Renders next milestone progress bar
  it('should render next milestone progress bar with name, days, and progress', () => {
    setupMocks({
      streakInfo: { currentStreak: 3, longestStreak: 3, lastStudyDate: '2025-01-15' },
      milestones: [
        { days: 7, name: '7-Day Warrior', achieved: false, progress: 42.86 },
        { days: 14, name: '2-Week Champion', achieved: false, progress: 21.43 },
        { days: 30, name: 'Monthly Master', achieved: false, progress: 10 },
        { days: 60, name: '60-Day Dedication', achieved: false, progress: 5 },
        { days: 100, name: 'Century Scholar', achieved: false, progress: 3 },
      ],
    });

    const { container } = render(<StudyStreak />);

    expect(screen.getByText(/Next: 7-Day Warrior/)).toBeInTheDocument();
    expect(screen.getByText('3/7 days')).toBeInTheDocument();

    // Milestone fill uses shadcn Progress (Radix) with translateX indicator
    const milestoneBar = container.querySelector('.h-2.rounded-full');
    const milestoneFill = milestoneBar ? milestoneBar.querySelector('div') : null;
    expect(milestoneFill).toBeInTheDocument();
    expect(milestoneFill).toHaveStyle({ transform: 'translateX(-57.14%)' });
  });

  // VAL-STREAK-COMP-009: Hides next milestone when all achieved
  it('should hide next milestone section when all milestones are achieved', () => {
    setupMocks({
      streakInfo: { currentStreak: 100, longestStreak: 100, lastStudyDate: '2025-01-15' },
      milestones: [
        { days: 7, name: '7-Day Warrior', achieved: true, progress: 100 },
        { days: 14, name: '2-Week Champion', achieved: true, progress: 100 },
        { days: 30, name: 'Monthly Master', achieved: true, progress: 100 },
        { days: 60, name: '60-Day Dedication', achieved: true, progress: 100 },
        { days: 100, name: 'Century Scholar', achieved: true, progress: 100 },
      ],
    });

    render(<StudyStreak />);

    expect(screen.queryByText(/Next:/)).not.toBeInTheDocument();
  });

  // VAL-STREAK-COMP-010: Renders achieved milestone badges
  it('should render achieved milestone badges when at least one milestone is achieved', () => {
    setupMocks({
      streakInfo: { currentStreak: 14, longestStreak: 14, lastStudyDate: '2025-01-15' },
      milestones: [
        { days: 7, name: '7-Day Warrior', achieved: true, progress: 100 },
        { days: 14, name: '2-Week Champion', achieved: true, progress: 100 },
        { days: 30, name: 'Monthly Master', achieved: false, progress: 46.67 },
        { days: 60, name: '60-Day Dedication', achieved: false, progress: 23.33 },
        { days: 100, name: 'Century Scholar', achieved: false, progress: 14 },
      ],
    });

    render(<StudyStreak />);

    expect(screen.getByText('Achievements')).toBeInTheDocument();
    // Milestone names are in title attributes on badge elements
    expect(screen.getByTitle('7-Day Warrior')).toBeInTheDocument();
    expect(screen.getByTitle('2-Week Champion')).toBeInTheDocument();
  });

  // VAL-STREAK-COMP-010: Badges section absent when none achieved
  it('should not render achievements section when no milestones are achieved', () => {
    setupMocks({
      streakInfo: { currentStreak: 3, longestStreak: 3, lastStudyDate: '2025-01-15' },
      milestones: [
        { days: 7, name: '7-Day Warrior', achieved: false, progress: 42.86 },
        { days: 14, name: '2-Week Champion', achieved: false, progress: 21.43 },
        { days: 30, name: 'Monthly Master', achieved: false, progress: 10 },
        { days: 60, name: '60-Day Dedication', achieved: false, progress: 5 },
        { days: 100, name: 'Century Scholar', achieved: false, progress: 3 },
      ],
    });

    render(<StudyStreak />);

    expect(screen.queryByText('Achievements')).not.toBeInTheDocument();
  });

  // VAL-STREAK-COMP-011: Applies at-risk CSS class
  it('should apply at-risk text-destructive class to streak message when at risk', () => {
    setupMocks({
      streakInfo: { currentStreak: 5, longestStreak: 10, lastStudyDate: '2025-01-14' },
      atRisk: true,
    });

    const { container } = render(<StudyStreak />);

    const messageEl = container.querySelector('.text-destructive');
    expect(messageEl).toBeInTheDocument();
    expect(messageEl).toHaveTextContent("Don't break your streak! Study today!");
  });

  // VAL-STREAK-COMP-011: No at-risk class when not at risk
  it('should not apply text-destructive class when not at risk', () => {
    setupMocks({
      streakInfo: { currentStreak: 5, longestStreak: 10, lastStudyDate: '2025-01-15' },
      atRisk: false,
    });

    const { container } = render(<StudyStreak />);

    // The message div should not have text-destructive class
    const messageEl = container.querySelector('.text-destructive');
    expect(messageEl).not.toBeInTheDocument();
  });

  // VAL-STREAK-COMP-012: Refreshes data when refreshKey prop changes
  it('should re-fetch data when refreshKey prop changes', () => {
    const { rerender } = render(<StudyStreak refreshKey={1} />);

    // Called once on mount
    expect(StreakTracker.getStreakInfo).toHaveBeenCalledTimes(1);
    expect(StreakTracker.getRecentActivity).toHaveBeenCalledTimes(1);
    expect(StreakTracker.getStreakMilestones).toHaveBeenCalledTimes(1);
    expect(StreakTracker.isStreakAtRisk).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();
    setupMocks();

    // Re-render with new refreshKey
    rerender(<StudyStreak refreshKey={2} />);

    // Should be called again due to refreshKey change
    expect(StreakTracker.getStreakInfo).toHaveBeenCalledTimes(1);
    expect(StreakTracker.getRecentActivity).toHaveBeenCalledTimes(1);
    expect(StreakTracker.getStreakMilestones).toHaveBeenCalledTimes(1);
    expect(StreakTracker.isStreakAtRisk).toHaveBeenCalledTimes(1);
  });

  // VAL-STREAK-COMP-012: Does not re-fetch when refreshKey stays the same
  it('should not re-fetch data when re-rendered with same refreshKey', () => {
    const { rerender } = render(<StudyStreak refreshKey={1} />);

    expect(StreakTracker.getStreakInfo).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();
    setupMocks();

    // Re-render with same refreshKey
    rerender(<StudyStreak refreshKey={1} />);

    // Should NOT be called again since refreshKey hasn't changed
    expect(StreakTracker.getStreakInfo).not.toHaveBeenCalled();
  });

  // Additional edge case: milestone progress bar capped at 100
  it('should cap milestone progress bar width at 100%', () => {
    setupMocks({
      streakInfo: { currentStreak: 50, longestStreak: 50, lastStudyDate: '2025-01-15' },
      milestones: [
        { days: 7, name: '7-Day Warrior', achieved: true, progress: 100 },
        { days: 14, name: '2-Week Champion', achieved: true, progress: 100 },
        { days: 30, name: 'Monthly Master', achieved: true, progress: 100 },
        { days: 60, name: '60-Day Dedication', achieved: false, progress: 83.33 },
        { days: 100, name: 'Century Scholar', achieved: false, progress: 50 },
      ],
    });

    const { container } = render(<StudyStreak />);

    const milestoneBar = container.querySelector('.h-2.rounded-full');
    const milestoneFill = milestoneBar ? milestoneBar.querySelector('div') : null;
    // Next milestone is 60-Day Dedication at 83.33%, translateX = -(100-83.33)% = -16.67%
    expect(milestoneFill).toHaveStyle({ transform: 'translateX(-16.67%)' });
  });

  // Additional edge case: milestone with progress > 100 gets capped via Math.min
  it('should cap progress bar width at 100% when progress exceeds 100', () => {
    setupMocks({
      streakInfo: { currentStreak: 8, longestStreak: 8, lastStudyDate: '2025-01-15' },
      milestones: [
        { days: 7, name: '7-Day Warrior', achieved: true, progress: 100 },
        { days: 14, name: '2-Week Champion', achieved: false, progress: 114.29 }, // > 100
        { days: 30, name: 'Monthly Master', achieved: false, progress: 26.67 },
        { days: 60, name: '60-Day Dedication', achieved: false, progress: 13.33 },
        { days: 100, name: 'Century Scholar', achieved: false, progress: 8 },
      ],
    });

    const { container } = render(<StudyStreak />);

    const milestoneBar = container.querySelector('.h-2.rounded-full');
    const milestoneFill = milestoneBar ? milestoneBar.querySelector('div') : null;
    // Math.min(114.29, 100) = 100, translateX = -(100-100)% = -0%
    expect(milestoneFill).toHaveStyle({ transform: 'translateX(-0%)' });
  });

  // Additional edge case: calls getRecentActivity with argument 7
  it('should call getRecentActivity with 7 as argument', () => {
    render(<StudyStreak />);

    expect(StreakTracker.getRecentActivity).toHaveBeenCalledWith(7);
  });

  // Additional edge case: renders activity calendar cells with title attributes
  it('should render calendar cells with correct title attributes showing date and count', () => {
    setupMocks({
      recentActivity: [
        { date: '2025-01-09', activitiesCompleted: 3, hasActivity: true },
        { date: '2025-01-10', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-11', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-12', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-13', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-14', activitiesCompleted: 0, hasActivity: false },
        { date: '2025-01-15', activitiesCompleted: 0, hasActivity: false },
      ],
    });

    const { container } = render(<StudyStreak />);

    // Activity cells are now w-[52px] h-[52px] divs with title attributes
    const cells = container.querySelectorAll('[title*="activities"]');
    expect(cells[0]).toHaveAttribute('title', '2025-01-09: 3 activities');
    expect(cells[1]).toHaveAttribute('title', '2025-01-10: 0 activities');
  });

  // Additional edge case: multiple achieved badges render correctly
  it('should render badge with 🏆 icon and day count for each achieved milestone', () => {
    setupMocks({
      streakInfo: { currentStreak: 30, longestStreak: 30, lastStudyDate: '2025-01-15' },
      milestones: [
        { days: 7, name: '7-Day Warrior', achieved: true, progress: 100 },
        { days: 14, name: '2-Week Champion', achieved: true, progress: 100 },
        { days: 30, name: 'Monthly Master', achieved: true, progress: 100 },
        { days: 60, name: '60-Day Dedication', achieved: false, progress: 50 },
        { days: 100, name: 'Century Scholar', achieved: false, progress: 30 },
      ],
    });

    const { container } = render(<StudyStreak />);

    // Badges are now inline-flex items with rounded-full class and title attributes
    const badges = container.querySelectorAll('[title="7-Day Warrior"], [title="2-Week Champion"], [title="Monthly Master"]');
    expect(badges).toHaveLength(3);

    // Each badge should have a trophy emoji and day label
    badges.forEach(badge => {
      expect(badge).toHaveTextContent('🏆');
    });

    // Check day labels — badges now show "7d", "14d", "30d"
    expect(screen.getByText('7d')).toBeInTheDocument();
    expect(screen.getByText('14d')).toBeInTheDocument();
    expect(screen.getByText('30d')).toBeInTheDocument();
  });
});
