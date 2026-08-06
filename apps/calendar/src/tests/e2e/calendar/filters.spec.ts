import { expect, test, type Page } from "@playwright/test";
import { E2E_FIXTURES, gotoCalendar, switchView } from "./helpers";

// Both the color filter and the user filter are DropdownMenus that
// intentionally stay open across selections (each DropdownMenuItem calls
// e.preventDefault() so users can toggle several colors/users without the
// menu closing after every click) — open each once per test, not before
// every click, and close it explicitly before interacting with anything
// else on the page.
async function openFilterMenu(page: Page) {
  const trigger = page.getByTestId("filter-trigger");
  if ((await trigger.getAttribute("data-state")) !== "open") {
    await trigger.click();
    await page.getByRole("menu").waitFor({ state: "visible" });
  }
}

async function selectColor(page: Page, color: string) {
  await openFilterMenu(page);
  await page.getByRole("menuitem", { name: color, exact: false }).click();
}

async function closeFilterMenu(page: Page) {
  await page.keyboard.press("Escape");
  await page.getByRole("menu").waitFor({ state: "hidden" });
}

async function openUserMenu(page: Page) {
  const trigger = page.getByTestId("user-filter-trigger");
  if ((await trigger.getAttribute("data-state")) !== "open") {
    await trigger.click();
    await page.getByRole("menu").waitFor({ state: "visible" });
  }
}

async function selectUser(page: Page, name: string) {
  await openUserMenu(page);
  await page.getByRole("menuitem", { name, exact: false }).click();
}

test.describe("filters", () => {
  test.beforeEach(async ({ page }) => {
    await gotoCalendar(page);
    // Agenda view lists every event for the month with no per-day display
    // cap, unlike month view's 3-badge slots — the only view where presence
    // /absence after filtering can be asserted unambiguously.
    await switchView(page, "agenda");
  });

  test("filtering by a single color hides events of other colors", async ({
    page,
  }) => {
    await selectColor(page, "Blue");
    await closeFilterMenu(page);

    // Doctor Appointment and Client Call are blue; Morning Sync is green.
    await expect(
      page.getByText(E2E_FIXTURES.doctorAppointment.title, { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText(E2E_FIXTURES.clientCall.title, { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText(E2E_FIXTURES.morningSync.title, { exact: true }),
    ).not.toBeVisible();
  });

  test("filtering by multiple colors is additive (OR, not AND)", async ({
    page,
  }) => {
    await selectColor(page, "Blue");
    await selectColor(page, "Green");
    await closeFilterMenu(page);

    await expect(
      page.getByText(E2E_FIXTURES.doctorAppointment.title, { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText(E2E_FIXTURES.morningSync.title, { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText(E2E_FIXTURES.budgetReview.title, { exact: true }),
    ).not.toBeVisible();
  });

  test("clear filter restores every event", async ({ page }) => {
    await selectColor(page, "Blue");
    await closeFilterMenu(page);
    await expect(
      page.getByText(E2E_FIXTURES.morningSync.title, { exact: true }),
    ).not.toBeVisible();

    await openFilterMenu(page);
    await page.getByRole("menuitem", { name: "Clear Filter" }).click();
    await closeFilterMenu(page);

    await expect(
      page.getByText(E2E_FIXTURES.morningSync.title, { exact: true }),
    ).toBeVisible();
  });

  test("filtering by a single user shows only that user's events", async ({
    page,
  }) => {
    await selectUser(page, E2E_FIXTURES.focusBlock.user.name); // Emily
    await closeFilterMenu(page);

    // Focus Block and Budget Review both belong to Emily Davis
    await expect(
      page.getByText(E2E_FIXTURES.focusBlock.title, { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText(E2E_FIXTURES.budgetReview.title, { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText(E2E_FIXTURES.doctorAppointment.title, { exact: true }),
    ).not.toBeVisible();
  });

  test("filtering by multiple users is additive (OR, not AND)", async ({
    page,
  }) => {
    // Doctor Appointment (Michael) and Morning Sync (Alice) belong to
    // different users — selecting both should show both, not neither.
    await selectUser(page, E2E_FIXTURES.doctorAppointment.user.name); // Michael
    await selectUser(page, E2E_FIXTURES.morningSync.user.name); // Alice
    await closeFilterMenu(page);

    await expect(
      page.getByText(E2E_FIXTURES.doctorAppointment.title, { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText(E2E_FIXTURES.morningSync.title, { exact: true }),
    ).toBeVisible();
    // Budget Review (Emily) matches neither selected user.
    await expect(
      page.getByText(E2E_FIXTURES.budgetReview.title, { exact: true }),
    ).not.toBeVisible();
  });

  test("selecting 'All' in the user filter clears it, the same way Clear Filter does for colors", async ({
    page,
  }) => {
    await selectUser(page, E2E_FIXTURES.focusBlock.user.name); // Emily
    await closeFilterMenu(page);
    await expect(
      page.getByText(E2E_FIXTURES.doctorAppointment.title, { exact: true }),
    ).not.toBeVisible(); // Michael's event, hidden while filtered to Emily

    await openUserMenu(page);
    await page.getByRole("menuitem", { name: "All", exact: false }).click();
    await closeFilterMenu(page);

    await expect(
      page.getByText(E2E_FIXTURES.doctorAppointment.title, { exact: true }),
    ).toBeVisible();
  });

  test("a user filter applied after a color filter intersects with it (AND, not a replace)", async ({
    page,
  }) => {
    await selectColor(page, "Blue");
    await closeFilterMenu(page);
    // Blue: Doctor Appointment (Michael) and Client Call (Alice) both match;
    // Morning Sync (green) is hidden.
    await expect(
      page.getByText(E2E_FIXTURES.doctorAppointment.title, { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText(E2E_FIXTURES.clientCall.title, { exact: true }),
    ).toBeVisible();

    await selectUser(page, E2E_FIXTURES.clientCall.user.name); // Alice
    await closeFilterMenu(page);

    // Intersection of "blue" AND "Alice's events": only Client Call
    // satisfies both. Doctor Appointment is blue but belongs to Michael;
    // Morning Sync belongs to Alice but is green — neither should reappear.
    await expect(
      page.getByText(E2E_FIXTURES.clientCall.title, { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText(E2E_FIXTURES.doctorAppointment.title, { exact: true }),
    ).not.toBeVisible();
    await expect(
      page.getByText(E2E_FIXTURES.morningSync.title, { exact: true }),
    ).not.toBeVisible();
  });
});
