import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "../../../components/badge";
import { Button } from "../../../components/button";
import { useCalendar } from "../contexts/calendar-context";

import { getEventsCount, navigateDate, rangeText } from "../helpers";

import type { IEvent } from "../interfaces";
import type { TCalendarView } from "../types";

interface IProps {
  view: TCalendarView;
  events: IEvent[];
}

export function DateNavigator({ view, events }: IProps) {
  const { selectedDate, setSelectedDate, locale, labels } = useCalendar();

  const month = format(selectedDate, "MMMM", { locale });
  const year = selectedDate.getFullYear();

  const eventCount = useMemo(
    () => getEventsCount(events, selectedDate, view),
    [events, selectedDate, view],
  );

  const handlePrevious = () =>
    setSelectedDate(navigateDate(selectedDate, view, "previous"));
  const handleNext = () =>
    setSelectedDate(navigateDate(selectedDate, view, "next"));

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold animate-in fade-in slide-in-from-left-2 duration-200">
          {month} {year}
        </span>
        <Badge
          key={eventCount}
          variant="secondary"
          className="animate-in fade-in zoom-in-95 duration-200"
        >
          {labels.eventCount(eventCount)}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label={labels.previous}
          data-testid="date-nav-previous"
          className="h-6 w-6 transition-transform hover:scale-105 active:scale-95"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <p className="text-sm text-muted-foreground animate-in fade-in duration-200">
          {rangeText(view, selectedDate, locale)}
        </p>

        <Button
          variant="outline"
          size="icon"
          aria-label={labels.next}
          data-testid="date-nav-next"
          className="h-6 w-6 transition-transform hover:scale-105 active:scale-95"
          onClick={handleNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
