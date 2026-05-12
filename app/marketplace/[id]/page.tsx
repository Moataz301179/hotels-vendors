import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/marketplace/product-detail-client";
import catalogData from "@/data/catalog-products.json";

const ALL_PRODUCTS = (catalogData as { products: any[] }).products;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = ALL_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  return {
    title: `${product.name} — ${product.supplierName}`,
    description: `${product.description} Available on Hotels Vendors marketplace. ${product.unitPrice} EGP per ${product.unitOfMeasure}.`,
    openGraph: {
      title: `${product.name} — Hotels Vendors Marketplace`,
      description: product.description,
      images: ["/hotelsvendors-logo.png"],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = ALL_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient productId={id} />;
}
