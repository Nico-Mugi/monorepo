import type { Plugin } from "vite";
import type { UserConfig } from "./types";
import { exportPDF } from "./pdf";
import {
  isInDependencyTree,
  resolvePageUrl,
  resolveServerBaseUrl,
} from "./utils";

export type { UserConfig } from "./types";

export default function printToPdf(option: UserConfig): Plugin {
  let baseUrl: string;
  return {
    name: "vite-plugin-print-to-pdf",
    apply: "serve",

    configResolved(config) {
      baseUrl = resolveServerBaseUrl(config);
    },
    configureServer(server) {
      server.httpServer?.once("listening", () => {
        for (const page of option.pages) {
          server.warmupRequest(page.watchFile);
        }
      });

      server.watcher.on("change", async (changedFile: string) => {
        // Let the caller filter out irrelevant files early.
        if (option.filter && !option.filter(changedFile)) return;

        // For each page, check whether the changed file falls inside that page's watchFile dependency tree.
        const matchResults = await Promise.all(
          option.pages.map((page) =>
            isInDependencyTree(changedFile, page.watchFile, server).then(
              (hit) => (hit ? page : null),
            ),
          ),
        );

        const pages = matchResults.filter(Boolean) as UserConfig["pages"];

        if (pages.length === 0) return;

        console.log(
          "[vite-plugin-print-to-pdf] %s triggered export for: %s",
          changedFile,
          pages.map((p) => p.outPath).join(", "),
        );

        // Resolve relative URLs just before handing off to Playwright.
        const resolvedPages = pages.map((p) => ({
          ...p,
          url: resolvePageUrl(p.url, baseUrl),
        }));

        await exportPDF({ pages: resolvedPages });

        server.ws.send({ type: "full-reload" });
      });
    },
  };
}
