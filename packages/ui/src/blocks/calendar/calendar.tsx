import type { Locale } from "date-fns";

import { CalendarBody } from "./calendar-body";
import { CalendarProvider } from "./contexts/calendar-context";
import { DndProvider } from "./contexts/dnd-context";
import { CalendarHeader } from "./header/calendar-header";
import type { IEvent, IUser } from "./interfaces";
import type { CalendarLabels } from "./labels";
import type { TCalendarView } from "./types";

export interface CalendarProps {
  events: IEvent[];
  users: IUser[];
  view?: TCalendarView;
  badge?: "dot" | "colored";
  labels?: Partial<CalendarLabels>;
  locale?: Locale;
}

export function Calendar({
  events,
  users,
  view = "month",
  badge,
  labels,
  locale,
}: CalendarProps) {
  return (
    <CalendarProvider
      events={events}
      users={users}
      view={view}
      badge={badge}
      labels={labels}
      locale={locale}
    >
      <DndProvider>
        <div className="w-full border rounded-xl">
          <CalendarHeader />
          <CalendarBody />
        </div>
      </DndProvider>
    </CalendarProvider>
  );
}
