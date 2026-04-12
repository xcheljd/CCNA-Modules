---
name: test-worker
description: Writes comprehensive tests for utility modules and React components following established patterns.
---

# Test Worker

NOTE: Startup and cleanup are handled by `worker-base`. This skill defines the WORK PROCEDURE.

## When to Use This Skill

Use for features that require writing new test files for utility modules or React components. This worker writes tests following the project's established conventions.

## Required Skills

None. All work is done with jest, @testing-library/react, and shell commands.

## Work Procedure

### Step 1: Read the source file and existing test patterns

Read the source file you're testing. Then read these files for conventions:
- `src/__tests__/test-utils.js` — shared mock data
- `jest.setup.js` — global mocks (electronAPI, localStorage)
- At least one existing test in the same category (utility or component) for pattern reference

### Step 2: Write the test file (RED)

Create the test file in the correct `__tests__` directory:
- Utility tests: `src/utils/__tests__/<name>.test.js`
- Component tests: `src/components/__tests__/<ComponentName>.test.jsx`

**Utility test conventions:**
```javascript
import { UtilName } from '../utilFile';

describe('UtilName', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  // tests...
});
```

**Component test conventions:**
```jsx
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider } from '@/components/ui/toast';
import ComponentName from '../ComponentName';

// Wrapper for components needing toast context
function Wrapper({ children }) {
  return <ToastProvider>{children}</ToastProvider>;
}

// Mock child components if needed
jest.mock('../ChildComponent', () => () => <div data-testid="child" />);

// Mock utility modules
jest.mock('../utils/someTracker', () => ({
  SomeTracker: {
    method: jest.fn(),
  },
}));

describe('ComponentName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // tests...
});
```

**Key rules:**
- Every test must have clear arrange/act/assert structure
- Cover happy path, edge cases, and error conditions
- For date-dependent logic, use `jest.useFakeTimers().setSystemTime(new Date('2025-01-15'))`
- For `window.confirm`, use `jest.spyOn(window, 'confirm').mockReturnValue(true/false)`
- Mock `window.electronAPI` locally only when different from global mock in jest.setup.js
- Test each exported function / user interaction independently

### Step 3: Run the tests (GREEN)

```bash
# Run just the new test file
npx jest --no-coverage <test-file-path>

# If failures, fix and re-run
```

All tests must pass. Do not move on until they pass.

### Step 4: Run lint

```bash
npm run lint
```

Fix any lint issues in your test file.

### Step 5: Run full test suite to check for conflicts

```bash
npm test
```

Verify ALL tests pass (existing + new). If there are conflicts with existing tests, fix them.

### Step 6: Manual verification

- Verify the test file follows colocated `__tests__` convention
- Verify test count matches expected coverage for the source file
- Verify no `console.log` in test files (use `jest.spyOn(console, 'error')` for error tests)

## Example Handoff

```json
{
  "salientSummary": "Wrote 15 tests for streakTracker covering getStreakData, recordStudyActivity (first-study, consecutive, same-day, broken-streak), checkStreakStatus, getStreakCalendar, getRecentActivity, isStreakAtRisk, getStreakMilestones, and resetStreakData. All pass with full suite.",
  "whatWasImplemented": "Test file at src/utils/__tests__/streakTracker.test.js with 15 test cases covering all exported methods, edge cases (corrupted data, history cap, intensity cap), and date-dependent streak logic using jest.useFakeTimers.",
  "whatWasLeftUndone": "",
  "verification": {
    "commandsRun": [
      { "command": "npx jest --no-coverage src/utils/__tests__/streakTracker.test.js", "exitCode": 0, "observation": "15 tests passed" },
      { "command": "npm run lint", "exitCode": 0, "observation": "No lint errors" },
      { "command": "npm test", "exitCode": 0, "observation": "All 113 tests passed (98 existing + 15 new)" }
    ],
    "interactiveChecks": []
  },
  "tests": {
    "added": [
      {
        "file": "src/utils/__tests__/streakTracker.test.js",
        "cases": [
          { "name": "returns defaults when empty", "verifies": "VAL-STREAK-001" },
          { "name": "starts streak at 1 for first study", "verifies": "VAL-STREAK-006" },
          { "name": "resets streak when broken", "verifies": "VAL-STREAK-009" }
        ]
      }
    ]
  },
  "discoveredIssues": []
}
```

## When to Return to Orchestrator

- Source file has unresolvable dependencies that can't be mocked
- Jest config needs changes that would affect other tests
- Discovery of bugs in source code that prevent testing (note them in discoveredIssues)
