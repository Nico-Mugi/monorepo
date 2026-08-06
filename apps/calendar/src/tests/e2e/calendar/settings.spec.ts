import { expect, test } from "@playwright/test";
import { E2E_FIXTURES, gotoCalendar, openSettings, switchView } from "./helpers";

test.describe("settings", () => {
  test.beforeEach(async ({ page }) => {
    await gotoCalendar(page);
  });

  test("switching badge variant to 'dot' restyles event badges", async ({
    page,
  }) => {
    const fixture = E2E_FIXTURES.yogaClass;
    const badge = page.locator(`[data-event-id="${fixture.id}"]`);

    // default variant is "colored" — a light tinted background per color
    await expect(badge).toHaveClass(/bg-blue-50|bg-green-50/);

    await openSettings(page);
    await page
      .getByRole("menuitem", { name: "Use dot badge" })
      .getByRole("switch")
      .click();
    await page.keyboard.press("Escape");

    await expect(badge).toHaveClass(/bg-secondary/);
  });

  test("switching to 24-hour off shows 12-hour times", async ({ page }) => {
    await switchView(page, "day");
    const fixture = E2E_FIXTURES.doctorAppointment;
    const block = page.locator(
      `[data-testid="event-block"][data-event-id="${fixture.id}"]`,
    );
    await expect(block).toContainText("10:00");

    await openSettings(page);
    await page
      .getByRole("menuitem", { name: "Use 24 hour format" })
      .getByRole("switch")
      .click();
    await page.keyboard.press("Escape");

    await expect(block).toContainText("10:00 AM");
    await expect(block).not.toContainText("10:00 -");
  });

  test("changing 'days start at' shifts the day/week view's initial scroll position", async ({
    page,
  }) => {
    await switchView(page, "day");
    const viewport = page.locator('[data-slot="scroll-area-viewport"]').first();
    await expect(viewport).toHaveJSProperty("scrollTop", 8 * 96); // default startOfDayHour = 8

    await openSettings(page);
    await page
      .getByRole("menuitem", { name: "Days start at" })
      .getByRole("spinbutton")
      .fill("5");
    await page.keyboard.press("Escape");

    // switching view forces ScrollArea to remount with the new scrollPosition
    await switchView(page, "week");
    await switchView(page, "day");
    const newViewport = page
      .locator('[data-slot="scroll-area-viewport"]')
      .first();
    await expect(newViewport).toHaveJSProperty("scrollTop", 5 * 96);
  });

  test("settings persist across a page reload", async ({ page }) => {
    await openSettings(page);
    await page
      .getByRole("menuitem", { name: "Use 24 hour format" })
      .getByRole("switch")
      .click();
    await page.keyboard.press("Escape");

    await page.reload();
    await page.getByRole("tablist").waitFor({ state: "visible" });

    await switchView(page, "day");
    const fixture = E2E_FIXTURES.doctorAppointment;
    const block = page.locator(
      `[data-testid="event-block"][data-event-id="${fixture.id}"]`,
    );
    await expect(block).toContainText("10:00 AM");
  });
});
