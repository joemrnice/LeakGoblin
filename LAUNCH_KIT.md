# Launch Kit - LeakGoblin v0.1.0

## One-liner

Scan locally. Redact sensitive values. Review before sharing. A goblin guard for your AI prompts.

## Problem Statement

Developers routinely copy logs, stack traces, config snippets, and terminal output into ChatGPT, coding agents, and issue trackers. Those snippets often contain API keys, tokens, passwords, private keys, or DB credentials by accident.

LeakGoblin makes this safer without accounts, cloud, or complex config.

## What It Does

- `leakgoblin scan --stdin` - detect secrets, masked output with line numbers, severity, confidence
- `leakgoblin sanitize --stdin` - output redacted version safe to share, preserving structure
- `leakgoblin scan .` - recursively scan repo, respecting .git, node_modules, dist exclusions
- `--format json` - machine-readable for CI
- Config file: `leakgoblin.config.json` for custom patterns, exclusions, thresholds

Local-only, no network requests during scan/sanitize, no upload.

## Demo Script (for GIF)

```bash
# Show clean prompt passes
cat examples/clean_prompt.txt | npx leakgoblin scan --stdin

# Show secret detection (synthetic canary)
cat examples/prompt_with_secrets.txt | npx leakgoblin scan --stdin

# Show sanitization preserves context
cat examples/prompt_with_secrets.txt | npx leakgoblin sanitize --stdin

# Show repo scan
npx leakgoblin scan . --format json | head -n 20
```

Record with terminalizer or asciinema, convert to GIF. Keep under 30 seconds.

## Announcements - Factual, No Hype

### Dev.to / Hashnode

Title: LeakGoblin - A local CLI that guards your secrets before you paste into AI tools

Body:
> I built LeakGoblin, a small open-source CLI that scans text before you paste into ChatGPT, coding agents, or issue trackers.
>
> - Works offline after install
> - `scan --stdin` shows masked findings with severity/confidence
> - `sanitize --stdin` gives you redacted version preserving structure
> - `scan .` for repo with exclusions
> - JSON output for CI
>
> It's best-effort, not a guarantee. It uses format-specific signatures (AWS, GitHub, Stripe, private keys, JWT, connection strings, .env vars) plus conservative heuristics labeled low confidence.
>
> Stack: Node.js + TypeScript (ESM), commander ^14, chalk ^5, vitest. Node >=20, recommended 24 LTS (current Active LTS as of 2026).
>
> No telemetry, no upload. MIT licensed.
>
> Try: `npx leakgoblin scan .`
> Repo: https://github.com/your-org/leakgoblin
>
> Feedback welcome - especially false positives/negatives with synthetic examples. Never paste real secrets in issues.

### Reddit r/programming, r/webdev, r/node, r/devtools (check each subreddit's self-promo rules)

Similar but shorter, focus on practical use case. Always disclose it's your project.

### Hacker News Show HN

Title: Show HN: LeakGoblin – Scan and sanitize prompts locally before pasting to AI tools

Body: Same as above, include technical details about detection approach (format-specific + low-confidence heuristic), local-only, no network.

### Twitter/X, LinkedIn, Mastodon

"Built a tiny goblin that guards your secrets 🛡️

leakgoblin scan --stdin → masked findings
leakgoblin sanitize --stdin → redacted version safe to share

Local-only, no telemetry, MIT. Built with Node 24 LTS.

npx leakgoblin scan .

Repo: https://github.com/your-org/leakgoblin

Uses synthetic canary values only (AKIAIOSFODNN7EXAMPLE). Best-effort, not perfect - always review."

## What NOT to Claim

- Do NOT claim it finds all secrets or is 100% secure
- Do NOT claim security certification, audits, or compliance
- Do NOT invent user counts, stars, testimonials, or benchmarks
- Do NOT imply it replaces secrets management or vaults

Always include: "Redaction is best-effort. Always review before sharing."

## Assets Needed

- [ ] Terminal GIF (15-30s) showing scan + sanitize
- [ ] Screenshot of masked output
- [ ] Logo/banner: simple goblin ASCII + shield (optional)

## Post-Launch Day 7 Tasks

- Collect bug reports, especially installation issues
- Fix most common false positives
- Add tests for reported failures
- Thank genuine contributors (with permission)
- Publish changelog

The goblin is ready. 🛡️
