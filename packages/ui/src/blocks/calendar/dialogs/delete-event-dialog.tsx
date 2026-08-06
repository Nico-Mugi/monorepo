import { TrashIcon } from "lucide-react";
import type { ReactElement } from "react";

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
} from "../../../components/alert-dialog";
import { Button } from "../../../components/button";
import { toast } from "../../../components/toast";
import { useCalendar } from "../contexts/calendar-context";

interface DeleteEventDialogProps {
  eventId: number;
}

export default function DeleteEventDialog({ eventId }: DeleteEventDialogProps) {
  const { removeEvent, labels } = useCalendar();

  const deleteEvent = () => {
    try {
      removeEvent(eventId);
      toast.add({ title: labels.toastEventDeleted, type: "success" });
    } catch {
      toast.add({ title: labels.toastEventDeleteError, type: "error" });
    }
  };

  if (!eventId) {
    return null;
  }

  const trigger = (
    <Button variant="destructive">
      <TrashIcon />
      {labels.dialogDeleteButton}
    </Button>
  ) as ReactElement;

  return (
    <AlertDialog>
      <AlertDialogTrigger render={trigger} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{labels.dialogDeleteTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {labels.dialogDeleteDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{labels.dialogDeleteCancel}</AlertDialogCancel>
          <AlertDialogAction onClick={deleteEvent}>
            {labels.dialogDeleteContinue}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
