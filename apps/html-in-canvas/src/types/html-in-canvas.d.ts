/**
 * `drawElementImage` is the entry point of Chrome's experimental HTMLInCanvas
 * origin trial (see `supports-html-in-canvas.ts`) - it isn't in lib.dom.d.ts
 * yet, so this augments CanvasRenderingContext2D by hand until it lands.
 * Mirrors `drawImage`'s signature but takes a live HTML element as the source
 * instead of an image/video/canvas.
 */
export {};

declare global {
  interface CanvasRenderingContext2D {
    drawElementImage?(
      element: Element,
      dx: number,
      dy: number,
      dWidth?: number,
      dHeight?: number,
    ): void;
  }
}
