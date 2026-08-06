import { defineConfig, devices } from "@playwright/test";

/*
Tests run against the production build, not the dev server.

WHY: In dev mode (`vite dev`), TanStack Router handles all in-app navigation as a SPA. When Paraglide's setLocale() calls `window.location.href = "/en"`, TanStack Router intercepts it, strips the locale prefix via its `rewrite.input` function, and re-adds the CURRENT locale via `rewrite.output` — routing back to the same locale URL instead of the target one.

In the production build, each locale URL (`/fr`, `/en`) is served by the real request handler. `setLocale()` triggers a real full-page browser reload to the new URL, bypassing TanStack Router's client-side interception.

*/
export default defineConfig({
  testDir: "./src/tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  /* Uncapped local worker counts can overwhelm the single Cloudflare Workers preview server (connection resets under load); 4 is safe headroom under that. */
  workers: process.env.CI ? 1 : 4,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3003",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  webServer: {
    command: "pnpm run build && pnpm run preview",
    url: "http://localhost:3003",
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
});
