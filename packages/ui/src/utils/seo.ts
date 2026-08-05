export type SeoAlternate = { locale: string; url: string };

/** BCP 47 locale -> Open Graph locale (og:locale wants underscore + region). */
const OG_LOCALE_MAP: Record<string, string> = {
  fr: "fr_FR",
  en: "en_US",
};

export function seo({
  title,
  description,
  keywords,
  image,
  url,
  site_name,
  twitterHandle,
  locale,
  alternates,
  xDefaultUrl,
}: {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
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
}) {
  const meta = [
    { title },
    ...(description ? [{ name: "description", content: description }] : []),
    ...(keywords ? [{ name: "keywords", content: keywords }] : []),
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    ...(description
      ? [{ property: "og:description", content: description }]
      : []),
    ...(url ? [{ property: "og:url", content: url }] : []),
    ...(site_name ? [{ property: "og:site_name", content: site_name }] : []),
    ...(image ? [{ property: "og:image", content: image }] : []),
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
    { name: "twitter:title", content: title },
    ...(description
      ? [{ name: "twitter:description", content: description }]
      : []),
    ...(image ? [{ name: "twitter:image", content: image }] : []),
    ...(twitterHandle ? [{ name: "twitter:site", content: twitterHandle }] : []),
    ...(twitterHandle
      ? [{ name: "twitter:creator", content: twitterHandle }]
      : []),
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
