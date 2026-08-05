---
description: How Paraglide.js i18n is wired into TanStack Start apps in this monorepo —
  message source location, the four integration points every localized app needs, the
  message-key naming convention, and why @repo/ui stays translation-free. Invoked when
  adding i18n to a new app, adding/renaming message keys, debugging locale routing
  (404s on /fr or /en, wrong locale rendering), or touching packages/i18n,
  paraglideVitePlugin, or any src/lib/paraglide/* generated output.
tools:
  - Read
  - Edit
  - Write
  - Grep
  - Bash
---

Paraglide compiles per app, from one shared message source. Every localized app needs
four integration points, not just the Vite plugin — skipping any one of them produces a
404 on `/fr` or `/en` that looks unrelated to i18n.

## Message source lives in packages/i18n, not in any app

`packages/i18n/project.inlang/` (inlang project config) and
`packages/i18n/messages/{fr,en}.json` (the actual strings) are shared across every app.
This is **Pattern 1** from [paraglidejs.com/monorepo](https://paraglidejs.com/monorepo):
one message source, each app compiles its own `src/lib/paraglide/` output independently,
each app free to pick its own locale-detection strategy.

Do **not** centralize the compiled output into a shared package that other apps import
(Pattern 2 in the same doc). That only works if every consuming app uses an identical
locale strategy — portfolio's URL-localized routes with per-locale PDF prerendering are
specific enough that this monorepo would break that constraint immediately.

`baseLocale` is `fr` for the whole monorepo. Every new locale-facing key needs both
`fr` and `en` entries — inlang warns if a key is missing from the base locale.

## Message key naming convention

`<scope>_<section>_<description>` — lowercase, underscore-separated.

- `scope` is the app name (`portfolio`, `playground`, `registry`) for copy that belongs
  to just that app.
- `scope` is `shared` for copy reused across apps via `@repo/ui` — nav aria-labels, the
  locale switcher's aria-label, `NotFound`/`DefaultCatchBoundary` chrome (identical
  wording across every app's 404 and error pages).

Before adding a new `<app>_*` key, check whether the string is actually generic UI
chrome another app already has under `shared_*` — promote to `shared_` instead of
duplicating the translation. `shared_not_found_*` and `shared_error_boundary_*` exist
for exactly this reason.

Examples: `portfolio_contact_label_email`, `playground_hero_title`,
`registry_empty_state`, `shared_github_profile_aria`.

## The four integration points (per app)

Missing any one of these produces a 404 on locale-prefixed paths that has nothing to do
with the message content — the symptom is identical whether the plugin, the server
middleware, or the router rewrite is missing, so check all four before assuming the
messages themselves are wrong.

### 1. `vite.config.ts` — compile + detection strategy

```ts
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { translatedPathnames } from "./src/utils/translated-pathnames";

paraglideVitePlugin({
  project: "../../packages/i18n/project.inlang",
  outdir: "./src/lib/paraglide",
  outputStructure: "message-modules",
  cookieName: "PARAGLIDE_LOCALE",
  cookieDomain: ".nicolas-thouvenin.dev",
  strategy: ["url", "cookie", "preferredLanguage", "baseLocale"],
  urlPatterns: translatedPathnames,
}),
```

Place it first in the `plugins` array (before `cloudflare`, `tailwindcss`,
`tanstackStart`, `viteReact`) — later plugins consume its output.

`cookieDomain` is what makes the locale choice travel between apps. All apps in this
monorepo live on subdomains of `nicolas-thouvenin.dev` (portfolio at the apex,
playground and registry-showcase on subdomains) but paraglide's compiled `setLocale()`
(`node_modules/@inlang/paraglide-js/dist/compiler/runtime/set-locale.js`) only sets a
`domain=` attribute on the `PARAGLIDE_LOCALE` cookie when `cookieDomain` is configured —
otherwise the cookie defaults to the exact host that set it and a locale choice made on
one app is invisible on another. Every app must set the same
`cookieDomain: ".nicolas-thouvenin.dev"` for the cookie to be readable across all of
them; skipping it on a new app doesn't break that app, it just silently fails to pick up
(or share) the cross-app preference.

### 2. `src/utils/translated-pathnames.ts` — url patterns, including root

Even an app with a single `/` route needs an explicit pattern for it. Without one,
paraglide's default URL matching and TanStack Router's own trailing-slash
canonicalization disagree with each other: `/en/` redirects to `/en` (router
canonicalizing away the trailing slash), then `/en` 404s (paraglide's default pattern
expected the slash). Declaring the pattern explicitly sidesteps the disagreement:

```ts
import type { Locale } from "~/lib/paraglide/runtime";

export const translatedPathnames = [
  {
    pattern: "/",
    localized: [
      ["fr", "/fr"],
      ["en", "/en"],
    ] as Array<[Locale, string]>,
  },
  {
    pattern: "/:path(.*)?",
    localized: [
      ["fr", "/fr/:path(.*)?"],
      ["en", "/en/:path(.*)?"],
    ] as Array<[Locale, string]>,
  },
];
```

Portfolio's version additionally maps specific routes to different localized slugs
(`/cv` → `/en/resume`) — copy that pattern only if the app actually needs per-route
translated slugs; most apps just need the root + catch-all above.

### 3. `src/server.ts` — paraglideMiddleware

The Cloudflare Worker entry must detect the locale from the incoming request before
TanStack Start's handler runs:

```ts
import handler from "@tanstack/react-start/server-entry";
import { paraglideMiddleware } from "./lib/paraglide/server";

export default {
  fetch(req: Request): Promise<Response> {
    return paraglideMiddleware(req, () => handler.fetch(req));
  },
};
```

Without this, `getLocale()` during SSR never reflects the URL — every request renders
the base locale (`fr`) regardless of `/en` in the path, and `<html lang>` is wrong.

### 4. `src/router.tsx` — rewrite

TanStack Router needs to be told that `/en/whatever` and `/whatever` are the same
internal route, or it 404s on every locale-prefixed path since no file-based route
literally matches `/en`:

```ts
import { deLocalizeUrl, localizeUrl } from "./lib/paraglide/runtime";

createRouter({
  routeTree,
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
  rewrite: {
    input: ({ url }) => deLocalizeUrl(url),
    output: ({ url }) => localizeUrl(url),
  },
});
```

`input` strips the locale prefix before route matching; `output` re-adds it when
generating hrefs (so `<Link to="/">` renders as `/en` when the current locale is
English).

## Build script

```json
"build": "npx paraglide-js compile --project ../../packages/i18n/project.inlang --outdir ./src/lib/paraglide && vite build && tsc --noEmit"
```

The Vite plugin recompiles automatically in dev on message-file changes. In `build`,
compile must run first — `vite build`/`tsc` both need the generated
`src/lib/paraglide/messages` module to exist and be current.

## @repo/ui stays translation-free

Nothing in `packages/ui` imports Paraglide or bakes in translated copy. Every string a
shared component needs is a prop with an English fallback default (e.g.
`GitHubLink`'s `ariaLabel`, `Nav`'s `primaryNavAriaLabel`). Consuming apps pass their
own `m.*()` call as the prop value. This is deliberate, not an oversight — see the
"shared UI package" guidance in the [Paraglide monorepo doc](https://paraglidejs.com/monorepo):
a UI package that imports Paraglide would either need every consumer to hand it a
`getLocale`/`setLocale` override, or it silently detects locale from its own compiled
runtime and disagrees with the app around it.

`LocaleSwitcher` (`packages/ui/src/components/locale-switcher.tsx`) follows the same
rule: it takes `locales`, `activeLocale`, `onSelect`, and `ariaLabel` as props and knows
nothing about Paraglide. Each app wires it up locally:

```tsx
import { LocaleSwitcher } from "@repo/ui";
import { getLocale, setLocale, locales } from "~/lib/paraglide/runtime";
import { m } from "~/lib/paraglide/messages";

<LocaleSwitcher
  locales={locales.map((code) => ({ code, label: code.toUpperCase() }))}
  activeLocale={getLocale()}
  onSelect={(code) => setLocale(code as (typeof locales)[number])}
  ariaLabel={m.shared_locale_switch_aria()}
/>
```

It renders stable `data-slot="locale-switcher"` / `data-slot="locale-option"
data-locale="<code>"` attributes for exactly one reason: e2e tests need a
locale-independent way to find "the button for English" that doesn't break when the
visible label or aria-label is itself translated. Don't remove these attributes or key
tests off the translated button text.

## Testing must hit the production build, not `vite dev`

`setLocale()` does a full `window.location.href` navigation. In `vite dev`, TanStack
Router's client-side router intercepts that navigation and reroutes it back through its
own `rewrite.input`/`rewrite.output`, landing back on the *current* locale instead of
the target one — the switch silently no-ops. In the production build each locale URL is
served by the real request handler, so the reload actually lands on the new locale.
Playwright configs in this monorepo always point `webServer.command` at
`build && preview`, never `dev`.

`@repo/e2e-utils` (`packages/e2e-utils/src/index.ts`) has the shared Playwright helpers
for this: `switchLocale(page, { to, expectUrl, expectText })`,
`expectActiveLocale(page, code)`, `expectHtmlLang(page, locale)`. They target the
switcher's `data-slot`/`data-locale` attributes, so they work identically across apps
regardless of what the switcher's visible labels are localized to. Add it as a
`devDependency` (`"@repo/e2e-utils": "workspace:*"`) alongside `@playwright/test`.

Pick `expectText` values that are full sentences or otherwise unique on the page, not
single common words. `page.getByText()` runs in strict mode by default and does a
case-insensitive substring match — a short heading like "Apps" or "Packages" will also
match the word inside an unrelated body-copy sentence elsewhere on the page and throw a
strict-mode-violation error. Section headings and short labels are exactly the words
most likely to also appear in surrounding prose, so this bites here more than in typical
Playwright tests. Prefer a distinctive clause from a paragraph (`"living side by side in
one pnpm monorepo"`) over the heading itself (`"Apps"`).

## Adding i18n to an app that doesn't have it yet

1. Add `@inlang/paraglide-js` (devDependency) and `@inlang/paraglide-js-react`
   (dependency), pinned to the versions already used elsewhere in the monorepo.
2. Add the four integration points above.
3. Wrap `NotFound`/`DefaultCatchBoundary` wrapper components with `shared_not_found_*`
   / `shared_error_boundary_*` message calls instead of leaving the English defaults.
4. Wire `GitHubLink` and `LocaleSwitcher` into the app's nav wrapper with
   `shared_github_profile_aria` / `shared_locale_switch_aria`.
5. Run `npx paraglide-js compile --project ../../packages/i18n/project.inlang --outdir ./src/lib/paraglide`
   once manually to generate the initial output before first `dev`/`build`.
6. `pnpm install` at the repo root to link the new dependencies.
