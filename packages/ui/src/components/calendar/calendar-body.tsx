import { isSameDay, parseISO } from "date-fns";
import { useCalendar } from "./contexts/calendar-context";
import { AgendaEvents } from "./views/agenda-view/agenda-events";
import { CalendarMonthView } from "./views/month-view/calendar-month-view";
import { CalendarDayView } from "./views/week-and-day-view/calendar-day-view";
import { CalendarWeekView } from "./views/week-and-day-view/calendar-week-view";
import { CalendarYearView } from "./views/year-view/calendar-year-view";

export function CalendarBody() {
  const { view, events } = useCalendar();

  const singleDayEvents = events.filter((event) => {
    const startDate = parseISO(event.startDate);
    const endDate = parseISO(event.endDate);
    return isSameDay(startDate, endDate);
  });

  const multiDayEvents = events.filter((event) => {
    const startDate = parseISO(event.startDate);
    const endDate = parseISO(event.endDate);
    return !isSameDay(startDate, endDate);
  });

  return (
    <div className="w-full h-full overflow-scroll relative">
      <div key={view} className="animate-in fade-in duration-200">
        {view === "month" && (
          <CalendarMonthView
            singleDayEvents={singleDayEvents}
            multiDayEvents={multiDayEvents}
          />
        )}
        {view === "week" && (
          <CalendarWeekView
            singleDayEvents={singleDayEvents}
            multiDayEvents={multiDayEvents}
          />
        )}
        {view === "day" && (
          <CalendarDayView
            singleDayEvents={singleDayEvents}
            multiDayEvents={multiDayEvents}
          />
        )}
        {view === "year" && (
          <CalendarYearView
            singleDayEvents={singleDayEvents}
            multiDayEvents={multiDayEvents}
          />
        )}
        {view === "agenda" && <AgendaEvents />}
      </div>
    </div>
  );
}
