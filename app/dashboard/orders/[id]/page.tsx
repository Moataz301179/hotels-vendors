import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  FileText,
  Banknote,
  Shield,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  User,
  Building2,
  Hash,
} from "lucide-react";
import { OrderPipeline, OrderStatusPill } from "@/components/dashboards/shared/order-pipeline";
import { AuditTimeline } from "@/components/dashboards/shared/audit-timeline";
import {
  CompliancePanel,
  InvoiceStatusPill,
  EtaStatusPill,
  PaymentStatusPill,
  FactoringStatusPill,
} from "@/components/dashboards/shared/compliance-panel";

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-secret-change-in-production"
);

async function getOrderDetail(orderId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("hv_session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET, { clockTolerance: 60 });
    const tenantId = payload.tenantId as string;

    const order = await prisma.order.findFirst({
      where: { id: orderId, tenantId },
      include: {
        supplier: { select: { id: true, name: true, email: true } },
        hotel: { select: { id: true, name: true } },
        items: true,
        approvals: {
          orderBy: { createdAt: "asc" },
          include: { approver: { select: { name: true } } },
        },
        invoices: {
          orderBy: { createdAt: "desc" },
          include: {
            factoringRequests: { orderBy: { createdAt: "desc" }, take: 1 },
          },
        },
      },
    });

    if (!order) return null;

    const auditLogs = await prisma.auditLog.findMany({
      where: { entityType: "ORDER", entityId: orderId },
      orderBy: { createdAt: "asc" },
    });

    return { order, auditLogs };
  } catch {
    return null;
  }
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getOrderDetail(id);

  if (!data) notFound();
  const { order, auditLogs } = data;

  const latestInvoice = order.invoices[0];

  // Build compliance items
  const complianceItems = [
    {
      label: "Order approved by hotel",
      status: ["APPROVED", "CONFIRMED", "IN_TRANSIT", "DELIVERED"].includes(
        order.status
      )
        ? "passed" as const
        : order.status === "REJECTED"
        ? "failed" as const
        : "pending" as const,
      detail: order.approvals[0]?.action,
    },
    {
      label: "Goods received note (GRN) signed",
      status: order.status === "DELIVERED" ? "passed" as const : "pending" as const,
    },
    {
      label: "Invoice issued by supplier",
      status: latestInvoice ? "passed" as const : "pending" as const,
      detail: latestInvoice?.invoiceNumber || latestInvoice?.id?.slice(0, 8),
    },
    {
      label: "ETA e-invoice submission",
      status: latestInvoice?.etaStatus === "ACCEPTED"
        ? "passed" as const
        : latestInvoice?.etaStatus === "REJECTED"
        ? "failed" as const
        : latestInvoice?.etaStatus
        ? "warning" as const
        : "pending" as const,
      detail: latestInvoice?.etaStatus || undefined,
    },
    {
      label: "Invoice validated",
      status: latestInvoice?.status === "VALIDATED"
        ? "passed" as const
        : latestInvoice?.status === "DISPUTED"
        ? "failed" as const
        : "pending" as const,
    },
    {
      label: "Factoring eligibility",
      status: latestInvoice?.factoringStatus === "AVAILABLE" || latestInvoice?.factoringStatus === "OFFERED" || latestInvoice?.factoringStatus === "ACCEPTED" || latestInvoice?.factoringStatus === "PAID"
        ? "passed" as const
        : latestInvoice?.factoringStatus === "LOCKED_BY_MASTER"
        ? "failed" as const
        : "pending" as const,
      detail: latestInvoice?.factoringStatus?.replace(/_/g, " ") || undefined,
    },
  ];

  // Build audit entries
  const auditEntries = [
    ...order.approvals.map((a) => ({
      id: `approval-${a.id}`,
      action: a.action,
      actorName: a.approver?.name || "Unknown",
      actorRole: "Hotel Buyer",
      beforeState: a.beforeState,
      afterState: a.afterState,
      createdAt: a.createdAt,
      ipAddress: null,
      hash: null,
    })),
    ...auditLogs.map((log) => ({
      id: `audit-${log.id}`,
      action: log.action,
      actorName: log.actorId || "System",
      actorRole: log.actorRole,
      beforeState: log.beforeState,
      afterState: log.afterState,
      createdAt: log.createdAt,
      ipAddress: log.ipAddress,
      hash: log.hash,
    })),
  ].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Back link */}
      <Link
        href="/dashboard/orders"
        className="inline-flex items-center gap-2 text-[13px] text-white/30 hover:text-accent-base transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-[24px] font-medium text-white tracking-tight">
              {order.orderNumber || `Order #${order.id.slice(0, 8)}`}
            </h1>
            <OrderStatusPill status={order.status} />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-white/30">
            <span className="flex items-center gap-1.5">
              <Building2 size={12} />
              {order.hotel?.name || "Unknown Hotel"}
            </span>
            <span className="flex items-center gap-1.5">
              <User size={12} />
              {order.supplier?.name || "Unknown Supplier"}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[28px] font-medium text-white tracking-tight">
            EGP {order.total?.toLocaleString() || "—"}
          </p>
          <p className="text-[12px] text-white/25">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Pipeline */}
      <div className="mb-8 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
        <h2 className="text-[14px] font-medium text-white/50 mb-4">
          Order Pipeline
        </h2>
        <OrderPipeline status={order.status} />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
              <Package size={14} className="text-white/25" />
              <h3 className="text-[14px] font-medium text-white/60">
                Order Items
              </h3>
            </div>
            {order.items.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.04]">
                    <th className="text-left text-[11px] font-medium text-white/20 uppercase tracking-wider px-4 py-2.5">
                      Item
                    </th>
                    <th className="text-left text-[11px] font-medium text-white/20 uppercase tracking-wider px-4 py-2.5">
                      Qty
                    </th>
                    <th className="text-left text-[11px] font-medium text-white/20 uppercase tracking-wider px-4 py-2.5">
                      Unit Price
                    </th>
                    <th className="text-left text-[11px] font-medium text-white/20 uppercase tracking-wider px-4 py-2.5">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item: any) => (
                    <tr
                      key={item.id}
                      className="border-b border-white/[0.03] hover:bg-white/[0.01]"
                    >
                      <td className="px-4 py-3 text-[13px] text-white/60">
                        {item.name || item.description || item.id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-white/40">
                        {item.quantity || "—"}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-white/40">
                        EGP {item.unitPrice?.toLocaleString() || "—"}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-white/50">
                        EGP {item.totalPrice?.toLocaleString() || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center">
                <p className="text-[13px] text-white/20">No items listed</p>
              </div>
            )}
          </div>

          {/* Invoice & Factoring */}
          {latestInvoice && (
            <div className="rounded-xl border border-white/[0.06] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
                <FileText size={14} className="text-white/25" />
                <h3 className="text-[14px] font-medium text-white/60">
                  Latest Invoice
                </h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-[10px] text-white/20 uppercase tracking-wider mb-1">
                      Invoice #
                    </p>
                    <p className="text-[13px] text-white/60 font-mono">
                      {latestInvoice.invoiceNumber || latestInvoice.id.slice(0, 8)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/20 uppercase tracking-wider mb-1">
                      Amount
                    </p>
                    <p className="text-[13px] text-white/60">
                      EGP {latestInvoice.total?.toLocaleString() || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/20 uppercase tracking-wider mb-1">
                      Status
                    </p>
                    <InvoiceStatusPill status={latestInvoice.status} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/20 uppercase tracking-wider mb-1">
                      ETA
                    </p>
                    <EtaStatusPill status={latestInvoice.etaStatus} />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/[0.04]">
                  <div>
                    <p className="text-[10px] text-white/20 uppercase tracking-wider mb-1">
                      Payment
                    </p>
                    <PaymentStatusPill status={latestInvoice.paymentStatus} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/20 uppercase tracking-wider mb-1">
                      Factoring
                    </p>
                    <FactoringStatusPill status={latestInvoice.factoringStatus} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/20 uppercase tracking-wider mb-1">
                      Created
                    </p>
                    <p className="text-[12px] text-white/30">
                      {new Date(latestInvoice.createdAt).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Audit Trail */}
          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
              <Shield size={14} className="text-white/25" />
              <h3 className="text-[14px] font-medium text-white/60">
                Audit Trail
              </h3>
              <span className="text-[11px] text-white/15 ml-auto">
                {auditEntries.length} entries
              </span>
            </div>
            <div className="p-4">
              <AuditTimeline entries={auditEntries} />
            </div>
          </div>
        </div>

        {/* Right column — 1 col */}
        <div className="space-y-6">
          {/* Compliance Panel */}
          <CompliancePanel items={complianceItems} />

          {/* Supplier Info */}
          <div className="rounded-xl border border-white/[0.06] p-4">
            <h3 className="text-[13px] font-medium text-white/40 mb-3 flex items-center gap-2">
              <Building2 size={13} className="text-white/20" />
              Supplier
            </h3>
            <p className="text-[14px] text-white/70 mb-1">
              {order.supplier?.name || "—"}
            </p>
            {order.supplier?.email && (
              <p className="text-[12px] text-white/25">
                {order.supplier.email}
              </p>
            )}
          </div>

          {/* Hotel Info */}
          <div className="rounded-xl border border-white/[0.06] p-4">
            <h3 className="text-[13px] font-medium text-white/40 mb-3 flex items-center gap-2">
              <MapPin size={13} className="text-white/20" />
              Delivery To
            </h3>
            <p className="text-[14px] text-white/70">
              {order.hotel?.name || "—"}
            </p>
          </div>

          {/* Order Meta */}
          <div className="rounded-xl border border-white/[0.06] p-4">
            <h3 className="text-[13px] font-medium text-white/40 mb-3 flex items-center gap-2">
              <Hash size={13} className="text-white/20" />
              Order Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[12px] text-white/25">Order ID</span>
                <span className="text-[12px] text-white/40 font-mono">
                  {order.id.slice(0, 12)}…
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-white/25">Payment Guaranteed</span>
                <span
                  className={`text-[12px] ${
                    order.paymentGuaranteed
                      ? "text-emerald-400/60"
                      : "text-white/25"
                  }`}
                >
                  {order.paymentGuaranteed ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-white/25">Invoices</span>
                <span className="text-[12px] text-white/40">
                  {order.invoices.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-white/25">Approvals</span>
                <span className="text-[12px] text-white/40">
                  {order.approvals.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
