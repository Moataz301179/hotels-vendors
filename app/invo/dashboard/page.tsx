export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { Views } from "@/types/database";
import { cn } from "@/lib/utils";

type PipelineRow = Views<"v_invoice_pipeline">;
type RiskRow = Views<"v_risk_dashboard">;

const STATUS_MAP: Record<string, { bg: string; text: string; label: string }> = {
  paid: { bg: "bg-success-bg", text: "text-success", label: "Paid" },
  pending: { bg: "bg-warning-bg", text: "text-warning", label: "Pending" },
  invoiced: { bg: "bg-purple-base/10", text: "text-purple-base", label: "Invoiced" },
  delivered: { bg: "bg-info-bg", text: "text-info", label: "Delivered" },
  shipped: { bg: "bg-info-bg", text: "text-info", label: "Shipped" },
  draft: { bg: "bg-surface-raised", text: "text-foreground-muted", label: "Draft" },
  funded: { bg: "bg-success-bg", text: "text-success", label: "Funded" },
  not_submitted: { bg: "bg-surface-raised", text: "text-foreground-muted", label: "Not Submitted" },
  pending_documents: { bg: "bg-warning-bg", text: "text-warning", label: "Pending Docs" },
  approved: { bg: "bg-success-bg", text: "text-success", label: "Approved" },
  rejected: { bg: "bg-error-bg", text: "text-error", label: "Rejected" },
  high: { bg: "bg-error-bg", text: "text-error", label: "High" },
  critical: { bg: "bg-error-bg", text: "text-error", label: "Critical" },
  medium: { bg: "bg-warning-bg", text: "text-warning", label: "Medium" },
  low: { bg: "bg-success-bg", text: "text-success", label: "Low" },
  open: { bg: "bg-purple-base/10", text: "text-purple-base", label: "Open" },
};

function StatusPill({ status }: { status: string }) {
  const c = STATUS_MAP[status] || STATUS_MAP.draft;
  return (
    <span className={cn("status-pill", c.bg, c.text)}>
      {c.label}
    </span>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const [pipelineRes, riskRes, procurementRes, alertsRes] = await Promise.all([
    supabase.from("v_invoice_pipeline").select("*").limit(50),
    supabase.from("v_risk_dashboard").select("*").limit(20),
    supabase.from("v_procurement_status").select("*").limit(50),
    supabase.from("alerts").select("*").eq("status", "open").limit(10),
  ]);

  const pipeline = (pipelineRes.data || []) as PipelineRow[];
  const risks = (riskRes.data || []) as RiskRow[];
  const procurement = (procurementRes.data || []) as any[];
  const alerts = alertsRes.data || [];

  const totalInvoiced = pipeline.reduce((sum: number, r: any) => sum + (r.face_value || 0), 0);
  const totalPaid = pipeline.filter((r: any) => r.procurement_state === "paid").length;
  const totalPending = pipeline.filter((r: any) =>
    ["invoiced", "delivered", "shipped"].includes(r.procurement_state || "")
  ).length;
  const factoringEligible = pipeline.filter((r: any) => r.factoring_eligible).length;
  const highRisk = risks.filter((r: any) => r.risk_band === "high" || r.risk_band === "critical").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          INVO Dashboard
        </h1>
        <p className="text-sm text-foreground-secondary mt-1">
          Marketplace engine overview — real-time data from Supabase
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          {
            label: "Total Invoiced",
            value: `${totalInvoiced.toLocaleString("en-EG")} EGP`,
            sub: `${pipeline.length} invoices`,
            color: "text-purple-base",
            bg: "bg-purple-base/10",
          },
          {
            label: "Paid",
            value: totalPaid.toString(),
            sub: "Completed payments",
            color: "text-success",
            bg: "bg-success-bg",
          },
          {
            label: "Pending",
            value: totalPending.toString(),
            sub: "In transit / invoiced",
            color: "text-warning",
            bg: "bg-warning-bg",
          },
          {
            label: "Open Alerts",
            value: alerts.length.toString(),
            sub: highRisk > 0 ? `${highRisk} high risk` : "All clear",
            color: alerts.length > 0 ? "text-error" : "text-success",
            bg: alerts.length > 0 ? "bg-error-bg" : "bg-success-bg",
          },
          {
            label: "Factoring Eligible",
            value: factoringEligible.toString(),
            sub: "Ready for factoring",
            color: "text-purple-base",
            bg: "bg-purple-base/10",
          },
          {
            label: "Active Orders",
            value: procurement.length.toString(),
            sub: "Across all states",
            color: "text-foreground-secondary",
            bg: "bg-surface-raised",
          },
        ].map((kpi: any) => (
          <div
            key={kpi.label}
            className="bg-surface border border-border-default rounded-xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-foreground-muted uppercase tracking-[0.05em]">
                {kpi.label}
              </span>
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", kpi.bg)}>
                <div className={cn("w-2 h-2 rounded-full", kpi.color.replace("text-", "bg-"))} />
              </div>
            </div>
            <div className="text-2xl font-semibold text-foreground">{kpi.value}</div>
            <div className="text-xs text-foreground-muted">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Pipeline Table ── */}
      <div className="bg-surface border border-border-default rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border-subtle bg-surface-raised">
          <h2 className="text-sm font-semibold text-foreground">Invoice Pipeline</h2>
          <span className="text-xs text-foreground-muted">{pipeline.length} records</span>
        </div>

        {pipeline.length === 0 ? (
          <div className="text-center py-12 px-5">
            <div className="w-12 h-12 rounded-lg bg-surface-raised flex items-center justify-center mx-auto mb-3 text-xl">
              📄
            </div>
            <p className="text-sm text-foreground-secondary">
              No invoices in the pipeline yet.
            </p>
            <p className="text-xs text-foreground-muted mt-1">
              Invoices will appear here as orders are created and processed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-raised">
                  {["Invoice", "Hotel", "Supplier", "Amount", "State", "Qualification", "ETA", "Factoring"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-[0.05em]"
                        style={{ textAlign: h === "Amount" ? "right" : "left" }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {pipeline.map((row: any) => (
                  <tr
                    key={row.invoice_id}
                    className="border-b border-border-subtle hover:bg-accent-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-purple-base font-medium">
                      {row.invoice_id?.slice(0, 8)}...
                    </td>
                    <td className="px-4 py-3 text-foreground">{row.hotel_name || "—"}</td>
                    <td className="px-4 py-3 text-foreground-secondary">
                      {row.supplier_name || "—"}
                      {row.supplier_verified && (
                        <span className="ml-1 text-xs text-success">✓</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">
                      {(row.face_value || 0).toLocaleString("en-EG")} {row.currency || "EGP"}
                    </td>
                    <td className="px-4 py-3"><StatusPill status={row.procurement_state || "draft"} /></td>
                    <td className="px-4 py-3"><StatusPill status={row.qualification_status || "pending_documents"} /></td>
                    <td className="px-4 py-3"><StatusPill status={row.eta_status || "pending"} /></td>
                    <td className="px-4 py-3"><StatusPill status={row.match_status || "not_submitted"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Alerts ── */}
      {alerts.length > 0 && (
        <div className="bg-surface border border-border-default rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border-subtle bg-surface-raised">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              Open Alerts
            </h2>
            <span className="text-xs text-foreground-muted">{alerts.length} active</span>
          </div>
          {alerts.map((alert: any) => (
            <div
              key={alert.id}
              className="flex items-center justify-between px-5 py-3 border-b border-border-subtle last:border-b-0"
            >
              <div>
                <div className="text-sm font-semibold text-foreground">{alert.title}</div>
                <div className="text-xs text-foreground-secondary mt-0.5">{alert.description}</div>
              </div>
              <StatusPill status={alert.severity} />
            </div>
          ))}
        </div>
      )}

      {/* ── Risk Dashboard ── */}
      {risks.length > 0 && (
        <div className="bg-surface border border-border-default rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border-subtle bg-surface-raised">
            <h2 className="text-sm font-semibold text-foreground">Risk Dashboard</h2>
            <span className="text-xs text-foreground-muted">{risks.length} entities</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-raised">
                  {["Entity", "Type", "Risk Band", "Overall", "Compliance", "Financial", "Next Review"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-xs font-medium text-foreground-muted uppercase tracking-[0.05em]"
                        style={{
                          textAlign:
                            h === "Overall" || h === "Compliance" || h === "Financial"
                              ? "right"
                              : "left",
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {risks.map((row: any) => {
                  const overallScore = row.overall_risk_score || 0;
                  const scoreColor = overallScore >= 70
                    ? "text-error"
                    : overallScore >= 40
                      ? "text-warning"
                      : "text-success";
                  return (
                    <tr
                      key={row.entity_id}
                      className="border-b border-border-subtle hover:bg-accent-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-semibold text-foreground">
                        {row.entity_name || "—"}
                      </td>
                      <td className="px-4 py-3 text-foreground-secondary">
                        {row.entity_type || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={row.risk_band || "medium"} />
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        <span className={scoreColor}>{row.overall_risk_score ?? "—"}</span>
                      </td>
                      <td className="px-4 py-3 text-right text-foreground-secondary">
                        {row.compliance_score ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-foreground-secondary">
                        {row.financial_score ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-foreground-muted">
                        {row.next_review_date || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
