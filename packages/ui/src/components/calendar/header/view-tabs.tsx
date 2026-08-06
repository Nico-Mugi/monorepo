import { memo } from "react";
import { CalendarRange, Columns, Grid2X2, Grid3X3, List } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../../tabs";
import { cn } from "../../../utils/cn";
import { useCalendar } from "../contexts/calendar-context";
import type { TCalendarView } from "../types";

function Views() {
  const { view, setView, labels } = useCalendar();

  const tabs = [
    {
      name: labels.viewAgenda,
      value: "agenda",
      icon: () => <CalendarRange className="h-4 w-4" />,
    },
    {
      name: labels.viewDay,
      value: "day",
      icon: () => <List className="h-4 w-4" />,
    },
    {
      name: labels.viewWeek,
      value: "week",
      icon: () => <Columns className="h-4 w-4" />,
    },
    {
      name: labels.viewMonth,
      value: "month",
      icon: () => <Grid3X3 className="h-4 w-4" />,
    },
    {
      name: labels.viewYear,
      value: "year",
      icon: () => <Grid2X2 className="h-4 w-4" />,
    },
  ];

  return (
    <Tabs
      value={view}
      onValueChange={(value) => setView(value as TCalendarView)}
      className="gap-4 sm:w-auto w-full"
    >
      <TabsList className="h-auto gap-2 rounded-xl p-1 w-full">
        {tabs.map(({ icon: Icon, name, value }) => {
          const isActive = view === value;

          return (
            <div
              key={value}
              style={{ width: isActive ? 120 : 32 }}
              className={cn(
                "flex h-8 items-center justify-center overflow-hidden rounded-md transition-[width] duration-300 ease-out",
                isActive ? "flex-1" : "flex-none",
              )}
              onClick={() => setView(value as TCalendarView)}
            >
              <TabsTrigger
                value={value}
                aria-label={name}
                className="flex h-8 w-full items-center justify-center gap-1.5 cursor-pointer"
              >
                <Icon />
                {isActive && (
                  <span className="font-medium animate-in fade-in duration-200">
                    {name}
                  </span>
                )}
              </TabsTrigger>
            </div>
          );
        })}
      </TabsList>
    </Tabs>
  );
}

export default memo(Views);
