import type { ReactNode } from "react";
import type { AnyFieldApi } from "@tanstack/react-form";

import { Field, FieldLabel, FieldDescription, FieldError } from "./field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";

export type NumberFieldProps = {
  field: AnyFieldApi;
  label: string;
  placeholder?: string;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
  /** e.g. a currency symbol, shown before the input. */
  prefix?: ReactNode;
  /** e.g. a unit like "%", shown after the input. */
  suffix?: ReactNode;
};

function fieldErrors(field: AnyFieldApi) {
  if (!field.state.meta.isTouched) return [];
  return field.state.meta.errors.map((error) => ({
    message: typeof error === "string" ? error : error?.message,
  }));
}

export function NumberField({
  field,
  label,
  placeholder,
  description,
  min,
  max,
  step,
  prefix,
  suffix,
}: NumberFieldProps) {
  return (
    <Field data-invalid={field.state.meta.errors.length > 0}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <InputGroup>
        {prefix ? <InputGroupAddon>{prefix}</InputGroupAddon> : null}
        <InputGroupInput
          id={field.name}
          name={field.name}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={Number.isNaN(field.state.value) ? "" : field.state.value}
          placeholder={placeholder}
          aria-invalid={field.state.meta.errors.length > 0}
          onBlur={field.handleBlur}
          onChange={(event) => field.handleChange(event.target.valueAsNumber)}
        />
        {suffix ? <InputGroupAddon align="inline-end">{suffix}</InputGroupAddon> : null}
      </InputGroup>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldError errors={fieldErrors(field)} />
    </Field>
  );
}
