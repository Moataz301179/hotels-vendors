import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Banknote,
  ArrowRight,
  TrendingUp,
  Users,
  Building2,
} from "lucide-react";
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

async function getComplianceData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("hv_session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET, { clockTolerance: 60 });
    const tenantId = payload.tenantId as string;
    const platformRole = payload.platformRole as string;

    if (platformRole !== "ADMIN" && platformRole !== "SUPER_ADMIN") {
      return null;
    }

    const [
      totalOrders,
      activeOrders,
      deliveredOrders,
      disputedOrders,
      totalInvoices,
      validatedInvoices,
      rejectedInvoices,
      pendingEtaInvoices,
      factoredInvoices,
      paidInvoices,
      overdueInvoices,
      recentAuditLogs,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count({ where: { tenantId } }),
      prisma.order.count({
        where: {
          tenantId,
          status: { in: ["CONFIRMED", "IN_TRANSIT", "APPROVED"] },
        },
      }),
      prisma.order.count({ where: { tenantId, status: "DELIVERED" } }),
      prisma.order.count({ where: { tenantId, status: "DISPUTED" } }),
      prisma.invoice.count({ where: { tenantId } }),
      prisma.invoice.count({ where: { tenantId, status: "VALIDATED" } }),
      prisma.invoice.count({ where: { tenantId, etaStatus: "REJECTED" } }),
      prisma.invoice.count({
        where: { tenantId, etaStatus: { in: ["PENDING", "SUBMITTING", "RETRYING"] } },
      }),
      prisma.invoice.count({
        where: { tenantId, factoringStatus: { in: ["ACCEPTED", "PAID"] } },
      }),
      prisma.invoice.count({ where: { tenantId, paymentStatus: "PAID" } }),
      prisma.invoice.count({ where: { tenantId, paymentStatus: "OVERDUE" } }),
      prisma.auditLog.findMany({
        where: { entityType: "ORDER" },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.order.findMany({
        where: { tenantId },
        include: {
          supplier: { select: { name: true } },
          hotel: { select: { name: true } },
          invoices: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              id: true,
              status: true,
              etaStatus: true,
              paymentStatus: true,
              factoringStatus: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    return {
      stats: {
        totalOrders,
        activeOrders,
        deliveredOrders,
        disputedOrders,
        totalInvoices,
        validatedInvoices,
        rejectedInvoices,
        pendingEtaInvoices,
        factoredInvoices,
        paidInvoices,
        overdueInvoices,
        validationRate:
          totalInvoices > 0
            ? Math.round((validatedInvoices / totalInvoices) * 100)
            : 0,
        etaAcceptanceRate:
          totalInvoices > 0
            ? Math.round(
                ((totalInvoices - rejectedInvoices) / totalInvoices) * 100
              )
            : 100,
      },
      recentAuditLogs,
      recentOrders,
    };
  } catch {
    return null;
  }
}

export default async function AdminCompliancePage() {
  const data = await getComplianceData();

  if (!data) {
    redirect("/login?next=/dashboard/admin/compliance");
  }

  const { stats, recentOrders } = data;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield size={24} className="text-accent-base/60" />
          <h1 className="text-[24px] font-medium text-white tracking-tight">
            Compliance & Audit
          </h1>
        </div>
        <p className="text-[14px] text-white/40">
          Platform-wide compliance monitoring, ETA audit trail, and factoring
          oversight.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
        <KpiCard
          icon={Building2}
          label="Total Orders"
          value={stats.totalOrders}
          color="text-white"
        />
        <KpiCard
          icon={Clock}
          label="Active"
          value={stats.activeOrders}
          color="text-blue-400"
        />
        <KpiCard
          icon={CheckCircle2}
          label="Delivered"
          value={stats.deliveredOrders}
          color="text-emerald-400"
        />
        <KpiCard
          icon={AlertTriangle}
          label="Disputed"
          value={stats.disputedOrders}
          color="text-red-400"
        />
        <KpiCard
          icon={TrendingUp}
          label="Validation Rate"
          value={`${stats.validationRate}%`}
          color="text-emerald-400"
        />
        <KpiCard
          icon={ShieldCheck}
          label="ETA Acceptance"
          value={`${stats.etaAcceptanceRate}%`}
          color="text-[#D4A843]"
        />
      </div>

      {/* Invoice Health */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={14} className="text-white/20" />
            <span className="text-[12px] text-white/30">Total Invoices</span>
          </div>
          <p className="text-[24px] font-medium text-white">
            {stats.totalInvoices}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={14} className="text-emerald-400/40" />
            <span className="text-[12px] text-white/30">Validated</span>
          </div>
          <p className="text-[24px] font-medium text-emerald-400">
            {stats.validatedInvoices}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-2 mb-3">
            <Banknote size={14} className="text-[#D4A843]/40" />
            <span className="text-[12px] text-white/30">Factored</span>
          </div>
          <p className="text-[24px] font-medium text-[#D4A843]">
            {stats.factoredInvoices}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} className="text-red-400/40" />
            <span className="text-[12px] text-white/30">Overdue</span>
          </div>
          <p className="text-[24px] font-medium text-red-400">
            {stats.overdueInvoices}
          </p>
        </div>
      </div>

      {/* Search / Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            placeholder="Search by order, hotel, supplier..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:border-[rgba(139,0,0,0.3)] transition-colors"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.06] text-[13px] text-white/40 hover:text-white/60 hover:border-white/[0.12] transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Recent Orders with Compliance Status */}
      <div className="rounded-xl border border-white/[0.06] overflow-x-auto">
        <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
          <Shield size={14} className="text-white/25" />
          <h3 className="text-[14px] font-medium text-white/60">
            Recent Orders — Compliance Status
          </h3>
        </div>
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                Order
              </th>
              <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                Hotel
              </th>
              <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                Supplier
              </th>
              <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                Invoice
              </th>
              <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                ETA
              </th>
              <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                Payment
              </th>
              <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                Factoring
              </th>
              <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => {
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
                  <td className="px-4 py-3 text-[13px] text-white/40">
                    {order.hotel?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-white/40">
                    {order.supplier?.name || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {inv ? (
                      <InvoiceStatusPill status={inv.status} />
                    ) : (
                      <span className="text-[11px] text-white/15">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {inv ? (
                      <EtaStatusPill status={inv.etaStatus} />
                    ) : (
                      <span className="text-[11px] text-white/15">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {inv ? (
                      <PaymentStatusPill status={inv.paymentStatus} />
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
    </div>
  );
}

function KpiCard({
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
    <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon size={12} className="text-white/15" />
        <span className="text-[10px] text-white/25">{label}</span>
      </div>
      <p className={`text-[18px] font-medium ${color}`}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
}
