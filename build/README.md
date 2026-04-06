# App Icons

This directory should contain application icons for different platforms.

## Required Icon Files

### macOS (icon.icns)
- Format: .icns file
- Recommended size: 512x512px or 1024x1024px source image
- You can use online tools or ImageMagick to convert PNG to ICNS

### Windows (icon.ico)
- Format: .ico file
- Recommended sizes: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256
- You can use online tools to create multi-resolution ICO files

### Linux (icon.png)
- Format: .png file
- Recommended size: 512x512px

## Creating Icons

1. Create or design a 1024x1024px PNG icon for your app
2. Use online converters or tools like:
   - macOS: `sips` command or Xcode
   - Windows: Use online ICO converters
   - Linux: Use the PNG directly

## Temporary Solution

If icons are missing, electron-builder will use a default icon, but the build will succeed.
For a production release, you should add proper icons for all platforms.
