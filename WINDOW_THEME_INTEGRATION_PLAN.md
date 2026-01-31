# Window Theme Integration Plan

## Overview

Extend theme colors beyond app content to affect the entire Electron window, creating a more immersive and professional application experience.

## Current State Analysis

- **Scope**: Themes only affect app content within Electron window
- **Method**: CSS custom properties applied to `document.documentElement`
- **Limitation**: Electron window frame/border remains system default

## Implementation Strategy: Window Background Color Only

### Phase 1: Main Process Theme Management

#### File: main.js (Electron Main Process)

```javascript
// Import themes from renderer process
const themes = require('./src/utils/themes.js');

// Window theme management
let currentWindowTheme = 'spacegrayLight';

const updateWindowBackground = themeId => {
  const theme = themes[themeId];
  if (theme && mainWindow) {
    // Set window background color
    mainWindow.setBackgroundColor(theme.background);

    // Optional: Add vibrancy for macOS
    if (process.platform === 'darwin') {
      mainWindow.setVibrancy('under-window');
    }

    currentWindowTheme = themeId;
  }
};

// IPC handler for theme changes
ipcMain.handle('update-window-theme', (event, themeId) => {
  updateWindowBackground(themeId);
  return { success: true, themeId };
});
```

#### Window Creation Update:

```javascript
const mainWindow = new BrowserWindow({
  width: 1200,
  height: 800,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
  },
  // Set initial background
  backgroundColor: themes[currentWindowTheme].background,
  // Optional: Enable vibrancy on macOS
  vibrancy: process.platform === 'darwin' ? 'under-window' : undefined,
});
```

### Phase 2: Renderer Process Communication

#### File: App.js (Renderer Process)

```javascript
// Update window background when theme changes
const updateWindowBackground = themeId => {
  if (window.electronAPI) {
    window.electronAPI.send('update-window-theme', themeId);
  }
};

// Call when theme changes
useEffect(() => {
  updateWindowBackground(currentTheme);
}, [currentTheme]);

// Also update on initial load
useEffect(() => {
  updateWindowBackground(currentTheme);
}, []);
```

#### File: preload.js (Electron Preload)

```javascript
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Existing API methods...
  // Add theme communication
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },

  invoke: (channel, data) => {
    return ipcRenderer.invoke(channel, data);
  },
});
```

### Phase 3: Cross-Platform Considerations

#### macOS Specific Features:

```javascript
// Enhanced macOS integration
if (process.platform === 'darwin') {
  // Enable window vibrancy for glass effect
  mainWindow.setVibrancy('under-window');

  // Optional: Set traffic light position
  mainWindow.setTrafficLightPosition({ x: 20, y: 20 });
}
```

#### Windows Specific Features:

```javascript
// Windows 11 integration
if (process.platform === 'win32') {
  // Set window background (works on Windows 10/11)
  mainWindow.setBackgroundColor(theme.background);

  // Optional: Enable Mica effect if available
  if (os.release().startsWith('10.')) {
    // Windows 11 Mica/Acrylic effects
    mainWindow.setBackgroundMaterial('mica');
  }
}
```

#### Linux Considerations:

```javascript
// Linux desktop environment handling
if (process.platform === 'linux') {
  // Basic background color support
  mainWindow.setBackgroundColor(theme.background);

  // Note: Effects depend on desktop environment
  // GNOME, KDE, etc. may have different capabilities
}
```

## Platform-Specific Effects

### macOS

- **Vibrancy**: Blur/transparency effects
- **Glass Morphism**: Modern glass appearance
- **Traffic Lights**: Native window controls
- **Smooth Transitions**: Native animation support

### Windows

- **Background Color**: Solid color support
- **Mica Effect**: Windows 11 material design
- **Acrylic Blur**: Transparency effects
- **Native Controls**: System window controls

### Linux

- **Basic Support**: Background color
- **Desktop Dependent**: Varies by environment
- **Window Manager**: Different capabilities
- **Consistent**: Basic theme integration

## Implementation Benefits

### User Experience

- **Immersive**: Window background matches app theme
- **Professional**: More integrated appearance
- **Consistent**: Seamless theme experience
- **Native Feel**: Less like web app, more like native app

### Technical Advantages

- **Simple**: Minimal code changes
- **Cross-Platform**: Works on all supported OS
- **Performance**: Native window styling
- **Reliable**: Uses Electron's built-in capabilities

### Development Impact

- **Low Complexity**: Simple IPC communication
- **Maintainable**: Clean separation of concerns
- **Testable**: Easy to verify functionality
- **Extensible**: Foundation for future enhancements

## Testing Strategy

### Cross-Platform Testing

1. **macOS**: Test vibrancy effects and color matching
2. **Windows**: Verify background color and Mica effects
3. **Linux**: Test basic background color support

### Theme Testing

1. **All Themes**: Verify each theme's background color
2. **Theme Switching**: Test real-time updates
3. **Performance**: Ensure smooth transitions
4. **Edge Cases**: Handle invalid themes gracefully

### User Experience Testing

1. **First Impression**: Initial window appearance
2. **Theme Changes**: Real-time background updates
3. **Window Controls**: Ensure functionality preserved
4. **Performance**: No lag or visual glitches

## Expected Results

### Visual Integration

- **Seamless**: Window background matches app theme
- **Professional**: More polished appearance
- **Consistent**: Complete theme experience
- **Native**: Feels like system application

### Technical Performance

- **Fast**: Instant background color updates
- **Efficient**: Minimal resource usage
- **Stable**: No crashes or visual artifacts
- **Cross-Platform**: Consistent behavior

## Future Enhancement Opportunities

### Advanced Window Styling

- **Frameless Windows**: Complete custom window design
- **Custom Title Bars**: Theme-integrated title areas
- **Window Borders**: Theme-colored window borders
- **Custom Controls**: Styled window control buttons

### Platform-Specific Features

- **macOS Vibrancy**: Advanced blur effects
- **Windows Materials**: Mica, Acrylic, and other effects
- **Linux Integration**: Desktop environment specific features
- **Animation Support**: Smooth theme transition animations

## Implementation Timeline

### Phase 1: Core Implementation (2-3 hours)

- Main process theme management
- IPC communication setup
- Basic background color updates

### Phase 2: Platform Integration (1-2 hours)

- macOS vibrancy effects
- Windows Mica effects
- Linux basic support

### Phase 3: Testing & Polish (1-2 hours)

- Cross-platform testing
- Theme switching verification
- Performance optimization

**Total Estimated Time**: 4-7 hours

## Success Metrics

### Functional Requirements

- ✅ Window background matches selected theme
- ✅ Real-time updates when theme changes
- ✅ Cross-platform compatibility
- ✅ No performance degradation

### Quality Requirements

- ✅ Professional appearance
- ✅ Native feel
- ✅ Smooth transitions
- ✅ Stable operation

This implementation would significantly enhance the application's professional appearance by extending theme colors to the entire window, making it feel more like a native, polished application rather than a web app in a browser window.
