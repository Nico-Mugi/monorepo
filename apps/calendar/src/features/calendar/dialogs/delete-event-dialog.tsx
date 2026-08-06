import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/shadcn/ui/alert-dialog";
import { Button } from "~/components/shadcn/ui/button";
import { useCalendar } from "~/features/calendar/contexts/calendar-context";
import * as m from "~/lib/paraglide/messages";

interface DeleteEventDialogProps {
  eventId: number;
}

export default function DeleteEventDialog({ eventId }: DeleteEventDialogProps) {
  const { removeEvent } = useCalendar();

  const deleteEvent = () => {
    try {
      removeEvent(eventId);
      toast.success(m.calendar_toast_event_deleted());
    } catch {
      toast.error(m.calendar_toast_event_delete_error());
    }
  };

  if (!eventId) {
    return null;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <TrashIcon />
          {m.calendar_dialog_delete_button()}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{m.calendar_dialog_delete_title()}</AlertDialogTitle>
          <AlertDialogDescription>
            {m.calendar_dialog_delete_description()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{m.calendar_dialog_delete_cancel()}</AlertDialogCancel>
          <AlertDialogAction onClick={deleteEvent}>
            {m.calendar_dialog_delete_continue()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
