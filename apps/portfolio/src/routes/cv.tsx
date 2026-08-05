import { useState } from "react";
import {
  DownloadIcon,
  LoaderCircleIcon,
  PrinterIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { getLocale } from "~/lib/paraglide/runtime";
import { m } from "~/lib/paraglide/messages";
import { Nav } from "~/components/nav";
import { seo } from "@repo/ui";
import { CvDocument, CV_GOOGLE_FONTS_HREF } from "~/components/cv/cv-document";
import { generateCvPdf } from "~/server/generate-cv-pdf";

export const Route = createFileRoute("/cv")({
  head: () => ({
    meta: [
      ...seo({
        title: "Nicolas Thouvenin - CV",
        description:
          "CV de Nicolas Thouvenin, développeur web spécialisé en React et Node.js. Découvrez mon expérience, mes compétences et comment me contacter.",
        image: "https://nicolas-thouvenin.dev/logos/vertical.png",
        url: "https://nicolas-thouvenin.dev/cv",
        site_name: "Nicolas Thouvenin - CV",
        twitterHandle: "@Nico-Mugi",
      }),
    ],
    links: [
      {
        rel: "stylesheet",
        href: CV_GOOGLE_FONTS_HREF,
      },
    ],
  }),
  component: NicolasThouveninCV,
});

// function useDownloadLivePdfLink() {
//   const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

//   const handleClick = async () => {
//     setStatus("loading");
//     try {
//       const locale = getLocale();
//       const response = await generateCvPdf({ data: locale });
//       const blob = await response.blob();
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `Nicolas_Thouvenin_${locale === "en" ? "Resume" : "CV"}.pdf`;
//       a.click();
//       URL.revokeObjectURL(url);
//       setStatus("idle");
//     } catch (error) {
//       console.error("[generateCvPdf] failed:", error);
//       setStatus("error");
//     }
//   };

//   const icon =
//     status === "loading" ? (
//       <LoaderCircleIcon size={20} className="animate-spin" />
//     ) : status === "error" ? (
//       <TriangleAlertIcon size={20} />
//     ) : (
//       <DownloadIcon size={20} />
//     );

//   return {
//     label: m.nav_download_live(),
//     onClick: handleClick,
//     icon,
//   };
// }

function NicolasThouveninCV() {
  return (
    <>
      <Nav
        links={[
          {
            label: m.nav_print(),
            onClick: () => window.print(),
            icon: <PrinterIcon size={20} />,
          },
          {
            label: m.nav_download(),
            download: `Nicolas_Thouvenin_${getLocale() === "en" ? "Resume" : "CV"}.pdf`,
            href: `/files/Nicolas_Thouvenin_${getLocale() === "en" ? "Resume" : "CV"}.pdf`,
            icon: <DownloadIcon size={20} />,
          },
          //useDownloadLivePdfLink(),
        ]}
        ctaLink={{
          label: m.nav_view_portfolio(),
          href: "/",
        }}
      />
      <CvDocument />
    </>
  );
}
