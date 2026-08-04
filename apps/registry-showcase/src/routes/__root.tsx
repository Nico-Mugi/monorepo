import type { ReactNode } from "react";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import appCss from "../styles.css?url";
import { seo } from "@repo/ui";
import { DefaultCatchBoundary } from "~/components/default-catch-boundary.js";
import { NotFound } from "~/components/not-found.js";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      ...seo({
        title: "Registry — Nicolas Thouvenin",
        description:
          "A live showcase of the nt-registry components, browsable and interactive.",
        url: "https://registry.playground.nicolas-thouvenin.dev",
        site_name: "NT Registry",
      }),
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.svg",
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
    <html lang="en" className="dark bg-background">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground">
        {children}
        <div className="hidden">
          <TanStackRouterDevtools />
        </div>
        <Scripts />
      </body>
    </html>
  );
}
