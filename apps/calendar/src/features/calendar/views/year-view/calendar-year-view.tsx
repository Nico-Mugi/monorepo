import {
  addDays,
  format,
  getYear,
  isSameDay,
  isSameMonth,
  startOfWeek,
} from "date-fns";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { cn } from "~/lib/shadcn/utils";
import { staggerContainer, transition } from "~/features/calendar/animations";
import { useCalendar } from "~/features/calendar/contexts/calendar-context";
import { EventListDialog } from "~/features/calendar/dialogs/events-list-dialog";
import { getCalendarCells } from "~/features/calendar/helpers";
import type { IEvent } from "~/features/calendar/interfaces";
import { EventBullet } from "~/features/calendar/views/month-view/event-bullet";
import { getDateFnsLocale } from "~/lib/date-locale";

interface IProps {
  singleDayEvents: IEvent[];
  multiDayEvents: IEvent[];
}

export function CalendarYearView({ singleDayEvents, multiDayEvents }: IProps) {
  const { selectedDate, setSelectedDate } = useCalendar();
  const currentYear = getYear(selectedDate);
  const allEvents = [...multiDayEvents, ...singleDayEvents];
  const locale = getDateFnsLocale();

  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        index: i,
        date: new Date(currentYear, i, 1),
        name: format(new Date(currentYear, i, 1), "MMMM", { locale }),
      })),
    [currentYear, locale],
  );

  const weekDays = useMemo(() => {
    const start = startOfWeek(new Date());
    return Array.from({ length: 7 }, (_, i) =>
      format(addDays(start, i), "EEEEE", { locale }),
    );
  }, [locale]);

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 sm:p-6">
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr"
      >
        {months.map(({ index: monthIndex, date: monthDate, name: month }) => {
          const cells = getCalendarCells(monthDate);

          return (
            <motion.div
              key={`month-${monthIndex}-${currentYear}`}
              className="flex flex-col border border-border rounded-lg shadow-sm overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: monthIndex * 0.05, ...transition }}
              aria-label={`${month} ${currentYear}`}
            >
              <button
                type="button"
                className="w-full px-3 py-2 text-center font-semibold text-sm sm:text-base cursor-pointer hover:bg-primary/20 transition-colors bg-transparent border-none appearance-none"
                onClick={() =>
                  setSelectedDate(new Date(currentYear, monthIndex, 1))
                }
                aria-label={month}
              >
                {month}
              </button>

              <div className="grid grid-cols-7 text-center text-xs font-medium text-muted-foreground py-2">
                {weekDays.map((day, dayIndex) => (
                  <div
                    key={`weekday-${dayIndex}-${currentYear}`}
                    className="p-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-0.5 p-1.5 grow text-xs">
                {cells.map((cell) => {
                  const isCurrentMonth = isSameMonth(cell.date, monthDate);
                  const isToday = isSameDay(cell.date, new Date());
                  const dayEvents = allEvents.filter((event) =>
                    isSameDay(new Date(event.startDate), cell.date),
                  );
                  const hasEvents = dayEvents.length > 0;

                  return (
                    <div
                      key={cell.date.toISOString()}
                      data-testid="year-day-cell"
                      data-date={format(cell.date, "yyyy-MM-dd")}
                      className={cn(
                        "flex flex-col items-center justify-start p-1 min-h-8 relative",
                        !isCurrentMonth && "text-muted-foreground/40",
                        hasEvents && isCurrentMonth
                          ? "cursor-pointer hover:bg-accent/20 hover:rounded-md"
                          : "cursor-default",
                      )}
                    >
                      {isCurrentMonth && hasEvents ? (
                        <EventListDialog date={cell.date} events={dayEvents}>
                          <div className="w-full h-full flex flex-col items-center justify-start gap-0.5">
                            <span
                              className={cn(
                                "size-5 flex items-center justify-center font-medium",
                                isToday &&
                                  "rounded-full bg-primary text-primary-foreground",
                              )}
                            >
                              {cell.day}
                            </span>
                            <div className="flex justify-center items-center gap-0.5">
                              {dayEvents.length <= 2 ? (
                                dayEvents
                                  .slice(0, 2)
                                  .map((event) => (
                                    <EventBullet
                                      key={event.id}
                                      color={event.color}
                                      className="size-1.5"
                                    />
                                  ))
                              ) : (
                                <div className="flex flex-col justify-center items-center">
                                  <EventBullet
                                    color={dayEvents[0].color}
                                    className="size-1.5"
                                  />
                                  <span className="text-[0.6rem]">
                                    +{dayEvents.length - 1}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </EventListDialog>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-start">
                          <span className="size-5 flex items-center justify-center font-medium">
                            {cell.day}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
