import { expect, test } from "@playwright/test";
import { format } from "date-fns";
import {
  E2E_FIXTURES,
  EVENT_HAPPENING_NOW_TITLE,
  datePickerCell,
  dayFor,
  gotoCalendar,
  hourSlot,
  navigateDatePickerToMonth,
  safeEmptyHour,
  switchView,
} from "./helpers";

test.describe("day view", () => {
  test.beforeEach(async ({ page }) => {
    await gotoCalendar(page);
    await switchView(page, "day");
  });

  test("shows a timed event block with its title and time range", async ({
    page,
  }) => {
    const fixture = E2E_FIXTURES.doctorAppointment;
    const block = page.locator(
      `[data-testid="event-block"][data-event-id="${fixture.id}"]`,
    );
    await expect(block).toBeVisible();
    await expect(block).toContainText(fixture.title);
    await expect(block).toContainText("10:00");
    await expect(block).toContainText("11:00");
  });

  test("shows every timed event for the day, unlike month view's 3-event cap", async ({
    page,
  }) => {
    for (const key of [
      "morningSync",
      "doctorAppointment",
      "focusBlock",
      "budgetReview",
      "clientCall",
    ] as const) {
      const fixture = E2E_FIXTURES[key];
      await expect(
        page.locator(
          `[data-testid="event-block"][data-event-id="${fixture.id}"]`,
        ),
      ).toBeVisible();
    }
  });

  test("shows the currently-happening event in the sidebar", async ({
    page,
  }) => {
    const sidebar = page.getByTestId("day-view-agenda-sidebar");
    await expect(sidebar.getByText("Happening now")).toBeVisible();
    await expect(
      sidebar.getByText(EVENT_HAPPENING_NOW_TITLE, { exact: true }),
    ).toBeVisible();
  });

  test("the mini day-picker navigates the visible day grid", async ({
    page,
  }) => {
    // "Happening now" is deliberately excluded from this assertion: it's
    // driven by the live clock against ALL single-day events app-wide
    // (CalendarDayView's getCurrentEvents checks isWithinInterval(now, ...)
    // over every singleDayEvent, not just the selected day), so it never
    // changes based on which day is selected in the picker — confirmed by
    // navigating to a day with zero fixture events and observing the
    // "Live Incident Response" fixture still shown. That's the sidebar's
    // real, intentional behavior, not something this test should contradict.
    const emptyDay = dayFor(20);
    // the mini day-picker mounts on the real current month regardless of
    // `emptyDay`'s month — step it forward/back before locating the cell
    await navigateDatePickerToMonth(page, emptyDay);
    await datePickerCell(page, emptyDay).click();

    await expect(
      page.getByText(`${format(emptyDay, "EE")} ${format(emptyDay, "d")}`),
    ).toBeVisible();
  });

  test("shows the multi-day event banner when the selected day falls inside its span", async ({
    page,
  }) => {
    const fixture = E2E_FIXTURES.companyOffsite;
    const middleDay = dayFor(fixture.dayOffset + 1);
    await datePickerCell(page, middleDay).click();

    await expect(page.getByText(fixture.title)).toBeVisible();
  });

  test("clicking an hour slot opens Add Event prefilled with that hour", async ({
    page,
  }) => {
    const today = dayFor(0);
    const hour = safeEmptyHour();
    const slot = hourSlot(page, today, hour, 0);
    await slot.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByText(
        `${format(today, "MM/dd/yyyy")} ${hour.toString().padStart(2, "0")}:00`,
      ),
    ).toBeVisible();
  });
});
