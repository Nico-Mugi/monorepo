import type { ReactNode } from "react";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import appCss from "../styles.css?url";
import { seo } from "~/utils/seo";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      ...seo({
        title: "Playground — Nicolas Thouvenin",
        description:
          "A showcase of experiments and side projects by Nicolas Thouvenin.",
        url: "https://playground.nicolas-thouvenin.dev",
        site_name: "NT Playground",
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
  shellComponent: RootDocument,
});

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="bg-[#0a0a0a]">
      <head>
        <HeadContent />
      </head>
      <body className="bg-[#0a0a0a]">
        {children}
        <div className="hidden">
          <TanStackRouterDevtools />
        </div>
        <Scripts />
      </body>
    </html>
  );
}
