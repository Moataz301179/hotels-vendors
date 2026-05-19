/**
 * Enterprise Card Component
 * 
 * OLED-optimized premium card variants for B2B interfaces.
 * Designed for enterprise dashboards and Bento grid layouts.
 * 
 * @version 1.0.0
 */

import * as React from "react";
import { cn } from "@/lib/utils";

// Main Card Component
export interface CardEnterpriseProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "outline" | "elevated" | "interactive";
  size?: "default" | "compact" | "spacious";
  glow?: "none" | "crimson" | "gold" | "subtle";
  isHoverable?: boolean;
  isPressable?: boolean;
}

const CardEnterprise = React.forwardRef<HTMLDivElement, CardEnterpriseProps>(
  ({ 
    className, 
    variant = "default", 
    size = "default",
    glow = "none",
    isHoverable = false,
    isPressable = false,
    children,
    ...props 
  }, ref) => {
    
    const baseStyles = "relative overflow-hidden transition-all duration-300";
    
    const variantStyles = {
      default: cn(
        "rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent",
        "bg-[var(--oled-elevated)]",
        "border border-[var(--border-enterprise-default)]"
      ),
      glass: cn(
        "rounded-2xl backdrop-blur-2xl saturate-150",
        "bg-[rgba(10,10,16,0.75)]",
        "border border-[var(--border-enterprise-default)]",
        "shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      ),
      outline: cn(
        "rounded-2xl bg-transparent",
        "border border-[var(--border-enterprise-visible)]"
      ),
      elevated: cn(
        "rounded-2xl bg-[var(--oled-raised)]",
        "border border-[var(--border-enterprise-subtle)]",
        "shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
      ),
      interactive: cn(
        "rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent",
        "bg-[var(--oled-elevated)]",
        "border border-[var(--border-enterprise-default)]",
        "cursor-pointer"
      ),
    };
    
    const sizeStyles = {
      default: "p-6",
      compact: "p-4",
      spacious: "p-8",
    };
    
    const glowStyles = {
      none: "",
      crimson: "shadow-[0_0_40px_rgba(139,0,0,0.15)]",
      gold: "shadow-[0_0_40px_rgba(201,162,39,0.12)]",
      subtle: "shadow-[0_0_30px_rgba(255,255,255,0.03)]",
    };
    
    const hoverStyles = isHoverable || variant === "interactive" 
      ? "hover:border-[var(--border-enterprise-visible)] hover:bg-[var(--oled-raised)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:translate-y-[-2px]" 
      : "";
    
    const pressStyles = isPressable 
      ? "active:translate-y-[0px] active:scale-[0.99]" 
      : "";
    
    // Subtle top highlight effect
    const highlightStyles = variant !== "outline" 
      ? "before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:pointer-events-none" 
      : "";
    
    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          glowStyles[glow],
          hoverStyles,
          pressStyles,
          highlightStyles,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardEnterprise.displayName = "CardEnterprise";

// Card Header
const CardEnterpriseHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string;
    description?: string;
    action?: React.ReactNode;
  }
>(({ className, title, description, action, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-start justify-between gap-4 mb-4", className)}
    {...props}
  >
    <div className="flex-1 min-w-0">
      {title && (
        <h3 className="text-lg font-semibold text-[var(--enterprise-200)] tracking-[-0.01em]">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-[var(--enterprise-600)] mt-1">
          {description}
        </p>
      )}
      {children}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
));
CardEnterpriseHeader.displayName = "CardEnterpriseHeader";

// Card Content
const CardEnterpriseContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative", className)}
    {...props}
  />
));
CardEnterpriseContent.displayName = "CardEnterpriseContent";

// Card Footer
const CardEnterpriseFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    bordered?: boolean;
  }
>(({ className, bordered = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-3 pt-4 mt-4",
      bordered && "border-t border-[var(--border-enterprise-subtle)]",
      className
    )}
    {...props}
  />
));
CardEnterpriseFooter.displayName = "CardEnterpriseFooter";

// Card Stat (for metric displays)
const CardEnterpriseStat = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    label: string;
    value: string | number;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    suffix?: string;
  }
>(({ className, label, value, trend, trendValue, suffix, ...props }, ref) => {
  const trendColors = {
    up: "text-emerald-400",
    down: "text-rose-400",
    neutral: "text-[var(--enterprise-600)]",
  };
  
  const trendIcons = {
    up: "↑",
    down: "↓",
    neutral: "→",
  };
  
  return (
    <div ref={ref} className={cn("space-y-1", className)} {...props}>
      <p className="text-xs font-medium text-[var(--enterprise-600)] uppercase tracking-wider">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-[var(--enterprise-100)] metric-enterprise">
          {value}
        </span>
        {suffix && (
          <span className="text-sm text-[var(--enterprise-500)]">{suffix}</span>
        )}
      </div>
      {trend && trendValue && (
        <p className={cn("text-xs font-medium flex items-center gap-1", trendColors[trend])}>
          <span>{trendIcons[trend]}</span>
          <span>{trendValue}</span>
        </p>
      )}
    </div>
  );
});
CardEnterpriseStat.displayName = "CardEnterpriseStat";

// Card Badge (for labels and tags)
const CardEnterpriseBadge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    variant?: "default" | "primary" | "success" | "warning" | "error" | "neutral";
    dot?: boolean;
    pulse?: boolean;
  }
>(({ className, variant = "default", dot = false, pulse = false, children, ...props }, ref) => {
  const badgeStyles = {
    default: "bg-white/[0.06] text-[var(--enterprise-400)] border-white/[0.08]",
    primary: "bg-[var(--crimson-glow-soft)] text-[var(--crimson-primary)] border-[var(--crimson-glow-medium)]",
    success: "bg-[rgba(52,211,153,0.10)] text-emerald-400 border-[rgba(52,211,153,0.20)]",
    warning: "bg-[rgba(251,191,36,0.10)] text-amber-400 border-[rgba(251,191,36,0.20)]",
    error: "bg-[rgba(248,113,113,0.10)] text-rose-400 border-[rgba(248,113,113,0.20)]",
    neutral: "bg-transparent text-[var(--enterprise-500)] border-[var(--border-enterprise-default)]",
  };
  
  const dotColors = {
    default: "bg-[var(--enterprise-500)]",
    primary: "bg-[var(--crimson-primary)]",
    success: "bg-emerald-400",
    warning: "bg-amber-400",
    error: "bg-rose-400",
    neutral: "bg-[var(--enterprise-600)]",
  };
  
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold border",
        badgeStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full", dotColors[variant], pulse && "animate-pulse")} />
      )}
      {children}
    </span>
  );
});
CardEnterpriseBadge.displayName = "CardEnterpriseBadge";

export {
  CardEnterprise,
  CardEnterpriseHeader,
  CardEnterpriseContent,
  CardEnterpriseFooter,
  CardEnterpriseStat,
  CardEnterpriseBadge,
};
