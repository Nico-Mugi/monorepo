import { expect, test } from "@playwright/test";
import {
  differenceInCalendarDays,
  differenceInCalendarWeeks,
  endOfWeek,
  format,
  startOfWeek,
} from "date-fns";
import {
  E2E_FIXTURES,
  dayFor,
  gotoCalendar,
  switchView,
  today,
  weekDayHeader,
} from "./helpers";

test.describe("week view", () => {
  test.beforeEach(async ({ page }) => {
    await gotoCalendar(page);
    await switchView(page, "week");
  });

  test("shows a day-of-month header for every day of the week", async ({
    page,
  }) => {
    const weekStart = startOfWeek(today());
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      await expect(weekDayHeader(page, day)).toContainText(format(day, "d"));
    }
  });

  test("shows today's timed events as event blocks", async ({ page }) => {
    for (const key of ["morningSync", "doctorAppointment"] as const) {
      const fixture = E2E_FIXTURES[key];
      await expect(
        page.locator(
          `[data-testid="event-block"][data-event-id="${fixture.id}"]`,
        ),
      ).toBeVisible();
    }
  });

  test("shows a multi-day event, clipped to the visible week if its span crosses into the next one", async ({
    page,
  }) => {
    const fixture = E2E_FIXTURES.companyOffsite;
    const eventStart = dayFor(fixture.dayOffset);
    const eventEnd = dayFor(fixture.endDayOffset!);

    const targetWeekStart = startOfWeek(eventStart);
    const weeksForward = differenceInCalendarWeeks(
      targetWeekStart,
      startOfWeek(today()),
    );
    for (let i = 0; i < weeksForward; i++) {
      await page.getByTestId("date-nav-next").click();
    }

    // Mirror the app's own clipping logic (WeekViewMultiDayEventsRow) rather
    // than assuming the full span renders — a 3-day event starting near the
    // end of a week legitimately splits across two week views, which is
    // correct behavior, not a bug.
    const weekEnd = endOfWeek(targetWeekStart);
    const clippedEnd = eventEnd < weekEnd ? eventEnd : weekEnd;
    const expectedSegments = differenceInCalendarDays(clippedEnd, eventStart) + 1;

    await expect(
      page
        .locator(`[data-event-id="${fixture.id}"]`)
        .filter({ hasText: fixture.title }),
    ).toBeVisible();
    await expect(
      page.locator(`[data-event-id="${fixture.id}"]`),
    ).toHaveCount(expectedSegments);
  });

  test("mobile viewport shows the narrow-screen warning banner", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await expect(
      page.getByText("Weekly view is not recommended on smaller devices."),
    ).toBeVisible();
  });
});
