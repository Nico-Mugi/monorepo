import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { translatedPathnames } from "./src/utils/translated-pathnames";
import { prerenderRoutes } from "./src/utils/prerender";
import printToPdf from "vite-plugin-print-to-pdf";

const config = defineConfig({
  server: {
    port: 3000,
    host: true,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/lib/paraglide",
      outputStructure: "message-modules",
      cookieName: "PARAGLIDE_LOCALE",
      strategy: ["url", "cookie", "preferredLanguage", "baseLocale"],
      urlPatterns: translatedPathnames,
    }),
    printToPdf({
      // Optional: ignore node_modules or generated files
      filter: (f) =>
        !f.includes("node_modules") &&
        !f.includes("dist") &&
        !f.includes("build") &&
        !f.includes("public/files") &&
        !f.includes("src/lib/paraglide"),
      pages: [
        {
          url: "/fr/cv",
          outPath: "./public/files/Nicolas_Thouvenin_CV.pdf",
          watchFile: "src/routes/cv.tsx",
          pdf: {
            format: "A4",
            printBackground: true,
            margin: {
              top: "0mm",
              bottom: "0mm",
              left: "0mm",
              right: "0mm",
            },
          },
        },
        {
          url: "/en/resume",
          outPath: "./public/files/Nicolas_Thouvenin_Resume.pdf",
          watchFile: "src/routes/cv.tsx",
          pdf: {
            format: "A4",
            printBackground: true,
            margin: {
              top: "0mm",
              bottom: "0mm",
              left: "0mm",
              right: "0mm",
            },
          },
        },
      ],
    }),
    cloudflare({ viteEnvironment: { name: "ssr" }, inspectorPort: 9229 }),
    tailwindcss(),
    tanstackStart({
      pages: prerenderRoutes,
      prerender: {
        filter: ({ path }) => !path.startsWith("/files"), // don't prerender the PDF files
      },
    }),
    // react's vite plugin must come after start's vite plugin
    viteReact(),
  ],
});

export default config;
