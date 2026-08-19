/** Client-only feature detection for the experimental HTML-in-Canvas API. */
export function supportsHtmlInCanvas(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof CanvasRenderingContext2D === "undefined") return false;
  return "drawElementImage" in CanvasRenderingContext2D.prototype;
}
