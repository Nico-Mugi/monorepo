import { expect, test } from "@playwright/test";
import {
  E2E_FIXTURES,
  agendaDateHeadingEn,
  dayFor,
  gotoCalendar,
  openSettings,
  switchView,
  toCapitalize,
} from "./helpers";

test.describe("agenda view", () => {
  test.beforeEach(async ({ page }) => {
    await gotoCalendar(page);
    await switchView(page, "agenda");
  });

  test("groups events under a date heading by default", async ({ page }) => {
    const heading = agendaDateHeadingEn(dayFor(0));
    await expect(page.getByText(heading, { exact: true })).toBeVisible();
    await expect(
      page.getByText(E2E_FIXTURES.doctorAppointment.title, { exact: true }),
    ).toBeVisible();
  });

  test("searching filters the list to matching titles", async ({ page }) => {
    await page
      .getByPlaceholder("Type a command or search...")
      .fill("Yoga Class");

    await expect(page.getByText(E2E_FIXTURES.yogaClass.title, { exact: true })).toBeVisible();
    await expect(
      page.getByText(E2E_FIXTURES.doctorAppointment.title, { exact: true }),
    ).not.toBeVisible();
  });

  test("searching for something no event matches shows the empty state", async ({
    page,
  }) => {
    await page
      .getByPlaceholder("Type a command or search...")
      .fill("zzz-nonexistent-event-zzz");

    await expect(page.getByText("No results found.")).toBeVisible();
  });

  test("clicking an event opens its details dialog", async ({ page }) => {
    const fixture = E2E_FIXTURES.budgetReview;
    await page.getByText(fixture.title, { exact: true }).click();

    const dialog = page.getByRole("dialog");
    await expect(
      dialog.getByRole("heading", { name: fixture.title }),
    ).toBeVisible();
  });

  test("switching to 'group by color' via settings changes the group headings", async ({
    page,
  }) => {
    await openSettings(page);
    await page.getByText("Color", { exact: true }).click();

    const colorHeading = toCapitalize(E2E_FIXTURES.doctorAppointment.color);
    await expect(page.getByText(colorHeading, { exact: true })).toBeVisible();
    await expect(
      page.getByText(E2E_FIXTURES.doctorAppointment.title, { exact: true }),
    ).toBeVisible();
  });
});
