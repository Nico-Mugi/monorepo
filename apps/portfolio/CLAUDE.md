# Portfolio v2 — Claude Code context

## Stack at a glance

- **Framework**: TanStack Start (React 19, SSR on Cloudflare Workers)
- **Routing**: File-based TanStack Router — `src/routes/`
- **Styling**: Tailwind CSS v4 + shadcn (CVA + clsx + tw-merge) + Base UI
- **i18n**: Paraglide JS (inlang) — `fr` is the base locale, `en` is second
- **Deployment**: Cloudflare Workers via wrangler (no D1, KV, R2, or DO bindings)
- **Tests**: Playwright e2e only — `src/tests/e2e/`
- **PDF export**: Custom Vite plugin auto-renders routes to PDF during dev watch

## Critical constraints

### Playwright tests MUST use the production build
Run `pnpm build && pnpm preview` before `playwright test`. Do NOT test against
`pnpm dev`: Paraglide's `setLocale()` calls `window.location.href`, which TanStack
Router intercepts client-side in dev mode, routing back to the same locale instead
of switching. The bug disappears in the production build where each locale URL is
a prerendered static file. Dev and preview both run on port 3001 (not
simultaneously — same as every other app in the monorepo).

### Paraglide messages require compile after editing
The message source (`project.inlang/`, `messages/fr.json`, `messages/en.json`)
lives in `packages/i18n/` — shared across all apps, not just portfolio. Editing
those files does not immediately update TypeScript types here. The build script
runs `paraglide-js compile` first. In dev, the Vite plugin recompiles
automatically. If TS doesn't see a new key, trigger a dev server restart or run
`npx paraglide-js compile --project ../../packages/i18n/project.inlang --outdir ./src/lib/paraglide`.

## Message key naming convention

`<scope>_<section>_<description>` — all lowercase, underscores, hierarchical.
`scope` is `portfolio` for everything in this app, `shared` for copy reused
across apps via `@repo/ui` (nav labels, locale switcher, etc.), or another
app's name (`playground`, `registry`) for keys that belong to it.
Examples: `portfolio_contact_label_email`, `portfolio_cv_skill_web`,
`portfolio_experience_1_highlight_2`, `shared_nav_home`.
Always add keys to **both** `packages/i18n/messages/fr.json` and `en.json`.
Base locale is `fr` — the key must exist there or inlang will warn.

## Adding a new route — checklist

1. `src/routes/<name>.tsx` — `createFileRoute("/<name>")({ head, component })`
2. `src/utils/translated-pathnames.ts` — add locale-to-path mapping
3. `src/utils/prerender.ts` — add to `prerenderRoutes` via `localizeHref`
4. `head()` — call `seo()` with title, description, image, url, site_name

## Useful scripts

| Script | What it does |
|---|---|
| `pnpm dev` | Dev server on port 3001, Paraglide hot-reload, PDF watch |
| `pnpm build` | paraglide compile → vite build → tsc --noEmit |
| `pnpm preview` | Serve production build on port 3001 |
| `pnpm deploy` | build + wrangler deploy |
| `pnpm test` | Playwright (needs preview server running or webServer spins it up) |
| `pnpm test:ui` | Playwright UI mode |
| `pnpm cf-typegen` | Regenerate Cloudflare Worker types |
