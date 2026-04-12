# Environment

Environment variables, external dependencies, and setup notes.

**What belongs here:** Required env vars, external API keys/services, dependency quirks, platform-specific notes.
**What does NOT belong here:** Service ports/commands (use `.factory/services.yaml`).

---

## Node.js

- Node.js 18+ required (CI uses Node 22)
- npm for package management
- No environment variables needed for testing

## Test Infrastructure

- Jest 30 + jsdom environment
- @testing-library/react 16 for component tests
- @testing-library/jest-dom for DOM matchers
- @testing-library/user-event for realistic interactions
- babel-jest for JSX transform
- identity-obj-proxy for CSS module mocking
- Playwright for e2e (separate, not part of this mission)

## Key Notes

- `jest.setup.js` mocks `window.electronAPI` and `localStorage` globally
- `@/` path alias maps to `src/` via jest moduleNameMapper
- date-fns is pure JS, works without mocking in tests
