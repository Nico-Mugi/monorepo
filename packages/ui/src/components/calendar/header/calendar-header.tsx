import { Plus } from "lucide-react";

import { Button } from "../../button";
import { useCalendar } from "../contexts/calendar-context";
import { AddEditEventDialog } from "../dialogs/add-edit-event-dialog";
import { DateNavigator } from "./date-navigator";
import FilterEvents from "./filter";
import { TodayButton } from "./today-button";
import { UserSelect } from "./user-select";
import { Settings } from "../settings/settings";
import Views from "./view-tabs";

export function CalendarHeader() {
  const { view, events, labels } = useCalendar();

  return (
    <div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
        <TodayButton />
        <DateNavigator view={view} events={events} />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-1.5 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="options flex-wrap flex items-center gap-4 md:gap-2">
          <FilterEvents />
          <Views />
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-1.5">
          <UserSelect />

          <AddEditEventDialog>
            <Button data-testid="header-add-event-trigger">
              <Plus className="h-4 w-4" />
              {labels.addEvent}
            </Button>
          </AddEditEventDialog>
        </div>
        <Settings />
      </div>
    </div>
  );
}
