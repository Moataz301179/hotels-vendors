export function KPICard({
  title,
  value,
  subtitle,
  accent = false,
  icon,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  accent?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className={`card-outlined p-5 ${accent ? "border-accent-base/30" : ""}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="label-upper">{title}</span>
        {icon && <span className="text-accent-base">{icon}</span>}
      </div>
      <div className={`metric-value text-2xl tracking-tight ${accent ? "text-accent-base" : "text-foreground"}`}>
        {typeof value === "number" ? value.toLocaleString("en-EG") : value}
      </div>
      {subtitle && (
        <p className="text-sm text-foreground-secondary mt-1">{subtitle}</p>
      )}
    </div>
  );
}

export function KPIGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {children}
    </div>
  );
}
