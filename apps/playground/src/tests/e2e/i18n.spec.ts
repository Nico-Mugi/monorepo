import { test, expect } from "@playwright/test";
import {
  switchLocale,
  expectActiveLocale,
  expectHtmlLang,
  scrollToBottom,
  expectScrollRestored,
} from "@repo/e2e-utils";

test.describe("Paraglide i18n language switching", () => {
  test("switches from French to English on homepage", async ({ page }) => {
    await page.goto("/fr");

    await expectHtmlLang(page, "fr");
    await expect(
      page.getByText("réunis dans un même monorepo pnpm"),
    ).toBeVisible();
    await expectActiveLocale(page, "fr");

    await switchLocale(page, {
      to: "en",
      expectUrl: /\/en/,
      expectText: "living side by side in one pnpm monorepo",
    });
    await expectHtmlLang(page, "en");
    await expectActiveLocale(page, "en");
  });

  test("switches from English to French on homepage", async ({ page }) => {
    await page.goto("/en");

    await expectHtmlLang(page, "en");
    await expect(
      page.getByText("living side by side in one pnpm monorepo"),
    ).toBeVisible();
    await expectActiveLocale(page, "en");

    await switchLocale(page, {
      to: "fr",
      expectUrl: /\/fr/,
      expectText: "réunis dans un même monorepo pnpm",
    });
    await expectHtmlLang(page, "fr");
    await expectActiveLocale(page, "fr");
  });

  test("root path redirects to a locale-prefixed URL", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/(fr|en)$/);
  });
});

test.describe("scroll restoration on locale switch", () => {
  test.use({ viewport: { width: 1280, height: 400 } });

  test("preserves scroll position across a locale switch", async ({ page }) => {
    await page.goto("/fr");
    await expectActiveLocale(page, "fr");
    await expect(page.getByText("réunis dans un même monorepo pnpm")).toBeVisible();
    await page.waitForLoadState("networkidle");

    const scrollBefore = await scrollToBottom(page);
    expect(scrollBefore).toBeGreaterThan(0);

    await switchLocale(page, {
      to: "en",
      expectUrl: /\/en/,
      expectText: "living side by side in one pnpm monorepo",
    });

    await expectScrollRestored(page, scrollBefore);
  });
});
