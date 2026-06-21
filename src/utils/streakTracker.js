// Study streak tracking utility using localStorage
import { format, subDays } from 'date-fns';
import {
  getTodayDate as getTodayDateFn,
  getYesterdayDate as getYesterdayDateFn,
} from './dateHelpers';

// In-memory write-through cache for the study-streak localStorage key.
// The cache stores the raw string from localStorage.getItem (NOT the
// parsed object) and is invalidated on every write. All StreakTracker
// reads and writes MUST go through cachedRead/cachedWrite to maintain
// consistency. Mirrors the pattern in progressTracker.js.
const STREAK_KEY = 'study-streak';
const streakReadCache = new Map();

function cachedRead() {
  if (streakReadCache.has(STREAK_KEY)) return streakReadCache.get(STREAK_KEY);
  const value = localStorage.getItem(STREAK_KEY);
  streakReadCache.set(STREAK_KEY, value);
  return value;
}

function cachedWrite(value) {
  localStorage.setItem(STREAK_KEY, value);
  streakReadCache.set(STREAK_KEY, value);
}

function cachedRemove() {
  localStorage.removeItem(STREAK_KEY);
  streakReadCache.set(STREAK_KEY, null);
}

function invalidateCache() {
  streakReadCache.clear();
}

// Exposed for test isolation only: tests seed localStorage directly to
// simulate prior sessions, which bypasses the cache. Resetting the cache
// between tests keeps those direct seeds visible to the read methods.
// Not intended for production use.
export function __invalidateReadCache() {
  invalidateCache();
}

export const StreakTracker = {
  // Initialize or get streak data
  getStreakData() {
    const data = cachedRead();
    if (!data) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: null,
        streakHistory: [],
      };
    }
    try {
      return JSON.parse(data);
    } catch {
      console.error('Corrupted study-streak data, resetting to defaults');
      cachedRemove();
      return { currentStreak: 0, longestStreak: 0, lastStudyDate: null, streakHistory: [] };
    }
  },

  // Save streak data
  saveStreakData(data) {
    try {
      cachedWrite(JSON.stringify(data));
    } catch (error) {
      console.error('Error saving streak data:', error);
    }
  },

  // Date helpers delegated to dateHelpers.js
  getTodayDate() {
    return getTodayDateFn();
  },
  getYesterdayDate() {
    return getYesterdayDateFn();
  },

  // Record a study activity (video, lab, or flashcard)
  recordStudyActivity(_activityType = 'general') {
    const data = this.getStreakData();
    const today = this.getTodayDate();
    const yesterday = this.getYesterdayDate();

    // If already studied today, just increment activity count
    if (data.lastStudyDate === today) {
      // Find today's entry in history and increment
      const todayEntry = data.streakHistory.find(entry => entry.date === today);
      if (todayEntry) {
        todayEntry.activitiesCompleted += 1;
      } else {
        // Create today's entry (activitiesCompleted only -- per-activity
        // timestamps were removed as unused; see migration 1->2 for cleanup
        // of legacy data).
        data.streakHistory.push({
          date: today,
          activitiesCompleted: 1,
        });
      }
      this.saveStreakData(data);
      return data;
    }

    // New study day
    if (data.lastStudyDate === yesterday) {
      // Continue streak
      data.currentStreak += 1;
    } else if (data.lastStudyDate === null) {
      // First time studying
      data.currentStreak = 1;
    } else {
      // Streak broken - start new streak
      data.currentStreak = 1;
    }

    // Update longest streak
    if (data.currentStreak > data.longestStreak) {
      data.longestStreak = data.currentStreak;
    }

    // Update last study date
    data.lastStudyDate = today;

    // Add today to history (activitiesCompleted only -- per-activity
    // timestamps were removed as unused; see migration 1->2 for cleanup
    // of legacy data).
    data.streakHistory.push({
      date: today,
      activitiesCompleted: 1,
    });

    // Keep only last 365 days of history
    if (data.streakHistory.length > 365) {
      data.streakHistory = data.streakHistory.slice(-365);
    }

    this.saveStreakData(data);
    return data;
  },

  // Check streak status (call on app load)
  checkStreakStatus() {
    const data = this.getStreakData();
    const today = this.getTodayDate();
    const yesterday = this.getYesterdayDate();

    // If last study was before yesterday, streak is broken
    if (data.lastStudyDate && data.lastStudyDate !== today && data.lastStudyDate !== yesterday) {
      data.currentStreak = 0;
      this.saveStreakData(data);
    }

    return data;
  },

  // Get streak information
  getStreakInfo() {
    return this.checkStreakStatus();
  },

  // Get activity calendar for a specific month
  getStreakCalendar(year, month) {
    const data = this.getStreakData();
    const calendar = {};

    // Filter history for the specified month
    data.streakHistory.forEach(entry => {
      const entryDate = new Date(entry.date);
      if (entryDate.getFullYear() === year && entryDate.getMonth() === month) {
        calendar[entry.date] = {
          activitiesCompleted: entry.activitiesCompleted,
          intensity: Math.min(entry.activitiesCompleted, 4), // Cap at 4 for color intensity
        };
      }
    });

    return calendar;
  },

  // Get last N days of activity
  getRecentActivity(days = 7) {
    const data = this.getStreakData();
    const recentDates = [];
    const today = new Date();

    // Generate array of last N days using date-fns
    for (let i = days - 1; i >= 0; i--) {
      const dateStr = format(subDays(today, i), 'yyyy-MM-dd');
      recentDates.push(dateStr);
    }

    // Map to activity data
    return recentDates.map(date => {
      const entry = data.streakHistory.find(h => h.date === date);
      return {
        date,
        activitiesCompleted: entry ? entry.activitiesCompleted : 0,
        hasActivity: !!entry,
      };
    });
  },

  // Check if streak is at risk (no activity today)
  isStreakAtRisk() {
    const data = this.getStreakData();
    const today = this.getTodayDate();

    // Streak is at risk if current streak > 0 and no activity today
    return data.currentStreak > 0 && data.lastStudyDate !== today;
  },

  // Get streak milestone progress
  getStreakMilestones() {
    const data = this.getStreakData();
    const milestones = [
      { days: 7, name: '7-Day Warrior', achieved: false },
      { days: 14, name: '2-Week Champion', achieved: false },
      { days: 30, name: 'Monthly Master', achieved: false },
      { days: 60, name: '60-Day Dedication', achieved: false },
      { days: 100, name: 'Century Scholar', achieved: false },
    ];

    return milestones.map(milestone => ({
      ...milestone,
      achieved: data.longestStreak >= milestone.days,
      progress:
        data.currentStreak >= milestone.days ? 100 : (data.currentStreak / milestone.days) * 100,
    }));
  },

  // Reset all streak data
  resetStreakData() {
    cachedRemove();
  },
};

export default StreakTracker;
