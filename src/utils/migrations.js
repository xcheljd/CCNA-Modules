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
  // This is a no-op migration that establishes the schema version baseline.
  // The legacy lab migration already exists in progressTracker._migrateLegacyLabData()
  // and will continue to work. This migration just marks that schema versioning is active.
  function migrate0to1() {
    // Scan for legacy lab keys that progressTracker might not have migrated yet
    const keysToRemove = [];
    const keysToAdd = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      // Match legacy format: lab_{moduleId}_completed (no index)
      const match = key.match(/^lab_(\d+)_completed$/);
      if (match && localStorage.getItem(key) === 'true') {
        const moduleId = match[1];
        const newKey = `lab_${moduleId}_0_completed`;
        // Only migrate if the new key doesn't already exist
        if (!localStorage.getItem(newKey)) {
          keysToAdd.push({ key: newKey, value: 'true' });
        }
        keysToRemove.push(key);
      }
    }

    keysToAdd.forEach(({ key, value }) => localStorage.setItem(key, value));
    keysToRemove.forEach(key => localStorage.removeItem(key));
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
