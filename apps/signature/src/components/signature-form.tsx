import type { ReactFormExtendedApi } from "@tanstack/react-form";
import { TextField, ColorField } from "@repo/ui";
import type { SignatureData } from "~/lib/schema";
import { m } from "~/lib/paraglide/messages";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SignatureFormApi = ReactFormExtendedApi<
  SignatureData,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>;

export function SignatureForm({ form }: { form: SignatureFormApi }) {
  return (
    <div className="flex flex-col gap-5">
      <form.Field name="name">
        {(field) => (
          <TextField
            field={field}
            label={m.signature_field_name_label()}
            placeholder={m.signature_field_name_placeholder()}
          />
        )}
      </form.Field>
      <form.Field name="title">
        {(field) => (
          <TextField
            field={field}
            label={m.signature_field_title_label()}
            placeholder={m.signature_field_title_placeholder()}
          />
        )}
      </form.Field>
      <form.Field name="email">
        {(field) => (
          <TextField
            field={field}
            type="email"
            label={m.signature_field_email_label()}
            placeholder="you@example.com"
          />
        )}
      </form.Field>
      <form.Field name="phone">
        {(field) => (
          <TextField
            field={field}
            type="tel"
            label={m.signature_field_phone_label()}
            placeholder="06 62 24 96 58"
          />
        )}
      </form.Field>
      <form.Field name="website">
        {(field) => (
          <TextField
            field={field}
            type="url"
            label={m.signature_field_website_label()}
            placeholder="https://example.com"
          />
        )}
      </form.Field>
      <form.Field name="photoUrl">
        {(field) => (
          <TextField
            field={field}
            type="url"
            label={m.signature_field_photo_label()}
            description={m.signature_field_photo_description()}
            placeholder="https://example.com/photo.png"
          />
        )}
      </form.Field>
      <form.Field name="logoUrl">
        {(field) => (
          <TextField
            field={field}
            type="url"
            label={m.signature_field_logo_label()}
            description={m.signature_field_logo_description()}
            placeholder="https://example.com/logo.png"
          />
        )}
      </form.Field>
      <form.Field name="accentColor">
        {(field) => (
          <ColorField
            field={field}
            label={m.signature_field_accent_color_label()}
            description={m.signature_field_accent_color_description()}
          />
        )}
      </form.Field>
    </div>
  );
}
