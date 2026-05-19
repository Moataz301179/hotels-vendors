/**
 * Status Badge Component
 * 
 * Enterprise-grade status indicators with OLED-optimized colors.
 * Designed for enterprise dashboards and data tables.
 * 
 * @version 1.0.0
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        // Standard enterprise statuses
        active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        pending: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        inactive: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
        error: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
        warning: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
        info: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
        
        // Premium accent variants
        crimson: "bg-[var(--crimson-glow-soft)] text-[var(--crimson-primary)] border border-[var(--crimson-glow-medium)]",
        gold: "bg-[var(--gold-subtle)] text-[var(--gold-primary)] border border-[rgba(201,162,39,0.3)]",
        
        // Processing states
        processing: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        syncing: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
        
        // Minimal variants
        minimal: "bg-transparent text-[var(--enterprise-500)]",
        minimalActive: "bg-transparent text-emerald-400",
        minimalPending: "bg-transparent text-amber-400",
        minimalError: "bg-transparent text-rose-400",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        default: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
      dot: {
        true: "",
        false: "",
      },
      pulse: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      variant: "active",
      size: "default",
      dot: false,
      pulse: false,
    },
  }
);

const dotVariants = cva("rounded-full", {
  variants: {
    variant: {
      active: "bg-emerald-400",
      pending: "bg-amber-400",
      inactive: "bg-slate-400",
      error: "bg-rose-400",
      warning: "bg-orange-400",
      info: "bg-sky-400",
      crimson: "bg-[var(--crimson-primary)]",
      gold: "bg-[var(--gold-primary)]",
      processing: "bg-blue-400",
      syncing: "bg-violet-400",
      minimal: "bg-[var(--enterprise-500)]",
      minimalActive: "bg-emerald-400",
      minimalPending: "bg-amber-400",
      minimalError: "bg-rose-400",
    },
    size: {
      sm: "w-1 h-1",
      default: "w-1.5 h-1.5",
      lg: "w-2 h-2",
    },
  },
  defaultVariants: {
    variant: "active",
    size: "default",
  },
});

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  label?: string;
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, variant, size, dot, pulse, label, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(statusBadgeVariants({ variant, size, dot, pulse }), className)}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              dotVariants({ variant, size }),
              pulse && "animate-pulse"
            )}
          />
        )}
        {label || children}
      </span>
    );
  }
);
StatusBadge.displayName = "StatusBadge";

// Animated Status Badge with glow effect
interface StatusBadgeAnimatedProps extends StatusBadgeProps {
  glow?: boolean;
}

const StatusBadgeAnimated = React.forwardRef<HTMLSpanElement, StatusBadgeAnimatedProps>(
  ({ className, glow = false, ...props }, ref) => {
    return (
      <StatusBadge
        ref={ref}
        className={cn(
          glow && "shadow-[0_0_12px_currentColor]",
          className
        )}
        {...props}
      />
    );
  }
);
StatusBadgeAnimated.displayName = "StatusBadgeAnimated";

// Status Badge Group for multiple statuses
interface StatusBadgeGroupProps {
  statuses: Array<{
    id: string;
    label: string;
    variant: VariantProps<typeof statusBadgeVariants>["variant"];
    count?: number;
  }>;
  size?: VariantProps<typeof statusBadgeVariants>["size"];
  className?: string;
}

const StatusBadgeGroup: React.FC<StatusBadgeGroupProps> = ({ 
  statuses, 
  size = "default",
  className 
}) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {statuses.map((status) => (
        <StatusBadge
          key={status.id}
          variant={status.variant}
          size={size}
          dot={false}
        >
          {status.label}
          {status.count !== undefined && (
            <span className="ml-1 text-[var(--enterprise-600)]">
              {status.count}
            </span>
          )}
        </StatusBadge>
      ))}
    </div>
  );
};

export { StatusBadge, StatusBadgeAnimated, StatusBadgeGroup };
