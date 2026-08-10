"use client";

import { MessageCircle } from "lucide-react";
import { BaseOnboardingBot } from "./base-onboarding-chatbot";

const config = {
  icon: MessageCircle,
  accentVar: "--success" as const,
  title: "Onboarding Agent",
  subtitle: "Supplier Onboarding",
  tooltip: "Talk to Supplier Onboarding Agent",
  initialMessage:
    "Hi! I'm the HotelsVendors AI assistant. Ask me anything about the platform, hotel procurement, supplier registration, financing, logistics, or compliance.",
};

export function SupplierOnboardingBot() {
  return <BaseOnboardingBot config={config} />;
}
