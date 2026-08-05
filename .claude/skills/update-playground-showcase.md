---
description: Add or refresh a project card on the Playground homepage (apps/playground)
  after creating or updating an app or package — captures a real screenshot for apps,
  or an icon placeholder for packages, and edits the data array.
disable-model-invocation: true
tools:
  - Read
  - Edit
  - Write
  - Bash
---

Playground's homepage (`apps/playground/src/routes/index.tsx`) showcases every app and
package in the monorepo as a `ProjectCard` (`apps/playground/src/components/project-card.tsx`),
split into an **Apps** section (real screenshots, more visually prominent) and a
**Packages** section (icon placeholder tiles, deliberately smaller — see
`ProjectCardProps` for the full field list: `name`, `description`, `githubHref`,
`openSource`, `chromeLabel`, plus either `href` + `screenshot` for apps or `icon` for
packages).

Run this whenever an app is created (`.claude/skills/add-app.md`) or an app's homepage
changes enough that its screenshot is stale.

## Step 1 — Is it an app or a package?

- **App** (has a live/dev-servable homepage, e.g. `apps/portfolio`): goes in the `apps`
  array, gets a real screenshot.
- **Package** (a library with no page to render, e.g. `packages/react-tailwind-to-pdf`):
  goes in the `packages` array, gets a `lucide-react` icon instead — skip straight to
  Step 5.

## Step 2 — Start the target app's dev server

Check its assigned port in `.claude/skills/add-app.md`'s port table.

```bash
pnpm dev --filter <name>
```

Run this in the background, then poll until it responds before moving on:

```bash
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:<port>/
```

**Special case — the target app is playground itself:** capturing playground's own
homepage while its own card is in the `apps` array produces a recursive screenshot
(the card shows a shrunk copy of the page, which shows the card again, ad infinitum,
and looks broken until it's been captured twice to "settle"). Instead, temporarily
delete the Playground entry from the `apps` array, capture, then restore it — see
Step 5.

## Step 3 — Capture the screenshot

Playground has its own `playwright` devDependency and a checked-in script for this —
no need to write an ad hoc script into another app's `node_modules` (`playwright`'s
browsers are cached globally, so this resolves without a fresh download):

```bash
pnpm --filter playground run screenshot http://localhost:<port>/ <name>.png
```

This saves to `apps/playground/public/screenshots/<name>.png`. Use a filename that
matches the app's directory name under `apps/` for consistency with existing entries
(`portfolio.png`, `registry-showcase.png`, `playground.png`).

Kill the target app's dev server once the screenshot is saved (`pnpm kill-dev` covers
all of them if several are running).

## Step 4 — Verify the screenshot

Read the saved PNG back (the `Read` tool displays images) before wiring it into the
page — confirm it's not a blank/loading state. If it looks incomplete, the site likely
hadn't finished rendering; recapture (the script already waits for `networkidle`, but
client-heavy pages may need a longer wait — edit the script's `waitUntil` temporarily
if so, don't leave it changed).

## Step 5 — Add or update the entry

Edit `apps/playground/src/routes/index.tsx`. Fields per `ProjectCardProps`:

| Field         | Apps                                              | Packages                          |
| ------------- | -------------------------------------------------- | ---------------------------------- |
| `name`        | Display name                                        | Same                                |
| `description` | One sentence, **no em-dash** (see design-system.md) | Same                                |
| `href`        | Production URL                                      | Omit (no live page)                 |
| `githubHref`  | `` `${GITHUB_ROOT}/apps/<name>` ``                  | `` `${GITHUB_ROOT}/packages/<name>` `` |
| `openSource`  | `true` unless the app is gitignored/private         | Same rule                           |
| `chromeLabel` | Production hostname (shown in the card's browser-chrome bar) | `packages/<name>` path       |
| `screenshot`  | `{ src: "/screenshots/<name>.png", alt: "..." }`    | Omit                                |
| `icon`        | Omit                                                | A `lucide-react` icon matching what the package does |

Apps are ordered by how they were added (Portfolio, Registry Showcase, Playground —
append new apps at the end unless told otherwise). Same for packages.

**If this was the playground-itself special case from Step 2:** the entry must already
be back in the `apps` array with its `screenshot` pointing at the freshly captured
(non-recursive) `playground.png` before you move on.

## Step 6 — Verify

1. `pnpm --filter playground type-check`
2. `Grep` `apps/playground/src` for `neutral-|#[0-9a-fA-F]{6}|bg-\[#|text-white|fill="|—`
   to catch raw colors or em-dashes (see `.claude/skills/design-system.md`).
3. Boot `pnpm dev --filter playground`, screenshot the homepage at desktop and mobile
   widths (Playwright, same pattern as Step 3) and read them back to confirm the new
   card renders correctly and the grid still wraps cleanly.
4. `pnpm kill-dev` when done.

## Checklist

- [ ] Correct array (`apps` vs `packages`)
- [ ] Screenshot captured and saved under `apps/playground/public/screenshots/` (apps only)
- [ ] Screenshot reviewed with `Read`, not blank/loading (apps only)
- [ ] Playground-self recursion avoided if applicable (Step 2 special case)
- [ ] `description` has no em-dash
- [ ] `type-check` passes
- [ ] Dev servers killed (`pnpm kill-dev`)
