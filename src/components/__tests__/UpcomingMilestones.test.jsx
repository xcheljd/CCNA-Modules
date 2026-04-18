import React from 'react';
import { render, screen } from '@testing-library/react';
import UpcomingMilestones from '../UpcomingMilestones';
import ProgressTracker from '../../utils/progressTracker';

// Mock ProgressTracker
jest.mock('../../utils/progressTracker', () => ({
  __esModule: true,
  default: {
    getModuleProgress: jest.fn(),
    getModuleConfidence: jest.fn(),
  },
}));

// Helper to create mock modules
function createModules(count, startId = 1, startDay = 1) {
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    day: startDay + i,
    title: `Module ${startId + i}`,
    videos: [{ id: `video_${startId + i}`, title: `Video ${startId + i}`, duration: '10:00' }],
    resources: {
      lab: `Day ${startDay + i} Lab.pkt`,
      flashcards: `Day ${startDay + i} Flashcards.apkg`,
    },
  }));
}

describe('UpcomingMilestones', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: return 0 progress for all modules
    ProgressTracker.getModuleProgress.mockReturnValue(0);
    ProgressTracker.getModuleConfidence.mockReturnValue(0);
  });

  // VAL-MILESTONES-001: Renders four milestone markers (25%, 50%, 75%, 100%)
  it('should render four milestone markers with correct labels, icons, and percentages', () => {
    const modules = createModules(10);
    render(<UpcomingMilestones modules={modules} />);

    // Labels appear in milestone track (and possibly in next milestone card),
    // so use getAllByText to handle duplicates
    expect(screen.getAllByText('Quarter Complete').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Halfway There').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Three Quarters').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Full Completion').length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText('25%')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();

    // Icons appear in milestone track (and next milestone card), so use getAllByText
    expect(screen.getAllByText('🎯').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('🔥').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('💪').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('🏆').length).toBeGreaterThanOrEqual(1);
  });

  // VAL-MILESTONES-002: Marks milestones as completed when threshold met
  it('should mark milestones as completed when enough modules are done', () => {
    // 10 modules, 5 completed = 50% overall → 25% and 50% completed
    const modules = createModules(10);
    ProgressTracker.getModuleProgress.mockImplementation(m => {
      const idx = modules.findIndex(mm => mm.id === m.id);
      return idx < 5 ? 100 : 0;
    });

    const { container } = render(<UpcomingMilestones modules={modules} />);

    const markers = container.querySelectorAll('.milestone-marker');
    // First two (25%, 50%) should have 'completed' class
    expect(markers[0]).toHaveClass('completed');
    expect(markers[1]).toHaveClass('completed');
    // Last two (75%, 100%) should NOT have 'completed'
    expect(markers[2]).not.toHaveClass('completed');
    expect(markers[3]).not.toHaveClass('completed');
  });

  // VAL-MILESTONES-003: Identifies next milestone with `next` class
  it('should identify next milestones with "modules to go" text', () => {
    // 3 of 10 completed = 30% → 25% done, 50%/75%/100% are next
    const modules = createModules(10);
    ProgressTracker.getModuleProgress.mockImplementation(m => {
      const idx = modules.findIndex(mm => mm.id === m.id);
      return idx < 3 ? 100 : 0;
    });

    const { container } = render(<UpcomingMilestones modules={modules} />);

    // isNext is true for ALL milestones where overallProgress < target percent
    const nextMarkers = container.querySelectorAll('.milestone-marker.next');
    expect(nextMarkers.length).toBeGreaterThanOrEqual(1);

    // "modules to go" text should be visible for next milestones
    const remainingTexts = screen.getAllByText(/modules to go/);
    expect(remainingTexts.length).toBeGreaterThanOrEqual(1);
  });

  // VAL-MILESTONES-004: Renders next milestone card with stats
  it('should render next milestone card with modules remaining, total needed, and progress bar', () => {
    // 2 of 10 completed = 20% → next is 25% (first non-completed milestone)
    const modules = createModules(10);
    ProgressTracker.getModuleProgress.mockImplementation(m => {
      const idx = modules.findIndex(mm => mm.id === m.id);
      return idx < 2 ? 100 : 0;
    });

    const { container } = render(<UpcomingMilestones modules={modules} />);

    expect(screen.getByText('Next Milestone')).toBeInTheDocument();
    // Label appears both in milestone track and next milestone card
    expect(screen.getAllByText('Quarter Complete').length).toBeGreaterThanOrEqual(2);

    // modules remaining: ceil(2.5) - 2 = 1
    expect(screen.getByText('modules remaining')).toBeInTheDocument();
    expect(screen.getByText('total needed')).toBeInTheDocument();

    // Progress bar should exist
    const progressBar = container.querySelector('.milestone-progress-fill');
    expect(progressBar).toBeInTheDocument();
  });

  // VAL-MILESTONES-005: No next milestone card when all milestones completed
  it('should not render next milestone card when all modules are complete', () => {
    const modules = createModules(10);
    ProgressTracker.getModuleProgress.mockReturnValue(100);

    render(<UpcomingMilestones modules={modules} />);

    expect(screen.queryByText('Next Milestone')).not.toBeInTheDocument();
  });

  // VAL-MILESTONES-006: Upcoming modules list limited to 5 incomplete
  it('should render at most 5 upcoming incomplete modules with day/title and progress bars for partial modules', () => {
    const modules = createModules(10);
    // First 2 complete, next 5 partial (30-70%), last 3 incomplete
    ProgressTracker.getModuleProgress.mockImplementation(m => {
      const idx = modules.findIndex(mm => mm.id === m.id);
      if (idx < 2) return 100;
      if (idx < 7) return 30 + idx * 10; // partial
      return 0;
    });

    const { container } = render(<UpcomingMilestones modules={modules} />);

    expect(screen.getByText('Up Next')).toBeInTheDocument();

    // Should show exactly 5 items (first 5 incomplete)
    const items = container.querySelectorAll('.upcoming-module-item');
    expect(items).toHaveLength(5);

    // Check correct module titles
    expect(screen.getByText(/Day 3: Module 3/)).toBeInTheDocument();
    expect(screen.getByText(/Day 7: Module 7/)).toBeInTheDocument();
    // Module 8, 9, 10 should NOT be shown (limited to 5)
    expect(screen.queryByText(/Day 8: Module 8/)).not.toBeInTheDocument();

    // Progress bars shown for partial modules (all 5 have partial progress)
    const progressBars = container.querySelectorAll('.upcoming-progress-bar');
    expect(progressBars).toHaveLength(5);
  });

  // VAL-MILESTONES-007: Completion achievement shown at 100%
  it('should render congratulations message when all modules are complete', () => {
    const modules = createModules(10);
    ProgressTracker.getModuleProgress.mockReturnValue(100);

    render(<UpcomingMilestones modules={modules} />);

    expect(screen.getByText('Congratulations!')).toBeInTheDocument();
    expect(screen.getByText("You've completed the entire CCNA course!")).toBeInTheDocument();
    expect(screen.getByText('🎉')).toBeInTheDocument();
  });

  // VAL-MILESTONES-008: Handles empty modules array without crashing
  it('should render without errors when modules array is empty', () => {
    const { container } = render(<UpcomingMilestones modules={[]} />);

    // All milestones should be uncompleted (no 'completed' class)
    const markers = container.querySelectorAll('.milestone-marker');
    expect(markers).toHaveLength(4);
    markers.forEach(marker => {
      expect(marker).not.toHaveClass('completed');
    });

    // No next milestone card
    expect(screen.queryByText('Next Milestone')).not.toBeInTheDocument();

    // No upcoming modules list
    expect(screen.queryByText('Up Next')).not.toBeInTheDocument();

    // No completion achievement
    expect(screen.queryByText('Congratulations!')).not.toBeInTheDocument();
  });

  // Additional edge case: milestone progress bar width calculation
  it('should calculate progress bar width based on completed vs needed modules', () => {
    // 8 of 10 modules complete = 80% → next milestone is 100%
    // needs ceil(10) = 10, remaining = 10 - 8 = 2
    const modules = createModules(10);
    ProgressTracker.getModuleProgress.mockImplementation(m => {
      const idx = modules.findIndex(mm => mm.id === m.id);
      return idx < 8 ? 100 : 0;
    });

    const { container } = render(<UpcomingMilestones modules={modules} />);

    const progressFill = container.querySelector('.milestone-progress-fill');
    // (10 - 2) / 10 * 100 = 80%
    expect(progressFill).toHaveStyle({ width: '80%' });
  });

  // Additional edge case: partial module progress in upcoming list
  it('should show progress percentage text for partially completed modules', () => {
    const modules = createModules(3);
    ProgressTracker.getModuleProgress.mockImplementation(m => {
      const idx = modules.findIndex(mm => mm.id === m.id);
      if (idx === 0) return 100; // complete
      if (idx === 1) return 45; // partial
      return 0; // not started
    });

    render(<UpcomingMilestones modules={modules} />);

    // Module 2 has 45% progress, should show rounded value
    expect(screen.getByText('45%')).toBeInTheDocument();
    // Module 3 has 0% progress, no progress bar should be shown
    expect(screen.queryByText('0%')).not.toBeInTheDocument();
  });

  // Additional edge case: correct number of upcoming modules shown
  it('should show fewer than 5 upcoming modules when fewer incomplete modules exist', () => {
    const modules = createModules(3);
    ProgressTracker.getModuleProgress.mockImplementation(m => {
      const idx = modules.findIndex(mm => mm.id === m.id);
      return idx === 0 ? 100 : 0;
    });

    const { container } = render(<UpcomingMilestones modules={modules} />);

    const items = container.querySelectorAll('.upcoming-module-item');
    expect(items).toHaveLength(2); // Only 2 incomplete modules
  });

  // Additional edge case: no upcoming modules when all complete
  it('should not render upcoming modules list when all modules are complete', () => {
    const modules = createModules(5);
    ProgressTracker.getModuleProgress.mockReturnValue(100);

    render(<UpcomingMilestones modules={modules} />);

    expect(screen.queryByText('Up Next')).not.toBeInTheDocument();
  });

  // Additional edge case: milestone marker ordering
  it('should render milestone markers in correct 25/50/75/100 order', () => {
    const modules = createModules(10);
    const { container } = render(<UpcomingMilestones modules={modules} />);

    const labels = Array.from(container.querySelectorAll('.milestone-percent')).map(
      el => el.textContent
    );
    expect(labels).toEqual(['25%', '50%', '75%', '100%']);
  });
});
