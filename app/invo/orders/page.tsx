export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/invo/status-badge";
import { KPICard, KPIGrid } from "@/components/invo/kpi-card";
import Link from "next/link";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { getJwtSecret } from "@/lib/session";

const SESSION_COOKIE = "hv_session";

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) redirect("/login");
  try {
    await jwtVerify(token, getJwtSecret(), { clockTolerance: 60 });
  } catch {
    redirect("/login");
  }

  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, hotels(name), suppliers(name)")
    .order("created_at", { ascending: false })
    .limit(100);

  const orderList = orders || [];
  const totalValue = orderList.reduce((sum: number, o: any) => sum + (o.total_value || 0), 0);
  const draftCount = orderList.filter((o: any) => o.procurement_state === "draft").length;
  const disputedCount = orderList.filter((o: any) => o.procurement_state === "disputed").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Orders</h1>
          <p className="text-[13px] mt-1 text-foreground-muted">
            Procurement orders from Invo marketplace
          </p>
        </div>
        <button className="px-4 py-2 rounded-lg text-[13px] font-bold transition-all hover:-translate-y-0.5 bg-orange-base text-surface">
          + New Order
        </button>
      </div>

      <KPIGrid>
        <KPICard title="Total Orders" value={orderList.length} icon={<Package className="w-4 h-4" />} />
        <KPICard title="Total Value" value={`${totalValue.toLocaleString("en-EG")} EGP`} icon={<CheckCircle className="w-4 h-4" />} />
        <KPICard title="Draft" value={draftCount} icon={<Clock className="w-4 h-4" />} />
        <KPICard title="Disputed" value={disputedCount} accent={disputedCount > 0} icon={<XCircle className="w-4 h-4" />} />
      </KPIGrid>

      <div className="rounded-xl overflow-hidden bg-surface-raised border border-border-subtle">
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">All Orders</h2>
          <span className="text-[11px] text-foreground-tertiary">{orderList.length} orders</span>
        </div>
        {orderList.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Package className="w-8 h-8 mx-auto mb-3 text-foreground-tertiary" />
            <p className="text-[13px] text-foreground-muted">No orders yet.</p>
            <p className="text-[12px] mt-1 text-foreground-tertiary">Orders will be created when hotels place orders with suppliers.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border-subtle text-foreground-tertiary">
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
                {orderList.map((order: any) => (
                  <tr
                    key={order.id}
                    className="border-t border-border-subtle transition-colors cursor-pointer hover:bg-surface-hover"
                  >
                    <td className="px-5 py-3 font-mono text-[11px] text-foreground-muted">
                      <Link href={`/invo/orders/${order.id}`} className="hover:underline text-orange-base">
                        {order.id.slice(0, 8)}...
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-foreground">{(order as any).hotels?.name || "—"}</td>
                    <td className="px-5 py-3 text-foreground-muted">{(order as any).suppliers?.name || "—"}</td>
                    <td className="px-5 py-3 text-right font-semibold text-foreground">
                      {(order.total_value || 0).toLocaleString("en-EG")} {order.currency || "EGP"}
                    </td>
                    <td className="px-5 py-3 text-center"><StatusBadge status={order.procurement_state || "draft"} /></td>
                    <td className="px-5 py-3 text-center text-[11px] font-mono text-foreground-tertiary">
                      {order.maker_user_id?.slice(0, 6) || "—"}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {order.checker_approved ? (
                        <CheckCircle className="w-4 h-4 mx-auto text-orange-base" />
                      ) : (
                        <span className="text-[11px] text-foreground-tertiary">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right text-[12px] text-foreground-tertiary">
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
