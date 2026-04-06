# AGENTS.md - Codebase Guidelines for AI Agents

## Project Overview

CCNA Modules Desktop Application - An Electron-based desktop app for tracking progress through Jeremy's IT Lab CCNA 200-301 course.

**Tech Stack:** Electron 39, React 19, Tailwind CSS 4.1, Webpack 5, shadcn/ui components
**File Extensions:** `.js` (main process), `.jsx` (React components), `.js` (utilities/data)

---

## Build & Quality Commands

### Development

```bash
npm run dev      # Start webpack dev server (port 9000)
npm start        # Launch Electron app
npm run build    # Build React app to dist/ folder
```

### Linting & Formatting

```bash
npm run lint          # Run ESLint
npm run lint:fix      # Auto-fix ESLint errors
npm run format        # Format code with Prettier
npm run format:check  # Check formatting without changes
```

### Distribution

```bash
npm run dist        # Build for current platform
npm run dist:mac    # macOS DMG + ZIP
npm run dist:win    # Windows NSIS + Portable
npm run dist:linux  # Linux AppImage + deb
```

### Testing

⚠️ **No test suite configured** - Test script returns error. Before adding tests, first set up a testing framework (Jest/Vitest/Playwright).

---

## Code Style Guidelines

### Prettier Configuration (`.prettierrc`)

- **Semi-colons:** Enabled
- **Trailing commas:** ES5
- **Quotes:** Single quotes
- **Print width:** 100 characters
- **Indent:** 2 spaces (no tabs)
- **Arrow parens:** Avoid when possible
- **End of line:** LF (Unix-style)

### ESLint Rules (`.eslint.config.js`)

**React-specific:**

- `react/prop-types`: OFF (no PropTypes used)
- `react/react-in-jsx-scope`: OFF (React 17+ auto-import)
- `react-hooks/rules-of-hooks`: ERROR
- `react-hooks/exhaustive-deps`: WARN

**General:**

- `no-unused-vars`: WARN (args prefixed with `_` are ignored)
- `no-console`: OFF (allowed in Electron apps)
- `prefer-const`: WARN
- `no-var`: ERROR

### Import Style

```javascript
// NPM imports - single quotes, multi-line
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, List } from 'lucide-react';

// Local imports - use absolute path alias @/
import ModuleList from '@/components/ModuleList';
import ProgressTracker from '@/utils/progressTracker';

// Use the `cn()` utility for merging Tailwind classes
import { cn } from '@/lib/utils';
```

**Path aliases:** `@/` maps to `./src/` (configured in jsconfig.json and webpack.config.js)

### Naming Conventions

- **Components:** PascalCase (`ModuleList`, `VideoCard`)
- **Functions/Variables:** camelCase (`handleModuleSelect`, `selectedModule`)
- **Constants:** UPPER_SNAKE_CASE or camelCase depending on scope
- **File names:** PascalCase for components, camelCase for utilities
- **CSS classes:** kebab-case for custom CSS

### Component Structure

```javascript
import React, { useState, useEffect } from 'react';
import { IconName } from 'lucide-react';
import { cn } from '@/lib/utils';

function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Effects
  }, []);

  const handleAction = () => {
    // Event handlers
  };

  return <div className={cn('base-classes', conditionalClass)}>{/* JSX */}</div>;
}

export default ComponentName;
```

### State Management

- **Component state:** `useState`, `useReducer` for local state
- **Progress tracking:** localStorage via `ProgressTracker` utility
- **App settings:** localStorage via `SettingsManager` utility
- **Electron IPC:** Main process uses `ipcMain.handle()`, renderer uses `window.electronAPI`

### Error Handling

```javascript
// Electron main process - return success/error objects
ipcMain.handle('operation', async () => {
  try {
    // Do work
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Renderer process - check before using
const result = await electronAPI.operation();
if (result.success) {
  // Use result.data
} else {
  alert(`Failed: ${result.error}`);
}
```

### Utility Modules Pattern

```javascript
// Export grouped functions as object
export const UtilityName = {
  functionOne(arg) {
    /* ... */
  },
  functionTwo(arg) {
    /* ... */
  },
  helperFunction(arg) {
    /* ... */
  },
};

export default UtilityName;
```

### CSS & Theming

- **Framework:** Tailwind CSS v4.1 with PostCSS
- **Theming:** CSS variables (HSL format) defined in `tailwind.config.js`
- **Dark mode:** Class-based (`darkMode: 'class'`)
- **Custom CSS:** Use `src/styles/` for global CSS
- **Component variants:** Use `class-variance-authority` (cva) for shadcn/ui components

### shadcn/ui Components

- Located in `src/components/ui/`
- Use `.jsx` extension
- Leverage `@radix-ui` primitives
- Use `cn()` for className merging
- Follow Radix UI patterns for accessibility

---

## File Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components (.jsx)
│   ├── settings/        # Settings tab components
│   ├── dashboard/       # Dashboard sections
│   └── *.js             # Other React components
├── data/
│   └── modules.js       # Course modules data
├── lib/
│   └── utils.js         # cn() utility for Tailwind
├── utils/
│   ├── progressTracker.js
│   ├── activityTracker.js
│   ├── settingsManager.js
│   ├── themes.js
│   └── ...
├── styles/              # Global CSS files
├── App.js               # Main React app
└── index.js             # React entry point

main.js                  # Electron main process
preload.js               # Electron preload script
```

---

## Key Patterns to Follow

### localStorage Keys

Use `ProgressTracker` utility - don't access localStorage directly. Key prefixes:

- `video_` - Video completion/watched status
- `lab_` - Lab completion status
- `flashcards_` - Flashcard added status
- `confidence_` - Module confidence rating (1-5)
- `last_watched` - Last watched video metadata
- `app-theme` - Selected theme preference

### Electron IPC Communication

- Main process: Use `ipcMain.handle()` for async operations
- Renderer: Access via `window.electronAPI` (defined in preload.js)
- Always check `{success, error}` object in responses

### Progress Calculation

Use `ProgressTracker.getModuleProgress(module)` and `ProgressTracker.getOverallProgress(modules)` - don't recalculate manually.

### Video Handling

- Videos open in separate Electron window via `open-video-window` IPC call
- YouTube videos: Use video ID from modules data
- Video persistence: Uses `persist:youtube-session` for login state

---

## Module Data Structure

```javascript
{
  id: 1,                    // Unique number
  day: 1,                   // Course day number
  title: 'Network Devices',
  videos: [
    { id: 'H8W9oMNSuwo', title: 'Network Devices', duration: '30:25' }
  ],
  resources: {
    lab: 'Day 01 Lab - Packet Tracer Introduction.pkt',
    flashcards: 'Day 01 Flashcards - Network Devices.apkg'
  }
}
```

---

## Special Considerations

1. **No TypeScript** - Project uses `.js` and `.jsx` only. jsconfig.json provides path resolution for editors.

2. **Video IDs** - Some videos may be marked as 'PLACEHOLDER' and need updating with actual YouTube IDs.

3. **Resources Path** - Custom resources path can be set by users. Use Electron IPC to check/get paths, never hardcode.

4. **Theme Support** - 15+ themes available. Use `themes.js` utility and CSS variables. Fallback to 'light' if theme not found.

5. **No Type Checking** - No TypeScript or Flow. Use careful runtime checks, especially for localStorage and IPC responses.

6. **YouTube Restrictions** - Embedded videos are blocked. Videos open in separate window with Chrome UA and custom CSS to hide distractions.

---

## Before Making Changes

1. Run `npm run lint:fix` and `npm run format` after edits
2. Test both dev mode (`npm run dev && npm start`) and production build (`npm run build`)
3. Verify Electron IPC handlers work correctly in both environments
4. Check theme switching still works if modifying UI components
5. Ensure localStorage key patterns match `ProgressTracker` prefixes if adding new progress tracking
