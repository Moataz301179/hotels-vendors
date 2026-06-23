const BG_CARD = "#1a1e23";
const BORDER = "rgba(60,64,67,0.50)";
const TEXT_PRIMARY = "#E9ECEF";
const TEXT_SECONDARY = "#9AA0A6";
const TEXT_MUTED = "#6C757D";
const ACCENT_LIME = "#FF6B00";

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
    <div
      className="rounded-xl p-5"
      style={{
        backgroundColor: BG_CARD,
        border: `1px solid ${accent ? "rgba(255,107,0,0.20)" : BORDER}`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: TEXT_MUTED }}>
          {title}
        </span>
        {icon && <span style={{ color: ACCENT_LIME }}>{icon}</span>}
      </div>
      <div className="text-2xl font-bold tracking-tight" style={{ color: accent ? ACCENT_LIME : TEXT_PRIMARY }}>
        {typeof value === "number" ? value.toLocaleString("en-EG") : value}
      </div>
      {subtitle && (
        <p className="text-[12px] mt-1" style={{ color: TEXT_SECONDARY }}>
          {subtitle}
        </p>
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
