---
name: code-hygiene-worker
description: Cleans up code hygiene — removes console.logs, extracts shared components, fixes DRY violations, extracts constants.
---

# Code Hygiene Worker

NOTE: Startup and cleanup are handled by `worker-base`. This skill defines the WORK PROCEDURE.

## When to Use This Skill

Use for features that clean up code: removing dead code, extracting shared components, fixing DRY violations, extracting constants, and migrating inline styles to CSS classes.

## Required Skills

None.

## Work Procedure

### Step 1: Read the target files

Read ALL files you'll be modifying before making any changes. Understand the current code structure, imports, and dependencies.

### Step 2: Implement changes

Follow these patterns:

**Shared Icon Components:**
```jsx
// src/components/ui/Icons.jsx
export function GridIcon({ className = '', size = 16 }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
      {/* exact same SVG children as the original inline SVG */}
    </svg>
  );
}
```

**Constants Extraction:**
```js
// src/utils/constants.js
export const RESOURCE_DOWNLOAD_URL = 'https://drive.google.com/...';
export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/...';
// etc.
```

**Helper Extraction:**
```js
// src/utils/helpers.js
export const asArray = val => (Array.isArray(val) ? val : val ? [val] : []);
```

**CSS Migration:**
Move inline styles to existing CSS files. Use descriptive class names. Dynamic values (like progress bar width) are acceptable as inline styles.

### Step 3: Run tests after each logical group of changes

```bash
npm test
```

All 426+ tests must pass.

### Step 4: Run lint and format

```bash
npm run lint
npm run format:check
```

Fix any issues.

### Step 5: Build verification (if CSS or imports changed)

```bash
npm run build
```

### Step 6: Verify no duplicate patterns remain

Use grep to confirm shared patterns are only in the shared module, not duplicated across consuming files.

## Example Handoff

```json
{
  "salientSummary": "Removed 15 console.log calls from App.js, deleted test-tracking.js, created shared Icons.jsx with 5 components, replaced 12 inline SVGs, extracted asArray to helpers.js, extracted 19 URLs to constants.js, moved inline spinner to CSS. All 426 tests pass.",
  "whatWasImplemented": "All 3 features completed: console cleanup + dead file removal, shared icon components, and DRY/constant extraction. Created 3 new files (Icons.jsx, helpers.js, constants.js), modified 7 existing files.",
  "whatWasLeftUndone": "",
  "verification": {
    "commandsRun": [
      { "command": "npm test", "exitCode": 0, "observation": "426 tests passed" },
      { "command": "npm run lint", "exitCode": 0, "observation": "0 errors" },
      { "command": "npm run build", "exitCode": 0, "observation": "webpack compiled successfully" }
    ],
    "interactiveChecks": []
  },
  "tests": { "added": [] },
  "discoveredIssues": []
}
```

## When to Return to Orchestrator

- Icon replacement breaks visual rendering
- Constants extraction creates circular dependencies
- CSS migration causes layout differences
- Breaking change that can't be resolved
