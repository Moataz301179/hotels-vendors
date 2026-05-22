/**
 * Enterprise Button Component
 * 
 * OLED-optimized, institutional-grade button variants.
 * Inspired by: Stripe Dashboard, Linear, Mercury
 * 
 * @version 1.0.0
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonEnterpriseVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-semibold tracking-[-0.01em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crimson-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:pointer-events-none disabled:opacity-50 cursor-pointer overflow-hidden relative active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-[var(--crimson-rich)] to-[var(--crimson-primary)] text-white border border-[var(--crimson-glow-medium)] shadow-[0_1px_2px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)_inset,0_0_24px_rgba(139, 92, 246,0.3)] hover:shadow-[0_4px_16px_rgba(139, 92, 246,0.4),0_0_0_1px_rgba(255,255,255,0.08)_inset] hover:translate-y-[-1px] hover:from-[var(--crimson-bright)] hover:to-[var(--crimson-rich)]",
        secondary:
          "bg-[var(--surface-raised)] text-[var(--text-primary)] border border-[var(--border-default)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-subtle)]",
        ghost:
          "bg-transparent text-[var(--text-secondary)] border border-transparent hover:bg-white/[0.03] hover:text-[var(--text-primary)] hover:border-[var(--border-default)]",
        outline:
          "bg-transparent text-[var(--text-primary)] border border-[var(--border-default)] hover:bg-white/[0.03] hover:border-[var(--border-subtle)]",
        gold:
          "bg-gradient-to-b from-[#E1B93F] to-[#C9A227] text-[var(--text-inverse)] border border-[rgba(225,185,63,0.5)] shadow-[0_1px_2px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_16px_rgba(201,162,39,0.3)] hover:translate-y-[-1px]",
        glass:
          "bg-[rgba(10,10,16,0.75)] backdrop-blur-xl text-[var(--text-primary)] border border-[var(--border-enterprise-default)] shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:bg-[rgba(15,15,21,0.85)] hover:border-[var(--border-enterprise-visible)]",
        destructive:
          "bg-gradient-to-b from-[#f87171] to-[#ef4444] text-white border border-[rgba(248,113,113,0.5)] hover:shadow-[0_4px_16px_rgba(239,68,68,0.3)]",
        link:
          "bg-transparent text-[var(--crimson-primary)] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-8 px-3 text-xs rounded-lg",
        lg: "h-11 px-6 text-base rounded-xl",
        xl: "h-12 px-8 text-base rounded-xl",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8 rounded-lg",
        "icon-lg": "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonEnterpriseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonEnterpriseVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

const ButtonEnterprise = React.forwardRef<HTMLButtonElement, ButtonEnterpriseProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    isLoading = false,
    loadingText,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    // Add shimmer effect for primary variant
    const shimmerClass = variant === "primary" || variant === "gold" 
      ? "before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:pointer-events-none" 
      : "";
    
    return (
      <Comp
        className={cn(
          buttonEnterpriseVariants({ variant, size, className }),
          shimmerClass,
          (isLoading || disabled) && "opacity-70 cursor-not-allowed"
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg 
              className="animate-spin h-4 w-4" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {loadingText || children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
ButtonEnterprise.displayName = "ButtonEnterprise";

export { ButtonEnterprise, buttonEnterpriseVariants };
