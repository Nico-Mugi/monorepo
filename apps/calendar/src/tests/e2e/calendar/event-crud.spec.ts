import { expect, test } from "@playwright/test";
import {
  E2E_FIXTURES,
  dayCell,
  dayFor,
  gotoCalendar,
  switchView,
} from "./helpers";

test.describe("event create / edit / delete", () => {
  test.beforeEach(async ({ page }) => {
    await gotoCalendar(page);
  });

  test("adding an event via an empty day cell shows it on that day and a success toast", async ({
    page,
  }) => {
    const targetDay = dayFor(22);
    const cell = dayCell(page, targetDay);

    await cell.hover();
    await cell.getByRole("button", { name: "Add Event" }).click();

    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Title").fill("Quarterly Planning");
    await dialog.getByLabel("Description").fill("Plan Q3 priorities.");
    await dialog.getByRole("button", { name: "Create Event" }).click();

    await expect(page.getByText("Event created successfully")).toBeVisible();
    await expect(cell.getByText("Quarterly Planning")).toBeVisible();
  });

  test("submitting the add-event form empty shows validation errors and creates nothing", async ({
    page,
  }) => {
    await page.getByTestId("header-add-event-trigger").click();

    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Title").fill("");
    await dialog.getByLabel("Description").fill("");
    await dialog.getByRole("button", { name: "Create Event" }).click();

    await expect(dialog.getByText("Title is required")).toBeVisible();
    await expect(dialog.getByText("Description is required")).toBeVisible();
    // dialog stays open — the submit was rejected client-side by zod
    await expect(dialog).toBeVisible();
  });

  test("editing an event's title updates it everywhere and shows a success toast", async ({
    page,
  }) => {
    // Day view, not month: doctorAppointment is one of six events fixed on
    // "today", which can exceed month view's 3-badge-per-cell cap depending
    // on where the "happening now" fixture's variable start time sorts on
    // any given test run. Day view has no such cap — every event for the
    // day always renders as its own event-block.
    const fixture = E2E_FIXTURES.doctorAppointment;
    await switchView(page, "day");
    await page
      .locator(`[data-testid="event-block"][data-event-id="${fixture.id}"]`)
      .click();

    const detailsDialog = page.getByRole("dialog");
    await detailsDialog.getByRole("button", { name: "Edit" }).click();

    const editDialog = page.getByRole("dialog").last();
    const titleInput = editDialog.getByLabel("Title");
    await titleInput.fill("");
    await titleInput.fill("Annual Physical");
    await editDialog.getByRole("button", { name: "Save Changes" }).click();

    await expect(page.getByText("Event updated successfully")).toBeVisible();
    await expect(
      page.locator(
        `[data-testid="event-block"][data-event-id="${fixture.id}"]`,
      ),
    ).toContainText("Annual Physical");
  });

  test("deleting an event removes it and shows a success toast", async ({
    page,
  }) => {
    const fixture = E2E_FIXTURES.budgetReview;
    await switchView(page, "day");
    const block = page.locator(
      `[data-testid="event-block"][data-event-id="${fixture.id}"]`,
    );
    await block.click();

    const dialog = page.getByRole("dialog");
    await dialog.getByRole("button", { name: "Delete" }).click();

    await expect(page.getByText("Event deleted successfully.")).toBeVisible();
    await expect(block).toHaveCount(0);
  });
});
