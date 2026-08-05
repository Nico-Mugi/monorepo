import { defineConfig, devices } from "@playwright/test";

/*
These tests hit the real deployed apps on nicolas-thouvenin.dev and its
subdomains, not a local build. There is no webServer here on purpose — the
point is to verify behavior (like cookies actually crossing subdomains) that
only exists once things are deployed to their real hostnames. Run manually
after a deploy: `pnpm --filter @repo/e2e-prod test:prod`.
*/
export default defineConfig({
  testDir: "./src/tests",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  use: {
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
