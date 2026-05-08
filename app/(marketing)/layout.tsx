import type { Metadata } from "next";
import { ChatbotWidget } from "@/components/ai-assistant/chatbot";

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
      <ChatbotWidget mode="marketing" />
    </>
  );
}
