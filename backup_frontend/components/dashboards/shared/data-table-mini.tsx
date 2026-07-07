import { ReactNode } from "react";

interface Column<T> {
  key: keyof T | string;
  header: string;
  className?: string;
  render?: (row: T) => ReactNode;
}

interface DataTableMiniProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
}

export function DataTableMini<T extends Record<string, unknown>>({
  columns,
  data,
}: DataTableMiniProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-border-subtle">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="data-table-row">
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`py-3 text-sm ${col.className || ""}`}
                >
                  {col.render
                    ? col.render(row)
                    : String(row[col.key as keyof T] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
