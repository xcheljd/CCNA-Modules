# Distribution Guide

## Overview

The CCNA Modules desktop application is now packaged and ready for distribution. This guide explains how to share the application with users.

## Available Builds

### macOS

Located in `release/`:

- **CCNA Modules-1.0.0.dmg** - Intel Mac installer (~127 MB)
- **CCNA Modules-1.0.0-arm64.dmg** - Apple Silicon installer (~122 MB)
- **CCNA Modules-1.0.0-mac.zip** - Intel Mac portable (~123 MB)
- **CCNA Modules-1.0.0-arm64-mac.zip** - Apple Silicon portable (~118 MB)

### What's Included

✅ All 63 CCNA course modules (Days 1-63)
✅ All lab files (.pkt) - 59 Packet Tracer labs
✅ All flashcard decks (.apkg) - 97 Anki flashcard sets
✅ Video links to Jeremy's IT Lab YouTube channel
✅ Progress tracking (saved locally)
✅ Module completion tracking
✅ Search and filter functionality
✅ 14 color themes (Nord, Catppuccin, Ayu, Rose Pine, Gruvbox, and more)
✅ Study streak tracking
✅ Performance analytics and charts
✅ Smart study recommendations

## User Installation Instructions

### macOS (DMG)

1. Download the appropriate DMG file:
   - Intel Mac: `CCNA Modules-1.0.0.dmg`
   - Apple Silicon (M1/M2/M3): `CCNA Modules-1.0.0-arm64.dmg`
2. Open the DMG file
3. Drag "CCNA Modules" to the Applications folder
4. **First launch**: Right-click the app and select "Open" (due to no code signing)
5. Click "Open" in the security dialog

### macOS (ZIP)

1. Download and extract the ZIP file
2. Move "CCNA Modules.app" to Applications
3. **First launch**: Right-click and select "Open"

## Security Notice for Users

⚠️ **Gatekeeper Warning**: Since the app is not code signed with an Apple Developer certificate, users will see a security warning on first launch.

**Instructions for users**:

1. Don't double-click the app initially
2. Right-click (or Control+click) on "CCNA Modules"
3. Select "Open" from the menu
4. Click "Open" in the dialog
5. The app will now run normally on all future launches

## Prerequisites for Users

### Required Software

1. **Packet Tracer** (for .pkt lab files)
   - Download from: https://www.netacad.com/courses/packet-tracer
   - Free with Cisco Networking Academy account

2. **Anki** (for .apkg flashcard files)
   - Download from: https://apps.ankiweb.net/
   - Free and open source

### System Requirements

- **macOS**: 10.13 or later
- **RAM**: 4 GB minimum (8 GB recommended)
- **Disk Space**: 500 MB for app + resources
- **Internet**: Required for YouTube videos only

## Features Guide for Users

### Module Navigation

- Browse all 63 days of CCNA content
- See progress percentage for each module
- Track overall course completion

### Videos

- Click "Watch Video" to open videos in browser
- Manually mark videos as watched
- Duration shown for each video
- All videos have actual YouTube IDs (no placeholders)

### Labs

- Click "Open Lab File" to launch in Packet Tracer
- Mark labs as complete when finished
- Lab files open directly in Packet Tracer

### Flashcards

- Click "Add to Anki" to open flashcard deck
- Import into Anki for study
- Mark as added to track progress

### Progress Tracking

- Progress saved automatically
- Stored locally on your computer
- Module completion calculated from:
  - Videos watched
  - Labs completed
  - Flashcards added
  - Confidence ratings (1-5 stars per module)

### Search & Filter

- Search modules by title or content
- Filter by completion status (completed, in progress, not started)
- Filter by confidence level (need review, okay, confident)

### Settings

Access via the settings gear icon:

- **Resources Path** - Set custom location for lab/flashcard files
- **Dashboard** - Customize which dashboard sections to show/hide
- **Theme** - Choose from 14 color themes
- **Data Management** - Export/import progress backups
- **About** - App information and links

## Building for Windows/Linux

To create builds for other platforms:

```bash
# Windows (from macOS requires Wine)
npm run dist:win

# Linux
npm run dist:linux
```

See BUILD_NOTES.md for detailed build instructions.

## Code Signing (Optional but Recommended)

For professional distribution without security warnings:

### macOS

1. Obtain Apple Developer ID certificate ($99/year)
2. Configure code signing in package.json
3. Rebuild with: `npm run dist:mac`

### Windows

1. Obtain code signing certificate
2. Configure in package.json
3. Rebuild with: `npm run dist:win`

## Support and Issues

If users encounter issues:

1. Verify Packet Tracer and Anki are installed
2. Check system requirements are met
3. Try right-click "Open" method for security warnings
4. Ensure resource files are accessible in app bundle

## License and Attribution

This application provides access to Jeremy's IT Lab CCNA course content:

- Videos: © Jeremy's IT Lab (https://www.youtube.com/@JeremysITLab)
- Course materials used with educational intent
- Application is a learning tool for course organization

## File Checksums

To verify download integrity, generate checksums:

```bash
# macOS/Linux
shasum -a 256 "release/CCNA Modules-1.0.0.dmg"
shasum -a 256 "release/CCNA Modules-1.0.0-arm64.dmg"
```

Share these checksums with users so they can verify their downloads.
