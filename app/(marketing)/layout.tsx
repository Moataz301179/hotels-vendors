import type { Metadata } from "next";
import { PublicChatbot } from "@/components/ai-assistant/public-chatbot";

export const metadata: Metadata = {
  title: "Hotels Vendors — Digital Procurement Hub for Egyptian Hospitality",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <PublicChatbot />
    </>
  );
}
