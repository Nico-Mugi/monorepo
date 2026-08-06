import { addDays, format, startOfWeek } from "date-fns";
import { useMemo } from "react";
import { useCalendar } from "../../contexts/calendar-context";
import {
  calculateMonthEventPositions,
  getCalendarCells,
} from "../../helpers";
import type { IEvent } from "../../interfaces";
import { DayCell } from "./day-cell";

interface IProps {
  singleDayEvents: IEvent[];
  multiDayEvents: IEvent[];
}

export function CalendarMonthView({ singleDayEvents, multiDayEvents }: IProps) {
  const { selectedDate, locale } = useCalendar();

  const allEvents = [...multiDayEvents, ...singleDayEvents];

  const cells = useMemo(() => getCalendarCells(selectedDate), [selectedDate]);

  const eventPositions = useMemo(
    () =>
      calculateMonthEventPositions(
        multiDayEvents,
        singleDayEvents,
        selectedDate,
      ),
    [multiDayEvents, singleDayEvents, selectedDate],
  );

  const weekDays = useMemo(() => {
    const start = startOfWeek(new Date());
    return Array.from({ length: 7 }, (_, i) =>
      format(addDays(start, i), "EEE", { locale }),
    );
  }, [locale]);

  return (
    <div className="animate-in fade-in duration-200">
      <div className="grid grid-cols-7">
        {weekDays.map((day) => (
          <div
            key={day}
            className="flex items-center justify-center py-2 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <span className="text-xs font-medium text-muted-foreground">{day}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 overflow-hidden">
        {cells.map((cell) => (
          <DayCell
            key={cell.date.toISOString()}
            cell={cell}
            events={allEvents}
            eventPositions={eventPositions}
          />
        ))}
      </div>
    </div>
  );
}
