/* global URL */
const { app, BrowserWindow, ipcMain, shell, dialog, nativeImage, session } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
const videoWindows = new Map();

// Check if a URL's hostname matches any allowed domains (exact or subdomain)
function isAllowedHostname(urlString, allowedDomains) {
  try {
    const { hostname } = new URL(urlString);
    return allowedDomains.some(domain => hostname === domain || hostname.endsWith('.' + domain));
  } catch {
    return false;
  }
}

const YOUTUBE_PARTITION = 'persist:youtube-session';

// YouTube treats the session as Chrome only when the Electron identifier is absent from the UA
function getChromeUserAgent(sess) {
  return sess
    .getUserAgent()
    .replace(/Electron\/\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

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

function getAppIcon() {
  const platform = process.platform;
  const iconFile =
    platform === 'darwin' ? 'icon.icns' : platform === 'win32' ? 'icon.ico' : 'icon.png';
  const iconPath = path.join(__dirname, 'build', iconFile);
  return fs.existsSync(iconPath) ? iconPath : undefined;
}

function createWindow() {
  const iconPath = getAppIcon();

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
  });

  if (process.platform === 'darwin' && iconPath) {
    try {
      const dockIcon = nativeImage.createFromPath(iconPath);
      if (!dockIcon.isEmpty()) {
        app.dock.setIcon(dockIcon);
      }
    } catch (err) {
      console.log('Could not set dock icon:', err.message);
    }
  }

  const isDev = !app.isPackaged;
  mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  if (isDev) {
    mainWindow.webContents.openDevTools();
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
  try {
    // Validate filename to prevent path traversal
    if (typeof filename !== 'string' || filename.length === 0) {
      return { success: false, error: 'Invalid filename' };
    }

    const resourcesPath = path.resolve(getResourcesPath());
    const filePath = path.resolve(path.join(resourcesPath, filename));

    // Ensure resolved path stays within resources directory
    if (!filePath.startsWith(resourcesPath + path.sep) && filePath !== resourcesPath) {
      return { success: false, error: 'Invalid file path: path traversal detected' };
    }

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
    // Validate URL: only allow https: and http: protocols
    if (typeof url !== 'string') {
      return { success: false, error: 'Invalid URL: expected a string' };
    }
    const parsed = new URL(url);
    if (!['https:', 'http:'].includes(parsed.protocol)) {
      return { success: false, error: `Protocol not allowed: ${parsed.protocol}` };
    }
    await shell.openExternal(url);
    return { success: true };
  } catch (error) {
    return { success: false, error: `Invalid URL: ${error.message}` };
  }
});

// Export progress backup to a user-selected file
ipcMain.handle('export-progress-backup', async (event, exportData) => {
  try {
    // Validate data size: reject payloads exceeding 5MB
    const MAX_EXPORT_SIZE = 5 * 1024 * 1024; // 5MB
    const dataSize = Buffer.byteLength(JSON.stringify(exportData), 'utf8');
    if (dataSize > MAX_EXPORT_SIZE) {
      return {
        success: false,
        error: `Export data too large: ${(dataSize / (1024 * 1024)).toFixed(2)}MB exceeds 5MB limit`,
      };
    }

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
    // Validate videoId: must match YouTube 11-character format
    if (typeof videoId !== 'string' || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return { success: false, error: 'Invalid video ID: must be 11 alphanumeric characters' };
    }
    // Get persistent session for YouTube (enables login persistence)
    const youtubeSession = session.fromPartition(YOUTUBE_PARTITION);
    const chromeUserAgent = getChromeUserAgent(youtubeSession);
    youtubeSession.setUserAgent(chromeUserAgent);

    const videoWindow = new BrowserWindow({
      width: 1024,
      height: 768,
      backgroundColor: '#000000',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        partition: YOUTUBE_PARTITION, // Critical for login persistence
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
      const allowed = isAllowedHostname(url, ['youtube.com', 'google.com']);
      if (!allowed) {
        event.preventDefault();
      }
    });

    // Allow Google OAuth popups for login, block everything else
    videoWindow.webContents.setWindowOpenHandler(({ url }) => {
      // Allow Google authentication popups
      const allowed = isAllowedHostname(url, ['accounts.google.com', 'google.com']);
      if (allowed) {
        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            width: 500,
            height: 600,
            webPreferences: {
              partition: YOUTUBE_PARTITION, // Share same session
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
  // Validate windowId: must be a number
  if (typeof windowId !== 'number') {
    return { success: false, error: 'Invalid window ID: must be a number' };
  }

  const window = videoWindows.get(windowId);
  if (window && !window.isDestroyed()) {
    window.close();
    return { success: true };
  }
  // Clean up stale entry if window was already destroyed
  videoWindows.delete(windowId);
  return { success: false, error: 'Window not found' };
});

// Close all open video windows and return the count closed
function closeAllVideoWindows() {
  let closed = 0;
  videoWindows.forEach(window => {
    if (!window.isDestroyed()) {
      window.close();
      closed++;
    }
  });
  videoWindows.clear();
  return closed;
}

ipcMain.handle('close-all-video-windows', async () => {
  const closed = closeAllVideoWindows();
  return { success: true, closed };
});

// Open a Google/YouTube sign-in window in the shared persistent partition
ipcMain.handle('open-youtube-signin', async () => {
  try {
    const youtubeSession = session.fromPartition(YOUTUBE_PARTITION);
    const chromeUserAgent = getChromeUserAgent(youtubeSession);
    youtubeSession.setUserAgent(chromeUserAgent);

    const signinWindow = new BrowserWindow({
      width: 500,
      height: 700,
      backgroundColor: '#ffffff',
      title: 'Sign in to YouTube',
      parent: mainWindow && !mainWindow.isDestroyed() ? mainWindow : undefined,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        partition: YOUTUBE_PARTITION,
        webSecurity: true,
      },
    });

    signinWindow.loadURL(
      'https://accounts.google.com/ServiceLogin?service=youtube&continue=https%3A%2F%2Fwww.youtube.com%2F',
      { userAgent: chromeUserAgent }
    );

    signinWindow.webContents.on('will-navigate', (event, url) => {
      if (!isAllowedHostname(url, ['google.com', 'youtube.com'])) {
        event.preventDefault();
      }
    });

    // Deterministic signal that YouTube has finished its own session handshake:
    // SAPISID is only written to .youtube.com once the user has an authenticated
    // YouTube session. Listening for the cookie event avoids load-timing guesses.
    const onCookieChanged = (_event, cookie, _cause, removed) => {
      if (removed) return;
      if (cookie.name !== 'SAPISID') return;
      const domain = cookie.domain || '';
      if (!domain.endsWith('youtube.com')) return;
      youtubeSession.cookies.removeListener('changed', onCookieChanged);
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('youtube-signin-changed', { signedIn: true });
      }
      if (!signinWindow.isDestroyed()) {
        signinWindow.close();
      }
    };
    youtubeSession.cookies.on('changed', onCookieChanged);
    signinWindow.on('closed', () => {
      youtubeSession.cookies.removeListener('changed', onCookieChanged);
    });

    signinWindow.webContents.setWindowOpenHandler(({ url }) => {
      const allowed = isAllowedHostname(url, ['accounts.google.com', 'google.com']);
      if (allowed) {
        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            width: 500,
            height: 600,
            webPreferences: {
              partition: YOUTUBE_PARTITION,
              contextIsolation: true,
              nodeIntegration: false,
            },
          },
        };
      }
      return { action: 'deny' };
    });

    return { success: true };
  } catch (error) {
    console.error('Error opening YouTube sign-in window:', error);
    return { success: false, error: error.message };
  }
});

// Presence of SAPISID on .youtube.com reliably indicates an authenticated session
ipcMain.handle('youtube-signin-status', async () => {
  try {
    const cookies = await session
      .fromPartition(YOUTUBE_PARTITION)
      .cookies.get({ domain: '.youtube.com', name: 'SAPISID' });
    return { signedIn: cookies.length > 0 };
  } catch (error) {
    console.error('Error reading YouTube sign-in status:', error);
    return { signedIn: false, error: error.message };
  }
});

ipcMain.handle('youtube-signout', async () => {
  try {
    closeAllVideoWindows();
    await session.fromPartition(YOUTUBE_PARTITION).clearStorageData();
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('youtube-signin-changed', { signedIn: false });
    }
    return { success: true };
  } catch (error) {
    console.error('Error signing out of YouTube:', error);
    return { success: false, error: error.message };
  }
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
  // Close any lingering video windows on all platforms
  videoWindows.forEach(window => {
    if (!window.isDestroyed()) {
      window.destroy();
    }
  });
  videoWindows.clear();

  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0 && app.isReady()) {
    createWindow();
  }
});
