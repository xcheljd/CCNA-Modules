import { StreakTracker } from '../streakTracker';

describe('StreakTracker', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ============================================================
  // getStreakData
  // ============================================================
  describe('getStreakData', () => {
    it('returns defaults when localStorage is empty', () => {
      const data = StreakTracker.getStreakData();

      expect(data).toEqual({
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: null,
        streakHistory: [],
      });
    });

    it('returns parsed data from localStorage', () => {
      const stored = {
        currentStreak: 5,
        longestStreak: 10,
        lastStudyDate: '2025-01-14',
        streakHistory: [{ date: '2025-01-14', activitiesCompleted: 3, activities: [] }],
      };
      localStorage.setItem('study-streak', JSON.stringify(stored));

      const data = StreakTracker.getStreakData();

      expect(data).toEqual(stored);
    });

    it('recovers from corrupted data by removing key and returning defaults', () => {
      localStorage.setItem('study-streak', '{invalid json!!!');

      const data = StreakTracker.getStreakData();

      expect(data).toEqual({
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: null,
        streakHistory: [],
      });
      expect(localStorage.getItem('study-streak')).toBeNull();
    });
  });

  // ============================================================
  // saveStreakData
  // ============================================================
  describe('saveStreakData', () => {
    it('persists data to localStorage', () => {
      const data = {
        currentStreak: 3,
        longestStreak: 7,
        lastStudyDate: '2025-01-15',
        streakHistory: [],
      };

      StreakTracker.saveStreakData(data);

      expect(JSON.parse(localStorage.getItem('study-streak'))).toEqual(data);
    });

    it('handles localStorage write failure without crashing', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      // Temporarily make setItem throw for the 'study-streak' key
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => {
        StreakTracker.saveStreakData({ currentStreak: 1 });
      }).not.toThrow();

      expect(consoleSpy).toHaveBeenCalledWith('Error saving streak data:', expect.any(Error));

      localStorage.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });
  });

  // ============================================================
  // recordStudyActivity
  // ============================================================
  describe('recordStudyActivity', () => {
    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date('2025-01-15T12:00:00'));
    });

    it('starts streak at 1 for first-time study', () => {
      const data = StreakTracker.recordStudyActivity('video');

      expect(data.currentStreak).toBe(1);
      expect(data.longestStreak).toBe(1);
      expect(data.lastStudyDate).toBe('2025-01-15');
    });

    it('increments streak when last study was yesterday', () => {
      const existing = {
        currentStreak: 3,
        longestStreak: 5,
        lastStudyDate: '2025-01-14',
        streakHistory: [{ date: '2025-01-14', activitiesCompleted: 2, activities: [] }],
      };
      localStorage.setItem('study-streak', JSON.stringify(existing));

      const data = StreakTracker.recordStudyActivity('lab');

      expect(data.currentStreak).toBe(4);
      expect(data.longestStreak).toBe(5);
      expect(data.lastStudyDate).toBe('2025-01-15');
    });

    it('does not change streak on same-day repeat activity', () => {
      const existing = {
        currentStreak: 3,
        longestStreak: 5,
        lastStudyDate: '2025-01-15',
        streakHistory: [
          {
            date: '2025-01-15',
            activitiesCompleted: 1,
            activities: [{ type: 'video', timestamp: '2025-01-15T10:00:00.000Z' }],
          },
        ],
      };
      localStorage.setItem('study-streak', JSON.stringify(existing));

      const data = StreakTracker.recordStudyActivity('lab');

      expect(data.currentStreak).toBe(3);
      expect(data.longestStreak).toBe(5);
      expect(data.lastStudyDate).toBe('2025-01-15');
    });

    it('increments activity count on same-day repeat', () => {
      const existing = {
        currentStreak: 3,
        longestStreak: 5,
        lastStudyDate: '2025-01-15',
        streakHistory: [
          {
            date: '2025-01-15',
            activitiesCompleted: 1,
            activities: [{ type: 'video', timestamp: '2025-01-15T10:00:00.000Z' }],
          },
        ],
      };
      localStorage.setItem('study-streak', JSON.stringify(existing));

      const data = StreakTracker.recordStudyActivity('lab');

      const todayEntry = data.streakHistory.find(e => e.date === '2025-01-15');
      expect(todayEntry.activitiesCompleted).toBe(2);
      expect(todayEntry.activities).toHaveLength(2);
      expect(todayEntry.activities[1].type).toBe('lab');
    });

    it('resets streak to 1 when streak is broken', () => {
      const existing = {
        currentStreak: 10,
        longestStreak: 10,
        lastStudyDate: '2025-01-12',
        streakHistory: [{ date: '2025-01-12', activitiesCompleted: 2, activities: [] }],
      };
      localStorage.setItem('study-streak', JSON.stringify(existing));

      const data = StreakTracker.recordStudyActivity('video');

      expect(data.currentStreak).toBe(1);
      expect(data.longestStreak).toBe(10);
      expect(data.lastStudyDate).toBe('2025-01-15');
    });

    it('updates longestStreak when currentStreak exceeds it', () => {
      const existing = {
        currentStreak: 9,
        longestStreak: 9,
        lastStudyDate: '2025-01-14',
        streakHistory: [],
      };
      localStorage.setItem('study-streak', JSON.stringify(existing));

      const data = StreakTracker.recordStudyActivity('video');

      expect(data.currentStreak).toBe(10);
      expect(data.longestStreak).toBe(10);
    });

    it('adds history entry for new study day', () => {
      const data = StreakTracker.recordStudyActivity('video');

      expect(data.streakHistory).toHaveLength(1);
      expect(data.streakHistory[0]).toEqual({
        date: '2025-01-15',
        activitiesCompleted: 1,
        activities: [
          {
            type: 'video',
            timestamp: new Date().toISOString(),
          },
        ],
      });
    });

    it('trims history to 365 entries when exceeded', () => {
      const history = [];
      for (let i = 365; i >= 1; i--) {
        const d = new Date('2025-01-15');
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        history.push({ date: dateStr, activitiesCompleted: 1, activities: [] });
      }
      const existing = {
        currentStreak: 365,
        longestStreak: 365,
        lastStudyDate: '2025-01-14',
        streakHistory: history,
      };
      localStorage.setItem('study-streak', JSON.stringify(existing));

      const data = StreakTracker.recordStudyActivity('video');

      expect(data.streakHistory.length).toBe(365);
      // The latest entry should be today
      expect(data.streakHistory[364].date).toBe('2025-01-15');
      // The oldest entry should be from 364 days ago (the original first entry was trimmed)
    });

    it('uses "general" as default activity type', () => {
      const data = StreakTracker.recordStudyActivity();

      expect(data.streakHistory[0].activities[0].type).toBe('general');
    });
  });

  // ============================================================
  // checkStreakStatus
  // ============================================================
  describe('checkStreakStatus', () => {
    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date('2025-01-15T12:00:00'));
    });

    it('resets streak to 0 when last study was before yesterday', () => {
      const existing = {
        currentStreak: 5,
        longestStreak: 10,
        lastStudyDate: '2025-01-12',
        streakHistory: [],
      };
      localStorage.setItem('study-streak', JSON.stringify(existing));

      const data = StreakTracker.checkStreakStatus();

      expect(data.currentStreak).toBe(0);
      expect(data.longestStreak).toBe(10);
    });

    it('preserves streak when last study was today', () => {
      const existing = {
        currentStreak: 5,
        longestStreak: 10,
        lastStudyDate: '2025-01-15',
        streakHistory: [],
      };
      localStorage.setItem('study-streak', JSON.stringify(existing));

      const data = StreakTracker.checkStreakStatus();

      expect(data.currentStreak).toBe(5);
    });

    it('preserves streak when last study was yesterday', () => {
      const existing = {
        currentStreak: 5,
        longestStreak: 10,
        lastStudyDate: '2025-01-14',
        streakHistory: [],
      };
      localStorage.setItem('study-streak', JSON.stringify(existing));

      const data = StreakTracker.checkStreakStatus();

      expect(data.currentStreak).toBe(5);
    });

    it('does nothing when lastStudyDate is null', () => {
      const existing = {
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: null,
        streakHistory: [],
      };
      localStorage.setItem('study-streak', JSON.stringify(existing));

      const data = StreakTracker.checkStreakStatus();

      expect(data.currentStreak).toBe(0);
      expect(data.lastStudyDate).toBeNull();
    });
  });

  // ============================================================
  // getStreakCalendar
  // ============================================================
  describe('getStreakCalendar', () => {
    it('returns entries for specified month with intensity capped at 4', () => {
      const history = [
        {
          date: '2025-01-05',
          activitiesCompleted: 2,
          activities: [],
        },
        {
          date: '2025-01-15',
          activitiesCompleted: 7,
          activities: [],
        },
        {
          date: '2025-01-28',
          activitiesCompleted: 3,
          activities: [],
        },
      ];
      localStorage.setItem(
        'study-streak',
        JSON.stringify({
          currentStreak: 1,
          longestStreak: 1,
          lastStudyDate: '2025-01-15',
          streakHistory: history,
        })
      );

      const calendar = StreakTracker.getStreakCalendar(2025, 0); // January = month 0

      expect(Object.keys(calendar)).toHaveLength(3);
      expect(calendar['2025-01-05']).toEqual({
        activitiesCompleted: 2,
        intensity: 2,
      });
      expect(calendar['2025-01-15']).toEqual({
        activitiesCompleted: 7,
        intensity: 4, // capped from 7
      });
      expect(calendar['2025-01-28']).toEqual({
        activitiesCompleted: 3,
        intensity: 3,
      });
    });

    it('returns empty object for month with no activity', () => {
      localStorage.setItem(
        'study-streak',
        JSON.stringify({
          currentStreak: 0,
          longestStreak: 0,
          lastStudyDate: null,
          streakHistory: [],
        })
      );

      const calendar = StreakTracker.getStreakCalendar(2025, 5); // June

      expect(calendar).toEqual({});
    });

    it('caps intensity at 4 for high activity counts', () => {
      localStorage.setItem(
        'study-streak',
        JSON.stringify({
          currentStreak: 1,
          longestStreak: 1,
          lastStudyDate: '2025-03-10',
          streakHistory: [
            { date: '2025-03-10', activitiesCompleted: 10, activities: [] },
            { date: '2025-03-11', activitiesCompleted: 1, activities: [] },
            { date: '2025-03-12', activitiesCompleted: 4, activities: [] },
            { date: '2025-03-13', activitiesCompleted: 3, activities: [] },
          ],
        })
      );

      const calendar = StreakTracker.getStreakCalendar(2025, 2); // March

      expect(calendar['2025-03-10'].intensity).toBe(4); // 10 capped to 4
      expect(calendar['2025-03-11'].intensity).toBe(1);
      expect(calendar['2025-03-12'].intensity).toBe(4); // exactly 4 stays 4
      expect(calendar['2025-03-13'].intensity).toBe(3);
    });
  });

  // ============================================================
  // getRecentActivity
  // ============================================================
  describe('getRecentActivity', () => {
    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date('2025-01-15T12:00:00'));
    });

    it('returns last 7 days with correct structure by default', () => {
      localStorage.setItem(
        'study-streak',
        JSON.stringify({
          currentStreak: 2,
          longestStreak: 2,
          lastStudyDate: '2025-01-14',
          streakHistory: [{ date: '2025-01-14', activitiesCompleted: 3, activities: [] }],
        })
      );

      const recent = StreakTracker.getRecentActivity();

      expect(recent).toHaveLength(7);
      // First day should be 6 days ago: 2025-01-09
      expect(recent[0].date).toBe('2025-01-09');
      // Last day should be today
      expect(recent[6].date).toBe('2025-01-15');
      // The day with activity
      const dayWithActivity = recent.find(d => d.date === '2025-01-14');
      expect(dayWithActivity).toEqual({
        date: '2025-01-14',
        activitiesCompleted: 3,
        hasActivity: true,
      });
      // A day without activity
      const emptyDay = recent.find(d => d.date === '2025-01-09');
      expect(emptyDay).toEqual({
        date: '2025-01-09',
        activitiesCompleted: 0,
        hasActivity: false,
      });
    });

    it('returns last N days when specified', () => {
      localStorage.setItem(
        'study-streak',
        JSON.stringify({
          currentStreak: 0,
          longestStreak: 0,
          lastStudyDate: null,
          streakHistory: [],
        })
      );

      const recent = StreakTracker.getRecentActivity(3);

      expect(recent).toHaveLength(3);
      expect(recent[0].date).toBe('2025-01-13');
      expect(recent[1].date).toBe('2025-01-14');
      expect(recent[2].date).toBe('2025-01-15');
    });

    it('fills missing days with zeros', () => {
      localStorage.setItem(
        'study-streak',
        JSON.stringify({
          currentStreak: 0,
          longestStreak: 0,
          lastStudyDate: null,
          streakHistory: [],
        })
      );

      const recent = StreakTracker.getRecentActivity(3);

      recent.forEach(day => {
        expect(day.activitiesCompleted).toBe(0);
        expect(day.hasActivity).toBe(false);
      });
    });
  });

  // ============================================================
  // isStreakAtRisk
  // ============================================================
  describe('isStreakAtRisk', () => {
    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date('2025-01-15T12:00:00'));
    });

    it('returns true when streak > 0 and not studied today', () => {
      localStorage.setItem(
        'study-streak',
        JSON.stringify({
          currentStreak: 5,
          longestStreak: 10,
          lastStudyDate: '2025-01-14',
          streakHistory: [],
        })
      );

      expect(StreakTracker.isStreakAtRisk()).toBe(true);
    });

    it('returns false when streak is 0', () => {
      localStorage.setItem(
        'study-streak',
        JSON.stringify({
          currentStreak: 0,
          longestStreak: 0,
          lastStudyDate: null,
          streakHistory: [],
        })
      );

      expect(StreakTracker.isStreakAtRisk()).toBe(false);
    });

    it('returns false when already studied today', () => {
      localStorage.setItem(
        'study-streak',
        JSON.stringify({
          currentStreak: 5,
          longestStreak: 10,
          lastStudyDate: '2025-01-15',
          streakHistory: [],
        })
      );

      expect(StreakTracker.isStreakAtRisk()).toBe(false);
    });
  });

  // ============================================================
  // getStreakMilestones
  // ============================================================
  describe('getStreakMilestones', () => {
    it('returns 5 milestones with correct structure', () => {
      localStorage.setItem(
        'study-streak',
        JSON.stringify({
          currentStreak: 0,
          longestStreak: 0,
          lastStudyDate: null,
          streakHistory: [],
        })
      );

      const milestones = StreakTracker.getStreakMilestones();

      expect(milestones).toHaveLength(5);
      expect(milestones[0]).toEqual({
        days: 7,
        name: '7-Day Warrior',
        achieved: false,
        progress: 0,
      });
      expect(milestones[4]).toEqual({
        days: 100,
        name: 'Century Scholar',
        achieved: false,
        progress: 0,
      });
    });

    it('marks milestones as achieved when longestStreak meets threshold', () => {
      localStorage.setItem(
        'study-streak',
        JSON.stringify({
          currentStreak: 10,
          longestStreak: 14,
          lastStudyDate: '2025-01-15',
          streakHistory: [],
        })
      );

      const milestones = StreakTracker.getStreakMilestones();

      expect(milestones[0].achieved).toBe(true); // 7-day
      expect(milestones[1].achieved).toBe(true); // 14-day
      expect(milestones[2].achieved).toBe(false); // 30-day
      expect(milestones[3].achieved).toBe(false); // 60-day
      expect(milestones[4].achieved).toBe(false); // 100-day
    });

    it('calculates progress percentage for incomplete milestones', () => {
      localStorage.setItem(
        'study-streak',
        JSON.stringify({
          currentStreak: 5,
          longestStreak: 0,
          lastStudyDate: '2025-01-15',
          streakHistory: [],
        })
      );

      const milestones = StreakTracker.getStreakMilestones();

      // 5/7 * 100 ≈ 71.43
      expect(milestones[0].progress).toBeCloseTo((5 / 7) * 100, 1);
      // 5/14 * 100 ≈ 35.71
      expect(milestones[1].progress).toBeCloseTo((5 / 14) * 100, 1);
    });

    it('caps progress at 100 for achieved milestones', () => {
      localStorage.setItem(
        'study-streak',
        JSON.stringify({
          currentStreak: 50,
          longestStreak: 50,
          lastStudyDate: '2025-01-15',
          streakHistory: [],
        })
      );

      const milestones = StreakTracker.getStreakMilestones();

      // 7-day: currentStreak (50) >= 7 → progress = 100
      expect(milestones[0].progress).toBe(100);
      // 14-day: currentStreak (50) >= 14 → progress = 100
      expect(milestones[1].progress).toBe(100);
      // 30-day: currentStreak (50) >= 30 → progress = 100
      expect(milestones[2].progress).toBe(100);
      // 60-day: not yet → 50/60 * 100
      expect(milestones[3].progress).toBeCloseTo((50 / 60) * 100, 1);
    });
  });

  // ============================================================
  // resetStreakData
  // ============================================================
  describe('resetStreakData', () => {
    it('removes study-streak key from localStorage', () => {
      localStorage.setItem(
        'study-streak',
        JSON.stringify({
          currentStreak: 5,
          longestStreak: 10,
          lastStudyDate: '2025-01-15',
          streakHistory: [],
        })
      );

      StreakTracker.resetStreakData();

      expect(localStorage.getItem('study-streak')).toBeNull();
    });
  });
});
