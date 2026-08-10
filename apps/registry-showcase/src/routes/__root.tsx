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

const SITE_ORIGIN = "https://registry.playground.nicolas-thouvenin.dev";

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
      title: "Registry - Nicolas Thouvenin",
      description: m.registry_seo_description(),
      url: current,
      alternates,
      xDefaultUrl,
      locale: getLocale(),
      site_name: "NT.dev Registry",
    });
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
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
      service: "registry-showcase__client",
      batchedTransport: { drain: { credentials: "include", endpoint: "/api/_logs/ingest" } },
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
