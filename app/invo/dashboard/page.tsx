import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import Link from "next/link";
import {
  Banknote,
  FileText,
  TrendingUp,
  Clock,
  ArrowRight,
  CreditCard,
  Zap,
} from "lucide-react";

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-secret-change-in-production"
);

async function getSupplierMetrics() {
  const cookieStore = await cookies();
  const token = cookieStore.get("hv_session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET, { clockTolerance: 60 });
    const userId = payload.userId as string;
    const tenantId = payload.tenantId as string;

    const [invoiceCount, factoringCount, pendingInvoices] = await Promise.all([
      prisma.invoice.count({ where: { tenantId } }),
      prisma.factoringRequest.count({ where: { tenantId } }),
      prisma.invoice.count({
        where: { tenantId, factoringStatus: "AVAILABLE" },
      }),
    ]);

    const invoices = await prisma.invoice.findMany({
      where: { tenantId },
      include: { factoringRequests: { orderBy: { createdAt: "desc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return {
      invoiceCount,
      factoringCount,
      pendingInvoices,
      recentInvoices: invoices,
    };
  } catch {
    return null;
  }
}

export default async function InvoDashboardPage() {
  const metrics = await getSupplierMetrics();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-[24px] font-medium text-white tracking-tight">
          Supplier Dashboard
        </h1>
        <p className="mt-1 text-[14px] text-white/40">
          Manage your INVO subscription, factoring, and invoices.
        </p>
      </div>

      {/* Subscription Banner */}
      <div className="mb-8 p-5 rounded-xl border border-[rgba(212,168,67,0.15)] bg-[rgba(212,168,67,0.04)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(212,168,67,0.15)] flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#D4A843]" />
            </div>
            <div>
              <p className="text-[14px] font-medium text-white">
                INVO Subscription Active
              </p>
              <p className="text-[12px] text-white/35">
                Growth Plan — EGP 1,500/month
              </p>
            </div>
          </div>
          <Link
            href="/invo/dashboard/subscription"
            className="text-[13px] font-medium text-[#D4A843] hover:text-[#e0b856] transition-colors flex items-center gap-1.5"
          >
            Manage Subscription
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          icon={FileText}
          label="Total Invoices"
          value={metrics?.invoiceCount ?? "—"}
          accent="gold"
        />
        <MetricCard
          icon={Banknote}
          label="Factored"
          value={metrics?.factoringCount ?? "—"}
          accent="gold"
        />
        <MetricCard
          icon={Clock}
          label="Pending Invoices"
          value={metrics?.pendingInvoices ?? "—"}
          accent="gold"
        />
        <MetricCard
          icon={TrendingUp}
          label="Factoring Rate"
          value="1-2%"
          accent="gold"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <QuickAction
          href="/invo/dashboard/factoring"
          icon={Banknote}
          title="Get Early Payment"
          desc="Factor an invoice and get paid in 24 hours"
        />
        <QuickAction
          href="/invo/dashboard/invoices"
          icon={FileText}
          title="View Invoices"
          desc="See all your invoices and their factoring status"
        />
        <QuickAction
          href="/invo/dashboard/subscription"
          icon={CreditCard}
          title="Manage Plan"
          desc="Upgrade, downgrade, or view billing"
        />
      </div>

      {/* Recent Invoices */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-medium text-white tracking-tight">
            Recent Invoices
          </h2>
          <Link
            href="/invo/dashboard/invoices"
            className="text-[13px] text-white/35 hover:text-[#D4A843] transition-colors flex items-center gap-1"
          >
            View All
            <ArrowRight size={13} />
          </Link>
        </div>

        {metrics?.recentInvoices && metrics.recentInvoices.length > 0 ? (
          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                    Invoice
                  </th>
                  <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                    Amount
                  </th>
                  <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                    Status
                  </th>
                  <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                    Factoring
                  </th>
                </tr>
              </thead>
              <tbody>
                {metrics.recentInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3 text-[13px] text-white/70">
                      {inv.invoiceNumber || inv.id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-white/70">
                      EGP {inv.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={inv.paymentStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <FactoringPill status={inv.factoringStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-white/[0.06] p-12 text-center">
            <FileText className="w-8 h-8 text-white/10 mx-auto mb-3" />
            <p className="text-[14px] text-white/30">No invoices yet</p>
            <p className="text-[12px] text-white/15 mt-1">
              Invoices from HotelsVendors will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-[rgba(212,168,67,0.10)] flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#D4A843]" />
        </div>
        <span className="text-[12px] text-white/35">{label}</span>
      </div>
      <p className="text-[22px] font-medium text-white tracking-tight">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[rgba(212,168,67,0.15)] hover:bg-[rgba(212,168,67,0.03)] transition-all group"
    >
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-4 h-4 text-[#D4A843]" />
        <span className="text-[14px] font-medium text-white group-hover:text-[#D4A843] transition-colors">
          {title}
        </span>
      </div>
      <p className="text-[12px] text-white/30 leading-relaxed">{desc}</p>
    </Link>
  );
}

function StatusPill({ status }: { status: string }) {
  const s = status?.toUpperCase();
  const color =
    s === "PAID"
      ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
      : s === "OVERDUE"
      ? "text-red-400 bg-red-400/10 border-red-400/20"
      : "text-white/40 bg-white/[0.04] border-white/[0.08]";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border ${color}`}
    >
      {status || "DRAFT"}
    </span>
  );
}

function FactoringPill({ status }: { status: string | null }) {
  if (!status) {
    return (
      <span className="text-[11px] text-white/20">—</span>
    );
  }
  const s = status.toUpperCase();
  const color =
    s === "PAID"
      ? "text-[#D4A843] bg-[rgba(212,168,67,0.1)] border-[rgba(212,168,67,0.2)]"
      : s === "ACCEPTED" || s === "OFFERED" || s === "AVAILABLE"
      ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
      : "text-white/40 bg-white/[0.04] border-white/[0.08]";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border ${color}`}
    >
      {status}
    </span>
  );
}
