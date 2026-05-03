import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketing — Hotels Vendors",
  description: "Discover how Hotels Vendors is transforming B2B hospitality procurement in Egypt.",
};

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {children}
    </div>
  );
}
