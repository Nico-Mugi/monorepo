# Playground

Landing hub for everything built in this monorepo: links out to the portfolio,
registry showcase, signature generator, and other apps as they ship, each with
a live preview screenshot and a link to its source.

[Live site](https://playground.nicolas-thouvenin.dev)

## Tech stack

- **Framework**: TanStack Start (React 19, SSR on Cloudflare Workers)
- **Routing**: File-based TanStack Router
- **Styling**: Tailwind CSS v4 + `@repo/ui`
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
pnpm dev --filter playground   # http://localhost:3002
```

### Build & preview

```bash
pnpm build --filter playground
pnpm preview      # serves production build on port 3002
```

### Deploy

```bash
pnpm deploy --filter playground
```

### Tests

Playwright tests require the **production build**: do not test against `pnpm dev`.

```bash
pnpm build --filter playground && pnpm preview   # in one terminal
pnpm test --filter playground                    # in another
```

## Project structure

```
src/
├── components/       # Nav, project cards, error/not-found boundaries
├── routes/           # TanStack Router file-based routes
├── lib/paraglide/     # Generated i18n runtime (gitignored)
└── tests/e2e/         # Playwright test suites
```
