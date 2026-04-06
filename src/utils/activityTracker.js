// Centralized activity tracking utility that coordinates all tracking systems
import ProgressTracker from './progressTracker';
import StreakTracker from './streakTracker';
import PerformanceTracker from './performanceTracker';

export const ActivityTracker = {
  // Record video completion with full tracking integration
  recordVideoCompletion(moduleId, videoId, isComplete, modules) {
    if (isComplete) {
      ProgressTracker.markVideoComplete(moduleId, videoId);
      // Record streak activity
      StreakTracker.recordStudyActivity('video');
      // Update performance snapshot
      if (modules) {
        PerformanceTracker.recordDailySnapshot(modules);
      }
    } else {
      ProgressTracker.unmarkVideoComplete(moduleId, videoId);
    }
  },

  // Record lab completion with full tracking integration
  recordLabCompletion(moduleId, isComplete, modules) {
    if (isComplete) {
      ProgressTracker.markLabComplete(moduleId);
      // Record streak activity
      StreakTracker.recordStudyActivity('lab');
      // Update performance snapshot
      if (modules) {
        PerformanceTracker.recordDailySnapshot(modules);
      }
    } else {
      ProgressTracker.unmarkLabComplete(moduleId);
    }
  },

  // Record flashcard addition with full tracking integration
  recordFlashcardsAdded(moduleId, isAdded, modules) {
    if (isAdded) {
      ProgressTracker.markFlashcardsAdded(moduleId);
      // Record streak activity
      StreakTracker.recordStudyActivity('flashcard');
      // Update performance snapshot
      if (modules) {
        PerformanceTracker.recordDailySnapshot(modules);
      }
    } else {
      ProgressTracker.unmarkFlashcardsAdded(moduleId);
    }
  },

  // Record confidence rating with performance snapshot update
  recordConfidenceRating(moduleId, confidence, modules) {
    if (confidence === 0) {
      ProgressTracker.clearModuleConfidence(moduleId);
    } else {
      ProgressTracker.setModuleConfidence(moduleId, confidence);
    }
    // Update performance snapshot to reflect new confidence
    if (modules) {
      PerformanceTracker.recordDailySnapshot(modules);
    }
  },

  // Initialize tracking on app start
  initializeTracking(modules) {
    // Check and update streak status
    StreakTracker.checkStreakStatus();

    // Record initial snapshot if needed
    if (modules && modules.length > 0) {
      const perfData = PerformanceTracker.getPerformanceData();
      const today = PerformanceTracker.getTodayDate();

      // Only create snapshot if we don't have one for today
      if (perfData.lastSnapshotDate !== today) {
        PerformanceTracker.recordDailySnapshot(modules);
      }
    }
  },

  // Get comprehensive stats for display
  getComprehensiveStats(modules) {
    return {
      progress: ProgressTracker.getModuleStatistics(modules),
      streak: StreakTracker.getStreakInfo(),
      recentActivity: StreakTracker.getRecentActivity(7),
      performance: PerformanceTracker.getRecentPerformance(30),
    };
  },
};

export default ActivityTracker;
