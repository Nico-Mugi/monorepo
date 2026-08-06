# Registry Showcase

Live, interactive showcase of the components published in `@repo/registry`,
a shadcn-compatible registry generated from `@repo/ui`. Each entry renders a
working demo alongside its `shadcn add` install command.

[Live site](https://registry.playground.nicolas-thouvenin.dev)

## Tech stack

- **Framework**: TanStack Start (React 19, SSR on Cloudflare Workers)
- **Routing**: File-based TanStack Router
- **Styling**: Tailwind CSS v4 + `@repo/ui`
- **Registry data**: `@repo/registry` (`registry.json`, synced from `@repo/ui`)
- **i18n**: Paraglide JS (`fr` base locale, `en` second)
- **Tests**: Playwright E2E
- **Deploy**: Cloudflare Workers via Wrangler

## Getting started

This app lives in the [monorepo](../../); run commands from the repo root or from this directory.

### Bootstrap (first run only)

Paraglide output is gitignored and must be generated before the first dev server start:

```bash
pnpm exec paraglide-js compile --project ../../packages/i18n/project.inlang --outdir ./src/lib/paraglide
```

### Development

```bash
pnpm dev --filter registry-showcase   # http://localhost:3003
```

### Build & preview

Build also syncs `@repo/registry` from `@repo/ui` before compiling:

```bash
pnpm build --filter registry-showcase
pnpm preview      # serves production build on port 3003
```

### Deploy

```bash
pnpm deploy --filter registry-showcase
```

### Tests

Playwright tests require the **production build**: do not test against `pnpm dev`.

```bash
pnpm build --filter registry-showcase && pnpm preview   # in one terminal
pnpm test --filter registry-showcase                    # in another
```

## Project structure

```
src/
├── components/       # Nav, error/not-found boundaries
├── routes/           # TanStack Router file-based routes: demo registry per component
├── lib/paraglide/     # Generated i18n runtime (gitignored)
└── tests/e2e/         # Playwright test suites
```
