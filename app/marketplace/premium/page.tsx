import { Metadata } from "next";
import { PremiumMarketplaceClient } from "@/components/marketplace/premium-marketplace-client";
import marketData from "@/data/egyptian-market-real.json";

export const metadata: Metadata = {
  title: "Premium Marketplace | Hotels Vendors - Egyptian Hospitality Suppliers",
  description: "Sourced from verified Egyptian suppliers. Real wholesale prices in EGP for hotels, resorts, and restaurants across Egypt. 14+ verified suppliers, 72+ wholesale products.",
  keywords: [
    "Egypt hospitality suppliers",
    "hotel supplies Egypt",
    "restaurant equipment Egypt",
    "wholesale prices EGP",
    "verified suppliers",
    "Cairo suppliers",
    "Giza suppliers",
    "hotel amenities",
    "kitchen equipment",
    "cleaning supplies",
  ],
};

export default function PremiumMarketplacePage() {
  return (
    <main className="min-h-screen bg-black">
      <PremiumMarketplaceClient marketData={marketData} />
    </main>
  );
}
