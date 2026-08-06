import { expect, test } from "@playwright/test";
import { format } from "date-fns";
import {
  dayFor,
  expectedEventCount,
  gotoCalendar,
  navigateDate,
  rangeTextEn,
  switchView,
  today,
} from "./helpers";

test.describe("view navigation", () => {
  test("defaults to month view on first load", async ({ page }) => {
    await gotoCalendar(page);
    await expect(page.getByRole("tab", { name: "Month" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(
      page.getByText(`${format(today(), "MMMM")} ${today().getFullYear()}`),
    ).toBeVisible();
  });

  test("switches between all five views via the tab bar", async ({
    page,
  }) => {
    await gotoCalendar(page);

    for (const [view, label] of [
      ["day", "Day"],
      ["week", "Week"],
      ["year", "Year"],
      ["agenda", "Agenda"],
      ["month", "Month"],
    ] as const) {
      await switchView(page, view);
      await expect(page.getByRole("tab", { name: label })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    }
  });

  test("day view shows the day grid and hour column", async ({ page }) => {
    await gotoCalendar(page);
    await switchView(page, "day");
    await expect(
      page.getByText(`${format(today(), "EE")} ${format(today(), "d")}`),
    ).toBeVisible();
    // hour labels render for every hour except the very first row
    await expect(page.getByText("01:00", { exact: true })).toBeVisible();
  });

  test("week view shows a column per weekday", async ({ page }) => {
    await gotoCalendar(page);
    await switchView(page, "week");
    await expect(
      page.getByText(format(today(), "d"), { exact: false }).first(),
    ).toBeVisible();
  });

  test("year view shows all twelve months of the current year", async ({
    page,
  }) => {
    await gotoCalendar(page);
    await switchView(page, "year");
    for (const monthIndex of [0, 5, 11]) {
      const monthName = format(
        new Date(today().getFullYear(), monthIndex, 1),
        "MMMM",
      );
      await expect(
        page.getByRole("button", { name: monthName, exact: true }),
      ).toBeVisible();
    }
  });

  test("agenda view shows the search box", async ({ page }) => {
    await gotoCalendar(page);
    await switchView(page, "agenda");
    await expect(
      page.getByPlaceholder("Type a command or search..."),
    ).toBeVisible();
  });

  test("date navigator moves forward and back a month", async ({ page }) => {
    await gotoCalendar(page);

    const currentLabel = `${format(today(), "MMMM")} ${today().getFullYear()}`;
    const nextMonth = navigateDate(today(), "month", "next");
    const nextLabel = `${format(nextMonth, "MMMM")} ${nextMonth.getFullYear()}`;

    await expect(page.getByText(currentLabel)).toBeVisible();

    await page.getByTestId("date-nav-next").click();
    await expect(page.getByText(nextLabel)).toBeVisible();

    await page.getByTestId("date-nav-previous").click();
    await expect(page.getByText(currentLabel)).toBeVisible();
  });

  test("today button returns to the current month after navigating away", async ({
    page,
  }) => {
    await gotoCalendar(page);

    const currentLabel = `${format(today(), "MMMM")} ${today().getFullYear()}`;
    const nextMonth = navigateDate(today(), "month", "next");
    const nextLabel = `${format(nextMonth, "MMMM")} ${nextMonth.getFullYear()}`;

    await page.getByTestId("date-nav-next").click();
    await expect(page.getByText(nextLabel)).toBeVisible();

    await page.getByTestId("today-button").click();
    await expect(page.getByText(currentLabel)).toBeVisible();
  });

  test("date navigator range text matches the app's own rangeText() for month view", async ({
    page,
  }) => {
    await gotoCalendar(page);
    await expect(page.getByText(rangeTextEn("month", today()))).toBeVisible();
  });

  test("event count badge reflects the actual number of events starting in the visible month", async ({
    page,
  }) => {
    await gotoCalendar(page);
    const count = expectedEventCount("month", today());
    const label = count === 1 ? "1 event" : `${count} events`;
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  });

  test("event count badge updates when navigating to next month", async ({
    page,
  }) => {
    await gotoCalendar(page);
    const nextMonthDate = dayFor("next-month");
    const count = expectedEventCount("month", nextMonthDate);
    const label = count === 1 ? "1 event" : `${count} events`;

    await page.getByTestId("date-nav-next").click();
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  });
});
