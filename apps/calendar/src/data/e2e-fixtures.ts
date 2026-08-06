import { addDays, addMonths, addYears, setHours, setMinutes, startOfDay, subMonths } from "date-fns";
import { USERS_MOCK } from "~/data/mocks";
import type { IEvent, TEventColor } from "@repo/ui";

/**
 * Fully deterministic event fixtures used only when the `e2e` search param is
 * present (see routes/index.tsx + requests.ts). mockGenerator() is randomized
 * on every load, which makes it unusable for reproducible e2e assertions —
 * this fixture set exists purely so tests can know in advance exactly which
 * titles/colors/users/dates will render, without ever touching what real
 * visitors see (they never pass ?e2e=1).
 *
 * Dates are anchored to "today" (day granularity only, via date-fns) rather
 * than a hardcoded calendar date, so the fixture — and the default month/day
 * view that opens on today — always line up regardless of which day the
 * suite runs on. Only EVENT_HAPPENING_NOW is anchored to the live clock
 * (wide +/-45min margin) since it exists specifically to exercise the day
 * view's "happening now" indicator.
 */

const [MICHAEL, ALICE, ROBERT, EMILY] = USERS_MOCK;

function at(day: Date, hour: number, minute: number): Date {
  return setMinutes(setHours(day, hour), minute);
}

export interface E2eEventFixture {
  id: number;
  title: string;
  color: TEventColor;
  user: (typeof USERS_MOCK)[number];
  dayOffset: number | "next-month" | "last-month" | "next-year";
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  /** Only set for multi-day events: offset (from dayOffset) of the last day. */
  endDayOffset?: number;
}

export const E2E_FIXTURES = {
  morningSync: {
    id: 1,
    title: "Morning Sync",
    color: "green",
    user: ALICE,
    dayOffset: 0,
    startHour: 9,
    startMinute: 0,
    endHour: 9,
    endMinute: 30,
  },
  doctorAppointment: {
    id: 2,
    title: "Doctor Appointment",
    color: "blue",
    user: MICHAEL,
    dayOffset: 0,
    startHour: 10,
    startMinute: 0,
    endHour: 11,
    endMinute: 0,
  },
  focusBlock: {
    id: 3,
    title: "Focus Block",
    color: "purple",
    user: EMILY,
    dayOffset: 0,
    startHour: 11,
    startMinute: 30,
    endHour: 12,
    endMinute: 0,
  },
  budgetReview: {
    id: 4,
    title: "Budget Review",
    color: "yellow",
    user: EMILY,
    dayOffset: 0,
    startHour: 14,
    startMinute: 0,
    endHour: 15,
    endMinute: 0,
  },
  clientCall: {
    id: 5,
    title: "Client Call",
    color: "blue",
    user: ALICE,
    dayOffset: 0,
    startHour: 16,
    startMinute: 0,
    endHour: 16,
    endMinute: 30,
  },
  companyOffsite: {
    id: 6,
    title: "Company Offsite",
    color: "purple",
    user: MICHAEL,
    dayOffset: 1,
    endDayOffset: 3,
    startHour: 9,
    startMinute: 0,
    endHour: 17,
    endMinute: 0,
  },
  yogaClass: {
    id: 7,
    title: "Yoga Class",
    color: "green",
    user: ROBERT,
    dayOffset: 5,
    startHour: 7,
    startMinute: 0,
    endHour: 8,
    endMinute: 0,
  },
  overflowAlpha: {
    id: 8,
    title: "Overflow Alpha",
    color: "blue",
    user: MICHAEL,
    dayOffset: 4,
    startHour: 8,
    startMinute: 0,
    endHour: 8,
    endMinute: 30,
  },
  overflowBravo: {
    id: 9,
    title: "Overflow Bravo",
    color: "green",
    user: ALICE,
    dayOffset: 4,
    startHour: 9,
    startMinute: 0,
    endHour: 9,
    endMinute: 30,
  },
  overflowCharlie: {
    id: 10,
    title: "Overflow Charlie",
    color: "red",
    user: ROBERT,
    dayOffset: 4,
    startHour: 10,
    startMinute: 0,
    endHour: 10,
    endMinute: 30,
  },
  overflowDelta: {
    id: 11,
    title: "Overflow Delta",
    color: "yellow",
    user: EMILY,
    dayOffset: 4,
    startHour: 11,
    startMinute: 0,
    endHour: 11,
    endMinute: 30,
  },
  overflowEcho: {
    id: 12,
    title: "Overflow Echo",
    color: "purple",
    user: MICHAEL,
    dayOffset: 4,
    startHour: 12,
    startMinute: 0,
    endHour: 12,
    endMinute: 30,
  },
  annualConference: {
    id: 13,
    title: "Annual Conference",
    color: "orange",
    user: EMILY,
    dayOffset: 8,
    endDayOffset: 10,
    startHour: 9,
    startMinute: 0,
    endHour: 17,
    endMinute: 0,
  },
  nextMonthKickoff: {
    id: 14,
    title: "Next Month Kickoff",
    color: "blue",
    user: MICHAEL,
    dayOffset: "next-month",
    startHour: 10,
    startMinute: 0,
    endHour: 11,
    endMinute: 0,
  },
  lastMonthRetro: {
    id: 15,
    title: "Last Month Retro",
    color: "green",
    user: ALICE,
    dayOffset: "last-month",
    startHour: 10,
    startMinute: 0,
    endHour: 11,
    endMinute: 0,
  },
  futureRoadmap: {
    id: 16,
    title: "Future Roadmap",
    color: "red",
    user: ROBERT,
    dayOffset: "next-year",
    startHour: 10,
    startMinute: 0,
    endHour: 11,
    endMinute: 0,
  },
} as const satisfies Record<string, E2eEventFixture>;

export const EVENT_HAPPENING_NOW_TITLE = "Live Incident Response";

function resolveDay(today: Date, offset: E2eEventFixture["dayOffset"]): Date {
  if (offset === "next-month") return addMonths(today, 1);
  if (offset === "last-month") return subMonths(today, 1);
  if (offset === "next-year") return addYears(today, 1);
  return addDays(today, offset);
}

export function buildE2eEvents(now: Date = new Date()): IEvent[] {
  const today = startOfDay(now);

  const fixedEvents: IEvent[] = (
    Object.values(E2E_FIXTURES) as E2eEventFixture[]
  ).map((fixture) => {
    const startDay = resolveDay(today, fixture.dayOffset);
    const endDay =
      fixture.endDayOffset !== undefined
        ? addDays(startDay, fixture.endDayOffset - (fixture.dayOffset as number))
        : startDay;

    return {
      id: fixture.id,
      title: fixture.title,
      color: fixture.color,
      description: `E2E fixture event: ${fixture.title}.`,
      user: fixture.user,
      startDate: at(startDay, fixture.startHour, fixture.startMinute).toISOString(),
      endDate: at(endDay, fixture.endHour, fixture.endMinute).toISOString(),
    };
  });

  const happeningNow: IEvent = {
    id: 100,
    title: EVENT_HAPPENING_NOW_TITLE,
    color: "red",
    description: `E2E fixture event: ${EVENT_HAPPENING_NOW_TITLE}.`,
    user: ROBERT,
    startDate: new Date(now.getTime() - 45 * 60_000).toISOString(),
    endDate: new Date(now.getTime() + 45 * 60_000).toISOString(),
  };

  return [...fixedEvents, happeningNow];
}
