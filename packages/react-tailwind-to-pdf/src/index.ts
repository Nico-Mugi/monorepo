import { renderToStaticMarkup } from "react-dom/server";
import { compileTailwindCss } from "./tailwind";
import { renderHtmlToPdf } from "./render-to-pdf";
import type { RenderToPdfOptions } from "./types";

export type {
  PdfBrowser,
  PdfPage,
  PdfOptions,
  RenderToPdfOptions,
} from "./types";

/**
 * Render a Tailwind-styled React element to a PDF using a Playwright-
 * compatible browser. `css` is Tailwind v4 entry source (e.g. `@import
 * "tailwindcss"; @theme { ... }`) — the same content you'd point a Tailwind
 * build at — and is JIT-compiled via `@tailwindcss/node`, scoped to exactly
 * the classes the rendered element uses.
 *
 * This needs a real Node.js process: `@tailwindcss/node` loads a native
 * binary (`@tailwindcss/oxide`), which cannot run in a V8-isolate runtime
 * like Cloudflare Workers or Vercel Edge. For those, use a platform adapter
 * (e.g. `react-tailwind-to-pdf/cloudflare`) with CSS compiled ahead of time
 * — see `react-tailwind-to-pdf/compile`.
 *
 * The caller owns the browser's lifecycle (launch it before calling this,
 * close it after) — this only opens/closes a page.
 */
export async function renderToPdf(
  options: RenderToPdfOptions,
): Promise<Uint8Array> {
  const markup = renderToStaticMarkup(options.element);
  const css = await compileTailwindCss(options.css, markup);
  return renderHtmlToPdf({ ...options, markup, css });
}
