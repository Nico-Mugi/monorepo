import { test, expect } from "@playwright/test";
import { localeOption, expectHtmlLang } from "@repo/e2e-utils";

const PORTFOLIO = "https://nicolas-thouvenin.dev";
const PLAYGROUND = "https://playground.nicolas-thouvenin.dev";
const REGISTRY = "https://registry.playground.nicolas-thouvenin.dev";
const COOKIE_DOMAIN = ".nicolas-thouvenin.dev";

test("PARAGLIDE_LOCALE cookie is shared across nicolas-thouvenin.dev subdomains in prod", async ({
  page,
  context,
}) => {
  // 1. Start on portfolio, default locale (fr), switch to English via the switcher
  await page.goto(`${PORTFOLIO}/fr`);
  await expectHtmlLang(page, "fr");

  await localeOption(page, "en").click();
  await page.waitForURL(/\/en/);
  await expectHtmlLang(page, "en");

  // 2. The cookie must carry the shared domain, not the exact host that set it
  let cookies = await context.cookies();
  let localeCookie = cookies.find((c) => c.name === "PARAGLIDE_LOCALE");
  expect(localeCookie?.value).toBe("en");
  expect(localeCookie?.domain).toBe(COOKIE_DOMAIN);

  // 3. Playground root with no locale in the URL should pick up portfolio's
  // cookie via the "cookie" strategy (ahead of preferredLanguage) and land on /en
  await page.goto(`${PLAYGROUND}/`);
  await page.waitForURL(/\/en$/);
  await expectHtmlLang(page, "en");
  await expect(
    page.getByText("living side by side in one pnpm monorepo"),
  ).toBeVisible();

  // 4. Same for registry-showcase
  await page.goto(`${REGISTRY}/`);
  await page.waitForURL(/\/en$/);
  await expectHtmlLang(page, "en");
  await expect(page.getByText("live showcase of every component")).toBeVisible();

  // 5. Switch back to French from registry-showcase's switcher; the cookie
  // update should be visible to every app on the shared domain
  await localeOption(page, "fr").click();
  await page.waitForURL(/\/fr/);

  cookies = await context.cookies();
  localeCookie = cookies.find((c) => c.name === "PARAGLIDE_LOCALE");
  expect(localeCookie?.value).toBe("fr");
  expect(localeCookie?.domain).toBe(COOKIE_DOMAIN);

  // NOTE: intentionally not asserting a redirect on PORTFOLIO's bare "/" here.
  // That path is served as a cached static asset by Cloudflare and never
  // reaches the Worker/paraglideMiddleware, so it can't react to the cookie —
  // a separate, pre-existing issue unrelated to cross-domain cookie sharing.
});
