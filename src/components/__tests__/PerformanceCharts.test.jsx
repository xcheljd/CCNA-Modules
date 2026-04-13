import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PerformanceCharts from '../PerformanceCharts';
import PerformanceTracker from '../../utils/performanceTracker';

// Mock PerformanceTracker
jest.mock('../../utils/performanceTracker', () => ({
  __esModule: true,
  default: {
    getRecentPerformance: jest.fn(),
    getWeeklyVelocity: jest.fn(),
    getConfidenceDistribution: jest.fn(),
    predictCompletionDate: jest.fn(),
  },
}));

// Mock chart sub-components
jest.mock('../charts/ProgressLineChart', () => {
  return function MockProgressLineChart({ data }) {
    return <div data-testid="progress-line-chart">{JSON.stringify(data)}</div>;
  };
});

jest.mock('../charts/ActivityHeatmap', () => {
  return function MockActivityHeatmap({ days }) {
    return <div data-testid="activity-heatmap">{days}</div>;
  };
});

jest.mock('../charts/VelocityBarChart', () => {
  return function MockVelocityBarChart({ data }) {
    return <div data-testid="velocity-bar-chart">{JSON.stringify(data)}</div>;
  };
});

jest.mock('../charts/ConfidenceDistribution', () => {
  return function MockConfidenceDistribution({ distribution }) {
    return <div data-testid="confidence-distribution">{JSON.stringify(distribution)}</div>;
  };
});

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

// Default mock setup
function setupMocks(overrides = {}) {
  PerformanceTracker.getRecentPerformance.mockReturnValue(
    overrides.progressData ?? [{ date: '2025-01-14', overallProgress: 50 }]
  );
  PerformanceTracker.getWeeklyVelocity.mockReturnValue(
    overrides.velocityData ?? [{ week: 'Week 1', modulesCompleted: 2 }]
  );
  PerformanceTracker.getConfidenceDistribution.mockReturnValue(
    overrides.confidenceData ?? {
      needsReview: 2,
      moderate: 3,
      confident: 5,
      notRated: 1,
    }
  );
  PerformanceTracker.predictCompletionDate.mockReturnValue(
    overrides.prediction ?? 'March 15, 2025'
  );
}

describe('PerformanceCharts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
  });

  // VAL-PERFCHARTS-001: Renders time range selector buttons
  it('should render three time range buttons with 30-day active by default', () => {
    const modules = createModules(5);
    render(<PerformanceCharts modules={modules} />);

    expect(screen.getByText('7 Days')).toBeInTheDocument();
    expect(screen.getByText('30 Days')).toBeInTheDocument();
    expect(screen.getByText('3 Months')).toBeInTheDocument();

    // 30 Days should have active class by default
    const buttons = screen.getAllByRole('button');
    const thirtyDayBtn = buttons.find(btn => btn.textContent === '30 Days');
    expect(thirtyDayBtn).toHaveClass('active');
  });

  // VAL-PERFCHARTS-002: Switches active time range on click
  it('should switch active class to clicked time range button', async () => {
    const user = userEvent.setup();
    const modules = createModules(5);
    render(<PerformanceCharts modules={modules} />);

    // Click 7 Days button
    await user.click(screen.getByText('7 Days'));

    const buttons = screen.getAllByRole('button');
    const sevenDayBtn = buttons.find(btn => btn.textContent === '7 Days');
    const thirtyDayBtn = buttons.find(btn => btn.textContent === '30 Days');

    expect(sevenDayBtn).toHaveClass('active');
    expect(thirtyDayBtn).not.toHaveClass('active');
  });

  // VAL-PERFCHARTS-003: Re-loads data when time range changes
  it('should call PerformanceTracker with new range when time range changes', async () => {
    const user = userEvent.setup();
    const modules = createModules(5);
    render(<PerformanceCharts modules={modules} />);

    // Initial load with default 30 days
    expect(PerformanceTracker.getRecentPerformance).toHaveBeenCalledWith(30);

    // Click 7 Days
    await user.click(screen.getByText('7 Days'));
    expect(PerformanceTracker.getRecentPerformance).toHaveBeenCalledWith(7);

    // Click 3 Months
    await user.click(screen.getByText('3 Months'));
    expect(PerformanceTracker.getRecentPerformance).toHaveBeenCalledWith(90);
  });

  // VAL-PERFCHARTS-004: Shows completion prediction when available
  it('should display completion prediction with date string', () => {
    const modules = createModules(5);
    setupMocks({ prediction: 'March 15, 2025' });
    render(<PerformanceCharts modules={modules} />);

    expect(screen.getByText('Estimated Completion:')).toBeInTheDocument();
    expect(screen.getByText('March 15, 2025')).toBeInTheDocument();
  });

  // VAL-PERFCHARTS-005: Hides prediction for "Completed" and "Unknown"
  it('should hide prediction section when prediction is "Completed"', () => {
    const modules = createModules(5);
    setupMocks({ prediction: 'Completed' });
    render(<PerformanceCharts modules={modules} />);

    expect(screen.queryByText('Estimated Completion:')).not.toBeInTheDocument();
  });

  it('should hide prediction section when prediction is "Unknown"', () => {
    const modules = createModules(5);
    setupMocks({ prediction: 'Unknown' });
    render(<PerformanceCharts modules={modules} />);

    expect(screen.queryByText('Estimated Completion:')).not.toBeInTheDocument();
  });

  // VAL-PERFCHARTS-006: Renders all four chart cards
  it('should render all four chart card headings', () => {
    const modules = createModules(5);
    render(<PerformanceCharts modules={modules} />);

    expect(screen.getByText('Progress Over Time')).toBeInTheDocument();
    expect(screen.getByText('Activity Calendar')).toBeInTheDocument();
    expect(screen.getByText('Weekly Completion Rate')).toBeInTheDocument();
    expect(screen.getByText('Confidence Levels')).toBeInTheDocument();
  });

  // VAL-PERFCHARTS-007: Passes data to child chart components
  it('should pass correct data props to chart sub-components', () => {
    const progressData = [{ date: '2025-01-14', overallProgress: 50 }];
    const velocityData = [{ week: 'Week 1', modulesCompleted: 3 }];
    const confidenceData = { needsReview: 1, moderate: 2, confident: 4, notRated: 0 };

    setupMocks({ progressData, velocityData, confidenceData });

    const modules = createModules(5);
    render(<PerformanceCharts modules={modules} />);

    // Check ProgressLineChart receives data
    const progressChart = screen.getByTestId('progress-line-chart');
    expect(progressChart.textContent).toBe(JSON.stringify(progressData));

    // Check VelocityBarChart receives data
    const velocityChart = screen.getByTestId('velocity-bar-chart');
    expect(velocityChart.textContent).toBe(JSON.stringify(velocityData));

    // Check ConfidenceDistribution receives distribution
    const confidenceChart = screen.getByTestId('confidence-distribution');
    expect(confidenceChart.textContent).toBe(JSON.stringify(confidenceData));

    // Check ActivityHeatmap receives days (= timeRange, default 30)
    const heatmap = screen.getByTestId('activity-heatmap');
    expect(heatmap.textContent).toBe('30');
  });

  // VAL-PERFCHARTS-008: Handles null/empty modules gracefully
  it('should not crash when modules is null', () => {
    render(<PerformanceCharts modules={null} />);

    // Should not call tracker methods with null modules
    expect(PerformanceTracker.getRecentPerformance).not.toHaveBeenCalled();
    expect(PerformanceTracker.getWeeklyVelocity).not.toHaveBeenCalled();
  });

  it('should not crash when modules is empty array', () => {
    render(<PerformanceCharts modules={[]} />);

    // Empty array has length 0, so useEffect should return early
    expect(PerformanceTracker.getRecentPerformance).not.toHaveBeenCalled();
  });

  // VAL-PERFCHARTS-009: Catches and logs errors from tracker
  it('should catch and log errors when PerformanceTracker throws', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Tracker error');
    PerformanceTracker.getRecentPerformance.mockImplementation(() => {
      throw error;
    });

    const modules = createModules(5);

    // Should not throw even when tracker throws
    expect(() => {
      render(<PerformanceCharts modules={modules} />);
    }).not.toThrow();

    expect(consoleSpy).toHaveBeenCalledWith('Error loading performance data:', error);

    consoleSpy.mockRestore();
  });

  // Additional: ActivityHeatmap days prop updates with time range
  it('should pass updated days prop to ActivityHeatmap when time range changes', async () => {
    const user = userEvent.setup();
    const modules = createModules(5);
    render(<PerformanceCharts modules={modules} />);

    // Default: 30
    expect(screen.getByTestId('activity-heatmap').textContent).toBe('30');

    // Switch to 7 Days
    await user.click(screen.getByText('7 Days'));
    expect(screen.getByTestId('activity-heatmap').textContent).toBe('7');

    // Switch to 3 Months
    await user.click(screen.getByText('3 Months'));
    expect(screen.getByTestId('activity-heatmap').textContent).toBe('90');
  });

  // Additional: Prediction section hidden when prediction is null
  it('should hide prediction section when prediction is null', () => {
    const modules = createModules(5);
    jest.clearAllMocks();
    PerformanceTracker.getRecentPerformance.mockReturnValue([]);
    PerformanceTracker.getWeeklyVelocity.mockReturnValue([]);
    PerformanceTracker.getConfidenceDistribution.mockReturnValue({
      needsReview: 0,
      moderate: 0,
      confident: 0,
      notRated: 0,
    });
    PerformanceTracker.predictCompletionDate.mockReturnValue(null);

    render(<PerformanceCharts modules={modules} />);

    expect(screen.queryByText('Estimated Completion:')).not.toBeInTheDocument();
  });

  // Additional: Chart description text rendered
  it('should render chart descriptions for each chart card', () => {
    const modules = createModules(5);
    render(<PerformanceCharts modules={modules} />);

    expect(screen.getByText('Your overall course completion percentage')).toBeInTheDocument();
    expect(screen.getByText('Daily study activity heatmap')).toBeInTheDocument();
    expect(screen.getByText('Modules completed per week')).toBeInTheDocument();
    expect(screen.getByText('How confident you feel about each module')).toBeInTheDocument();
  });

  // Additional: Confidence distribution passed modules array
  it('should pass modules to getConfidenceDistribution', () => {
    const modules = createModules(5);
    render(<PerformanceCharts modules={modules} />);

    expect(PerformanceTracker.getConfidenceDistribution).toHaveBeenCalledWith(modules);
  });

  // Additional: predictCompletionDate receives modules and total count
  it('should pass modules and count to predictCompletionDate', () => {
    const modules = createModules(5);
    render(<PerformanceCharts modules={modules} />);

    expect(PerformanceTracker.predictCompletionDate).toHaveBeenCalledWith(modules, modules.length);
  });
});
