# Release Checklist

Before publishing LeakGoblin v0.1.0

## Code & Tests
- [ ] `npm run lint` (tsc --noEmit) passes
- [ ] `npm run build` succeeds and generates dist/
- [ ] `npm test` passes (all suites)
- [ ] `npm run smoke` passes (packaging smoke test)
- [ ] No real secrets in repo (grep for common patterns, use `npm run build && node ./dist/cli.js scan .`)
- [ ] Test on clean install: `npm ci && npm run build && npm test`

## Compatibility
- [ ] Tested on Node 20, 22, 24 (CI matrix)
- [ ] Tested on Windows, macOS, Linux (CI matrix)
- [ ] `--no-color` and `--quiet` work
- [ ] `--format json` never leaks raw secrets
- [ ] stdin and file/dir scan both work
- [ ] `sanitize --stdin` preserves structure and line breaks

## Documentation
- [ ] README has installation, quick start, usage examples near top
- [ ] README explains limitations (best-effort, not guarantee)
- [ ] SECURITY.md exists and accurate
- [ ] CONTRIBUTING.md exists
- [ ] LICENSE is MIT and copyright year correct
- [ ] .env.example has placeholders only, no real credentials
- [ ] leakgoblin.config.example.json valid and documented

## Packaging
- [ ] package.json version bumped (semver)
- [ ] bin entry `leakgoblin` points to `./dist/cli.js` and is executable
- [ ] files array includes only needed files (dist, README, LICENSE, SECURITY)
- [ ] `npm pack --dry-run` shows expected files
- [ ] Tested `npm install -g ./leakgoblin-0.1.0.tgz` and commands work

## GitHub
- [ ] .github/workflows/ci.yml present and passes on push
- [ ] Issue templates and PR template present
- [ ] FUNDING.yml has real links or is disabled example (no broken links)
- [ ] Repository has description, topics (security, cli, devtools, etc.)

## Launch Kit
- [ ] Demo GIF or terminal recording (using synthetic secrets only)
- [ ] Launch announcement draft (see LAUNCH_KIT.md)
- [ ] Changelog for v0.1.0

## Post-Publish
- [ ] `npm publish` (with provenance if configured)
- [ ] Git tag `v0.1.0` and GitHub Release with notes
- [ ] Announce in relevant communities (follow each community's promotion rules)
- [ ] Monitor issues for installation problems first 48h

## Funding (when ready)
- [ ] Real sponsorship accounts configured by maintainer
- [ ] No invented donation links, no fake testimonials
