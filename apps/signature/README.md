# Signature

Email signature generator. Fill in a form (name, title, contact details, photo,
logo, accent color), get a live preview, and copy the rendered HTML signature
straight into your email client. Drafts and saved signatures persist locally.

[Live site](https://signature.playground.nicolas-thouvenin.dev)

## Tech stack

- **Framework**: TanStack Start (React 19, SSR on Cloudflare Workers)
- **Routing**: File-based TanStack Router
- **Forms**: TanStack Form + Zod schema (`src/lib/schema.ts`)
- **Styling**: Tailwind CSS v4 + `@repo/ui`
- **i18n**: Paraglide JS — `fr` base locale, `en` second
- **Tests**: Playwright E2E
- **Deploy**: Cloudflare Workers via Wrangler

## Getting started

This app lives in the [monorepo](../../) — run commands from the repo root or from this directory.

### Bootstrap (first run only)

Paraglide output is gitignored and must be generated before the first dev server start:

```bash
pnpm exec paraglide-js compile --project ../../packages/i18n/project.inlang --outdir ./src/lib/paraglide
```

### Development

```bash
pnpm dev --filter signature   # http://localhost:3004
```

### Build & preview

```bash
pnpm build --filter signature
pnpm preview      # serves production build on port 3004
```

### Deploy

```bash
pnpm deploy --filter signature
```

### Tests

Playwright tests require the **production build** — do not test against `pnpm dev`.

```bash
pnpm build --filter signature && pnpm preview   # in one terminal
pnpm test --filter signature                    # in another
```

## Project structure

```
src/
├── components/
│   ├── signature-form.tsx   # Form fields (name, title, contact, photo/logo, color)
│   └── ...                  # Nav, error/not-found boundaries
├── routes/                  # TanStack Router file-based routes
├── lib/
│   ├── schema.ts             # Zod schema + default form values
│   ├── render-signature.tsx  # Signature HTML renderer
│   ├── use-signature-storage.ts  # Local draft + history persistence
│   └── paraglide/             # Generated i18n runtime (gitignored)
└── tests/e2e/                # Playwright test suites
```
