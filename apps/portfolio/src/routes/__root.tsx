import type { ReactNode } from "react";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { getLocale } from "~/lib/paraglide/runtime.js";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import appCss from "../styles.css?url";
import { DefaultCatchBoundary } from "~/components/default-catch-boundary.js";
import { NotFound } from "~/components/not-found.js";
import { seo } from "@repo/ui";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "Nicolas Thouvenin - Portfolio",
        description:
          "Portfolio de Nicolas Thouvenin, développeur web spécialisé en React et Node.js. Découvrez mon expérience, mes compétences et comment me contacter.",
        image: "https://nicolas-thouvenin.dev/logos/vertical.png",
        url: "https://nicolas-thouvenin.dev",
        site_name: "Nicolas Thouvenin - Portfolio",
        twitterHandle: "@Nico-Mugi",
      }),
    ],
    links: [
      {
        rel: "icon",
        href: "/logos/vertical.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
});

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang={getLocale()} className="bg-[#0a0a0a] scroll-smooth">
      <head>
        <HeadContent />
      </head>
      <body className="bg-[#0a0a0a] scroll-smooth">
        {children}
        <div className="print:hidden">
          <TanStackRouterDevtools />
        </div>
        <Scripts />
      </body>
    </html>
  );
}
