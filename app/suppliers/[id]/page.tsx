import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SupplierDetailClient } from "@/components/marketplace/supplier-detail-client";
import marketData from "@/data/egyptian-market-real.json";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supplier = marketData.suppliers.find((s) => s.id === id);

  if (!supplier) {
    return {
      title: "Supplier Not Found — Hotels Vendors",
    };
  }

  return {
    title: `${supplier.name} — Verified Supplier Profile`,
    description: `${supplier.name} is a verified Egyptian hospitality supplier based in ${supplier.city}. ${supplier.years_established}+ years in business. Browse their product catalog and contact them directly.`,
  };
}

export async function generateStaticParams() {
  return marketData.suppliers.map((supplier) => ({
    id: supplier.id,
  }));
}

export default async function SupplierDetailPage({ params }: Props) {
  const { id } = await params;
  const supplier = marketData.suppliers.find((s) => s.id === id);

  if (!supplier) {
    notFound();
  }

  // Get supplier's products
  const products = marketData.product_catalog.filter(
    (p) => p.supplier_id === id
  );

  return (
    <SupplierDetailClient
      supplier={supplier}
      products={products}
      allSuppliers={marketData.suppliers}
    />
  );
}
