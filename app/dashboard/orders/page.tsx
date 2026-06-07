import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import Link from "next/link";
import {
  Package,
  Search,
  Filter,
  ArrowRight,
  Clock,
  CheckCircle2,
  Truck,
  AlertTriangle,
} from "lucide-react";
import { OrderStatusPill } from "@/components/dashboards/shared/order-pipeline";

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-secret-change-in-production"
);

async function getOrders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("hv_session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET, { clockTolerance: 60 });
    const tenantId = payload.tenantId as string;
    const platformRole = payload.platformRole as string;

    const where =
      platformRole === "HOTEL"
        ? { tenantId, hotelId: payload.userId as string }
        : { tenantId };

    const orders = await prisma.order.findMany({
      where,
      include: {
        supplier: { select: { name: true, id: true } },
        hotel: { select: { name: true } },
        items: { select: { id: true } },
        invoices: { select: { id: true, status: true, factoringStatus: true } },
        approvals: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { approver: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const totalCount = await prisma.order.count({ where });
    const activeCount = await prisma.order.count({
      where: { ...where, status: { in: ["CONFIRMED", "IN_TRANSIT", "APPROVED"] } },
    });
    const deliveredCount = await prisma.order.count({
      where: { ...where, status: "DELIVERED" },
    });
    const disputedCount = await prisma.order.count({
      where: { ...where, status: "DISPUTED" },
    });

    return { orders, stats: { totalCount, activeCount, deliveredCount, disputedCount } };
  } catch {
    return null;
  }
}

export default async function OrdersPage() {
  const data = await getOrders();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[24px] font-medium text-white tracking-tight">
            Order Tracking
          </h1>
          <p className="mt-1 text-[14px] text-white/40">
            Track procurement orders, deliveries, and invoice qualification.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Package}
          label="Total Orders"
          value={data?.stats.totalCount ?? "—"}
          color="text-white"
        />
        <StatCard
          icon={Clock}
          label="Active"
          value={data?.stats.activeCount ?? "—"}
          color="text-blue-400"
        />
        <StatCard
          icon={CheckCircle2}
          label="Delivered"
          value={data?.stats.deliveredCount ?? "—"}
          color="text-emerald-400"
        />
        <StatCard
          icon={AlertTriangle}
          label="Disputed"
          value={data?.stats.disputedCount ?? "—"}
          color="text-red-400"
        />
      </div>

      {/* Search / Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            placeholder="Search by order number, supplier..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:border-[rgba(139,0,0,0.3)] transition-colors"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.06] text-[13px] text-white/40 hover:text-white/60 hover:border-white/[0.12] transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Orders Table */}
      {data?.orders && data.orders.length > 0 ? (
        <div className="rounded-xl border border-white/[0.06] overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                  Order #
                </th>
                <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                  Supplier
                </th>
                <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                  Items
                </th>
                <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                  Total
                </th>
                <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                  Status
                </th>
                <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                  Last Action
                </th>
                <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                  Invoice
                </th>
                <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.orders.map((order) => {
                const latestApproval = order.approvals[0];
                const latestInvoice = order.invoices[order.invoices.length - 1];

                return (
                  <tr
                    key={order.id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="text-[13px] font-mono text-accent-base/70 hover:text-accent-base transition-colors"
                      >
                        {order.orderNumber || order.id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-white/50">
                      {order.supplier?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-white/35">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-white/60">
                      EGP {order.total?.toLocaleString() || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusPill status={order.status} />
                    </td>
                    <td className="px-4 py-3">
                      {latestApproval ? (
                        <span className="text-[12px] text-white/30">
                          {latestApproval.action} by{" "}
                          {latestApproval.approver?.name || "Unknown"}
                        </span>
                      ) : (
                        <span className="text-[11px] text-white/15">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {latestInvoice ? (
                        <span
                          className={`text-[11px] ${
                            latestInvoice.status === "VALIDATED"
                              ? "text-emerald-400/60"
                              : latestInvoice.status === "DISPUTED"
                              ? "text-red-400/60"
                              : "text-white/30"
                          }`}
                        >
                          {latestInvoice.status || "No invoice"}
                        </span>
                      ) : (
                        <span className="text-[11px] text-white/15">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="p-1.5 rounded-lg text-white/20 hover:text-accent-base hover:bg-accent-base/10 transition-colors inline-flex"
                        title="View details"
                      >
                        <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.06] p-16 text-center">
          <Truck className="w-10 h-10 text-white/10 mx-auto mb-4" />
          <p className="text-[15px] text-white/30 mb-1">No orders found</p>
          <p className="text-[13px] text-white/15">
            Orders will appear here once procurement is initiated.
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
      <div className="flex items-center gap-2.5 mb-2">
        <Icon size={14} className="text-white/20" />
        <span className="text-[11px] text-white/25">{label}</span>
      </div>
      <p className={`text-[22px] font-medium tracking-tight ${color}`}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
}
