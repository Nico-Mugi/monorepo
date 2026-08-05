import { locales, localizeUrl, getLocale } from "~/lib/paraglide/runtime";

const SITE_ORIGIN = "https://nicolas-thouvenin.dev";

/**
 * Resolves every locale's absolute URL for a canonical (de-localized) path,
 * e.g. "/cv" -> { fr: ".../fr/cv", en: ".../en/resume" }.
 *
 * Uses a hardcoded origin rather than `getUrlOrigin()` deliberately: during
 * prerendering, `getUrlOrigin()` resolves to the local build server
 * (e.g. http://localhost:3000), which would get baked into the static output.
 */
export function localizedSeoUrls(path: string) {
  const base = new URL(path, SITE_ORIGIN);
  const alternates = locales.map((locale) => ({
    locale,
    url: localizeUrl(base, { locale }).href,
  }));
  const current =
    alternates.find((a) => a.locale === getLocale())?.url ?? base.href;
  return { current, alternates, xDefaultUrl: base.href };
}
