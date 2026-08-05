import { buildHtmlDocument } from "./render";
import type { RenderHtmlToPdfOptions } from "./types";

/**
 * Wrap already-rendered markup + CSS into a document and print it via a
 * Playwright-compatible browser. No React, no Tailwind — the shared
 * primitive both `.` (JIT-compiles CSS) and `./cloudflare` (expects
 * precompiled CSS) build on.
 */
export async function renderHtmlToPdf(
  options: RenderHtmlToPdfOptions,
): Promise<Uint8Array> {
  const html = buildHtmlDocument({
    markup: options.markup,
    css: options.css,
    head: options.head,
    baseUrl: options.baseUrl,
  });

  const page = await options.browser.newPage();
  try {
    await page.setContent(html, {
      waitUntil: options.waitUntil ?? "networkidle",
    });
    return await page.pdf({ printBackground: true, ...options.pdf });
  } finally {
    await page.close();
  }
}
