import { localizeHref } from "../lib/paraglide/runtime";

export const prerenderRoutes = ["/", "/cv"].map((path) => ({
  path: localizeHref(path),
  prerender: {
    enabled: true,
  },
}));
