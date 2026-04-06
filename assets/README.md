# Assets

This directory contains static assets for the CCNA Modules application.

## Structure

```
assets/
├── screenshots/     # Application screenshots for documentation
└── icons/          # App icons (if custom icons are added)
```

## Screenshots

See [screenshots/README.md](screenshots/README.md) for guidelines on capturing and adding screenshots.

## Icons

To add custom application icons:

1. Place icon files in this directory:
   - `icon.icns` - macOS icon (512x512px minimum)
   - `icon.ico` - Windows icon (multi-resolution)
   - `icon.png` - Linux icon (512x512px)

2. Or place in `build/` directory at repo root (as configured in package.json)

3. Rebuild the application

### Icon Resources

- [App Icon Generator](https://appicon.co/) - Generate icons for all platforms
- [Figma](https://figma.com) - Design custom icons
- [macOS Icon Guidelines](https://developer.apple.com/design/human-interface-guidelines/macos/overview/iconography/)
- [Windows Icon Guidelines](https://docs.microsoft.com/en-us/windows/win32/uxguide/vis-icons)
