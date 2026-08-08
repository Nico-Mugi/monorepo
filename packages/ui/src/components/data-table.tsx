import type { ReactNode } from "react";
import type { ReactTable } from "@tanstack/react-table";
import type { RowData, TableFeatures } from "@tanstack/react-table";

import { cn } from "../utils/cn";

export type DataTableProps<TFeatures extends TableFeatures, TData extends RowData> = {
  /** Build this with `useTable({ features, columns, data })` in the consuming
   *  component — a generic wrapper can't call `useTable` itself and stay typed,
   *  since `ValidateFeatureSlots` needs the concrete `features` object from the
   *  call site, not an upper-bounded generic. See `packages/ui/docs/tanstack-table-v9.md`. */
  table: ReactTable<TFeatures, TData>;
  columnCount: number;
  emptyMessage?: ReactNode;
  className?: string;
};

export function DataTable<TFeatures extends TableFeatures, TData extends RowData>({
  table,
  columnCount,
  emptyMessage,
  className,
}: DataTableProps<TFeatures, TData>) {
  const rows = table.getRowModel().rows;

  return (
    <div className={cn("overflow-x-auto rounded-2xl border border-border", className)}>
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/40">
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 font-medium text-muted-foreground"
                >
                  {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columnCount}
                className="px-4 py-6 text-center text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="border-t border-border">
                {row.getAllCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    <table.FlexRender cell={cell} />
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
