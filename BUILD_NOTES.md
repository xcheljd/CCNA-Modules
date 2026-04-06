# Build Notes

## Build Configuration

The application is configured with electron-builder to create distributable packages for multiple platforms.

## Build Commands

```bash
# Build for all platforms (current: macOS)
npm run dist

# Build for specific platforms
npm run dist:mac    # macOS (DMG and ZIP for both x64 and arm64)
npm run dist:win    # Windows (NSIS installer and portable)
npm run dist:linux  # Linux (AppImage and deb)
```

## Build Output

Built applications are placed in the `release/` directory:

### macOS

- **DMG installers**: `CCNA Modules-1.0.0.dmg` (Intel) and `CCNA Modules-1.0.0-arm64.dmg` (Apple Silicon)
- **ZIP archives**: `CCNA Modules-1.0.0-mac.zip` (Intel) and `CCNA Modules-1.0.0-arm64-mac.zip` (Apple Silicon)

### Windows (when built on Windows or with Wine)

- **NSIS installer**: `CCNA Modules Setup 1.0.0.exe`
- **Portable**: `CCNA Modules 1.0.0.exe`

### Linux (when built on Linux)

- **AppImage**: `CCNA Modules-1.0.0.AppImage`
- **Debian package**: `ccna-modules_1.0.0_amd64.deb`

## Important Notes

### Resources Folder

The `resources/` folder containing all `.pkt` and `.apkg` files is automatically bundled with the application using electron-builder's `extraResources` configuration. In production builds, these files are accessed via `process.resourcesPath`.

### Code Signing

Currently, the app is **not code signed**. For distribution:

- **macOS**: Users may need to right-click and select "Open" the first time due to Gatekeeper
- **Windows**: Users may see SmartScreen warnings
- To properly sign the app, you need:
  - macOS: Apple Developer ID certificate
  - Windows: Code signing certificate

### Icons

The build currently uses default Electron icons. To add custom icons:

1. Place icon files in the `build/` directory:
   - `icon.icns` for macOS
   - `icon.ico` for Windows
   - `icon.png` for Linux (512x512px)
2. Rebuild the application

## Distribution Recommendations

### For End Users

1. **DMG (macOS)**: Most user-friendly for macOS users
2. **NSIS Installer (Windows)**: Standard installer experience
3. **AppImage (Linux)**: Universal Linux format, no installation needed

### For Portable Use

1. **ZIP archives (macOS)**: Extract and run anywhere
2. **Portable exe (Windows)**: Single executable, no installation
3. **AppImage (Linux)**: Already portable

## Testing the Build

To test a production build locally:

1. Navigate to `release/mac/` or `release/mac-arm64/`
2. Open `CCNA Modules.app`
3. Verify that:
   - App launches correctly
   - All 63 modules are visible
   - Videos open in browser
   - Lab and flashcard files open correctly
   - Progress tracking works

## File Size

The application is approximately 440MB due to:

- Electron runtime (~200MB)
- Chromium rendering engine
- React and dependencies
- All resource files (.pkt and .apkg files)

## Cross-Platform Building

electron-builder can build for multiple platforms from a single machine, but some limitations apply:

- **From macOS**: Can build for macOS, Windows (with Wine), and Linux
- **From Windows**: Can build for Windows and Linux
- **From Linux**: Can build for Linux and Windows

For best results, build on the target platform or use a CI/CD service.
