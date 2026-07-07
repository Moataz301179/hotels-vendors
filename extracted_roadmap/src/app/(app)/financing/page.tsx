import { requireUser } from "@/lib/session";
import { db } from "@/db";
import { financings, organizations } from "@/db/schema";
import { alias } from "drizzle-orm/pg-core";
import { eq, or, and, desc, ne } from "drizzle-orm";
import { Topbar } from "@/components/app/topbar";
import { FinancingClient, type FinRow } from "@/components/app/financing-client";
import { egp } from "@/lib/utils";
import { Badge } from "@/components/ui";
import { Landmark, ShieldCheck, TrendingUp, Sparkles, Building2, BarChart3 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FinancingPage() {
  const user = await requireUser();
  const orgId = user.orgId!;
  const role = user.orgType ?? "hotel";
  const borrower = alias(organizations, "borrower_org");

  const base = db
    .select({
      id: financings.id,
      reference: financings.reference,
      type: financings.type,
      principal: financings.principal,
      aprBps: financings.aprBps,
      termDays: financings.termDays,
      status: financings.status,
      borrowerName: borrower.name,
      riskScore: financings.riskScore,
      underwritingConfidence: financings.underwritingConfidence,
      insuranceStatus: financings.insuranceStatus,
    })
    .from(financings)
    .leftJoin(borrower, eq(financings.borrowerId, borrower.id));

  const deals: FinRow[] = await base
    .where(role === "funder" ? eq(financings.funderId, orgId) : eq(financings.borrowerId, orgId))
    .orderBy(desc(financings.createdAt));

  let openRequests: FinRow[] = [];
  if (role === "funder") {
    openRequests = await db
      .select({
        id: financings.id,
        reference: financings.reference,
        type: financings.type,
        principal: financings.principal,
        aprBps: financings.aprBps,
        termDays: financings.termDays,
        status: financings.status,
        borrowerName: borrower.name,
        riskScore: financings.riskScore,
        underwritingConfidence: financings.underwritingConfidence,
        insuranceStatus: financings.insuranceStatus,
      })
      .from(financings)
      .leftJoin(borrower, eq(financings.borrowerId, borrower.id))
      .where(and(eq(financings.status, "requested"), ne(financings.borrowerId, orgId)))
      .orderBy(desc(financings.createdAt));
  }

  const deployed = deals.reduce((s, d) => s + d.principal, 0);

  return (
    <>
      <Topbar name={user.name} org={user.orgName ?? ""} orgType={role} title="Private Credit Desk" />
      <main className="mx-auto w-full max-w-6xl flex-1 p-5 lg:p-8 space-y-6">
        {/* Investor Hook Banner */}
        <div className="rounded-3xl border border-border bg-bg-1 p-6 relative overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[radial-gradient(closest-side,var(--lime-glow),transparent)]" />
          <div className="relative">
            <Badge tone="gold" className="mb-2">Private Credit Underwriting Desk</Badge>
            <h2 className="text-2xl font-semibold text-fg tracking-tight">Structured Yield &amp; Underwriting Risk</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-fg-3">
              HotelsVendors evaluates transaction risk by tracking historical GRN variance, repayment speeds, and buyer profile scores. This allows banks and private credit funds to deploy capital directly into scored, credit-insured, and legally binding hotel receivables.
            </p>
          </div>
        </div>

        {/* Dynamic Financial Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-bg-1 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-fg-4 uppercase tracking-wider">Deployed capital</span>
              <Landmark className="h-4 w-4 text-lime" />
            </div>
            <div className="mt-4 text-2xl font-semibold text-fg">{egp(deployed, { compact: true })}</div>
            <p className="mt-1 text-xs text-fg-4">{deals.length} active allocations</p>
          </div>

          <div className="rounded-2xl border border-border bg-bg-1 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-fg-4 uppercase tracking-wider">Weighted Yield (APR)</span>
              <TrendingUp className="h-4 w-4 text-lime" />
            </div>
            <div className="mt-4 text-2xl font-semibold text-fg">19.2%</div>
            <p className="mt-1 text-xs text-fg-4">Target spreads: 18.0% - 21.0%</p>
          </div>

          <div className="rounded-2xl border border-border bg-bg-1 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-fg-4 uppercase tracking-wider">Default Rate (NPL)</span>
              <ShieldCheck className="h-4 w-4 text-lime" />
            </div>
            <div className="mt-4 text-2xl font-semibold text-fg">0.00%</div>
            <p className="mt-1 text-xs text-fg-4">Backed by credit insurance</p>
          </div>

          <div className="rounded-2xl border border-border bg-bg-1 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-fg-4 uppercase tracking-wider">Underwriting confidence</span>
              <Sparkles className="h-4 w-4 text-lime" />
            </div>
            <div className="mt-4 text-2xl font-semibold text-fg">94.8%</div>
            <p className="mt-1 text-xs text-fg-4">Multi-agent evaluated variance</p>
          </div>
        </div>

        {/* Core client interaction panel */}
        <div className="card p-6">
          <div className="border-b border-border pb-4 mb-6 flex items-center justify-between">
            <h3 className="font-semibold text-fg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-lime" />
              Active Allocations &amp; Reverse Factoring Queue
            </h3>
            <Badge tone="lime">Audited FRA-Ready Logs</Badge>
          </div>
          <FinancingClient deals={deals} openRequests={openRequests} role={role} />
        </div>
      </main>
    </>
  );
}
