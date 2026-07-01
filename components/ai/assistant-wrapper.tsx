"use client";

import { AIAssistantProvider } from "@/components/ai/assistant-context";
import { AIAssistant } from "@/components/ai/ai-assistant";
import type { ReactNode } from "react";

export function AIAssistantWrapper({ children }: { children: ReactNode }) {
  return (
    <AIAssistantProvider>
      {children}
      <AIAssistant />
    </AIAssistantProvider>
  );
}
