import {
  addDays,
  addMonths,
  addYears,
  differenceInCalendarMonths,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths,
} from "date-fns";
import type { Locator, Page } from "@playwright/test";
import {
  buildE2eEvents,
  E2E_FIXTURES,
  EVENT_HAPPENING_NOW_TITLE,
  type E2eEventFixture,
} from "~/data/e2e-fixtures";
import {
  formatTime,
  getEventsCount,
  navigateDate,
  toCapitalize,
  type TCalendarView,
} from "@repo/ui";

// Re-exported so spec files have a single import source for fixture data and
// the exact same date/counting helpers the app itself uses — expectations
// are computed with the app's own logic against a freshly built copy of the
// same fixture set, not hardcoded or re-derived independently. This is what
// keeps assertions correct regardless of which real-world day the suite
// happens to run on (month/year boundaries, the "now"-relative event).
//
// formatTime() is locale-independent (plain HH:mm / h:mm a, no `locale`
// option), so it's safe to reuse directly. rangeText() is NOT — it calls the
// app's getDateFnsLocale(), which reads Paraglide's active locale. That's
// meaningless in this Node test process (no request/URL context), where it
// silently resolves to the base locale "fr" — a real trap, since every spec
// here navigates to `/en`. rangeTextEn() below is a locale-pinned copy of
// the exact same switch/format logic, safe to call from Node.
export {
  E2E_FIXTURES,
  EVENT_HAPPENING_NOW_TITLE,
  formatTime,
  navigateDate,
  toCapitalize,
};
export type { E2eEventFixture };

const RANGE_FORMAT_STRING = "d MMM yyyy";

/** Matches AgendaEvents' date-group heading format, English-pinned for the
 * same reason as rangeTextEn above. */
export function agendaDateHeadingEn(date: Date): string {
  return format(date, "EEEE d MMMM yyyy");
}

export function rangeTextEn(view: TCalendarView, date: Date): string {
  let start: Date;
  let end: Date;

  switch (view) {
    case "month":
      start = startOfMonth(date);
      end = endOfMonth(date);
      break;
    case "week":
      start = startOfWeek(date);
      end = endOfWeek(date);
      break;
    case "day":
      return format(date, RANGE_FORMAT_STRING);
    case "year":
      start = startOfYear(date);
      end = endOfYear(date);
      break;
    case "agenda":
      start = startOfMonth(date);
      end = endOfMonth(date);
      break;
    default:
      return "Error while formatting";
  }

  return `${format(start, RANGE_FORMAT_STRING)} - ${format(end, RANGE_FORMAT_STRING)}`;
}

/** Fresh copy of the exact fixture set the app itself will load under
 * ?e2e=1 — use this (not hardcoded counts) to compute expected values via
 * the app's own helpers (getEventsCount, getEventsForMonth, etc). */
export function e2eEvents() {
  return buildE2eEvents();
}

export function expectedEventCount(view: TCalendarView, date: Date): number {
  return getEventsCount(e2eEvents(), date, view);
}

export async function gotoCalendar(
  page: Page,
  { locale = "en" }: { locale?: "en" | "fr" } = {},
) {
  await page.goto(`/${locale}?e2e=1`);
  await page.getByRole("tablist").waitFor({ state: "visible" });
  // let the header/tab entrance animations (framer-motion) settle
  await page.waitForTimeout(300);
}

/** Locates the droppable region for a given date. In month/year-less month
 * view there is exactly one per date (the whole day cell); in day/week view
 * there's one per half-hour slot sharing that date, so scope further with
 * `.filter()` there. */
export function dayCell(page: Page, date: Date) {
  return page.locator(
    `[data-testid="droppable-area"][data-date="${format(date, "yyyy-MM-dd")}"]`,
  );
}

/** Locates a specific half-hour droppable slot in day/week view. */
export function hourSlot(
  page: Page,
  date: Date,
  hour: number,
  minute: 0 | 30,
) {
  return page.locator(
    `[data-testid="droppable-area"][data-date="${format(date, "yyyy-MM-dd")}"][data-hour="${hour}"][data-minute="${minute}"]`,
  );
}

/** The week view's per-day header cell (day-of-week + day-of-month). */
export function weekDayHeader(page: Page, date: Date) {
  return page.locator(
    `[data-testid="week-day-header"][data-date="${format(date, "yyyy-MM-dd")}"]`,
  );
}

/** react-day-picker (the mini calendar in day view's sidebar and the
 * add/edit-event date pickers) renders a stable data-day attribute per cell
 * — far more reliable than matching by accessible name, which react-day-picker
 * sets to a full descriptive string ("Sunday, July 26th,") and which repeats
 * the bare day-of-month across every month shown in the picker. */
export function datePickerCell(page: Page, date: Date) {
  return page
    .locator(`[data-day="${format(date, "yyyy-MM-dd")}"]`)
    .locator("button");
}

export function yearDayCell(page: Page, date: Date) {
  return page.locator(
    `[data-testid="year-day-cell"][data-date="${format(date, "yyyy-MM-dd")}"]`,
  );
}

export async function openSettings(page: Page) {
  await page.getByTestId("settings-trigger").click();
  await page.getByRole("menu").waitFor({ state: "visible" });
}

export async function switchView(page: Page, view: TCalendarView) {
  const label =
    view === "day"
      ? "Day"
      : view === "week"
        ? "Week"
        : view === "month"
          ? "Month"
          : view === "year"
            ? "Year"
            : "Agenda";
  await page.getByRole("tab", { name: label }).click();
  await page.waitForTimeout(300);
}

export function today(): Date {
  return startOfDay(new Date());
}

/**
 * An hour slot on "today" guaranteed clear of every fixture: at least 2
 * hours from any of today's fixed-time events (morningSync 9, doctor 10,
 * focusBlock 11:30, budgetReview 14, clientCall 16) *and* at least 11 hours
 * from the current wall-clock hour, so it never collides with
 * EVENT_HAPPENING_NOW_TITLE's live +/-45min window either. A hardcoded hour
 * (e.g. "13:00 is always free") broke exactly this way once already — it
 * only held for whatever time of day the fixture set happened to be written
 * at, and started colliding with the live event whenever the suite ran near
 * 1pm.
 */
export function safeEmptyHour(): number {
  const occupiedHours = [9, 10, 11, 12, 14, 16];
  const nowHour = new Date().getHours();
  for (let candidate = 0; candidate < 24; candidate++) {
    const nearFixture = occupiedHours.some(
      (h) => Math.abs(h - candidate) <= 1,
    );
    const nearNow =
      Math.min(
        Math.abs(candidate - nowHour),
        24 - Math.abs(candidate - nowHour),
      ) < 2;
    if (!nearFixture && !nearNow) return candidate;
  }
  throw new Error("No safe empty hour found");
}

export function dayFor(
  offset: number | "next-month" | "last-month" | "next-year",
): Date {
  const base = today();
  if (offset === "next-month") return addMonths(base, 1);
  if (offset === "last-month") return subMonths(base, 1);
  if (offset === "next-year") return addYears(base, 1);
  return addDays(base, offset);
}

/**
 * Steps the main calendar's date navigator (data-testid `date-nav-next` /
 * `date-nav-previous`) until `date`'s month is the one on screen. The app
 * always boots showing the real current month and never auto-navigates to
 * wherever a `dayFor(offset)` date happens to land — any offset from ~20
 * days on can cross a month boundary depending on what day of the month the
 * suite happens to run on. Only valid while a view whose "next"/"previous"
 * step by month is active (month view, the default after gotoCalendar).
 */
export async function navigateToMonth(page: Page, date: Date) {
  const diff = differenceInCalendarMonths(date, today());
  const testId = diff >= 0 ? "date-nav-next" : "date-nav-previous";
  for (let i = 0; i < Math.abs(diff); i++) {
    await page.getByTestId(testId).click();
  }
}

/**
 * Same problem as navigateToMonth, but for the standalone react-day-picker
 * mini calendar (day view's sidebar): it manages its own displayed month
 * entirely independently of the app's date navigator — it initializes from
 * react-day-picker's own `month || defaultMonth || today` fallback chain,
 * which ignores the `selected` prop entirely, so it always mounts on the
 * real current month regardless of which date is selected. Steps it via its
 * own "Go to the Next/Previous Month" nav buttons (react-day-picker's
 * default aria-labels) until `date`'s month is visible.
 */
export async function navigateDatePickerToMonth(page: Page, date: Date) {
  const diff = differenceInCalendarMonths(date, today());
  const label =
    diff >= 0 ? "Go to the Next Month" : "Go to the Previous Month";
  for (let i = 0; i < Math.abs(diff); i++) {
    await page.getByRole("button", { name: label }).click();
  }
}

/** Official Playwright pattern for native HTML5 drag-and-drop: dispatch the
 * DragEvents manually since mouse-based dragTo() never fires
 * dragstart/dragover/drop for elements using the native `draggable` attribute
 * (as this app's DraggableEvent does). */
export async function dragToDroppable(
  page: Page,
  source: Locator,
  target: Locator,
) {
  // Real coordinates matter here, not just a bounding box: DroppableArea's
  // own onDrop ignores clientX/Y entirely (each slot already has fixed
  // hour/minute props), but RenderGroupedEvents' onDrop (the event-on-top-
  // of-event case) derives the target hour/minute from e.clientY, so a
  // dispatched event with no position would always resolve to hour 0.
  const box = await target.boundingBox();
  const point = box
    ? { clientX: box.x + box.width / 2, clientY: box.y + box.height / 2 }
    : {};

  const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
  await source.dispatchEvent("dragstart", { dataTransfer });
  await target.dispatchEvent("dragover", { dataTransfer, ...point });
  await target.dispatchEvent("drop", { dataTransfer, ...point });
  // No trailing dragend dispatch: the app's own onDrop handler
  // (DndProvider.handleEventDrop) already calls endDrag() itself once the
  // move is applied, so the native dragend event is redundant here — and if
  // the drop moved the event to a different cell, `source` now points at a
  // detached node (React already unmounted the old badge), so dispatching
  // anything further on it would just time out waiting for a node that's
  // intentionally gone.
}

/** re-resizable's bottom handle is a real mouse-driven (mousedown/mousemove
 * document listeners) 8px band straddling the element's bottom edge — genuine
 * mouse simulation, unlike drag-and-drop above. */
export async function resizeBottomEdge(
  page: Page,
  eventLocator: Locator,
  deltaYPixels: number,
) {
  const box = await eventLocator.boundingBox();
  if (!box) throw new Error("Could not read bounding box of resize target");

  const startX = box.x + box.width / 2;
  const startY = box.y + box.height - 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  // Firefox's re-resizable handling needs real event-loop turns between
  // mousemove events to track the drag correctly — Playwright's built-in
  // `steps` option dispatches all intermediate moves synchronously in one
  // tick, which Chromium/WebKit tolerate but Firefox does not (it was
  // observed shrinking to the library's MIN_DURATION floor instead of
  // growing, as if only the very last, largest-single-jump delta landed).
  const STEP_COUNT = 12;
  for (let i = 1; i <= STEP_COUNT; i++) {
    await page.mouse.move(
      startX,
      startY + (deltaYPixels * i) / STEP_COUNT,
    );
    await page.waitForTimeout(30);
  }
  await page.waitForTimeout(50);
  await page.mouse.up();
  // The resize-preview tooltip (ResizableEvent's floating time label) exits
  // with a framer-motion animation; on Firefox in particular it can still be
  // sitting over the event card's click point for a beat after mouseup,
  // intercepting the very next click. Give it time to actually unmount.
  await page.waitForTimeout(300);
}
