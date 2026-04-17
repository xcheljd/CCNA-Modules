# Roadmap

Near-term feature ideas. Items currently in the app (search, streaks, analytics, recommendations, themes, confidence ratings, goals, milestones, export/import) are **not** listed here — see the README "Features" section.

## Priority 1 — Quick wins

### Keyboard Shortcuts

Add a global keyboard layer with a `?` help overlay:

- `Space` — play/pause the focused video card
- `←` / `→` — navigate between modules
- `S` or `/` — focus the search input
- `N` — jump to next unwatched video
- `C` — continue last watched
- `Esc` — close menus/modals
- `D` — toggle dark mode

Low effort, high impact. Event listener on `document` with `preventDefault` on captured keys; respect focused `<input>` / `<textarea>` context.

### Notes & Annotations

Per-module markdown notes persisted in localStorage. Future extension: video-timestamp bookmarks (`"5:23 — important"`) linked to the video card. Use a small markdown editor; avoid bringing in Quill/Draft.js unless rich text is needed.

## Priority 2 — Medium effort

### Study Timer

Pomodoro-style session timer that records per-module study time. Integrates with the existing activity/streak tracker — enables more accurate "time invested" analytics. Detect window idle to auto-pause.

### Quiz Mode

Practice quizzes generated from module content; flashcard review with spaced repetition (SM-2). Wrong-answer tracking feeds back into `getModulesNeedingReview`. Requires quiz content authoring or reuse of the existing Anki decks.

## Blocked

### Video playback controls (speed, resume, PiP, quality)

Cannot ship with the current approach — videos open in a dedicated Electron window loading `youtube.com/watch?v=…` without API access. Resume, playback speed, chapter scrubbing, and PiP all require the YouTube IFrame Player API + authenticated session. Would be a major rework (IFrame embed + OAuth flow).

## Ideas parked

Lower priority, revisit if demand surfaces:

- **Cloud backup & sync** — requires OAuth + a backend. Local JSON export/import already ships.
- **Bookmarks / favorites** — lightweight but overlaps with confidence ratings + "needs review" filter.
- **Accessibility pass** — ARIA labels, focus indicators, reduced-motion, colorblind-safe theme variants (WCAG 2.1 AA).
- **Gamification** — XP/levels/daily challenges. Can be motivating but also stressful; keep optional if built.
- **Study planner / calendar sync** — deadline-driven plan generation, iCal export.
- **Collaboration** — study groups, shared notes. Requires a backend.
