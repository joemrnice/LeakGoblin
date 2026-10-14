# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## What LeakGoblin Does and Does Not Guarantee

**LeakGoblin is a best-effort filter, not a guarantee.**

- It scans locally by default and makes no network requests during normal scans.
- It attempts to detect common secret patterns (API keys, tokens, private keys, passwords, connection strings, etc.).
- It redacts detected values while preserving surrounding context.
- It never claims to identify every possible secret.

**Limitations you should know:**

- High-entropy generic detection is heuristic only and may produce false positives or false negatives.
- Custom or novel secret formats not covered by rules will not be detected unless you add custom patterns.
- Redaction is based on pattern matching; sophisticated obfuscation may bypass it.
- The tool does not prevent you from manually pasting secrets elsewhere after sanitization.
- Always review sanitized output before sharing to external services.

## Reporting a Vulnerability

If you find a security vulnerability in LeakGoblin itself (e.g., the tool leaks secrets in logs, bypasses its own redaction, or has command injection):

1. **Do not** open a public issue.
2. Email the maintainer or use GitHub's private vulnerability reporting.
3. Include steps to reproduce with synthetic canary values only (e.g., AKIAIOSFODNN7EXAMPLE), never real credentials.
4. We aim to respond within 48 hours and provide a fix or mitigation plan within 7 days.

## Safe Handling

- Never paste real secrets into GitHub issues, PRs, or public forums.
- Use synthetic examples like:
  - `AKIAIOSFODNN7EXAMPLE`
  - `ghp_1234567890abcdefghijklmnopqrstuvwxyzABCD`
  - `sk_test_1234567890abcdefghijklmnop`
- All tests and examples in this repository use only synthetic canary values.

## No Telemetry, No Upload

LeakGoblin does not:
- Upload scanned content
- Make network requests during scan/sanitize
- Store secrets
- Require an account

If you configure custom patterns that call external services (not part of MVP), you are responsible for reviewing those integrations.

## Dependencies

We monitor dependencies for vulnerabilities. Run `npm audit` regularly. CI runs on Node 20, 22, 24 LTS.

Thank you for helping keep the goblin honest. 🛡️
