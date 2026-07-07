import { requireUser } from "@/lib/session";
import { db } from "@/db";
import { orders, organizations } from "@/db/schema";
import { alias } from "drizzle-orm/pg-core";
import { eq, or, desc } from "drizzle-orm";
import { Topbar } from "@/components/app/topbar";
import { StatusPill, Badge } from "@/components/ui";
import { egp, shortDate } from "@/lib/utils";
import { CheckCircle2, Circle, Truck, ClipboardCheck, ReceiptText, Wallet } from "lucide-react";

export const dynamic = "force-dynamic";

const steps = [
  { key: "confirmed", label: "PO confirmed", icon: CheckCircle2 },
  { key: "in_transit", label: "In transit", icon: Truck },
  { key: "delivered", label: "GRN pending", icon: ClipboardCheck },
  { key: "settled", label: "ETA + settlement", icon: Wallet },
];

function progress(status: string) {
  const map: Record<string, number> = { pending: 0, confirmed: 1, financed: 1, in_transit: 2, delivered: 3, settled: 4 };
  return map[status] ?? 0;
}

export default async function TrackingPage() {
  const user = await requireUser();
  const hotelOrg = alias(organizations, "hotel_org");
  const supplierOrg = alias(organizations, "supplier_org");
  const rows = await db
    .select({ id: orders.id, reference: orders.reference, status: orders.status, total: orders.total, createdAt: orders.createdAt, items: orders.items, hotelName: hotelOrg.name, supplierName: supplierOrg.name })
    .from(orders)
    .leftJoin(hotelOrg, eq(orders.hotelId, hotelOrg.id))
    .leftJoin(supplierOrg, eq(orders.supplierId, supplierOrg.id))
    .where(or(eq(orders.hotelId, user.orgId!), eq(orders.supplierId, user.orgId!), eq(orders.carrierId, user.orgId!)))
    .orderBy(desc(orders.createdAt));

  return (
    <>
      <Topbar name={user.name} org={user.orgName ?? ""} orgType={user.orgType ?? "hotel"} title="Order tracking" />
      <main className="mx-auto w-full max-w-6xl flex-1 p-5 lg:p-8">
        <div className="mb-6 card p-5">
          <h2 className="font-semibold">Status centre</h2>
          <p className="mt-1 text-sm text-muted">Track each order from PO confirmation to delivery, GRN, ETA invoice and settlement release.</p>
        </div>
        <div className="space-y-4">
          {rows.map((o) => {
            const p = progress(o.status);
            const itemCount = ((o.items ?? []) as unknown[]).length;
            return (
              <div key={o.id} className="card p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2"><span className="font-semibold">{o.reference}</span><StatusPill status={o.status} /></div>
                    <div className="mt-1 text-xs text-muted">{o.hotelName} → {o.supplierName} · {itemCount} line item(s) · {shortDate(o.createdAt)}</div>
                  </div>
                  <div className="text-sm font-semibold">{egp(o.total, { compact: true })}</div>
                </div>
                <div className="mt-6 grid gap-3 md:grid-cols-4">
                  {steps.map((s, i) => {
                    const done = p >= i + 1;
                    return (
                      <div key={s.key} className={`rounded-xl border p-4 ${done ? "border-[var(--brand)] bg-[var(--brand-soft)]" : "border-border bg-surface-2"}`}>
                        <div className="flex items-center gap-2 text-sm font-medium">
                          {done ? <s.icon className="h-4 w-4 text-[var(--brand)]" /> : <Circle className="h-4 w-4 text-muted-2" />}
                          {s.label}
                        </div>
                        <p className="mt-2 text-xs text-muted">{done ? "Completed / evidence captured" : "Awaiting operational event"}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge tone="muted"><ReceiptText className="h-3.5 w-3.5" /> ETA UUID pending</Badge>
                  <Badge tone={o.status === "delivered" || o.status === "settled" ? "success" : "warning"}>GRN {o.status === "delivered" || o.status === "settled" ? "ready" : "not ready"}</Badge>
                </div>
              </div>
            );
          })}
          {rows.length === 0 && <div className="card p-8 text-center text-muted">No orders available for tracking.</div>}
        </div>
      </main>
    </>
  );
}
