import { addDays, format, isSameDay, parseISO, startOfWeek } from "date-fns";
import { ScrollArea } from "../../../../components/scroll-area";
import { useCalendar } from "../../contexts/calendar-context";
import { AddEditEventDialog } from "../../dialogs/add-edit-event-dialog";
import { DroppableArea } from "../../dnd/droppable-area";
import {
  groupEvents,
  HOUR_HEIGHT_PX,
  useScrollPosition,
} from "../../helpers";
import type { IEvent } from "../../interfaces";
import { CalendarTimeline } from "./calendar-time-line";
import { RenderGroupedEvents } from "./render-grouped-events";
import { WeekViewMultiDayEventsRow } from "./week-view-multi-day-events-row";

interface IProps {
  singleDayEvents: IEvent[];
  multiDayEvents: IEvent[];
}

export function CalendarWeekView({ singleDayEvents, multiDayEvents }: IProps) {
  const { selectedDate, use24HourFormat, locale, labels } = useCalendar();
  const scrollPosition = useScrollPosition();

  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="animate-in fade-in duration-200">
      <div className="flex flex-col items-center justify-center border-b p-4 text-sm sm:hidden animate-in fade-in slide-in-from-top-2 duration-200">
        <p>{labels.weekViewMobileWarning}</p>
        <p>{labels.weekViewMobileSuggestion}</p>
      </div>

      <div className="flex-col sm:flex">
        <div>
          <WeekViewMultiDayEventsRow
            selectedDate={selectedDate}
            multiDayEvents={multiDayEvents}
          />

          {/* Week header */}
          <div className="relative z-20 flex border-b animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Time column header - responsive width */}
            <div className="w-18"></div>
            <div className="grid flex-1 grid-cols-7  border-l">
              {weekDays.map((day) => (
                <span
                  key={day.toISOString()}
                  data-testid="week-day-header"
                  data-date={format(day, "yyyy-MM-dd")}
                  className="py-1 sm:py-2 text-center text-xs font-medium text-muted-foreground"
                >
                  {/* Mobile: first letter of day abbreviation */}
                  <span className="block sm:hidden">
                    {format(day, "EEE", { locale }).charAt(0)}
                    <span className="block font-semibold text-muted-foreground text-xs">
                      {format(day, "d")}
                    </span>
                  </span>
                  {/* Desktop: short day name */}
                  <span className="hidden sm:inline">
                    {format(day, "EE", { locale })}{" "}
                    <span className="ml-1 font-semibold text-muted-foreground">
                      {format(day, "d")}
                    </span>
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <ScrollArea className="h-184" scrollPosition={scrollPosition}>
          <div className="flex">
            {/* Hours column */}
            <div className="relative w-18">
              {hours.map((hour, index) => (
                <div
                  key={hour}
                  className="relative"
                  style={{ height: `${HOUR_HEIGHT_PX}px` }}
                >
                  <div className="absolute -top-3 right-2 flex h-6 items-center">
                    {index !== 0 && (
                      <span className="text-xs text-muted-foreground">
                        {format(
                          new Date().setHours(hour, 0, 0, 0),
                          use24HourFormat ? "HH:00" : "h a",
                        )}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Week grid */}
            <div className="relative flex-1 border-l">
              <div className="grid grid-cols-7 divide-x">
                {weekDays.map((day) => {
                  const dayEvents = singleDayEvents.filter(
                    (event) =>
                      isSameDay(parseISO(event.startDate), day) ||
                      isSameDay(parseISO(event.endDate), day),
                  );
                  const groupedEvents = groupEvents(dayEvents);

                  return (
                    <div key={day.toISOString()} className="relative">
                      {hours.map((hour, index) => (
                        <div
                          key={hour}
                          className="relative"
                          style={{ height: `${HOUR_HEIGHT_PX}px` }}
                        >
                          {index !== 0 && (
                            <div className="pointer-events-none absolute inset-x-0 top-0 border-b"></div>
                          )}

                          <DroppableArea
                            date={day}
                            hour={hour}
                            minute={0}
                            className="absolute inset-x-0 top-0  h-12"
                          >
                            <AddEditEventDialog
                              startDate={day}
                              startTime={{ hour, minute: 0 }}
                            >
                              <div className="absolute inset-0 cursor-pointer transition-colors hover:bg-secondary" />
                            </AddEditEventDialog>
                          </DroppableArea>

                          <div className="pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed border-border"></div>

                          <DroppableArea
                            date={day}
                            hour={hour}
                            minute={30}
                            className="absolute inset-x-0 bottom-0 h-12"
                          >
                            <AddEditEventDialog
                              startDate={day}
                              startTime={{ hour, minute: 30 }}
                            >
                              <div className="absolute inset-0 cursor-pointer transition-colors hover:bg-secondary" />
                            </AddEditEventDialog>
                          </DroppableArea>
                        </div>
                      ))}

                      <RenderGroupedEvents
                        groupedEvents={groupedEvents}
                        day={day}
                      />
                    </div>
                  );
                })}
              </div>

              <CalendarTimeline />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
