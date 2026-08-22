
import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";
import MarketplaceClient from "./marketplace-client";

export const metadata: Metadata = {
  alternates: { canonical: canonicalUrl("/marketplace") },
  title: "B2B Hospitality Marketplace Egypt | HotelsVendors",
  description: "Fixed-price hospitality procurement catalog for Egyptian hotels. Suppliers publish stock; hotels order with ETA-compliant invoicing and embedded factoring.",
  keywords: ["B2B hospitality procurement Egypt", "hospitality vendor marketplace", "hotel suppliers Egypt", "F&B wholesale Egypt", "FF&E procurement", "تجهيزات الفنادق بالجملة", "موردي الفنادق مصر"],
  openGraph: {
    title: "B2B Hospitality Marketplace Egypt | HotelsVendors",
    description: "Fixed-price hospitality procurement catalog for Egyptian hotels. ETA-compliant invoicing.",
    type: "website",
  },
};

export default function MarketplacePage() {
  return <MarketplaceClient />;
}
