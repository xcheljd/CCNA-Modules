# CLAUDE.md

Quick reference for Claude Code working in this repository. For full context,
see `AGENTS.md`.

## Essential commands

```bash
npm install              # Install dependencies (Node 22+)
npm test                 # Run all tests (Jest, jsdom)
npm test -- <pattern>    # Run specific tests (e.g. npm test -- progressTracker)
npm run lint             # ESLint
npm run format:check     # Prettier check (run npm run format to fix)
npm run build            # Webpack production build
npm start                # Build + launch Electron app
npm run dev              # Webpack dev server (port 9000) for React development
```

Always run `npm test` and `npm run lint` before considering work done.

## Project type

Electron 41 desktop app. React 19 renderer. JavaScript only (no TypeScript).

- `main.js` — Electron main process (CommonJS, `require`)
- `preload.js` — Context bridge (CommonJS)
- `src/` — React renderer (ES modules, `import`)
- `src/components/ui/` — shadcn/ui components (`.jsx`)

## Key conventions

- **Trackers are plain objects**, not classes. Exported as
  `export const TrackerName = { method() {} }`. Methods call siblings via
  `this.`. See `src/utils/progressTracker.js` for the exemplar.
- **Import alias**: `@/` maps to `src/`. Use it for deep paths:
  `@/components/ui/button`. Relative paths for same-directory imports.
- **IPC return shape**: all handlers return `{ success: boolean, error?: string }`.
- **Error display**: `const { error, info } = useToast()` in components.
- **Unused params**: prefix with `_` (ESLint `argsIgnorePattern: '^_'`).
- **Tests**: `__tests__/` dirs, `*.test.jsx` naming. Tests use the real
  tracker implementations against jsdom localStorage (no mocks of trackers).
  `beforeEach` clears localStorage AND calls `__invalidateReadCache()`.

## Data model

localStorage-based persistence (no backend). Key prefixes:

- `video_`, `lab_`, `flashcards_`, `confidence_`, `last_watched` → ProgressTracker
- `study-streak` → StreakTracker
- `learning-goals` → GoalTracker
- `performance-history` → PerformanceTracker
- `app-settings` → SettingsManager
- `app-theme` → theme name string

`PROGRESS_KEY_PREFIXES` in `src/utils/progressTracker.js` controls which
keys are exported/imported/cleared. Add new tracker prefixes there.

ProgressTracker has a write-through cache (`cachedRead`/`cachedWrite`/
`cachedRemove`). Bulk operations call `invalidateCache()`. Any new write
path must invalidate or route through the cache helpers.

## When adding a new tracker

1. Create `src/utils/newTracker.js` as a plain object export.
2. Add its localStorage key prefix to `PROGRESS_KEY_PREFIXES`.
3. If it reads/writes via the cached helpers, add `invalidateCache()` to any
   bulk write path.
4. Create `src/utils/__tests__/newTracker.test.js` following the existing
   test pattern.

## When adding a new shadcn/ui component

Use `.jsx` (not `.tsx`). The project uses `tsx: false` in `components.json`.
The `cn()` helper is at `@/lib/utils`.

## When modifying themes

Update BOTH `src/utils/themes.js` AND the inline script in
`public/index.html` (lines ~12-77). They contain duplicate copies of all 14
theme palettes.

## When modifying IPC handlers in main.js

- Validate all renderer-provided input (see existing handlers for patterns).
- Check `shell.openPath` return value (string, not rejection).
- Return `{ success: false, error: 'message' }` on failure.

## Before committing

```bash
npm run lint              # Must pass
npm run format:check      # Must pass
npm test                  # Must pass (614+ tests)
```

Commit style: short imperative summary (e.g. `Fix performance-history key
missing from progress export/clear`). No conventional-commits prefix.
