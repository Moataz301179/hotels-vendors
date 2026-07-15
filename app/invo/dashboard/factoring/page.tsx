import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import {
  Banknote,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { getJwtSecret } from "@/lib/session";

async function getFactoringData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("hv_session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), { clockTolerance: 60 });
    const tenantId = payload.tenantId as string;

    const [requests, factorableInvoices] = await Promise.all([
      prisma.factoringRequest.findMany({
        where: { tenantId },
        include: { invoice: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.invoice.findMany({
        where: {
          tenantId,
          factoringStatus: "AVAILABLE",
          paymentStatus: { not: "PAID" },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    return { requests, factorableInvoices };
  } catch {
    return null;
  }
}

export default async function FactoringPage() {
  const data = await getFactoringData();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[24px] font-medium text-white tracking-tight">
          Factoring
        </h1>
        <p className="mt-1 text-[14px] text-white/40">
          Get paid in 24 hours. Zero default risk. Non-recourse.
        </p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <div className="w-9 h-9 rounded-lg bg-[rgba(212,168,67,0.10)] flex items-center justify-center mb-3">
            <Banknote className="w-4 h-4 text-[#D4A843]" />
          </div>
          <p className="text-[13px] font-medium text-white mb-1">Select Invoice</p>
          <p className="text-[12px] text-white/30 leading-relaxed">
            Choose any unpaid invoice from your list to factor
          </p>
        </div>
        <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <div className="w-9 h-9 rounded-lg bg-[rgba(212,168,67,0.10)] flex items-center justify-center mb-3">
            <Clock className="w-4 h-4 text-[#D4A843]" />
          </div>
          <p className="text-[13px] font-medium text-white mb-1">Get Paid in 24hr</p>
          <p className="text-[12px] text-white/30 leading-relaxed">
            Our partner disburses directly to your bank account
          </p>
        </div>
        <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <div className="w-9 h-9 rounded-lg bg-[rgba(212,168,67,0.10)] flex items-center justify-center mb-3">
            <ShieldCheck className="w-4 h-4 text-[#D4A843]" />
          </div>
          <p className="text-[13px] font-medium text-white mb-1">Zero Risk</p>
          <p className="text-[12px] text-white/30 leading-relaxed">
            Non-recourse — if the hotel defaults, that&apos;s our problem
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Available to Factor */}
        <div className="lg:col-span-2">
          <h2 className="text-[15px] font-medium text-white tracking-tight mb-4">
            Available to Factor
          </h2>
          {data?.factorableInvoices && data.factorableInvoices.length > 0 ? (
            <div className="space-y-3">
              {data.factorableInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-4 rounded-xl border border-[rgba(212,168,67,0.10)] bg-[rgba(212,168,67,0.02)]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-medium text-white/70">
                      {inv.invoiceNumber || inv.id.slice(0, 8)}
                    </span>
                    <span className="text-[14px] font-medium text-[#D4A843]">
                      EGP {inv.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-white/25">
                      {inv.createdAt?.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <button className="text-[12px] font-medium text-[#D4A843] hover:text-[#e0b856] transition-colors flex items-center gap-1">
                      Factor Now
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-white/[0.06] p-8 text-center">
              <TrendingUp className="w-6 h-6 text-white/10 mx-auto mb-2" />
              <p className="text-[13px] text-white/25">No eligible invoices</p>
              <p className="text-[11px] text-white/15 mt-1">
                Invoices appear here when hotels confirm delivery
              </p>
            </div>
          )}
        </div>

        {/* Factoring History */}
        <div className="lg:col-span-3">
          <h2 className="text-[15px] font-medium text-white tracking-tight mb-4">
            Factoring History
          </h2>
          {data?.requests && data.requests.length > 0 ? (
            <div className="rounded-xl border border-white/[0.06] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                      Date
                    </th>
                    <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                      Amount
                    </th>
                    <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.requests.map((req) => (
                    <tr
                      key={req.id}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3 text-[13px] text-white/50">
                        {req.createdAt?.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-white/60">
                        EGP {req.requestedAmount?.toLocaleString() || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <FactoringStatusPill status={req.status || ""} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl border border-white/[0.06] p-8 text-center">
              <Clock className="w-6 h-6 text-white/10 mx-auto mb-2" />
              <p className="text-[13px] text-white/25">No factoring requests yet</p>
              <p className="text-[11px] text-white/15 mt-1">
                Factor an invoice above to get started
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Fee notice */}
      <div className="mt-6 p-4 rounded-xl border border-[rgba(212,168,67,0.08)] bg-[rgba(212,168,67,0.02)]">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-[#D4A843] shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-medium text-white/60 mb-1">
              Factoring Service Fee: 1-2% of invoice value
            </p>
            <p className="text-[12px] text-white/30 leading-relaxed">
              Deducted by the factoring partner at disbursement. No hidden fees.
              You receive the remaining amount directly in your bank account within
              24-48 hours of approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FactoringStatusPill({ status }: { status: string }) {
  const s = status?.toUpperCase();
  const config: Record<string, { color: string; icon: React.ElementType }> = {
    PAID: { color: "text-[#D4A843] bg-[rgba(212,168,67,0.1)] border-[rgba(212,168,67,0.2)]", icon: CheckCircle2 },
    ACCEPTED: { color: "text-blue-400 bg-blue-400/10 border-blue-400/20", icon: CheckCircle2 },
    AVAILABLE: { color: "text-amber-400 bg-amber-400/10 border-amber-400/20", icon: Clock },
    OFFERED: { color: "text-amber-400 bg-amber-400/10 border-amber-400/20", icon: Clock },
    NOT_FACTORABLE: { color: "text-white/30 bg-white/[0.04] border-white/[0.08]", icon: AlertCircle },
    LOCKED_BY_MASTER: { color: "text-white/30 bg-white/[0.04] border-white/[0.08]", icon: AlertCircle },
  };

  const c = config[s] || { color: "text-white/40 bg-white/[0.04] border-white/[0.08]", icon: Clock };
  const Icon = c.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border ${c.color}`}
    >
      <Icon className="w-3 h-3" />
      {status || "PENDING"}
    </span>
  );
}
