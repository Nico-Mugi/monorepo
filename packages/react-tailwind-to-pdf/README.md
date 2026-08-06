# react-tailwind-to-pdf

Render a React component styled with Tailwind CSS v4 to a PDF, server-side,
via a Playwright-compatible browser. Meant for on-demand exports (a "Download
PDF" button calling a server function), not for a dev-watch workflow: see
`packages/vite-print-to-pdf` for that.

Runtime-agnostic: the underlying primitive takes any object shaped like a
Playwright `Browser` (`newPage()` → a page with `setContent`/`pdf`/`close`).
Bring your own browser. Which entry point you use depends on where CSS gets
compiled: see below.

## Node: `.`

JIT-compiles Tailwind for you via `@tailwindcss/node`, scoped to exactly the
classes the element uses. This needs a real Node.js process: `@tailwindcss/node`
loads a native binary (`@tailwindcss/oxide`), which cannot run in a V8-isolate
runtime (Cloudflare Workers, Vercel Edge, etc.). Merely *importing* it there
is enough to crash, not just calling it.

```ts
import { chromium } from "playwright";
import { renderToPdf } from "react-tailwind-to-pdf";
import { Invoice } from "./Invoice";

const browser = await chromium.launch();
try {
  const pdf = await renderToPdf({
    element: <Invoice total={42} />,
    browser,
    css: `@import "tailwindcss"; @theme { --color-brand: oklch(0.6 0.2 280); }`,
  });
} finally {
  await browser.close();
}
```

## Cloudflare Workers: `./cloudflare`

Requires a `browser` binding (see
[Cloudflare's Browser Rendering docs](https://developers.cloudflare.com/browser-run/)):

```jsonc
// wrangler.jsonc
{ "browser": { "binding": "MYBROWSER" } }
```

This entry point deliberately never imports `@tailwindcss/node`: `css` here
must already be **final, compiled CSS**, not Tailwind source. Compile it ahead
of time with `./compile` (below), in a normal Node build step, and pass the
result in:

```ts
import { renderToPdfOnCloudflare } from "react-tailwind-to-pdf/cloudflare";
import { Invoice } from "./Invoice";
import invoiceCss from "./invoice.generated.css?raw"; // produced by the ./compile step

const pdf = await renderToPdfOnCloudflare(env.MYBROWSER, {
  element: <Invoice total={42} />,
  css: invoiceCss,
});
```

## Precompiling CSS for an edge runtime: `./compile`

Node-only, meant to run once in a build script: not in a request handler.
JIT-compiles the same way `.` does, but just returns the CSS text so you can
write it to a file and ship *that* instead of compiling at request time:

```ts
// scripts/compile-invoice-css.mjs: run as part of your build
import { writeFileSync } from "node:fs";
import { compileTailwindCssForElement } from "react-tailwind-to-pdf/compile";
import { Invoice } from "../src/Invoice";

const css = await compileTailwindCssForElement(
  `@import "tailwindcss"; @theme { --color-brand: oklch(0.6 0.2 280); }`,
  <Invoice total={0} />, // representative props: only the classes used matter
);
writeFileSync("./src/invoice.generated.css", css);
```

Because this only cares about which class names appear in the markup, the
props/data you pass don't need to be real; they just need to exercise every
conditional class your component can render. Wire the script into your normal
build (`prebuild`/before `vite build`/etc.) so it can't go stale.

## How it works

- The element is rendered with `renderToStaticMarkup` (no hydration markers;
  this is print output, not a hydrated page).
- The result is wrapped in a minimal standalone HTML document and handed to
  the browser via `page.setContent()` (no HTTP request), then printed with
  `page.pdf()`.

## Options

| Option | Type | Description |
| --- | --- | --- |
| `element` | `ReactElement` | The component to render. |
| `browser` | `PdfBrowser` | A connected browser. You own launch/close. |
| `css` | `string` | Tailwind source (`.`) or already-compiled CSS (`./cloudflare`). |
| `head` | `string?` | Extra `<head>` markup (fonts, meta, extra `<style>`). |
| `waitUntil` | `"load" \| "domcontentloaded" \| "networkidle"?` | Defaults to `"networkidle"`. |
| `pdf` | `PdfOptions?` | Forwarded to `page.pdf()`. `printBackground` defaults to `true`. |

## Scope

This intentionally does not try to cover every case: no font-loading helper,
no theme presets, no image inlining. Bring exactly the CSS and `head` content
your component needs.
