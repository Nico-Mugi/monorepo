---
description: How Paraglide.js i18n is wired into TanStack Start apps in this monorepo —
  message source location, the four integration points every localized app needs, the
  message-key naming convention, why @repo/ui stays translation-free, and how
  getLocale()/setLocale() actually behave at runtime (reload semantics, no caching,
  overwriteGetLocale() for reactive no-reload switching, the cookie-domain gotcha).
  Invoked when adding i18n to a new app, adding/renaming message keys, debugging locale
  routing (404s on /fr or /en, wrong locale rendering), touching packages/i18n,
  paraglideVitePlugin, or any src/lib/paraglide/* generated output, or building a
  locale switch that must not navigate/reload (e.g. a page holding live WebSocket/WebRTC
  state).
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

## Runtime internals: what `getLocale()`/`setLocale()` actually do

Relevant whenever an app needs to switch locale *without* a page navigation — e.g. a
route holding live client-only state (an open WebSocket, an active WebRTC call,
unsaved form state) that a hard reload would destroy. Every other app in this monorepo
uses the default "url" strategy and just accepts the reload on switch, so none of this
applies to them; skip this section unless you're building exactly that kind of
no-reload switch. `apps/parlor/src/lib/locale-context.tsx` is a working, tested
reference implementation of the full pattern below.

**`getLocale()` re-derives from scratch on every call, no caching.** Past a one-time
bootstrap sync on first call, there is no memoized "current locale" anywhere in the
compiled runtime — every call re-resolves through the active strategy list
(`packages/i18n`'s generated `src/lib/paraglide/runtime.js`, function `getLocale`).
Every compiled `m.*()` message function calls it internally, so this is also true of
every message call: nothing about `m.parlor_home_title()` is memoized by paraglide
itself.

**`setLocale()` defaults to a hard navigation, and drops it only if "url" strategy is
present.** `newLocation` (the target URL `window.location.href` gets set to) is only
computed at all when `"url"` is in the active strategy list; otherwise `setLocale()`
still calls `window.location.reload()` by default — dropping "url" from the strategy
array does **not**, by itself, stop the reload. The actual opt-out is the second
argument: `setLocale(next, { reload: false })`. Paraglide's own doc comment on this
option is exact about what it doesn't do: "It does not re-render the UI or update the
document." You get a cookie/localStorage write (whichever strategies are active) and
nothing else — building the actual reactivity is entirely on you.

**The cookie is best-effort, not a live source of truth.** `cookieDomain` (set to
`.nicolas-thouvenin.dev` for cross-app sharing, see integration point 1 above) makes
`document.cookie` writes get silently rejected by the browser on any host that isn't a
`nicolas-thouvenin.dev` subdomain — which is *every* local/test environment
(`localhost`), and this generalizes: any cookie write can silently no-op wherever
cookies are blocked, for any reason, on any host. A locale switch that relies on
`getLocale()` re-reading a cookie that was just set is fragile in a way that's easy to
miss locally and only shows up as "the picker says the new locale but nothing actually
translated" — the UI driving the picker (if it reads its own separate reactive state)
looks correct while every `m.*()` call quietly keeps returning the old locale. If
persistence across a real reload matters (not just the live in-session switch), don't
just accept this: rewrite the cookie yourself right after paraglide's own write, with
`domain` computed against `window.location.hostname` at the moment of the call instead
of the static config value (`cookieName`/`cookieMaxAge` are exported constants from the
generated runtime, reuse them rather than hardcoding), and add `"localStorage"` to the
strategy list too — paraglide's own docs recommend pairing it with `"cookie"`
specifically because localStorage has no domain-matching failure mode at all, at the
cost of being invisible during SSR (paraglide skips it server-side and falls through to
the next strategy), so it can't replace the cookie, only backstop it.

**The fix: `overwriteGetLocale()`, paraglide's own sanctioned extension point**
(https://paraglidejs.com/strategy) for exactly this — custom/reactive locale
resolution. `getLocale` is exported as a mutable `let` binding, not a `const`, and
every compiled message function imports and calls it live (ESM live bindings resolve
through the current value of the binding, not a snapshot taken at import time). Calling
`overwriteGetLocale(() => someValue)` once therefore makes *every* `m.*()` call site in
the app correct immediately, with zero per-call-site changes — no need to thread
`{ locale }` through every message call by hand (that was the first, wrong instinct
this pattern was built to avoid).

Two things matter for doing this safely in an SSR app on Cloudflare Workers:

1. **Guard it to the client**: `if (typeof window !== "undefined") overwriteGetLocale(...)`.
   On the server, `getLocale()` must keep using paraglide's own per-request
   `serverAsyncLocalStorage` (wired up by `paraglideMiddleware` in `server.ts`) —
   overwriting it unconditionally would replace that per-request resolution with
   whatever a shared module-level variable last got set to, which is a real
   cross-request locale leak risk on a Worker isolate that can be reused across
   multiple users' requests.
2. **Back the override with a plain module-level variable that a `switchLocale()`
   function updates synchronously**, not the cookie/`getLocale()` round-trip — that's
   the whole point, this value must be correct regardless of whether the cookie write
   succeeded.

**Never read that module-level variable directly for a React state initializer —
always call `getLocale()` fresh instead, even inside the same file that just defined
the override.** This one is nasty because it's invisible on the client and only shows
up server-side, and only after the Worker isolate has served more than one request. A
`LocaleProvider`'s natural first draft is
`useState(() => liveLocale)`, reading the module-level variable straight from the
closure. On the client this is fine — the module (and `let liveLocale = getLocale()`
alongside it) genuinely re-evaluates fresh on every real page load, so it always
reflects that load's actual locale. On the server it's wrong: a Cloudflare Worker
isolate evaluates a module's top-level code *once* and can keep reusing that same
isolate — and the same already-executed module — across many unrelated requests.
`liveLocale`'s value froze at whatever the *first* request that warmed the isolate
happened to resolve, and every SSR render after that silently ignored each new
request's own cookie, no matter how correctly it was set or read. The fix is the same
one-line swap either way: `useState(() => getLocale())`, never
`useState(() => liveLocale)` — on the client `getLocale()` already *is* the override
returning `liveLocale`, so nothing changes there; on the server it stays paraglide's
real per-request resolution, since the override installs client-only. Symptom to
recognize this by: a locale switch works instantly in the tab that made it, persists
correctly in `document.cookie`/`context.cookies()`, and yet a hard reload — or a
second, unrelated visitor — renders the *previous* locale server-side regardless of
what the request's own cookie says.

**A re-render still isn't automatic — that's what the React Context is for.** Bumping
a module-level variable makes `getLocale()` return the right value, but React won't
re-invoke any component function just because some value it happens to read changed
out from under it. Wrap the reactive value in a Context whose consumers are the
components that need to update (each route's top-level component is usually enough —
everything it constructs directly in its own JSX re-renders as a normal consequence of
*it* re-rendering). This specifically has to be a Context, not just a re-render
triggered higher up the tree: when a component receives `children` as a prop (as every
route's content effectively is, threaded down from the router), React bails out of
re-rendering that subtree if the `children` element reference didn't change — a
context Provider's consumers are the one thing that reaches through that bailout,
since React re-renders any `useContext` subscriber whose Provider value changed
regardless of what the props chain above it did.

**`useMemo`/`useCallback` around a `m.*()` call needs `locale` in its dependency
array.** Easy to miss: even with `getLocale()` and the Context both fixed, a memoized
value that calls `m.*()` inside its factory function will keep returning its
first-render (now-stale) translated string forever unless the reactive `locale` value
is explicitly listed as a dependency — nothing about `useMemo`'s own bookkeeping knows
that the memoized computation secretly depends on global locale state.

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
