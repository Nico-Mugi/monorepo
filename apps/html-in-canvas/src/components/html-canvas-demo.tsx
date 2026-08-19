import { useEffect, useState } from "react";
import { Badge } from "@repo/ui";
import { supportsHtmlInCanvas } from "~/utils/supports-html-in-canvas";
import { ThreeHtmlTextureDemo } from "./three-html-texture-demo";
import { SvgFallbackDemo } from "./svg-fallback-demo";
import { m } from "~/lib/paraglide/messages";

const ORIGIN_TRIAL_URL = "https://developer.chrome.com/blog/html-in-canvas-origin-trial";

export function HtmlCanvasDemo() {
  // null while checking on mount, so SSR/first paint always renders the
  // universally-supported fallback and only upgrades once the client has
  // actually confirmed the native API is there.
  const [nativeSupport, setNativeSupport] = useState(false);

  useEffect(() => {
    setNativeSupport(supportsHtmlInCanvas());
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant={nativeSupport ? "default" : "secondary"}>
          {nativeSupport ? m.html_in_canvas_three_badge() : m.html_in_canvas_fallback_badge()}
        </Badge>
        <a
          href={ORIGIN_TRIAL_URL}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
        >
          {m.html_in_canvas_learn_more_cta()} →
        </a>
      </div>
      <p className="max-w-2xl text-sm text-muted-foreground">
        {nativeSupport
          ? m.html_in_canvas_three_description()
          : m.html_in_canvas_fallback_description()}
      </p>
      {nativeSupport ? <ThreeHtmlTextureDemo /> : <SvgFallbackDemo />}
    </div>
  );
}
