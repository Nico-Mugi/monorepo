import { DownloadIcon, LayoutGridIcon, PrinterIcon, UserRoundIcon } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { getLocale, locales, localizeUrl } from "~/lib/paraglide/runtime";
import { m } from "~/lib/paraglide/messages";
import { Nav } from "~/components/nav";
import { PLAYGROUND_URL } from "~/config/externalLinks";
import { seo, localizedSeoUrls } from "@repo/ui";
import { CvDocument, CV_GOOGLE_FONTS_HREF } from "~/components/cv/cv-document";

const SITE_ORIGIN = "https://nicolas-thouvenin.dev";

export const Route = createFileRoute("/cv")({
  head: () => {
    const { current, alternates, xDefaultUrl } = localizedSeoUrls({
      path: "/cv",
      origin: SITE_ORIGIN,
      locales,
      localizeUrl,
      activeLocale: getLocale(),
    });
    const pageSeo = seo({
      title: m.portfolio_seo_cv_title(),
      description: m.portfolio_seo_cv_description(),
      image: "https://nicolas-thouvenin.dev/logos/vertical.png",
      url: current,
      alternates,
      xDefaultUrl,
      locale: getLocale(),
      site_name: m.portfolio_seo_cv_title(),
      twitterHandle: "@Nico-Mugi",
    });
    return {
      meta: pageSeo.meta,
      links: [
        {
          rel: "stylesheet",
          href: CV_GOOGLE_FONTS_HREF,
        },
        ...pageSeo.links,
      ],
    };
  },
  component: NicolasThouveninCV,
});

function NicolasThouveninCV() {
  return (
    <>
      <Nav
        links={[
          {
            label: m.portfolio_nav_view_portfolio(),
            href: "/",
            icon: <UserRoundIcon size={20} />,
          },
          {
            label: m.portfolio_nav_print(),
            onClick: () => window.print(),
            icon: <PrinterIcon size={20} />,
          },
          {
            label: m.portfolio_nav_download(),
            download: `Nicolas_Thouvenin_${getLocale() === "en" ? "Resume" : "CV"}.pdf`,
            href: `/files/Nicolas_Thouvenin_${getLocale() === "en" ? "Resume" : "CV"}.pdf`,
            icon: <DownloadIcon size={20} />,
          },
        ]}
        ctaLink={{
          label: m.shared_nav_access_playground(),
          shortLabel: m.shared_nav_access_playground_short(),
          href: PLAYGROUND_URL,
          icon: <LayoutGridIcon size={20} />,
          target: "_blank",
          rel: "noreferrer",
        }}
      />
      <CvDocument />
    </>
  );
}
