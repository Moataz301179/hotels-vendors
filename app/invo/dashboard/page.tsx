import { createClient } from "@/lib/supabase/server";
import { Views } from "@/types/database";

// ── Stripe Palette ──
const BG_CARD = "#ffffff";
const BG_PAGE = "#f7f8fa";
const BORDER = "#e3e8ee";
const TEXT_PRIMARY = "#1a1f36";
const TEXT_SECONDARY = "#525f7f";
const TEXT_MUTED = "#8898aa";
const ACCENT = "#635bff";
const ACCENT_LIGHT = "#ededff";
const SUCCESS = "#00d924";
const SUCCESS_BG = "#e6f9ed";
const WARNING = "#ff9b00";
const WARNING_BG = "#fff7e0";
const DANGER = "#df1b41";
const DANGER_BG = "#fde8eb";
const INFO_BG = "#e0f2fe";

type PipelineRow = Views<"v_invoice_pipeline">;
type RiskRow = Views<"v_risk_dashboard">;

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    paid: { bg: SUCCESS_BG, text: "#0a7d2b", label: "Paid" },
    pending: { bg: WARNING_BG, text: "#a16200", label: "Pending" },
    invoiced: { bg: ACCENT_LIGHT, text: "#4338ca", label: "Invoiced" },
    delivered: { bg: INFO_BG, text: "#0369a1", label: "Delivered" },
    shipped: { bg: "#e0f2fe", text: "#0369a1", label: "Shipped" },
    draft: { bg: "#f0f2f5", text: "#525f7f", label: "Draft" },
    funded: { bg: SUCCESS_BG, text: "#0a7d2b", label: "Funded" },
    not_submitted: { bg: "#f0f2f5", text: "#8898aa", label: "Not Submitted" },
    pending_documents: { bg: WARNING_BG, text: "#a16200", label: "Pending Docs" },
    approved: { bg: SUCCESS_BG, text: "#0a7d2b", label: "Approved" },
    rejected: { bg: DANGER_BG, text: "#b0102a", label: "Rejected" },
    high: { bg: DANGER_BG, text: "#b0102a", label: "High" },
    critical: { bg: DANGER_BG, text: "#b0102a", label: "Critical" },
    medium: { bg: WARNING_BG, text: "#a16200", label: "Medium" },
    low: { bg: SUCCESS_BG, text: "#0a7d2b", label: "Low" },
    open: { bg: ACCENT_LIGHT, text: "#4338ca", label: "Open" },
  };
  const c = map[status] || map.draft;
  return (
    <span
      style={{
        fontSize: "11px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        padding: "3px 10px",
        borderRadius: "4px",
        backgroundColor: c.bg,
        color: c.text,
      }}
    >
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

  const totalInvoiced = pipeline.reduce((sum, r) => sum + (r.face_value || 0), 0);
  const totalPaid = pipeline.filter((r) => r.procurement_state === "paid").length;
  const totalPending = pipeline.filter((r) =>
    ["invoiced", "delivered", "shipped"].includes(r.procurement_state || "")
  ).length;
  const factoringEligible = pipeline.filter((r) => r.factoring_eligible).length;
  const highRisk = risks.filter((r) => r.risk_band === "high" || r.risk_band === "critical").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: 600, color: TEXT_PRIMARY, margin: 0 }}>
          INVO Dashboard
        </h1>
        <p style={{ fontSize: "13px", color: TEXT_SECONDARY, margin: "4px 0 0 0" }}>
          Marketplace engine overview — real-time data from Supabase
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {[
          {
            label: "Total Invoiced",
            value: `${totalInvoiced.toLocaleString("en-EG")} EGP`,
            sub: `${pipeline.length} invoices`,
            color: ACCENT,
            bg: ACCENT_LIGHT,
          },
          {
            label: "Paid",
            value: totalPaid.toString(),
            sub: "Completed payments",
            color: SUCCESS,
            bg: SUCCESS_BG,
          },
          {
            label: "Pending",
            value: totalPending.toString(),
            sub: "In transit / invoiced",
            color: WARNING,
            bg: WARNING_BG,
          },
          {
            label: "Open Alerts",
            value: alerts.length.toString(),
            sub: highRisk > 0 ? `${highRisk} high risk` : "All clear",
            color: alerts.length > 0 ? DANGER : SUCCESS,
            bg: alerts.length > 0 ? DANGER_BG : SUCCESS_BG,
          },
          {
            label: "Factoring Eligible",
            value: factoringEligible.toString(),
            sub: "Ready for factoring",
            color: ACCENT,
            bg: ACCENT_LIGHT,
          },
          {
            label: "Active Orders",
            value: procurement.length.toString(),
            sub: "Across all states",
            color: TEXT_SECONDARY,
            bg: "#f0f2f5",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            style={{
              backgroundColor: BG_CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: TEXT_MUTED,
                }}
              >
                {kpi.label}
              </span>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  backgroundColor: kpi.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: kpi.color,
                  }}
                />
              </div>
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 600,
                color: TEXT_PRIMARY,
                marginBottom: "4px",
              }}
            >
              {kpi.value}
            </div>
            <div style={{ fontSize: "12px", color: TEXT_MUTED }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Pipeline Table ── */}
      <div
        style={{
          backgroundColor: BG_CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${BORDER}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: TEXT_PRIMARY, margin: 0 }}>
            Invoice Pipeline
          </h2>
          <span style={{ fontSize: "12px", color: TEXT_MUTED }}>
            {pipeline.length} records
          </span>
        </div>

        {pipeline.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#f0f2f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
                fontSize: "20px",
              }}
            >
              📄
            </div>
            <p style={{ fontSize: "14px", color: TEXT_SECONDARY, margin: 0 }}>
              No invoices in the pipeline yet.
            </p>
            <p style={{ fontSize: "12px", color: TEXT_MUTED, margin: "4px 0 0 0" }}>
              Invoices will appear here as orders are created and processed.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f7f8fa" }}>
                  {["Invoice", "Hotel", "Supplier", "Amount", "State", "Qualification", "ETA", "Factoring"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          textAlign: h === "Amount" ? "right" : "left",
                          fontSize: "11px",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: TEXT_MUTED,
                          borderBottom: `1px solid ${BORDER}`,
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {pipeline.map((row) => (
                  <tr
                    key={row.invoice_id}
                    style={{ borderBottom: "1px solid #f0f2f5" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f8f9ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <td
                      style={{
                        padding: "14px 16px",
                        fontFamily: "monospace",
                        fontSize: "12px",
                        color: ACCENT,
                        fontWeight: 500,
                      }}
                    >
                      {row.invoice_id?.slice(0, 8)}...
                    </td>
                    <td style={{ padding: "14px 16px", color: TEXT_PRIMARY }}>
                      {row.hotel_name || "—"}
                    </td>
                    <td style={{ padding: "14px 16px", color: TEXT_SECONDARY }}>
                      {row.supplier_name || "—"}
                      {row.supplier_verified && (
                        <span
                          style={{
                            marginLeft: "6px",
                            fontSize: "10px",
                            color: SUCCESS,
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        textAlign: "right",
                        fontWeight: 600,
                        color: TEXT_PRIMARY,
                      }}
                    >
                      {(row.face_value || 0).toLocaleString("en-EG")}{" "}
                      {row.currency || "EGP"}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <StatusPill status={row.procurement_state || "draft"} />
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <StatusPill status={row.qualification_status || "pending_documents"} />
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <StatusPill status={row.eta_status || "pending"} />
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <StatusPill status={row.match_status || "not_submitted"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Alerts ── */}
      {alerts.length > 0 && (
        <div
          style={{
            backgroundColor: BG_CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: `1px solid ${BORDER}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: TEXT_PRIMARY,
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Open Alerts
            </h2>
            <span style={{ fontSize: "12px", color: TEXT_MUTED }}>
              {alerts.length} active
            </span>
          </div>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              style={{
                padding: "14px 20px",
                borderBottom: `1px solid #f0f2f5`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{ fontSize: "13px", fontWeight: 600, color: TEXT_PRIMARY }}
                >
                  {alert.title}
                </div>
                <div
                  style={{ fontSize: "12px", color: TEXT_SECONDARY, marginTop: "2px" }}
                >
                  {alert.description}
                </div>
              </div>
              <StatusPill status={alert.severity} />
            </div>
          ))}
        </div>
      )}

      {/* ── Risk Dashboard ── */}
      {risks.length > 0 && (
        <div
          style={{
            backgroundColor: BG_CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: `1px solid ${BORDER}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: TEXT_PRIMARY,
                margin: 0,
              }}
            >
              Risk Dashboard
            </h2>
            <span style={{ fontSize: "12px", color: TEXT_MUTED }}>
              {risks.length} entities
            </span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f7f8fa" }}>
                  {["Entity", "Type", "Risk Band", "Overall", "Compliance", "Financial", "Next Review"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          textAlign:
                            h === "Overall" || h === "Compliance" || h === "Financial"
                              ? "right"
                              : "left",
                          fontSize: "11px",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: TEXT_MUTED,
                          borderBottom: `1px solid ${BORDER}`,
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {risks.map((row) => (
                  <tr
                    key={row.entity_id}
                    style={{ borderBottom: "1px solid #f0f2f5" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f8f9ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <td
                      style={{
                        padding: "14px 16px",
                        fontWeight: 600,
                        color: TEXT_PRIMARY,
                      }}
                    >
                      {row.entity_name || "—"}
                    </td>
                    <td style={{ padding: "14px 16px", color: TEXT_SECONDARY }}>
                      {row.entity_type || "—"}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <StatusPill status={row.risk_band || "medium"} />
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        textAlign: "right",
                        fontWeight: 600,
                        color:
                          (row.overall_risk_score || 0) >= 70
                            ? DANGER
                            : (row.overall_risk_score || 0) >= 40
                            ? WARNING
                            : SUCCESS,
                      }}
                    >
                      {row.overall_risk_score ?? "—"}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        textAlign: "right",
                        color: TEXT_SECONDARY,
                      }}
                    >
                      {row.compliance_score ?? "—"}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        textAlign: "right",
                        color: TEXT_SECONDARY,
                      }}
                    >
                      {row.financial_score ?? "—"}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        textAlign: "right",
                        fontSize: "12px",
                        color: TEXT_MUTED,
                      }}
                    >
                      {row.next_review_date || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
