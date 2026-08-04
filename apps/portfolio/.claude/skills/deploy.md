---
description: Build the portfolio and deploy to Cloudflare Workers via wrangler.
disable-model-invocation: true
tools:
  - Bash
  - Read
allowed-tools:
  - Bash: ["pnpm build", "pnpm deploy", "wrangler deploy", "wrangler tail"]
---

## Pre-deploy checklist

Before running any deploy command, verify:

**1. TypeScript passes**
`pnpm build` runs `tsc --noEmit` at the end. A type error aborts the build.
Fix all TS errors before deploying.

**3. No uncommitted changes you'd regret losing**
The deploy reflects whatever is currently built — not necessarily what's committed.

## Deploy command

```bash
pnpm deploy
```

This runs `pnpm build && wrangler deploy` in sequence.
If either step fails, the other does not run.

## What gets deployed

- Cloudflare Worker: the SSR server from `src/server.ts`
- Static assets: prerendered HTML for `/fr`, `/en`, `/fr/cv`, `/en/resume`
- `public/files/` PDFs (served as static assets)
- No database migrations (no D1 or KV bindings currently)

## After deploying

Verify the live site at `https://nicolas-thouvenin.dev`:
- [ ] Homepage loads in French (`/fr`) and English (`/en`)
- [ ] Language switcher works
- [ ] CV/Resume pages load (`/fr/cv`, `/en/resume`)
- [ ] PDF download links return a file (not 404)

To tail live logs: `wrangler tail`
