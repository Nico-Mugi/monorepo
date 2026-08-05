import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { translatedPathnames } from "./src/utils/translated-pathnames.ts";

export default defineConfig({
  server: {
    port: 3002,
    host: true,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    paraglideVitePlugin({
      project: "../../packages/i18n/project.inlang",
      outdir: "./src/lib/paraglide",
      outputStructure: "message-modules",
      cookieName: "PARAGLIDE_LOCALE",
      strategy: ["url", "cookie", "preferredLanguage", "baseLocale"],
      urlPatterns: translatedPathnames,
    }),
    cloudflare({ viteEnvironment: { name: "ssr" }, inspectorPort: 9231 }),
    tailwindcss(),
    tanstackStart(),
    // react's vite plugin must come after start's vite plugin
    viteReact(),
  ],
});
