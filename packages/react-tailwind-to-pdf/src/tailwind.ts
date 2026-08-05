import { fileURLToPath } from "node:url";
import path from "node:path";
import { compile, optimize } from "@tailwindcss/node";

// Resolves `@import "tailwindcss"` etc. against this package's own
// node_modules, so callers don't need `tailwindcss` installed themselves —
// they only supply the CSS *text* (their `@theme` customizations included).
const packageDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * Broadly tokenize rendered HTML into candidate Tailwind class names.
 * Over-matching is cheap: `build()` silently discards anything that doesn't
 * parse as a valid utility/variant, so we don't need a precise scanner —
 * just every whitespace-separated token that looks like a class name.
 */
function extractCandidates(html: string): string[] {
  const candidates = new Set<string>();
  const classAttr = /\bclass(?:Name)?="([^"]*)"/g;
  let match: RegExpExecArray | null;
  while ((match = classAttr.exec(html))) {
    for (const token of match[1].split(/\s+/)) {
      if (token) candidates.add(token);
    }
  }
  return [...candidates];
}

/** JIT-compile Tailwind v4 CSS for exactly the classes used in `html`. */
export async function compileTailwindCss(
  entryCss: string,
  html: string,
): Promise<string> {
  const compiler = await compile(entryCss, {
    base: packageDir,
    onDependency: () => {},
  });
  const css = compiler.build(extractCandidates(html));
  return optimize(css, { minify: true }).code;
}
