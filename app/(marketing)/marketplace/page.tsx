import type { Metadata } from "next";
import MarketplaceClient from "./marketplace-client";

export const metadata: Metadata = {
  title: "B2B Hospitality Marketplace Egypt | 680+ Verified Hotel Suppliers | HotelsVendors",
  description: "Egypt's largest B2B hospitality marketplace. 680+ verified suppliers across F&B, consumables, FF&E, guest supplies, and services. Fixed-price catalogs with ETA-compliant invoicing.",
  keywords: ["B2B hospitality procurement Egypt", "hospitality vendor marketplace", "hotel suppliers Egypt", "F&B wholesale Egypt", "FF&E procurement", "تجهيزات الفنادق بالجملة", "موردي الفنادق مصر"],
  openGraph: {
    title: "B2B Hospitality Marketplace Egypt | 680+ Verified Hotel Suppliers | HotelsVendors",
    description: "Egypt's largest B2B hospitality marketplace. 680+ verified suppliers across F&B, consumables, FF&E, guest supplies, and services.",
    type: "website",
  },
};

export default function MarketplacePage() {
  return <MarketplaceClient />;
}
