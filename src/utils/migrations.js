// localStorage schema versioning and migration system
// Each migration runs sequentially to transform data from one schema version to the next.
// Migrations must be idempotent (safe to re-run) and should not throw.
// To add a new migration: add a function to the MIGRATIONS array below.
// The schema version is automatically derived from the array length.

const SCHEMA_VERSION_KEY = 'schema-version';

// Migration definitions: each function transforms data from version N to version N+1
// Must not throw -- wrap risky operations in try/catch and return data unchanged on failure
const MIGRATIONS = [
  // Migration 0 -> 1: Normalize legacy lab keys and add schema tracking
  // Scans for legacy single-key format (lab_{moduleId}_completed) and converts
  // to the indexed format (lab_{moduleId}_0_completed). This is the sole migration
  // path -- progressTracker no longer performs per-call migration.
  function migrate0to1() {
    // Snapshot all keys up front. The body of this migration does not mutate
    // localStorage during iteration (it queues writes into keysToAdd /
    // keysToRemove and applies them after the loop), but snapshotting the key
    // list guards against a future edit inside the loop body that does.
    // Mutating localStorage.length during iteration would otherwise skip or
    // revisit keys unpredictably.
    const snapshotKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key !== null) snapshotKeys.push(key);
    }

    const keysToRemove = [];
    const keysToAdd = [];

    snapshotKeys.forEach(key => {
      // Match legacy format: lab_{moduleId}_completed (no index)
      const match = key.match(/^lab_(\d+)_completed$/);
      if (match && localStorage.getItem(key) === 'true') {
        const moduleId = match[1];
        const newKey = `lab_${moduleId}_0_completed`;
        // Only queue the add if the new key is not already marked complete.
        // If the new key exists but isn't 'true', preserve the legacy 'true'
        // by writing it to the new key before removing the legacy key.
        if (localStorage.getItem(newKey) !== 'true') {
          keysToAdd.push({ key: newKey, value: 'true' });
        }
        keysToRemove.push(key);
      }
    });

    keysToAdd.forEach(({ key, value }) => localStorage.setItem(key, value));
    keysToRemove.forEach(key => localStorage.removeItem(key));
  },

  // Migration 1 -> 2: Strip unused per-activity timestamps from streak history
  // recordStudyActivity no longer writes the activities[] array (only the
  // activitiesCompleted counter is read by consumers). This one-shot
  // migration removes legacy arrays from existing data so the localStorage
  // blob shrinks immediately rather than over a year of aging out.
  // Idempotent: re-running on already-clean data is a no-op.
  function migrate1to2() {
    const raw = localStorage.getItem('study-streak');
    if (!raw) return;
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      // Corrupt data is left for streakTracker's own recovery path
      return;
    }
    if (!data || !Array.isArray(data.streakHistory)) return;
    let changed = false;
    for (const entry of data.streakHistory) {
      if (entry && Object.prototype.hasOwnProperty.call(entry, 'activities')) {
        delete entry.activities;
        changed = true;
      }
    }
    if (changed) {
      try {
        localStorage.setItem('study-streak', JSON.stringify(data));
      } catch {
        // Write failure leaves the legacy arrays in place; next launch retries.
      }
    }
  },
];

export const Migrations = {
  getCurrentVersion() {
    const stored = localStorage.getItem(SCHEMA_VERSION_KEY);
    return stored ? parseInt(stored, 10) : 0;
  },

  setCurrentVersion(version) {
    localStorage.setItem(SCHEMA_VERSION_KEY, version.toString());
  },

  getPendingMigrations() {
    const current = this.getCurrentVersion();
    const pending = [];
    for (let i = current; i < MIGRATIONS.length; i++) {
      pending.push({ fromVersion: i, toVersion: i + 1, fn: MIGRATIONS[i] });
    }
    return pending;
  },

  runMigrations() {
    const pending = this.getPendingMigrations();
    if (pending.length === 0) {
      return {
        ran: false,
        fromVersion: this.getCurrentVersion(),
        toVersion: this.getCurrentVersion(),
      };
    }

    const startVersion = this.getCurrentVersion();

    for (const migration of pending) {
      try {
        migration.fn();
        this.setCurrentVersion(migration.toVersion);
      } catch (error) {
        console.error(
          `Migration ${migration.fromVersion} -> ${migration.toVersion} failed:`,
          error
        );
        // Stop running further migrations -- don't advance version
        return {
          ran: true,
          fromVersion: startVersion,
          toVersion: migration.fromVersion,
          failed: true,
          error: error.message,
        };
      }
    }

    return { ran: true, fromVersion: startVersion, toVersion: this.getCurrentVersion() };
  },

  // Reset schema version (for testing)
  _reset() {
    localStorage.removeItem(SCHEMA_VERSION_KEY);
  },
};

export default Migrations;
