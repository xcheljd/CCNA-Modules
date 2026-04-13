---
name: security-worker
description: Hardens Electron main process security (IPC validation, CORS, CSP, dependency cleanup).
---

# Security Worker

NOTE: Startup and cleanup are handled by `worker-base`. This skill defines the WORK PROCEDURE.

## When to Use This Skill

Use for features that modify `main.js`, `public/index.html`, `webpack.config.js`, or `package.json` for security hardening or dependency cleanup.

## Required Skills

None.

## Work Procedure

### Step 1: Read the target files

Read the files you'll be modifying:
- `main.js` — all IPC handlers and window setup
- `preload.js` — understand what APIs the renderer can call
- `public/index.html` — current CSP
- `webpack.config.js` — current build config
- `package.json` — current dependencies

### Step 2: Implement the security fix

Make the specific changes described in the feature. Follow these rules:

**IPC Input Validation Pattern:**
```javascript
ipcMain.handle('handler-name', async (event, param) => {
  // Validate input FIRST
  try {
    const parsed = new URL(param); // throws on invalid
    if (!['https:', 'http:'].includes(parsed.protocol)) {
      return { success: false, error: 'Protocol not allowed' };
    }
  } catch {
    return { success: false, error: 'Invalid URL' };
  }
  // ... existing handler logic
});
```

**Path Traversal Prevention Pattern:**
```javascript
const resourcesPath = path.resolve(getResourcesPath());
const filePath = path.resolve(path.join(resourcesPath, filename));
if (!filePath.startsWith(resourcesPath + path.sep) && filePath !== resourcesPath) {
  return { success: false, error: 'Invalid file path' };
}
```

**Hostname Checking Pattern:**
```javascript
function isAllowedHostname(urlString, allowedDomains) {
  try {
    const { hostname } = new URL(urlString);
    return allowedDomains.some(domain =>
      hostname === domain || hostname.endsWith('.' + domain)
    );
  } catch {
    return false;
  }
}
```

**Dynamic User-Agent Pattern:**
```javascript
const originalUA = youtubeSession.getUserAgent();
const cleanUA = originalUA.replace(/Electron\/\S+/g, '').replace(/\s+/g, ' ').trim();
youtubeSession.setUserAgent(cleanUA);
```

### Step 3: Run the full test suite

```bash
npm test
```

All 426+ tests must pass. If any fail, fix the issue before proceeding.

### Step 4: Run lint and format checks

```bash
npm run lint
npm run format:check
```

Fix any issues.

### Step 5: Build verification (if modifying build config or HTML)

```bash
npm run build
```

Verify the build succeeds and inspect `dist/index.html` if CSP was changed.

### Step 6: Grep verification

Run the specific grep patterns from the feature's verificationSteps to confirm:
- Removed code is actually gone
- New patterns are present
- No unintended side effects

## Example Handoff

```json
{
  "salientSummary": "Added input validation to 4 IPC handlers in main.js: open-external-url (protocol whitelist), open-resource (path traversal prevention), open-video-window (videoId regex), close-video-window (type check). All 426 tests pass.",
  "whatWasImplemented": "Modified main.js to validate all renderer-provided inputs before processing. open-external-url now rejects non-HTTP protocols. open-resource resolves paths and verifies they stay within the resources directory. open-video-window validates videoId format. close-video-window checks windowId type. All rejections return structured error objects.",
  "whatWasLeftUndone": "",
  "verification": {
    "commandsRun": [
      { "command": "npm test", "exitCode": 0, "observation": "426 tests passed, 19 suites" },
      { "command": "npm run lint", "exitCode": 0, "observation": "0 errors" },
      { "command": "grep -c 'new URL' main.js", "exitCode": 0, "observation": "Found URL parsing for validation" },
      { "command": "grep -c 'path.resolve' main.js", "exitCode": 0, "observation": "Found path resolution for traversal prevention" }
    ],
    "interactiveChecks": []
  },
  "tests": { "added": [] },
  "discoveredIssues": []
}
```

## When to Return to Orchestrator

- Validation regex is too strict and breaks legitimate use cases
- Removing OutOfBlinkCors breaks YouTube functionality in testing
- CSP changes break dev server (HMR) — need different approach
- Dependency removal causes build failures that can't be resolved
