# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

### Install & General Workflow
- Install dependencies: `npm install`
- Build renderer bundle (React + Tailwind): `npm run build`
- Launch Electron app (uses `dist/index.html`): `npm start`

**Typical dev loop:**
1. `npm run dev` – start webpack dev server for the renderer.
2. In another terminal, `npm start` – launch Electron pointing at `dist/index.html`.

### Development & Formatting
- Dev server (renderer only): `npm run dev`
- Production build (renderer bundle only): `npm run build`
- Lint JS (renderer + main process): `npm run lint`
- Auto-fix lint issues: `npm run lint:fix`
- Format with Prettier: `npm run format`
- Check formatting only: `npm run format:check`

### Packaging / Distribution
All packaging is via `electron-builder` using the `build` config in `package.json`.

- Build app for current platform: `npm run dist`
- Build macOS artifacts (DMG + ZIP): `npm run dist:mac`
- Build Windows artifacts (NSIS + portable): `npm run dist:win`
- Build Linux artifacts (AppImage + deb): `npm run dist:linux`

### Tests
- `npm test` is currently a placeholder and will exit with an error; there is no configured test runner. If you add tests, update the `test` script in `package.json` and document how to run a single test there.

## High-Level Architecture

### Overall Structure
This is an Electron desktop app that wraps a React/Tailwind renderer for exploring and tracking progress through Jeremy’s IT Lab CCNA 200-301 course.

Key layers:
- **Electron main process** (`main.js`): window creation, resource path management, OS integrations, video window control.
- **Preload bridge** (`preload.js`): safe IPC API exposed to the renderer via `window.electronAPI`.
- **Renderer / UI** (`src/**` bundled via `webpack.config.js`): React components, dashboard features, progress logic, and module data.
- **Static course data & resources**:
  - Course metadata in `src/data/modules.js` (all 63+ modules, videos, and resource filenames).
  - Lab/flashcard artifacts under `resources/` (bundled via `electron-builder.extraResources`).

### Electron Main Process
Located in `main.js`:
- Creates the primary `BrowserWindow` with `preload.js`, `contextIsolation: true`, and `webSecurity: true`.
- Loads `dist/index.html` (webpack output). In dev (`!app.isPackaged`), it still loads from `dist` and opens devtools.
- Manages a per-user `config.json` in `app.getPath('userData')` for a **custom resources path** (`customResourcesPath`).
- Defines IPC handlers (used via the preload bridge) for:
  - `check-resources-folder`, `get-resources-files`, `get-resources-info`
  - `select-resources-folder`, `reset-resources-path`
  - `open-resource` (opens `.pkt`, `.apkg`, etc. via OS default app)
  - `open-anki` (platform-specific Anki launch)
- Manages **YouTube video windows**:
  - `open-video-window` creates a `BrowserWindow` with a persistent session `persist:youtube-session` to allow login persistence.
  - Overrides user-agent to a Chrome UA to avoid Google blocks.
  - Injects CSS after load to hide search bar, recommendations, comments, and most distractions.
  - Forces theatre mode via DOM interaction.
  - Limits navigation and popups to YouTube/Google and OAuth flows.
  - `close-video-window` and `close-all-video-windows` manage cleanup.

When modifying IPC channels, keep `main.js` and `preload.js` in sync, and use `contextIsolation`-friendly patterns (no direct `ipcRenderer` usage in React code).

### Preload Bridge
`preload.js` uses `contextBridge.exposeInMainWorld` to expose a narrow API:
- Video windows: `openVideoWindow`, `closeVideoWindow`, `closeAllVideoWindows`
- Resources: `checkResourcesFolder`, `getResourcesFiles`, `openResource`, `openAnki`
- Resource path configuration: `getResourcesInfo`, `selectResourcesFolder`, `resetResourcesPath`

In the renderer, all Electron interactions should go through `window.electronAPI` rather than importing `electron` directly.

### Renderer / React App
The renderer is a React 19 app bundled by webpack:
- Entry: `src/index.js` (not listed here but referenced from `webpack.config.js`).
- Main app composition (including routing between modules and the dashboard) lives in `src/App.js` and `src/components/**`.

Important renderer concepts:

1. **Course Modules Data** (`src/data/modules.js`)
   - Single source of truth for all CCNA modules.
   - Each module has `id`, `day`, `title`, an array of `videos`, and `resources` including `lab`, `flashcards`, and occasionally `spreadsheet`.
   - UI components (e.g. `ModuleList`, `ModuleDetail`, `VideoCard`) derive everything from this structure, so keeping IDs and filenames aligned with `resources/` is critical.

2. **Progress & Analytics**
   - `src/utils/progressTracker.js` is the core **client-side persistence layer** using `localStorage`.
   - Responsibilities:
     - Track per-video timestamps, completion flags, and watch percentage.
     - Track lab completion and flashcard import status per module.
     - Compute per-module completion percentages and overall course progress.
     - Track and query **confidence ratings** per module (1–5 scale), including helpers for “modules needing review”.
     - Compute high-level statistics used by dashboard sections (completed modules, labs, flashcards, average confidence, last watched module).
     - Provide bulk operations (export/import progress, clear all progress).
   - `src/hooks/useModuleProgress.js` wraps this into a React hook for module-level views:
     - Returns `labCompleted`, `flashcardsAdded`, a map of `videoCompletions`, and `confidence` plus corresponding setters.

3. **Dashboard System**
   - The dashboard is configurable and driven by `src/utils/dashboardConfig.js` and `src/components/Dashboard.js`.
   - `dashboardConfig.js` defines `DASHBOARD_SECTIONS`:
     - Section metadata (`id`, `title`, `description`, `component`, defaults, and flags like `removable` and `conditional`).
     - Helpers: `getDefaultDashboardConfig`, `getSectionMetadata`, `validateDashboardConfig`.
   - `Dashboard.js`:
     - Loads and persists dashboard layout via `SettingsManager.getDashboardConfig()` / `saveDashboardConfig()` (implementation in `src/utils/settingsManager.js`).
     - Uses `ProgressTracker` to compute `overallProgress`, `lastWatched` module, `recentlyCompleted`, modules needing review, and summary statistics.
     - Uses a **section component map** to render specific section components from `./dashboard/DashboardSections`:
       - Examples: `OverallProgressSection`, `ContinueWatchingSection`, `ModulesNeedingReviewSection`, `RecentlyCompletedSection`, `StudyStreakSection`, `LearningGoalsSection`, `SmartRecommendationsSection`, `UpcomingMilestonesSection`, `PerformanceChartsSection`.
     - Uses a pairing system (`sectionPairs`) to lay out certain sections side-by-side.

4. **UI Components & Design System**
   - High-level feature components:
     - `src/components/Dashboard.js` – overall dashboard container.
     - `src/components/ModuleList.js`, `ModuleDetail.js`, `VideoCard.js`, `SearchBar.js`, `ConfidenceRating.js`, `LoadingScreen.js`.
     - Goal- and analytics-focused components like `GoalCard`, `GoalModal`, `PerformanceCharts`, `SmartRecommendations`, `StudyStreak`, `UpcomingMilestones`, `Settings`.
   - Charts are separated into `src/components/charts/**` (e.g. `ActivityHeatmap`, `ConfidenceDistribution`, `ProgressLineChart`, `VelocityBarChart`) and use `recharts`.
   - A small reusable UI library lives under `src/components/ui/**` (`button.jsx`, `card.jsx`, `tabs.jsx`, `dialog.jsx`, etc.), built on top of Radix primitives and Tailwind class utilities.

5. **Settings & Themes**
   - `src/utils/settingsManager.js` (not shown above but referenced) coordinates saving user preferences (including dashboard layout and likely other settings) into local storage.
   - `src/utils/themes.js` and `src/components/settings/**` manage theme and settings UI:
     - Tabs such as `DashboardTab`, `ThemeTab`, `ResourcesPathTab`, `DataManagementTab` live under `src/components/settings/`.
     - These settings often bridge the renderer to the Electron world (e.g., selecting a custom resources folder via `window.electronAPI.selectResourcesFolder()`).

### Webpack & Tailwind
- `webpack.config.js`:
  - Entry: `./src/index.js`, output: `dist/bundle.js` plus `dist/index.html` via `HtmlWebpackPlugin`.
  - Target: `electron-renderer`.
  - JS/JSX compiled via `babel-loader` with `@babel/preset-react`.
  - CSS handled via `style-loader`, `css-loader`, `postcss-loader` (Tailwind wired through PostCSS).
  - Uses `@` alias for `src` (`import Foo from '@/components/Foo'`).
- `tailwind.config.js` and PostCSS setup are present; utility classes are used throughout JSX and CSS.

### Resource Handling
- The `resources/` directory contains Packet Tracer labs (`.pkt`, `.pka`), Anki decks (`.apkg`), and related files.
- `electron-builder`’s `extraResources` in `package.json` includes these into the packaged app.
- In dev, `getResourcesPath()` resolves to `<project>/resources`.
- In production, it resolves to `<process.resourcesPath>/resources`, with optional override by the user-configured `customResourcesPath` stored in `config.json`.

When adding new lab/flashcard files:
- Ensure filenames in `resources/` match the `resources` fields in `src/data/modules.js`.
- If new resource types are added (e.g., PDFs, extra spreadsheets), extend `extraResources.filter` in `package.json` and adjust any renderer logic that enumerates resources.

## Existing AI / Documentation Conventions

### Claude Agent Rules
The repo includes `.claude/agents/documentation-planner.md`, which defines a **documentation-planner** agent responsible for:
- Scanning the project structure and existing docs to assess documentation coverage.
- Producing a structured `DOCUMENTATION_PLAN.md` with prioritized items (Getting Started, API/Reference, Architecture, User/Developer guides, configuration docs, etc.), including status and effort.
- Tracking documentation completion and updating metrics over time.

When asked to plan or assess documentation for this project, align with those conventions:
- Prefer creating/updating a `DOCUMENTATION_PLAN.md` in the project root.
- Use checklists, priorities (critical/high/medium/low), and clear audiences per that spec.
- Avoid duplicating existing docs; focus on gaps and high-impact docs.

### README Highlights
Key points from `README.md` that matter for agents:
- The app is an Electron-based CCNA study companion with 63 days of modules, labs, flashcards, and progress tracking.
- Progress is stored locally (via `localStorage`), making the app offline-friendly apart from YouTube streaming.
- Distribution and platform-specific install details live in `DISTRIBUTION_GUIDE.md` and `BUILD_NOTES.md` (referenced in the README; consult them if present when working on packaging or release changes).
- Icons for packaged builds should be placed under `build/` (`icon.icns`, `icon.ico`, `icon.png`), per `build/README.md`.
