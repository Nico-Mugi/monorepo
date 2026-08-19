/**
 * Serializes an HTML fragment into an SVG `<foreignObject>`, loads it as a data-URI
 * image, and paints that image onto the given canvas. Browsers refuse to execute
 * `<script>` tags (or event handler attributes) inside an SVG loaded through `<img>` -
 * it's treated as a raster image resource, not live DOM - so painting arbitrary/
 * user-edited HTML this way is safe without a sanitization pass.
 */
export function renderHtmlToCanvas(html: string, canvas: HTMLCanvasElement): Promise<void> {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return Promise.reject(new Error("Canvas 2D context unavailable"));
  }

  const { width, height } = canvas;
  return loadHtmlAsImage(html, width, height).then((img) => {
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
  });
}

/**
 * Same SVG `<foreignObject>` rasterization technique as `renderHtmlToCanvas`, but
 * returns the loaded image instead of drawing it - lets a caller composite it onto
 * part of a canvas (e.g. a speech bubble over an already-drawn scene) and cache the
 * result instead of reloading it every frame.
 */
export function loadHtmlAsImage(
  html: string,
  width: number,
  height: number,
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const svg = [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`,
      `<foreignObject width="100%" height="100%">`,
      `<div xmlns="http://www.w3.org/1999/xhtml" style="width:${width}px;height:${height}px;">${html}</div>`,
      `</foreignObject>`,
      `</svg>`,
    ].join("");

    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to rasterize HTML into an image"));
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}
