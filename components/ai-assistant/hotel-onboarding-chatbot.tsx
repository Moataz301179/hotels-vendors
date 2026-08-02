"use client";

import { Hotel } from "lucide-react";
import { BaseOnboardingBot } from "./base-onboarding-chatbot";

const config = {
  icon: Hotel,
  accentVar: "--accent-base" as const,
  title: "Onboarding Agent",
  subtitle: "Hotel Procurement",
  tooltip: "Talk to Hotel Onboarding Agent",
  initialMessage:
    "Hi! I'm the HotelsVendors AI assistant for hotels. Ask me anything about procurement, supplier discovery, credit terms, ETA compliance, or platform onboarding.",
};

export function HotelOnboardingBot() {
  return <BaseOnboardingBot config={config} />;
}
