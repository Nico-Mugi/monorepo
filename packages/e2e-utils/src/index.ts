import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

/** Locates the shared `@repo/ui` LocaleSwitcher's button group. */
export function localeSwitcherGroup(page: Page) {
  return page.locator('[data-slot="locale-switcher"]');
}

/** Locates a single locale option button inside the switcher, e.g. `localeOption(page, "en")`. */
export function localeOption(page: Page, code: string) {
  return page.locator(`[data-slot="locale-option"][data-locale="${code}"]`);
}

export type SwitchLocaleOptions = {
  /** Locale code to switch to, e.g. "en" or "fr". */
  to: string;
  /** Regex the URL should match once the switch completes. */
  expectUrl: RegExp;
  /** Text expected to be visible on the page once switched. */
  expectText: string | RegExp;
  timeout?: number;
};

/**
 * Clicks the shared LocaleSwitcher and waits for the page to land on the new
 * locale. `setLocale()` does a full page reload, so this waits on the URL
 * rather than assuming an SPA transition.
 */
export async function switchLocale(page: Page, options: SwitchLocaleOptions) {
  const { to, expectUrl, expectText, timeout = 10000 } = options;
  await localeOption(page, to).click();
  await expect(page).toHaveURL(expectUrl, { timeout });
  await expect(page.getByText(expectText)).toBeVisible();
}

export async function expectHtmlLang(page: Page, locale: string) {
  await expect(page.locator("html")).toHaveAttribute("lang", locale);
}

export async function expectActiveLocale(page: Page, code: string) {
  await expect(localeOption(page, code)).toHaveAttribute("aria-pressed", "true");
}

/** Scrolls to the bottom of the page and returns the resulting `scrollY`. */
export async function scrollToBottom(page: Page): Promise<number> {
  return page.evaluate(() => {
    // Explicit "instant" behavior bypasses any `scroll-smooth` CSS on the
    // page, which would otherwise still be animating when `scrollY` is read.
    window.scrollTo({ top: document.documentElement.scrollHeight, left: 0, behavior: "instant" });
    return window.scrollY;
  });
}

/**
 * Waits for `window.scrollY` to settle at the position saved before a hard
 * reload (e.g. a locale switch), as applied by `restoreScrollPosition()` from
 * `@repo/ui` in a mount effect. Translated pages can differ in content
 * length, so the destination page's max scroll offset may be lower than
 * `expectedY` — the target is clamped to whatever that page can actually
 * reach, same as `window.scrollTo` itself would clamp it.
 */
export async function expectScrollRestored(
  page: Page,
  expectedY: number,
  options?: { tolerance?: number; timeout?: number },
) {
  const tolerance = options?.tolerance ?? 5;
  await expect
    .poll(
      async () => {
        const { scrollY, maxScrollY } = await page.evaluate(() => ({
          scrollY: window.scrollY,
          maxScrollY: document.documentElement.scrollHeight - window.innerHeight,
        }));
        const target = Math.min(expectedY, Math.max(maxScrollY, 0));
        return Math.abs(scrollY - target) <= tolerance;
      },
      { timeout: options?.timeout ?? 5000 },
    )
    .toBe(true);
}
