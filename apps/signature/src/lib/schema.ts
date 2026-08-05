import { z } from "zod";

export const signatureSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  email: z.email(),
  phone: z.string().min(1),
  website: z.url(),
  photoUrl: z.url(),
  logoUrl: z.url(),
  accentColor: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i, { message: "Must be a hex color, e.g. #8faf83" }),
});

export type SignatureData = z.infer<typeof signatureSchema>;

export const defaultSignatureData: SignatureData = {
  name: "",
  title: "",
  email: "",
  phone: "",
  website: "",
  photoUrl: "",
  logoUrl: "",
  accentColor: "#8faf83",
};
