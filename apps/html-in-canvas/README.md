# HTML in Canvas

A small playground that serializes an editable HTML fragment into an SVG
`foreignObject`, loads it as a data-URI image, and paints that image onto an
HTML5 `<canvas>`. Edit the source, redraw, or export the result as a PNG.

[Live site](https://html-in-canvas.playground.nicolas-thouvenin.dev)

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
pnpm dev --filter html-in-canvas   # http://localhost:3012
```

### Build & preview

```bash
pnpm build --filter html-in-canvas
pnpm preview      # serves production build on port 3012
```

### Deploy

```bash
pnpm deploy --filter html-in-canvas
```

### Tests

Playwright tests require the **production build**: do not test against `pnpm dev`.

```bash
pnpm build --filter html-in-canvas && pnpm preview   # in one terminal
pnpm test --filter html-in-canvas                    # in another
```

## Project structure

```
src/
├── components/       # Nav, error/not-found boundaries, the canvas demo
├── routes/           # TanStack Router file-based routes
├── utils/            # renderHtmlToCanvas: HTML → SVG foreignObject → canvas
├── lib/paraglide/     # Generated i18n runtime (gitignored)
└── tests/e2e/         # Playwright test suites
```

## How the canvas trick works

The demo HTML is wrapped in `<svg><foreignObject>…</foreignObject></svg>`,
encoded as a `data:image/svg+xml` URI, and loaded through an `Image`. Browsers
treat an SVG loaded via `<img>` as a raster resource, so embedded
`<script>` tags never execute, which is what makes rendering user-edited HTML
this way safe without a sanitization pass. Once drawn, the canvas is a flat
bitmap: the rendered text isn't selectable or exposed to assistive
technology, only the `<canvas aria-label>` is.
