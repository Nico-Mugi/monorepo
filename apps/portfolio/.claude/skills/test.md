---
description: Run Playwright e2e tests correctly against the production preview build.
  Invoked when verifying i18n behavior, routing changes, or CV layout.
tools:
  - Bash
allowed-tools:
  - Bash: ["pnpm build", "pnpm preview", "pnpm test*", "npx playwright*"]
---

## Why tests must use the production build

Do NOT run tests against `pnpm dev` (port 3000).

In dev mode, TanStack Router intercepts `window.location.href` changes client-side.
When Paraglide's `setLocale()` fires, TanStack Router catches the navigation, strips
the locale prefix via its `rewrite.input` function, and re-adds the current locale via
`rewrite.output` — routing back to the same locale instead of the target one.

In the production build every locale URL (`/fr`, `/en`, `/en/resume`, etc.) is a
prerendered static file. `setLocale()` triggers a real browser reload to the new URL,
bypassing TanStack Router's client-side interception entirely.

## Running tests

The Playwright config's `webServer` block handles the build + preview automatically:

```bash
pnpm test           # all browsers, headless (chromium + firefox + webkit)
pnpm test:headed    # all browsers, visible window
pnpm test:ui        # Playwright UI mode — best for writing/debugging tests
pnpm test:debug     # step through one test at a time
pnpm test:report    # open last HTML report
```

If the preview server is already running on port 3001, Playwright reuses it
(`reuseExistingServer: true` in non-CI mode). Otherwise it runs
`pnpm build && pnpm preview` automatically — this takes ~30–60 seconds.

## Test file location

`src/tests/e2e/`

Current suites:
- `i18n.spec.ts` — locale switching on homepage and route-specific URL translation
- `cv-layout.spec.ts` — CV page layout

## Writing new tests

- Always target the preview server (`baseURL: http://localhost:3001`)
- Test locale-dependent behaviour by navigating to `/fr/...` or `/en/...` explicitly
- For link/button text, prefer `getByRole` or `getByText` with the locale-specific string
  to confirm the correct locale rendered
