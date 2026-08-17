export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/invo/status-badge";
import { KPICard, KPIGrid } from "@/components/invo/kpi-card";
import { FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";

const BG_CARD = "var(--bg-surface-1)";
const BORDER = "rgba(255,255,255,0.06)";
const TEXT_PRIMARY = "#E9ECEF";
const TEXT_SECONDARY = "#9AA0A6";
const TEXT_MUTED = "#6C757D";
const ACCENT_LIME = "#39ff7e";

export default async function InvoicesPage() {
  const supabase = await createClient();

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*, hotels(name), suppliers(name)")
    .order("created_at", { ascending: false })
    .limit(100);

  const invoiceList = invoices || [];
  const totalFaceValue = invoiceList.reduce((sum, inv) => sum + (inv.face_value || 0), 0);
  const qualified = invoiceList.filter((inv) => inv.qualification_status === "qualified").length;
  const pending = invoiceList.filter((inv) => inv.qualification_status === "pending_documents").length;
  const etaSubmitted = invoiceList.filter((inv) => inv.eta_status === "submitted").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Invoices</h1>
        <p className="text-[13px] mt-1" style={{ color: TEXT_SECONDARY }}>
          Invoice management with ETA e-invoicing compliance
        </p>
      </div>

      <KPIGrid>
        <KPICard title="Total Invoices" value={invoiceList.length} icon={<FileText className="w-4 h-4" />} />
        <KPICard title="Total Face Value" value={`${totalFaceValue.toLocaleString("en-EG")} EGP`} icon={<CheckCircle className="w-4 h-4" />} />
        <KPICard title="Qualified" value={qualified} accent icon={<CheckCircle className="w-4 h-4" />} />
        <KPICard title="Pending Documents" value={pending} icon={<Clock className="w-4 h-4" />} />
      </KPIGrid>

      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: BG_CARD, border: `1px solid ${BORDER}` }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: BORDER }}>
          <h2 className="text-sm font-bold">All Invoices</h2>
          <span className="text-[11px]" style={{ color: TEXT_MUTED }}>{invoiceList.length} invoices</span>
        </div>
        {invoiceList.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <FileText className="w-8 h-8 mx-auto mb-3" style={{ color: TEXT_MUTED }} />
            <p className="text-[13px]" style={{ color: TEXT_SECONDARY }}>No invoices yet.</p>
            <p className="text-[12px] mt-1" style={{ color: TEXT_MUTED }}>Invoices are generated from approved orders.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ color: TEXT_MUTED }}>
                  <th className="text-left px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Invoice ID</th>
                  <th className="text-left px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Hotel</th>
                  <th className="text-left px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Supplier</th>
                  <th className="text-right px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Face Value</th>
                  <th className="text-center px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Workflow</th>
                  <th className="text-center px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Qualification</th>
                  <th className="text-center px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Fraud Gate</th>
                  <th className="text-center px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">ETA</th>
                  <th className="text-right px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {invoiceList.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-t transition-colors"
                    style={{ borderColor: BORDER }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(57,255,126,0.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td className="px-5 py-3 font-mono text-[11px]" style={{ color: ACCENT_LIME }}>
                      {inv.id.slice(0, 8)}...
                    </td>
                    <td className="px-5 py-3" style={{ color: TEXT_PRIMARY }}>{(inv as any).hotels?.name || "—"}</td>
                    <td className="px-5 py-3" style={{ color: TEXT_SECONDARY }}>{(inv as any).suppliers?.name || "—"}</td>
                    <td className="px-5 py-3 text-right font-semibold" style={{ color: TEXT_PRIMARY }}>
                      {(inv.face_value || 0).toLocaleString("en-EG")} {inv.currency || "EGP"}
                    </td>
                    <td className="px-5 py-3 text-center"><StatusBadge status={inv.workflow_state || "ingested"} /></td>
                    <td className="px-5 py-3 text-center"><StatusBadge status={inv.qualification_status || "pending_documents"} /></td>
                    <td className="px-5 py-3 text-center"><StatusBadge status={inv.fraud_gate_status || "pending"} /></td>
                    <td className="px-5 py-3 text-center"><StatusBadge status={inv.eta_status || "pending"} /></td>
                    <td className="px-5 py-3 text-right text-[12px]" style={{ color: TEXT_MUTED }}>
                      {inv.due_date || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
