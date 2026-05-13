import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/marketplace/product-detail-client";
import { transformToMarketplaceProduct } from "@/lib/marketplace/category-mapper";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id, status: "ACTIVE" },
    include: {
      supplier: {
        select: { id: true, name: true, tier: true, rating: true, reviewCount: true, city: true },
      },
    },
  });

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const mp = transformToMarketplaceProduct(product);

  return {
    title: `${mp.name} — ${mp.supplierName}`,
    description: `${mp.description || ""} Available on Hotels Vendors marketplace. ${mp.unitPrice} EGP per ${mp.unitOfMeasure}.`,
    openGraph: {
      title: `${mp.name} — Hotels Vendors Marketplace`,
      description: mp.description || "",
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

  const product = await prisma.product.findUnique({
    where: { id, status: "ACTIVE" },
    include: {
      supplier: {
        select: {
          id: true,
          name: true,
          tier: true,
          rating: true,
          reviewCount: true,
          city: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const marketplaceProduct = transformToMarketplaceProduct(product);

  return <ProductDetailClient product={marketplaceProduct} />;
}
