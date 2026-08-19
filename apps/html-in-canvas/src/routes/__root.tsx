import { useEffect, type ReactNode } from "react";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import appCss from "../styles.css?url";
import { seo, localizedSeoUrls, useRestoreScrollPosition } from "@repo/ui";
import { initLog } from "@repo/logger/client";
import { getLocale, locales, localizeUrl } from "~/lib/paraglide/runtime.js";
import { m } from "~/lib/paraglide/messages.js";
import { DefaultCatchBoundary } from "~/components/default-catch-boundary.js";
import { NotFound } from "~/components/not-found.js";

const SITE_ORIGIN = "https://html-in-canvas.playground.nicolas-thouvenin.dev";

export const Route = createRootRoute({
  head: () => {
    const { current, alternates, xDefaultUrl } = localizedSeoUrls({
      path: "/",
      origin: SITE_ORIGIN,
      locales,
      localizeUrl,
      activeLocale: getLocale(),
    });
    const pageSeo = seo({
      title: m.html_in_canvas_app_title(),
      description: m.html_in_canvas_seo_description(),
      url: current,
      alternates,
      xDefaultUrl,
      locale: getLocale(),
      site_name: "NT.dev HTML in Canvas",
    });
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          httpEquiv: "origin-trial",
          content:
            "Ary49F/8VpxpYBgFwey5ZhxyDNLXOzHkUA4rOlGTgSzNDVbPpl7BMyaw366GZWrhBJADPxSFNvXJUqmZSFhlfgsAAABueyJvcmlnaW4iOiJodHRwczovL25pY29sYXMtdGhvdXZlbmluLmRldjo0NDMiLCJmZWF0dXJlIjoiSFRNTEluQ2FudmFzIiwiZXhwaXJ5IjoxNzkyNDU0NDAwLCJpc1N1YmRvbWFpbiI6dHJ1ZX0=",
        },
        ...pageSeo.meta,
      ],
      links: [
        {
          rel: "icon",
          href: "/favicon.svg",
          sizes: "any",
          type: "image/svg+xml",
        },
        { rel: "stylesheet", href: appCss },
        ...pageSeo.links,
      ],
    };
  },
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
});

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  useRestoreScrollPosition();
  useEffect(() => {
    initLog({
      service: "html-in-canvas__client",
      batchedTransport: {
        drain: { credentials: "include", endpoint: "/api/_logs/ingest" },
      },
    });
  }, []);
  return (
    <html lang={getLocale()} className="dark bg-background scroll-smooth">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground scroll-smooth">
        {children}
        <div className="hidden">
          <TanStackRouterDevtools />
        </div>
        <Scripts />
      </body>
    </html>
  );
}
