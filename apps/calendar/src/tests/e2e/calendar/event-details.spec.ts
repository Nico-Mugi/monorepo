import { expect, test } from "@playwright/test";
import { format } from "date-fns";
import {
  E2E_FIXTURES,
  dayCell,
  dayFor,
  formatTime,
  gotoCalendar,
} from "./helpers";

test.describe("event details dialog", () => {
  test.beforeEach(async ({ page }) => {
    await gotoCalendar(page);
  });

  test("shows title, responsible user, start/end date+time, and description", async ({
    page,
  }) => {
    const fixture = E2E_FIXTURES.doctorAppointment;
    const day = dayFor(fixture.dayOffset);
    const cell = dayCell(page, day);
    await cell.locator(`[data-event-id="${fixture.id}"]`).click();

    const dialog = page.getByRole("dialog");
    await expect(
      dialog.getByRole("heading", { name: fixture.title }),
    ).toBeVisible();

    await expect(dialog.getByText("Responsible")).toBeVisible();
    await expect(dialog.getByText(fixture.user.name)).toBeVisible();

    const startTime = formatTime(
      new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
        fixture.startHour,
        fixture.startMinute,
      ),
      true,
    );
    const endTime = formatTime(
      new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
        fixture.endHour,
        fixture.endMinute,
      ),
      true,
    );

    // Doctor Appointment starts and ends the same day, so the "Start Date"
    // and "End Date" paragraphs render identical date text — only their
    // time differs, so disambiguate on that instead of the (shared) date.
    const dateText = format(day, "EEEE dd MMMM");
    await expect(dialog.getByText("Start Date")).toBeVisible();
    await expect(
      dialog.getByText(dateText, { exact: false }).filter({ hasText: startTime }),
    ).toBeVisible();

    await expect(dialog.getByText("End Date")).toBeVisible();
    await expect(
      dialog.getByText(dateText, { exact: false }).filter({ hasText: endTime }),
    ).toBeVisible();

    await expect(dialog.getByText("Description")).toBeVisible();
    await expect(
      dialog.getByText(`E2E fixture event: ${fixture.title}.`),
    ).toBeVisible();
  });

  test("closes via the close button", async ({ page }) => {
    const fixture = E2E_FIXTURES.yogaClass;
    const cell = dayCell(page, dayFor(fixture.dayOffset));
    await cell.locator(`[data-event-id="${fixture.id}"]`).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(dialog).not.toBeVisible();
  });
});
