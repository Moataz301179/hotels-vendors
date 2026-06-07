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

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-secret-change-in-production"
);

async function getInvoices() {
  const cookieStore = await cookies();
  const token = cookieStore.get("hv_session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET, { clockTolerance: 60 });
    const tenantId = payload.tenantId as string;

    const invoices = await prisma.invoice.findMany({
      where: { tenantId },
      include: {
        factoringRequests: { orderBy: { createdAt: "desc" }, take: 1 },
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
          <h1 className="text-[24px] font-medium text-white tracking-tight">
            Invoices
          </h1>
          <p className="mt-1 text-[14px] text-white/40">
            All your invoices and their factoring status.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <p className="text-[11px] text-white/25 mb-1">Total</p>
          <p className="text-[18px] font-medium text-white">
            {data?.stats.total ?? "—"}
          </p>
        </div>
        <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <p className="text-[11px] text-white/25 mb-1">Paid</p>
          <p className="text-[18px] font-medium text-emerald-400">
            {data?.stats.paid ?? "—"}
          </p>
        </div>
        <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <p className="text-[11px] text-white/25 mb-1">Pending</p>
          <p className="text-[18px] font-medium text-amber-400">
            {data?.stats.pending ?? "—"}
          </p>
        </div>
        <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <p className="text-[11px] text-white/25 mb-1">Factored</p>
          <p className="text-[18px] font-medium text-[#D4A843]">
            {data?.stats.factored ?? "—"}
          </p>
        </div>
      </div>

      {/* Search / Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            placeholder="Search invoices..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:border-[rgba(212,168,67,0.3)] transition-colors"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.06] text-[13px] text-white/40 hover:text-white/60 hover:border-white/[0.12] transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Invoices Table */}
      {data?.invoices && data.invoices.length > 0 ? (
        <div className="rounded-xl border border-white/[0.06] overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                  Invoice #
                </th>
                <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                  Date
                </th>
                <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                  Amount
                </th>
                <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                  Payment
                </th>
                <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                  Factoring
                </th>
                <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3 text-[13px] text-white/60 font-mono">
                    {inv.invoiceNumber || inv.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-white/40">
                    {inv.createdAt?.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-white/70">
                    EGP {inv.total.toLocaleString()}
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
                        className="p-1.5 rounded-lg text-white/20 hover:text-white/50 hover:bg-white/[0.04] transition-colors"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      {!inv.factoringStatus && inv.paymentStatus !== "PAID" && (
                        <button
                          className="p-1.5 rounded-lg text-[rgba(212,168,67,0.4)] hover:text-[#D4A843] hover:bg-[rgba(212,168,67,0.08)] transition-colors"
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
        <div className="rounded-xl border border-white/[0.06] p-16 text-center">
          <FileText className="w-10 h-10 text-white/10 mx-auto mb-4" />
          <p className="text-[15px] text-white/30 mb-1">No invoices yet</p>
          <p className="text-[13px] text-white/15 leading-relaxed max-w-sm mx-auto">
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
      ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
      : s === "OVERDUE"
      ? "text-red-400 bg-red-400/10 border-red-400/20"
      : "text-white/35 bg-white/[0.04] border-white/[0.08]";

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
    return <span className="text-[11px] text-white/15">—</span>;
  }
  const s = status.toUpperCase();
  const color =
    s === "PAID"
      ? "text-[#D4A843] bg-[rgba(212,168,67,0.1)] border-[rgba(212,168,67,0.2)]"
      : s === "ACCEPTED" || s === "OFFERED"
      ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
      : s === "AVAILABLE"
      ? "text-blue-400 bg-blue-400/10 border-blue-400/20"
      : "text-white/35 bg-white/[0.04] border-white/[0.08]";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border ${color}`}
    >
      {status}
    </span>
  );
}
