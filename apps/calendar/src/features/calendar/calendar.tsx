import { CalendarBody } from "~/features/calendar/calendar-body";
import { CalendarProvider } from "~/features/calendar/contexts/calendar-context";
import { DndProvider } from "~/features/calendar/contexts/dnd-context";
import { CalendarHeader } from "~/features/calendar/header/calendar-header";
import type { IEvent, IUser } from "~/features/calendar/interfaces";

interface CalendarProps {
  events: IEvent[];
  users: IUser[];
}

export function Calendar({ events, users }: CalendarProps) {
  return (
    <CalendarProvider events={events} users={users} view="month">
      <DndProvider>
        <div className="w-full border rounded-xl">
          <CalendarHeader />
          <CalendarBody />
        </div>
      </DndProvider>
    </CalendarProvider>
  );
}
