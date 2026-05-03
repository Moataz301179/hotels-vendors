/**
 * Stat Card — Dashboard KPI Card
 */

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  className,
}: StatCardProps) {
  const changeColor =
    changeType === "positive"
      ? "text-emerald-400"
      : changeType === "negative"
      ? "text-red-400"
      : "text-[var(--foreground-muted)]";

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-[var(--foreground-secondary)]">{title}</p>
            <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{value}</p>
            {change && (
              <p className={cn("text-xs mt-1 font-medium", changeColor)}>{change}</p>
            )}
          </div>
          {icon && (
            <div className="p-2 rounded-lg bg-[var(--surface-raised)] text-[var(--foreground-secondary)]">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
