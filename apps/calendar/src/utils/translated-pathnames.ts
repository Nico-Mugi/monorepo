import type { Locale } from "~/lib/paraglide/runtime";

export const translatedPathnames = [
  {
    pattern: "/",
    localized: [
      ["fr", "/fr"],
      ["en", "/en"],
    ] as Array<[Locale, string]>,
  },
  {
    pattern: "/:path(.*)?",
    localized: [
      ["fr", "/fr/:path(.*)?"],
      ["en", "/en/:path(.*)?"],
    ] as Array<[Locale, string]>,
  },
];
