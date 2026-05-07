import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotels Vendors — Digital Procurement Hub for Egyptian Hospitality",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {children}
    </div>
  );
}
