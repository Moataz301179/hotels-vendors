import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/theme-provider";

export const metadata: Metadata = {
  title: "HotelsVendors — B2B Procurement for Egyptian Hospitality",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
