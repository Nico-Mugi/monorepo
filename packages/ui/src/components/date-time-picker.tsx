import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "../utils/cn";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea, ScrollBar } from "./scroll-area";

export type DateTimePickerProps = {
  value?: Date;
  onChange: (date: Date) => void;
  use24HourFormat?: boolean;
  placeholder?: string;
  className?: string;
  invalid?: boolean;
};

export function DateTimePicker({
  value,
  onChange,
  use24HourFormat = false,
  placeholder = "MM/DD/YYYY hh:mm aa",
  className,
  invalid,
}: DateTimePickerProps) {
  function handleDateSelect(date: Date | undefined) {
    if (date) {
      onChange(date);
    }
  }

  function handleTimeChange(type: "hour" | "minute" | "ampm", timeValue: string) {
    const currentDate = value ?? new Date();
    const newDate = new Date(currentDate);

    if (type === "hour") {
      newDate.setHours(parseInt(timeValue, 10));
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(timeValue, 10));
    } else if (type === "ampm") {
      const hours = newDate.getHours();
      if (timeValue === "AM" && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (timeValue === "PM" && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }

    onChange(newDate);
  }

  return (
    <Popover modal={true}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            aria-invalid={invalid}
            className={cn(
              "w-full justify-start pl-3 text-left font-normal",
              !value && "text-muted-foreground",
              className,
            )}
          />
        }
      >
        {value ? (
          format(value, use24HourFormat ? "MM/dd/yyyy HH:mm" : "MM/dd/yyyy hh:mm aa")
        ) : (
          <span>{placeholder}</span>
        )}
        <CalendarIcon className="ml-auto size-4 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar mode="single" selected={value} onSelect={handleDateSelect} />
          <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex p-2 sm:flex-col">
                {Array.from({ length: use24HourFormat ? 24 : 12 }, (_, i) => i).map(
                  (hour) => (
                    <Button
                      key={hour}
                      size="icon"
                      variant={
                        value &&
                        value.getHours() % (use24HourFormat ? 24 : 12) ===
                          hour % (use24HourFormat ? 24 : 12)
                          ? "default"
                          : "ghost"
                      }
                      className="aspect-square shrink-0 sm:w-full"
                      onClick={() => handleTimeChange("hour", hour.toString())}
                    >
                      {hour.toString().padStart(2, "0")}
                    </Button>
                  ),
                )}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex p-2 sm:flex-col">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={value && value.getMinutes() === minute ? "default" : "ghost"}
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={() => handleTimeChange("minute", minute.toString())}
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            {!use24HourFormat && (
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex p-2 sm:flex-col">
                  {["AM", "PM"].map((ampm) => (
                    <Button
                      key={ampm}
                      size="icon"
                      variant={
                        value &&
                        ((ampm === "AM" && value.getHours() < 12) ||
                          (ampm === "PM" && value.getHours() >= 12))
                          ? "default"
                          : "ghost"
                      }
                      className="aspect-square shrink-0 sm:w-full"
                      onClick={() => handleTimeChange("ampm", ampm)}
                    >
                      {ampm}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
