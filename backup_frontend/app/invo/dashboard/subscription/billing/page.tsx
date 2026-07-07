import { ArrowRight, Receipt, Check } from "lucide-react";
import Link from "next/link";

const BILLING_HISTORY = [
  {
    id: "inv_005",
    date: "2026-06-01",
    description: "Growth Plan — Monthly Subscription",
    amount: 1500,
    status: "Paid",
  },
  {
    id: "inv_004",
    date: "2026-05-01",
    description: "Growth Plan — Monthly Subscription",
    amount: 1500,
    status: "Paid",
  },
  {
    id: "inv_003",
    date: "2026-04-01",
    description: "Starter Plan — Monthly Subscription",
    amount: 500,
    status: "Paid",
  },
  {
    id: "inv_002",
    date: "2026-03-01",
    description: "Starter Plan — Monthly Subscription",
    amount: 500,
    status: "Paid",
  },
  {
    id: "inv_001",
    date: "2026-02-01",
    description: "Starter Plan — Monthly Subscription",
    amount: 500,
    status: "Paid",
  },
];

export default function BillingHistoryPage() {
  const totalSpent = BILLING_HISTORY.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Back link */}
      <Link
        href="/invo/dashboard/subscription"
        className="inline-flex items-center gap-1.5 text-[13px] text-white/30 hover:text-[#D4A843] transition-colors mb-6"
      >
        <ArrowRight size={13} className="rotate-180" />
        Back to Subscription
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[24px] font-medium text-white tracking-tight">
          Billing History
        </h1>
        <p className="mt-1 text-[14px] text-white/40">
          Your INVO subscription invoices.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <p className="text-[12px] text-white/30 mb-1">Total Spent</p>
          <p className="text-[20px] font-medium text-white tracking-tight">
            EGP {totalSpent.toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <p className="text-[12px] text-white/30 mb-1">Invoices</p>
          <p className="text-[20px] font-medium text-white tracking-tight">
            {BILLING_HISTORY.length}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <p className="text-[12px] text-white/30 mb-1">Payment Method</p>
          <p className="text-[14px] font-medium text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#D4A843]" />
            Auto-debit
          </p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-xl border border-white/[0.06] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                Date
              </th>
              <th className="text-left text-[11px] font-medium text-white/25 uppercase tracking-wider px-4 py-3">
                Description
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
            {BILLING_HISTORY.map((inv) => (
              <tr
                key={inv.id}
                className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-4 py-3 text-[13px] text-white/50">
                  {new Date(inv.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-[13px] text-white/60">
                  {inv.description}
                </td>
                <td className="px-4 py-3 text-[13px] text-white/60">
                  EGP {inv.amount.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border text-emerald-400 bg-emerald-400/10 border-emerald-400/20">
                    <Check className="w-3 h-3" />
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Zero commission note */}
      <div className="mt-6 p-4 rounded-xl border border-[rgba(212,168,67,0.10)] bg-[rgba(212,168,67,0.03)]">
        <p className="text-[13px] text-white/40 leading-relaxed">
          <span className="text-[#D4A843] font-medium">No commission on sales.</span>{" "}
          You pay a flat monthly subscription to be listed. Factoring service fees
          (1-2%) are only charged when you choose to factor an invoice.
        </p>
      </div>
    </div>
  );
}
