import { test, expect } from "@playwright/test";

test.describe("Paraglide i18n language switching", () => {
  test("switches from French to English on homepage", async ({ page }) => {
    await page.goto("/fr");

    await expect(
      page.getByText("Ingénieur en Informatique & Consultant IT"),
    ).toBeVisible();

    const langButton = page.getByRole("button", { name: "Switch language" });
    await expect(langButton).toHaveText("EN");

    await langButton.click();

    await expect(page).toHaveURL(/\/en/, { timeout: 10000 });
    await expect(
      page.getByText("Software Engineer & IT Consultant"),
    ).toBeVisible();
    await expect(langButton).toHaveText("FR");
  });

  test("switches from English to French on homepage", async ({ page }) => {
    await page.goto("/en");

    await expect(
      page.getByText("Software Engineer & IT Consultant"),
    ).toBeVisible();

    const langButton = page.getByRole("button", { name: "Switch language" });
    await expect(langButton).toHaveText("FR");

    await langButton.click();

    await expect(page).toHaveURL(/\/fr/, { timeout: 10000 });
    await expect(
      page.getByText("Ingénieur en Informatique & Consultant IT"),
    ).toBeVisible();
    await expect(langButton).toHaveText("EN");
  });

  test("language switch on French CV redirects to English resume URL", async ({
    page,
  }) => {
    await page.goto("/fr/cv");

    await expect(page.getByText("Expérience Professionnelle")).toBeVisible();

    const langButton = page.getByRole("button", { name: "Switch language" });
    await langButton.click();

    await expect(page).toHaveURL(/\/en\/resume/, { timeout: 10000 });
    await expect(page.getByText("Professional Experience")).toBeVisible();
  });

  test("language switch on English resume redirects to French CV URL", async ({
    page,
  }) => {
    await page.goto("/en/resume");

    await expect(page.getByText("Professional Experience")).toBeVisible();

    const langButton = page.getByRole("button", { name: "Switch language" });
    await langButton.click();

    await expect(page).toHaveURL(/\/fr\/cv/, { timeout: 10000 });
    await expect(page.getByText("Expérience Professionnelle")).toBeVisible();
  });
});
