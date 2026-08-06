import type { ReactNode } from "react";
import type { AnyFieldApi } from "@tanstack/react-form";

import { Field, FieldLabel, FieldDescription, FieldError } from "./field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export type SelectFieldOption = {
  value: string;
  label: ReactNode;
};

export type SelectFieldProps = {
  field: AnyFieldApi;
  label: string;
  options: SelectFieldOption[];
  placeholder?: string;
  description?: string;
};

function fieldErrors(field: AnyFieldApi) {
  if (!field.state.meta.isTouched) return [];
  return field.state.meta.errors.map((error) => ({
    message: typeof error === "string" ? error : error?.message,
  }));
}

export function SelectField({
  field,
  label,
  options,
  placeholder,
  description,
}: SelectFieldProps) {
  return (
    <Field data-invalid={field.state.meta.errors.length > 0}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Select
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
      >
        <SelectTrigger
          id={field.name}
          className="w-full"
          aria-invalid={field.state.meta.errors.length > 0}
          onBlur={field.handleBlur}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem value={option.value} key={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldError errors={fieldErrors(field)} />
    </Field>
  );
}
