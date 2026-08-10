import { defineConfig } from "drizzle-kit";

// This schema is applied to the shared `platform-logs` D1 database, bound
// into every app (see each app's wrangler.jsonc) — only one app actually
// owns `migrations_dir` and runs `wrangler d1 migrations apply`, so this
// only ever gets applied once, not once per app deploy.
export default defineConfig({
  dialect: "sqlite",
  schema: "./src/server/schema.ts",
  out: "./migrations",
});
