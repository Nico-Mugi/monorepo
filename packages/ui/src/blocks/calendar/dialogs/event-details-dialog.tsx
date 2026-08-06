import { format, parseISO } from "date-fns";
import { Calendar, Clock, Text, User } from "lucide-react";
import type { ReactElement } from "react";

import { Button } from "../../../components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/dialog";
import { ScrollArea } from "../../../components/scroll-area";
import { toast } from "../../../components/toast";
import { useCalendar } from "../contexts/calendar-context";
import { AddEditEventDialog } from "./add-edit-event-dialog";
import { formatTime } from "../helpers";
import type { IEvent } from "../interfaces";

interface IProps {
  event: IEvent;
  children: ReactElement;
}

export function EventDetailsDialog({ event, children }: IProps) {
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);
  const { use24HourFormat, removeEvent, locale, labels } = useCalendar();

  const deleteEvent = (eventId: number) => {
    try {
      removeEvent(eventId);
      toast.add({ title: labels.toastEventDeleted, type: "success" });
    } catch {
      toast.add({ title: labels.toastEventDeleteError, type: "error" });
    }
  };

  return (
    <Dialog>
      <DialogTrigger render={children} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-4 p-4">
            <div className="flex items-start gap-2">
              <User className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{labels.dialogResponsible}</p>
                <p className="text-sm text-muted-foreground">
                  {event.user.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{labels.dialogStartDate}</p>
                <p className="text-sm text-muted-foreground">
                  {format(startDate, "EEEE dd MMMM", { locale })}
                  <span className="mx-1">{labels.dialogAt}</span>
                  {formatTime(parseISO(event.startDate), use24HourFormat)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{labels.dialogEndDate}</p>
                <p className="text-sm text-muted-foreground">
                  {format(endDate, "EEEE dd MMMM", { locale })}
                  <span className="mx-1">{labels.dialogAt}</span>
                  {formatTime(parseISO(event.endDate), use24HourFormat)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Text className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {labels.dialogDescriptionLabel}
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
            <Button variant="outline">{labels.dialogEditButton}</Button>
          </AddEditEventDialog>
          <Button variant="destructive" onClick={() => deleteEvent(event.id)}>
            {labels.dialogDeleteEventButton}
          </Button>
        </div>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
