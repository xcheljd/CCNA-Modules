import { ActivityTracker } from '../activityTracker';

// Mock all three tracker dependencies
jest.mock('../progressTracker', () => ({
  __esModule: true,
  default: {
    markVideoComplete: jest.fn(),
    unmarkVideoComplete: jest.fn(),
    markLabComplete: jest.fn(),
    unmarkLabComplete: jest.fn(),
    markFlashcardsAdded: jest.fn(),
    unmarkFlashcardsAdded: jest.fn(),
    setModuleConfidence: jest.fn(),
    clearModuleConfidence: jest.fn(),
    getModuleStatistics: jest.fn(),
  },
}));

jest.mock('../streakTracker', () => ({
  __esModule: true,
  default: {
    recordStudyActivity: jest.fn(),
    checkStreakStatus: jest.fn(),
    getStreakInfo: jest.fn(),
    getRecentActivity: jest.fn(),
  },
}));

jest.mock('../performanceTracker', () => ({
  __esModule: true,
  default: {
    recordDailySnapshot: jest.fn(),
    getPerformanceData: jest.fn(),
    getTodayDate: jest.fn(),
    getRecentPerformance: jest.fn(),
  },
}));

import ProgressTracker from '../progressTracker';
import StreakTracker from '../streakTracker';
import PerformanceTracker from '../performanceTracker';

const mockModules = [
  { id: 1, day: 1, title: 'Network Devices' },
  { id: 2, day: 2, title: 'OSI Model' },
];

describe('ActivityTracker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('recordVideoCompletion', () => {
    it('marks video complete when isComplete is true', () => {
      ActivityTracker.recordVideoCompletion('mod1', 'vid1', true, mockModules);

      expect(ProgressTracker.markVideoComplete).toHaveBeenCalledWith('mod1', 'vid1');
      expect(ProgressTracker.unmarkVideoComplete).not.toHaveBeenCalled();
    });

    it('calls unmarkVideoComplete when isComplete is false', () => {
      ActivityTracker.recordVideoCompletion('mod1', 'vid1', false, mockModules);

      expect(ProgressTracker.unmarkVideoComplete).toHaveBeenCalledWith('mod1', 'vid1');
      expect(ProgressTracker.markVideoComplete).not.toHaveBeenCalled();
    });

    it('does not call streak or performance when isComplete is false', () => {
      ActivityTracker.recordVideoCompletion('mod1', 'vid1', false, mockModules);

      expect(StreakTracker.recordStudyActivity).not.toHaveBeenCalled();
      expect(PerformanceTracker.recordDailySnapshot).not.toHaveBeenCalled();
    });

    it('records streak activity with "video" type when isComplete is true', () => {
      ActivityTracker.recordVideoCompletion('mod1', 'vid1', true, mockModules);

      expect(StreakTracker.recordStudyActivity).toHaveBeenCalledWith('video');
    });

    it('records performance snapshot when isComplete is true and modules provided', () => {
      ActivityTracker.recordVideoCompletion('mod1', 'vid1', true, mockModules);

      expect(PerformanceTracker.recordDailySnapshot).toHaveBeenCalledWith(mockModules);
    });

    it('skips performance snapshot when modules is null', () => {
      ActivityTracker.recordVideoCompletion('mod1', 'vid1', true, null);

      expect(StreakTracker.recordStudyActivity).toHaveBeenCalledWith('video');
      expect(PerformanceTracker.recordDailySnapshot).not.toHaveBeenCalled();
    });

    it('skips performance snapshot when modules is undefined', () => {
      ActivityTracker.recordVideoCompletion('mod1', 'vid1', true);

      expect(PerformanceTracker.recordDailySnapshot).not.toHaveBeenCalled();
    });
  });

  describe('recordLabCompletion', () => {
    it('marks lab complete when isComplete is true', () => {
      ActivityTracker.recordLabCompletion('mod1', 0, true, mockModules);

      expect(ProgressTracker.markLabComplete).toHaveBeenCalledWith('mod1', 0);
      expect(ProgressTracker.unmarkLabComplete).not.toHaveBeenCalled();
    });

    it('calls unmarkLabComplete when isComplete is false', () => {
      ActivityTracker.recordLabCompletion('mod1', 0, false, mockModules);

      expect(ProgressTracker.unmarkLabComplete).toHaveBeenCalledWith('mod1', 0);
      expect(ProgressTracker.markLabComplete).not.toHaveBeenCalled();
    });

    it('records streak with "lab" and snapshot when isComplete is true', () => {
      ActivityTracker.recordLabCompletion('mod1', 0, true, mockModules);

      expect(StreakTracker.recordStudyActivity).toHaveBeenCalledWith('lab');
      expect(PerformanceTracker.recordDailySnapshot).toHaveBeenCalledWith(mockModules);
    });

    it('does not call streak or performance when isComplete is false', () => {
      ActivityTracker.recordLabCompletion('mod1', 0, false, mockModules);

      expect(StreakTracker.recordStudyActivity).not.toHaveBeenCalled();
      expect(PerformanceTracker.recordDailySnapshot).not.toHaveBeenCalled();
    });

    it('skips snapshot when modules is null for lab completion', () => {
      ActivityTracker.recordLabCompletion('mod1', 0, true, null);

      expect(StreakTracker.recordStudyActivity).toHaveBeenCalledWith('lab');
      expect(PerformanceTracker.recordDailySnapshot).not.toHaveBeenCalled();
    });
  });

  describe('recordFlashcardsAdded', () => {
    it('marks flashcards added when isAdded is true', () => {
      ActivityTracker.recordFlashcardsAdded('mod1', true, mockModules);

      expect(ProgressTracker.markFlashcardsAdded).toHaveBeenCalledWith('mod1');
      expect(ProgressTracker.unmarkFlashcardsAdded).not.toHaveBeenCalled();
    });

    it('calls unmarkFlashcardsAdded when isAdded is false', () => {
      ActivityTracker.recordFlashcardsAdded('mod1', false, mockModules);

      expect(ProgressTracker.unmarkFlashcardsAdded).toHaveBeenCalledWith('mod1');
      expect(ProgressTracker.markFlashcardsAdded).not.toHaveBeenCalled();
    });

    it('records streak with "flashcard" and snapshot when isAdded is true', () => {
      ActivityTracker.recordFlashcardsAdded('mod1', true, mockModules);

      expect(StreakTracker.recordStudyActivity).toHaveBeenCalledWith('flashcard');
      expect(PerformanceTracker.recordDailySnapshot).toHaveBeenCalledWith(mockModules);
    });

    it('does not call streak or performance when isAdded is false', () => {
      ActivityTracker.recordFlashcardsAdded('mod1', false, mockModules);

      expect(StreakTracker.recordStudyActivity).not.toHaveBeenCalled();
      expect(PerformanceTracker.recordDailySnapshot).not.toHaveBeenCalled();
    });

    it('skips snapshot when modules is null for flashcard add', () => {
      ActivityTracker.recordFlashcardsAdded('mod1', true, null);

      expect(StreakTracker.recordStudyActivity).toHaveBeenCalledWith('flashcard');
      expect(PerformanceTracker.recordDailySnapshot).not.toHaveBeenCalled();
    });
  });

  describe('recordConfidenceRating', () => {
    it('sets confidence when rating is non-zero', () => {
      ActivityTracker.recordConfidenceRating('mod1', 4, mockModules);

      expect(ProgressTracker.setModuleConfidence).toHaveBeenCalledWith('mod1', 4);
      expect(ProgressTracker.clearModuleConfidence).not.toHaveBeenCalled();
    });

    it('clears confidence when rating is zero', () => {
      ActivityTracker.recordConfidenceRating('mod1', 0, mockModules);

      expect(ProgressTracker.clearModuleConfidence).toHaveBeenCalledWith('mod1');
      expect(ProgressTracker.setModuleConfidence).not.toHaveBeenCalled();
    });

    it('records performance snapshot when modules provided', () => {
      ActivityTracker.recordConfidenceRating('mod1', 3, mockModules);

      expect(PerformanceTracker.recordDailySnapshot).toHaveBeenCalledWith(mockModules);
    });

    it('skips performance snapshot when modules is null', () => {
      ActivityTracker.recordConfidenceRating('mod1', 3, null);

      expect(PerformanceTracker.recordDailySnapshot).not.toHaveBeenCalled();
    });

    it('records snapshot even when clearing confidence (rating=0) with modules', () => {
      ActivityTracker.recordConfidenceRating('mod1', 0, mockModules);

      expect(PerformanceTracker.recordDailySnapshot).toHaveBeenCalledWith(mockModules);
    });
  });

  describe('initializeTracking', () => {
    it('checks streak status', () => {
      PerformanceTracker.getPerformanceData.mockReturnValue({ lastSnapshotDate: null });
      PerformanceTracker.getTodayDate.mockReturnValue('2025-01-15');

      ActivityTracker.initializeTracking(mockModules);

      expect(StreakTracker.checkStreakStatus).toHaveBeenCalled();
    });

    it('records snapshot when none exists for today', () => {
      PerformanceTracker.getPerformanceData.mockReturnValue({ lastSnapshotDate: '2025-01-14' });
      PerformanceTracker.getTodayDate.mockReturnValue('2025-01-15');

      ActivityTracker.initializeTracking(mockModules);

      expect(PerformanceTracker.recordDailySnapshot).toHaveBeenCalledWith(mockModules);
    });

    it('skips snapshot when one already exists for today', () => {
      PerformanceTracker.getPerformanceData.mockReturnValue({ lastSnapshotDate: '2025-01-15' });
      PerformanceTracker.getTodayDate.mockReturnValue('2025-01-15');

      ActivityTracker.initializeTracking(mockModules);

      expect(PerformanceTracker.recordDailySnapshot).not.toHaveBeenCalled();
    });

    it('skips snapshot when modules is null', () => {
      PerformanceTracker.getPerformanceData.mockReturnValue({ lastSnapshotDate: null });
      PerformanceTracker.getTodayDate.mockReturnValue('2025-01-15');

      ActivityTracker.initializeTracking(null);

      expect(PerformanceTracker.recordDailySnapshot).not.toHaveBeenCalled();
    });

    it('skips snapshot when modules is empty array', () => {
      PerformanceTracker.getPerformanceData.mockReturnValue({ lastSnapshotDate: null });
      PerformanceTracker.getTodayDate.mockReturnValue('2025-01-15');

      ActivityTracker.initializeTracking([]);

      expect(PerformanceTracker.recordDailySnapshot).not.toHaveBeenCalled();
    });
  });

  describe('getComprehensiveStats', () => {
    it('returns aggregated stats from all trackers', () => {
      const mockProgress = { overallProgress: 50, completedModules: 5 };
      const mockStreak = { currentStreak: 7, longestStreak: 14 };
      const mockRecentActivity = [{ date: '2025-01-15', count: 3 }];
      const mockPerformance = [{ date: '2025-01-15', overallProgress: 50 }];

      ProgressTracker.getModuleStatistics.mockReturnValue(mockProgress);
      StreakTracker.getStreakInfo.mockReturnValue(mockStreak);
      StreakTracker.getRecentActivity.mockReturnValue(mockRecentActivity);
      PerformanceTracker.getRecentPerformance.mockReturnValue(mockPerformance);

      const stats = ActivityTracker.getComprehensiveStats(mockModules);

      expect(stats).toEqual({
        progress: mockProgress,
        streak: mockStreak,
        recentActivity: mockRecentActivity,
        performance: mockPerformance,
      });
    });

    it('calls getRecentActivity with 7 days', () => {
      ProgressTracker.getModuleStatistics.mockReturnValue({});
      StreakTracker.getStreakInfo.mockReturnValue({});
      StreakTracker.getRecentActivity.mockReturnValue([]);
      PerformanceTracker.getRecentPerformance.mockReturnValue([]);

      ActivityTracker.getComprehensiveStats(mockModules);

      expect(StreakTracker.getRecentActivity).toHaveBeenCalledWith(7);
    });

    it('calls getRecentPerformance with 30 days', () => {
      ProgressTracker.getModuleStatistics.mockReturnValue({});
      StreakTracker.getStreakInfo.mockReturnValue({});
      StreakTracker.getRecentActivity.mockReturnValue([]);
      PerformanceTracker.getRecentPerformance.mockReturnValue([]);

      ActivityTracker.getComprehensiveStats(mockModules);

      expect(PerformanceTracker.getRecentPerformance).toHaveBeenCalledWith(30);
    });

    it('passes modules to getModuleStatistics', () => {
      ProgressTracker.getModuleStatistics.mockReturnValue({});
      StreakTracker.getStreakInfo.mockReturnValue({});
      StreakTracker.getRecentActivity.mockReturnValue([]);
      PerformanceTracker.getRecentPerformance.mockReturnValue([]);

      ActivityTracker.getComprehensiveStats(mockModules);

      expect(ProgressTracker.getModuleStatistics).toHaveBeenCalledWith(mockModules);
    });
  });
});
