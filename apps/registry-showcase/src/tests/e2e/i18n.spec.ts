import { test, expect } from "@playwright/test";
import { switchLocale, expectActiveLocale, expectHtmlLang } from "@repo/e2e-utils";

test.describe("Paraglide i18n language switching", () => {
  test("switches from French to English on homepage", async ({ page }) => {
    await page.goto("/fr");

    await expectHtmlLang(page, "fr");
    await expect(
      page.getByText("vitrine en direct de chaque composant"),
    ).toBeVisible();
    await expectActiveLocale(page, "fr");

    await switchLocale(page, {
      to: "en",
      expectUrl: /\/en/,
      expectText: "live showcase of every component",
    });
    await expectHtmlLang(page, "en");
    await expectActiveLocale(page, "en");
  });

  test("switches from English to French on homepage", async ({ page }) => {
    await page.goto("/en");

    await expectHtmlLang(page, "en");
    await expect(
      page.getByText("live showcase of every component"),
    ).toBeVisible();
    await expectActiveLocale(page, "en");

    await switchLocale(page, {
      to: "fr",
      expectUrl: /\/fr/,
      expectText: "vitrine en direct de chaque composant",
    });
    await expectHtmlLang(page, "fr");
    await expectActiveLocale(page, "fr");
  });

  test("root path redirects to a locale-prefixed URL", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/(fr|en)$/);
  });
});
