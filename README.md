# CCNA Modules Desktop Application

A desktop application for organizing and tracking progress through Jeremy's IT Lab CCNA 200-301 course content.

## Overview

This Electron-based desktop application provides a structured interface for:

- Accessing all 63 days of CCNA course modules
- Watching course videos on YouTube
- Opening Packet Tracer lab files
- Managing Anki flashcard decks
- Tracking learning progress

## Features

✅ **63 Complete Modules** - All days of the CCNA course
✅ **Video Integration** - Direct links to YouTube course videos
✅ **Lab Management** - Open .pkt files directly in Packet Tracer
✅ **Flashcard Support** - Import .apkg files into Anki
✅ **Progress Tracking** - Local storage-based completion tracking
✅ **Offline-Ready** - All resources bundled (videos require internet)
✅ **Cross-Platform** - Builds for macOS, Windows, and Linux

## Tech Stack

- **Electron** - Desktop application framework
- **React 19** - UI framework with new createRoot API
- **Webpack 5** - Module bundler
- **electron-builder** - Application packaging
- **ESLint + Prettier** - Code quality and formatting
- **LocalStorage** - Progress persistence

## Installation & Setup

### For End Users

See [DISTRIBUTION_GUIDE.md](DISTRIBUTION_GUIDE.md) for installation instructions.

### For Developers

#### Prerequisites

- Node.js 18+ and npm
- Git

#### Installation

```bash
# Clone the repository
git clone <repository-url>
cd CCNA-Modules

# Install dependencies
npm install

# Build the React app
npm run build

# Start the application
npm start
```

#### Development Mode

```bash
# Run webpack dev server (for React development)
npm run dev

# In another terminal, start Electron
npm start
```

### Production Build

```bash
# Build for current platform
npm run dist

# Build for specific platforms
npm run dist:mac    # macOS (DMG + ZIP)
npm run dist:win    # Windows (NSIS + Portable)
npm run dist:linux  # Linux (AppImage + deb)
```

See [BUILD_NOTES.md](BUILD_NOTES.md) for detailed build information.

## Project Structure

```
CCNA-Modules/
├── src/
│   ├── components/        # React components
│   │   ├── ModuleList.js
│   │   ├── ModuleDetail.js
│   │   ├── VideoCard.js
│   │   └── LoadingScreen.js
│   ├── data/
│   │   └── modules.js     # All 63 modules data
│   ├── utils/
│   │   └── progressTracker.js
│   ├── styles/            # CSS files
│   ├── App.js
│   └── index.js
├── public/
│   └── index.html
├── resources/             # Lab and flashcard files (119 files)
├── main.js               # Electron main process
├── webpack.config.js
├── package.json
└── dist/                 # Webpack build output
```

## Available Scripts

### Development

```bash
npm run dev          # Start webpack dev server
npm start           # Launch Electron app
npm run build       # Build React app with webpack
```

### Production Building

```bash
npm run dist        # Build for current platform
npm run dist:mac    # Build for macOS (DMG + ZIP)
npm run dist:win    # Build for Windows (NSIS + Portable)
npm run dist:linux  # Build for Linux (AppImage + deb)
```

### Code Quality

```bash
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint errors
npm run format      # Format with Prettier
npm run format:check # Check formatting
```

## User Prerequisites

To use all features, users need:

1. **Cisco Packet Tracer** - For opening .pkt lab files
2. **Anki** - For importing .apkg flashcard decks
3. **Internet connection** - For watching YouTube videos

## Key Technical Decisions

### Video Playback

Initially attempted to embed YouTube videos using react-youtube, but Jeremy's IT Lab has disabled embedding (Error 153). Solution: Videos now open in external browser with thumbnail previews.

### Resource Handling

- **Development**: Resources loaded from `./resources/` directory
- **Production**: Resources bundled using electron-builder's `extraResources`
- Access via `process.resourcesPath` in packaged apps

### Progress Tracking

Uses localStorage for offline-capable progress tracking:

- Video completion status
- Lab completion status
- Flashcard import status
- Module and overall progress percentages

### Security

- CSP (Content Security Policy) configured
- webSecurity enabled
- No remote code execution
- YouTube thumbnails allowed for preview images

## Module Data Structure

Each module in `src/data/modules.js`:

```javascript
{
  id: 1,
  day: 1,
  title: 'Network Devices',
  videos: [
    { id: 'H8W9oMNSuwo', title: 'Network Devices', duration: '17:06' }
  ],
  resources: {
    lab: 'Day 01 Lab - Packet Tracer Introduction.pkt',
    flashcards: 'Day 01 Flashcards - Network Devices.apkg'
  }
}
```

## Known Limitations

1. **Code Signing**: App is not code signed
   - macOS users must right-click → Open on first launch
   - Windows users may see SmartScreen warnings

2. **Video IDs**: Some videos marked as 'PLACEHOLDER'
   - Need to be updated with actual YouTube video IDs

3. **Icon**: Uses default Electron icon
   - Custom icons can be added to `build/` directory

## Future Enhancements

- [ ] Update PLACEHOLDER video IDs
- [ ] Add custom application icons
- [ ] Code signing certificates for trusted distribution
- [ ] Search/filter functionality
- [ ] Export progress reports
- [ ] Theme customization
- [ ] Notes feature for each module

## Credits

- **Course Content**: Jeremy's IT Lab CCNA 200-301 Course
- **YouTube Channel**: https://www.youtube.com/@JeremysITLab
- **Application**: Built as a learning organization tool

## License

MIT License

Course materials and videos are © Jeremy's IT Lab.

## Support

For application issues, see [DISTRIBUTION_GUIDE.md](DISTRIBUTION_GUIDE.md).

For course content questions, visit Jeremy's IT Lab YouTube channel.

## Changelog

### Version 1.0.0

- Initial release
- 63 complete modules
- Progress tracking
- Video, lab, and flashcard integration
- macOS builds (Intel + Apple Silicon)
- Cross-platform build configuration
