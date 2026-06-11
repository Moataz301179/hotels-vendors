import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/invo/status-badge";
import { KPICard, KPIGrid } from "@/components/invo/kpi-card";
import { TrendingUp, DollarSign, Clock, CheckCircle } from "lucide-react";

const BG_CARD = "#1a1e23";
const BORDER = "rgba(60,64,67,0.50)";
const TEXT_PRIMARY = "#E9ECEF";
const TEXT_SECONDARY = "#9AA0A6";
const TEXT_MUTED = "#6C757D";
const ACCENT_LIME = "#39FF14";

export default async function FactoringPage() {
  const supabase = await createClient();

  const [requestsRes, bidsRes, fundersRes, feesRes] = await Promise.all([
    supabase.from("factoring_requests").select("*, hotels(name)").order("created_at", { ascending: false }).limit(50),
    supabase.from("factoring_bids").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("funder_configs").select("*").eq("is_active", true),
    supabase.from("success_fees").select("*").order("created_at", { ascending: false }).limit(20),
  ]);

  const requests = requestsRes.data || [];
  const bids = bidsRes.data || [];
  const funders = fundersRes.data || [];
  const fees = feesRes.data || [];

  const totalFaceValue = requests.reduce((sum, r) => sum + (r.face_value || 0), 0);
  const funded = requests.filter((r) => r.match_status === "funded").length;
  const bidding = requests.filter((r) => r.status === "bidding_open").length;
  const totalFees = fees.reduce((sum, f) => sum + (f.fee_amount_egp || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Factoring</h1>
        <p className="text-[13px] mt-1" style={{ color: TEXT_SECONDARY }}>
          Reverse factoring — get paid early, let funders compete
        </p>
      </div>

      <KPIGrid>
        <KPICard title="Total Requests" value={requests.length} icon={<TrendingUp className="w-4 h-4" />} />
        <KPICard title="Total Face Value" value={`${totalFaceValue.toLocaleString("en-EG")} EGP`} icon={<DollarSign className="w-4 h-4" />} />
        <KPICard title="Bidding Open" value={bidding} icon={<Clock className="w-4 h-4" />} />
        <KPICard title="Funded" value={funded} accent icon={<CheckCircle className="w-4 h-4" />} />
      </KPIGrid>

      {/* Active funders */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: BG_CARD, border: `1px solid ${BORDER}` }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: BORDER }}>
          <h2 className="text-sm font-bold">Active Funders</h2>
          <span className="text-[11px]" style={{ color: TEXT_MUTED }}>{funders.length} funders</span>
        </div>
        {funders.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-[13px]" style={{ color: TEXT_SECONDARY }}>No active funders configured.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
            {funders.map((funder) => (
              <div key={funder.id} className="rounded-lg p-4" style={{ backgroundColor: "#14171a", border: `1px solid ${BORDER}` }}>
                <div className="text-sm font-bold" style={{ color: TEXT_PRIMARY }}>{funder.name || "Unnamed"}</div>
                <div className="text-[12px] mt-2 space-y-1" style={{ color: TEXT_SECONDARY }}>
                  <div>Credit Limit: <span style={{ color: TEXT_PRIMARY }}>{(funder.credit_limit || 0).toLocaleString("en-EG")} EGP</span></div>
                  <div>Min Invoice: <span style={{ color: TEXT_PRIMARY }}>{(funder.min_invoice || 0).toLocaleString("en-EG")} EGP</span></div>
                  <div>Rate: <span style={{ color: ACCENT_LIME }}>{(funder.rate_min || 0).toFixed(2)}% — {(funder.rate_max || 0).toFixed(2)}%</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Factoring requests */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: BG_CARD, border: `1px solid ${BORDER}` }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: BORDER }}>
          <h2 className="text-sm font-bold">Factoring Requests</h2>
          <span className="text-[11px]" style={{ color: TEXT_MUTED }}>{requests.length} requests</span>
        </div>
        {requests.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-3" style={{ color: TEXT_MUTED }} />
            <p className="text-[13px]" style={{ color: TEXT_SECONDARY }}>No factoring requests yet.</p>
            <p className="text-[12px] mt-1" style={{ color: TEXT_MUTED }}>Requests are created from qualified invoices.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ color: TEXT_MUTED }}>
                  <th className="text-left px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Request ID</th>
                  <th className="text-left px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Hotel</th>
                  <th className="text-right px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Face Value</th>
                  <th className="text-center px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Status</th>
                  <th className="text-center px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Match</th>
                  <th className="text-center px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Bids</th>
                  <th className="text-right px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Maturity</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => {
                  const reqBids = bids.filter((b) => b.request_id === req.id);
                  return (
                    <tr
                      key={req.id}
                      className="border-t transition-colors"
                      style={{ borderColor: BORDER }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(57,255,20,0.02)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <td className="px-5 py-3 font-mono text-[11px]" style={{ color: ACCENT_LIME }}>
                        {req.id.slice(0, 8)}...
                      </td>
                      <td className="px-5 py-3" style={{ color: TEXT_PRIMARY }}>{(req as any).hotels?.name || "—"}</td>
                      <td className="px-5 py-3 text-right font-semibold" style={{ color: TEXT_PRIMARY }}>
                        {(req.face_value || 0).toLocaleString("en-EG")} EGP
                      </td>
                      <td className="px-5 py-3 text-center"><StatusBadge status={req.status || "bidding_open"} /></td>
                      <td className="px-5 py-3 text-center"><StatusBadge status={req.match_status || "not_submitted"} /></td>
                      <td className="px-5 py-3 text-center" style={{ color: TEXT_SECONDARY }}>{reqBids.length}</td>
                      <td className="px-5 py-3 text-right text-[12px]" style={{ color: TEXT_MUTED }}>{req.maturity_date || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
