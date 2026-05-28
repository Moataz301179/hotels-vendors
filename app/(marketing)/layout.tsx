import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PublicChatbot } from "@/components/ai-assistant/public-chatbot";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "HotelsVendors — AI-Powered Procurement for Egyptian Hospitality | ETA Compliant",
  description:
    "HotelsVendors replaces WhatsApp orders with AI-powered procurement workflows, automated ETA e-invoicing, and embedded supplier financing. Stop losing EGP 3M/year to procurement leakage. 14-day free trial.",
  keywords: [
    "hotel procurement Egypt",
    "ETA e-invoicing",
    "B2B procurement platform",
    "hotel supply chain",
    "Egyptian hospitality procurement",
    "supplier financing Egypt",
    "AI procurement",
    "pre-spend control",
    "hotel purchasing",
    "Red Sea hotels",
  ],
  openGraph: {
    title: "HotelsVendors — AI-Powered Procurement for Egyptian Hospitality",
    description:
      "Stop losing EGP 3M/year to procurement leakage. AI-powered pre-spend control, ETA compliance, and embedded financing for Egyptian hotels.",
    type: "website",
    locale: "en_EG",
    siteName: "HotelsVendors",
  },
  twitter: {
    card: "summary_large_image",
    title: "HotelsVendors — AI-Powered Procurement for Egyptian Hospitality",
    description:
      "Stop losing EGP 3M/year to procurement leakage. AI-powered pre-spend control, ETA compliance, and embedded financing for Egyptian hotels.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.variable}>
      {children}
      <PublicChatbot />
    </div>
  );
}