// Performance tracking utilities for historical data and analytics
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import ProgressTracker from './progressTracker';

export const PerformanceTracker = {
  // Get or initialize performance data
  getPerformanceData() {
    const data = localStorage.getItem('performance-history');
    if (!data) {
      return {
        daily: [],
        weekly: [],
        lastSnapshotDate: null,
      };
    }
    return JSON.parse(data);
  },

  // Save performance data
  savePerformanceData(data) {
    localStorage.setItem('performance-history', JSON.stringify(data));
  },

  // Get today's date in ISO format
  getTodayDate() {
    return format(new Date(), 'yyyy-MM-dd');
  },

  // Record daily snapshot of progress
  recordDailySnapshot(modules) {
    const data = this.getPerformanceData();
    const today = this.getTodayDate();

    // Check if we already have a snapshot for today
    const existingIndex = data.daily.findIndex(entry => entry.date === today);

    // Calculate current stats using consolidated utility
    const overallProgress = ProgressTracker.getOverallProgress(modules);
    const stats = ProgressTracker.getModuleStatistics(modules);

    const snapshot = {
      date: today,
      overallProgress: Math.round(overallProgress * 10) / 10, // Round to 1 decimal
      modulesCompleted: stats.completedModules,
      videosCompleted: stats.completedVideos,
      labsCompleted: stats.completedLabs,
      flashcardsAdded: stats.addedFlashcards,
      avgConfidence: stats.avgConfidence,
    };

    if (existingIndex >= 0) {
      // Update existing snapshot
      data.daily[existingIndex] = snapshot;
    } else {
      // Add new snapshot
      data.daily.push(snapshot);
    }

    // Keep only last 365 days
    if (data.daily.length > 365) {
      data.daily = data.daily.slice(-365);
    }

    data.lastSnapshotDate = today;
    this.savePerformanceData(data);
    return snapshot;
  },

  // Get performance data for a date range
  getPerformanceRange(startDate, endDate) {
    const data = this.getPerformanceData();
    return data.daily.filter(entry => {
      return entry.date >= startDate && entry.date <= endDate;
    });
  },

  // Get last N days of performance data
  getRecentPerformance(days = 30) {
    const today = new Date();
    const startDate = format(subDays(today, days - 1), 'yyyy-MM-dd');
    const endDate = format(today, 'yyyy-MM-dd');

    const data = this.getPerformanceRange(startDate, endDate);

    // Fill in missing days with previous values or zeros
    const allDays = eachDayOfInterval({
      start: subDays(today, days - 1),
      end: today,
    });

    return allDays.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const existing = data.find(d => d.date === dateStr);
      return (
        existing || {
          date: dateStr,
          overallProgress: 0,
          modulesCompleted: 0,
          videosCompleted: 0,
          labsCompleted: 0,
          flashcardsAdded: 0,
          avgConfidence: 0,
        }
      );
    });
  },

  // Calculate weekly aggregated data
  calculateWeeklyData(_modules) {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Sunday

    const weekStartStr = format(weekStart, 'yyyy-MM-dd');
    const weekData = this.getPerformanceRange(weekStartStr, format(weekEnd, 'yyyy-MM-dd'));

    if (weekData.length === 0) return null;

    const firstDay = weekData[0];
    const lastDay = weekData[weekData.length - 1];

    return {
      weekStart: weekStartStr,
      modulesCompletedThisWeek: lastDay.modulesCompleted - (firstDay.modulesCompleted || 0),
      videosCompletedThisWeek: lastDay.videosCompleted - (firstDay.videosCompleted || 0),
      labsCompletedThisWeek: lastDay.labsCompleted - (firstDay.labsCompleted || 0),
      progressGain: lastDay.overallProgress - (firstDay.overallProgress || 0),
      avgConfidence: lastDay.avgConfidence,
    };
  },

  // Get modules completed per week (velocity)
  getWeeklyVelocity(weeks = 8) {
    const velocityData = [];

    for (let i = weeks - 1; i >= 0; i--) {
      const weekEnd = subDays(new Date(), i * 7);
      const weekStart = subDays(weekEnd, 6);

      const weekStartStr = format(weekStart, 'yyyy-MM-dd');
      const weekEndStr = format(weekEnd, 'yyyy-MM-dd');

      const weekData = this.getPerformanceRange(weekStartStr, weekEndStr);

      let modulesCompleted = 0;
      if (weekData.length >= 2) {
        const firstDay = weekData[0];
        const lastDay = weekData[weekData.length - 1];
        modulesCompleted = Math.max(0, lastDay.modulesCompleted - firstDay.modulesCompleted);
      }

      velocityData.push({
        week: format(weekStart, 'MMM d'),
        modulesCompleted,
      });
    }

    return velocityData;
  },

  // Predict completion date based on velocity
  predictCompletionDate(modules, totalModules) {
    const data = this.getPerformanceData();
    if (data.daily.length < 7) return null; // Need at least a week of data

    // Get last 14 days of data
    const recentData = this.getRecentPerformance(14);
    const firstDay = recentData[0];
    const lastDay = recentData[recentData.length - 1];

    if (!firstDay || !lastDay) return null;

    const completedModules = lastDay.modulesCompleted;
    const remainingModules = totalModules - completedModules;

    if (remainingModules <= 0) return 'Completed';

    // Calculate velocity (modules per day)
    const modulesGain = lastDay.modulesCompleted - firstDay.modulesCompleted;
    const daysElapsed = 14;
    const velocity = modulesGain / daysElapsed;

    if (velocity <= 0) return 'Unknown';

    // Calculate days needed
    const daysNeeded = Math.ceil(remainingModules / velocity);
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + daysNeeded);

    return format(completionDate, 'MMM d, yyyy');
  },

  // Get confidence distribution
  getConfidenceDistribution(modules) {
    const distribution = {
      needsReview: 0, // 1-2 stars
      moderate: 0, // 3 stars
      confident: 0, // 4-5 stars
      notRated: 0, // 0 stars
    };

    modules.forEach(module => {
      const confidence = ProgressTracker.getModuleConfidence(module.id);
      const progress = ProgressTracker.getModuleProgress(module);

      // Only count modules that have been started
      if (progress > 0) {
        if (confidence === 0) {
          distribution.notRated += 1;
        } else if (confidence <= 2) {
          distribution.needsReview += 1;
        } else if (confidence === 3) {
          distribution.moderate += 1;
        } else {
          distribution.confident += 1;
        }
      }
    });

    return distribution;
  },

  // Reset performance data
  resetPerformanceData() {
    localStorage.removeItem('performance-history');
  },
};

export default PerformanceTracker;
