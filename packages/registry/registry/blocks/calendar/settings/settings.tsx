import { SettingsIcon } from "lucide-react";
import type { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  MAX_SCROLL_HOUR,
  MIN_SCROLL_HOUR,
  useCalendar,
} from "../contexts/calendar-context";

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
    labels,
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
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            aria-label={labels.settingsTrigger}
            data-testid="settings-trigger"
          />
        }
      >
        <SettingsIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{labels.settingsLabel}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            {labels.settingsDotBadge}
            <DropdownMenuShortcut>
              <Switch
                checked={isDotVariant}
                onCheckedChange={(checked) =>
                  setBadgeVariant(checked ? "dot" : "colored")
                }
              />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem>
            {labels.settings24h}
            <DropdownMenuShortcut>
              <Switch checked={use24HourFormat} onCheckedChange={toggleTimeFormat} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <div
            data-testid="settings-days-start-at"
            className="relative flex cursor-default items-center gap-2.5 rounded-2xl px-3 py-2 text-sm font-medium select-none"
          >
            {labels.settingsDaysStartAt}
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
            {labels.settingsH}
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={agendaModeGroupBy}
          onValueChange={(value) =>
            setAgendaModeGroupBy(value as "date" | "color")
          }
        >
          <DropdownMenuLabel>{labels.settingsAgendaGroupBy}</DropdownMenuLabel>
          <DropdownMenuRadioItem value="date">
            {labels.settingsGroupByDate}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="color">
            {labels.settingsGroupByColor}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
