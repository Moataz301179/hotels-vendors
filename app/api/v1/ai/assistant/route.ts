import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, validateBody, success, error } from "@/lib/api-utils";
import { verifyTenantOwnership } from "@/lib/tenant/scope";
import { executeLLM } from "@/lib/swarm/model-router";
import { z } from "zod";

const AskSchema = z.object({
  question: z.string().min(1).max(2000),
  hotelId: z.string().optional(),
});

async function getHotelContext(hotelId: string, tenantId: string) {
  const [orders, spend, topSuppliers] = await Promise.all([
    prisma.order.findMany({
      where: { hotelId, tenantId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { supplier: { select: { name: true } }, items: { include: { product: { select: { name: true } } } } },
    }),
    prisma.order.aggregate({
      where: { hotelId, tenantId, status: { in: ["DELIVERED", "CONFIRMED"] } },
      _sum: { total: true },
    }),
    prisma.order.groupBy({
      by: ["supplierId"],
      where: { hotelId, tenantId },
      _sum: { total: true },
      _count: { id: true },
      orderBy: { _sum: { total: "desc" } },
      take: 5,
    }),
  ]);

  const supplierNames = await prisma.supplier.findMany({
    where: { id: { in: topSuppliers.map((s) => s.supplierId) }, tenantId },
    select: { id: true, name: true },
  });

  return {
    recentOrders: orders.map((o) => ({
      id: o.orderNumber,
      total: o.total,
      status: o.status,
      supplier: o.supplier.name,
      items: o.items.map((i) => i.product.name).join(", "),
    })),
    totalSpend: spend._sum.total || 0,
    topSuppliers: topSuppliers.map((s) => ({
      name: supplierNames.find((sn) => sn.id === s.supplierId)?.name || "Unknown",
      total: s._sum.total || 0,
      orders: s._count.id,
    })),
  };
}

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const body = await request.json();
  const data = validateBody(AskSchema, body);

  let context = "";
  let rolePrompt = "You are a helpful assistant for the Hotels Vendors B2B procurement platform.";

  // Determine role from auth and build context
  if (auth.platformRole === "HOTEL" && data.hotelId) {
    const owns = await verifyTenantOwnership(auth, "hotel", data.hotelId);
    if (!owns) return error("Hotel not found", 404);
    const ctx = await getHotelContext(data.hotelId, auth.tenantId);
    context = `Recent orders: ${JSON.stringify(ctx.recentOrders)}. Total spend: ${ctx.totalSpend} EGP. Top suppliers: ${JSON.stringify(ctx.topSuppliers)}.`;
    rolePrompt = `You are a procurement advisor for an Egyptian hotel using the Hotels Vendors platform. You help with: order tracking, supplier recommendations, spend analysis, and reorder alerts. Be concise, practical, and use EGP for currency. Never expose data from other hotels. Context: ${context}`;
  } else if (auth.platformRole === "SUPPLIER") {
    rolePrompt = `You are a business advisor for a supplier on the Hotels Vendors platform. You help with: demand forecasting, pricing suggestions, inventory optimization, and order fulfillment tips. Be concise and data-driven.`;
  } else if (auth.platformRole === "FACTORING") {
    rolePrompt = `You are a risk analyst for a factoring company on the Hotels Vendors platform. You help with: credit risk assessment, portfolio yield insights, and anomaly detection. Be conservative and precise.`;
  } else if (auth.platformRole === "SHIPPING") {
    rolePrompt = `You are a logistics optimizer for the Hotels Vendors platform. You help with: route optimization, delivery consolidation, fuel cost predictions, and fleet efficiency. Be practical and numbers-focused.`;
  } else if (auth.platformRole === "ADMIN") {
    rolePrompt = `You are a platform operations advisor for Hotels Vendors. You help with: system health, fee tracking, cross-tenant audit flags, and marketplace analytics. Be concise and security-aware.`;
  }

  try {
    const result = await executeLLM(rolePrompt, data.question, { maxTokens: 600, temperature: 0.4 });
    return success({ answer: result.content, model: result.model, latencyMs: result.latencyMs });
  } catch (err) {
    // Fallback to rule-based if all LLMs fail
    const q = data.question.toLowerCase();
    let answer = "I'm your procurement assistant. I can help with orders, suppliers, and budgets.";
    if (q.includes("spend")) answer = `Your hotel's total confirmed spend is tracked in the dashboard. F&B typically represents the largest category.`;
    if (q.includes("supplier")) answer = `Your top suppliers by volume are listed in the Spend Intelligence section. I can help compare prices across vendors.`;
    if (q.includes("order")) answer = `You can view all orders in the Orders tab. Pending approvals require GM authorization.`;
    if (q.includes("budget") || q.includes("credit")) answer = `Your credit facility is shown in the dashboard. For increases, contact your account manager.`;
    return success({ answer, source: "rule-based-fallback" });
  }
});
