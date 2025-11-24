// Study streak tracking utility using localStorage
import { format, subDays } from 'date-fns';

export const StreakTracker = {
  // Initialize or get streak data
  getStreakData() {
    const data = localStorage.getItem('study-streak');
    if (!data) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: null,
        streakHistory: [],
      };
    }
    return JSON.parse(data);
  },

  // Save streak data
  saveStreakData(data) {
    localStorage.setItem('study-streak', JSON.stringify(data));
  },

  // Get today's date in ISO format (YYYY-MM-DD)
  getTodayDate() {
    return format(new Date(), 'yyyy-MM-dd');
  },

  // Get yesterday's date in ISO format
  getYesterdayDate() {
    return format(subDays(new Date(), 1), 'yyyy-MM-dd');
  },

  // Record a study activity (video, lab, or flashcard)
  recordStudyActivity(activityType = 'general') {
    const data = this.getStreakData();
    const today = this.getTodayDate();
    const yesterday = this.getYesterdayDate();

    // If already studied today, just increment activity count
    if (data.lastStudyDate === today) {
      // Find today's entry in history and increment
      const todayEntry = data.streakHistory.find(entry => entry.date === today);
      if (todayEntry) {
        todayEntry.activitiesCompleted += 1;
        todayEntry.activities.push({
          type: activityType,
          timestamp: new Date().toISOString(),
        });
      } else {
        // Create today's entry
        data.streakHistory.push({
          date: today,
          activitiesCompleted: 1,
          activities: [
            {
              type: activityType,
              timestamp: new Date().toISOString(),
            },
          ],
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

    // Add today to history
    data.streakHistory.push({
      date: today,
      activitiesCompleted: 1,
      activities: [
        {
          type: activityType,
          timestamp: new Date().toISOString(),
        },
      ],
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
    localStorage.removeItem('study-streak');
  },
};

export default StreakTracker;
