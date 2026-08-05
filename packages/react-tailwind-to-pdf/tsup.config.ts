import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/cloudflare.ts", "src/compile.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  platform: "node",
});
