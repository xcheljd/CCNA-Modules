// Performance tracking utilities for historical data and analytics
import { format, subDays, eachDayOfInterval, parseISO, differenceInCalendarDays } from 'date-fns';
import { getTodayDate as getTodayDateFn } from './dateHelpers';
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
    try {
      return JSON.parse(data);
    } catch {
      console.error('Corrupted performance-history data, resetting to defaults');
      localStorage.removeItem('performance-history');
      return { daily: [], weekly: [], lastSnapshotDate: null };
    }
  },

  // Save performance data
  savePerformanceData(data) {
    try {
      localStorage.setItem('performance-history', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving performance data:', error);
    }
  },

  // Date helper delegated to dateHelpers.js
  getTodayDate() {
    return getTodayDateFn();
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

    const allDays = eachDayOfInterval({
      start: subDays(today, days - 1),
      end: today,
    });

    // Index existing snapshots by date for O(1) lookup.
    const data = this.getPerformanceRange(
      format(subDays(today, days - 1), 'yyyy-MM-dd'),
      format(today, 'yyyy-MM-dd')
    );
    const byDate = new Map(data.map(entry => [entry.date, entry]));

    // Walk oldest -> newest, carrying forward the last seen snapshot so
    // missing days inherit the prior cumulative totals instead of dropping
    // to zero. Days before the first snapshot remain zeroed (no progress
    // had been recorded yet).
    let lastSeen = null;
    return allDays.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const existing = byDate.get(dateStr);
      if (existing) {
        lastSeen = existing;
        return existing;
      }
      if (lastSeen) {
        return { ...lastSeen, date: dateStr };
      }
      return {
        date: dateStr,
        overallProgress: 0,
        modulesCompleted: 0,
        videosCompleted: 0,
        labsCompleted: 0,
        flashcardsAdded: 0,
        avgConfidence: 0,
      };
    });
  },

  // Get modules completed per week (velocity)
  getWeeklyVelocity(weeks = 8) {
    const today = new Date();
    const velocityData = [];

    // Build a single carry-forward view of the entire window (oldest week's
    // start through today). This is consistent with getRecentPerformance:
    // missing days inherit the last seen snapshot's cumulative totals so a
    // week with sparse data is not undercounted. Previously this method used
    // getPerformanceRange, which dropped missing days entirely and produced
    // misleading velocity whenever a week had gaps.
    const totalDays = weeks * 7;
    const windowStart = subDays(today, totalDays - 1);
    const windowStartStr = format(windowStart, 'yyyy-MM-dd');
    const todayStr = format(today, 'yyyy-MM-dd');

    const allDays = eachDayOfInterval({ start: windowStart, end: today });
    const realSnapshots = this.getPerformanceRange(windowStartStr, todayStr);
    const byDate = new Map(realSnapshots.map(entry => [entry.date, entry]));
    const carryForwardByDate = new Map();

    let lastSeen = null;
    for (const date of allDays) {
      const dateStr = format(date, 'yyyy-MM-dd');
      const existing = byDate.get(dateStr);
      if (existing) {
        lastSeen = existing;
      }
      if (lastSeen) {
        carryForwardByDate.set(dateStr, lastSeen);
      }
    }

    for (let i = weeks - 1; i >= 0; i--) {
      const weekEnd = subDays(today, i * 7);
      const weekStart = subDays(weekEnd, 6);

      const weekStartStr = format(weekStart, 'yyyy-MM-dd');
      const weekEndStr = format(weekEnd, 'yyyy-MM-dd');

      const firstDay = carryForwardByDate.get(weekStartStr);
      const lastDay = carryForwardByDate.get(weekEndStr);

      let modulesCompleted = 0;
      if (firstDay && lastDay) {
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

    // Compute velocity directly from real snapshots within the last 14 days.
    // Using getRecentPerformance() here would zero-fill synthetic leading days
    // (days before the first real snapshot), which inflates the delta and
    // overstates velocity. Instead, we look at the actual snapshots recorded
    // in the 14-day window and divide by the number of elapsed days between
    // the first and last real snapshot (minimum 1 to avoid divide-by-zero).
    const today = getTodayDateFn();
    const cutoff = format(subDays(new Date(), 13), 'yyyy-MM-dd');
    const recentSnapshots = data.daily.filter(entry => entry.date >= cutoff && entry.date <= today);

    if (recentSnapshots.length === 0) return null;

    const firstSnapshot = recentSnapshots[0];
    const lastSnapshot = recentSnapshots[recentSnapshots.length - 1];

    const completedModules = lastSnapshot.modulesCompleted;
    const remainingModules = totalModules - completedModules;

    if (remainingModules <= 0) return 'Completed';

    const modulesGain = lastSnapshot.modulesCompleted - firstSnapshot.modulesCompleted;
    // Days between the first and last real snapshot (inclusive). Use parseISO
    // for timezone-safe parsing of yyyy-MM-dd, then differenceInCalendarDays.
    const daysElapsed = Math.max(
      1,
      differenceInCalendarDays(parseISO(lastSnapshot.date), parseISO(firstSnapshot.date))
    );
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
