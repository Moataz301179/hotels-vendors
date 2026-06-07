import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "INVO — Infrastructure for Hospitality Commerce",
  description:
    "The API and logistics layer powering Egypt's hospitality supply chain. Connect inventory, routes, payments, and compliance once. Reach every hotel.",
};

export default function InvoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      {children}
    </div>
  );
}
