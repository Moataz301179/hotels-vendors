import { requireUser } from "@/lib/session";
import { db } from "@/db";
import { guarantees, organizations } from "@/db/schema";
import { alias } from "drizzle-orm/pg-core";
import { eq, or, desc } from "drizzle-orm";
import { Topbar } from "@/components/app/topbar";
import { GuaranteesClient, type GuaranteeRow } from "@/components/app/guarantees-client";
import { Badge } from "@/components/ui";
import { ShieldCheck, Scale, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function GuaranteesPage() {
  const user = await requireUser();
  const orgId = user.orgId!;
  const role = user.orgType ?? "hotel";

  const hotelOrg = alias(organizations, "g_hotel");
  const supplierOrg = alias(organizations, "g_supplier");
  const funderOrg = alias(organizations, "g_funder");

  const rows = await db
    .select({
      id: guarantees.id,
      reference: guarantees.reference,
      instrument: guarantees.instrument,
      faceValue: guarantees.faceValue,
      supplierDiscountBps: guarantees.supplierDiscountBps,
      hotelFeeBps: guarantees.hotelFeeBps,
      funderSpreadBps: guarantees.funderSpreadBps,
      platformMarginBps: guarantees.platformMarginBps,
      termDays: guarantees.termDays,
      status: guarantees.status,
      complianceScore: guarantees.complianceScore,
      hotelName: hotelOrg.name,
      supplierName: supplierOrg.name,
      funderName: funderOrg.name,
    })
    .from(guarantees)
    .leftJoin(hotelOrg, eq(guarantees.hotelId, hotelOrg.id))
    .leftJoin(supplierOrg, eq(guarantees.supplierId, supplierOrg.id))
    .leftJoin(funderOrg, eq(guarantees.funderId, funderOrg.id))
    .where(or(eq(guarantees.hotelId, orgId), eq(guarantees.supplierId, orgId), eq(guarantees.funderId, orgId)))
    .orderBy(desc(guarantees.createdAt));

  return (
    <>
      <Topbar name={user.name} org={user.orgName ?? ""} orgType={role} title="Payment Guarantees" />
      <main className="mx-auto w-full max-w-6xl flex-1 p-5 lg:p-8 space-y-6">
        {/* Legal posture banner */}
        <div className="rounded-3xl border border-gold/25 bg-bg-1 p-6 relative overflow-hidden">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/8 blur-3xl" />
          <div className="relative">
            <Badge tone="gold" className="mb-2">HV Capital · Assurance layer</Badge>
            <h2 className="text-2xl font-semibold tracking-tight">Payment Guarantee Orders (PGO)</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-fg-3">
              The digital equivalent of a bank LG/LC — but issued by a <strong className="text-fg">licensed funder</strong>, not by HotelsVendors.
              A supplier ships the moment a PGO is issued because payment is guaranteed on GRN confirmation.
              HotelsVendors is the <strong className="text-fg">compliance reviewer, evidence custodian and assurance provider</strong> — never the lender.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, t: "HotelsVendors", d: "Reviews KYC, PO, tax & GRN evidence. Scores & orchestrates. Takes assurance margin." },
                { icon: Building2, t: "Funder (bank / factor)", d: "Issues the guarantee, deploys capital, earns the yield spread. Regulated entity." },
                { icon: Scale, t: "Why it's compliant", d: "We provide SaaS + assurance, not credit. No balance-sheet lending, no banking license needed." },
              ].map((x) => (
                <div key={x.t} className="rounded-2xl border border-border bg-bg p-4">
                  <x.icon className="h-4 w-4 text-lime" />
                  <p className="mt-2 text-sm font-medium">{x.t}</p>
                  <p className="mt-1 text-xs leading-relaxed text-fg-3">{x.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <GuaranteesClient rows={rows as GuaranteeRow[]} role={role} />
      </main>
    </>
  );
}
