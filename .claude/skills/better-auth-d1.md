---
description: Add better-auth (email/password + OAuth + anonymous) backed by a new Cloudflare D1 database to a TanStack Start app in this monorepo. Use when asked to add auth/login/accounts, or to set up D1 for the first time in an app.
disable-model-invocation: true
tools:
  - Read
  - Edit
  - Write
  - Bash
---

D1 + better-auth is opt-in per app — most apps in this monorepo have neither. This is the
pattern used for `parlor` (`apps/parlor`), the first app to add both. Every gotcha below
was hit for real building that integration; skipping one reproduces the same failure.

## Step 1 — Provision D1

`wrangler d1 create <name>-db` creates a real Cloudflare-account-scoped resource —
**confirm with the user before running it**, same as `wrangler secret put`. Add the
returned `database_id` to `wrangler.jsonc`:

```jsonc
"d1_databases": [
  { "binding": "DB", "database_name": "<name>-db", "database_id": "<from create step>", "migrations_dir": "migrations" }
]
```

`database_id` isn't secret — fine to commit, same tier as a Durable Object's `class_name`.
Then `pnpm --filter <name> cf-typegen` so `Env.DB: D1Database` is typed.

## Step 2 — drizzle-kit, scoped to the new schema only

If the app already has other SQLite usage (e.g. per-Durable-Object storage via
`drizzle-orm/durable-sqlite` with hand-rolled `CREATE TABLE IF NOT EXISTS`), **don't**
fold it into this migration flow — D1 and DO-local storage are different databases with
different lifecycles. `drizzle.config.ts` should list only the new D1-backed schema
files:

```ts
export default defineConfig({
  dialect: "sqlite",
  schema: ["./src/db/schema.auth.ts", "./src/db/schema.<domain>.ts"],
  out: "./migrations",
});
```

Add `drizzle-kit` to the root `pnpm-workspace.yaml` catalog next to `drizzle-orm`.

**Migration workflow is `drizzle-kit generate` (SQL files only) + `wrangler d1 migrations
apply <name>-db --local` / `--remote`** — not `drizzle-kit push`/`migrate`, which don't
target D1's `wrangler`-managed migration bookkeeping.

**`.wrangler/state` holds the local D1 emulation's actual data.** Running this repo's
`clean` script (`rimraf dist .output .wrangler`) after you've already migrated wipes it
silently — the next request fails with a drizzle "no such table" error that looks like a
real bug. Fix is just re-running `wrangler d1 migrations apply <name>-db --local`; don't
chase it as an app bug first.

## Step 3 — the CLI-vs-Workers-runtime split (the one that bites hardest)

`npx @better-auth/cli generate` runs under **plain Node**, but the recommended way to
reach Cloudflare bindings from anywhere in app code — `import { env } from
"cloudflare:workers"` — is a Workers-only virtual module. A module-level import of it (not
even a call, just the `import` statement) throws immediately if the CLI's Node process
ever loads that file, including transitively.

Fix: give the shared `auth.ts`/`db/client.ts` an explicit `D1Database` **parameter**
instead of reaching for the ambient import, so they stay plain-Node-loadable:

```ts
// src/lib/auth.ts — no cloudflare:workers import anywhere in this file
export function createAuth(db?: D1Database) {
  return betterAuth({
    database: drizzleAdapter(db ? drizzle(db, { schema: authSchema }) : ({} as never), { provider: "sqlite" }),
    // ...
  });
}
```

When `db` is omitted, the adapter is a type-only stand-in — `generate` only introspects
the plugin/config shape, it never executes a query. Then add a **Node-only entry file at
the app root** (outside `src/`, so the real Vite/Workers build never imports it) purely
for the CLI to target:

```ts
// apps/<name>/auth.cli.ts
import { createAuth } from "./src/lib/auth";
export const auth = createAuth();
```

```bash
npx @better-auth/cli@latest generate --config auth.cli.ts --output src/db/schema.auth.ts
```

Bootstrap order for the very first run: create a placeholder `schema.auth.ts` (`export
{};`) before `auth.ts` can import from it at all, run `generate` to overwrite it for
real, *then* write any hand-rolled schema (e.g. a `rooms` table) that references the
generated `user` table.

**Where each call style is actually correct**, since the fix above trades away the
"read env anywhere" convenience:

- `db/client.ts`, `auth.ts` (loaded by the CLI): take `db`/bindings as parameters, no
  `cloudflare:workers` import.
- `server.ts`'s `fetch(req, env)`: already has `env` from its own signature — pass
  `env.DB` straight through, no import needed.
- Any `createServerFn().handler()` (no `env` parameter exists in that signature): import
  `env` from `cloudflare:workers` locally in that leaf file. This is safe specifically
  because the CLI never loads server-function files, only `auth.ts`/its transitive
  imports — confirmed correct usage per Cloudflare's own TanStack Start framework guide.
- Never read `env`/`process.env` at true module scope in a file that's part of the
  Workers bundle — only inside a function body that runs per-request. `process.env.*`
  auto-populates from bindings on Workers at compat dates ≥ 2025-04-01, but only once a
  request context exists; a module-level read (including one buried in a top-level
  `export const auth = createAuth()`, which _executes_ at import time) evaluates before
  that and typically reads as `undefined`.

## Step 4 — client-side auth client

```ts
// src/lib/auth-client.ts
export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : undefined,
  plugins: [anonymousClient()], // only if using the anonymous plugin
});
```

`baseURL: "/"` throws `Invalid base URL: /. Please provide a valid base URL.` at runtime
the moment any `authClient` method is called — better-auth's fetch client needs a real
origin or nothing, not a relative path. This module gets imported by server-rendered
routes too (anything calling `authClient` from a click handler in an SSR'd component), so
the `typeof window` guard matters: construction must survive SSR even though the actual
calls only ever fire client-side after hydration.

## Step 5 — rate limiting: the built-in defaults have a blind spot

better-auth enables rate limiting by default in production, **and it has its own
built-in special-case rule** (not something you configured) that matches any path
starting with `/sign-in` — including `/sign-in/anonymous` — to 3 requests per 10 seconds.
That's meant to slow down password guessing; anonymous sign-in has no credential to
guess, but gets caught anyway. If the app offers a frictionless "continue as guest" path,
a burst of legitimate guests within 10s (e.g. everyone behind one office NAT opening the
same shared link) gets needlessly locked out. Override it explicitly:

```ts
rateLimit: {
  storage: "database", // "memory" (default) doesn't survive Workers isolate recycling
  customRules: {
    "/sign-in/anonymous": { window: 10, max: 30 },
  },
},
advanced: {
  ipAddress: { ipAddressHeaders: ["cf-connecting-ip"] },
},
```

Without `ipAddressHeaders`, rate limiting can't resolve a per-visitor IP on Workers at
all and falls back to one shared bucket for every request the Worker sees — useless as a
defense, and it rate-limits unrelated visitors against each other. `cf-connecting-ip` is
set by Cloudflare's edge on every request automatically; it's meaningless locally
(`vite dev`/Miniflare has no such header), which is fine — it's a production-only fix.

`customRules` keys match better-auth's **internal relative path** (e.g. `/sign-in/email`,
`/sign-in/anonymous`), not the mounted `/api/auth/...` prefix — check
`createAuthEndpoint("/sign-in/anonymous", ...)`-style definitions in the plugin source if
unsure which string to use.

## Step 6 — the anonymous plugin's default name is a usable sentinel

`anonymous()` mints a real user row with `name: "Anonymous"` (or whatever
`options.generateName` returns) since `user.name` is `NOT NULL` and there's no signup
form to collect one. Comparing `session.user.name === "Anonymous"` is a reasonable "has
this person set a real display name yet" check for gating a name-prompt UI — cleaner
than inventing a separate "hasName" flag.

## Step 7 — debugging without opening a browser

`pnpm dev`/`vite dev` running under `@cloudflare/vite-plugin` in an agent context exposes
a **Local Explorer API** (its own startup log prints the exact URLs) — use it instead of
guessing:

- `POST /cdn-cgi/local/explorer/api/d1/database/<uuid>/raw` with `{"sql": "..."}` — run
  read/write SQL directly against the local D1 emulation. Good for confirming a migration
  actually applied, or that a server function wrote/read what you expect, without
  spinning up a browser.
- `POST /cdn-cgi/local/explorer/api/local/observability/query` — SQL over captured
  request traces/console logs (tables: `spans`, `logs`).

Also just `curl` the mounted auth routes directly (`POST /api/auth/sign-in/anonymous`,
`GET /api/auth/get-session` with `-b`/`-c` cookie jars) to verify the auth flow end to end
before ever touching Playwright — it's faster to isolate "is this an app bug or a test
bug" this way.

## Testing gotcha: don't use "is a dialog visible" to mean "did the async step finish"

If a UI step replaces one dialog's content with another after an `await` (e.g. "click
guest → sign in anonymously → dialog now shows a name prompt"), asserting
`expect(dialogLocator).toBeVisible()` right after the click is a no-op wait: it's the
*same* dialog element throughout, so it's already trivially true before the transition
happens, and the test proceeds to interact with the pre-transition content. This produces
a strict-mode/"wrong element" failure downstream that looks unrelated to the real cause,
and — worse — passes on a fast machine and fails intermittently under load (CPU
contention from tracing/video recording, parallel workers), making it look like app
flakiness. Wait for the actual resulting shape instead:

```ts
await guestButton.click();
await expect(dialog.getByRole("textbox")).toHaveCount(1); // 2 fields (email+password) -> 1 (name)
```

Same fix applies to `locator.isVisible()` used for branching logic — it doesn't
auto-wait/retry, so it can race an element's own children painting right after its
parent becomes visible. Use `locator.waitFor({ state: "visible", timeout })` (which
retries) when the answer needs to be "not there yet" vs. "genuinely absent."
