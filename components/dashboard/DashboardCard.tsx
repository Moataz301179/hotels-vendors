"use client";

import { ReactNode, useState, useEffect, useCallback } from "react";
import { Download, GripVertical } from "lucide-react";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  onDownloadCsv?: () => void;
  customizeKey?: string;
  className?: string;
}

/**
 * Brutalist card wrapper used across all role dashboards.
 * Supports CSV export and drag-to-rearrange (layout stored in localStorage).
 */
export function DashboardCard({
  title,
  children,
  onDownloadCsv,
  customizeKey,
  className = "",
}: DashboardCardProps) {
  return (
    <div
      className={`rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 ${className}`}
      style={{ borderWidth: 1, borderStyle: "solid", borderColor: "var(--border-subtle)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          {title}
        </h3>
        <div className="flex items-center gap-1">
          {onDownloadCsv && (
            <button
              onClick={onDownloadCsv}
              className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
              title={`Export ${title} as CSV`}
            >
              <Download size={12} />
              CSV
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

/**
 * Hook for persisting card order in localStorage.
 * Returns [orderedKeys, moveCard].
 */
export function useCustomizableLayout(storageKey: string, defaultKeys: string[]) {
  const [keys, setKeys] = useState<string[]>(defaultKeys);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setKeys(parsed);
        }
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, [storageKey]);

  const moveCard = useCallback(
    (fromIndex: number, toIndex: number) => {
      setKeys((prev) => {
        const next = [...prev];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [storageKey]
  );

  return { keys, moveCard, loaded };
}
