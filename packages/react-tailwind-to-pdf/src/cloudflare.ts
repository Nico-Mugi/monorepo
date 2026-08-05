import { launch } from "@cloudflare/playwright";
import { renderToStaticMarkup } from "react-dom/server";
import { renderHtmlToPdf } from "./render-to-pdf";
import type { RenderToPdfOptions } from "./types";

/**
 * Cloudflare Browser Rendering adapter. Launches a browser against the
 * `browser` binding for the duration of the call and closes it afterward —
 * pass the binding from `env` (see the `browser` key in wrangler.jsonc).
 *
 * Unlike the `.` entry point, `css` here must already be final, compiled
 * CSS — this module deliberately never imports `@tailwindcss/node`.
 * `@tailwindcss/node` loads a native binary (`@tailwindcss/oxide`), and
 * Workers' V8 isolates cannot execute native code at all; importing it
 * anywhere in this module's graph is enough to crash the Worker, not just
 * calling it. Compile your CSS ahead of time (e.g. via
 * `react-tailwind-to-pdf/compile`, run in a normal Node build step) and
 * pass the result here.
 *
 * For high-volume use, consider `@cloudflare/playwright`'s `acquire`/
 * `connect` session APIs instead and call `renderHtmlToPdf` directly with a
 * reused browser.
 */
export async function renderToPdfOnCloudflare(
  binding: Parameters<typeof launch>[0],
  options: Omit<RenderToPdfOptions, "browser">,
): Promise<Uint8Array> {
  const browser = await launch(binding);
  try {
    const markup = renderToStaticMarkup(options.element);
    return await renderHtmlToPdf({ ...options, markup, browser });
  } finally {
    await browser.close();
  }
}
