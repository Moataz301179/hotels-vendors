import type { Metadata } from "next";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { SuppliersDirectory } from "@/components/marketing/suppliers-directory";

export const metadata: Metadata = {
  title: "Verified Suppliers — Hotels Vendors Marketplace",
  description:
    "Browse 68+ verified Egyptian suppliers across food & beverage, housekeeping, linens, engineering, and technology. Industrial clusters in 6th of October, 10th of Ramadan, and Damietta.",
};

export default function SuppliersPage() {
  return (
    <main className="min-h-screen bg-white">
      <MarketingNav />
      <div className="pt-[88px]">
        <SuppliersDirectory />
      </div>
      <MarketingFooter />
    </main>
  );
}
