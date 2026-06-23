# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.2] - 2026-06-23

### Added

- Theme parity test that fails CI if `theme-colors.json` and `themes.js`
  drift out of sync (key sets, theme count, metadata, color values).
- Shared `CourseCreditContent` component used by both the first-run
  `WelcomeDialog` and the Settings -> About tab.
- StreakTracker regression tests for timezone-safe day-gap computation and
  exact 1-day / >1-day boundary cases.
- PerformanceTracker regression tests for `predictCompletionDate` (no
  velocity inflation with <14 real snapshots) and `getWeeklyVelocity`
  (carry-forward for missing days within a week).
- Track `AGENTS.md` and `CLAUDE.md` as authoritative repo documentation.
- 640+ tests across UI components, charts, and utility modules (all coverage
  thresholds passing).

### Changed

- `predictCompletionDate` now computes velocity from real snapshots within
  the 14-day window (using `differenceInCalendarDays` on actual snapshot
  dates) instead of zero-filled synthetic leading days, which previously
  overstated the completion ETA.
- `getLastWatchedVideo` / `setLastWatchedVideo` now route through the
  ProgressTracker write-through cache (`cachedRead` / `cachedWrite` /
  `cachedRemove`) for consistency with every other read/write path.
- `getWeeklyVelocity` now uses carry-forward for missing days (mirrors
  `getRecentPerformance`) so weeks with sparse data are no longer
  undercounted.
- `migrate0to1` now snapshots the `localStorage` key list before iterating,
  guarding against a future in-loop mutation skipping or revisiting keys.
- `StreakTracker.checkStreakStatus` adds a `parseISO` +
  `differenceInCalendarDays` defensive cross-check so a timezone edge case
  cannot falsely reset an active streak.
- Raised Jest coverage thresholds to match actual coverage.
- Normalized `package-lock.json` peer-dependency flags.

### Fixed

- Performance charts no longer drop to zero for days without a snapshot:
  missing days inherit the prior cumulative totals (carry-forward).
- Goal `daysRemaining` midnight edge case.
- `UpcomingMilestones` now uses the canonical overall progress calculation.
- YouTube sign-in auto-close: poll for `SAPISID` after page load rather than
  relying on navigation events alone.
- `shell.openPath` errors now propagate for labs and Anki (return value is
  a string, not a rejection).
- `performance-history` key now included in progress export / clear.
- Tightened `open-external-url` IPC handler to HTTPS-only.
- Removed dead code: `PerformanceTracker.calculateWeeklyData`, unreachable
  `'custom'` goal type, unused per-activity timestamps in StreakTracker.
- Hardened YouTube sign-in window: security hardening, auto-close, autofill
  preservation, and server-side session-expiry detection.

## [1.2.1] - 2026-04-19

### Added

- Custom application icon (warm amber globe) for all platforms: .icns (macOS),
  .ico (Windows), .png (Linux), .svg.
- shadcn/ui component integration — 22 primitives including Sheet, ToggleGroup,
  AlertDialog, Dialog, Select, Table, RadioGroup, Toast, Chart container, and
  Badge.
- Table view and compact list view for the module browser.
- Sticky search bar with symmetric spacing.
- Theme-aware loading screen.
- Chart sub-components: ProgressLineChart, VelocityBarChart,
  ConfidenceDistribution (replaces monolithic PerformanceCharts).
- DashboardSections extracted as a dedicated component.
- 602+ tests across UI components, charts, and utility modules (all coverage
  thresholds passing).
- Tests for dateHelpers, helpers, and restored method wrappers.

### Changed

- Migrated all CSS files to Tailwind utilities — core.css (−59%),
  modules.css (−77%), dashboard.css (−95%), charts.css (−89%), Settings.css
  (−79%).
- Replaced inline `getProgressColor` calls with shared `ColorHelpers` import.
- Extracted `GoalMetricCard` component; deduplicated progress color logic.
- Deduplicated theme definitions; extracted shared helpers.
- Removed duplicated legacy lab migration from `progressTracker`.
- Removed subtle lift hover effects; fixed hardcoded shadow colors.
- Prettier formatting pass on all new and modified files.
- Fixed unused variable warnings (prefixed with underscore).

### Fixed

- CI pipeline stability: formatting and unused-variable fixes for all platforms.
- ModuleDetail alignment in certain themes.
- Dialog positioning and animation consistency across themes.

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
