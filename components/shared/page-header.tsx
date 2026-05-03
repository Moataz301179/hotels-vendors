/**
 * Page Header — Shared Layout Component
 *
 * Dashboard page title + optional action button.
 */

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div>
        <h1 className="text-xl font-semibold text-[var(--foreground)] tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-[var(--foreground-secondary)] mt-0.5">{description}</p>
        )}
      </div>
      {action && <div className="mt-2 sm:mt-0">{action}</div>}
    </div>
  );
}
