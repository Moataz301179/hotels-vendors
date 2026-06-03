import type { Metadata } from "next";
import MarketplaceClient from "@/components/marketplace/marketplace-client";

export const metadata: Metadata = {
  title: "Marketplace — Verified Suppliers for Egyptian Hospitality",
  description:
    "Browse 10 categories of verified hotel suppliers. Food & Beverage, Housekeeping, Linens, Engineering, Amenities, and more. Fixed pricing. ETA e-invoicing compliant.",
  openGraph: {
    title: "Hotels Vendors Marketplace",
    description: "B2B procurement marketplace for Egyptian hotels. 1,200+ verified suppliers.",
    images: ["/hotelsvendors-logo.png"],
  },
};

export default function MarketplacePage() {
  return <MarketplaceClient />;
}
