# @repo/ui

Shared React component library for every app in this monorepo — exported from
source (`.tsx`), no separate build step. Consumers import directly from
`src/` via each app's bundler.

## Install

Already wired up via pnpm workspaces — add it to an app's `package.json`:

```json
{ "dependencies": { "@repo/ui": "workspace:*" } }
```

## Exports

| Path | What it resolves to |
| --- | --- |
| `@repo/ui` | Barrel export — components, types, and utils re-exported from `src/index.ts` |
| `@repo/ui/components/*` | Individual component modules, e.g. `@repo/ui/components/button` |
| `@repo/ui/utils/*` | Individual util modules, e.g. `@repo/ui/utils/cn` |
| `@repo/ui/styles/*` | Design tokens and global CSS, e.g. `@repo/ui/styles/theme.css` |

## What's in here

- **Components** (`src/components/`) — `Button`, `Field`/`TextField`/`ColorField`,
  `Input`, `Label`, `Separator`, `Collapsible`, `CopyButton`, `Nav`, `LocaleSwitcher`,
  `AppLogo`/`LogoMark`, `GitHubLink`, `DefaultCatchBoundary`, `NotFound`, and more
- **Utils** (`src/utils/`) — `cn` (class merging), `seo` (route `head()` metadata helper)
- **Styles** (`src/styles/theme.css`) — the shared design system: colors, radius, fonts,
  Tailwind v4 `@theme` tokens. See `.claude/skills/design-system.md` at the repo root
  before adding new tokens or styling something outside this package.

## Conventions

- Peer deps (`react`, `react-dom`, `@tanstack/react-router`, `@tanstack/react-form`)
  are not bundled — every consumer must already have them installed.
- Components favor composition over configuration — see `Field`/`FieldLabel`/
  `FieldDescription` for the pattern used by form components.
- New components: add the file under `src/components/`, export it from
  `src/index.ts`, and (if it belongs in the public showcase) register it in
  `packages/registry` — see that package's README for the sync step.

## Commands

```bash
pnpm type-check --filter @repo/ui
```
