# Supporting LeakGoblin

LeakGoblin is free, open-source (MIT), and works fully offline without any donation or account.

If it saved you from a suspicious copy-paste, you can support its maintenance.

## What Sponsorship Funds Support

Sponsorships and donations, when configured by the maintainer, support:

- **Maintenance:** Bug fixes, dependency updates, Node LTS compatibility (currently Node 24 Active LTS, Node 22 Maintenance)
- **Test coverage:** More synthetic fixtures, edge-case tests, cross-platform CI (Windows, macOS, Linux)
- **New detection rules:** Additional provider tokens, connection-string formats, and community-requested patterns, implemented conservatively
- **Documentation:** Clearer examples, troubleshooting, and safe-usage guidance
- **Security reviews:** Responsible handling of vulnerability reports

## What Sponsorship Does NOT Buy

- No priority bypass of security review
- No guarantee to merge a specific detection rule (rules must be high-confidence and safe)
- No access to your scanned content (tool is local-only)
- No hidden features behind paywall - core remains free

## How to Sponsor

Maintainer will configure real sponsorship links in `.github/FUNDING.yml` when ready.

Until then, this file and `FUNDING.yml` contain clearly labeled placeholders. Do not send funds to placeholder links.

Example configuration (maintainer to replace):

```yaml
# .github/FUNDING.yml
# github: your-github-username
# ko_fi: your-kofi-username
# custom: https://your-custom-link.example.com
```

## Donation Message

The CLI shows this after completion (disable with `LEAKGOBLIN_NO_DONATION=1`):

> Saved you from a suspicious copy-paste? Toss the goblin a coffee to help maintain the tool.

It appears after results, never before you can access sanitized output. The tool remains fully functional without donations.

## Transparency

- No invasive analytics
- No hidden telemetry
- No undisclosed external API calls
- No artificial urgency

Thank you for considering support, and thank you for using LeakGoblin responsibly. 🛡️
