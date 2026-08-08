# TanStack Table v9 notes (cached, no need to re-fetch)

Pulled via `npx @tanstack/intent@latest load @tanstack/react-table#getting-started`
and `@tanstack/table-core#typescript` while building `DataTable`
(`packages/ui/src/components/data-table.tsx`). These skills are bundled inside the
installed `@tanstack/react-table`/`@tanstack/table-core` packages themselves (source:
"local", not a network fetch) — re-running the `load` command re-reads them from
`node_modules` and stays current with whatever version is installed. This file is a
point-in-time copy for quick reference; re-run the CLI if the installed version bumps.

To refresh or browse other skills: `npx @tanstack/intent@latest list` /
`npx @tanstack/intent@latest load <package>#<skill>` from `packages/ui`.

## `@tanstack/react-table#getting-started`

v9 uses `useTable`, not v8's `useReactTable`. Optional row models (sorting, filtering,
pagination, etc.) are registered as **feature slots** via `tableFeatures({...})`, not
passed as table options.

```tsx
import { useMemo, useState } from 'react'
import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'

type Person = { name: string; age: number }
const features = tableFeatures({})
const helper = createColumnHelper<typeof features, Person>()
const columns = helper.columns([
  helper.accessor('name', { header: 'Name' }),
  helper.accessor('age', { header: 'Age' }),
])

export function PeopleTable() {
  const [data] = useState<Person[]>([{ name: 'Ada', age: 36 }])
  const table = useTable({ features, columns, data })

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((group) => (
          <tr key={group.id}>
            {group.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder ? null : <table.FlexRender header={header} />}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getAllCells().map((cell) => (
              <td key={cell.id}>
                <table.FlexRender cell={cell} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

Table produces models and state; React owns the semantic markup, styles, event
affordances, and accessibility — this is why `DataTable` renders plain `<table>`
markup around whatever instance it's given, rather than trying to own behavior.

Only add the feature slots actually used:

```tsx
import {
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/react-table'

const sortableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
})
```

Keep static `data`/`columns` outside render (module scope or memoized) — a fresh
fallback array every render invalidates data-dependent models.

### Common mistakes flagged by the skill

- **[HIGH]** Copying the v8 constructor shape (`useReactTable({ data, columns,
  getCoreRowModel: getCoreRowModel() })`) instead of `useTable({ data, columns,
  features })`.
- **[HIGH]** Assuming feature APIs (e.g. sorting state/methods) exist without
  registering the feature in `tableFeatures({...})` first.
- **[MEDIUM]** Recreating a fallback data array (`data: response.data ?? []`) inline
  every render instead of a stable module-scope `EMPTY_DATA` constant.

## `@tanstack/table-core#typescript`

Preserve v9 type inference by letting the concrete `features` object and
`createColumnHelper` carry types through, rather than re-annotating with the broad
`TableFeatures` type.

```ts
import {
  createColumnHelper,
  metaHelper,
  tableFeatures,
} from '@tanstack/table-core'

type Person = { id: string; age: number }
type ColumnMeta = { align?: 'start' | 'end' }
const features = tableFeatures({ columnMeta: metaHelper<ColumnMeta>() })
const helper = createColumnHelper<typeof features, Person>()
export const columns = helper.columns([
  helper.accessor('age', { meta: { align: 'end' } }),
])
```

- Use `helper.columns([...])` (preserves each accessor's `TValue`) rather than a
  manually widened `ColumnDef<...>[]` annotation.
- Use `tableOptions<typeof features, TData>({...})` to compose reusable option
  fragments.

### Why a fully generic wrapper component doesn't type-check

Attempted (what `DataTable` originally tried):

```tsx
function DataTable<TFeatures extends TableFeatures, TData extends RowData>({
  features, columns, data,
}: { features: TFeatures; columns: ColumnDef<TFeatures, TData, any>[]; data: TData[] }) {
  const table = useTable({ features, columns, data }) // TS2345
  ...
}
```

This fails: `useTable`'s internal `ValidateFeatureSlots<TFeatures>` needs the
**concrete** feature registry produced by a specific `tableFeatures({...})` call, not
an arbitrary type merely constrained by `extends TableFeatures`. `TFeatures` being
upper-bounded isn't enough — self-referential feature validation needs the literal
type, i.e. `typeof features` at the call site, which a generic parameter can't
reproduce.

**Fix used in `DataTable`**: don't call `useTable` inside the shared component at all.
Have the *consumer* call `useTable({ features, columns, data })` (where type inference
works fine, since it's the concrete call site) and pass the already-constructed `table`
instance into `DataTable` as a prop. `DataTable` then only renders `table.getHeaderGroups()`
/ `table.getRowModel()` / `table.FlexRender` — it never needs to satisfy
`ValidateFeatureSlots` itself, since that check already passed at the `useTable` call.
This also matches the skill's guidance to let userland call sites carry inference and
keep internal generic signatures out of application code.

### Other flagged mistakes

- **[MEDIUM]** Threading feature generics manually via `type Features = TableFeatures`
  instead of `type Features = typeof features`.
- **[MEDIUM]** Declaration-merging column `meta` globally (`declare module
  '@tanstack/table-core' { interface ColumnMeta ... }`) instead of scoping it via
  `tableFeatures({ columnMeta: metaHelper<...>() })` — v9 keeps meta types scoped per
  table factory, not global.
