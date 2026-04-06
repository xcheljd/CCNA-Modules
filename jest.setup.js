// Jest setup file
import '@testing-library/jest-dom';

// Mock electronAPI for renderer process
global.window.electronAPI = {
  openVideoWindow: jest.fn().mockResolvedValue({ success: true }),
  openExternalUrl: jest.fn().mockResolvedValue({ success: true }),
  getAppVersion: jest.fn().mockResolvedValue('1.0.0'),
  openFile: jest.fn().mockResolvedValue({ success: true }),
  getSystemPath: jest.fn().mockResolvedValue({ success: true, path: '/mock/path' }),
  setSystemPath: jest.fn().mockResolvedValue({ success: true }),
  getResourcesInfo: jest.fn().mockResolvedValue({
    success: true,
    defaultPath: '/mock/resources',
    customPath: null,
    fileCount: 119,
  }),
  setResourcesPath: jest.fn().mockResolvedValue({ success: true }),
  resetResourcesPath: jest.fn().mockResolvedValue({ success: true }),
  browseForFolder: jest.fn().mockResolvedValue({
    success: true,
    path: '/mock/selected/path',
  }),
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
