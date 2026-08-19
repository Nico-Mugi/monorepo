import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Textarea } from "@repo/ui";
import { renderHtmlToCanvas } from "~/utils/render-html-to-canvas";
import { m } from "~/lib/paraglide/messages";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 320;

function buildDemoHtml() {
  return `<div style="width:100%;height:100%;box-sizing:border-box;padding:32px;background:#101410;color:#f5f6f4;border-radius:24px;display:flex;flex-direction:column;justify-content:center;gap:12px;font-family:Inter,sans-serif;">
  <span style="align-self:flex-start;padding:4px 12px;border-radius:999px;background:#8faf83;color:#0a0a0a;font-size:12px;font-weight:600;">${m.html_in_canvas_demo_badge()}</span>
  <h2 style="margin:0;font-size:28px;font-weight:700;">${m.html_in_canvas_demo_heading()}</h2>
  <p style="margin:0;font-size:15px;line-height:1.5;color:#c7c9c5;">${m.html_in_canvas_demo_body()}</p>
</div>`;
}

/** Classic technique, works in every evergreen browser: serialize HTML into
 *  an SVG `foreignObject`, load it as a data-URI image, draw that image onto
 *  a 2D canvas. Used whenever the native HTML-in-Canvas API isn't available. */
export function SvgFallbackDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [html, setHtml] = useState(buildDemoHtml);
  const [error, setError] = useState<string | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderHtmlToCanvas(html, canvas)
      .then(() => setError(null))
      .catch((err: Error) => setError(err.message));
  }, [html]);

  useEffect(() => {
    draw();
  }, [draw]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "html-in-canvas.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground/70 uppercase">
            {m.html_in_canvas_source_heading()}
          </h2>
          <Textarea
            value={html}
            onChange={(event) => setHtml(event.target.value)}
            rows={14}
            spellCheck={false}
            className="font-mono text-xs"
          />
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground/70 uppercase">
            {m.html_in_canvas_canvas_heading()}
          </h2>
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            role="img"
            aria-label={m.html_in_canvas_canvas_aria()}
            className="w-full rounded-2xl border border-border"
          />
          <div className="flex flex-wrap gap-3">
            <Button onClick={draw}>{m.html_in_canvas_redraw_cta()}</Button>
            <Button variant="outline" onClick={handleDownload}>
              {m.html_in_canvas_download_cta()}
            </Button>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
      </div>
      <p className="max-w-2xl text-sm text-muted-foreground/70">{m.html_in_canvas_note()}</p>
    </div>
  );
}
