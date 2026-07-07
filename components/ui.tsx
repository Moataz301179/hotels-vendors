import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BtnProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

const base = "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-lime/40 disabled:opacity-50 whitespace-nowrap";

const vars: Record<string, string> = {
  primary: "bg-lime text-bg hover:bg-lime-light shadow-[0_18px_40px_-28px_var(--lime)]",
  secondary: "border border-border-2 text-fg-2 hover:text-fg hover:border-border-3 bg-bg-1",
  ghost: "text-fg-3 hover:text-fg",
};

const sizes: Record<string, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-sm",
};

export function Btn({ children, href, variant = "primary", size = "md", className, type = "button", disabled }: BtnProps) {
  const cls = cn(base, vars[variant], sizes[size], className);
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button type={type} className={cls} disabled={disabled}>{children}</button>;
}

export function Badge({ children, tone = "lime", className }: { children: ReactNode; tone?: string; className?: string }) {
  const t: Record<string, string> = {
    lime: "bg-lime-dim text-lime border-lime/20",
    brand: "bg-lime-dim text-lime border-lime/20",
    gold: "bg-gold-dim text-gold border-gold/20",
    accent: "bg-gold-dim text-gold border-gold/20",
    muted: "bg-bg-2 text-fg-3 border-border-2",
    green: "bg-green/10 text-green border-green/20",
    success: "bg-green/10 text-green border-green/20",
    red: "bg-red/10 text-red border-red/20",
    danger: "bg-red/10 text-red border-red/20",
    yellow: "bg-yellow/10 text-yellow border-yellow/20",
    warning: "bg-yellow/10 text-yellow border-yellow/20",
    blue: "bg-blue/10 text-blue border-blue/20",
    info: "bg-blue/10 text-blue border-blue/20",
  };
  return <span className={cn("inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium", t[tone] || t.muted, className)}>{children}</span>;
}

export function StatusPill({ status }: { status: string }) {
  const m: Record<string, string> = {
    delivered: "green", settled: "green", paid: "green", repaid: "green", verified: "green",
    confirmed: "blue", financed: "lime", funded: "lime", approved: "lime",
    in_transit: "blue", repaying: "blue",
    pending: "yellow", requested: "yellow", issued: "yellow", due: "yellow", in_review: "yellow",
    overdue: "red", declined: "red", cancelled: "red", rejected: "red",
  };
  return <Badge tone={m[status] || "muted"}>{status.replace(/_/g, " ")}</Badge>;
}

export function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-bg-1 p-5">
      <p className="text-xs text-fg-3 uppercase tracking-wider">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {sub && <p className="mt-1 text-xs text-fg-4">{sub}</p>}
    </div>
  );
}
