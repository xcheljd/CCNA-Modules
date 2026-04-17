/**
 * Shared utility functions.
 */

/**
 * Normalize a value to an array.
 * - If already an array, return as-is.
 * - If truthy (non-null/undefined), wrap in a single-element array.
 * - If nullish, return an empty array.
 */
export const asArray = val => (Array.isArray(val) ? val : val ? [val] : []);

/**
 * Open a URL externally. Uses Electron's IPC bridge when available
 * (desktop app) and falls back to window.open in browser contexts.
 */
export const openExternal = url => {
  if (typeof window === 'undefined') return;
  if (window.electronAPI?.openExternalUrl) {
    window.electronAPI.openExternalUrl(url);
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};
