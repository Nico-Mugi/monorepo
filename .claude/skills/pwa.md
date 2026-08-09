---
description: Make an app in apps/<name> installable as a PWA (manifest + icons). Use when asked to add "install as app" / "add to home screen" support.
disable-model-invocation: true
tools:
  - Read
  - Edit
  - Write
  - Bash
---

PWA support is opt-in per app — most apps in this monorepo don't have it. This is the
pattern used for `parlor` (`apps/parlor`), the first app to add it.

## Don't use vite-plugin-pwa

`vite-plugin-pwa` (and its fork `serwist`) looks like the obvious tool, but its
`generateSW` build hook does not work with TanStack Start's production build under
Vite's Environment API (the `client`/`ssr` environment split that `@tanstack/react-start`
and `@cloudflare/vite-plugin` both use). It emits `registerSW.js` and
`manifest.webmanifest` correctly, but never emits the actual `sw.js` — the registration
script ends up pointing at a 404. This is a confirmed upstream issue, not a config
mistake: see [serwist/serwist#300](https://github.com/serwist/serwist/issues/300)
("`sw.js` is not built in vite with Tanstack Start production build").

You don't need to work around it: Chrome/Edge [dropped the service-worker requirement
from install criteria](https://developer.chrome.com/blog/update-install-criteria) — a
valid manifest + HTTPS + icons is enough for the install prompt. A service worker only
buys you offline support, which isn't a goal for any current app in this repo (and is
actively risky for apps with per-session/private routes — see below). So: skip
`vite-plugin-pwa` entirely and hand-write a static manifest instead.

## Step 1 — Generate icons

Every app's favicon is the shared `NT.DEV` wordmark (`apps/portfolio/public/logos/vertical.svg`,
copied per `add-app.md` Step 10) — but that mark has a non-square `viewBox="0 0 60 40"`
built for a browser tab, not a home-screen icon. Forcing it through a square icon
generator crops the text and drops the background. Don't reuse it for the app icon —
build a dedicated square source SVG instead, using the same colors so the installed icon
still matches the app's identity. Pull the exact hex values from
`packages/ui/src/styles/theme.css`'s `.dark` block (`--background` → icon background,
`--primary` → glyph/theme color); convert `oklch()` to hex precisely, don't eyeball it.

Example source (`apps/<name>/pwa-icon-source.svg` — not under `public/`, it's a
generation input, not a served asset):

```xml
<svg width="512" height="512" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#0A0A0A"/>
  <text x="50" y="70" text-anchor="middle" fill="#8FAF83"
        font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="62"
        letter-spacing="-0.025em">P</text>
</svg>
```

Use `font-family="Arial, Helvetica, sans-serif"`, not `"Inter, sans-serif"`. The icon
generator rasterizes with whatever fonts are installed on the machine running it — Inter
Variable is a webfont (`@fontsource-variable/inter`), not a system font, so it silently
falls back to a serif font and the glyph looks wrong. Arial/Helvetica are reliably
present and close enough to Inter's weight/shape for a single glyph.

Generate the set (one-off CLI run, no dependency needed in `package.json`):

```bash
npx --yes @vite-pwa/assets-generator --preset minimal-2023 pwa-icon-source.svg
```

Run from `apps/<name>/` with the source path relative to it; the generator writes its
output into `public/` next to the source, honoring the source's own directory. Produces
`pwa-64x64.png`, `pwa-192x192.png`, `pwa-512x512.png`, `maskable-icon-512x512.png`,
`apple-touch-icon-180x180.png`, and `favicon.ico`. **Read the generated PNGs back
(they're small — inline image read is fine) before trusting them**: check the glyph
rendered in the right font and isn't cropped, since the generator's crop/zoom logic is
tuned for square-ish sources and silently mangles anything else.

## Step 2 — Hand-write the manifest

`apps/<name>/public/manifest.webmanifest`:

```json
{
  "name": "<App Name>",
  "short_name": "<App Name>",
  "description": "<one line, no em-dashes>",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0A0A0A",
  "theme_color": "#8FAF83",
  "icons": [
    { "src": "/pwa-64x64.png", "sizes": "64x64", "type": "image/png" },
    { "src": "/pwa-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/pwa-512x512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/maskable-icon-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

No build step needed — anything in `public/` is served as-is by
`@cloudflare/vite-plugin`'s static asset handling, same as `favicon.svg` already is.

## Step 3 — Wire it into `__root.tsx`'s `head()`

```tsx
meta: [
  // ...existing meta
  { name: "theme-color", content: "#8FAF83" },
],
links: [
  { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
  { rel: "icon", href: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon-180x180.png" },
  { rel: "manifest", href: "/manifest.webmanifest" },
  // ...existing links
],
```

## Apps with private/dynamic routes (invite-links, sessions, etc.)

Since this pattern has no service worker, there's nothing that can cache or leak
navigations to private routes — the manifest only affects install metadata. If a future
fix upstream makes a real service worker viable here, do not let it precache or
navigation-fallback on private routes (e.g. `parlor`'s `/room/$slug`, which is SSR'd
per-request over a live WebSocket + Durable Object). Scope any future `workbox`
config to hashed static assets only, with no `runtimeCaching` on HTML or API requests.

## Verify

```bash
pnpm build --filter <name>
pnpm preview --filter <name>   # or dev
```

Open in Chrome, check DevTools → Application → Manifest (icons/colors/name resolve
correctly) and confirm the install icon appears in the address bar. Run `pnpm kill-dev`
when done.
