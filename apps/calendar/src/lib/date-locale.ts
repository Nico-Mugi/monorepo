import { fr, enUS } from "date-fns/locale";
import { getLocale } from "./paraglide/runtime";

export function getDateFnsLocale() {
  return getLocale() === "fr" ? fr : enUS;
}
