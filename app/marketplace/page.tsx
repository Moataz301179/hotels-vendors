import type { Metadata } from "next";
import { PremiumMarketplaceClient } from "@/components/marketplace/premium-marketplace-client";
import marketData from "@/data/egyptian-market-real.json";

export const metadata: Metadata = {
  title: "Premium Marketplace — Verified Egyptian Hotel Suppliers",
  description:
    "Browse 72 verified products from 14 Egyptian hospitality suppliers. Real wholesale prices in EGP. Kitchen equipment, linens, amenities, cleaning supplies, and more.",
  openGraph: {
    title: "Hotels Vendors Premium Marketplace",
    description: "B2B procurement marketplace for Egyptian hotels. Real suppliers, verified prices, contact to negotiate.",
    images: ["/hotelsvendors-logo.png"],
  },
};

export default function MarketplacePage() {
  return <PremiumMarketplaceClient data={marketData} />;
}
