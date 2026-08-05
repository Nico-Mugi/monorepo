import type { ReactElement } from "react";

/**
 * Options this package forwards to `page.pdf()`. A hand-picked subset of
 * Playwright's real `PagePDFOptions` rather than importing the type, so the
 * core has no dependency on `playwright` or `@cloudflare/playwright`.
 */
export interface PdfOptions {
  format?: string;
  width?: string | number;
  height?: string | number;
  landscape?: boolean;
  scale?: number;
  printBackground?: boolean;
  preferCSSPageSize?: boolean;
  margin?: {
    top?: string | number;
    bottom?: string | number;
    left?: string | number;
    right?: string | number;
  };
}

/** The minimal `Page` surface this package needs — satisfied by both `playwright` and `@cloudflare/playwright`. */
export interface PdfPage {
  setContent(
    html: string,
    options?: { waitUntil?: "load" | "domcontentloaded" | "networkidle" },
  ): Promise<void>;
  pdf(options?: PdfOptions): Promise<Uint8Array>;
  close(): Promise<void>;
}

/** The minimal `Browser` surface this package needs. */
export interface PdfBrowser {
  newPage(): Promise<PdfPage>;
}

interface RenderToPdfSharedOptions {
  /**
   * A connected, Playwright-compatible browser. Callers own its lifecycle
   * (launch before, close after) — this function only opens/closes a page.
   */
  browser: PdfBrowser;
  /** CSS to inline into the document's `<style>` tag. See the specific entry point (`.` vs `./cloudflare`) for whether this is compiled for you or must already be final. */
  css: string;
  /** Extra markup injected into `<head>` — fonts, meta tags, extra `<style>`. */
  head?: string;
  /**
   * Origin (or full URL) to resolve relative asset URLs against, e.g.
   * `https://example.com`. `setContent()` never navigates anywhere, so
   * without this a root-relative `<img src="/photo.png">` has no origin to
   * resolve against and silently fails to load. Injected as `<base href>`.
   */
  baseUrl?: string;
  /** How long to wait after `setContent` before printing. Defaults to `"networkidle"` so external font/asset requests in `head` have time to resolve. */
  waitUntil?: "load" | "domcontentloaded" | "networkidle";
  /** Forwarded to `page.pdf()`. `printBackground` defaults to `true`. */
  pdf?: PdfOptions;
}

export interface RenderToPdfOptions extends RenderToPdfSharedOptions {
  /** The component to render, already given whatever props/data it needs. */
  element: ReactElement;
}

/** Like {@link RenderToPdfOptions}, but for already-rendered HTML — used by entry points that don't compile CSS themselves. */
export interface RenderHtmlToPdfOptions extends RenderToPdfSharedOptions {
  /** Already-rendered markup, e.g. from `renderToStaticMarkup`. */
  markup: string;
}
