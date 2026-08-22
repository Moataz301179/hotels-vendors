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
};

async function fetchData() {
  const supabase = await createClient();
  if (!supabase) {
    return { pipeline: [], risks: [], alerts: [] };
  }
  const [pipelineRes, risksRes, alertsRes] = await Promise.all([
    supabase.from("v_invoice_pipeline").select("*").limit(50),
    supabase.from("v_risk_dashboard").select("*").limit(20),
    supabase.from("alerts").select("*").eq("status", "open").limit(10),
  ]);
  return {
    pipeline: pipelineRes.data || [],
    risks: risksRes.data || [],
    alerts: alertsRes.data || [],
  };
}

export default async function InvoiceDashboard() {
  const { pipeline, risks, alerts } = await fetchData();

  const totalInvoiced = pipeline.reduce((sum, r) => sum + (r.face_value || 0), 0);
  const totalPaid = pipeline.filter((r) => r.procurement_state === "paid").length;
  const totalPending = pipeline.filter((r) =>
    ["invoiced", "delivered", "shipped"].includes(r.procurement_state || "")
  ).length;
  const factoringEligible = pipeline.filter((r) => r.factoring_eligible).length;
  const highRisk = risks.filter((r) => r.risk_band === "high" || r.risk_band === "critical").length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          INVO Dashboard
        </h1>
        <p className="text-sm text-foreground-secondary mt-1">
          Marketplace engine overview — real-time data from Supabase
        </p>
      </div>

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
            sub: "Awaiting settlement",
            color: "text-warning",
            bg: "bg-warning-bg",
          },
          {
            label: "Factoring Eligible",
            value: factoringEligible.toString(),
            sub: "Ready for liquidity",
            color: "text-purple-base",
            bg: "bg-purple-base/10",
          },
          {
            label: "High Risk",
            value: highRisk.toString(),
            sub: "Requires attention",
            color: "text-error",
            bg: "bg-error-bg",
          },
          {
            label: "Open Alerts",
            value: alerts.length.toString(),
            sub: "Active notifications",
            color: "text-foreground",
            bg: "bg-surface-raised",
          },
        ].map((kpi, i) => (
          <div key={i} className={cn("p-4 rounded-xl border", kpi.bg)}>
            <p className="text-xs font-medium text-foreground-secondary">{kpi.label}</p>
            <p className={cn("text-2xl font-bold mt-1", kpi.color)}>{kpi.value}</p>
            <p className="text-xs text-foreground-secondary">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border p-4">
          <h2 className="text-lg font-semibold mb-4">Invoice Pipeline</h2>
          {pipeline.length === 0 ? (
            <p className="text-foreground-secondary text-center py-8">
              No invoice data available (Supabase not configured)
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {pipeline.map((row, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-surface-raised rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-foreground-secondary">
                      {row.invoice_number || `INV-${i}`}
                    </span>
                    <span className={cn("px-2 py-1 text-xs font-medium rounded-full", STATUS_MAP[row.procurement_state]?.bg)}>
                      {STATUS_MAP[row.procurement_state]?.label || row.procurement_state}
                    </span>
                  </div>
                  <span className="font-mono text-sm">
                    {row.face_value ? `${row.face_value.toLocaleString("en-EG")} EGP` : "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border p-4">
          <h2 className="text-lg font-semibold mb-4">Risk Dashboard</h2>
          {risks.length === 0 ? (
            <p className="text-foreground-secondary text-center py-8">
              No risk data available (Supabase not configured)
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {risks.map((row, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-surface-raised rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-foreground-secondary">
                      {row.supplier_name || `Supplier ${i}`}
                    </span>
                    <span className={cn("px-2 py-1 text-xs font-medium rounded-full", STATUS_MAP[row.risk_band]?.bg)}>
                      {STATUS_MAP[row.risk_band]?.label || row.risk_band}
                    </span>
                  </div>
                  <span className="font-mono text-sm">
                    {row.risk_score !== undefined ? `${row.risk_score}/100` : "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border p-4">
        <h2 className="text-lg font-semibold mb-4">Open Alerts</h2>
        {alerts.length === 0 ? (
          <p className="text-foreground-secondary text-center py-8">
            No active alerts (Supabase not configured)
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {alerts.map((alert, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-surface-raised rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-warning-bg text-warning">
                    {alert.type}
                  </span>
                  <span className="text-sm">{alert.message}</span>
                </div>
                <span className="text-xs text-foreground-secondary">
                  {alert.created_at ? new Date(alert.created_at).toLocaleString("en-EG") : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
