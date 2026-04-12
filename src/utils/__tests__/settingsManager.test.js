import { SettingsManager } from '../settingsManager';

const SETTINGS_KEY = 'app-settings';

describe('SettingsManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getSettings', () => {
    it('returns defaults when localStorage is empty', () => {
      const settings = SettingsManager.getSettings();

      expect(settings.version).toBe('1.0');
      expect(settings.resourcesPath).toBeNull();
      expect(settings.dashboardConfig).toBeNull();
      expect(settings).toHaveProperty('lastModified');
    });

    it('returns parsed settings from localStorage', () => {
      const stored = {
        version: '2.0',
        resourcesPath: '/some/path',
        dashboardConfig: { theme: 'dark' },
        lastModified: '2025-06-01T00:00:00.000Z',
      };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(stored));

      const settings = SettingsManager.getSettings();

      expect(settings.version).toBe('2.0');
      expect(settings.resourcesPath).toBe('/some/path');
      expect(settings.dashboardConfig).toEqual({ theme: 'dark' });
      expect(settings.lastModified).toBe('2025-06-01T00:00:00.000Z');
    });

    it('recovers from corrupted localStorage data', () => {
      localStorage.setItem(SETTINGS_KEY, '{invalid json!!!');

      const settings = SettingsManager.getSettings();

      expect(settings.version).toBe('1.0');
      expect(settings.resourcesPath).toBeNull();
      expect(settings.dashboardConfig).toBeNull();
    });
  });

  describe('saveSettings', () => {
    it('persists settings and adds lastModified', () => {
      const settings = {
        version: '1.0',
        resourcesPath: '/new/path',
        dashboardConfig: null,
      };

      const result = SettingsManager.saveSettings(settings);

      expect(result).toEqual({ success: true });
      const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY));
      expect(stored.resourcesPath).toBe('/new/path');
      expect(stored).toHaveProperty('lastModified');
      expect(typeof stored.lastModified).toBe('string');
    });

    it('handles localStorage write failure', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = function () {
        throw new Error('QuotaExceededError');
      };

      const result = SettingsManager.saveSettings({ version: '1.0' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('QuotaExceededError');

      localStorage.setItem = originalSetItem;
    });
  });

  describe('getSetting', () => {
    it('retrieves a specific key value', () => {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ version: '1.0', resourcesPath: '/custom/path' })
      );

      const value = SettingsManager.getSetting('resourcesPath');

      expect(value).toBe('/custom/path');
    });

    it('returns undefined for missing key', () => {
      const value = SettingsManager.getSetting('nonexistentKey');

      expect(value).toBeUndefined();
    });
  });

  describe('updateSetting', () => {
    it('merges a single key-value pair into existing settings', () => {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({
          version: '1.0',
          resourcesPath: null,
          dashboardConfig: null,
        })
      );

      const result = SettingsManager.updateSetting('resourcesPath', '/updated/path');

      expect(result).toEqual({ success: true });
      const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY));
      expect(stored.resourcesPath).toBe('/updated/path');
      expect(stored.version).toBe('1.0');
    });

    it('preserves other keys when updating one', () => {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({
          version: '1.0',
          resourcesPath: '/old/path',
          dashboardConfig: { sections: [] },
        })
      );

      SettingsManager.updateSetting('version', '2.0');

      const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY));
      expect(stored.version).toBe('2.0');
      expect(stored.resourcesPath).toBe('/old/path');
      expect(stored.dashboardConfig).toEqual({ sections: [] });
    });
  });

  describe('resetSettings', () => {
    it('removes settings key from localStorage', () => {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ version: '1.0', resourcesPath: '/some/path' })
      );

      const result = SettingsManager.resetSettings();

      expect(result).toEqual({ success: true });
      expect(localStorage.getItem(SETTINGS_KEY)).toBeNull();
    });

    it('returns success even when no settings exist', () => {
      const result = SettingsManager.resetSettings();

      expect(result).toEqual({ success: true });
    });
  });

  describe('getDashboardConfig / saveDashboardConfig', () => {
    it('getDashboardConfig returns null when no config saved', () => {
      const config = SettingsManager.getDashboardConfig();

      expect(config).toBeNull();
    });

    it('saveDashboardConfig persists config and returns success', () => {
      const dashboardConfig = {
        sections: [
          { id: 'progress', enabled: true, order: 1 },
          { id: 'streak', enabled: false, order: 2 },
        ],
      };

      const result = SettingsManager.saveDashboardConfig(dashboardConfig);

      expect(result).toEqual({ success: true });
      const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY));
      expect(stored.dashboardConfig).toEqual(dashboardConfig);
    });

    it('getDashboardConfig returns saved config', () => {
      const dashboardConfig = { theme: 'light', layout: 'grid' };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ version: '1.0', dashboardConfig }));

      const config = SettingsManager.getDashboardConfig();

      expect(config).toEqual(dashboardConfig);
    });
  });

  describe('getResourcesPath / saveResourcesPath', () => {
    it('getResourcesPath returns null when no path saved', () => {
      const path = SettingsManager.getResourcesPath();

      expect(path).toBeNull();
    });

    it('saveResourcesPath persists path and returns success', () => {
      const result = SettingsManager.saveResourcesPath('/new/resources/path');

      expect(result).toEqual({ success: true });
      const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY));
      expect(stored.resourcesPath).toBe('/new/resources/path');
    });

    it('getResourcesPath returns saved path', () => {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ version: '1.0', resourcesPath: '/stored/path' })
      );

      const path = SettingsManager.getResourcesPath();

      expect(path).toBe('/stored/path');
    });
  });
});
