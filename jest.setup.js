// Jest setup file
import '@testing-library/jest-dom';

// Mock electronAPI matching preload.js exactly
global.window.electronAPI = {
  openVideoWindow: jest.fn().mockResolvedValue({ success: true }),
  closeVideoWindow: jest.fn().mockResolvedValue({ success: true }),
  closeAllVideoWindows: jest.fn().mockResolvedValue({ success: true }),
  checkResourcesFolder: jest.fn().mockResolvedValue({ success: true }),
  getResourcesFiles: jest.fn().mockResolvedValue({ success: true, files: [] }),
  openAnki: jest.fn().mockResolvedValue({ success: true }),
  openResource: jest.fn().mockResolvedValue({ success: true }),
  getResourcesInfo: jest.fn().mockResolvedValue({
    success: true,
    defaultPath: '/mock/resources',
    customPath: null,
    fileCount: 119,
  }),
  selectResourcesFolder: jest.fn().mockResolvedValue({ success: true, path: '/mock/path' }),
  resetResourcesPath: jest.fn().mockResolvedValue({ success: true }),
  exportProgressBackup: jest.fn().mockResolvedValue({ success: true }),
  openExternalUrl: jest.fn().mockResolvedValue({ success: true }),
};

// Mock process.resourcesPath for production builds
global.process = global.process || {};
global.process.resourcesPath = '/mock/resources/path';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn(index => {
      return Object.keys(store)[index] || null;
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
