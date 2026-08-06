import { zodResolver } from "@hookform/resolvers/zod";
import { addMinutes, format, set } from "date-fns";
import { type ReactNode, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/shadcn/ui/button";
import { DateTimePicker } from "~/components/shadcn/ui/date-time-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/shadcn/ui/form";
import { Input } from "~/components/shadcn/ui/input";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "~/components/shadcn/ui/responsive-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/shadcn/ui/select";
import { Textarea } from "~/components/shadcn/ui/textarea";
import { COLORS } from "~/features/calendar/constants";
import { useCalendar } from "~/features/calendar/contexts/calendar-context";
import { useDisclosure } from "~/features/calendar/hooks";
import type { IEvent } from "~/features/calendar/interfaces";
import { eventSchema, type TEventFormData } from "~/features/calendar/schemas";
import type { TEventColor } from "~/features/calendar/types";
import * as m from "~/lib/paraglide/messages";

const colorLabel = (color: TEventColor): string => {
  const labels: Record<TEventColor, () => string> = {
    blue: m.calendar_color_blue,
    green: m.calendar_color_green,
    red: m.calendar_color_red,
    yellow: m.calendar_color_yellow,
    purple: m.calendar_color_purple,
    orange: m.calendar_color_orange,
  };
  return labels[color]();
};

interface IProps {
  children: ReactNode;
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
  const { addEvent, updateEvent } = useCalendar();
  const isEditing = !!event;

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

  const form = useForm<TEventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title ?? "",
      description: event?.description ?? "",
      startDate: initialDates.startDate,
      endDate: initialDates.endDate,
      color: event?.color ?? "blue",
    },
  });

  useEffect(() => {
    form.reset({
      title: event?.title ?? "",
      description: event?.description ?? "",
      startDate: initialDates.startDate,
      endDate: initialDates.endDate,
      color: event?.color ?? "blue",
    });
  }, [event, initialDates, form]);

  const onSubmit = (values: TEventFormData) => {
    try {
      const formattedEvent: IEvent = {
        ...values,
        startDate: format(values.startDate, "yyyy-MM-dd'T'HH:mm:ss"),
        endDate: format(values.endDate, "yyyy-MM-dd'T'HH:mm:ss"),
        id: isEditing ? event.id : Math.floor(Math.random() * 1000000),
        user: isEditing
          ? event.user
          : {
              id: Math.floor(Math.random() * 1000000).toString(),
              name: "Nicolas Thouvenin",
              picturePath: null,
            },
        color: values.color,
      };

      if (isEditing) {
        updateEvent(formattedEvent);
        toast.success(m.calendar_toast_event_updated());
      } else {
        addEvent(formattedEvent);
        toast.success(m.calendar_toast_event_created());
      }

      onClose();
      form.reset();
    } catch (error) {
      console.error(`Error ${isEditing ? "editing" : "adding"} event:`, error);
      toast.error(
        isEditing ? m.calendar_toast_event_edit_failed() : m.calendar_toast_event_add_failed(),
      );
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={onToggle} modal={false}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {isEditing
              ? m.calendar_dialog_edit_event_title()
              : m.calendar_dialog_add_event_title()}
          </ModalTitle>
          <ModalDescription>
            {isEditing
              ? m.calendar_dialog_edit_event_description()
              : m.calendar_dialog_add_event_description()}
          </ModalDescription>
        </ModalHeader>

        <Form {...form}>
          <form
            id="event-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="title" className="required">
                    {m.calendar_dialog_field_title()}
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      placeholder={m.calendar_dialog_title_placeholder()}
                      {...field}
                      className={fieldState.invalid ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <DateTimePicker form={form} field={field} />
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <DateTimePicker form={form} field={field} />
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="required">
                    {m.calendar_dialog_field_variant()}
                  </FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={`w-full ${fieldState.invalid ? "border-red-500" : ""}`}
                      >
                        <SelectValue
                          placeholder={m.calendar_dialog_variant_placeholder()}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {COLORS.map((color) => (
                          <SelectItem value={color} key={color}>
                            <div className="flex items-center gap-2">
                              <div
                                className={`size-3.5 rounded-full bg-${color}-600 dark:bg-${color}-700`}
                              />
                              {colorLabel(color as TEventColor)}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="required">
                    {m.calendar_dialog_field_description()}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={m.calendar_dialog_description_placeholder()}
                      className={fieldState.invalid ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <ModalFooter className="flex justify-end gap-2">
          <ModalClose asChild>
            <Button type="button" variant="outline">
              {m.calendar_dialog_cancel()}
            </Button>
          </ModalClose>
          <Button form="event-form" type="submit">
            {isEditing ? m.calendar_dialog_save_changes() : m.calendar_dialog_create_event()}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
