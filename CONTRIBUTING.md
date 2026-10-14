# Contributing to LeakGoblin

Thanks for considering a contribution! This is a community-driven, security-conscious CLI.

## Ground Rules

1. **Never use real secrets.** All tests, examples, and docs must use synthetic canary values like `AKIAIOSFODNN7EXAMPLE`, `ghp_1234567890abcdefghijklmnopqrstuvwxyzABCD`, etc.
2. **No secret leakage in logs.** Ensure scan output, JSON reports, test snapshots, and CI logs never contain full secret values. Use `[REDACTED]` markers.
3. **Local-first.** The tool must work offline after installation. No hidden network calls.
4. **Conservative detection.** Prefer high-confidence, format-specific signatures over aggressive heuristics. Generic high-entropy detection must be labeled low confidence.
5. **Preserve structure.** Redaction should keep variable names and surrounding context.

## Getting Started

```bash
# Clone
git clone https://github.com/your-org/leakgoblin
cd leakgoblin

# Install (requires Node >=20, recommended 24 LTS)
npm install

# Build
npm run build

# Test
npm test

# Smoke test (verifies published package style)
npm run smoke

# Try it
echo "api_key = AKIAIOSFODNN7EXAMPLE" | node ./dist/cli.js scan --stdin
echo "api_key = AKIAIOSFODNN7EXAMPLE" | node ./dist/cli.js sanitize --stdin
```

## Project Structure

```
src/
  cli.ts                 # Entry, commander + fallback parser
  commands/
    scan.ts              # scan logic (stdin, file, dir)
    sanitize.ts          # sanitize logic
  engine/
    rules.ts             # Core detection signatures
    detector.ts          # Detection engine
    redactor.ts          # Redaction preserving structure
    types.ts             # Shared types
  config/
    loader.ts            # Config file discovery
    schema.ts            # Validation
  utils/
    fs.ts                # Directory walk, exclusions
    input.ts             # stdin handling
    masking.ts           # Safe masking, never leak
  reporting/
    formatter.ts         # Terminal output (goblin themed)
    json.ts              # JSON for CI
tests/                   # Vitest suites
```

## Adding a New Detection Rule

1. Edit `src/engine/rules.ts`
2. Add rule to `CORE_RULES` with:
   - Unique `id`
   - `pattern` (global RegExp)
   - `secretGroupIndex` if secret is in capture group
   - `severity` and `confidence` (be conservative)
   - `category`
3. Add test in `tests/detector.test.ts` using synthetic values
4. Ensure masking works in `tests/redactor.test.ts`
5. Run `npm test` and `npm run build`

Example:

```ts
{
  id: 'my_service_token',
  name: 'MyService Token',
  category: 'api_key',
  description: 'MyService tokens start with mysvc_',
  pattern: /\b(mysvc_[A-Za-z0-9]{32,})\b/g,
  secretGroupIndex: 1,
  severity: 'high',
  confidence: 'high',
}
```

## Custom Patterns (User Config)

Users can add their own via `leakgoblin.config.json`:

```json
{
  "customPatterns": [
    {
      "id": "internal_token",
      "pattern": "INTERNAL_[A-Z0-9_]{16,}",
      "severity": "high",
      "confidence": "medium"
    }
  ]
}
```

## Code Style

- TypeScript, ESM, strict mode
- No unnecessary dependencies
- Tasteful goblin humor, but never obscure severe findings
- Clear error messages, exit codes: 0 = clean, 1 = secrets found, 2 = error

## Pull Request Process

1. Fork and create feature branch
2. Add tests for new behavior
3. Ensure `npm run lint`, `npm run build`, `npm test`, `npm run smoke` pass
4. Update README if user-facing change
5. Fill PR template
6. Keep PR focused - one feature/fix per PR

## Reporting Bugs

- Use bug report template
- Include OS, Node version, LeakGoblin version
- Provide redacted reproduction (never real secrets)
- Describe expected vs actual

## Code of Conduct

Be respectful, constructive, and security-minded. The goblin guards secrets, not egos.

## Questions?

Open a discussion or issue. The goblin is listening. 🛡️
