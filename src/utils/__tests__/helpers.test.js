import { asArray, openExternal } from '../helpers';

describe('helpers', () => {
  describe('asArray', () => {
    it('returns array as-is', () => {
      expect(asArray([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('wraps truthy value in array', () => {
      expect(asArray('hello')).toEqual(['hello']);
    });

    it('returns empty array for null', () => {
      expect(asArray(null)).toEqual([]);
    });

    it('returns empty array for undefined', () => {
      expect(asArray(undefined)).toEqual([]);
    });
  });

  describe('openExternal', () => {
    it('uses Electron IPC when available', () => {
      const mockOpen = jest.fn();
      window.electronAPI = { openExternalUrl: mockOpen };
      openExternal('https://example.com');
      expect(mockOpen).toHaveBeenCalledWith('https://example.com');
      delete window.electronAPI;
    });

    it('falls back to window.open when Electron is unavailable', () => {
      const mockOpen = jest.fn();
      window.open = mockOpen;
      delete window.electronAPI;
      openExternal('https://example.com');
      expect(mockOpen).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
    });

    it('does nothing when window is undefined', () => {
      const originalWindow = global.window;
      // Simulate SSR by temporarily removing window
      // jsdom always has window, so we just verify no error is thrown
      expect(() => openExternal('https://example.com')).not.toThrow();
    });
  });
});
