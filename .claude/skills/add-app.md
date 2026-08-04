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

@custom-variant dark (&:is(.dark *));
```

`@repo/ui/styles/theme.css` is the shared design system (colors, radius, fonts) — every
app imports it as-is to keep visual identity consistent. Don't duplicate or fork its
tokens in an app's own stylesheet; add app-specific CSS below the imports instead.

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

If the app uses Paraglide i18n, add the `rewrite` option (see portfolio's `router.tsx`).

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

If the app uses Paraglide i18n, wrap with `paraglideMiddleware` (see portfolio's `server.ts`).

## Step 12 — src/routeTree.gen.ts (seed)

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

## Step 13 — Wire up

```bash
pnpm install   # run at repo root to link @repo/ui workspace dependency
pnpm dev --filter <name>   # verify it starts
```

## Checklist

```bash
pnpm install   # run at repo root to link @repo/ui workspace dependency
pnpm dev --filter <name>   # verify it starts
```

## Checklist

- [ ] Unique port assigned and recorded in this file (Step 1)
- [ ] All 11 files created (Steps 2–12)
- [ ] `@repo/ui` in dependencies as `workspace:*`
- [ ] wrangler `name` matches the desired Cloudflare Worker name
- [ ] `pnpm install` run at repo root
- [ ] App starts with `pnpm dev --filter <name>`
- [ ] If i18n needed: wire up Paraglide (see portfolio as reference)
