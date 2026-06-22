# AGENTS.md

Guidance for AI agents and human contributors working on this codebase.

## Project overview

CCNA Modules is an Electron desktop app for organizing Jeremy's IT Lab CCNA
200-301 course content. Users browse 63 course modules, watch YouTube videos
in distraction-free windows, open Packet Tracer labs and Anki flashcards,
and track their progress offline via localStorage.

- **Runtime**: Electron 41 (main process) + React 19 (renderer)
- **Styling**: Tailwind CSS 4.2 via PostCSS, shadcn/ui components (22 primitives)
- **Charts**: Recharts
- **Bundler**: Webpack 5 with code splitting
- **Tests**: Jest 30 + Testing Library (jsdom environment)
- **Linting**: ESLint 9 flat config + Prettier
- **CI**: GitHub Actions (`/.github/workflows/build.yml`) — lint, format check,
  test with coverage, build for macOS/Windows/Linux on every push/PR

## Commands

| Purpose              | Command                  |
|----------------------|--------------------------|
| Install dependencies | `npm install`            |
| Dev server (React)   | `npm run dev`            |
| Launch Electron app  | `npm start`              |
| Production build     | `npm run build`          |
| Lint                 | `npm run lint`           |
| Format check         | `npm run format:check`   |
| Run tests            | `npm test`               |
| Run specific tests   | `npm test -- <pattern>`  |
| Test with coverage   | `npm run test:coverage`  |
| Build for current OS | `npm run dist`           |

**Node.js 22+ required.** The `npm start` script runs `npm run build` first,
so it rebuilds the renderer before launching Electron.

## Architecture

### Process model

```
main.js          Electron main process (Node.js)
  ├── preload.js   Context bridge exposing electronAPI to renderer
  └── dist/        Webpack-built React renderer
```

- `main.js` contains all IPC handlers, window lifecycle, and file system
  access. It is Node.js, not transpiled, uses `require()` and CommonJS.
- `preload.js` uses `contextBridge.exposeInMainWorld` to expose a safe
  `electronAPI` object. The renderer accesses native capabilities exclusively
  through this bridge.
- The renderer (`src/`) is React 19 with ES module syntax, transpiled by
  Babel + Webpack. It has no direct access to Node.js APIs.

### Renderer structure

```
src/
├── App.js                 Root component, view routing, theme application
├── index.js               React entry point (createRoot)
├── data/modules.js        63 module definitions (videos, labs, flashcards)
├── components/
│   ├── ui/                shadcn/ui primitives (button, dialog, table, etc.)
│   ├── charts/            Recharts wrappers (ProgressLineChart, etc.)
│   ├── dashboard/         Dashboard section layouts
│   ├── settings/          Settings tab components
│   ├── Dashboard.js       Main dashboard view
│   ├── ModuleList.js      Module browser (grid/list/table views)
│   ├── ModuleDetail.js    Single module view with videos and resources
│   └── ...
├── utils/                 Business logic (singleton objects, not classes)
│   ├── progressTracker.js   Video/lab/flashcard/confidence progress
│   ├── streakTracker.js     Study streak with daily activity history
│   ├── performanceTracker.js  Daily snapshots, weekly velocity, predictions
│   ├── goalTracker.js       Learning goals with baseline-delta tracking
│   ├── activityTracker.js   Coordinator that calls all trackers on actions
│   ├── settingsManager.js   App settings (dashboard config, resources path)
│   ├── migrations.js        localStorage schema migrations (idempotent)
│   ├── colorHelpers.js      Progress/confidence color mapping
│   ├── dateHelpers.js       Timezone-safe date utilities
│   ├── themes.js            14 theme definitions (color palettes)
│   ├── dashboardConfig.js   Dashboard section ordering config
│   ├── constants.js         URLs and app-wide constants
│   └── helpers.js           asArray(), openExternal()
├── lib/utils.js           cn() helper for Tailwind class merging
└── styles/                CSS files (migrating to Tailwind utilities)
```

### Data persistence

All user data lives in `localStorage` (renderer process). No backend, no
database, no cloud sync. Keys follow a prefix convention:

| Prefix              | Tracker              |
|---------------------|----------------------|
| `video_`            | ProgressTracker      |
| `lab_`              | ProgressTracker      |
| `flashcards_`       | ProgressTracker      |
| `confidence_`       | ProgressTracker      |
| `last_watched`      | ProgressTracker      |
| `study-streak`      | StreakTracker        |
| `learning-goals`    | GoalTracker          |
| `performance-history` | PerformanceTracker |
| `schema-version`    | Migrations (metadata, not progress) |
| `app-settings`      | SettingsManager      |
| `app-theme`         | App.js (theme name)  |

The `PROGRESS_KEY_PREFIXES` array in `progressTracker.js` is the source of
truth for which keys are "progress data" (exported, imported, cleared by the
danger zone). When adding a new tracker that persists data, add its key
prefix to this array in the same PR.

### Migrations

`src/utils/migrations.js` contains an array of migration functions. The
schema version is auto-derived from the array length. Migrations run once on
app startup (before the UI renders) via `Migrations.runMigrations()` in
`App.js`. Each migration must be idempotent (safe to re-run) and must not
throw (wrap risky operations in try/catch).

### IPC contract

`main.js` IPC handlers all return `{ success: boolean, error?: string }`.
Renderer calls go through `window.electronAPI.*` methods exposed in
`preload.js`. All handlers that accept renderer-provided input validate it:

- `open-resource`: validates filename is a string, checks path traversal via
  `path.resolve` containment
- `open-video-window`: validates videoId matches `^[a-zA-Z0-9_-]{11}$`
- `open-external-url`: validates protocol is `http:` or `https:`
- `export-progress-backup`: rejects payloads exceeding 5MB
- `close-video-window`: validates windowId is a number

### YouTube integration

Video playback opens in a separate `BrowserWindow` pointing at the full
`youtube.com/watch?v=...` URL (not the embed). A persistent session partition
(`persist:youtube-session`) enables optional sign-in for Premium/resume.
CSS and JS are injected after page load to hide YouTube's navigation, sidebar,
and comments, and to activate theater mode.

The sign-in flow detects the `SAPISID` cookie on `.youtube.com` as the
authenticated-session signal. The app never sees passwords, OAuth tokens, or
credentials — authentication happens directly between the user and Google in
the partitioned window.

## Conventions

### Code style

- **JavaScript only** (`.js`/`.jsx`), no TypeScript.
- **ES modules** in `src/` (`import`/`export`). **CommonJS** in `main.js`
  and `preload.js` (`require`/`module.exports`).
- **Import alias**: `@/` maps to `src/` (configured in `webpack.config.js`
  and `jest.config.json`). Use `@/components/ui/button` not
  `../../components/ui/button` when crossing more than one directory level.
  Within the same directory or one level up, use relative paths.
- **Prettier formatting** is enforced. Run `npm run format` to fix, or
  `npm run format:check` to verify.
- **ESLint rules**: `no-unused-vars` with `argsIgnorePattern: '^_'` — prefix
  unused params with underscore. `react-hooks/exhaustive-deps` is `warn`.

### Tracker pattern

Trackers are plain object literals exported as `export const TrackerName =
{ ... }`, not classes. Methods reference siblings via `this.`:

```javascript
export const ProgressTracker = {
  isVideoComplete(moduleId, videoId) { ... },
  getModuleProgress(module) {
    // calls sibling via this.
    if (this.isVideoComplete(module.id, video.id)) { ... }
  },
};
export default ProgressTracker;
```

When adding a new tracker, follow this pattern. If it persists to
localStorage, add its key prefix to `PROGRESS_KEY_PREFIXES`.

### Component pattern

Functional components with hooks. No class components, no HOCs. State
management is local (`useState`/`useReducer`) with no global store.

Lazy loading via `React.lazy` + `Suspense` for the four main views
(Dashboard, ModuleList, ModuleDetail, Settings).

### Error handling

- IPC handlers wrap logic in try/catch and return `{ success: false, error:
  error.message }` on failure.
- Renderer uses `useToast()` from `@/components/ui/toast` for user-facing
  errors (call `error()` for failures, `info()` for notices).
- localStorage reads in trackers catch JSON parse errors and reset corrupted
  keys to defaults with a console.error.

### Testing

- Tests live in `__tests__/` directories next to the code they test.
- File naming: `*.test.js` or `*.test.jsx`.
- jsdom environment (no real DOM). localStorage is available and cleared via
  `beforeEach(() => localStorage.clear())`.
- Component tests use `@testing-library/react` and `userEvent`.
- Tests do NOT mock `ProgressTracker` or other trackers — they test the real
  implementations against jsdom's localStorage.
- Coverage thresholds: branches 64%, functions/lines/statements 65%.

### shadcn/ui components

Located in `src/components/ui/`. Configured via `components.json`. When
adding a new shadcn component, use `tsx: false` (this project uses `.jsx`,
not `.tsx`). The `cn()` helper from `@/lib/utils` merges Tailwind classes
via `clsx` + `tailwind-merge`.

### Themes

14 themes defined in `src/utils/themes.js`. Each theme is an object with
HSL color values (space-separated, e.g. `'212 93% 45%'`) applied as CSS
custom properties on `:root`. The loading screen in `public/index.html`
also has an inline copy of theme definitions for first-paint coloring — if
you add or modify a theme, update both files.

## Security model

- **contextIsolation: true**, **nodeIntegration: false**, **webSecurity: on**
  on all BrowserWindows.
- CSP set via meta tag in `public/index.html`: `default-src 'self';
  script-src 'self'; img-src 'self' https://img.youtube.com data:`.
- The app is not code-signed. macOS users need right-click → Open on first
  launch. Windows users may see SmartScreen warnings.
- No remote code execution. No `eval()`. DevTools `'unsafe-eval'` is only
  allowed in development (gated by `isProduction` in the CSP template).

## Common gotchas

1. **`npm start` rebuilds first.** The `start` script runs `npm run build`
   before launching Electron. For faster dev iteration, run `npm run dev`
   (webpack dev server on port 9000) in one terminal and `electron .` in
   another.

2. **main.js is CommonJS, src/ is ESM.** Don't use `import` in `main.js` or
   `preload.js`. Don't use `require` in `src/`.

3. **Theme definitions are duplicated.** `src/utils/themes.js` and the inline
   script in `public/index.html` both contain all 14 theme palettes. Update
   both when changing colors.

4. **`PROGRESS_KEY_PREFIXES` is load-bearing.** It controls which
   localStorage keys are exported, imported, and cleared. Adding a tracker
   without adding its prefix here causes silent data loss.

5. **ProgressTracker has a write-through cache.** Reads go through
   `cachedRead()` and writes through `cachedWrite()`/`cachedRemove()`. Bulk
   operations (`importProgress`, `clearAllProgress`) call
   `invalidateCache()`. Any new write path must also invalidate or route
   through the cached helpers.

6. **`shell.openPath` returns a string, not a Promise that rejects.** Empty
   string = success, non-empty = error message. Always check the return
   value.

7. **Tests clear localStorage but not the ProgressTracker cache.** The
   `__invalidateReadCache()` export exists for test isolation — it's called
   in `beforeEach` alongside `localStorage.clear()`.

## CI/CD

`.github/workflows/build.yml` runs on every push to `main` and every PR:
1. `npm ci` (clean install)
2. `npm run lint`
3. `npm run format:check`
4. `npm run test:coverage` (must meet thresholds)
5. `npm run build` (webpack production build)
6. `electron-builder` for the current platform

Tag pushes (`v*`) trigger a release job that downloads all platform artifacts
and creates a GitHub Release with notes extracted from `CHANGELOG.md`.

## Agent tooling notes

### AskUser tool (Factory Droid)

The `AskUser` tool does **not** accept JSON. It accepts plaintext lines only,
in this exact format:

```
[topic] <short group label>
[question] <the question text>
[option] <choice 1>
[option] <choice 2>
[option] <choice 3>
```

Rules:

- Every `[question]` must have 2–10 `[option]` lines.
- Each line must start with `[topic]`, `[question]`, or `[option]` and nothing
  else.
- No markdown headers, no code fences, no JSON, no blank-line decorations, no
  extra prose.
- Multiple `[question]` blocks are allowed; group them with `[topic]`.

If any tool call errors, READ the error message — it describes the correct
format. Adapt the input to match it instead of resubmitting the same shape; do
not retry the identical structure more than once. If `AskUser` keeps failing,
stop using it and ask the user directly in plain chat.

## Implementation plans

The `plans/` directory contains self-contained implementation plans generated
by the `improve` skill. Each plan specifies exact files, steps, verification
commands, and done criteria. See `plans/README.md` for the status index.
