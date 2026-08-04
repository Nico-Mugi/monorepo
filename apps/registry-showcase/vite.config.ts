import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  server: { port: 3003, host: true },
  resolve: { tsconfigPaths: true },
  publicDir: "../../packages/registry/public",
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" }, inspectorPort: 9233 }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
});
