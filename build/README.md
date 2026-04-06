# App Icons

This directory contains application icons for different platforms.

## Current Status

✅ **Custom icon created** - Located in `../assets/icon.svg`

A simple network topology icon representing CCNA networking concepts:
- Dark blue background (#1a1a2e)
- Central hub with connecting nodes
- Color-coded status indicators (green for active, red for alerts)
- Clean, modern design suitable for all platforms

## Icon Files

### macOS (icon.icns)
- Format: .icns file
- Source: `assets/icon.svg`
- Recommended: 512x512px or 1024x1024px

### Windows (icon.ico)
- Format: .ico file
- Recommended sizes: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256
- Must include multiple resolutions

### Linux (icon.png)
- Format: .png file
- Recommended size: 512x512px

## Generating Icons

### Option 1: Use online converter
1. Open `assets/icon.svg` in browser or editor
2. Screenshot or export as PNG (512x512)
3. Use [appicon.co](https://appicon.co/) or [cloudconvert.com](https://cloudconvert.com/svg-to-icns)
4. Upload PNG and generate all formats
5. Place generated files in this directory:
   - `icon.icns` (macOS)
   - `icon.ico` (Windows)
   - `icon.png` (Linux)

### Option 2: Command line tools

#### macOS (using sips and iconutil)
```bash
# Convert SVG to PNG first (using ImageMagick or other tool)
convert ../assets/icon.svg -resize 1024x1024 icon_1024x1024.png

# Create iconset
mkdir icon.iconset
sips -z 16 16 icon_1024x1024.png --out icon.iconset/icon_16x16.png
sips -z 32 32 icon_1024x1024.png --out icon.iconset/icon_32x32.png
sips -z 64 64 icon_1024x1024.png --out icon.iconset/icon_64x64.png
sips -z 128 128 icon_1024x1024.png --out icon.iconset/icon_128x128.png
sips -z 256 256 icon_1024x1024.png --out icon.iconset/icon_256x256.png
sips -z 512 512 icon_1024x1024.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 icon_1024x1024.png --out icon.iconset/icon_1024x1024.png

# Compile to .icns
iconutil -c icns icon.iconset -o icon.icns

# Cleanup
rm -rf icon.iconset icon_1024x1024.png
```

#### Windows/Linux (using ImageMagick)
```bash
# Install ImageMagick first: brew install imagemagick

# Convert SVG to PNG at 512x512
convert ../assets/icon.svg -resize 512x512 icon.png

# For Windows .ico with multiple sizes
convert ../assets/icon.svg -resize 256x256 icon.ico
```

### Option 3: Electron build without icons
If no icons are present, electron-builder will use a default Electron icon, but the build will succeed.

## Design Notes

The icon represents:
- **Network topology** - Central hub with connected nodes
- **CCNA networking** - Router/switch connections
- **Status awareness** - Different colors for different states
- **Professional** - Clean, tech-focused aesthetic

## Troubleshooting

### macOS: "App is damaged" warning
This happens when the app isn't code signed. Users need to right-click → Open.

### Windows: SmartScreen warning
Unsigned apps trigger warnings. Code signing certificate required to prevent this.

### Linux: Icon not showing
Ensure `icon.png` is in this directory and referenced correctly in package.json.

## Next Steps

1. Generate icon files from `assets/icon.svg`
2. Place in this directory
3. Rebuild application
4. Test icons appear correctly on each platform
