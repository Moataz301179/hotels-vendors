import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/invo/status-badge";
import { KPICard, KPIGrid } from "@/components/invo/kpi-card";
import Link from "next/link";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";

const BG_CARD = "#1a1e23";
const BORDER = "rgba(60,64,67,0.50)";
const TEXT_PRIMARY = "#E9ECEF";
const TEXT_SECONDARY = "#9AA0A6";
const TEXT_MUTED = "#6C757D";
const ACCENT_LIME = "#FFB000";

export default async function OrdersPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, hotels(name), suppliers(name)")
    .order("created_at", { ascending: false })
    .limit(100);

  const orderList = orders || [];
  const totalValue = orderList.reduce((sum, o) => sum + (o.total_value || 0), 0);
  const draftCount = orderList.filter((o) => o.procurement_state === "draft").length;
  const disputedCount = orderList.filter((o) => o.procurement_state === "disputed").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Orders</h1>
          <p className="text-[13px] mt-1" style={{ color: TEXT_SECONDARY }}>
            Procurement orders from Invo marketplace
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-lg text-[13px] font-bold transition-all hover:-translate-y-0.5"
          style={{ backgroundColor: ACCENT_LIME, color: "#101215" }}
        >
          + New Order
        </button>
      </div>

      <KPIGrid>
        <KPICard title="Total Orders" value={orderList.length} icon={<Package className="w-4 h-4" />} />
        <KPICard title="Total Value" value={`${totalValue.toLocaleString("en-EG")} EGP`} icon={<CheckCircle className="w-4 h-4" />} />
        <KPICard title="Draft" value={draftCount} icon={<Clock className="w-4 h-4" />} />
        <KPICard title="Disputed" value={disputedCount} accent={disputedCount > 0} icon={<XCircle className="w-4 h-4" />} />
      </KPIGrid>

      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: BG_CARD, border: `1px solid ${BORDER}` }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: BORDER }}>
          <h2 className="text-sm font-bold">All Orders</h2>
          <span className="text-[11px]" style={{ color: TEXT_MUTED }}>{orderList.length} orders</span>
        </div>
        {orderList.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Package className="w-8 h-8 mx-auto mb-3" style={{ color: TEXT_MUTED }} />
            <p className="text-[13px]" style={{ color: TEXT_SECONDARY }}>No orders yet.</p>
            <p className="text-[12px] mt-1" style={{ color: TEXT_MUTED }}>Orders will be created when hotels place orders with suppliers.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ color: TEXT_MUTED }}>
                  <th className="text-left px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Order ID</th>
                  <th className="text-left px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Hotel</th>
                  <th className="text-left px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Supplier</th>
                  <th className="text-right px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Value</th>
                  <th className="text-center px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">State</th>
                  <th className="text-center px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Maker</th>
                  <th className="text-center px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Checker</th>
                  <th className="text-right px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {orderList.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t transition-colors cursor-pointer"
                    style={{ borderColor: BORDER }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(132,204,22,0.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td className="px-5 py-3 font-mono text-[11px]" style={{ color: TEXT_SECONDARY }}>
                      <Link href={`/invo/orders/${order.id}`} className="hover:underline" style={{ color: ACCENT_LIME }}>
                        {order.id.slice(0, 8)}...
                      </Link>
                    </td>
                    <td className="px-5 py-3" style={{ color: TEXT_PRIMARY }}>{(order as any).hotels?.name || "—"}</td>
                    <td className="px-5 py-3" style={{ color: TEXT_SECONDARY }}>{(order as any).suppliers?.name || "—"}</td>
                    <td className="px-5 py-3 text-right font-semibold" style={{ color: TEXT_PRIMARY }}>
                      {(order.total_value || 0).toLocaleString("en-EG")} {order.currency || "EGP"}
                    </td>
                    <td className="px-5 py-3 text-center"><StatusBadge status={order.procurement_state || "draft"} /></td>
                    <td className="px-5 py-3 text-center text-[11px] font-mono" style={{ color: TEXT_MUTED }}>
                      {order.maker_user_id?.slice(0, 6) || "—"}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {order.checker_approved ? (
                        <CheckCircle className="w-4 h-4 mx-auto" style={{ color: ACCENT_LIME }} />
                      ) : (
                        <span className="text-[11px]" style={{ color: TEXT_MUTED }}>—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right text-[12px]" style={{ color: TEXT_MUTED }}>
                      {order.created_at ? new Date(order.created_at).toLocaleDateString("en-EG") : "—"}
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
