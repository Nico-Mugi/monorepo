import { expect, test } from "@playwright/test";
import { format } from "date-fns";
import { dayCell, E2E_FIXTURES, dayFor, gotoCalendar } from "./helpers";

test.describe("month view", () => {
  test.beforeEach(async ({ page }) => {
    await gotoCalendar(page);
  });

  test("a day with a single event shows it as a directly visible badge", async ({
    page,
  }) => {
    const fixture = E2E_FIXTURES.yogaClass;
    const cell = dayCell(page, dayFor(fixture.dayOffset));
    const badge = cell.locator(`[data-event-id="${fixture.id}"]`);
    await expect(badge).toBeVisible();
    await expect(badge).toContainText(fixture.title);
  });

  test("a day with five events shows only three badges plus a '+2 more' link", async ({
    page,
  }) => {
    const overflowDay = dayFor(E2E_FIXTURES.overflowAlpha.dayOffset);
    const cell = dayCell(page, overflowDay);

    await expect(cell.getByTestId("event-badge")).toHaveCount(3);
    await expect(cell.locator("span.rounded-xl.border")).toContainText("2");
    await expect(cell.locator("span.rounded-xl.border")).toContainText(
      "more",
    );
  });

  test("opening the '+more' dialog lists every event for that day", async ({
    page,
  }) => {
    const overflowDay = dayFor(E2E_FIXTURES.overflowAlpha.dayOffset);
    const cell = dayCell(page, overflowDay);

    await cell.getByText("more").click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    for (const key of [
      "overflowAlpha",
      "overflowBravo",
      "overflowCharlie",
      "overflowDelta",
      "overflowEcho",
    ] as const) {
      await expect(dialog.getByText(E2E_FIXTURES[key].title)).toBeVisible();
    }
  });

  test("clicking an event inside the '+more' dialog opens its details", async ({
    page,
  }) => {
    const overflowDay = dayFor(E2E_FIXTURES.overflowAlpha.dayOffset);
    const cell = dayCell(page, overflowDay);
    await cell.getByText("more").click();

    const listDialog = page.getByRole("dialog");
    await listDialog.getByText(E2E_FIXTURES.overflowCharlie.title).click();

    const detailsDialog = page.getByRole("dialog").last();
    await expect(
      detailsDialog.getByRole("heading", {
        name: E2E_FIXTURES.overflowCharlie.title,
      }),
    ).toBeVisible();
    await expect(
      detailsDialog.getByText(E2E_FIXTURES.overflowCharlie.user.name),
    ).toBeVisible();
  });

  test("a multi-day event shows its title only on the first day of its span", async ({
    page,
  }) => {
    const fixture = E2E_FIXTURES.companyOffsite;
    const firstDay = dayFor(fixture.dayOffset);
    const middleDay = dayFor(fixture.dayOffset + 1);
    const lastDay = dayFor(fixture.endDayOffset!);

    const firstCell = dayCell(page, firstDay);
    const middleCell = dayCell(page, middleDay);
    const lastCell = dayCell(page, lastDay);

    await expect(
      firstCell.locator(`[data-event-id="${fixture.id}"]`),
    ).toContainText(fixture.title);

    // middle/last segments render (same event id present) but without the
    // title text — only the "first" segment renders renderBadgeText
    await expect(
      middleCell.locator(`[data-event-id="${fixture.id}"]`),
    ).toBeVisible();
    await expect(
      middleCell.locator(`[data-event-id="${fixture.id}"]`),
    ).not.toContainText(fixture.title);

    await expect(
      lastCell.locator(`[data-event-id="${fixture.id}"]`),
    ).toBeVisible();
  });

  test("today's cell highlights the day number", async ({ page }) => {
    const cell = dayCell(page, new Date());
    const dayNumber = cell.getByText(format(new Date(), "d"), { exact: true });
    await expect(dayNumber).toHaveClass(/bg-primary/);
  });

  test("hovering an empty day cell reveals an Add Event button that prefills that date", async ({
    page,
  }) => {
    // offset 20 has no fixture events and stays within the same rendered month grid
    const emptyDay = dayFor(20);
    const cell = dayCell(page, emptyDay);

    await cell.hover();
    await cell.getByRole("button", { name: "Add Event" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("Add New Event")).toBeVisible();
    await expect(
      dialog.getByText(format(emptyDay, "MM/dd/yyyy"), { exact: false }).first(),
    ).toBeVisible();
  });

  test("clicking a directly visible event badge opens its details dialog", async ({
    page,
  }) => {
    const fixture = E2E_FIXTURES.yogaClass;
    const cell = dayCell(page, dayFor(fixture.dayOffset));
    await cell.locator(`[data-event-id="${fixture.id}"]`).click();

    const dialog = page.getByRole("dialog");
    await expect(
      dialog.getByRole("heading", { name: fixture.title }),
    ).toBeVisible();
    await expect(dialog.getByText(fixture.user.name)).toBeVisible();
  });
});
