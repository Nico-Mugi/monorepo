import { DotIcon, PaletteIcon, SettingsIcon } from "lucide-react";
import type { ChangeEvent } from "react";
import { Button } from "~/components/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/shadcn/ui/dropdown-menu";
import { Input } from "~/components/shadcn/ui/input";
import { Switch } from "~/components/shadcn/ui/switch";
import {
  MAX_SCROLL_HOUR,
  MIN_SCROLL_HOUR,
  useCalendar,
} from "~/features/calendar/contexts/calendar-context";
import * as m from "~/lib/paraglide/messages.js";

export function Settings() {
  const {
    badgeVariant,
    setBadgeVariant,
    use24HourFormat,
    toggleTimeFormat,
    startOfDayHour,
    setStartOfDayHour,
    agendaModeGroupBy,
    setAgendaModeGroupBy,
  } = useCalendar();

  const isDotVariant = badgeVariant === "dot";

  const onChangeStartOfDay = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (
      !Number.isNaN(val) &&
      val >= MIN_SCROLL_HOUR &&
      val <= MAX_SCROLL_HOUR
    ) {
      setStartOfDayHour(val);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Calendar settings"
          data-testid="settings-trigger"
        >
          <SettingsIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{m.calendar_settings_label()}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            {m.calendar_settings_dot_badge()}
            <DropdownMenuShortcut>
              <Switch
                icon={
                  isDotVariant ? (
                    <DotIcon className="w-4 h-4" />
                  ) : (
                    <PaletteIcon className="w-4 h-4" />
                  )
                }
                checked={isDotVariant}
                onCheckedChange={(checked) =>
                  setBadgeVariant(checked ? "dot" : "colored")
                }
              />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem>
            {m.calendar_settings_24h()}
            <DropdownMenuShortcut>
              <Switch
                icon={
                  use24HourFormat ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-clock-24"
                    >
                      <title>{m.calendar_settings_24h_title()}</title>
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M3 12a9 9 0 0 0 5.998 8.485m12.002 -8.485a9 9 0 1 0 -18 0" />
                      <path d="M12 7v5" />
                      <path d="M12 15h2a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-1a1 1 0 0 0 -1 1v1a1 1 0 0 0 1 1h2" />
                      <path d="M18 15v2a1 1 0 0 0 1 1h1" />
                      <path d="M21 15v6" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-clock-12"
                    >
                      <title>{m.calendar_settings_12h_title()}</title>
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M3 12a9 9 0 0 0 9 9m9 -9a9 9 0 1 0 -18 0" />
                      <path d="M12 7v5l.5 .5" />
                      <path d="M18 15h2a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-1a1 1 0 0 0 -1 1v1a1 1 0 0 0 1 1h2" />
                      <path d="M15 21v-6" />
                    </svg>
                  )
                }
                checked={use24HourFormat}
                onCheckedChange={toggleTimeFormat}
              />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem>
            {m.calendar_settings_days_start_at()}
            <DropdownMenuShortcut>
              <Input
                type="number"
                value={startOfDayHour}
                max={MAX_SCROLL_HOUR}
                min={MIN_SCROLL_HOUR}
                onChange={onChangeStartOfDay}
                className="w-16"
              />
            </DropdownMenuShortcut>
            {m.calendar_settings_h()}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>{m.calendar_settings_agenda_group_by()}</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={agendaModeGroupBy}
            onValueChange={(value) =>
              setAgendaModeGroupBy(value as "date" | "color")
            }
          >
            <DropdownMenuRadioItem value="date">
              {m.calendar_settings_group_by_date()}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="color">
              {m.calendar_settings_group_by_color()}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
