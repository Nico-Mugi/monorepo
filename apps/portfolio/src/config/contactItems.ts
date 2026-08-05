import {
  LucideIcon,
  MailCheckIcon,
  MapPinIcon,
  PhoneIncomingIcon,
} from "lucide-react";
import { m } from "~/lib/paraglide/messages";

export type ContactItem = {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
};

export const contactItems = [
  {
    icon: MailCheckIcon,
    label: m.portfolio_contact_label_email(),
    value: "contact@nicolas-thouvenin.dev",
    href: "mailto:contact@nicolas-thouvenin.dev",
  },
  {
    icon: PhoneIncomingIcon,
    label: m.portfolio_contact_label_phone(),
    value: "+33 (0)6 62 24 96 58",
    href: "tel:+33662249658",
  },
  {
    icon: MapPinIcon,
    label: m.portfolio_contact_label_location(),
    value: "54 Rue des Alpins, 74000 Annecy, France",
  },
] as ContactItem[];
