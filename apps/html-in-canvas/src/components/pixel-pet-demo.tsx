import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@repo/ui";
import { supportsHtmlInCanvas } from "~/utils/supports-html-in-canvas";
import { loadHtmlAsImage } from "~/utils/render-html-to-canvas";
import { m } from "~/lib/paraglide/messages";

const SPRITE_SHEET_SRC = "/sprite-sheet.png";
const FRAME_SIZE = 96;
const FRAME_COUNT = 4;
const WALK_ROW = 1;
const FRAME_DURATION_MS = 160;

const SPRITE_SCALE = 3;
const SPRITE_SIZE = FRAME_SIZE * SPRITE_SCALE;
const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 360;
const SPRITE_X = (CANVAS_WIDTH - SPRITE_SIZE) / 2;
const SPRITE_Y = CANVAS_HEIGHT - SPRITE_SIZE;

const BUBBLE_WIDTH = 220;
const BUBBLE_CARD_HEIGHT = 64;
const BUBBLE_TAIL_HEIGHT = 10;
const BUBBLE_HEIGHT = BUBBLE_CARD_HEIGHT + BUBBLE_TAIL_HEIGHT;
const BUBBLE_X = (CANVAS_WIDTH - BUBBLE_WIDTH) / 2;
const BUBBLE_Y = 4;
const BUBBLE_VISIBLE_MS = 2500;

const MESSAGES = [
  m.html_in_canvas_pet_message_1,
  m.html_in_canvas_pet_message_2,
  m.html_in_canvas_pet_message_3,
  m.html_in_canvas_pet_message_4,
];

function SpeechBubble({ text }: { text: string }) {
  return (
    <div className="relative h-full w-full">
      <div
        className="absolute top-0 left-0 flex w-full items-center justify-center rounded-2xl border border-border bg-card px-4 text-center text-sm font-medium text-card-foreground shadow-lg"
        style={{ height: BUBBLE_CARD_HEIGHT }}
      >
        {text}
      </div>
      <div
        className="absolute left-1/2 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-border"
        style={{ top: BUBBLE_CARD_HEIGHT }}
      />
    </div>
  );
}

function buildBubbleHtml(text: string) {
  return `<div style="position:relative;width:100%;height:100%;font-family:Inter,sans-serif;">
  <div style="position:absolute;top:0;left:0;box-sizing:border-box;width:100%;height:${BUBBLE_CARD_HEIGHT}px;display:flex;align-items:center;justify-content:center;padding:0 16px;border-radius:16px;background:#101410;color:#f5f6f4;border:1px solid #2a2f2a;font-size:14px;font-weight:500;text-align:center;">${text}</div>
  <div style="position:absolute;left:50%;top:${BUBBLE_CARD_HEIGHT}px;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:8px solid #2a2f2a;"></div>
</div>`;
}

/**
 * Animates the sprite sheet's walk-cycle row on a plain 2D canvas, then paints
 * a speech bubble on click using the same native-or-fallback split as the
 * other demos. Native support paints straight onto the 2D context via
 * `drawElementImage`, but unlike `THREE.HTMLTexture` (which accepts a
 * detached element), the real API only accepts an *immediate DOM child of
 * the `<canvas>` element* as its source - so the bubble is rendered as real
 * JSX children of `<canvas>` below, not a detached React root. Browsers that
 * support canvas never display canvas children on their own, so this stays
 * invisible except when explicitly painted. Where the origin trial isn't
 * available, this falls back to the SVG `foreignObject` rasterization
 * technique the other demos use.
 */
export function PixelPetDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spriteImageRef = useRef<HTMLImageElement | null>(null);
  const nativeBubbleElementRef = useRef<HTMLDivElement>(null);
  const fallbackImageCache = useRef(new Map<string, HTMLImageElement>());
  const hideTimeoutRef = useRef<number | undefined>(undefined);

  const [nativeSupport, setNativeSupport] = useState(false);
  const [spriteReady, setSpriteReady] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const message = MESSAGES[messageIndex]();

  // Read by the walk-cycle loop below, which intentionally does NOT depend
  // on `bubbleVisible`/`message` - see the loop's comment for why.
  const bubbleVisibleRef = useRef(bubbleVisible);
  bubbleVisibleRef.current = bubbleVisible;
  const messageRef = useRef(message);
  messageRef.current = message;

  useEffect(() => {
    setNativeSupport(supportsHtmlInCanvas());
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      spriteImageRef.current = img;
      setSpriteReady(true);
    };
    img.src = SPRITE_SHEET_SRC;
  }, []);

  useEffect(() => {
    if (nativeSupport || !bubbleVisible) return;
    if (fallbackImageCache.current.has(message)) return;
    loadHtmlAsImage(buildBubbleHtml(message), BUBBLE_WIDTH, BUBBLE_HEIGHT)
      .then((img) => fallbackImageCache.current.set(message, img))
      .catch(() => {
        // Leave the bubble un-rasterized for this message; the next click
        // (fresh message + fresh timeout) gets another attempt.
      });
  }, [nativeSupport, bubbleVisible, message]);

  const handleActivate = useCallback(() => {
    setMessageIndex((current) => (current + 1) % MESSAGES.length);
    setBubbleVisible(true);
    window.clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = window.setTimeout(() => setBubbleVisible(false), BUBBLE_VISIBLE_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(hideTimeoutRef.current), []);

  // Deliberately does NOT depend on `bubbleVisible`/`message`: those change
  // on every click, and restarting this effect resets `frame`/`last` below,
  // which visibly stalls the walk cycle if clicks land faster than it can
  // re-advance. The loop instead reads bubble state live off refs each tick,
  // so clicking only changes what's drawn on top, never the loop itself.
  useEffect(() => {
    if (!spriteReady) return;
    const canvas = canvasRef.current;
    const sprite = spriteImageRef.current;
    if (!canvas || !sprite) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    // Canvas fallback children are never laid out or painted by default -
    // `layoutsubtree` (not yet a known HTML attribute, hence set here
    // imperatively rather than as a JSX prop) opts them into real
    // layout/paint so drawElementImage has something to read.
    canvas.setAttribute("layoutsubtree", "");

    let raf = 0;
    let frame = 0;
    let last = 0;
    let warned = false;

    const draw = (timestamp: number) => {
      if (timestamp - last >= FRAME_DURATION_MS) {
        last = timestamp;
        frame = (frame + 1) % FRAME_COUNT;
      }

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.drawImage(
        sprite,
        frame * FRAME_SIZE,
        WALK_ROW * FRAME_SIZE,
        FRAME_SIZE,
        FRAME_SIZE,
        SPRITE_X,
        SPRITE_Y,
        SPRITE_SIZE,
        SPRITE_SIZE,
      );

      if (bubbleVisibleRef.current) {
        if (nativeSupport) {
          const bubble = nativeBubbleElementRef.current;
          try {
            if (bubble) ctx.drawElementImage?.(bubble, BUBBLE_X, BUBBLE_Y);
          } catch (err) {
            // The browser produces an element's paint record asynchronously
            // - a draw on an early frame (right after the bubble first
            // mounts) can race ahead of it and throw. Skip the losing frame
            // and try again next tick, same as the Three.js demo does for
            // THREE.HTMLTexture uploads.
            if (!warned) {
              warned = true;
              console.warn("HTML-in-Canvas element paint not ready yet, retrying:", err);
            }
          }
        } else {
          const cached = fallbackImageCache.current.get(messageRef.current);
          if (cached) ctx.drawImage(cached, BUBBLE_X, BUBBLE_Y, BUBBLE_WIDTH, BUBBLE_HEIGHT);
        }
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [spriteReady, nativeSupport]);

  return (
    <div className="flex flex-col items-center gap-3">
      <Badge variant={nativeSupport ? "default" : "secondary"}>
        {nativeSupport ? m.html_in_canvas_pet_native_badge() : m.html_in_canvas_pet_fallback_badge()}
      </Badge>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        role="button"
        tabIndex={0}
        aria-label={m.html_in_canvas_pet_canvas_aria()}
        onClick={handleActivate}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          handleActivate();
        }}
        className="cursor-pointer rounded-2xl border border-border bg-card outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {nativeSupport ? (
          <div ref={nativeBubbleElementRef} style={{ width: BUBBLE_WIDTH, height: BUBBLE_HEIGHT }}>
            <SpeechBubble text={message} />
          </div>
        ) : null}
      </canvas>
      <p className="text-sm text-muted-foreground">{m.html_in_canvas_pet_hint()}</p>
    </div>
  );
}
