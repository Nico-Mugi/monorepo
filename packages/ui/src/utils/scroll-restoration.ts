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

/** How long to keep correcting the restore against a page that's still
 * growing (see below) before giving up. */
const SETTLE_WINDOW_MS = 2000;

function applySavedScrollPosition(): void {
  if (typeof window === "undefined") return;
  const raw = window.sessionStorage.getItem(SCROLL_RESTORE_KEY);
  if (raw === null) return;
  window.sessionStorage.removeItem(SCROLL_RESTORE_KEY);
  const y = Number(raw);
  if (Number.isNaN(y)) return;

  // Explicit `behavior: "smooth"` so the restore reads as the page settling
  // back into place rather than a jarring snap, regardless of whether the
  // page itself sets `scroll-smooth` CSS.
  const apply = () => window.scrollTo({ top: y, left: 0, behavior: "smooth" });
  apply();

  if (typeof ResizeObserver === "undefined") return;
  // A page whose content is still mounting when `apply()` first runs (e.g.
  // client-only widgets not yet hydrated) may be shorter than its final
  // height, clamping the scroll below `y` with nothing to correct it
  // afterward. Re-apply while the document keeps resizing, for a bounded
  // window. This only reacts to layout resize, never to scrolling itself,
  // so it can't fight a real user scrolling the page.
  const observer = new ResizeObserver(() => {
    if (window.scrollY < y) apply();
  });
  observer.observe(document.documentElement);
  window.setTimeout(() => observer.disconnect(), SETTLE_WINDOW_MS);
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
