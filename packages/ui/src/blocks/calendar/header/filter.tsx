import { CheckIcon, Filter, RefreshCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/dropdown-menu";
import { Separator } from "../../../components/separator";
import { Toggle } from "../../../components/toggle";
import { useCalendar } from "../contexts/calendar-context";
import type { TEventColor } from "../types";

export default function FilterEvents() {
  const { selectedColors, filterEventsBySelectedColors, clearFilter, labels } =
    useCalendar();

  const colors: TEventColor[] = [
    "blue",
    "green",
    "red",
    "yellow",
    "purple",
    "orange",
  ];

  const colorLabels: Record<TEventColor, string> = {
    blue: labels.colorBlue,
    green: labels.colorGreen,
    red: labels.colorRed,
    yellow: labels.colorYellow,
    purple: labels.colorPurple,
    orange: labels.colorOrange,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Toggle
            variant="outline"
            aria-label={labels.filterEventsLabel}
            data-testid="filter-trigger"
            className="cursor-pointer w-fit"
          />
        }
      >
        <Filter className="h-4 w-4" />
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
              {colorLabels[color]}
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
          {labels.filterClear}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
