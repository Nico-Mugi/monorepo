import { defineConfig, devices } from "@playwright/test";

/*
Tests run against the production build, not the dev server.

WHY: In dev mode (`vite dev`), TanStack Router handles all in-app navigation as a SPA. When Paraglide's setLocale() calls `window.location.href = "/en"`, TanStack Router intercepts it, strips the locale prefix via its `rewrite.input` function, and re-adds the CURRENT locale via `rewrite.output` — routing back to the same locale URL instead of the target one.

In the production build, each locale URL (`/fr`, `/en`, `/en/resume`, etc.) is a prerendered static file. `setLocale()` triggers a real full-page browser reload to the new URL, bypassing TanStack Router's client-side interception.

*/
export default defineConfig({
  testDir: "./src/tests/e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  /* Uncapped local worker counts can overwhelm the single Cloudflare Workers preview server (connection resets under load); 4 is safe headroom under that. */
  workers: process.env.CI ? 1 : 4,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: "http://localhost:3005",
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  /* Firefox/webkit only run in CI (see .github/workflows/test.yml) — chromium
     alone locally keeps a test run from spinning up 3x the browser processes. */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    ...(process.env.CI
      ? [
          {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
          },
          {
            name: "webkit",
            use: { ...devices["Desktop Safari"] },
          },
        ]
      : []),
  ],

  webServer: {
    command: "npm run build && npm run preview",
    url: "http://localhost:3005",
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
});
