import type { ReactNode } from "react";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "~/components/shadcn/ui/sonner";
import appCss from "../styles.css?url";
import { seo } from "@repo/ui";
import { getLocale } from "~/lib/paraglide/runtime.js";
import { m } from "~/lib/paraglide/messages.js";
import { localizedSeoUrls } from "~/utils/seo-urls.js";
import { DefaultCatchBoundary } from "~/components/default-catch-boundary.js";
import { NotFound } from "~/components/not-found.js";

export const Route = createRootRoute({
  head: () => {
    const { current, alternates, xDefaultUrl } = localizedSeoUrls("/");
    const pageSeo = seo({
      title: m.calendar_app_title(),
      description: m.calendar_app_description(),
      url: current,
      alternates,
      xDefaultUrl,
      locale: getLocale(),
      site_name: "NT.dev Calendar",
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
  return (
    <html lang={getLocale()} className="dark bg-background">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground">
        {children}
        <Toaster richColors closeButton />
        <div className="hidden">
          <TanStackRouterDevtools />
        </div>
        <Scripts />
      </body>
    </html>
  );
}
