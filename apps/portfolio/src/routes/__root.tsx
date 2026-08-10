import { useEffect, type ReactNode } from "react";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { getLocale } from "~/lib/paraglide/runtime.js";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { initLog } from "@repo/logger/client";
import { useRestoreScrollPosition } from "@repo/ui";

import appCss from "../styles.css?url";
import { DefaultCatchBoundary } from "~/components/default-catch-boundary.js";
import { NotFound } from "~/components/not-found.js";

// No seo() call here on purpose: every route in this app (index.tsx, cv.tsx)
// defines its own complete seo(), including canonical/hreflang links scoped
// to its own path. TanStack Router dedupes `meta` tags by name/property when
// a child route overrides one, but does not dedupe `link` tags — a
// root-level seo() call would stack a second, path="/"-scoped canonical and
// hreflang set on top of every other route's own (e.g. /cv would carry both
// its own canonical and root's, pointing at two different URLs).
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
  useRestoreScrollPosition();
  useEffect(() => {
    initLog({
      service: "portfolio__client",
      batchedTransport: { drain: { credentials: "include", endpoint: "/api/_logs/ingest" } },
    });
  }, []);
  return (
    <html lang={getLocale()} className="dark bg-background scroll-smooth">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background scroll-smooth">
        {children}
        <div className="print:hidden">
          <TanStackRouterDevtools />
        </div>
        <Scripts />
      </body>
    </html>
  );
}
