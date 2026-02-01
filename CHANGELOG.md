# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Study timer feature (in progress)
- Keyboard shortcuts support (planned)
- Quiz mode for self-assessment (planned)

### Changed

- Improved documentation organization
- Consolidated feature tracking

## [1.0.0] - 2025-01-31

### Added

- Initial release of CCNA Modules desktop application
- **63 complete modules** covering entire CCNA 200-301 course
- **59 Packet Tracer lab files** (.pkt) - Hands-on networking practice
- **97 Anki flashcard decks** (.apkg) - Memorization and review
- **Search & Filter** - Find modules quickly by title or content
- **Advanced filtering** - Filter by completion status and confidence level
- **14 color themes** - Customizable appearance (Nord, Catppuccin, Ayu, Rose Pine, Gruvbox, and more)
- **Study streak tracking** - Visual calendar showing daily study habits
- **Performance analytics** - Charts and insights on learning progress
  - Confidence distribution visualization
  - Activity heatmap
  - Progress trends over time
- **Smart recommendations** - AI-powered suggestions for what to study next
- **Confidence rating system** - Rate understanding of each module (1-5 stars)
- **Learning goals** - Set and track custom study goals with deadlines
- **Upcoming milestones** - Visual progress toward completion milestones
- **Export/Backup** - JSON export/import for progress backup and migration
- **Cross-platform support** - Builds for macOS, Windows, and Linux
- **Offline capability** - All resources bundled (videos require internet)

### Technical

- Electron 39 for desktop framework
- React 19 with new createRoot API
- Tailwind CSS 4.1 with shadcn/ui components
- Webpack 5 for bundling
- LocalStorage for offline progress persistence
- Jest + Playwright for testing

## Theme Credits

Color themes inspired by popular developer color schemes:

- **[Nord](https://www.nordtheme.com)** - Arctic-inspired north-bluish color palette
- **[Catppuccin](https://catppuccin.com)** - Soothing pastel theme with rich, warm colors
- **[Ayu](https://github.com/ayu-theme/ayu-colors)** - Clean, bright syntax highlighting colors
- **[Rose Pine](https://rosepinetheme.com)** - Muted purple-brown theme with natural elegance
- **[Gruvbox](https://github.com/morhetz/gruvbox)** - Warm, retro groove colors for daytime coding
- **[Spacegray](https://github.com/kkga/spacegray)** - Hyperminimal dark theme collection

## Known Issues

- No code signing (users see security warnings on first launch)
- Uses default Electron icons (custom icons can be added to `build/` directory)
- Video progress tracking not available (requires YouTube API authentication)
