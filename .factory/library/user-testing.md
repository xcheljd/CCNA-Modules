# User Testing

Testing surface, required skills/tools, and resource cost classification.

**What belongs here:** Testing surface findings, required testing tools, resource cost classification.
**What does NOT belong here:** Implementation details or architecture.

---

## Validation Surface

This mission has no browser/CLI/API surface to validate. All work is:
1. **Unit tests** (utility modules) — validated via `npm test`
2. **Component tests** (React components) — validated via `npm test`
3. **CI workflow changes** — validated via `npm run lint`, `npm run format:check`, and YAML structure review

**No agent-browser or tuistory needed.** All validation is automated test execution.

## Validation Concurrency

- **Surface**: jest test runner
- **Resource per validator**: ~200MB (jest + jsdom)
- **Machine resources**: 16 CPU cores, 10GB available RAM
- **Max concurrent validators**: 5 (well within budget — jest itself is the validator, not a browser)
- **Note**: In practice, validation runs as a single `npm test` invocation, so concurrency is managed by jest's built-in worker pool

## Testing Approach

For each utility/component:
1. Worker writes test file following existing conventions
2. Worker runs `npm test -- <test-file-pattern>` to verify tests pass
3. Worker runs `npm run lint` to verify no lint issues
4. Validator runs full `npm test` to confirm everything passes together
