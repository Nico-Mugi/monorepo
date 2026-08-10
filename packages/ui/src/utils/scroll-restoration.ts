import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";

const SCROLL_RESTORE_KEY = "repo-ui:scroll-restore-y";

/**
 * Call right before a hard navigation whose destination should resume at the
 * current scroll position — e.g. a Paraglide `setLocale()` locale switch,
 * which does `window.location.href = ...` (a full document reload) rather
 * than a client-side route transition, so TanStack Router's
 * `scrollRestoration` never sees it and the browser resets scroll to top.
 */
export function saveScrollPosition(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(SCROLL_RESTORE_KEY, String(window.scrollY));
}

/** How long to keep re-asserting the restored position against other
 * post-render side effects (see below) before giving up control of scroll. */
const SETTLE_WINDOW_MS = 2000;

function applySavedScrollPosition(): void {
  if (typeof window === "undefined") return;
  const raw = window.sessionStorage.getItem(SCROLL_RESTORE_KEY);
  if (raw === null) return;
  window.sessionStorage.removeItem(SCROLL_RESTORE_KEY);
  const y = Number(raw);
  if (Number.isNaN(y)) return;

  // Other post-render mount effects on the page can move window scroll
  // shortly after this runs — e.g. a page whose content is still mounting
  // (so it's shorter than its final height at first, clamping below `y`),
  // or a component scrolling its own selected/focused element into view
  // (which falls back to scrolling the window if it has no closer
  // scrollable ancestor). Neither renotifies us, so re-assert the target for
  // a bounded window instead of trying to detect each case individually.
  // The target is clamped to the page's *current* max scroll on every
  // frame (not just `y` itself), since that max is itself still settling —
  // without this, a `y` beyond the page's real (permanently shorter) height
  // would never match and this would keep calling `scrollTo` uselessly for
  // the whole window.
  const deadline = Date.now() + SETTLE_WINDOW_MS;
  const reassert = () => {
    const maxY = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
    const target = Math.min(y, maxY);
    if (Math.round(window.scrollY) !== target) {
      // Explicit `behavior: "smooth"` so the restore reads as the page
      // settling back into place rather than a jarring snap, regardless of
      // whether the page itself sets `scroll-smooth` CSS.
      window.scrollTo({ top: target, left: 0, behavior: "smooth" });
    }
    if (Date.now() < deadline) requestAnimationFrame(reassert);
  };
  reassert();
}

/**
 * Call once in the app's root layout. Restores a scroll position saved by
 * `saveScrollPosition()` before a hard reload, if one is pending.
 *
 * Applies on the router's `onRendered` event rather than a plain mount
 * effect: TanStack Router's own `scrollRestoration` resets window scroll to
 * top on `onRendered` whenever it has no cached entry for the current
 * location, which is always true right after a hard reload (that cache is
 * keyed off in-app navigation state, absent on a fresh document load).
 * Subscribing to the same event applies our restore right after the
 * router's reset instead of racing it in an unrelated effect.
 */
export function useRestoreScrollPosition(): void {
  const router = useRouter();
  useEffect(() => router.subscribe("onRendered", applySavedScrollPosition), [router]);
}
