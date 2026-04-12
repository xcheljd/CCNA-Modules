---
name: ci-worker
description: Modifies GitHub Actions CI workflow to add quality gate steps.
---

# CI Worker

NOTE: Startup and cleanup are handled by `worker-base`. This skill defines the WORK PROCEDURE.

## When to Use This Skill

Use for features that modify the CI/CD pipeline (GitHub Actions workflows).

## Required Skills

None.

## Work Procedure

### Step 1: Read the current workflow

Read `.github/workflows/build.yml` thoroughly. Understand the existing step structure and matrix strategy.

### Step 2: Add quality gate steps

Add three new steps AFTER the `npm ci` step and BEFORE the `npm run build` step:

```yaml
- name: Lint
  run: npm run lint

- name: Check formatting
  run: npm run format:check

- name: Run tests
  run: npm test
```

**Critical rules:**
- Maintain existing matrix strategy (3 OS targets)
- Do NOT modify build, packaging, or release steps
- Steps run in sequence: lint → format-check → test → build
- No `if:` conditions on gate steps (they must always run)
- No `continue-on-error` on gate steps

### Step 3: Validate the YAML locally

```bash
# Check YAML syntax
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/build.yml'))"
```

### Step 4: Run the quality gates locally

```bash
npm run lint
npm run format:check
npm test
```

All must pass (this validates the gate commands work).

### Step 5: Verify step ordering

Read the modified workflow file and confirm:
1. Lint, format-check, and test steps appear BEFORE build step
2. Steps are within the build job (not release)
3. No conditional (`if:`) that could skip gates

## Example Handoff

```json
{
  "salientSummary": "Added lint, format-check, and test steps to .github/workflows/build.yml between npm ci and npm run build. All three gates verified locally.",
  "whatWasImplemented": "Modified .github/workflows/build.yml to add 3 quality gate steps (Lint, Check formatting, Run tests) in the build job, after npm ci and before npm run build. Matrix strategy unchanged.",
  "whatWasLeftUndone": "",
  "verification": {
    "commandsRun": [
      { "command": "npm run lint", "exitCode": 0, "observation": "No lint errors" },
      { "command": "npm run format:check", "exitCode": 0, "observation": "All files formatted" },
      { "command": "npm test", "exitCode": 0, "observation": "All tests pass" },
      { "command": "python3 -c \"import yaml; yaml.safe_load(open('.github/workflows/build.yml'))\"", "exitCode": 0, "observation": "Valid YAML" }
    ],
    "interactiveChecks": []
  },
  "tests": { "added": [] },
  "discoveredIssues": []
}
```

## When to Return to Orchestrator

- YAML validation fails and can't be resolved
- Existing workflow has structural issues that prevent adding steps
