// Settings management utility
const SETTINGS_KEY = 'app-settings';
const DEFAULT_SETTINGS = {
  version: '1.0',
  resourcesPath: null,
  dashboardConfig: null, // Will be populated from dashboardConfig.js
  lastModified: new Date().toISOString(),
};

export const SettingsManager = {
  // Get all settings
  getSettings() {
    try {
      const settings = localStorage.getItem(SETTINGS_KEY);
      if (settings) {
        return JSON.parse(settings);
      }
    } catch (error) {
      console.error('Error reading settings:', error);
    }
    return DEFAULT_SETTINGS;
  },

  // Save settings
  saveSettings(settings) {
    try {
      settings.lastModified = new Date().toISOString();
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      return { success: true };
    } catch (error) {
      console.error('Error saving settings:', error);
      return { success: false, error: error.message };
    }
  },

  // Get specific setting
  getSetting(key) {
    const settings = this.getSettings();
    return settings[key];
  },

  // Update specific setting
  updateSetting(key, value) {
    const settings = this.getSettings();
    settings[key] = value;
    return this.saveSettings(settings);
  },

  // Reset to defaults
  resetSettings() {
    localStorage.removeItem(SETTINGS_KEY);
    return { success: true };
  },

  // Get dashboard config
  getDashboardConfig() {
    const settings = this.getSettings();
    return settings.dashboardConfig;
  },

  // Save dashboard config
  saveDashboardConfig(config) {
    return this.updateSetting('dashboardConfig', config);
  },

  // Get resources path
  getResourcesPath() {
    const settings = this.getSettings();
    return settings.resourcesPath;
  },

  // Save resources path
  saveResourcesPath(path) {
    return this.updateSetting('resourcesPath', path);
  },
};

export default SettingsManager;
