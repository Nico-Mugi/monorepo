import type { Page } from "playwright";

export interface UserConfig {
  /**
   * Optional filter: return `false` to ignore a particular changed file
   * even if it appears in the dependency tree.
   * Defaults to accepting every file.
   */
  filter?: (changedFile: string) => boolean;
  pages: {
    /**
     * Exported PDF path
     *
     */
    outPath: string;

    /**
     * The URL of the page you want to export
     */
    url: string;

    /**
     * The input file path of the page you want to watch.
     */
    watchFile: string;

    /**
     * Options passed to page.pdf()
     */
    pdf?: Omit<Parameters<Page["pdf"]>[0], "path">;
  }[];
}
