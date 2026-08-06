# Portfolio: Nicolas Thouvenin

Personal portfolio showcasing work, skills, and experience. Fully bilingual (FR/EN), deployed globally on Cloudflare Workers.

[Live site](https://nicolas-thouvenin.dev)

## Tech stack

- **Framework**: TanStack Start (React 19, SSR on Cloudflare Workers)
- **Routing**: File-based TanStack Router
- **Styling**: Tailwind CSS v4 + shadcn (CVA + clsx + tw-merge)
- **i18n**: Paraglide JS (`fr` base locale, `en` second)
- **Tests**: Playwright E2E
- **Deploy**: Cloudflare Workers via Wrangler

## Getting started

This app lives in the [monorepo](../../); run commands from the repo root or from this directory.

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- See [install skill](../../packages/private/.claude/skills/install.md) for full machine setup

### Bootstrap (first run only)

Paraglide output is gitignored and must be generated before the first dev server start:

```bash
pnpm exec paraglide-js compile --project ../../packages/i18n/project.inlang --outdir ./src/lib/paraglide
```

### Development

```bash
# From repo root (runs all apps):
pnpm dev

# Or this app only:
pnpm dev --filter portfolio
```

### Build & preview

```bash
pnpm build
pnpm preview      # serves production build on port 3001
```

### Deploy

```bash
pnpm deploy
```

### Tests

Playwright tests require the **production build**: do not test against `pnpm dev`.

```bash
pnpm build && pnpm preview   # in one terminal
pnpm test                    # in another
pnpm test:ui                 # interactive mode
```

## Project structure

```
src/
├── components/
│   ├── portfolio/    # Hero, skills, experience, education, contact
│   ├── cv/           # Printable CV components
│   └── shadcn/       # UI primitives (also see packages/ui)
├── routes/           # TanStack Router file-based routes
├── lib/paraglide/    # Generated i18n runtime (gitignored)
└── tests/e2e/        # Playwright test suites
messages/             # fr.json / en.json translation sources
public/files/         # PDFs (CV, resume)
```

## Contact

- [nicolas-thouvenin.dev](https://nicolas-thouvenin.dev)
- nico.thouvenin13@gmail.com
- [@Nico-Mugi](https://github.com/Nico-Mugi)
