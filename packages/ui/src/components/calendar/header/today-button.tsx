import { format } from "date-fns";
import { Button } from "../../button";
import { useCalendar } from "../contexts/calendar-context";

export function TodayButton() {
  const { setSelectedDate, locale, labels } = useCalendar();

  const today = new Date();
  const handleClick = () => setSelectedDate(today);

  return (
    <Button
      variant="outline"
      aria-label={labels.today}
      data-testid="today-button"
      className="flex h-14 w-14 flex-col items-center justify-center p-0 text-center transition-transform hover:scale-105 active:scale-95"
      onClick={handleClick}
    >
      <span className="w-full animate-in fade-in slide-in-from-top-2 duration-200 bg-primary py-1 text-xs font-semibold text-primary-foreground">
        {format(today, "MMM", { locale }).toUpperCase()}
      </span>
      <span className="text-lg font-bold animate-in fade-in slide-in-from-bottom-2 duration-200">
        {format(today, "d", { locale })}
      </span>
    </Button>
  );
}
