# @repo/e2e-utils

Shared Playwright test helpers for locale-switching flows, used by every
app's own E2E suite plus `@repo/e2e-prod`. Keeps assertions about the
`@repo/ui` `LocaleSwitcher` component in one place instead of duplicated
per app.

## Install

Already wired up via pnpm workspaces:

```json
{ "devDependencies": { "@repo/e2e-utils": "workspace:*" } }
```

Peer dependency: `@playwright/test`.

## API

| Export | What it does |
| --- | --- |
| `localeSwitcherGroup(page)` | Locates the `LocaleSwitcher`'s button group |
| `localeOption(page, code)` | Locates a single locale option button, e.g. `localeOption(page, "en")` |
| `switchLocale(page, options)` | Clicks a locale option and waits for the URL + visible text to update (handles the full page reload `setLocale()` triggers) |
| `expectHtmlLang(page, locale)` | Asserts `<html lang>` matches the given locale |
| `expectActiveLocale(page, code)` | Asserts a locale option is marked active (`aria-pressed`) |

```ts
import { switchLocale, expectHtmlLang } from "@repo/e2e-utils";

await switchLocale(page, {
  to: "en",
  expectUrl: /\/en/,
  expectText: "Home",
});
await expectHtmlLang(page, "en");
```

## Commands

```bash
pnpm type-check --filter @repo/e2e-utils
```
