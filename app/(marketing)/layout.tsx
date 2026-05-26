import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PublicChatbot } from "@/components/ai-assistant/public-chatbot";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Hotels Vendors — Digital Procurement Hub for Egyptian Hospitality",
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
