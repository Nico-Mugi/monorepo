import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { deLocalizeUrl, localizeUrl } from "./lib/paraglide/runtime";

export const getRouter = () => {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    rewrite: {
      input: ({ url }) => deLocalizeUrl(url),
      output: ({ url }) => localizeUrl(url),
    },
  });
};
