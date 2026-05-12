import type { Metadata } from "next";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";

export const metadata: Metadata = {
  title: "Marketplace — Verified Suppliers for Egyptian Hospitality",
  description:
    "Browse verified hotel suppliers across Egypt. Food & Beverage, Housekeeping, Linens, Engineering, Amenities, and more. Fixed pricing. ETA e-invoicing compliant.",
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  );
}
