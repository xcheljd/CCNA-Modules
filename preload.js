const { contextBridge, ipcRenderer } = require('electron');

// Expose safe IPC methods to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Video window management
  openVideoWindow: (videoId, moduleId) =>
    ipcRenderer.invoke('open-video-window', { videoId, moduleId }),

  closeVideoWindow: windowId => ipcRenderer.invoke('close-video-window', windowId),

  closeAllVideoWindows: () => ipcRenderer.invoke('close-all-video-windows'),

  // Resources folder management
  checkResourcesFolder: () => ipcRenderer.invoke('check-resources-folder'),

  getResourcesFiles: () => ipcRenderer.invoke('get-resources-files'),

  openAnki: () => ipcRenderer.invoke('open-anki'),

  openResource: filename => ipcRenderer.invoke('open-resource', filename),

  // Resources path configuration
  getResourcesInfo: () => ipcRenderer.invoke('get-resources-info'),

  selectResourcesFolder: () => ipcRenderer.invoke('select-resources-folder'),

  resetResourcesPath: () => ipcRenderer.invoke('reset-resources-path'),

  // Data export
  exportProgressBackup: exportData => ipcRenderer.invoke('export-progress-backup', exportData),

  // External URL handling
  openExternalUrl: url => ipcRenderer.invoke('open-external-url', url),
});
