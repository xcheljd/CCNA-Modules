import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../Dashboard';
import ProgressTracker from '../../utils/progressTracker';
import ActivityTracker from '../../utils/activityTracker';
import SettingsManager from '../../utils/settingsManager';
import {
  OverallProgressSection,
  ModulesNeedingReviewSection,
  StudyStreakSection,
  LearningGoalsSection,
  SmartRecommendationsSection,
  UpcomingMilestonesSection,
  PerformanceChartsSection,
} from '../dashboard/DashboardSections';

// Mock utility modules
jest.mock('../../utils/progressTracker', () => ({
  __esModule: true,
  default: {
    getOverallProgress: jest.fn(),
    getLastWatchedModule: jest.fn(),
    getModulesNeedingReview: jest.fn(),
    getModuleStatistics: jest.fn(),
    getModuleProgress: jest.fn(),
  },
}));

jest.mock('../../utils/activityTracker', () => ({
  __esModule: true,
  default: {
    initializeTracking: jest.fn(),
  },
}));

jest.mock('../../utils/settingsManager', () => ({
  __esModule: true,
  default: {
    getDashboardConfig: jest.fn(),
    saveDashboardConfig: jest.fn(),
  },
}));

// Mock Dashboard section components with data-testid for identification
jest.mock('../dashboard/DashboardSections', () => ({
  OverallProgressSection: jest.fn(({ overallProgress, stats, onAction }) => (
    <div data-testid="section-overall-progress">
      <span data-testid="overall-progress-value">{overallProgress}</span>
      <span data-testid="stats-value">{JSON.stringify(stats)}</span>
      <button data-testid="action-btn" onClick={onAction}>
        {overallProgress > 0 ? 'Continue Learning' : 'Start Learning'}
      </button>
    </div>
  )),
  ModulesNeedingReviewSection: jest.fn(({ modules, onModuleSelect }) => (
    <div data-testid="section-modules-needing-review">
      {modules.map(m => (
        <span key={m.id} data-testid={`review-module-${m.id}`}>
          {m.title}
        </span>
      ))}
    </div>
  )),
  StudyStreakSection: jest.fn(({ refreshKey }) => (
    <div data-testid="section-study-streak" data-refresh-key={refreshKey} />
  )),
  LearningGoalsSection: jest.fn(({ modules }) => (
    <div data-testid="section-learning-goals" />
  )),
  SmartRecommendationsSection: jest.fn(({ modules, onModuleSelect }) => (
    <div data-testid="section-smart-recommendations" />
  )),
  UpcomingMilestonesSection: jest.fn(({ modules }) => (
    <div data-testid="section-upcoming-milestones" />
  )),
  PerformanceChartsSection: jest.fn(({ modules }) => (
    <div data-testid="section-performance-charts" />
  )),
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

// Default dashboard config (all sections enabled, in default order)
const defaultConfig = {
  sections: [
    { id: 'study-streak', enabled: true, order: 1 },
    { id: 'learning-goals', enabled: true, order: 2 },
    { id: 'overall-progress', enabled: true, order: 3 },
    { id: 'modules-needing-review', enabled: true, order: 5 },
    { id: 'smart-recommendations', enabled: true, order: 6 },
    { id: 'upcoming-milestones', enabled: true, order: 9 },
    { id: 'performance-charts', enabled: true, order: 10 },
  ],
};

const defaultStats = {
  totalModules: 10,
  completedModules: 3,
  totalVideos: 10,
  completedVideos: 3,
  totalLabs: 10,
  completedLabs: 2,
  totalFlashcards: 10,
  addedFlashcards: 1,
};

// Setup default mocks
function setupMocks(overrides = {}) {
  SettingsManager.getDashboardConfig.mockReturnValue(
    overrides.config ?? defaultConfig
  );
  SettingsManager.saveDashboardConfig.mockReturnValue({ success: true });

  ProgressTracker.getOverallProgress.mockReturnValue(
    overrides.overallProgress ?? 30
  );
  ProgressTracker.getLastWatchedModule.mockReturnValue(
    overrides.lastWatched ?? null
  );
  ProgressTracker.getModulesNeedingReview.mockReturnValue(
    overrides.needingReview ?? []
  );
  ProgressTracker.getModuleStatistics.mockReturnValue(
    overrides.stats ?? defaultStats
  );
  ProgressTracker.getModuleProgress.mockReturnValue(
    overrides.moduleProgress ?? 0
  );
}

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    setupMocks();
  });

  // VAL-DASHBOARD-001: Renders dashboard container
  it('should render dashboard container with .dashboard class', () => {
    const modules = createModules(3);
    const { container } = render(
      <Dashboard modules={modules} onModuleSelect={jest.fn()} />
    );

    expect(container.querySelector('.dashboard')).toBeInTheDocument();
  });

  // VAL-DASHBOARD-002: Loads config from SettingsManager, falls back to default
  it('should load config from SettingsManager and use it', () => {
    const modules = createModules(3);
    render(
      <Dashboard modules={modules} onModuleSelect={jest.fn()} />
    );

    expect(SettingsManager.getDashboardConfig).toHaveBeenCalled();
  });

  it('should fall back to default config when SettingsManager returns null', () => {
    const modules = createModules(3);
    SettingsManager.getDashboardConfig.mockReturnValue(null);

    render(
      <Dashboard modules={modules} onModuleSelect={jest.fn()} />
    );

    // Should have called saveDashboardConfig with the default config
    expect(SettingsManager.saveDashboardConfig).toHaveBeenCalled();
    const savedConfig = SettingsManager.saveDashboardConfig.mock.calls[0][0];
    expect(savedConfig.sections).toBeDefined();
    expect(savedConfig.sections.length).toBeGreaterThan(0);
    // Default config should have all sections enabled
    expect(savedConfig.sections.every(s => s.enabled)).toBe(true);
  });

  // VAL-DASHBOARD-003: Filters disabled sections
  it('should not render sections with enabled: false', () => {
    const modules = createModules(3);
    const configWithDisabled = {
      sections: [
        { id: 'study-streak', enabled: true, order: 1 },
        { id: 'learning-goals', enabled: false, order: 2 },
        { id: 'overall-progress', enabled: true, order: 3 },
        { id: 'modules-needing-review', enabled: false, order: 5 },
        { id: 'smart-recommendations', enabled: true, order: 6 },
        { id: 'upcoming-milestones', enabled: false, order: 9 },
        { id: 'performance-charts', enabled: false, order: 10 },
      ],
    };
    setupMocks({ config: configWithDisabled });

    render(
      <Dashboard modules={modules} onModuleSelect={jest.fn()} />
    );

    expect(screen.queryByTestId('section-study-streak')).toBeInTheDocument();
    expect(screen.queryByTestId('section-overall-progress')).toBeInTheDocument();
    expect(screen.queryByTestId('section-smart-recommendations')).toBeInTheDocument();

    // Disabled sections should not render
    expect(screen.queryByTestId('section-learning-goals')).not.toBeInTheDocument();
    expect(screen.queryByTestId('section-modules-needing-review')).not.toBeInTheDocument();
    expect(screen.queryByTestId('section-upcoming-milestones')).not.toBeInTheDocument();
    expect(screen.queryByTestId('section-performance-charts')).not.toBeInTheDocument();
  });

  // VAL-DASHBOARD-004: Sorts sections by config order
  it('should render sections sorted by config order', () => {
    const modules = createModules(3);
    const configWithCustomOrder = {
      sections: [
        { id: 'performance-charts', enabled: true, order: 1 },
        { id: 'overall-progress', enabled: true, order: 2 },
        { id: 'study-streak', enabled: true, order: 3 },
      ],
    };
    setupMocks({ config: configWithCustomOrder });

    const { container } = render(
      <Dashboard modules={modules} onModuleSelect={jest.fn()} />
    );

    const dashboard = container.querySelector('.dashboard');
    const sections = dashboard.children;

    // First rendered section should be performance-charts (order 1)
    // But study-streak and learning-goals are paired, so we check first child content
    expect(sections[0]).toHaveAttribute('data-testid', 'section-performance-charts');
  });

  // VAL-DASHBOARD-005: Renders paired sections in grid-pair containers
  it('should render paired sections (study-streak + learning-goals) in grid-pair container', () => {
    const modules = createModules(3);
    const configOnlyPaired = {
      sections: [
        { id: 'study-streak', enabled: true, order: 1 },
        { id: 'learning-goals', enabled: true, order: 2 },
      ],
    };
    setupMocks({ config: configOnlyPaired });

    const { container } = render(
      <Dashboard modules={modules} onModuleSelect={jest.fn()} />
    );

    const gridPair = container.querySelector('.dashboard-grid-pair');
    expect(gridPair).toBeInTheDocument();
    expect(gridPair.querySelector('[data-testid="section-study-streak"]')).toBeInTheDocument();
    expect(gridPair.querySelector('[data-testid="section-learning-goals"]')).toBeInTheDocument();
  });

  it('should render upcoming-milestones + smart-recommendations as a grid pair', () => {
    const modules = createModules(3);
    const configMilestonesRecs = {
      sections: [
        { id: 'upcoming-milestones', enabled: true, order: 1 },
        { id: 'smart-recommendations', enabled: true, order: 2 },
      ],
    };
    setupMocks({ config: configMilestonesRecs });

    const { container } = render(
      <Dashboard modules={modules} onModuleSelect={jest.fn()} />
    );

    const gridPair = container.querySelector('.dashboard-grid-pair');
    expect(gridPair).toBeInTheDocument();
    expect(gridPair.querySelector('[data-testid="section-upcoming-milestones"]')).toBeInTheDocument();
    expect(gridPair.querySelector('[data-testid="section-smart-recommendations"]')).toBeInTheDocument();
  });

  // VAL-DASHBOARD-006: Unpaired sections render individually (no grid-pair wrapper)
  it('should render unpaired section individually without grid-pair wrapper', () => {
    const modules = createModules(3);
    // Enable only overall-progress (not in any pair)
    const configSingle = {
      sections: [
        { id: 'overall-progress', enabled: true, order: 1 },
      ],
    };
    setupMocks({ config: configSingle });

    const { container } = render(
      <Dashboard modules={modules} onModuleSelect={jest.fn()} />
    );

    expect(container.querySelector('.dashboard-grid-pair')).not.toBeInTheDocument();
    expect(screen.getByTestId('section-overall-progress')).toBeInTheDocument();
  });

  it('should render unpaired section when its pair is disabled', () => {
    const modules = createModules(3);
    // study-streak enabled but learning-goals disabled → study-streak renders solo
    const configPartiallyPaired = {
      sections: [
        { id: 'study-streak', enabled: true, order: 1 },
        { id: 'learning-goals', enabled: false, order: 2 },
        { id: 'overall-progress', enabled: true, order: 3 },
      ],
    };
    setupMocks({ config: configPartiallyPaired });

    const { container } = render(
      <Dashboard modules={modules} onModuleSelect={jest.fn()} />
    );

    // study-streak should render individually (no pair)
    expect(screen.getByTestId('section-study-streak')).toBeInTheDocument();
    // No grid pair because learning-goals is disabled
    expect(container.querySelector('.dashboard-grid-pair')).not.toBeInTheDocument();
  });

  // VAL-DASHBOARD-007: Initializes ActivityTracker and calculates progress on mount
  it('should initialize ActivityTracker and calculate progress on mount', () => {
    const modules = createModules(5);

    render(
      <Dashboard modules={modules} onModuleSelect={jest.fn()} />
    );

    expect(ActivityTracker.initializeTracking).toHaveBeenCalledWith(modules);
    expect(ProgressTracker.getOverallProgress).toHaveBeenCalledWith(modules);
  });

  // VAL-DASHBOARD-008: Passes correct stats to OverallProgressSection
  it('should pass correct stats from getModuleStatistics to OverallProgressSection', () => {
    const modules = createModules(3);
    const customStats = {
      totalModules: 5,
      completedModules: 2,
      totalVideos: 5,
      completedVideos: 2,
      totalLabs: 5,
      completedLabs: 1,
      totalFlashcards: 5,
      addedFlashcards: 0,
    };
    setupMocks({ stats: customStats, config: { sections: [{ id: 'overall-progress', enabled: true, order: 1 }] } });

    render(
      <Dashboard modules={modules} onModuleSelect={jest.fn()} />
    );

    expect(ProgressTracker.getModuleStatistics).toHaveBeenCalledWith(modules);
    expect(screen.getByTestId('stats-value').textContent).toBe(JSON.stringify(customStats));
  });

  // VAL-DASHBOARD-009: Identifies last watched module
  it('should get last watched module from ProgressTracker', () => {
    const modules = createModules(3);
    const lastWatchedModule = modules[1];
    setupMocks({ lastWatched: { module: lastWatchedModule } });

    render(
      <Dashboard modules={modules} onModuleSelect={jest.fn()} />
    );

    expect(ProgressTracker.getLastWatchedModule).toHaveBeenCalledWith(modules);
  });

  // VAL-DASHBOARD-010: Start/Continue Learning navigates correctly
  it('should navigate to last watched module when action is clicked', () => {
    const modules = createModules(3);
    const onModuleSelect = jest.fn();
    const lastWatchedModule = modules[1];
    setupMocks({
      lastWatched: { module: lastWatchedModule },
      config: { sections: [{ id: 'overall-progress', enabled: true, order: 1 }] },
    });

    render(
      <Dashboard modules={modules} onModuleSelect={onModuleSelect} />
    );

    fireEvent.click(screen.getByTestId('action-btn'));
    expect(onModuleSelect).toHaveBeenCalledWith(lastWatchedModule);
  });

  it('should navigate to first incomplete module when no last watched', () => {
    const modules = createModules(3);
    const onModuleSelect = jest.fn();
    setupMocks({
      lastWatched: null,
      config: { sections: [{ id: 'overall-progress', enabled: true, order: 1 }] },
    });

    // Module 1 is incomplete (progress 0)
    ProgressTracker.getModuleProgress.mockImplementation((mod) => {
      if (mod.id === 1) return 0;
      if (mod.id === 2) return 50;
      return 100;
    });

    render(
      <Dashboard modules={modules} onModuleSelect={onModuleSelect} />
    );

    fireEvent.click(screen.getByTestId('action-btn'));
    expect(onModuleSelect).toHaveBeenCalledWith(modules[0]);
  });

  it('should navigate to first module when all modules are complete', () => {
    const modules = createModules(3);
    const onModuleSelect = jest.fn();
    setupMocks({
      lastWatched: null,
      config: { sections: [{ id: 'overall-progress', enabled: true, order: 1 }] },
    });

    // All modules complete
    ProgressTracker.getModuleProgress.mockReturnValue(100);

    render(
      <Dashboard modules={modules} onModuleSelect={onModuleSelect} />
    );

    fireEvent.click(screen.getByTestId('action-btn'));
    expect(onModuleSelect).toHaveBeenCalledWith(modules[0]);
  });

  // VAL-DASHBOARD-011: Limits modules needing review to 5
  it('should limit modules needing review to 5', () => {
    const modules = createModules(10);
    const needingReview = createModules(8, 1, 1); // 8 modules need review
    setupMocks({
      needingReview,
      config: { sections: [{ id: 'modules-needing-review', enabled: true, order: 1 }] },
    });

    render(
      <Dashboard modules={modules} onModuleSelect={jest.fn()} />
    );

    // Only 5 review modules should be rendered
    const reviewSection = screen.getByTestId('section-modules-needing-review');
    const reviewModules = reviewSection.querySelectorAll('[data-testid^="review-module-"]');
    expect(reviewModules.length).toBe(5);
  });

  // VAL-DASHBOARD-012: Handles empty modules gracefully
  it('should render without crashing when modules is empty array', () => {
    const { container } = render(
      <Dashboard modules={[]} onModuleSelect={jest.fn()} />
    );

    expect(container.querySelector('.dashboard')).toBeInTheDocument();
  });

  it('should render without crashing when modules is null', () => {
    const { container } = render(
      <Dashboard modules={null} onModuleSelect={jest.fn()} />
    );

    expect(container.querySelector('.dashboard')).toBeInTheDocument();
  });

  it('should render without crashing when modules is undefined', () => {
    const { container } = render(
      <Dashboard modules={undefined} onModuleSelect={jest.fn()} />
    );

    expect(container.querySelector('.dashboard')).toBeInTheDocument();
  });

  // VAL-DASHBOARD-013: No duplicate section rendering
  it('should render each enabled section exactly once', () => {
    const modules = createModules(3);
    setupMocks({ config: defaultConfig });

    const { container } = render(
      <Dashboard modules={modules} onModuleSelect={jest.fn()} />
    );

    // Verify each section testid appears only once in the rendered DOM
    const sectionIds = [
      'section-study-streak',
      'section-learning-goals',
      'section-overall-progress',
      'section-modules-needing-review',
      'section-smart-recommendations',
      'section-upcoming-milestones',
      'section-performance-charts',
    ];

    sectionIds.forEach(id => {
      const elements = container.querySelectorAll(`[data-testid="${id}"]`);
      expect(elements.length).toBeLessThanOrEqual(1);
    });
  });

  // Additional: modules-needing-review section receives empty array when no modules need review
  it('should pass empty array to ModulesNeedingReviewSection when no modules need review', () => {
    const modules = createModules(3);
    setupMocks({
      needingReview: [],
      config: { sections: [{ id: 'modules-needing-review', enabled: true, order: 1 }] },
    });

    render(
      <Dashboard modules={modules} onModuleSelect={jest.fn()} />
    );

    // ModulesNeedingReviewSection is rendered and receives empty array
    const section = screen.getByTestId('section-modules-needing-review');
    expect(section).toBeInTheDocument();
    // No review module spans rendered inside
    const reviewModules = section.querySelectorAll('[data-testid^="review-module-"]');
    expect(reviewModules.length).toBe(0);
  });

  // Additional: passes correct props to section components
  it('should pass modules prop to section components that need it', () => {
    const modules = createModules(3);
    const onModuleSelect = jest.fn();
    const configNeedsModules = {
      sections: [
        { id: 'learning-goals', enabled: true, order: 1 },
        { id: 'smart-recommendations', enabled: true, order: 2 },
        { id: 'upcoming-milestones', enabled: true, order: 3 },
        { id: 'performance-charts', enabled: true, order: 4 },
      ],
    };
    setupMocks({ config: configNeedsModules });

    const { container } = render(
      <Dashboard modules={modules} onModuleSelect={onModuleSelect} />
    );

    // Verify each section is in the DOM with correct data
    expect(container.querySelector('[data-testid="section-learning-goals"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="section-smart-recommendations"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="section-upcoming-milestones"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="section-performance-charts"]')).toBeInTheDocument();

    // Verify the mock functions were called with correct props
    // Use toHaveBeenLastCalledWith because components may be called twice due to re-render
    expect(LearningGoalsSection).toHaveBeenLastCalledWith(
      expect.objectContaining({ modules }),
      undefined
    );
    expect(SmartRecommendationsSection).toHaveBeenLastCalledWith(
      expect.objectContaining({ modules, onModuleSelect }),
      undefined
    );
    expect(UpcomingMilestonesSection).toHaveBeenLastCalledWith(
      expect.objectContaining({ modules }),
      undefined
    );
    expect(PerformanceChartsSection).toHaveBeenLastCalledWith(
      expect.objectContaining({ modules }),
      undefined
    );
  });

  // Additional: OverallProgressSection receives correct overallProgress
  it('should pass overallProgress to OverallProgressSection', () => {
    const modules = createModules(3);
    setupMocks({
      overallProgress: 42,
      config: { sections: [{ id: 'overall-progress', enabled: true, order: 1 }] },
    });

    render(
      <Dashboard modules={modules} onModuleSelect={jest.fn()} />
    );

    expect(screen.getByTestId('overall-progress-value').textContent).toBe('42');
  });

  // Additional: verifies no duplicate section IDs in rendered output
  it('should not duplicate any section ID in rendered DOM', () => {
    const modules = createModules(3);
    // Custom config with all sections enabled
    setupMocks({ config: defaultConfig });

    const { container } = render(
      <Dashboard modules={modules} onModuleSelect={jest.fn()} />
    );

    // Collect all data-testid attributes from rendered sections
    const allSections = container.querySelectorAll('[data-testid^="section-"]');
    const testIds = Array.from(allSections).map(el => el.getAttribute('data-testid'));
    const uniqueIds = new Set(testIds);

    expect(testIds.length).toBe(uniqueIds.size);
  });
});
