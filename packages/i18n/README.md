# i18n

Shared [inlang](https://inlang.com)/[Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs)
translation project. Every app in the monorepo compiles its own Paraglide
runtime from this single source of truth, so message keys and locales stay
consistent across apps.

- **Base locale**: `fr`
- **Locales**: `fr`, `en`
- **Source files**: `messages/fr.json`, `messages/en.json`

## Message key naming convention

`<scope>_<section>_<description>` — all lowercase, underscores, hierarchical.
`scope` is the owning app's name (`portfolio`, `playground`, `registry`,
`signature`, …), or `shared` for copy reused across apps via `@repo/ui`
(nav labels, locale switcher, etc.).

Examples: `portfolio_contact_label_email`, `signature_field_name_label`,
`shared_nav_home`.

Always add new keys to **both** `fr.json` and `en.json` — `fr` is the base
locale, so inlang warns if a key exists in `en` but not `fr`.

## Compiling

Each app compiles its own copy of the Paraglide runtime into its gitignored
`src/lib/paraglide/` directory. This isn't run from this package — run it from
the consuming app (or let its `dev`/`build` script do it):

```bash
pnpm exec paraglide-js compile --project ../../packages/i18n/project.inlang --outdir ./src/lib/paraglide
```

If an app's TypeScript doesn't pick up a newly added key, recompile (or
restart its dev server, which recompiles automatically via its Vite plugin).

## Structure

```
project.inlang/    # inlang project config + build cache (gitignored cache/)
messages/
├── fr.json        # base locale — source of truth for which keys exist
└── en.json
```
