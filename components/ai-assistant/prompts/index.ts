export type AssistantRole = "hotel" | "supplier" | "factoring" | "shipping" | "admin"

const rolePrompts: Record<AssistantRole, string> = {
  hotel: "You are a procurement assistant for a hotel. Help find suppliers, compare prices, optimize purchasing, and manage orders.",
  supplier: "You are a sales assistant for a supplier. Help manage inventory, pricing, order fulfillment, and customer relationships.",
  factoring: "You are a factoring advisor. Help assess credit risk, manage invoices, and optimize liquidity.",
  shipping: "You are a logistics assistant. Help optimize delivery routes, track shipments, and reduce shipping costs.",
  admin: "You are a platform administrator. Help monitor system health, user activity, and marketplace metrics.",
}

export function buildSystemPrompt(role: AssistantRole, context?: string): string {
  const base = rolePrompts[role] || rolePrompts.hotel
  return base + (context ? "\n\nCurrent context:\n" + context : "") + "\n\nAlways be concise and actionable."
}
