import { format, parseISO } from "date-fns";
import { Calendar, Clock, Text, User } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "~/components/shadcn/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/shadcn/ui/dialog";
import { ScrollArea } from "~/components/shadcn/ui/scroll-area";
import { useCalendar } from "~/features/calendar/contexts/calendar-context";
import { AddEditEventDialog } from "~/features/calendar/dialogs/add-edit-event-dialog";
import { formatTime } from "~/features/calendar/helpers";
import type { IEvent } from "~/features/calendar/interfaces";
import { getDateFnsLocale } from "~/lib/date-locale";
import * as m from "~/lib/paraglide/messages";

interface IProps {
  event: IEvent;
  children: ReactNode;
}

export function EventDetailsDialog({ event, children }: IProps) {
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);
  const { use24HourFormat, removeEvent } = useCalendar();

  const deleteEvent = (eventId: number) => {
    try {
      removeEvent(eventId);
      toast.success(m.calendar_toast_event_deleted());
    } catch {
      toast.error(m.calendar_toast_event_delete_error());
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-4 p-4">
            <div className="flex items-start gap-2">
              <User className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{m.calendar_dialog_responsible()}</p>
                <p className="text-sm text-muted-foreground">
                  {event.user.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{m.calendar_dialog_start_date()}</p>
                <p className="text-sm text-muted-foreground">
                  {format(startDate, "EEEE dd MMMM", {
                    locale: getDateFnsLocale(),
                  })}
                  <span className="mx-1">{m.calendar_dialog_at()}</span>
                  {formatTime(parseISO(event.startDate), use24HourFormat)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{m.calendar_dialog_end_date()}</p>
                <p className="text-sm text-muted-foreground">
                  {format(endDate, "EEEE dd MMMM", {
                    locale: getDateFnsLocale(),
                  })}
                  <span className="mx-1">{m.calendar_dialog_at()}</span>
                  {formatTime(parseISO(event.endDate), use24HourFormat)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Text className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {m.calendar_dialog_description_label()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {event.description}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-2">
          <AddEditEventDialog event={event}>
            <Button variant="outline">{m.calendar_dialog_edit_button()}</Button>
          </AddEditEventDialog>
          <Button variant="destructive" onClick={() => deleteEvent(event.id)}>
            {m.calendar_dialog_delete_event_button()}
          </Button>
        </div>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
