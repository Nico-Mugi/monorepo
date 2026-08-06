# @repo/registry

shadcn-compatible component registry generated from `@repo/ui`. Lets anyone
run `npx shadcn add <url>/r/<component>.json` to pull a component's source
directly into their own project — same pattern as shadcn/ui's own registry.

`@repo/ui` is the source of truth; this package never hand-edits component
code, it only repackages it for external distribution. Served live by the
[registry-showcase](../../apps/registry-showcase) app.

## How it works

1. `registry.json` declares each published item (name, type, source file paths).
2. `pnpm sync` (`scripts/sync-from-ui.mjs`) reads those source files straight out of
   `packages/ui/src/components/`, rewrites monorepo-internal imports to the
   shadcn-standard aliases external consumers expect (e.g. `../utils/cn` →
   `@/lib/utils`), and writes the result into `registry/` — since `shadcn build`
   inlines file content verbatim and won't read outside `packages/registry`.
3. `pnpm build` runs the sync, then `shadcn build` compiles `registry/` into the
   static JSON files served under `public/r/`.

`registry/` and `public/` are both gitignored — generated output, rebuilt on demand.

## Commands

```bash
pnpm sync --filter @repo/registry    # regenerate registry/*.tsx from @repo/ui
pnpm build --filter @repo/registry   # sync + compile to public/r/*.json
pnpm clean --filter @repo/registry   # remove generated public/ and registry/
```

## Exports

| Path | What it resolves to |
| --- | --- |
| `@repo/registry/registry.json` | The registry manifest (item names, types, file lists) |

## Adding a new item

1. Add the component to `@repo/ui` first (see that package's README).
2. Add an entry to `registry.json` pointing at the component's file(s).
3. Run `pnpm sync` and check the generated file under `registry/`.
4. Add a demo route in `apps/registry-showcase` if it should be showcased live.
