// Precompiles Tailwind CSS for `CvDocument` ahead of time, so the Cloudflare
// Worker's live-PDF server function (src/server/generate-cv-pdf.tsx) never
// has to import `@tailwindcss/node` at request time — that package loads a
// native binary, which cannot run inside a Workers V8 isolate. Run as part
// of `dev`/`build` (see package.json) so the output can't go stale.
import { createServer } from "vite";
import react from "@vitejs/plugin-react";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createElement } from "react";
import { compileTailwindCssForElement } from "react-tailwind-to-pdf/compile";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const server = await createServer({
  configFile: false,
  root,
  resolve: {
    alias: { "~": path.resolve(root, "src") },
  },
  plugins: [react()],
  logLevel: "warn",
});

try {
  const { CvDocument } = await server.ssrLoadModule(
    path.resolve(root, "src/components/cv/cv-document.tsx"),
  );

  const css = await compileTailwindCssForElement(
    `@import "tailwindcss";`,
    createElement(CvDocument),
  );

  const outDir = path.resolve(root, "src/server");
  mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "cv-pdf.generated.css");
  writeFileSync(outFile, css);
  console.log(
    `[compile-cv-pdf-css] wrote ${css.length} bytes to src/server/cv-pdf.generated.css`,
  );
} finally {
  await server.close();
}
