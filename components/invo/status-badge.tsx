const BADGE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  // Procurement states
  draft: { bg: "rgba(108,117,125,0.15)", text: "#6C757D", label: "Draft" },
  pending_approval: { bg: "rgba(255,193,7,0.15)", text: "#FFC107", label: "Pending Approval" },
  approved: { bg: "rgba(57,255,126,0.12)", text: "#39ff7e", label: "Approved" },
  ordered: { bg: "rgba(100,181,246,0.15)", text: "#64b5f6", label: "Ordered" },
  shipped: { bg: "rgba(13,110,253,0.15)", text: "#64b5f6", label: "Shipped" },
  delivered: { bg: "rgba(57,255,126,0.15)", text: "#39ff7e", label: "Delivered" },
  invoiced: { bg: "rgba(196,85,255,0.15)", text: "#c455ff", label: "Invoiced" },
  paid: { bg: "rgba(57,255,126,0.15)", text: "#39ff7e", label: "Paid" },
  disputed: { bg: "rgba(239,68,68,0.15)", text: "#EF4444", label: "Disputed" },
  cancelled: { bg: "rgba(108,117,125,0.15)", text: "#6C757D", label: "Cancelled" },
  // Invoice qualification
  pending_documents: { bg: "rgba(255,193,7,0.15)", text: "#FFC107", label: "Pending Documents" },
  qualified: { bg: "rgba(57,255,126,0.15)", text: "#39ff7e", label: "Qualified" },
  rejected: { bg: "rgba(239,68,68,0.15)", text: "#EF4444", label: "Rejected" },
  expired: { bg: "rgba(108,117,125,0.15)", text: "#6C757D", label: "Expired" },
  // Fraud gate
  // (pending already mapped above)
  cleared: { bg: "rgba(57,255,126,0.15)", text: "#39ff7e", label: "Cleared" },
  flagged: { bg: "rgba(255,126,26,0.15)", text: "#ff7e1a", label: "Flagged" },
  blocked: { bg: "rgba(239,68,68,0.15)", text: "#EF4444", label: "Blocked" },
  // ETA
  submitted: { bg: "rgba(57,255,126,0.15)", text: "#39ff7e", label: "Submitted" },
  failed: { bg: "rgba(239,68,68,0.15)", text: "#EF4444", label: "Failed" },
  // Factoring match
  not_submitted: { bg: "rgba(108,117,125,0.15)", text: "#6C757D", label: "Not Submitted" },
  matched: { bg: "rgba(100,181,246,0.15)", text: "#64b5f6", label: "Matched" },
  funded: { bg: "rgba(57,255,126,0.15)", text: "#39ff7e", label: "Funded" },
  // Subscription
  trial: { bg: "rgba(255,193,7,0.12)", text: "#FFC107", label: "Trial" },
  active: { bg: "rgba(57,255,126,0.12)", text: "#39ff7e", label: "Active" },
  past_due: { bg: "rgba(255,126,26,0.15)", text: "#ff7e1a", label: "Past Due" },
  // Alerts
  open: { bg: "rgba(239,68,68,0.15)", text: "#EF4444", label: "Open" },
  acknowledged: { bg: "rgba(255,193,7,0.15)", text: "#FFC107", label: "Acknowledged" },
  resolved: { bg: "rgba(57,255,126,0.15)", text: "#39ff7e", label: "Resolved" },
  // Risk bands
  low: { bg: "rgba(57,255,126,0.12)", text: "#39ff7e", label: "Low Risk" },
  medium: { bg: "rgba(255,193,7,0.12)", text: "#FFC107", label: "Medium Risk" },
  high: { bg: "rgba(255,126,26,0.15)", text: "#ff7e1a", label: "High Risk" },
  critical: { bg: "rgba(239,68,68,0.15)", text: "#EF4444", label: "Critical Risk" },
  // Compliance
  pass: { bg: "rgba(57,255,126,0.15)", text: "#39ff7e", label: "Pass" },
  fail: { bg: "rgba(239,68,68,0.15)", text: "#EF4444", label: "Fail" },
  not_applicable: { bg: "rgba(108,117,125,0.15)", text: "#6C757D", label: "N/A" },
  // Bidding
  bidding_open: { bg: "rgba(100,181,246,0.15)", text: "#64b5f6", label: "Bidding Open" },
};

const DEFAULT_BADGE = { bg: "rgba(108,117,125,0.15)", text: "#9AA0A6", label: "Unknown" };

export function StatusBadge({ status, className = "" }: { status: string; className?: string }) {
  const style = BADGE_STYLES[status] || { ...DEFAULT_BADGE, label: status };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${className}`}
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  );
}

export function RiskBadge({ score }: { score: number | null }) {
  if (score === null) return <StatusBadge status="not_applicable" />;
  if (score >= 75) return <StatusBadge status="low" />;
  if (score >= 50) return <StatusBadge status="medium" />;
  if (score >= 25) return <StatusBadge status="high" />;
  return <StatusBadge status="critical" />;
}
