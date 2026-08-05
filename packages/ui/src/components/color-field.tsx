import type { AnyFieldApi } from "@tanstack/react-form";

import { cn } from "../utils/cn";
import { Field, FieldLabel, FieldDescription, FieldError } from "./field";
import { Input } from "./input";

export type ColorFieldProps = {
  field: AnyFieldApi;
  label: string;
  description?: string;
};

const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

function fieldErrors(field: AnyFieldApi) {
  if (!field.state.meta.isTouched) return [];
  return field.state.meta.errors.map((error) => ({
    message: typeof error === "string" ? error : error?.message,
  }));
}

/** Native color swatch synced with a hex text input, both driving the same field value. */
export function ColorField({ field, label, description }: ColorFieldProps) {
  const value = field.state.value as string;
  const swatchValue = HEX_COLOR_PATTERN.test(value) ? value : "#000000";

  return (
    <Field data-invalid={field.state.meta.errors.length > 0}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={label}
          value={swatchValue}
          onChange={(event) => field.handleChange(event.target.value)}
          className={cn(
            "size-9 shrink-0 cursor-pointer rounded-lg border border-input bg-transparent p-1",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 outline-none",
          )}
        />
        <Input
          id={field.name}
          name={field.name}
          type="text"
          value={value}
          placeholder="#8faf83"
          aria-invalid={field.state.meta.errors.length > 0}
          onBlur={field.handleBlur}
          onChange={(event) => field.handleChange(event.target.value)}
        />
      </div>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldError errors={fieldErrors(field)} />
    </Field>
  );
}
