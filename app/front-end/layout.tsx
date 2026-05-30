import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HotelsVendors — B2B Procurement for Egyptian Hotels",
  description:
    "Egypt's leading B2B procurement platform for hotels. Connect with verified suppliers, AI demand forecasting, and ETA e-invoicing compliance.",
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#050505" }],
  width: "device-width",
  initialScale: 1,
};

export default function FrontEndLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen bg-[#050505] text-white antialiased" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
