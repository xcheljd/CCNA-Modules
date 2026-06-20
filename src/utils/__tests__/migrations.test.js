import { Migrations } from '../migrations';

describe('Migrations', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getCurrentVersion', () => {
    it('returns 0 when no schema version is stored', () => {
      expect(Migrations.getCurrentVersion()).toBe(0);
    });

    it('returns stored version number', () => {
      localStorage.setItem('schema-version', '3');
      expect(Migrations.getCurrentVersion()).toBe(3);
    });
  });

  describe('setCurrentVersion', () => {
    it('stores version as string', () => {
      Migrations.setCurrentVersion(5);
      expect(localStorage.getItem('schema-version')).toBe('5');
    });
  });

  describe('getPendingMigrations', () => {
    it('returns all migrations when starting from version 0', () => {
      const pending = Migrations.getPendingMigrations();
      expect(pending.length).toBeGreaterThanOrEqual(1);
      expect(pending[0].fromVersion).toBe(0);
      expect(pending[0].toVersion).toBe(1);
    });

    it('returns no migrations when at current version', () => {
      Migrations.setCurrentVersion(2);
      const pending = Migrations.getPendingMigrations();
      expect(pending).toEqual([]);
    });

    it('returns only pending migrations from current version', () => {
      Migrations.setCurrentVersion(0);
      const pending = Migrations.getPendingMigrations();
      // All migrations from 0 to latest
      expect(pending.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('runMigrations', () => {
    it('does nothing when already at current version', () => {
      Migrations.setCurrentVersion(2);
      const result = Migrations.runMigrations();
      expect(result.ran).toBe(false);
      expect(result.fromVersion).toBe(2);
      expect(result.toVersion).toBe(2);
    });

    it('runs all pending migrations from version 0 and updates version', () => {
      const result = Migrations.runMigrations();
      expect(result.ran).toBe(true);
      expect(result.fromVersion).toBe(0);
      expect(result.toVersion).toBe(2);
      expect(Migrations.getCurrentVersion()).toBe(2);
    });

    it('idempotent: running twice produces same result', () => {
      Migrations.runMigrations();
      const result = Migrations.runMigrations();
      expect(result.ran).toBe(false);
      expect(Migrations.getCurrentVersion()).toBe(2);
    });

    describe('migration 0->1: legacy lab key normalization', () => {
      it('migrates legacy lab_COMPLETED key to lab_0_completed', () => {
        localStorage.setItem('lab_42_completed', 'true');
        Migrations.runMigrations();
        expect(localStorage.getItem('lab_42_0_completed')).toBe('true');
        expect(localStorage.getItem('lab_42_completed')).toBeNull();
      });

      it('does not overwrite existing new-format key', () => {
        localStorage.setItem('lab_42_completed', 'true');
        localStorage.setItem('lab_42_0_completed', 'true');
        Migrations.runMigrations();
        expect(localStorage.getItem('lab_42_0_completed')).toBe('true');
        expect(localStorage.getItem('lab_42_completed')).toBeNull();
      });

      it('ignores keys that are already new format', () => {
        localStorage.setItem('lab_42_0_completed', 'true');
        Migrations.runMigrations();
        expect(localStorage.getItem('lab_42_0_completed')).toBe('true');
      });

      it('handles multiple legacy keys at once', () => {
        localStorage.setItem('lab_1_completed', 'true');
        localStorage.setItem('lab_2_completed', 'true');
        localStorage.setItem('lab_10_completed', 'true');
        Migrations.runMigrations();
        expect(localStorage.getItem('lab_1_0_completed')).toBe('true');
        expect(localStorage.getItem('lab_2_0_completed')).toBe('true');
        expect(localStorage.getItem('lab_10_0_completed')).toBe('true');
        expect(localStorage.getItem('lab_1_completed')).toBeNull();
        expect(localStorage.getItem('lab_2_completed')).toBeNull();
        expect(localStorage.getItem('lab_10_completed')).toBeNull();
      });

      it('only migrates keys with value "true"', () => {
        localStorage.setItem('lab_5_completed', 'false');
        Migrations.runMigrations();
        expect(localStorage.getItem('lab_5_0_completed')).toBeNull();
        // The legacy key is still cleaned up since it matched the pattern
      });
    });

    describe('migration 1->2: strip legacy activities arrays from streak history', () => {
      it('removes activities arrays from streakHistory entries', () => {
        localStorage.setItem(
          'study-streak',
          JSON.stringify({
            currentStreak: 5,
            longestStreak: 5,
            lastStudyDate: '2025-01-15',
            streakHistory: [
              {
                date: '2025-01-14',
                activitiesCompleted: 3,
                activities: [{ type: 'video', timestamp: '2025-01-14T10:00:00.000Z' }],
              },
              {
                date: '2025-01-15',
                activitiesCompleted: 2,
                activities: [{ type: 'lab', timestamp: '2025-01-15T11:00:00.000Z' }],
              },
            ],
          })
        );
        Migrations.setCurrentVersion(1);

        Migrations.runMigrations();

        const data = JSON.parse(localStorage.getItem('study-streak'));
        expect(data.streakHistory[0].activities).toBeUndefined();
        expect(data.streakHistory[0].activitiesCompleted).toBe(3);
        expect(data.streakHistory[1].activities).toBeUndefined();
        expect(data.streakHistory[1].activitiesCompleted).toBe(2);
        expect(data.currentStreak).toBe(5);
        expect(data.lastStudyDate).toBe('2025-01-15');
        expect(Migrations.getCurrentVersion()).toBe(2);
      });

      it('is idempotent (re-run on already-clean data is a no-op)', () => {
        localStorage.setItem(
          'study-streak',
          JSON.stringify({
            currentStreak: 1,
            longestStreak: 1,
            lastStudyDate: '2025-01-15',
            streakHistory: [{ date: '2025-01-15', activitiesCompleted: 1 }],
          })
        );
        Migrations.setCurrentVersion(2);

        const result = Migrations.runMigrations();

        expect(result.ran).toBe(false);
        expect(Migrations.getCurrentVersion()).toBe(2);
        const data = JSON.parse(localStorage.getItem('study-streak'));
        expect(data.streakHistory[0].activitiesCompleted).toBe(1);
      });

      it('handles missing study-streak key (no-op)', () => {
        Migrations.setCurrentVersion(1);
        expect(localStorage.getItem('study-streak')).toBeNull();

        Migrations.runMigrations();

        expect(localStorage.getItem('study-streak')).toBeNull();
        expect(Migrations.getCurrentVersion()).toBe(2);
      });

      it('handles corrupt study-streak data without throwing', () => {
        localStorage.setItem('study-streak', '{invalid json!!!');
        Migrations.setCurrentVersion(1);

        expect(() => Migrations.runMigrations()).not.toThrow();
        expect(localStorage.getItem('study-streak')).toBe('{invalid json!!!');
        expect(Migrations.getCurrentVersion()).toBe(2);
      });

      it('handles streakHistory without activities arrays (no-op write)', () => {
        localStorage.setItem(
          'study-streak',
          JSON.stringify({
            currentStreak: 1,
            longestStreak: 1,
            lastStudyDate: '2025-01-15',
            streakHistory: [{ date: '2025-01-15', activitiesCompleted: 1 }],
          })
        );
        Migrations.setCurrentVersion(1);

        Migrations.runMigrations();

        const data = JSON.parse(localStorage.getItem('study-streak'));
        expect(data.streakHistory[0].activitiesCompleted).toBe(1);
        expect(Migrations.getCurrentVersion()).toBe(2);
      });
    });
  });

  describe('_reset', () => {
    it('removes schema version from localStorage', () => {
      Migrations.setCurrentVersion(5);
      Migrations._reset();
      expect(localStorage.getItem('schema-version')).toBeNull();
      expect(Migrations.getCurrentVersion()).toBe(0);
    });
  });
});
