import { requireUser } from "@/lib/session";
import { db } from "@/db";
import { products, organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Topbar } from "@/components/app/topbar";
import { MarketplaceClient, type MarketProduct } from "@/components/app/marketplace-client";
import { Badge } from "@/components/ui";
import { egp } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MarketplacePage() {
  const user = await requireUser();

  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      category: products.category,
      image: products.image,
      unit: products.unit,
      price: products.price,
      moq: products.moq,
      leadTimeDays: products.leadTimeDays,
      rating: products.rating,
      supplierName: organizations.name,
      supplierCity: organizations.city,
      deal: products.deal,
    })
    .from(products)
    .leftJoin(organizations, eq(products.supplierId, organizations.id));

  const list: MarketProduct[] = rows.map((r) => ({
    ...r,
    supplierName: r.supplierName ?? "Supplier",
    deal: r.deal ?? false,
  }));

  const creditAvailable = (user.creditLimit ?? 0) - (user.creditUsed ?? 0);

  return (
    <>
      <Topbar name={user.name} org={user.orgName ?? ""} orgType={user.orgType ?? "hotel"} title="Marketplace Desk" />
      <main className="mx-auto w-full max-w-6xl flex-1 p-5 lg:p-8">
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <Badge tone="gold">Live procurement market</Badge>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-fg">Source, checkout, finance, track and receive — from one desk.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-3">
              Contract-priced hospitality SKUs with market index movements, supplier reliability, payment-term selection and reverse factoring at checkout.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-bg-1 px-4 py-3 text-sm text-fg-3">
            Available credit: <span className="font-semibold text-lime">{egp(creditAvailable, { compact: true })}</span>
          </div>
        </div>
        <MarketplaceClient products={list} canBuy={user.orgType === "hotel"} creditAvailable={creditAvailable} walletBalance={user.walletBalance ?? 0} />
      </main>
    </>
  );
}
