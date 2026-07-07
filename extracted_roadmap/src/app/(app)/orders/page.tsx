import { requireUser } from "@/lib/session";
import { db } from "@/db";
import { orders, organizations } from "@/db/schema";
import { alias } from "drizzle-orm/pg-core";
import { or as dor, eq as deq, desc as ddesc } from "drizzle-orm";
import { Topbar } from "@/components/app/topbar";
import { StatusPill } from "@/components/ui";
import { egp, shortDate } from "@/lib/utils";
import { Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const user = await requireUser();
  const orgId = user.orgId!;
  const hotelOrg = alias(organizations, "hotel_org");
  const supplierOrg = alias(organizations, "supplier_org");

  const rows = await db
    .select({
      id: orders.id,
      reference: orders.reference,
      status: orders.status,
      subtotal: orders.subtotal,
      total: orders.total,
      paymentTermDays: orders.paymentTermDays,
      items: orders.items,
      createdAt: orders.createdAt,
      hotelName: hotelOrg.name,
      supplierName: supplierOrg.name,
    })
    .from(orders)
    .leftJoin(hotelOrg, deq(orders.hotelId, hotelOrg.id))
    .leftJoin(supplierOrg, deq(orders.supplierId, supplierOrg.id))
    .where(dor(deq(orders.hotelId, orgId), deq(orders.supplierId, orgId), deq(orders.carrierId, orgId)))
    .orderBy(ddesc(orders.createdAt));

  const isSupplier = user.orgType === "supplier";

  return (
    <>
      <Topbar name={user.name} org={user.orgName ?? ""} orgType={user.orgType ?? "hotel"} title="Orders" />
      <main className="mx-auto w-full max-w-6xl flex-1 p-5 lg:p-8">
        {rows.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-20 text-center">
            <Package className="h-12 w-12 text-muted-2" />
            <h2 className="mt-4 font-semibold">No orders yet</h2>
            <p className="mt-1 text-sm text-muted">Orders you place or receive will appear here.</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="hidden grid-cols-12 gap-4 border-b border-border px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted lg:grid">
              <div className="col-span-2">Reference</div>
              <div className="col-span-4">Items</div>
              <div className="col-span-2">{isSupplier ? "Buyer" : "Supplier"}</div>
              <div className="col-span-1">Terms</div>
              <div className="col-span-1 text-right">Total</div>
              <div className="col-span-2 text-right">Status</div>
            </div>
            <div className="divide-y divide-border">
              {rows.map((o) => {
                const items = (o.items ?? []) as { name: string; qty: number }[];
                return (
                  <div key={o.id} className="grid grid-cols-1 gap-2 px-6 py-4 lg:grid-cols-12 lg:items-center lg:gap-4">
                    <div className="col-span-2">
                      <div className="font-medium">{o.reference}</div>
                      <div className="text-xs text-muted">{shortDate(o.createdAt)}</div>
                    </div>
                    <div className="col-span-4 text-sm text-muted">
                      {items.map((it) => `${it.qty}× ${it.name}`).join(", ") || "—"}
                    </div>
                    <div className="col-span-2 text-sm">{isSupplier ? o.hotelName : o.supplierName}</div>
                    <div className="col-span-1 text-sm text-muted">
                      {o.paymentTermDays ? `Net-${o.paymentTermDays}` : "Instant"}
                    </div>
                    <div className="col-span-1 text-right text-sm font-medium">{egp(o.total, { compact: true })}</div>
                    <div className="col-span-2 flex lg:justify-end">
                      <StatusPill status={o.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
