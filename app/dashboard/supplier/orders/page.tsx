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
  FileText,
  Banknote,
} from "lucide-react";
import { OrderStatusPill } from "@/components/dashboards/shared/order-pipeline";
import {
  InvoiceStatusPill,
  FactoringStatusPill,
} from "@/components/dashboards/shared/compliance-panel";

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-secret-change-in-production"
);

async function getSupplierOrders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("hv_session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET, { clockTolerance: 60 });
    const tenantId = payload.tenantId as string;
    const userId = payload.userId as string;

    const orders = await prisma.order.findMany({
      where: {
        tenantId,
        supplierId: userId,
      },
      include: {
        hotel: { select: { name: true, id: true } },
        items: { select: { id: true } },
        invoices: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            invoiceNumber: true,
            status: true,
            paymentStatus: true,
            factoringStatus: true,
            total: true,
            etaStatus: true,
          },
        },
        approvals: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { approver: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const stats = {
      total: orders.length,
      pending: orders.filter((o) =>
        ["DRAFT", "PENDING_APPROVAL"].includes(o.status)
      ).length,
      inTransit: orders.filter((o) => o.status === "IN_TRANSIT").length,
      delivered: orders.filter((o) => o.status === "DELIVERED").length,
      invoiceable: orders.filter(
        (o) => o.status === "DELIVERED" && o.invoices.length === 0
      ).length,
      factored: orders.filter(
        (o) =>
          o.invoices.length > 0 &&
          ["ACCEPTED", "PAID"].includes(o.invoices[0].factoringStatus || "")
      ).length,
    };

    return { orders, stats };
  } catch {
    return null;
  }
}

export default async function SupplierOrdersPage() {
  const data = await getSupplierOrders();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[24px] font-medium text-white tracking-tight">
          My Orders
        </h1>
        <p className="mt-1 text-[14px] text-white/40">
          Orders from hotels. Track delivery status and invoice factoring.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <MiniStat label="Total" value={data?.stats.total ?? "—"} />
        <MiniStat
          label="Pending"
          value={data?.stats.pending ?? "—"}
          color="text-amber-400"
        />
        <MiniStat
          label="In Transit"
          value={data?.stats.inTransit ?? "—"}
          color="text-blue-400"
        />
        <MiniStat
          label="Delivered"
          value={data?.stats.delivered ?? "—"}
          color="text-emerald-400"
        />
        <MiniStat
          label="To Invoice"
          value={data?.stats.invoiceable ?? "—"}
          color="text-[#8B0000]"
        />
        <MiniStat
          label="Factored"
          value={data?.stats.factored ?? "—"}
          color="text-[#D4A843]"
        />
      </div>

      {/* Search / Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            placeholder="Search by order number, hotel..."
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
                  Hotel
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
                  Invoice
                </th>
                <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                  Factoring
                </th>
                <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.orders.map((order) => {
                const inv = order.invoices[0];
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
                      {order.hotel?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-white/35">
                      {order.items.length}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-white/60">
                      EGP {order.total?.toLocaleString() || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusPill status={order.status} />
                    </td>
                    <td className="px-4 py-3">
                      {inv ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[11px] text-white/30 font-mono">
                            {inv.invoiceNumber || inv.id.slice(0, 8)}
                          </span>
                          <InvoiceStatusPill status={inv.status} />
                        </div>
                      ) : order.status === "DELIVERED" ? (
                        <span className="text-[11px] text-amber-400/50 flex items-center gap-1">
                          <FileText size={10} />
                          Ready to invoice
                        </span>
                      ) : (
                        <span className="text-[11px] text-white/15">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {inv?.factoringStatus ? (
                        <FactoringStatusPill status={inv.factoringStatus} />
                      ) : (
                        <span className="text-[11px] text-white/15">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="p-1.5 rounded-lg text-white/20 hover:text-accent-base hover:bg-accent-base/10 transition-colors inline-flex"
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
          <p className="text-[15px] text-white/30 mb-1">No orders yet</p>
          <p className="text-[13px] text-white/15">
            Orders from hotels will appear here once they place an order.
          </p>
        </div>
      )}
    </div>
  );
}

function MiniStat({
  label,
  value,
  color = "text-white",
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
      <p className="text-[10px] text-white/20 mb-0.5">{label}</p>
      <p className={`text-[18px] font-medium ${color}`}>
        {typeof value === "number" ? value : value}
      </p>
    </div>
  );
}
