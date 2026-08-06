import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Supplier — INVO",
  description:
    "Join Egypt's largest hospitality supplier network. Reach 450+ hotel buyers, get guaranteed payments, and grow your B2B business with INVO.",
};

export default function BecomeSupplierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
