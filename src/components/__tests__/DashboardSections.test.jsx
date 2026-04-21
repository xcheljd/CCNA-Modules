import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  OverallProgressSection,
  ModulesNeedingReviewSection,
  StudyStreakSection,
  LearningGoalsSection,
  SmartRecommendationsSection,
  UpcomingMilestonesSection,
  PerformanceChartsSection,
} from '../dashboard/DashboardSections';

// Mock child components
jest.mock('../StudyStreak', () => () => <div data-testid="study-streak" />);
jest.mock('../GoalCard', () => () => <div data-testid="goal-card" />);
jest.mock('../PerformanceCharts', () => () => <div data-testid="performance-charts" />);
jest.mock('../UpcomingMilestones', () => () => <div data-testid="upcoming-milestones" />);
jest.mock('../SmartRecommendations', () => () => <div data-testid="smart-recommendations" />);

jest.mock('../../utils/progressTracker', () => ({
  __esModule: true,
  default: {
    getModuleProgress: jest.fn().mockReturnValue(50),
    getModuleConfidence: jest.fn().mockReturnValue(3),
  },
}));

jest.mock('../../utils/colorHelpers', () => ({
  __esModule: true,
  default: {
    getProgressColor: jest.fn().mockReturnValue('#22c55e'),
    getConfidenceColor: jest.fn().mockReturnValue('#22c55e'),
  },
}));

// Mock UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardHeader: ({ children }) => <div data-testid="card-header">{children}</div>,
  CardContent: ({ children }) => <div data-testid="card-content">{children}</div>,
  CardTitle: ({ children }) => <h2 data-testid="card-title">{children}</h2>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className }) => (
    <button data-testid="button" onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

jest.mock('../ui/Icons', () => ({
  CircularProgress: ({ percentage }) => (
    <div data-testid="circular-progress" data-percentage={percentage} />
  ),
  GridIcon: ({ className }) => <div data-testid="grid-icon" className={className} />,
  VideoIcon: ({ className }) => <div data-testid="video-icon" className={className} />,
  LabIcon: ({ className }) => <div data-testid="lab-icon" className={className} />,
  FlashcardsIcon: ({ className }) => <div data-testid="flashcards-icon" className={className} />,
}));

const mockStats = {
  completedModules: 5,
  totalModules: 20,
  completedVideos: 30,
  totalVideos: 100,
  completedLabs: 10,
  totalLabs: 40,
  addedFlashcards: 50,
  totalFlashcards: 200,
};

const mockModules = [
  {
    id: 'mod-1',
    day: 1,
    title: 'Networking Basics',
    videos: [],
    labs: [],
    flashcards: [],
  },
  {
    id: 'mod-2',
    day: 2,
    title: 'OSI Model',
    videos: [],
    labs: [],
    flashcards: [],
  },
];

describe('OverallProgressSection', () => {
  it('renders with CircularProgress and stats grid', () => {
    render(<OverallProgressSection overallProgress={25} stats={mockStats} onAction={jest.fn()} />);

    expect(screen.getByTestId('circular-progress')).toBeInTheDocument();
    expect(screen.getByTestId('circular-progress')).toHaveAttribute('data-percentage', '25');
    expect(screen.getByText('5/20')).toBeInTheDocument(); // Modules
    expect(screen.getByText('30/100')).toBeInTheDocument(); // Videos
    expect(screen.getByText('10/40')).toBeInTheDocument(); // Labs
    expect(screen.getByText('50/200')).toBeInTheDocument(); // Flashcards
    expect(screen.getByText('Modules')).toBeInTheDocument();
    expect(screen.getByText('Videos')).toBeInTheDocument();
    expect(screen.getByText('Labs')).toBeInTheDocument();
    expect(screen.getByText('Flashcards')).toBeInTheDocument();
  });

  it('shows Start Learning when progress is 0', () => {
    render(<OverallProgressSection overallProgress={0} stats={mockStats} onAction={jest.fn()} />);

    expect(screen.getByText(/📚 Start Learning/)).toBeInTheDocument();
  });

  it('shows Continue Learning when progress > 0', () => {
    render(<OverallProgressSection overallProgress={50} stats={mockStats} onAction={jest.fn()} />);

    expect(screen.getByText(/▶️ Continue Learning/)).toBeInTheDocument();
  });

  it('fires onAction on button click', () => {
    const onAction = jest.fn();
    render(<OverallProgressSection overallProgress={25} stats={mockStats} onAction={onAction} />);

    const button = screen.getByTestId('button');
    fireEvent.click(button);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('renders card with title', () => {
    render(<OverallProgressSection overallProgress={25} stats={mockStats} onAction={jest.fn()} />);

    expect(screen.getByText('Overall Progress')).toBeInTheDocument();
  });
});

describe('ModulesNeedingReviewSection', () => {
  it('renders modules list', () => {
    render(<ModulesNeedingReviewSection modules={mockModules} onModuleSelect={jest.fn()} />);

    expect(screen.getByText('Modules Needing Review')).toBeInTheDocument();
    expect(screen.getByText(/Day 1: Networking Basics/)).toBeInTheDocument();
    expect(screen.getByText(/Day 2: OSI Model/)).toBeInTheDocument();
  });

  it('returns null when modules is empty', () => {
    const { container } = render(
      <ModulesNeedingReviewSection modules={[]} onModuleSelect={jest.fn()} />
    );

    expect(container.innerHTML).toBe('');
  });

  it('fires onModuleSelect on click', () => {
    const onModuleSelect = jest.fn();
    render(<ModulesNeedingReviewSection modules={mockModules} onModuleSelect={onModuleSelect} />);

    const moduleItem = screen.getByText(/Day 1: Networking Basics/);
    fireEvent.click(moduleItem);
    expect(onModuleSelect).toHaveBeenCalledWith(mockModules[0]);
  });

  it('displays progress and confidence for each module', () => {
    render(<ModulesNeedingReviewSection modules={mockModules} onModuleSelect={jest.fn()} />);

    // Both modules have the same mocked confidence/progress values
    const confidenceElements = screen.getAllByText('Confidence: 3/5');
    expect(confidenceElements).toHaveLength(2);
    const progressElements = screen.getAllByText('Progress: 50%');
    expect(progressElements).toHaveLength(2);
  });
});

describe('StudyStreakSection', () => {
  it('renders StudyStreak child', () => {
    render(<StudyStreakSection refreshKey={0} />);

    expect(screen.getByTestId('study-streak')).toBeInTheDocument();
    expect(screen.getByText('Study Streak')).toBeInTheDocument();
  });
});

describe('LearningGoalsSection', () => {
  it('renders GoalCard child', () => {
    render(<LearningGoalsSection modules={mockModules} />);

    expect(screen.getByTestId('goal-card')).toBeInTheDocument();
    expect(screen.getByText('Your Learning Goals')).toBeInTheDocument();
  });
});

describe('SmartRecommendationsSection', () => {
  it('renders SmartRecommendations child', () => {
    render(<SmartRecommendationsSection modules={mockModules} onModuleSelect={jest.fn()} />);

    expect(screen.getByTestId('smart-recommendations')).toBeInTheDocument();
    expect(screen.getByText('Smart Recommendations')).toBeInTheDocument();
  });
});

describe('UpcomingMilestonesSection', () => {
  it('renders UpcomingMilestones child', () => {
    render(<UpcomingMilestonesSection modules={mockModules} />);

    expect(screen.getByTestId('upcoming-milestones')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Milestones')).toBeInTheDocument();
  });
});

describe('PerformanceChartsSection', () => {
  it('renders PerformanceCharts child', () => {
    render(<PerformanceChartsSection modules={mockModules} />);

    expect(screen.getByTestId('performance-charts')).toBeInTheDocument();
    expect(screen.getByText('Performance Analytics')).toBeInTheDocument();
  });
});
