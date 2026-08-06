import { useForm } from "@tanstack/react-form";
import { addMinutes, format, set } from "date-fns";
import { type ReactElement, useEffect, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { DateTimeField } from "@/components/ui/date-time-field";
import { SelectField } from "@/components/ui/select-field";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/responsive-modal";
import { TextField } from "@/components/ui/text-field";
import { TextareaField } from "@/components/ui/textarea-field";
import { toast } from "@/components/ui/toast";
import { COLORS } from "../constants";
import { useCalendar } from "../contexts/calendar-context";
import { useDisclosure } from "../hooks";
import type { IEvent } from "../interfaces";
import { eventSchema } from "../schemas";
import type { TEventColor } from "../types";

interface IProps {
  children: ReactElement;
  startDate?: Date;
  startTime?: { hour: number; minute: number };
  event?: IEvent;
}

export function AddEditEventDialog({
  children,
  startDate,
  startTime,
  event,
}: IProps) {
  const { isOpen, onClose, onToggle } = useDisclosure();
  const { addEvent, updateEvent, use24HourFormat, labels } = useCalendar();
  const isEditing = !!event;

  const colorOptions = COLORS.map((color) => {
    const colorLabels: Record<TEventColor, string> = {
      blue: labels.colorBlue,
      green: labels.colorGreen,
      red: labels.colorRed,
      yellow: labels.colorYellow,
      purple: labels.colorPurple,
      orange: labels.colorOrange,
    };
    return {
      value: color,
      label: (
        <div className="flex items-center gap-2">
          <div className={`size-3.5 rounded-full bg-${color}-600 dark:bg-${color}-700`} />
          {colorLabels[color]}
        </div>
      ),
    };
  });

  const initialDates = useMemo(() => {
    if (!isEditing && !event) {
      if (!startDate) {
        const now = new Date();
        return { startDate: now, endDate: addMinutes(now, 30) };
      }
      const start = startTime
        ? set(new Date(startDate), {
            hours: startTime.hour,
            minutes: startTime.minute,
            seconds: 0,
          })
        : new Date(startDate);
      const end = addMinutes(start, 30);
      return { startDate: start, endDate: end };
    }

    return {
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
    };
  }, [startDate, startTime, event, isEditing]);

  const form = useForm({
    defaultValues: {
      title: event?.title ?? "",
      description: event?.description ?? "",
      startDate: initialDates.startDate,
      endDate: initialDates.endDate,
      color: (event?.color ?? "blue") as TEventColor,
    },
    validators: { onChange: eventSchema },
    onSubmit: ({ value }) => {
      try {
        const formattedEvent: IEvent = {
          ...value,
          startDate: format(value.startDate, "yyyy-MM-dd'T'HH:mm:ss"),
          endDate: format(value.endDate, "yyyy-MM-dd'T'HH:mm:ss"),
          id: isEditing ? event.id : Math.floor(Math.random() * 1000000),
          user: isEditing
            ? event.user
            : {
                id: Math.floor(Math.random() * 1000000).toString(),
                name: "Nicolas Thouvenin",
                picturePath: null,
              },
          color: value.color,
        };

        if (isEditing) {
          updateEvent(formattedEvent);
          toast.add({ title: labels.toastEventUpdated, type: "success" });
        } else {
          addEvent(formattedEvent);
          toast.add({ title: labels.toastEventCreated, type: "success" });
        }

        onClose();
        form.reset();
      } catch (error) {
        console.error(`Error ${isEditing ? "editing" : "adding"} event:`, error);
        toast.add({
          title: isEditing ? labels.toastEventEditFailed : labels.toastEventAddFailed,
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    form.reset({
      title: event?.title ?? "",
      description: event?.description ?? "",
      startDate: initialDates.startDate,
      endDate: initialDates.endDate,
      color: (event?.color ?? "blue") as TEventColor,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, initialDates]);

  return (
    <Modal open={isOpen} onOpenChange={onToggle} modal={false}>
      <ModalTrigger render={children} />
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {isEditing ? labels.dialogEditEventTitle : labels.dialogAddEventTitle}
          </ModalTitle>
          <ModalDescription>
            {isEditing
              ? labels.dialogEditEventDescription
              : labels.dialogAddEventDescription}
          </ModalDescription>
        </ModalHeader>

        <form
          id="event-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="grid gap-4 py-4"
        >
          <form.Field name="title">
            {(field) => (
              <TextField
                field={field}
                label={labels.dialogFieldTitle}
                placeholder={labels.dialogTitlePlaceholder}
              />
            )}
          </form.Field>
          <form.Field name="startDate">
            {(field) => (
              <DateTimeField
                field={field}
                label={labels.dialogStartDate}
                use24HourFormat={use24HourFormat}
              />
            )}
          </form.Field>
          <form.Field name="endDate">
            {(field) => (
              <DateTimeField
                field={field}
                label={labels.dialogEndDate}
                use24HourFormat={use24HourFormat}
              />
            )}
          </form.Field>
          <form.Field name="color">
            {(field) => (
              <SelectField
                field={field}
                label={labels.dialogFieldVariant}
                placeholder={labels.dialogVariantPlaceholder}
                options={colorOptions}
              />
            )}
          </form.Field>
          <form.Field name="description">
            {(field) => (
              <TextareaField
                field={field}
                label={labels.dialogFieldDescription}
                placeholder={labels.dialogDescriptionPlaceholder}
              />
            )}
          </form.Field>
        </form>

        <ModalFooter className="flex justify-end gap-2">
          <ModalClose render={<Button type="button" variant="outline" />}>
            {labels.dialogCancel}
          </ModalClose>
          <Button form="event-form" type="submit">
            {isEditing ? labels.dialogSaveChanges : labels.dialogCreateEvent}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
