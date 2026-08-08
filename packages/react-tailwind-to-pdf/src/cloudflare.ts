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
 *
 * KNOWN ISSUE (confirmed 2026-08-08 against a real deployed Worker, not just
 * local dev): `launch()`'s `connectOverCDP` call throws `[unenv] fs.mkdtemp
 * is not implemented yet!` in the current Workers Node-compat runtime. This
 * reproduced identically under `wrangler dev` and after a real `wrangler
 * deploy` with the `browser` binding correctly attached, so it isn't a
 * local-only limitation. Neither `compatibility_date` before `2026-03-17`
 * nor the `no_websocket_standard_binary_type` flag (both suggested by
 * `@cloudflare/playwright`'s README for CDP-related issues) fixed it. If you
 * hit this, skip this function and call Browser Rendering's `quickAction`
 * binding method directly instead. It never launches a Playwright session,
 * so it doesn't hit this code path:
 * ```ts
 * const response = await env.MYBROWSER.quickAction("pdf", {
 *   html: buildHtmlDocument({ markup, css }), // from "./render"
 *   pdfOptions: { format: "a4", printBackground: true },
 * });
 * const pdfBytes = new Uint8Array(await response.arrayBuffer());
 * ```
 * See https://developers.cloudflare.com/browser-run/quick-actions/pdf-endpoint/.
 * `apps/facturation/src/lib/server-fns/generate-invoice-pdf.tsx` uses this
 * pattern in production. This function is left as-is rather than rewritten,
 * since `quickAction` doesn't accept a React element or reuse a browser
 * session across calls the way `launch()` does, so picking one as *the*
 * Cloudflare entry point isn't obviously correct without a second real
 * consumer to validate against.
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
