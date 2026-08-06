import type { AnyFieldApi } from "@tanstack/react-form";

import { Field, FieldLabel, FieldError } from "./field";
import { DateTimePicker } from "./date-time-picker";

export type DateTimeFieldProps = {
  field: AnyFieldApi;
  label: string;
  use24HourFormat?: boolean;
  placeholder?: string;
};

function fieldErrors(field: AnyFieldApi) {
  if (!field.state.meta.isTouched) return [];
  return field.state.meta.errors.map((error) => ({
    message: typeof error === "string" ? error : error?.message,
  }));
}

export function DateTimeField({
  field,
  label,
  use24HourFormat,
  placeholder,
}: DateTimeFieldProps) {
  return (
    <Field data-invalid={field.state.meta.errors.length > 0}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <DateTimePicker
        value={field.state.value}
        onChange={(date) => field.handleChange(date)}
        use24HourFormat={use24HourFormat}
        placeholder={placeholder}
        invalid={field.state.meta.errors.length > 0}
      />
      <FieldError errors={fieldErrors(field)} />
    </Field>
  );
}
