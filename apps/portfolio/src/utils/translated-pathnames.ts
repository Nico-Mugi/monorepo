import { Locale } from "~/lib/paraglide/runtime";
import { FileRoutesByTo } from "../routeTree.gen";

type RoutePath = keyof FileRoutesByTo;

const excludedPaths = ["files"] as const;

type PublicRoutePath = Exclude<
  RoutePath,
  `${string}${(typeof excludedPaths)[number]}${string}`
>;

type TranslatedPathname = {
  pattern: string;
  localized: Array<[Locale, string]>;
};

function toUrlPattern(path: string) {
  return (
    path
      // catch-all
      .replace(/\/\$$/, "/:path(.*)?")
      // optional parameters: {-$param}
      .replace(/\{-\$([a-zA-Z0-9_]+)\}/g, ":$1?")
      // named parameters: $param
      .replace(/\$([a-zA-Z0-9_]+)/g, ":$1")
      // remove trailing slash
      .replace(/\/+$/, "")
  );
}

function createTranslatedPathnames(
  input: Record<PublicRoutePath, Record<Locale, string>>,
): TranslatedPathname[] {
  const x = Object.entries(input).map(([pattern, locales]) => ({
    pattern: pattern === "/" ? "/" : toUrlPattern(pattern),
    localized: Object.entries(locales).map(
      ([locale, path]) =>
        [locale as Locale, `/${locale}${toUrlPattern(path)}`] satisfies [
          Locale,
          string,
        ],
    ),
  }));
  return [
    ...x,
    {
      pattern: "/:path(.*)?",
      localized: [
        ["fr", "/fr/:path(.*)?"] satisfies [Locale, string],
        ["en", "/en/:path(.*)?"] satisfies [Locale, string],
      ],
    },
  ];
}

export const translatedPathnames = createTranslatedPathnames({
  "/": {
    fr: "/",
    en: "/",
  },
  "/cv": {
    fr: "/cv",
    en: "/resume",
  },
});
