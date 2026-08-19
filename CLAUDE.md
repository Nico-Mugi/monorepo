# Monorepo — Claude Code context

## Memory

All memory lives in `packages/private/.claude/memory/` (private GitHub repo, gitignored here).
At the start of every session:
1. Check if `packages/private/` exists
2. If yes → read `packages/private/.claude/memory/MEMORY.md`
3. If no → the private package hasn't been cloned yet on this machine (see below)

## Structure

```
monorepo/
├── apps/
│   ├── portfolio/          # nicolas-thouvenin.dev — TanStack Start + CF Workers
│   ├── playground/         # playground.nicolas-thouvenin.dev — TanStack Start + CF Workers
│   ├── registry-showcase/  # registry.playground.nicolas-thouvenin.dev — live showcase of @repo/registry components
│   ├── calendar/           # public app
│   ├── signature/          # public app
│   ├── html-in-canvas/     # public app — experimental HTML-in-canvas playground
│   └── [private apps]      # gitignored, each own private GitHub repo — currently books, facturation,
│                            # logs, ocr, parlor, sign (see .gitignore)
├── packages/
│   ├── ui/               # @repo/ui — shared React component library (source exports)
│   ├── registry/         # @repo/registry — shadcn registry data
│   ├── i18n/             # shared Paraglide message source (fr/en); no package.json — apps compile
│   │                     #   it directly by path (see .claude/skills/paraglide-i18n.md)
│   ├── logger/           # @repo/logger — shared logging, used by every app
│   ├── e2e-utils/        # @repo/e2e-utils — shared Playwright test helpers, used by every app
│   ├── e2e-prod/         # @repo/e2e-prod — prod smoke tests across apps
│   ├── react-tailwind-to-pdf/  # Tailwind v4 React → PDF via Playwright (used by facturation)
│   ├── vite-print-to-pdf/      # vite-plugin-print-to-pdf — dev-server PDF export plugin (used by portfolio)
│   ├── db/               # gitignored — @repo/db, better-auth D1 schema, own private GitHub repo
│   └── private/          # gitignored — private skills, memory, sensitive config (own private GitHub repo)
├── pnpm-workspace.yaml
├── package.json          # workspace root (turbo scripts, shared devDeps)
├── turbo.json            # task pipeline
└── tsconfig.base.json    # base TS config extended by all packages/apps
```

## Package manager & task runner

- **pnpm** workspaces — use `pnpm` everywhere, never `npm` or `yarn` in this repo
- **Turborepo** — run tasks from the root via `pnpm build`, `pnpm dev`, etc.
- Turbo handles build order: `packages/ui` builds before any `apps/*` that depend on it

## Internal packages

| Package | Import as | What it is |
|---|---|---|
| `packages/ui` | `@repo/ui` | Shared React components, exported from source `.tsx` (no separate build step) |
| `packages/registry` | `@repo/registry` | shadcn registry JSON definitions, served via playground |
| `packages/logger` | `@repo/logger` | Shared logging, used by every app |
| `packages/e2e-utils` | `@repo/e2e-utils` | Shared Playwright test helpers, used by every app |
| `packages/e2e-prod` | `@repo/e2e-prod` | Prod smoke tests that run across apps |
| `packages/db` | `@repo/db` (gitignored) | better-auth D1 schema — see `.claude/skills/better-auth-d1.md` |

Reference internal packages in `package.json` as `"@repo/ui": "workspace:*"`.

`packages/i18n` is not imported as a package (no `package.json`) — every app compiles it
directly by relative path in its `build` script. See `.claude/skills/paraglide-i18n.md`.

## TypeScript conventions

- All `tsconfig.json` files extend `../../tsconfig.base.json` (from the app/package directory)
- Base config handles: `strict`, `moduleResolution: bundler`, `jsx: react-jsx`, `ES2024`
- Each app overrides: `paths` (`~/*`), `types`, app-specific strictness flags

## Private apps (closed source)

Some apps live in `apps/` locally but are gitignored from this repo. Each has its own
private GitHub repo. The workflow:

1. Create the app following `.claude/skills/add-app.md`
2. `git init` inside `apps/<name>/`, push to a new private GitHub repo
3. Add `apps/<name>/` to the root `.gitignore`
4. On another machine: clone the private repo into the right path — `git clone git@github.com:Nico-Mugi/<name>.git apps/<name>`

Private apps still get `"@repo/ui": "workspace:*"` and participate in pnpm workspaces
normally — pnpm doesn't care that the directory is gitignored from the parent.

See `packages/private/.claude/skills/add-private-app.md` for the full checklist.

`packages/db` (`@repo/db`) is gitignored the same way — it holds the shared better-auth
D1 schema used by private apps that need auth. Clone it the same way:
`git clone git@github.com:Nico-Mugi/db.git packages/db`.

## Adding a new app

See `.claude/skills/add-app.md` — it's a manual skill covering the full checklist.

Short version:
1. Create `apps/<name>/` with package.json (`name: "<name>"`), tsconfig.json (extends `../../tsconfig.base.json`), vite.config.ts, wrangler.jsonc, src/routes/__root.tsx + index.tsx
2. Add `"@repo/ui": "workspace:*"` to dependencies
3. Set a unique dev/preview port — check `grep -h "preview.*--port" apps/*/package.json` for
   the highest one in use (as of writing, ports run 3001–3012) and pick the next free one
4. Run `pnpm install` at the repo root to link workspace packages
5. Add a project card for the new app on the Playground homepage —
   see `.claude/skills/update-playground-showcase.md`

## All apps share

- TanStack Start for routing + SSR
- Cloudflare Workers as the runtime (via @cloudflare/vite-plugin)
- Tailwind CSS v4 (no tailwind.config — config is in CSS via @import)
- `@repo/ui` as shared component library
- `@repo/logger`
- TypeScript strict mode
- One design system (colors, radius, fonts) from `@repo/ui/styles/theme.css` — see
  `.claude/skills/design-system.md` for the token vocabulary and rules before styling
  anything in `apps/*`

Common but not universal — check the target app before assuming:
- **Paraglide i18n**, compiled per app from the shared `packages/i18n` message source
  (fr/en) — see `.claude/skills/paraglide-i18n.md` for the four integration points a
  localized app needs. A few single-locale internal tools (as of writing: `facturation`,
  `logs`, `ocr`, `sign`) deliberately skip it and hardcode `<html lang="...">` instead.
- **Playwright + `@repo/e2e-utils`** — most apps have both; `logs` and `ocr` have neither
  (no e2e coverage at all).

Opt-in per app (not shared by default): PWA support (`.claude/skills/pwa.md`) and
better-auth + D1 (`.claude/skills/better-auth-d1.md`).

## Useful root-level commands

| Command | What it does |
|---|---|
| `pnpm dev` | Start all apps in dev mode (turbo parallel) |
| `pnpm dev --filter portfolio` | Dev mode for portfolio only |
| `pnpm build` | Build all packages and apps in dependency order |
| `pnpm build --filter playground` | Build playground only (auto-builds @repo/ui first) |
| `pnpm deploy --filter portfolio` | Deploy portfolio to Cloudflare |
| `pnpm type-check` | Type-check all packages |
| `pnpm test` | Run all Playwright test suites (turbo, concurrency=2) |
| `pnpm clean` | Clean all build outputs and remove node_modules |
| `pnpm install` | Install all dependencies (run after adding a new package) |
| `pnpm kill-dev` | Force-kill any leftover Vite/Wrangler dev-server processes for this repo |

## Dev server cleanup (Claude Code)

Backgrounded `vite dev` processes (e.g. `pnpm dev`, `pnpm dev --filter <app>`) can survive
their parent shell being stopped — the tool that stops a background task does not reliably
kill the underlying Vite child process. A leftover process keeps holding its dev port and
Cloudflare inspector port, and the next `pnpm dev` fails with `EADDRINUSE`.

Whenever you (Claude Code) start a dev server in the background to verify a change, run
`pnpm kill-dev` once you're done with it — don't leave it running, and don't rely on the
background-stop tool alone. See `scripts/kill-dev-servers.ps1` for what it does.
