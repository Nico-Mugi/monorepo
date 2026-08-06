# monorepo

Personal monorepo for nicolas-thouvenin.dev and related apps/packages, managed with pnpm workspaces and Turborepo.

## Structure

```
monorepo/
├── apps/
│   ├── portfolio/          # nicolas-thouvenin.dev: TanStack Start + Cloudflare Workers
│   ├── playground/         # playground.nicolas-thouvenin.dev: TanStack Start + Cloudflare Workers
│   ├── registry-showcase/  # registry.playground.nicolas-thouvenin.dev: live showcase of @repo/registry components
│   ├── signature/          # signature.playground.nicolas-thouvenin.dev: TanStack Start app built on @repo/ui form components
│   └── [private apps]      # gitignored, each has its own private GitHub repo
├── packages/
│   ├── ui/                     # @repo/ui: shared React component library (source exports)
│   ├── registry/                # @repo/registry: shadcn registry data
│   ├── i18n/                    # shared inlang/Paraglide translation project
│   ├── e2e-utils/                # @repo/e2e-utils: shared Playwright test helpers
│   ├── e2e-prod/                 # @repo/e2e-prod: production smoke tests
│   ├── react-tailwind-to-pdf/    # render a React + Tailwind component to PDF via Playwright
│   ├── vite-print-to-pdf/        # Vite dev-server plugin that re-exports routes to PDF on change
│   └── private/                  # gitignored: private skills, memory, sensitive config (own private GitHub repo)
├── pnpm-workspace.yaml
├── package.json           # workspace root (turbo scripts, shared devDeps)
├── turbo.json             # task pipeline
└── tsconfig.base.json     # base TS config extended by all packages/apps
```

## Apps

| App | URL | Filter |
| --- | --- | --- |
| portfolio | [nicolas-thouvenin.dev](https://nicolas-thouvenin.dev) | `--filter portfolio` |
| playground | [playground.nicolas-thouvenin.dev](https://playground.nicolas-thouvenin.dev) | `--filter playground` |
| registry-showcase | [registry.playground.nicolas-thouvenin.dev](https://registry.playground.nicolas-thouvenin.dev) | `--filter registry-showcase` |
| signature | [signature.playground.nicolas-thouvenin.dev](https://signature.playground.nicolas-thouvenin.dev) | `--filter signature` |

## Package manager & task runner

- **pnpm** workspaces: use `pnpm` commands from the root to run tasks across all packages/apps, or filter to a single package/app
- **Turborepo**: run tasks from the root; Turbo handles build order (e.g. `packages/ui` builds before any `apps/*` that depend on it)

## Commands

| Command                          | What it does                                              |
| -------------------------------- | --------------------------------------------------------- |
| `pnpm install`                   | Install all dependencies (run after adding a new package) |
| `pnpm dev`                       | Start all apps in dev mode (turbo parallel)               |
| `pnpm dev --filter portfolio`    | Dev mode for a single app                                 |
| `pnpm build`                     | Build all packages and apps in dependency order           |
| `pnpm build --filter playground` | Build a single app (auto-builds its workspace deps first) |
| `pnpm deploy --filter portfolio` | Deploy an app to Cloudflare                               |
| `pnpm test`                      | Run tests across the workspace                            |
| `pnpm type-check`                | Type-check all packages                                   |
| `pnpm clean`                     | Clean build artifacts and node_modules                    |
| `pnpm kill-dev`                  | Force-kill leftover Vite/Wrangler dev-server processes    |

## Stack

All apps share:

- TanStack Start for routing + SSR
- Cloudflare Workers as the runtime (via `@cloudflare/vite-plugin`)
- Tailwind CSS v4 (config lives in CSS via `@import`, no `tailwind.config`)
- `@repo/ui` as the shared component library and design system
- TypeScript strict mode
