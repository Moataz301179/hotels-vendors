/**
 * HotelsVendors AI Assistant — Role-Specific Prompt Registry
 * Exports all role prompts for the chatbot system.
 *
 * Usage:
 *   import { getRolePrompt } from "@/components/ai-assistant/prompts";
 *   const prompt = getRolePrompt("hotel");
 */

import { BASE_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { HOTEL_SYSTEM_PROMPT } from "./hotel-prompt";
import { SUPPLIER_SYSTEM_PROMPT } from "./supplier-prompt";
import { FACTORING_SYSTEM_PROMPT } from "./factoring-prompt";
import { SHIPPING_SYSTEM_PROMPT } from "./shipping-prompt";
import { ADMIN_SYSTEM_PROMPT } from "./admin-prompt";

export type AssistantRole = "hotel" | "supplier" | "factoring" | "shipping" | "admin" | "marketing";

const ROLE_PROMPTS: Record<AssistantRole, string> = {
  hotel: HOTEL_SYSTEM_PROMPT,
  supplier: SUPPLIER_SYSTEM_PROMPT,
  factoring: FACTORING_SYSTEM_PROMPT,
  shipping: SHIPPING_SYSTEM_PROMPT,
  admin: ADMIN_SYSTEM_PROMPT,
  marketing: ADMIN_SYSTEM_PROMPT, // Marketing users get admin-level ops insight
};

/**
 * Build the complete system prompt for a given role.
 * Combines the base identity with role-specific guidance.
 */
export function buildSystemPrompt(role: AssistantRole, context?: string): string {
  const rolePrompt = ROLE_PROMPTS[role] || ROLE_PROMPTS.hotel;
  const parts = [BASE_SYSTEM_PROMPT, "---", rolePrompt];
  if (context) {
    parts.push("---", "LIVE CONTEXT:", context);
  }
  return parts.join("\n\n");
}

export {
  BASE_SYSTEM_PROMPT,
  HOTEL_SYSTEM_PROMPT,
  SUPPLIER_SYSTEM_PROMPT,
  FACTORING_SYSTEM_PROMPT,
  SHIPPING_SYSTEM_PROMPT,
  ADMIN_SYSTEM_PROMPT,
};
