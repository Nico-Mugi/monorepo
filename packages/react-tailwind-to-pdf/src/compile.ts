import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { compileTailwindCss } from "./tailwind";

/**
 * Node-only, build-time helper: JIT-compiles Tailwind v4 `entryCss` against
 * exactly the classes `element` renders with, and returns the resulting CSS
 * text. Meant to be run once, ahead of time, in a normal Node build step —
 * not inside a request handler.
 *
 * This is how you get compiled CSS for `react-tailwind-to-pdf/cloudflare`
 * (or any other V8-isolate runtime): run this in your build script, write
 * the result to a file, and import that file's text at request time instead
 * of compiling on the fly. See this package's README for the full pattern.
 */
export async function compileTailwindCssForElement(
  entryCss: string,
  element: ReactElement,
): Promise<string> {
  const markup = renderToStaticMarkup(element);
  return compileTailwindCss(entryCss, markup);
}
