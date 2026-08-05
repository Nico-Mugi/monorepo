# vite-plugin-print-to-pdf

A Vite dev-server plugin that watches your route source files and re-exports
the corresponding pages to PDF (via [Playwright](https://playwright.dev)) every
time a dependency of that route changes. Useful for keeping a generated
artifact — a resume, an invoice template, a print stylesheet — in sync with
the page it's rendered from while you edit it.

## How it works

For each page you register, the plugin walks Vite's module graph to find every
file that page transitively depends on (its "watch tree"). When the dev
server sees a file change, it checks whether the changed file falls inside any
page's watch tree, and if so, re-renders that page with a headless Chromium
instance and writes the resulting PDF to disk.

## Install

```sh
npm install -D vite-plugin-print-to-pdf playwright
npx playwright install chromium
```

`playwright` is a peer of this plugin's runtime behavior — it's listed as a
regular dependency so browser binaries are pulled in automatically, but you
still need to install the Chromium browser itself once via
`playwright install`.

## Usage

```ts
// vite.config.ts
import { defineConfig } from "vite";
import printToPdf from "vite-plugin-print-to-pdf";

export default defineConfig({
  plugins: [
    printToPdf({
      // Optional: ignore files that shouldn't trigger a re-export.
      filter: (file) => !file.includes("node_modules"),
      pages: [
        {
          url: "/resume",
          outPath: "./public/files/resume.pdf",
          watchFile: "src/routes/resume.tsx",
          pdf: {
            format: "A4",
            printBackground: true,
            margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
          },
        },
      ],
    }),
  ],
});
```

## Options

| Option | Type | Description |
| --- | --- | --- |
| `filter` | `(changedFile: string) => boolean` | Optional. Return `false` to ignore a changed file even if it's in a page's watch tree. Defaults to accepting every file. |
| `pages` | `Page[]` | The pages to watch and export. |

Each `Page` entry:

| Field | Type | Description |
| --- | --- | --- |
| `url` | `string` | The URL of the page to export. Relative URLs are resolved against the dev server's base URL. |
| `outPath` | `string` | Where to write the exported PDF. |
| `watchFile` | `string` | The entry file whose dependency tree should be watched to trigger this export. |
| `pdf` | `Parameters<Page["pdf"]>[0]` (Playwright) | Options forwarded to Playwright's `page.pdf()`, minus `path`. |

The plugin only runs in dev (`apply: "serve"`) — it's a no-op in production
builds.

## License

MIT
