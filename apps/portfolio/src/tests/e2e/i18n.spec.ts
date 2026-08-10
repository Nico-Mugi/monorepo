import { test, expect } from "@playwright/test";
import {
  switchLocale,
  expectActiveLocale,
  scrollToBottom,
  expectScrollRestored,
} from "@repo/e2e-utils";

test.describe("Paraglide i18n language switching", () => {
  test("switches from French to English on homepage", async ({ page }) => {
    await page.goto("/fr");

    await expect(
      page.getByText("Ingénieur en Informatique & Consultant IT"),
    ).toBeVisible();
    await expectActiveLocale(page, "fr");

    await switchLocale(page, {
      to: "en",
      expectUrl: /\/en/,
      expectText: "Software Engineer & IT Consultant",
    });
    await expectActiveLocale(page, "en");
  });

  test("switches from English to French on homepage", async ({ page }) => {
    await page.goto("/en");

    await expect(
      page.getByText("Software Engineer & IT Consultant"),
    ).toBeVisible();
    await expectActiveLocale(page, "en");

    await switchLocale(page, {
      to: "fr",
      expectUrl: /\/fr/,
      expectText: "Ingénieur en Informatique & Consultant IT",
    });
    await expectActiveLocale(page, "fr");
  });

  test("language switch on French CV redirects to English resume URL", async ({
    page,
  }) => {
    await page.goto("/fr/cv");

    await expect(page.getByText("Expérience Professionnelle")).toBeVisible();

    await switchLocale(page, {
      to: "en",
      expectUrl: /\/en\/resume/,
      expectText: "Professional Experience",
    });
  });

  test("language switch on English resume redirects to French CV URL", async ({
    page,
  }) => {
    await page.goto("/en/resume");

    await expect(page.getByText("Professional Experience")).toBeVisible();

    await switchLocale(page, {
      to: "fr",
      expectUrl: /\/fr\/cv/,
      expectText: "Expérience Professionnelle",
    });
  });
});

test.describe("scroll restoration on locale switch", () => {
  test.use({ viewport: { width: 1280, height: 400 } });

  test("preserves scroll position across a locale switch", async ({ page }) => {
    await page.goto("/fr");
    await expectActiveLocale(page, "fr");
    await expect(
      page.getByText("Ingénieur en Informatique & Consultant IT"),
    ).toBeVisible();
    await page.waitForLoadState("networkidle");

    const scrollBefore = await scrollToBottom(page);
    expect(scrollBefore).toBeGreaterThan(0);

    await switchLocale(page, {
      to: "en",
      expectUrl: /\/en/,
      expectText: "Software Engineer & IT Consultant",
    });

    await expectScrollRestored(page, scrollBefore);
  });
});
