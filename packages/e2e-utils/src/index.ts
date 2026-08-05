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
