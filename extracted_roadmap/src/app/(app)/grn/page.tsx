import { requireUser } from "@/lib/session";
import { db } from "@/db";
import { orders, organizations } from "@/db/schema";
import { alias } from "drizzle-orm/pg-core";
import { eq, or, desc } from "drizzle-orm";
import { Topbar } from "@/components/app/topbar";
import { GRNClient, type OrderGRNRow } from "@/components/app/grn-client";
import { Badge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function GRNPage() {
  const user = await requireUser();
  const supplierOrg = alias(organizations, "supplier_org");
  const rows = await db
    .select({
      id: orders.id,
      reference: orders.reference,
      status: orders.status,
      total: orders.total,
      items: orders.items,
      createdAt: orders.createdAt,
      supplierName: supplierOrg.name,
      grnStatus: orders.grnStatus,
      grnVarianceBps: orders.grnVarianceBps,
      grnNotes: orders.grnNotes,
      grnPhotoUrl: orders.grnPhotoUrl,
    })
    .from(orders)
    .leftJoin(supplierOrg, eq(orders.supplierId, supplierOrg.id))
    .where(or(eq(orders.hotelId, user.orgId!), eq(orders.supplierId, user.orgId!)))
    .orderBy(desc(orders.createdAt));

  const list: OrderGRNRow[] = rows.map((r) => ({
    ...r,
    supplierName: r.supplierName ?? "Supplier",
  }));

  return (
    <>
      <Topbar name={user.name} org={user.orgName ?? ""} orgType={user.orgType ?? "hotel"} title="Receiving &amp; GRN Desk" />
      <main className="mx-auto w-full max-w-6xl flex-1 p-5 lg:p-8 space-y-6">
        {/* Investor Hook Banner */}
        <div className="rounded-3xl border border-border bg-bg-1 p-6 relative overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[radial-gradient(closest-side,var(--lime-glow),transparent)]" />
          <div className="relative">
            <Badge tone="gold" className="mb-2">Real-time Quality Verification</Badge>
            <h2 className="text-2xl font-semibold text-fg tracking-tight">Receiving &amp; Photographic GRN Desk</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-fg-3">
              Unloading docks must be verified before payment trigger. HotelsVendors offers an interactive dock inspector where receiving managers log counts, track variances, capture evidence, and lock down physical verification parameters.
            </p>
          </div>
        </div>

        <GRNClient initialRows={list} />
      </main>
    </>
  );
}
