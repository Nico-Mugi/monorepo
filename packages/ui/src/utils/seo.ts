export type SeoAlternate = { locale: string; url: string };

export type SeoImage = {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  type?:
    | "image/apng"
    | "image/avif"
    | "image/gif"
    | "image/jpeg"
    | "image/png"
    | "image/svg+xml"
    | "image/webp";
};

export type SeoRobots = {
  index?: boolean;
  follow?: boolean;
  noarchive?: boolean;
  noimageindex?: boolean;
  nosnippet?: boolean;
  maxImagePreview?: "large" | "none" | "standard";
};

/** BCP 47 locale -> Open Graph locale (og:locale wants underscore + region). */
const OG_LOCALE_MAP: Record<string, string> = {
  fr: "fr_FR",
  en: "en_US",
};

function formatRobotsContent({
  index = true,
  follow = true,
  noarchive = false,
  noimageindex = false,
  nosnippet = false,
  maxImagePreview,
}: SeoRobots): string {
  return [
    index ? "index" : "noindex",
    follow ? "follow" : "nofollow",
    noarchive ? "noarchive" : undefined,
    noimageindex ? "noimageindex" : undefined,
    nosnippet ? "nosnippet" : undefined,
    maxImagePreview ? `max-image-preview:${maxImagePreview}` : undefined,
  ]
    .filter((value): value is string => value !== undefined)
    .join(", ");
}

function formatTitle(title: string, titleTemplate?: string): string {
  if (!titleTemplate) return title;
  return titleTemplate.includes("%s")
    ? titleTemplate.replace("%s", title)
    : `${title} ${titleTemplate}`;
}

function buildOpenGraphImageMeta(images: SeoImage[]) {
  return images.flatMap((image) => [
    { property: "og:image", content: image.url },
    ...(image.alt ? [{ property: "og:image:alt", content: image.alt }] : []),
    ...(image.width ? [{ property: "og:image:width", content: String(image.width) }] : []),
    ...(image.height ? [{ property: "og:image:height", content: String(image.height) }] : []),
    ...(image.type ? [{ property: "og:image:type", content: image.type }] : []),
  ]);
}

export function seo({
  title,
  description,
  keywords,
  image,
  images,
  url,
  site_name,
  twitterHandle,
  locale,
  alternates,
  xDefaultUrl,
  titleTemplate,
  robots,
}: {
  title: string;
  description?: string;
  keywords?: string;
  /** Single-image shorthand, equivalent to `images: [{ url: image }]`. */
  image?: string;
  /** Full Open Graph image set (alt/width/height/type) — takes priority over `image` if both are given. */
  images?: SeoImage[];
  /** Absolute URL of this exact page (current locale). Used for canonical + og:url. */
  url?: string;
  site_name?: string;
  twitterHandle?: string;
  /** This page's locale, e.g. "fr" or "en". Enables og:locale / og:locale:alternate. */
  locale?: string;
  /** Every locale version of this page, including the current one. Enables hreflang links. */
  alternates?: SeoAlternate[];
  /** The un-prefixed, content-negotiated URL for this page (e.g. "/cv", not "/en/resume"). Enables hreflang="x-default". */
  xDefaultUrl?: string;
  /** Site-level title format. "%s" is replaced with `title`; otherwise `title` is appended with the template as a suffix. */
  titleTemplate?: string;
  /** Builds the `robots`/`googlebot` meta content string (e.g. `{ index: false, follow: false }` -> "noindex, nofollow"). */
  robots?: SeoRobots;
}) {
  const formattedTitle = formatTitle(title, titleTemplate);
  const resolvedImages = images ?? (image ? [{ url: image }] : []);
  const robotsContent = robots ? formatRobotsContent(robots) : undefined;

  const meta = [
    { title: formattedTitle },
    ...(description ? [{ name: "description", content: description }] : []),
    ...(keywords ? [{ name: "keywords", content: keywords }] : []),
    { property: "og:type", content: "website" },
    { property: "og:title", content: formattedTitle },
    ...(description
      ? [{ property: "og:description", content: description }]
      : []),
    ...(url ? [{ property: "og:url", content: url }] : []),
    ...(site_name ? [{ property: "og:site_name", content: site_name }] : []),
    ...buildOpenGraphImageMeta(resolvedImages),
    ...(locale
      ? [{ property: "og:locale", content: OG_LOCALE_MAP[locale] ?? locale }]
      : []),
    ...(alternates
      ? alternates
          .filter((a) => a.locale !== locale)
          .map((a) => ({
            property: "og:locale:alternate",
            content: OG_LOCALE_MAP[a.locale] ?? a.locale,
          }))
      : []),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: formattedTitle },
    ...(description
      ? [{ name: "twitter:description", content: description }]
      : []),
    ...(resolvedImages[0] ? [{ name: "twitter:image", content: resolvedImages[0].url }] : []),
    ...(twitterHandle ? [{ name: "twitter:site", content: twitterHandle }] : []),
    ...(twitterHandle
      ? [{ name: "twitter:creator", content: twitterHandle }]
      : []),
    ...(robotsContent ? [{ name: "robots", content: robotsContent }] : []),
    ...(robotsContent ? [{ name: "googlebot", content: robotsContent }] : []),
  ];

  const links = [
    ...(url ? [{ rel: "canonical", href: url }] : []),
    ...(alternates?.map((a) => ({
      rel: "alternate",
      hrefLang: a.locale,
      href: a.url,
    })) ?? []),
    ...(xDefaultUrl
      ? [{ rel: "alternate", hrefLang: "x-default", href: xDefaultUrl }]
      : []),
  ];

  return { meta, links };
}

/**
 * Resolves every locale's absolute URL for a canonical (de-localized) path,
 * e.g. "/cv" -> { fr: ".../fr/cv", en: ".../en/resume" }.
 *
 * Framework-agnostic: takes `locales`/`localizeUrl` as parameters rather than
 * importing paraglide directly, since each app's compiled paraglide runtime
 * is app-local (gitignored, generated per-app from packages/i18n).
 */
export function localizedSeoUrls<TLocale extends string>({
  path,
  origin,
  locales,
  localizeUrl,
  activeLocale,
}: {
  path: string;
  /** Hardcode this rather than reading the request/build-server origin — during
   * prerendering that would resolve to the local build server (e.g.
   * http://localhost:3000) and get baked into the static output. */
  origin: string;
  locales: readonly TLocale[];
  // Generic over TLocale (each app's own paraglide-generated locale union,
  // e.g. "fr" | "en") rather than plain `string`, so an app's own
  // `localizeUrl` — whose `options.locale` only accepts that union — can be
  // passed in directly without a widening cast.
  localizeUrl: (url: string | URL, options?: { locale?: TLocale }) => URL;
  activeLocale: TLocale;
}): { current: string; alternates: SeoAlternate[]; xDefaultUrl: string } {
  const base = new URL(path, origin);
  const alternates = locales.map((locale) => ({
    locale,
    url: localizeUrl(base, { locale }).href,
  }));
  const current = alternates.find((a) => a.locale === activeLocale)?.url ?? base.href;
  return { current, alternates, xDefaultUrl: base.href };
}
