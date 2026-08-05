/** Wrap rendered markup and compiled CSS into a standalone HTML document. */
export function buildHtmlDocument(options: {
  markup: string;
  css: string;
  head?: string;
  baseUrl?: string;
}): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    ${options.baseUrl ? `<base href="${options.baseUrl}" />` : ""}
    ${options.head ?? ""}
    <style>${options.css}</style>
  </head>
  <body>${options.markup}</body>
</html>`;
}
