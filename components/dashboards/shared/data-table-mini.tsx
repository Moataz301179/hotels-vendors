"use client"

import type { ReactNode } from "react"

export interface Column<T> {
  key: string
  header: string
  align?: "left" | "center" | "right"
  render?: (item: T) => ReactNode
}

export function DataTableMini<T extends Record<string, unknown>>({
  columns,
  data,
}: {
  columns: Column<T>[]
  data: T[]
}) {
  if (!data.length) {
    return (
      <div className="command-panel rounded-xl px-4 py-12 text-center command-text-muted">
        No data available
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="command-table min-w-full text-sm">
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9bd9ea]"
                style={{ textAlign: col.align || "left" }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t border-white/[0.06]">
              {columns.map(col => (
                <td
                  key={col.key}
                  className="px-3 py-2.5 text-white/85"
                  style={{ textAlign: col.align || "left" }}
                >
                  {col.render ? col.render(row) : String(row[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
