const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Add command line switches to help Google OAuth work
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

let mainWindow;
const videoWindows = new Map();

// Config file for storing custom resources path
const configPath = path.join(app.getPath('userData'), 'config.json');

// Load config from file
function loadConfig() {
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading config:', error);
  }
  return {};
}

// Save config to file
function saveConfig(config) {
  try {
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving config:', error);
    return false;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
  });

  // Load from dist folder after webpack build
  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadFile('dist/index.html');
    // Open dev tools in development
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }
}

// Get resources folder path (checks custom path first, then defaults)
function getResourcesPath() {
  const config = loadConfig();

  // If custom path is set and valid, use it
  if (config.customResourcesPath) {
    return config.customResourcesPath;
  }

  // Otherwise use default path
  const isDev = !app.isPackaged;
  if (isDev) {
    // In development, use project directory
    return path.join(__dirname, 'resources');
  } else {
    // In production, use process.resourcesPath (electron-builder extraResources)
    return path.join(process.resourcesPath, 'resources');
  }
}

// Check if resources folder exists
ipcMain.handle('check-resources-folder', async () => {
  const resourcesPath = getResourcesPath();
  try {
    await fs.promises.access(resourcesPath);
    return { exists: true, path: resourcesPath };
  } catch {
    return { exists: false, path: resourcesPath };
  }
});

// Get list of files in resources folder
ipcMain.handle('get-resources-files', async () => {
  const resourcesPath = getResourcesPath();
  try {
    const files = await fs.promises.readdir(resourcesPath);
    return { success: true, files };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Open Anki application (without a specific file)
ipcMain.handle('open-anki', async () => {
  try {
    // Platform-specific Anki application paths/commands
    const platform = process.platform;
    let ankiPath;

    if (platform === 'darwin') {
      // macOS
      ankiPath = '/Applications/Anki.app';
    } else if (platform === 'win32') {
      // Windows - try common installation paths
      const programFiles = process.env['ProgramFiles'] || 'C:\\Program Files';
      ankiPath = path.join(programFiles, 'Anki', 'anki.exe');
    } else {
      // Linux - use command
      ankiPath = 'anki';
    }

    await shell.openPath(ankiPath);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Open resource file in external application
ipcMain.handle('open-resource', async (event, filename) => {
  const resourcesPath = getResourcesPath();
  const filePath = path.join(resourcesPath, filename);

  try {
    // Check if file exists
    await fs.promises.access(filePath);

    // Open file with default application
    await shell.openPath(filePath);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Get resources folder information
ipcMain.handle('get-resources-info', async () => {
  const config = loadConfig();
  const customPath = config.customResourcesPath || null;

  // Get default path (without custom path applied)
  const isDev = !app.isPackaged;
  const defaultPath = isDev
    ? path.join(__dirname, 'resources')
    : path.join(process.resourcesPath, 'resources');

  const currentPath = customPath || defaultPath;

  let exists = false;
  try {
    await fs.promises.access(currentPath);
    exists = true;
  } catch {
    exists = false;
  }

  return {
    currentPath,
    customPath,
    exists,
    isCustom: customPath !== null,
  };
});

// Show dialog to select resources folder
ipcMain.handle('select-resources-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select Resources Folder',
    message: 'Choose the folder containing your CCNA lab files and flashcards',
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const selectedPath = result.filePaths[0];

    // Save custom path to config
    const config = loadConfig();
    config.customResourcesPath = selectedPath;

    if (saveConfig(config)) {
      return { success: true, path: selectedPath };
    } else {
      return { success: false, error: 'Failed to save custom path' };
    }
  }

  return { success: false };
});

// Reset to default resources path
ipcMain.handle('reset-resources-path', async () => {
  try {
    // Load config and remove custom path
    const config = loadConfig();
    delete config.customResourcesPath;

    // Save updated config
    if (saveConfig(config)) {
      return { success: true };
    } else {
      return { success: false, error: 'Failed to save config' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Open external URL in default browser
ipcMain.handle('open-external-url', async (event, url) => {
  try {
    await shell.openExternal(url);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Export progress backup to a user-selected file
ipcMain.handle('export-progress-backup', async (event, exportData) => {
  try {
    const dateStr = new Date().toISOString().split('T')[0];
    const defaultPath = path.join(app.getPath('documents'), `ccna-backup-${dateStr}.json`);

    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Save Progress Backup',
      defaultPath,
      buttonLabel: 'Save Backup',
      filters: [{ name: 'JSON Files', extensions: ['json'] }],
    });

    if (canceled || !filePath) {
      return { success: false, canceled: true };
    }

    const dataStr = JSON.stringify(exportData, null, 2);
    await fs.promises.writeFile(filePath, dataStr, 'utf8');

    return { success: true, filePath };
  } catch (error) {
    console.error('Error exporting progress backup:', error);
    return { success: false, error: error.message };
  }
});

// Open video in separate window
ipcMain.handle('open-video-window', async (event, { videoId, moduleId: _moduleId }) => {
  try {
    // Get persistent session for YouTube (enables login persistence)
    const { session } = require('electron');
    const youtubeSession = session.fromPartition('persist:youtube-session');

    // Set user agent to standard Chrome to avoid Google blocks
    // Google blocks Electron user agents even with identifiers removed
    const chromeUserAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    youtubeSession.setUserAgent(chromeUserAgent);

    const videoWindow = new BrowserWindow({
      width: 1024,
      height: 768,
      parent: mainWindow,
      modal: false,
      backgroundColor: '#000000',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        partition: 'persist:youtube-session', // Critical for login persistence
        webSecurity: true,
      },
    });

    const windowId = Date.now();
    videoWindows.set(windowId, videoWindow);

    // Load YouTube URL directly (not embed URL)
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    videoWindow.loadURL(youtubeUrl, {
      userAgent: chromeUserAgent,
    });

    // Inject CSS to hide distractions after page loads
    videoWindow.webContents.on('did-finish-load', () => {
      videoWindow.webContents.insertCSS(`
        /* Hide top navigation bar elements */
        #start,
        #logo,
        ytd-masthead #start,
        ytd-masthead #logo,
        #center,
        #search,
        #search-form,
        ytd-searchbox,
        #end,
        ytd-masthead #end,
        ytd-button-renderer.ytd-masthead,
        yt-icon-button.ytd-masthead,
        .ytd-masthead[aria-label*="Sign in"],
        ytd-masthead #buttons {
          display: none !important;
        }

        /* Hide related videos sidebar */
        #related,
        #secondary,
        #secondary-inner,
        ytd-watch-next-secondary-results-renderer {
          display: none !important;
        }

        /* Hide comments section */
        #comments,
        ytd-comments,
        ytd-comments-header-renderer,
        ytd-item-section-renderer[comments-area] {
          display: none !important;
        }

        /* Hide end screen recommendations */
        .ytp-ce-element,
        .ytp-endscreen-content,
        .ytp-suggestion-set {
          display: none !important;
        }

        /* Make video player take full width */
        #primary,
        #primary-inner,
        ytd-watch-flexy {
          max-width: 100% !important;
        }

        /* Keep description visible */
        #description,
        ytd-video-description-header-renderer,
        ytd-expandable-video-description-body-renderer {
          display: block !important;
        }
       `);

      // Enable theatre mode by default if not already active
      videoWindow.webContents.executeJavaScript(`
        setTimeout(() => {
          // Check if theater mode is already active
          const player = document.querySelector('ytd-watch-flexy');
          const isTheaterMode = player && player.hasAttribute('theater');

          if (!isTheaterMode) {
            // Theater mode is not active, so click the button
            const theatreButton = document.querySelector('button[aria-label="Theater mode (t)"]') ||
                                  document.querySelector('.ytp-size-button[aria-label*="Theater"]') ||
                                  document.querySelector('button.ytp-size-button');
            if (theatreButton) {
              console.log('Activating theater mode...');
              theatreButton.click();
            } else {
              console.log('Theater mode button not found');
            }
          } else {
            console.log('Theater mode already active');
          }
        }, 3000);
      `);
    });

    // Cleanup on close
    videoWindow.on('closed', () => {
      videoWindows.delete(windowId);
    });

    // Prevent navigation away from YouTube/Google
    videoWindow.webContents.on('will-navigate', (event, url) => {
      if (!url.includes('youtube.com') && !url.includes('google.com')) {
        event.preventDefault();
      }
    });

    // Allow Google OAuth popups for login, block everything else
    videoWindow.webContents.setWindowOpenHandler(({ url }) => {
      // Allow Google authentication popups
      if (url.includes('accounts.google.com') || url.includes('google.com/accounts')) {
        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            width: 500,
            height: 600,
            webPreferences: {
              partition: 'persist:youtube-session', // Share same session
              contextIsolation: true,
              nodeIntegration: false,
            },
          },
        };
      }
      // Block all other popups (ads, etc)
      return { action: 'deny' };
    });

    return { windowId, success: true };
  } catch (error) {
    console.error('Error creating video window:', error);
    return { success: false, error: error.message };
  }
});

// Close specific video window
ipcMain.handle('close-video-window', async (event, windowId) => {
  const window = videoWindows.get(windowId);
  if (window && !window.isDestroyed()) {
    window.close();
    return { success: true };
  }
  return { success: false, error: 'Window not found' };
});

// Close all video windows
ipcMain.handle('close-all-video-windows', async () => {
  let closed = 0;
  videoWindows.forEach(window => {
    if (!window.isDestroyed()) {
      window.close();
      closed++;
    }
  });
  videoWindows.clear();
  return { success: true, closed };
});

// Cleanup all video windows before app quits
app.on('before-quit', () => {
  videoWindows.forEach(window => {
    if (!window.isDestroyed()) {
      window.destroy();
    }
  });
  videoWindows.clear();
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0 && app.isReady()) {
    createWindow();
  }
});
