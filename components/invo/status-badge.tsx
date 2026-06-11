const BADGE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  // Procurement states
  draft: { bg: "rgba(108,117,125,0.15)", text: "#6C757D", label: "Draft" },
  pending_approval: { bg: "rgba(255,193,7,0.15)", text: "#FFC107", label: "Pending Approval" },
  approved: { bg: "rgba(132,204,22,0.12)", text: "#84cc16", label: "Approved" },
  ordered: { bg: "rgba(13,202,240,0.15)", text: "#0dcaf0", label: "Ordered" },
  shipped: { bg: "rgba(13,110,253,0.15)", text: "#0d6efd", label: "Shipped" },
  delivered: { bg: "rgba(25,135,84,0.15)", text: "#198754", label: "Delivered" },
  invoiced: { bg: "rgba(111,66,193,0.15)", text: "#6f42c1", label: "Invoiced" },
  paid: { bg: "rgba(132,204,22,0.15)", text: "#84cc16", label: "Paid" },
  disputed: { bg: "rgba(220,53,69,0.15)", text: "#dc3545", label: "Disputed" },
  cancelled: { bg: "rgba(108,117,125,0.15)", text: "#6C757D", label: "Cancelled" },
  // Invoice qualification
  pending_documents: { bg: "rgba(255,193,7,0.15)", text: "#FFC107", label: "Pending Documents" },
  qualified: { bg: "rgba(132,204,22,0.15)", text: "#84cc16", label: "Qualified" },
  rejected: { bg: "rgba(220,53,69,0.15)", text: "#dc3545", label: "Rejected" },
  expired: { bg: "rgba(108,117,125,0.15)", text: "#6C757D", label: "Expired" },
  // Fraud gate
  // (pending already mapped above)
  cleared: { bg: "rgba(132,204,22,0.15)", text: "#84cc16", label: "Cleared" },
  flagged: { bg: "rgba(253,126,20,0.15)", text: "#fd7e14", label: "Flagged" },
  blocked: { bg: "rgba(220,53,69,0.15)", text: "#dc3545", label: "Blocked" },
  // ETA
  submitted: { bg: "rgba(132,204,22,0.15)", text: "#84cc16", label: "Submitted" },
  failed: { bg: "rgba(220,53,69,0.15)", text: "#dc3545", label: "Failed" },
  // Factoring match
  not_submitted: { bg: "rgba(108,117,125,0.15)", text: "#6C757D", label: "Not Submitted" },
  matched: { bg: "rgba(13,202,240,0.15)", text: "#0dcaf0", label: "Matched" },
  funded: { bg: "rgba(132,204,22,0.15)", text: "#84cc16", label: "Funded" },
  // Subscription
  trial: { bg: "rgba(255,193,7,0.12)", text: "#FFC107", label: "Trial" },
  active: { bg: "rgba(132,204,22,0.12)", text: "#84cc16", label: "Active" },
  past_due: { bg: "rgba(253,126,20,0.15)", text: "#fd7e14", label: "Past Due" },
  // Alerts
  open: { bg: "rgba(220,53,69,0.15)", text: "#dc3545", label: "Open" },
  acknowledged: { bg: "rgba(255,193,7,0.15)", text: "#FFC107", label: "Acknowledged" },
  resolved: { bg: "rgba(132,204,22,0.15)", text: "#84cc16", label: "Resolved" },
  // Risk bands
  low: { bg: "rgba(132,204,22,0.12)", text: "#84cc16", label: "Low Risk" },
  medium: { bg: "rgba(255,193,7,0.12)", text: "#FFC107", label: "Medium Risk" },
  high: { bg: "rgba(253,126,20,0.15)", text: "#fd7e14", label: "High Risk" },
  critical: { bg: "rgba(220,53,69,0.15)", text: "#dc3545", label: "Critical Risk" },
  // Compliance
  pass: { bg: "rgba(132,204,22,0.15)", text: "#84cc16", label: "Pass" },
  fail: { bg: "rgba(220,53,69,0.15)", text: "#dc3545", label: "Fail" },
  not_applicable: { bg: "rgba(108,117,125,0.15)", text: "#6C757D", label: "N/A" },
  // Bidding
  bidding_open: { bg: "rgba(13,202,240,0.15)", text: "#0dcaf0", label: "Bidding Open" },
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
