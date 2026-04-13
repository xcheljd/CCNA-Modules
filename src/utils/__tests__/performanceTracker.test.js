import { PerformanceTracker } from '../performanceTracker';

// Mock ProgressTracker
jest.mock('../progressTracker', () => ({
  __esModule: true,
  default: {
    getOverallProgress: jest.fn(),
    getModuleStatistics: jest.fn(),
    getModuleConfidence: jest.fn(),
    getModuleProgress: jest.fn(),
  },
}));

import ProgressTracker from '../progressTracker';

// Helper to create mock modules
const createMockModules = (count = 2) => {
  const modules = [];
  for (let i = 1; i <= count; i++) {
    modules.push({
      id: i,
      day: i,
      title: `Module ${i}`,
      videos: [{ id: `v${i}`, title: `Video ${i}`, duration: '10:00' }],
      resources: {
        lab: `Day ${i} Lab.pkt`,
        flashcards: `Day ${i} Flashcards.apkg`,
      },
    });
  }
  return modules;
};

const defaultStats = {
  totalModules: 2,
  completedModules: 0,
  totalVideos: 2,
  completedVideos: 0,
  totalLabs: 2,
  completedLabs: 0,
  totalFlashcards: 2,
  addedFlashcards: 0,
  avgConfidence: 0,
};

describe('PerformanceTracker', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ============================================================
  // getPerformanceData
  // ============================================================
  describe('getPerformanceData', () => {
    it('returns defaults when localStorage is empty', () => {
      const data = PerformanceTracker.getPerformanceData();

      expect(data).toEqual({
        daily: [],
        weekly: [],
        lastSnapshotDate: null,
      });
    });

    it('returns parsed data from localStorage', () => {
      const stored = {
        daily: [
          {
            date: '2025-01-15',
            overallProgress: 50.5,
            modulesCompleted: 5,
            videosCompleted: 10,
            labsCompleted: 3,
            flashcardsAdded: 2,
            avgConfidence: 3.5,
          },
        ],
        weekly: [],
        lastSnapshotDate: '2025-01-15',
      };
      localStorage.setItem('performance-history', JSON.stringify(stored));

      const data = PerformanceTracker.getPerformanceData();

      expect(data).toEqual(stored);
    });

    it('recovers from corrupted data by removing key and returning defaults', () => {
      localStorage.setItem('performance-history', '{invalid json!!!');

      const data = PerformanceTracker.getPerformanceData();

      expect(data).toEqual({
        daily: [],
        weekly: [],
        lastSnapshotDate: null,
      });
      expect(localStorage.getItem('performance-history')).toBeNull();
    });
  });

  // ============================================================
  // savePerformanceData
  // ============================================================
  describe('savePerformanceData', () => {
    it('persists data to localStorage', () => {
      const data = {
        daily: [{ date: '2025-01-15', overallProgress: 50 }],
        weekly: [],
        lastSnapshotDate: '2025-01-15',
      };

      PerformanceTracker.savePerformanceData(data);

      expect(JSON.parse(localStorage.getItem('performance-history'))).toEqual(data);
    });

    it('handles localStorage write failure without crashing', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => {
        PerformanceTracker.savePerformanceData({ daily: [] });
      }).not.toThrow();

      expect(consoleSpy).toHaveBeenCalledWith('Error saving performance data:', expect.any(Error));

      localStorage.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });
  });

  // ============================================================
  // recordDailySnapshot
  // ============================================================
  describe('recordDailySnapshot', () => {
    const mockModules = createMockModules();

    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date('2025-01-15T12:00:00'));
      ProgressTracker.getOverallProgress.mockReturnValue(45.67);
      ProgressTracker.getModuleStatistics.mockReturnValue({
        ...defaultStats,
        completedModules: 1,
        completedVideos: 2,
        completedLabs: 1,
        addedFlashcards: 1,
        avgConfidence: 3.5,
      });
    });

    it('creates new entry for today with correct fields', () => {
      const snapshot = PerformanceTracker.recordDailySnapshot(mockModules);

      expect(snapshot).toEqual({
        date: '2025-01-15',
        overallProgress: 45.7, // Rounded to 1 decimal
        modulesCompleted: 1,
        videosCompleted: 2,
        labsCompleted: 1,
        flashcardsAdded: 1,
        avgConfidence: 3.5,
      });
    });

    it('updates existing entry for today', () => {
      // First snapshot
      const snapshot1 = PerformanceTracker.recordDailySnapshot(mockModules);
      expect(snapshot1.modulesCompleted).toBe(1);

      // Update stats for second snapshot
      ProgressTracker.getOverallProgress.mockReturnValue(60);
      ProgressTracker.getModuleStatistics.mockReturnValue({
        ...defaultStats,
        completedModules: 2,
        completedVideos: 4,
        completedLabs: 2,
        addedFlashcards: 2,
        avgConfidence: 4.0,
      });

      const snapshot2 = PerformanceTracker.recordDailySnapshot(mockModules);

      // Should still be only one entry for today, but updated
      const data = PerformanceTracker.getPerformanceData();
      const todayEntries = data.daily.filter(e => e.date === '2025-01-15');
      expect(todayEntries).toHaveLength(1);
      expect(snapshot2).toEqual({
        date: '2025-01-15',
        overallProgress: 60,
        modulesCompleted: 2,
        videosCompleted: 4,
        labsCompleted: 2,
        flashcardsAdded: 2,
        avgConfidence: 4.0,
      });
    });

    it('rounds overallProgress to 1 decimal place', () => {
      ProgressTracker.getOverallProgress.mockReturnValue(33.333);

      const snapshot = PerformanceTracker.recordDailySnapshot(mockModules);

      expect(snapshot.overallProgress).toBe(33.3);
    });

    it('rounds overallProgress with Math.round(value * 10) / 10', () => {
      ProgressTracker.getOverallProgress.mockReturnValue(55.55);

      const snapshot = PerformanceTracker.recordDailySnapshot(mockModules);

      // Math.round(55.55 * 10) / 10 = Math.round(555.5) / 10 = 556 / 10 = 55.6
      expect(snapshot.overallProgress).toBe(55.6);
    });

    it('trims daily entries to 365 when exceeded', () => {
      // Pre-populate with 365 entries
      const entries = [];
      for (let i = 365; i >= 1; i--) {
        const d = new Date('2025-01-15');
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        entries.push({
          date: dateStr,
          overallProgress: 10,
          modulesCompleted: 0,
          videosCompleted: 0,
          labsCompleted: 0,
          flashcardsAdded: 0,
          avgConfidence: 0,
        });
      }
      localStorage.setItem(
        'performance-history',
        JSON.stringify({
          daily: entries,
          weekly: [],
          lastSnapshotDate: '2025-01-14',
        })
      );

      PerformanceTracker.recordDailySnapshot(mockModules);

      const data = PerformanceTracker.getPerformanceData();
      expect(data.daily.length).toBe(365);
      // Latest entry should be today
      expect(data.daily[364].date).toBe('2025-01-15');
    });

    it('updates lastSnapshotDate and returns snapshot', () => {
      const snapshot = PerformanceTracker.recordDailySnapshot(mockModules);

      const data = PerformanceTracker.getPerformanceData();
      expect(data.lastSnapshotDate).toBe('2025-01-15');
      expect(snapshot.date).toBe('2025-01-15');
    });

    it('calls getOverallProgress and getModuleStatistics on ProgressTracker', () => {
      PerformanceTracker.recordDailySnapshot(mockModules);

      expect(ProgressTracker.getOverallProgress).toHaveBeenCalledWith(mockModules);
      expect(ProgressTracker.getModuleStatistics).toHaveBeenCalledWith(mockModules);
    });
  });

  // ============================================================
  // getPerformanceRange
  // ============================================================
  describe('getPerformanceRange', () => {
    beforeEach(() => {
      const entries = [
        { date: '2025-01-10', overallProgress: 10 },
        { date: '2025-01-11', overallProgress: 20 },
        { date: '2025-01-12', overallProgress: 30 },
        { date: '2025-01-13', overallProgress: 40 },
        { date: '2025-01-14', overallProgress: 50 },
        { date: '2025-01-15', overallProgress: 60 },
      ];
      localStorage.setItem(
        'performance-history',
        JSON.stringify({
          daily: entries,
          weekly: [],
          lastSnapshotDate: '2025-01-15',
        })
      );
    });

    it('returns only entries within the date range', () => {
      const result = PerformanceTracker.getPerformanceRange('2025-01-11', '2025-01-14');

      expect(result).toHaveLength(4);
      expect(result[0].date).toBe('2025-01-11');
      expect(result[3].date).toBe('2025-01-14');
    });

    it('returns empty array when no entries match', () => {
      const result = PerformanceTracker.getPerformanceRange('2025-02-01', '2025-02-28');

      expect(result).toEqual([]);
    });

    it('includes boundary dates', () => {
      const result = PerformanceTracker.getPerformanceRange('2025-01-10', '2025-01-10');

      expect(result).toHaveLength(1);
      expect(result[0].date).toBe('2025-01-10');
    });

    it('returns all entries when range covers all dates', () => {
      const result = PerformanceTracker.getPerformanceRange('2025-01-01', '2025-01-31');

      expect(result).toHaveLength(6);
    });
  });

  // ============================================================
  // getRecentPerformance
  // ============================================================
  describe('getRecentPerformance', () => {
    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date('2025-01-15T12:00:00'));
    });

    it('returns correct number of days with default 30', () => {
      const result = PerformanceTracker.getRecentPerformance();

      expect(result).toHaveLength(30);
    });

    it('returns correct number of days when specified', () => {
      const result = PerformanceTracker.getRecentPerformance(7);

      expect(result).toHaveLength(7);
    });

    it('fills gaps with zeroed default entries', () => {
      const result = PerformanceTracker.getRecentPerformance(3);

      expect(result).toHaveLength(3);
      // All should be zeroed defaults since no data
      result.forEach(entry => {
        expect(entry).toEqual({
          date: expect.any(String),
          overallProgress: 0,
          modulesCompleted: 0,
          videosCompleted: 0,
          labsCompleted: 0,
          flashcardsAdded: 0,
          avgConfidence: 0,
        });
      });
    });

    it('returns existing data for days that have entries', () => {
      const entries = [
        {
          date: '2025-01-14',
          overallProgress: 50,
          modulesCompleted: 5,
          videosCompleted: 10,
          labsCompleted: 3,
          flashcardsAdded: 2,
          avgConfidence: 3.5,
        },
      ];
      localStorage.setItem(
        'performance-history',
        JSON.stringify({
          daily: entries,
          weekly: [],
          lastSnapshotDate: '2025-01-14',
        })
      );

      const result = PerformanceTracker.getRecentPerformance(3);

      expect(result).toHaveLength(3);
      // First day: 2025-01-13 (no data → zeroed)
      expect(result[0].date).toBe('2025-01-13');
      expect(result[0].overallProgress).toBe(0);
      // Second day: 2025-01-14 (has data)
      expect(result[1].date).toBe('2025-01-14');
      expect(result[1].overallProgress).toBe(50);
      expect(result[1].modulesCompleted).toBe(5);
      // Third day: 2025-01-15 (no data → zeroed)
      expect(result[2].date).toBe('2025-01-15');
      expect(result[2].overallProgress).toBe(0);
    });

    it('returns entries ordered oldest to newest', () => {
      const result = PerformanceTracker.getRecentPerformance(5);

      expect(result[0].date).toBe('2025-01-11');
      expect(result[1].date).toBe('2025-01-12');
      expect(result[2].date).toBe('2025-01-13');
      expect(result[3].date).toBe('2025-01-14');
      expect(result[4].date).toBe('2025-01-15');
    });
  });

  // ============================================================
  // calculateWeeklyData
  // ============================================================
  describe('calculateWeeklyData', () => {
    const mockModules = createMockModules();

    beforeEach(() => {
      // Set to Wednesday Jan 15, 2025
      jest.useFakeTimers().setSystemTime(new Date('2025-01-15T12:00:00'));
    });

    it('returns null when no data for the week', () => {
      localStorage.setItem(
        'performance-history',
        JSON.stringify({ daily: [], weekly: [], lastSnapshotDate: null })
      );

      const result = PerformanceTracker.calculateWeeklyData(mockModules);

      expect(result).toBeNull();
    });

    it('computes weekly deltas when data exists', () => {
      // Week starts Monday Jan 13, ends Sunday Jan 19
      const entries = [
        {
          date: '2025-01-13',
          overallProgress: 30,
          modulesCompleted: 3,
          videosCompleted: 6,
          labsCompleted: 2,
          flashcardsAdded: 1,
          avgConfidence: 3.0,
        },
        {
          date: '2025-01-14',
          overallProgress: 40,
          modulesCompleted: 4,
          videosCompleted: 8,
          labsCompleted: 3,
          flashcardsAdded: 2,
          avgConfidence: 3.5,
        },
        {
          date: '2025-01-15',
          overallProgress: 50,
          modulesCompleted: 5,
          videosCompleted: 10,
          labsCompleted: 4,
          flashcardsAdded: 3,
          avgConfidence: 4.0,
        },
      ];
      localStorage.setItem(
        'performance-history',
        JSON.stringify({
          daily: entries,
          weekly: [],
          lastSnapshotDate: '2025-01-15',
        })
      );

      const result = PerformanceTracker.calculateWeeklyData(mockModules);

      expect(result).toEqual({
        weekStart: '2025-01-13',
        modulesCompletedThisWeek: 5 - 3, // 2
        videosCompletedThisWeek: 10 - 6, // 4
        labsCompletedThisWeek: 4 - 2, // 2
        progressGain: 50 - 30, // 20
        avgConfidence: 4.0,
      });
    });

    it('handles single entry in the week (first === last)', () => {
      const entries = [
        {
          date: '2025-01-15',
          overallProgress: 20,
          modulesCompleted: 2,
          videosCompleted: 4,
          labsCompleted: 1,
          flashcardsAdded: 1,
          avgConfidence: 2.5,
        },
      ];
      localStorage.setItem(
        'performance-history',
        JSON.stringify({
          daily: entries,
          weekly: [],
          lastSnapshotDate: '2025-01-15',
        })
      );

      const result = PerformanceTracker.calculateWeeklyData(mockModules);

      // With single entry, first and last are the same → deltas are 0
      expect(result).not.toBeNull();
      expect(result.modulesCompletedThisWeek).toBe(0);
      expect(result.videosCompletedThisWeek).toBe(0);
      expect(result.labsCompletedThisWeek).toBe(0);
      expect(result.progressGain).toBe(0);
      expect(result.avgConfidence).toBe(2.5);
    });
  });

  // ============================================================
  // getWeeklyVelocity
  // ============================================================
  describe('getWeeklyVelocity', () => {
    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date('2025-01-15T12:00:00'));
    });

    it('returns 0 modulesCompleted when fewer than 2 data points in a week', () => {
      // Only one entry in the week
      const entries = [
        {
          date: '2025-01-14',
          overallProgress: 10,
          modulesCompleted: 1,
          videosCompleted: 0,
          labsCompleted: 0,
          flashcardsAdded: 0,
          avgConfidence: 0,
        },
      ];
      localStorage.setItem(
        'performance-history',
        JSON.stringify({
          daily: entries,
          weekly: [],
          lastSnapshotDate: '2025-01-14',
        })
      );

      const result = PerformanceTracker.getWeeklyVelocity(1);

      expect(result).toHaveLength(1);
      expect(result[0].modulesCompleted).toBe(0);
    });

    it('calculates module delta per week correctly', () => {
      // getWeeklyVelocity(2) with today=Jan 15:
      //   i=1: weekEnd=Jan 8, weekStart=subDays(Jan 8, 6)=Jan 2
      //   i=0: weekEnd=Jan 15, weekStart=subDays(Jan 15, 6)=Jan 9
      const entries = [
        {
          date: '2025-01-02',
          overallProgress: 10,
          modulesCompleted: 1,
          videosCompleted: 0,
          labsCompleted: 0,
          flashcardsAdded: 0,
          avgConfidence: 0,
        },
        {
          date: '2025-01-05',
          overallProgress: 20,
          modulesCompleted: 3,
          videosCompleted: 0,
          labsCompleted: 0,
          flashcardsAdded: 0,
          avgConfidence: 0,
        },
        {
          date: '2025-01-09', // Start of current week
          overallProgress: 30,
          modulesCompleted: 5,
          videosCompleted: 0,
          labsCompleted: 0,
          flashcardsAdded: 0,
          avgConfidence: 0,
        },
        {
          date: '2025-01-15',
          overallProgress: 40,
          modulesCompleted: 8,
          videosCompleted: 0,
          labsCompleted: 0,
          flashcardsAdded: 0,
          avgConfidence: 0,
        },
      ];
      localStorage.setItem(
        'performance-history',
        JSON.stringify({
          daily: entries,
          weekly: [],
          lastSnapshotDate: '2025-01-15',
        })
      );

      const result = PerformanceTracker.getWeeklyVelocity(2);

      expect(result).toHaveLength(2);
      // Current week (Jan 9-15): first=5, last=8 → delta=3
      expect(result[1].modulesCompleted).toBe(3);
      // Previous week (Jan 2-8): first=1, last=3 → delta=2
      expect(result[0].modulesCompleted).toBe(2);
    });

    it('clamps negative velocity to 0', () => {
      const entries = [
        {
          date: '2025-01-13',
          overallProgress: 30,
          modulesCompleted: 10, // More modules at start of week
          videosCompleted: 0,
          labsCompleted: 0,
          flashcardsAdded: 0,
          avgConfidence: 0,
        },
        {
          date: '2025-01-15',
          overallProgress: 40,
          modulesCompleted: 5, // Fewer at end — should clamp to 0
          videosCompleted: 0,
          labsCompleted: 0,
          flashcardsAdded: 0,
          avgConfidence: 0,
        },
      ];
      localStorage.setItem(
        'performance-history',
        JSON.stringify({
          daily: entries,
          weekly: [],
          lastSnapshotDate: '2025-01-15',
        })
      );

      const result = PerformanceTracker.getWeeklyVelocity(1);

      expect(result[0].modulesCompleted).toBe(0);
    });

    it('returns correct number of weeks', () => {
      localStorage.setItem(
        'performance-history',
        JSON.stringify({ daily: [], weekly: [], lastSnapshotDate: null })
      );

      const result = PerformanceTracker.getWeeklyVelocity(4);

      expect(result).toHaveLength(4);
      result.forEach(week => {
        expect(week).toHaveProperty('week');
        expect(week).toHaveProperty('modulesCompleted');
      });
    });

    it('defaults to 8 weeks', () => {
      localStorage.setItem(
        'performance-history',
        JSON.stringify({ daily: [], weekly: [], lastSnapshotDate: null })
      );

      const result = PerformanceTracker.getWeeklyVelocity();

      expect(result).toHaveLength(8);
    });
  });

  // ============================================================
  // predictCompletionDate
  // ============================================================
  describe('predictCompletionDate', () => {
    const mockModules = createMockModules(10);

    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date('2025-01-15T12:00:00'));
    });

    it('returns null when fewer than 7 days of data', () => {
      const entries = [
        {
          date: '2025-01-14',
          overallProgress: 10,
          modulesCompleted: 1,
          videosCompleted: 0,
          labsCompleted: 0,
          flashcardsAdded: 0,
          avgConfidence: 0,
        },
        {
          date: '2025-01-15',
          overallProgress: 15,
          modulesCompleted: 2,
          videosCompleted: 0,
          labsCompleted: 0,
          flashcardsAdded: 0,
          avgConfidence: 0,
        },
      ];
      localStorage.setItem(
        'performance-history',
        JSON.stringify({
          daily: entries,
          weekly: [],
          lastSnapshotDate: '2025-01-15',
        })
      );

      const result = PerformanceTracker.predictCompletionDate(mockModules, 10);

      expect(result).toBeNull();
    });

    it('returns "Completed" when all modules done', () => {
      // Create 14 days of data with all modules completed
      const entries = [];
      for (let i = 13; i >= 0; i--) {
        const d = new Date('2025-01-15');
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        entries.push({
          date: dateStr,
          overallProgress: 100,
          modulesCompleted: 10,
          videosCompleted: 10,
          labsCompleted: 10,
          flashcardsAdded: 10,
          avgConfidence: 5,
        });
      }
      localStorage.setItem(
        'performance-history',
        JSON.stringify({
          daily: entries,
          weekly: [],
          lastSnapshotDate: '2025-01-15',
        })
      );

      const result = PerformanceTracker.predictCompletionDate(mockModules, 10);

      expect(result).toBe('Completed');
    });

    it('returns "Unknown" when velocity is 0', () => {
      // 14 days of data but no progress change
      const entries = [];
      for (let i = 13; i >= 0; i--) {
        const d = new Date('2025-01-15');
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        entries.push({
          date: dateStr,
          overallProgress: 20,
          modulesCompleted: 2,
          videosCompleted: 0,
          labsCompleted: 0,
          flashcardsAdded: 0,
          avgConfidence: 0,
        });
      }
      localStorage.setItem(
        'performance-history',
        JSON.stringify({
          daily: entries,
          weekly: [],
          lastSnapshotDate: '2025-01-15',
        })
      );

      const result = PerformanceTracker.predictCompletionDate(mockModules, 10);

      expect(result).toBe('Unknown');
    });

    it('returns "Unknown" when velocity is negative', () => {
      // First day has more modules than last day
      const entries = [];
      for (let i = 13; i >= 0; i--) {
        const d = new Date('2025-01-15');
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        entries.push({
          date: dateStr,
          overallProgress: 10,
          modulesCompleted: i === 13 ? 5 : 3, // More modules at start
          videosCompleted: 0,
          labsCompleted: 0,
          flashcardsAdded: 0,
          avgConfidence: 0,
        });
      }
      localStorage.setItem(
        'performance-history',
        JSON.stringify({
          daily: entries,
          weekly: [],
          lastSnapshotDate: '2025-01-15',
        })
      );

      const result = PerformanceTracker.predictCompletionDate(mockModules, 10);

      expect(result).toBe('Unknown');
    });

    it('returns formatted date string when velocity is positive', () => {
      // 14 days: from 0 to 7 modules → velocity = 7/14 = 0.5 modules/day
      // Remaining: 10 - 7 = 3 modules → 3 / 0.5 = 6 days
      // Completion: Jan 15 + 6 = Jan 21
      const entries = [];
      for (let i = 13; i >= 0; i--) {
        const d = new Date('2025-01-15');
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const modulesCompleted = Math.round((13 - i) * 0.5);
        entries.push({
          date: dateStr,
          overallProgress: modulesCompleted * 10,
          modulesCompleted,
          videosCompleted: 0,
          labsCompleted: 0,
          flashcardsAdded: 0,
          avgConfidence: 0,
        });
      }
      localStorage.setItem(
        'performance-history',
        JSON.stringify({
          daily: entries,
          weekly: [],
          lastSnapshotDate: '2025-01-15',
        })
      );

      const result = PerformanceTracker.predictCompletionDate(mockModules, 10);

      // Should be a formatted date like "Jan 21, 2025"
      expect(result).toMatch(/^[A-Z][a-z]{2} \d{1,2}, \d{4}$/);
      expect(result).not.toBe('Completed');
      expect(result).not.toBe('Unknown');
      expect(result).not.toBeNull();
    });

    it('returns null when daily data has fewer than 7 entries', () => {
      // With 6 entries (less than 7), should return null
      const entries = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date('2025-01-15');
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        entries.push({
          date: dateStr,
          overallProgress: 10,
          modulesCompleted: 1,
          videosCompleted: 0,
          labsCompleted: 0,
          flashcardsAdded: 0,
          avgConfidence: 0,
        });
      }
      localStorage.setItem(
        'performance-history',
        JSON.stringify({
          daily: entries,
          weekly: [],
          lastSnapshotDate: '2025-01-15',
        })
      );

      const result = PerformanceTracker.predictCompletionDate(mockModules, 10);
      expect(result).toBeNull();
    });
  });

  // ============================================================
  // getConfidenceDistribution
  // ============================================================
  describe('getConfidenceDistribution', () => {
    it('returns all zeros for empty modules array', () => {
      const result = PerformanceTracker.getConfidenceDistribution([]);

      expect(result).toEqual({
        needsReview: 0,
        moderate: 0,
        confident: 0,
        notRated: 0,
      });
    });

    it('categorizes needsReview for confidence 1 and 2', () => {
      const modules = [
        { id: 1, videos: [], resources: {} },
        { id: 2, videos: [], resources: {} },
      ];

      ProgressTracker.getModuleProgress
        .mockReturnValueOnce(50) // module 1 has progress
        .mockReturnValueOnce(30); // module 2 has progress
      ProgressTracker.getModuleConfidence
        .mockReturnValueOnce(1) // module 1 → needsReview
        .mockReturnValueOnce(2); // module 2 → needsReview

      const result = PerformanceTracker.getConfidenceDistribution(modules);

      expect(result.needsReview).toBe(2);
      expect(result.moderate).toBe(0);
      expect(result.confident).toBe(0);
      expect(result.notRated).toBe(0);
    });

    it('categorizes moderate for confidence 3', () => {
      const modules = [{ id: 1, videos: [], resources: {} }];

      ProgressTracker.getModuleProgress.mockReturnValue(50);
      ProgressTracker.getModuleConfidence.mockReturnValue(3);

      const result = PerformanceTracker.getConfidenceDistribution(modules);

      expect(result.moderate).toBe(1);
      expect(result.needsReview).toBe(0);
      expect(result.confident).toBe(0);
      expect(result.notRated).toBe(0);
    });

    it('categorizes confident for confidence 4 and 5', () => {
      const modules = [
        { id: 1, videos: [], resources: {} },
        { id: 2, videos: [], resources: {} },
      ];

      ProgressTracker.getModuleProgress
        .mockReturnValueOnce(80) // module 1 has progress
        .mockReturnValueOnce(90); // module 2 has progress
      ProgressTracker.getModuleConfidence
        .mockReturnValueOnce(4) // module 1 → confident
        .mockReturnValueOnce(5); // module 2 → confident

      const result = PerformanceTracker.getConfidenceDistribution(modules);

      expect(result.confident).toBe(2);
      expect(result.needsReview).toBe(0);
      expect(result.moderate).toBe(0);
      expect(result.notRated).toBe(0);
    });

    it('categorizes notRated for confidence 0 with progress > 0', () => {
      const modules = [{ id: 1, videos: [], resources: {} }];

      ProgressTracker.getModuleProgress.mockReturnValue(50);
      ProgressTracker.getModuleConfidence.mockReturnValue(0);

      const result = PerformanceTracker.getConfidenceDistribution(modules);

      expect(result.notRated).toBe(1);
      expect(result.needsReview).toBe(0);
      expect(result.moderate).toBe(0);
      expect(result.confident).toBe(0);
    });

    it('skips modules with 0 progress', () => {
      const modules = [
        { id: 1, videos: [], resources: {} },
        { id: 2, videos: [], resources: {} },
        { id: 3, videos: [], resources: {} },
      ];

      ProgressTracker.getModuleProgress
        .mockReturnValueOnce(0) // module 1: no progress → skip
        .mockReturnValueOnce(50) // module 2: has progress
        .mockReturnValueOnce(0); // module 3: no progress → skip
      ProgressTracker.getModuleConfidence
        .mockReturnValueOnce(3) // won't be used (skipped)
        .mockReturnValueOnce(4) // module 2 → confident
        .mockReturnValueOnce(1); // won't be used (skipped)

      const result = PerformanceTracker.getConfidenceDistribution(modules);

      expect(result.confident).toBe(1);
      expect(result.needsReview).toBe(0);
      expect(result.moderate).toBe(0);
      expect(result.notRated).toBe(0);
    });

    it('handles mixed distribution correctly', () => {
      const modules = [
        { id: 1, videos: [], resources: {} },
        { id: 2, videos: [], resources: {} },
        { id: 3, videos: [], resources: {} },
        { id: 4, videos: [], resources: {} },
        { id: 5, videos: [], resources: {} },
        { id: 6, videos: [], resources: {} },
      ];

      ProgressTracker.getModuleProgress
        .mockReturnValueOnce(0) // skip (no progress)
        .mockReturnValueOnce(50) // confidence 1 → needsReview
        .mockReturnValueOnce(30) // confidence 2 → needsReview
        .mockReturnValueOnce(60) // confidence 3 → moderate
        .mockReturnValueOnce(80) // confidence 4 → confident
        .mockReturnValueOnce(90); // confidence 5 → confident
      ProgressTracker.getModuleConfidence
        .mockReturnValueOnce(0) // skip
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(2)
        .mockReturnValueOnce(3)
        .mockReturnValueOnce(4)
        .mockReturnValueOnce(5);

      const result = PerformanceTracker.getConfidenceDistribution(modules);

      expect(result.needsReview).toBe(2);
      expect(result.moderate).toBe(1);
      expect(result.confident).toBe(2);
      expect(result.notRated).toBe(0);
    });
  });

  // ============================================================
  // resetPerformanceData
  // ============================================================
  describe('resetPerformanceData', () => {
    it('removes performance-history key from localStorage', () => {
      localStorage.setItem(
        'performance-history',
        JSON.stringify({
          daily: [{ date: '2025-01-15', overallProgress: 50 }],
          weekly: [],
          lastSnapshotDate: '2025-01-15',
        })
      );

      PerformanceTracker.resetPerformanceData();

      expect(localStorage.getItem('performance-history')).toBeNull();
    });

    it('does nothing when key does not exist', () => {
      expect(() => {
        PerformanceTracker.resetPerformanceData();
      }).not.toThrow();

      expect(localStorage.getItem('performance-history')).toBeNull();
    });
  });
});
