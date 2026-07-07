import { requireUser } from "@/lib/session";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Topbar } from "@/components/app/topbar";
import { Badge } from "@/components/ui";
import { egp, shortDate } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight, Wallet as WalletIcon, CreditCard } from "lucide-react";

export const dynamic = "force-dynamic";

const gateways = [
  { name: "Paymob", color: "text-[var(--info)]" },
  { name: "Fawry", color: "text-[var(--warning)]" },
  { name: "InstaPay", color: "text-[var(--brand)]" },
  { name: "Bank transfer", color: "text-muted" },
];

const inflow = ["payout", "disbursement", "repayment"];

export default async function WalletPage() {
  const user = await requireUser();
  const tx = await db
    .select()
    .from(transactions)
    .where(eq(transactions.orgId, user.orgId!))
    .orderBy(desc(transactions.createdAt))
    .limit(30);

  return (
    <>
      <Topbar name={user.name} org={user.orgName ?? ""} orgType={user.orgType ?? "hotel"} title="Wallet" />
      <main className="mx-auto w-full max-w-5xl flex-1 p-5 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Balance card */}
          <div className="card relative overflow-hidden p-6 lg:col-span-1">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--brand)_30%,transparent),transparent)]" />
            <div className="relative">
              <div className="flex items-center gap-2 text-sm text-muted">
                <WalletIcon className="h-4 w-4" /> Available balance
              </div>
              <div className="mt-3 text-3xl font-semibold tracking-tight">{egp(user.walletBalance ?? 0, { decimals: true })}</div>
              <div className="mt-6 space-y-2">
                <div className="text-xs font-medium uppercase tracking-wide text-muted">Connected rails</div>
                {gateways.map((g) => (
                  <div key={g.name} className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm">
                    <span className={`flex items-center gap-2 ${g.color}`}><CreditCard className="h-4 w-4" /> {g.name}</span>
                    <Badge tone="success">connected</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="card overflow-hidden lg:col-span-2">
            <div className="border-b border-border p-5">
              <h2 className="font-semibold">Transactions</h2>
              <p className="text-sm text-muted">Settlement ledger across all rails</p>
            </div>
            <div className="divide-y divide-border">
              {tx.length === 0 && <p className="p-5 text-sm text-muted">No transactions yet.</p>}
              {tx.map((t) => {
                const isIn = inflow.includes(t.kind);
                const note = (t.meta as { note?: string })?.note;
                return (
                  <div key={t.id} className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-3">
                      <span className={`grid h-10 w-10 place-items-center rounded-lg ${isIn ? "bg-[color-mix(in_srgb,var(--success)_15%,transparent)] text-[var(--success)]" : "bg-surface-2 text-muted"}`}>
                        {isIn ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                      </span>
                      <div>
                        <div className="text-sm font-medium capitalize">{t.kind.replace("_", " ")}</div>
                        <div className="text-xs text-muted">{note || t.reference} · {shortDate(t.createdAt)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${isIn ? "text-[var(--success)]" : ""}`}>
                        {isIn ? "+" : "−"}{egp(t.amount, { compact: true })}
                      </div>
                      <div className="text-xs uppercase text-muted-2">{t.gateway}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
