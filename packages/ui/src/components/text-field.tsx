import type { AnyFieldApi } from "@tanstack/react-form";

import { Field, FieldLabel, FieldDescription, FieldError } from "./field";
import { Input } from "./input";

export type TextFieldProps = {
  field: AnyFieldApi;
  label: string;
  type?: "text" | "email" | "url" | "tel";
  placeholder?: string;
  description?: string;
};

function fieldErrors(field: AnyFieldApi) {
  if (!field.state.meta.isTouched) return [];
  return field.state.meta.errors.map((error) => ({
    message: typeof error === "string" ? error : error?.message,
  }));
}

export function TextField({
  field,
  label,
  type = "text",
  placeholder,
  description,
}: TextFieldProps) {
  return (
    <Field data-invalid={field.state.meta.errors.length > 0}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        type={type}
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
