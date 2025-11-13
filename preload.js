const { contextBridge, ipcRenderer } = require('electron');

// Expose safe IPC methods to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Video window management
  openVideoWindow: (videoId, moduleId) =>
    ipcRenderer.invoke('open-video-window', { videoId, moduleId }),

  closeVideoWindow: windowId => ipcRenderer.invoke('close-video-window', windowId),

  closeAllVideoWindows: () => ipcRenderer.invoke('close-all-video-windows'),
});
