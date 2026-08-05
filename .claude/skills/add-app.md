---
description: Scaffold a new web app in apps/<name> with TanStack Start, Cloudflare Workers, Tailwind, and @repo/ui wired up.
disable-model-invocation: true
tools:
  - Read
  - Edit
  - Write
  - Bash
---

Follow every step. Missing one causes cryptic errors at build time.

## Step 1 — Assign ports

Two ports needed per app — both must be unique across all apps:

| App               | Vite dev port | CF inspector port |
| ----------------- | ------------- | ----------------- |
| portfolio         | 3000          | 9229              |
| playground        | 3002          | 9231              |
| registry-showcase | 3003          | 9233              |
| next app          | 3004          | 9235              |

The CF inspector port conflict causes an `ECONNRESET` crash when running multiple apps
simultaneously with `pnpm dev`. Always set it explicitly in `vite.config.ts`.

Update this table when you add a new app.

## Step 2 — Create the directory tree

```
apps/<name>/
├── src/
│   ├── routes/
│   │   ├── __root.tsx
│   │   └── index.tsx
│   ├── router.tsx          ← required by TanStack Start
│   ├── routeTree.gen.ts    ← seed manually; TanStack Router overwrites on first run
│   ├── server.ts           ← Cloudflare Worker entry
│   └── styles.css
├── package.json
├── tsconfig.json
├── vite.config.ts
└── wrangler.jsonc
```

## Step 3 — package.json

```json
{
  "name": "<name>",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build && tsc --noEmit",
    "preview": "vite preview --port <PORT>",
    "deploy": "wrangler deploy",
    "cf-typegen": "wrangler types",
    "type-check": "tsc --noEmit",
    "clean": "rimraf dist .output .wrangler"
  },
  "dependencies": {
    "@repo/ui": "workspace:*",
    "@tanstack/react-router": "^1.168.25",
    "@tanstack/react-router-devtools": "^1.166.13",
    "@tanstack/react-start": "^1.167.50",
    "lucide-react": "^1.17.0",
    "react": "^19.2.5",
    "react-dom": "^19.2.5",
    "tw-animate-css": "^1.4.0"
  },
  "devDependencies": {
    "@cloudflare/vite-plugin": "^1.39.1",
    "@tailwindcss/vite": "^4.2.4",
    "@types/node": "^25.6.0",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "tailwindcss": "^4.2.4",
    "typescript": "^6.0.3",
    "vite": "^8.0.10",
    "wrangler": "^4.96.0"
  }
}
```

Pin dependency versions to match the versions already used by other apps (check
playground/package.json for current pinned versions).

## Step 4 — tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["**/*.ts", "**/*.tsx"],
  "compilerOptions": {
    "types": ["vite/client"],
    "allowJs": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "paths": {
      "~/*": ["./src/*"]
    }
  }
}
```

## Step 5 — vite.config.ts

```ts
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  server: { port: <VITE_PORT>, host: true },
  resolve: { tsconfigPaths: true },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" }, inspectorPort: <CF_INSPECTOR_PORT> }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
});
```

Plugin order matters: cloudflare → tailwind → tanstackStart → viteReact.

## Step 6 — wrangler.jsonc

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "<name>",
  "compatibility_date": "2025-09-02",
  "compatibility_flags": ["nodejs_compat"],
  "main": "./src/server.ts",
}
```

Use the same `compatibility_date` as other apps. Update all apps together when bumping it.

## Step 7 — src/styles.css

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "@repo/ui/styles/theme.css";
@source "../../../packages/ui/src";

@custom-variant dark (&:is(.dark *));
```

`@repo/ui/styles/theme.css` is the shared design system (colors, radius, fonts) — every
app imports it as-is to keep visual identity consistent. Don't duplicate or fork its
tokens in an app's own stylesheet; add app-specific CSS below the imports instead.

The `@source "../../../packages/ui/src";` line is required, not optional. Tailwind v4's
automatic content detection scans an app's own directory tree — it does not follow the
`@repo/ui` import to also scan `packages/ui/src` for class names, so any Tailwind utility
class used only inside a shared `@repo/ui` component (and not already used somewhere in
the app itself) silently renders unstyled. `@source` explicitly adds that directory to
the scan. (`@import`ing `theme.css` only brings in design tokens/CSS variables — it's a
separate mechanism from class-name scanning and doesn't substitute for `@source`.)

The new app's `__root.tsx` and every component must consume this theme through semantic
tokens (`bg-background`, `text-foreground`, `bg-primary`, etc.), never hardcoded
`neutral-*`/hex colors. See `.claude/skills/design-system.md` for the full token
vocabulary and the mandatory `dark bg-background` setup on `<html>`.

## Step 8 — SEO

`seo()` lives in `@repo/ui` (`packages/ui/src/utils/seo.ts`) — no per-app copy needed.
Import it as `import { seo } from "@repo/ui";` in `__root.tsx`.

## Step 9 — src/routes/\_\_root.tsx and index.tsx

Copy from `apps/playground/src/routes/` as a starting point. Update the SEO metadata
(title, description, url, site_name) to match the new app.

## Step 10 — src/router.tsx

Required by TanStack Start to locate the router. Without it, vite dev throws
"Could not resolve entry for router entry: router".

```tsx
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });
};
```

If the app uses Paraglide i18n, add the `rewrite` option — see Step 15 and
`.claude/skills/paraglide-i18n.md`.

## Step 11 — src/server.ts

The Cloudflare Worker entry point. Referenced by `wrangler.jsonc` as `"main"`.

```ts
import handler from "@tanstack/react-start/server-entry";

export default {
  async fetch(req: Request): Promise<Response> {
    return handler.fetch(req);
  },
};
```

Must be `async fetch`, not a plain function returning `handler.fetch(req)` directly — `handler.fetch`
is typed as `Response | Promise<Response>`, which fails `tsc --noEmit` against the declared
`Promise<Response>` return type otherwise.

If the app uses Paraglide i18n, wrap with `paraglideMiddleware` — see Step 15 and
`.claude/skills/paraglide-i18n.md`.

## Step 12 — Not-found & error boundary

`NotFound` and `DefaultCatchBoundary` live in `@repo/ui` (`packages/ui/src/components/`) —
themed to match `theme.css` (glow blobs, badge pill, primary/destructive accents) so every
app's 404 and error pages look consistent without each app re-implementing the visuals.

Every app still needs its own `src/components/not-found.tsx` and
`src/components/default-catch-boundary.tsx` — these are thin wrappers, not copies.

`not-found.tsx` has no per-app logic to inject. For an app with no i18n it's a plain
re-export:

```tsx
// src/components/not-found.tsx
export { NotFound } from "@repo/ui";
```

`default-catch-boundary.tsx` always needs a wrapper (even without i18n) to pass
`showErrorDetails={import.meta.env.DEV}` — that flag can only be read correctly from the
consuming app's own Vite context, not from inside `@repo/ui` itself:

```tsx
// src/components/default-catch-boundary.tsx
import { DefaultCatchBoundary as DefaultCatchBoundaryBase } from "@repo/ui";
import type { ErrorComponentProps } from "@tanstack/react-router";

export function DefaultCatchBoundary(props: ErrorComponentProps) {
  return (
    <DefaultCatchBoundaryBase {...props} showErrorDetails={import.meta.env.DEV} />
  );
}
```

If the app uses Paraglide i18n, both wrappers pass translated text as props instead of
using the English defaults — use the `shared_not_found_*` / `shared_error_boundary_*`
message keys (see Step 15 and `.claude/skills/paraglide-i18n.md`), not per-app keys;
that copy is identical across every app on purpose.

Wire both into `__root.tsx`:

```tsx
import { DefaultCatchBoundary } from "~/components/default-catch-boundary.js";
import { NotFound } from "~/components/not-found.js";

export const Route = createRootRoute({
  // ...head, etc.
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
});
```

Without this, TanStack Router falls back to its unstyled default 404/error screens.

## Step 13 — src/routeTree.gen.ts (seed)

TanStack Router generates this file on first `dev` run, but it must exist for Vite to
start. Seed it manually with only the routes you've created, then let the dev server
regenerate it:

```ts
/* eslint-disable */
// @ts-nocheck
import { Route as rootRouteImport } from "./routes/__root";
import { Route as IndexRouteImport } from "./routes/index";

const IndexRoute = IndexRouteImport.update({
  id: "/",
  path: "/",
  getParentRoute: () => rootRouteImport,
} as any);

export interface FileRoutesByFullPath {
  "/": typeof IndexRoute;
}
export interface FileRoutesByTo {
  "/": typeof IndexRoute;
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport;
  "/": typeof IndexRoute;
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fileRoutesByTo: FileRoutesByTo;
  fileRoutesById: FileRoutesById;
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute;
}

const rootRouteChildren: RootRouteChildren = { IndexRoute: IndexRoute };
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addRouteTypes<FileRouteTypes>();
```

## Step 14 — Wire up

```bash
pnpm install   # run at repo root to link @repo/ui workspace dependency
pnpm dev --filter <name>   # verify it starts
```

## Step 15 — Paraglide i18n (only if the app needs translations)

Full instructions, rationale, and gotchas: `.claude/skills/paraglide-i18n.md`. Don't
skip it for "just the Vite plugin" — three more integration points are required beyond
`vite.config.ts`, and missing any one produces a 404 on `/fr` or `/en` with no obvious
connection to i18n. Condensed checklist:

- [ ] `@inlang/paraglide-js` (devDependency) + `@inlang/paraglide-js-react`
      (dependency) added, versions matching other apps
- [ ] `vite.config.ts` — `paraglideVitePlugin` added first in the `plugins` array,
      pointing at `../../packages/i18n/project.inlang`
- [ ] `src/utils/translated-pathnames.ts` created — root `/` pattern explicitly
      mapped per locale, plus a catch-all
- [ ] `src/server.ts` — wrapped with `paraglideMiddleware`
- [ ] `src/router.tsx` — `rewrite: { input, output }` added using
      `deLocalizeUrl`/`localizeUrl`
- [ ] `not-found.tsx` / `default-catch-boundary.tsx` wrappers use `shared_not_found_*`
      / `shared_error_boundary_*` message keys, not English defaults
- [ ] Nav wrapper wires `GitHubLink` + `LocaleSwitcher` with `shared_github_profile_aria`
      / `shared_locale_switch_aria`
- [ ] `build` script compiles Paraglide before `vite build`
- [ ] `@repo/e2e-utils` added as devDependency; `playwright.config.ts` webServer runs
      `build && preview`, never `dev` (locale switching silently no-ops in dev mode)
- [ ] Ran `npx paraglide-js compile --project ../../packages/i18n/project.inlang --outdir ./src/lib/paraglide` once manually before first `dev`/`build`

## Checklist

- [ ] Unique port assigned and recorded in this file (Step 1)
- [ ] All files created (Steps 2–13)
- [ ] `@repo/ui` in dependencies as `workspace:*`
- [ ] `not-found.tsx` / `default-catch-boundary.tsx` wrappers created and wired into `__root.tsx` (Step 12)
- [ ] wrangler `name` matches the desired Cloudflare Worker name
- [ ] `pnpm install` run at repo root
- [ ] App starts with `pnpm dev --filter <name>`
- [ ] If i18n needed: complete Step 15 (`.claude/skills/paraglide-i18n.md`)
