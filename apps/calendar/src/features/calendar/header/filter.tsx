import { CheckIcon, Filter, RefreshCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/shadcn/ui/dropdown-menu";
import { Separator } from "~/components/shadcn/ui/separator";
import { Toggle } from "~/components/shadcn/ui/toggle";
import { useCalendar } from "~/features/calendar/contexts/calendar-context";
import type { TEventColor } from "~/features/calendar/types";
import * as m from "~/lib/paraglide/messages";

const colorLabel = (color: TEventColor): string => {
  const labels: Record<TEventColor, () => string> = {
    blue: m.calendar_color_blue,
    green: m.calendar_color_green,
    red: m.calendar_color_red,
    yellow: m.calendar_color_yellow,
    purple: m.calendar_color_purple,
    orange: m.calendar_color_orange,
  };
  return labels[color]();
};

export default function FilterEvents() {
  const { selectedColors, filterEventsBySelectedColors, clearFilter } =
    useCalendar();

  const colors: TEventColor[] = [
    "blue",
    "green",
    "red",
    "yellow",
    "purple",
    "orange",
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Toggle
          variant="outline"
          aria-label="Filter events"
          data-testid="filter-trigger"
          className="cursor-pointer w-fit"
        >
          <Filter className="h-4 w-4" />
        </Toggle>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-37.5">
        {colors.map((color) => (
          <DropdownMenuItem
            key={color}
            className="flex items-center gap-2 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              filterEventsBySelectedColors(color);
            }}
          >
            <div
              className={`size-3.5 rounded-full bg-${color}-600 dark:bg-${color}-700`}
            />
            <span className="flex justify-center items-center gap-2">
              {colorLabel(color)}
              <span>
                {selectedColors.includes(color) && (
                  <span className="text-blue-500">
                    <CheckIcon className="size-4" />
                  </span>
                )}
              </span>
            </span>
          </DropdownMenuItem>
        ))}
        <Separator className="my-2" />
        <DropdownMenuItem
          disabled={selectedColors.length === 0}
          className="flex gap-2 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            clearFilter();
          }}
        >
          <RefreshCcw className="size-3.5" />
          {m.calendar_filter_clear()}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
