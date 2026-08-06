import type { AnyFieldApi } from "@tanstack/react-form";

import { Field, FieldLabel, FieldDescription, FieldError } from "./field";
import { Textarea } from "./textarea";

export type TextareaFieldProps = {
  field: AnyFieldApi;
  label: string;
  placeholder?: string;
  description?: string;
};

function fieldErrors(field: AnyFieldApi) {
  if (!field.state.meta.isTouched) return [];
  return field.state.meta.errors.map((error) => ({
    message: typeof error === "string" ? error : error?.message,
  }));
}

export function TextareaField({
  field,
  label,
  placeholder,
  description,
}: TextareaFieldProps) {
  return (
    <Field data-invalid={field.state.meta.errors.length > 0}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value}
        placeholder={placeholder}
        aria-invalid={field.state.meta.errors.length > 0}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldError errors={fieldErrors(field)} />
    </Field>
  );
}
