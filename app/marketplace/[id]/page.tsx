import type { Metadata } from "next";
import ProductDetailClient from "@/components/marketplace/product-detail-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Product ${id}`,
    description: "View product details, specifications, and supplier information on Hotels Vendors marketplace.",
  };
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ProductDetailClient />;
}
