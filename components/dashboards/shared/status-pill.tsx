interface StatusPillProps {
  status: string;
}

const STATUS_MAP: Record<string, { text: string; dot: string; bg: string }> = {
  approved: { text: "Approved", dot: "bg-accent-emerald", bg: "bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20" },
  pending: { text: "Pending", dot: "bg-accent-amber", bg: "bg-accent-amber/10 text-accent-amber border-accent-amber/20" },
  rejected: { text: "Rejected", dot: "bg-brand-500", bg: "bg-brand-700/20 text-brand-400 border-brand-700/30" },
  "in transit": { text: "In Transit", dot: "bg-accent-cyan", bg: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20" },
  confirmed: { text: "Confirmed", dot: "bg-accent-cyan", bg: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20" },
  shipped: { text: "Shipped", dot: "bg-accent-gold", bg: "bg-accent-gold/10 text-accent-gold border-accent-gold/20" },
  delivered: { text: "Delivered", dot: "bg-accent-emerald", bg: "bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20" },
  processing: { text: "Processing", dot: "bg-accent-violet", bg: "bg-accent-violet/10 text-accent-violet border-accent-violet/20" },
  draft: { text: "Draft", dot: "bg-foreground-faint", bg: "bg-surface-raised text-foreground-faint border-border-subtle" },
  low: { text: "Low Stock", dot: "bg-accent-amber", bg: "bg-accent-amber/10 text-accent-amber border-accent-amber/20" },
  critical: { text: "Critical", dot: "bg-brand-500", bg: "bg-brand-700/20 text-brand-400 border-brand-700/30" },
};

export function StatusPill({ status }: StatusPillProps) {
  const key = status.toLowerCase().replace(/_/g, " ");
  const config = STATUS_MAP[key] || STATUS_MAP.pending;
  return (
    <span className={`status-badge border ${config.bg}`}>
      <span className={`status-dot ${config.dot}`} />
      {config.text}
    </span>
  );
}
