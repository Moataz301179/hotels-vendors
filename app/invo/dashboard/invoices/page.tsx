import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import {
  FileText,
  Search,
  Filter,
  Download,
  Banknote,
} from "lucide-react";
import { getJwtSecret } from "@/lib/session";
import { cn } from "@/lib/utils";

async function getInvoices() {
  const cookieStore = await cookies();
  const token = cookieStore.get("hv_session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), { clockTolerance: 60 });
    const tenantId = payload.tenantId as string;

    const invoices = await prisma.invoice.findMany({
      where: { tenantId },
      include: {
        factoringRequests: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const stats = {
      total: invoices.length,
      paid: invoices.filter((i) => i.paymentStatus === "PAID").length,
      pending: invoices.filter((i) => i.paymentStatus === "PENDING" || !i.paymentStatus).length,
      factored: invoices.filter((i) => i.factoringStatus === "PAID").length,
    };

    return { invoices, stats };
  } catch {
    return null;
  }
}

export default async function InvoicesPage() {
  const data = await getInvoices();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-medium text-foreground tracking-tight">
            Invoices
          </h1>
          <p className="mt-1 text-sm text-foreground-secondary">
            All your invoices and their factoring status.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-3 rounded-xl border border-border-subtle bg-white/[0.02]">
          <p className="text-xs text-foreground-muted mb-1">Total</p>
          <p className="text-xl font-medium text-foreground">
            {data?.stats.total ?? "—"}
          </p>
        </div>
        <div className="p-3 rounded-xl border border-border-subtle bg-white/[0.02]">
          <p className="text-xs text-foreground-muted mb-1">Paid</p>
          <p className="text-xl font-medium text-success">
            {data?.stats.paid ?? "—"}
          </p>
        </div>
        <div className="p-3 rounded-xl border border-border-subtle bg-white/[0.02]">
          <p className="text-xs text-foreground-muted mb-1">Pending</p>
          <p className="text-xl font-medium text-warning">
            {data?.stats.pending ?? "—"}
          </p>
        </div>
        <div className="p-3 rounded-xl border border-border-subtle bg-white/[0.02]">
          <p className="text-xs text-foreground-muted mb-1">Factored</p>
          <p className="text-xl font-medium text-orange-base">
            {data?.stats.factored ?? "—"}
          </p>
        </div>
      </div>

      {/* Search / Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search invoices..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-border-subtle text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent-base/30 transition-colors"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border-subtle text-sm text-foreground-secondary hover:text-foreground hover:border-border-visible transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Invoices Table */}
      {data?.invoices && data.invoices.length > 0 ? (
        <div className="rounded-xl border border-border-subtle overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left text-[11px] font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">
                  Invoice #
                </th>
                <th className="text-left text-[11px] font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">
                  Date
                </th>
                <th className="text-left text-[11px] font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">
                  Amount
                </th>
                <th className="text-left text-[11px] font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">
                  Payment
                </th>
                <th className="text-left text-[11px] font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">
                  Factoring
                </th>
                <th className="text-left text-[11px] font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-b border-border-subtle/50 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground-secondary font-mono">
                    {inv.invoiceNumber || inv.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground-secondary">
                    {inv.createdAt?.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    EGP {Number(inv.total ?? 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <PaymentPill status={inv.paymentStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <FactoringPill status={inv.factoringStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-white/[0.04] transition-colors"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      {!inv.factoringStatus && inv.paymentStatus !== "PAID" && (
                        <button
                          className="p-1.5 rounded-lg text-orange-base/40 hover:text-orange-base hover:bg-orange-base/10 transition-colors"
                          title="Factor this invoice"
                        >
                          <Banknote className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-border-subtle p-16 text-center">
          <FileText className="w-10 h-10 text-foreground-muted/20 mx-auto mb-4" />
          <p className="text-base text-foreground-muted/50 mb-1">No invoices yet</p>
          <p className="text-sm text-foreground-muted/40 leading-relaxed max-w-sm mx-auto">
            Invoices are created when you deliver goods to hotels through
            HotelsVendors. ETA compliance is handled automatically.
          </p>
        </div>
      )}
    </div>
  );
}

function PaymentPill({ status }: { status: string }) {
  const s = status?.toUpperCase();
  const color =
    s === "PAID"
      ? "text-success bg-success-bg border border-success/20"
      : s === "OVERDUE"
      ? "text-error bg-error-bg border border-error/20"
      : "text-foreground-muted bg-white/[0.04] border border-border-subtle";

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${color}`}>
      {status || "DRAFT"}
    </span>
  );
}

function FactoringPill({ status }: { status: string | null }) {
  if (!status) {
    return <span className="text-xs text-foreground-muted">—</span>;
  }
  const s = status.toUpperCase();
  const color =
    s === "PAID"
      ? "text-orange-base bg-orange-base/10 border border-orange-base/20"
      : s === "ACCEPTED" || s === "OFFERED"
      ? "text-warning bg-warning-bg border border-warning/20"
      : s === "AVAILABLE"
      ? "text-info bg-info-bg border border-info/20"
      : "text-foreground-muted bg-white/[0.04] border border-border-subtle";

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${color}`}>
      {status}
    </span>
  );
}
