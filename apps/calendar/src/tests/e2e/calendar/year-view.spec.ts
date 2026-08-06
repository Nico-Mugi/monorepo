import { expect, test } from "@playwright/test";
import { E2E_FIXTURES, dayFor, gotoCalendar, switchView, yearDayCell } from "./helpers";

test.describe("year view", () => {
  test.beforeEach(async ({ page }) => {
    await gotoCalendar(page);
    await switchView(page, "year");
  });

  test("a day with events is clickable and shows a '+N' indicator past two events", async ({
    page,
  }) => {
    const overflowDay = dayFor(E2E_FIXTURES.overflowAlpha.dayOffset);
    const cell = yearDayCell(page, overflowDay);
    // 5 events on this day: bullet for the first + "+4" for the rest
    await expect(cell.getByText("+4", { exact: true })).toBeVisible();
  });

  test("clicking a day with events opens the event list dialog", async ({
    page,
  }) => {
    const overflowDay = dayFor(E2E_FIXTURES.overflowAlpha.dayOffset);
    await yearDayCell(page, overflowDay).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(E2E_FIXTURES.overflowAlpha.title)).toBeVisible();
    await expect(dialog.getByText(E2E_FIXTURES.overflowEcho.title)).toBeVisible();
  });

  test("a multi-day event's bullet only appears on its start day (year view groups by start date only)", async ({
    page,
  }) => {
    const fixture = E2E_FIXTURES.companyOffsite;
    const startCell = yearDayCell(page, dayFor(fixture.dayOffset));
    const middleCell = yearDayCell(page, dayFor(fixture.dayOffset + 1));

    // start day: exactly one event -> renders a bullet, not a "+N" badge
    await expect(startCell.locator(".rounded-full").first()).toBeVisible();
    // middle day of the span has no *other* fixtures, so it has zero
    // dot/plus indicators at all (year view keys off startDate only)
    await expect(middleCell.getByText(/^\+\d+$/)).toHaveCount(0);
  });

  test("a day with no events is not clickable", async ({ page }) => {
    // .first(): the same calendar date can render twice — once as a real
    // day in its own month card, once as a leading/trailing padding day in
    // an adjacent month's card (getCalendarCells pads every month view to
    // full weeks) — either copy is equally valid for this assertion.
    const emptyDay = dayFor(25);
    const cell = yearDayCell(page, emptyDay).first();
    await expect(cell).toHaveClass(/cursor-default/);
    await cell.click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});
