import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { renderToPdfOnCloudflare } from "react-tailwind-to-pdf/cloudflare";
import { getServerAsyncLocalStorage } from "~/lib/paraglide/runtime";
import { CvDocument, CV_GOOGLE_FONTS_HREF } from "~/components/cv/cv-document";
// Precompiled by scripts/compile-cv-pdf-css.mjs (runs as part of dev/build).
// Must be plain, already-compiled CSS here — this file must never import
// @tailwindcss/node, which loads a native binary that can't run in a
// Workers V8 isolate. See react-tailwind-to-pdf's README for why.
import cvPdfCss from "./cv-pdf.generated.css?raw";

const SITE_ORIGIN = "https://nicolas-thouvenin.dev";

/**
 * On-demand counterpart to the static `/files/*.pdf` download: renders
 * `CvDocument` server-side, right now, via Cloudflare Browser Rendering —
 * no prebuilt file, no dev-watch step.
 */
export const generateCvPdf = createServerFn({ method: "POST" })
  .validator((locale: unknown) => {
    if (locale !== "fr" && locale !== "en") {
      throw new Error(`Invalid locale: ${String(locale)}`);
    }
    return locale;
  })
  .handler(async ({ data: locale }) => {
    const render = () =>
      renderToPdfOnCloudflare(env.BROWSER, {
        element: <CvDocument />,
        css: cvPdfCss,
        head: `<link rel="stylesheet" href="${CV_GOOGLE_FONTS_HREF}" />`,
        // setContent() never navigates anywhere, so CvDocument's root-relative
        // <img src="/Thouvenin Nicolas.png"> has no origin to resolve
        // against without this — it silently fails to load otherwise.
        baseUrl: SITE_ORIGIN,
        pdf: {
          format: "A4",
          printBackground: true,
          margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
        },
      });

    // Message functions (`m.xxx()`) read the active locale from Paraglide's
    // AsyncLocalStorage context. The RPC request driving this handler has no
    // locale-prefixed URL to infer it from, so force the exact locale the
    // client was looking at rather than relying on cookie/header fallbacks.
    const als = getServerAsyncLocalStorage();
    const pdf = als
      ? await als.run(
          { locale, origin: SITE_ORIGIN, messageCalls: new Set() },
          render,
        )
      : await render();

    const filename = `Nicolas_Thouvenin_${locale === "en" ? "Resume" : "CV"}.pdf`;
    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  });
