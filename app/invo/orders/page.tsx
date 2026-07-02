import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/invo/status-badge";
import { KPICard, KPIGrid } from "@/components/invo/kpi-card";
import Link from "next/link";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";

const BG_CARD = "var(--surface-raised, #1a1e23)";
const BORDER = "var(--border-subtle, rgba(60,64,67,0.50))";
const TEXT_PRIMARY = "var(--foreground, #E9ECEF)";
const TEXT_SECONDARY = "var(--foreground-secondary, #9AA0A6)";
const TEXT_MUTED = "var(--foreground-muted, #6C757D)";
const ACCENT_LIME = "var(--accent-base, #FF6B00)";

export default async function OrdersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderList: any[] = [];

  try {
    orderList = await prisma.invoOrder.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    }) as any[];
  } catch {
    // Tables may not exist yet — render with empty data
  }

  const totalValue = orderList.reduce((sum, o) => sum + Number(o.totalValue), 0);
  const draftCount = orderList.filter((o) => o.procurementState === "draft").length;
  const disputedCount = orderList.filter((o) => o.procurementState === "disputed").length;

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
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,107,0,0.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td className="px-5 py-3 font-mono text-[11px]" style={{ color: TEXT_SECONDARY }}>
                      <Link href={`/invo/orders/${order.id}`} className="hover:underline" style={{ color: ACCENT_LIME }}>
                        {order.id.slice(0, 8)}...
                      </Link>
                    </td>
                    <td className="px-5 py-3" style={{ color: TEXT_PRIMARY }}>{order.hotelId.slice(0, 8) || "—"}</td>
                    <td className="px-5 py-3" style={{ color: TEXT_SECONDARY }}>{order.supplierId.slice(0, 8) || "—"}</td>
                    <td className="px-5 py-3 text-right font-semibold" style={{ color: TEXT_PRIMARY }}>
                      {Number(order.totalValue).toLocaleString("en-EG")} {order.currency || "EGP"}
                    </td>
                    <td className="px-5 py-3 text-center"><StatusBadge status={order.procurementState} /></td>
                    <td className="px-5 py-3 text-center text-[11px] font-mono" style={{ color: TEXT_MUTED }}>
                      {order.makerUserId?.slice(0, 6) || "—"}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="text-[11px]" style={{ color: TEXT_MUTED }}>—</span>
                    </td>
                    <td className="px-5 py-3 text-right text-[12px]" style={{ color: TEXT_MUTED }}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-EG") : "—"}
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
