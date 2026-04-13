# Architecture

How the CCNA Modules application works.

## Overview

Electron 39 + React 19 desktop app for tracking CCNA course progress. Webpack 5 bundles the React frontend; Electron wraps it as a desktop app.

## Component Hierarchy

```
App.js (root)
├── ToastProvider (context)
│   └── AppContent
│       ├── LoadingScreen (initial load)
│       ├── WelcomeDialog (first-visit)
│       ├── Header (navigation, progress bar)
│       ├── Dashboard (default view)
│       │   ├── StudyStreak
│       │   ├── GoalCard → GoalModal
│       │   ├── OverallProgressSection
│       │   ├── ModulesNeedingReviewSection
│       │   ├── SmartRecommendations
│       │   ├── UpcomingMilestones
│       │   └── PerformanceCharts
│       │       ├── ProgressLineChart
│       │       ├── ActivityHeatmap
│       │       ├── VelocityBarChart
│       │       └── ConfidenceDistribution
│       ├── ModuleList (browse all modules)
│       │   └── SearchBar
│       ├── ModuleDetail (single module view)
│       │   ├── VideoCard (per video)
│       │   └── ConfidenceRating
│       └── Settings (dialog)
│           ├── ThemeTab
│           ├── DashboardTab
│           ├── DataManagementTab
│           ├── ResourcesPathTab
│           └── AboutTab
```

## Data Flow

- **localStorage** is the sole data store (no backend)
- **ProgressTracker** — video/lab/flashcard completion, confidence ratings, module statistics
- **StreakTracker** — daily study streak, activity calendar, milestones
- **PerformanceTracker** — historical snapshots, weekly velocity, completion prediction
- **GoalTracker** — learning goals with baseline/progress delta tracking
- **ActivityTracker** — coordinator that calls ProgressTracker + StreakTracker + PerformanceTracker on user actions
- **SettingsManager** — app settings, dashboard config, resource path

## Electron IPC

- `preload.js` exposes `window.electronAPI` via contextBridge
- `main.js` handles: resource file opening, video windows, config persistence, data export
- Video windows use a separate session (`persist:youtube-session`) with custom CSS injection

## Electron IPC

- `preload.js` exposes `window.electronAPI` via contextBridge with 12 IPC channels
- `main.js` handles: resource file opening, video windows, config persistence, data export
- Video windows use a separate session (`persist:youtube-session`) with custom CSS injection
- **All IPC handlers validate inputs** — URLs, file paths, video IDs, window IDs
- **Path traversal prevention**: `open-resource` resolves paths and verifies containment within resources directory
- **URL protocol whitelist**: `open-external-url` only allows `https:` and `http:`
- **Hostname-based navigation**: `will-navigate` and `setWindowOpenHandler` use `new URL().hostname` checking

## Security Model

- `contextIsolation: true`, `nodeIntegration: false`, `webSecurity: true` on all windows
- CSP meta tag in index.html — production builds omit `unsafe-eval`
- OutOfBlinkCors is NOT disabled (was removed in security hardening)
- YouTube window user-agent is dynamically constructed from Electron's Chromium (not hardcoded)
- No `eval()`, `new Function()`, or `innerHTML` in source code

## Key Invariants

- All tracking data lives in localStorage with prefixed keys
- `asArray(val)` pattern used to normalize single-value/multi-value resource fields
- Dashboard sections are configurable (order, enabled/disabled) via SettingsManager
- Legacy lab data migration happens lazily in ProgressTracker
