# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-04-18

### Added

- Optional YouTube/Google sign-in via **Settings → YouTube** for ad-free
  playback (YouTube Premium), resume position, watch history, and subscription
  signals. Authentication happens directly with Google in a partitioned window
  — no OAuth tokens or credentials touch the app.
- One-time "Sign in to YouTube" prompt shown after the welcome dialog on first
  launch.

### Changed

- Extracted `getChromeUserAgent()` helper and `YOUTUBE_PARTITION` constant to
  deduplicate session partition and UA-spoofing logic across video and sign-in
  windows.
- Consolidated `closeAllVideoWindows` into a single shared helper used by both
  the `close-all-video-windows` IPC handler and YouTube sign-out.
- Added `varsIgnorePattern: '^_'` to the ESLint `no-unused-vars` rule so
  `_`-prefixed variables (common in jest.mock setups) don't trigger warnings.

### Fixed

- Eliminated all 27 pre-existing ESLint warnings across 9 test files (unused
  imports, unused variables, dead helper functions).

## [1.1.0] - 2026-04-16

### Added

- localStorage schema versioning + migration system for safe upgrades
- Radix confirmation dialog for progress import (replaces `window.confirm`)
- Tailwind CSS v4 migration
- Welcome popup with onboarding flow
- About tab with external browser links
- Toast notifications
- GitHub Actions CI/CD for cross-platform builds
- Testing infrastructure (Jest + Playwright) and component/utility test suites
  covering Dashboard, ModuleDetail, SmartRecommendations, PerformanceCharts,
  GoalCard, StudyStreak, UpcomingMilestones, performanceTracker, streakTracker,
  activityTracker, settingsManager, and colorHelpers
- Integration test for the DataManagementTab import pipeline

### Changed

- Deduplicated ESLint config by extracting shared parser options and rules
- Extracted shared `openExternal`, `asArray`, and icon components from
  duplicated code
- Webpack code splitting and loading states for faster initial render
- Smart recommendations now precompute module progress to eliminate
  O(N²) lookups
- Accessibility improvements (keyboard handlers on video cards, Enter + Space)

### Fixed

- Webpack 5 production build for Electron renderer
- Video window independence and cleanup of stale entries
- CORS bypass and navigation enforcement in the main process
- Input validation on all IPC handlers accepting renderer parameters
- Tightened CSP for production; removed unused vite deps
- `setTimeout` cleanup on component unmount (App, ModuleDetail)
- `migrate0to1` no longer clobbers already-migrated data on re-run
- `calculateWeeklyData` returns an `insufficientData` sentinel instead of
  fabricating zeroed snapshots
- Progress import ignores non-progress keys so backups cannot overwrite
  app settings or schema version
- Enforced LF line endings via `.gitattributes`

## [1.0.0] - 2025-01-31

### Added

- Initial release of CCNA Modules desktop application
- 63 complete modules covering the entire CCNA 200-301 course
- 59 Packet Tracer lab files (`.pkt`) and 97 Anki flashcard decks (`.apkg`)
- Search, filters, and module browsing
- 14 color themes (Nord, Catppuccin, Ayu, Rose Pine, Gruvbox, and more)
- Study streak tracking with visual calendar
- Performance analytics (confidence distribution, activity heatmap, trends)
- Smart study recommendations
- Confidence rating system (1–5 stars)
- Learning goals and upcoming milestones
- JSON export/import for progress backup
- Cross-platform builds (macOS, Windows, Linux)
