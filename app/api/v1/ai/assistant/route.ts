import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, validateBody, success, error } from "@/lib/api-utils";
import { verifyTenantOwnership } from "@/lib/tenant/scope";
import { executeLLM } from "@/lib/swarm/model-router";
import { buildSystemPrompt, type AssistantRole } from "@/components/ai-assistant/prompts";
import { z } from "zod";

const AskSchema = z.object({
  question: z.string().min(1).max(2000),
  hotelId: z.string().optional(),
  role: z.enum(["hotel", "supplier", "factoring", "shipping", "admin", "marketing"] as const).optional(),
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

  // Determine role: server-side auth takes precedence over client-sent role
  const role: AssistantRole = (() => {
    const authRole = auth.platformRole?.toLowerCase() as AssistantRole | undefined;
    if (authRole && ["hotel", "supplier", "factoring", "shipping", "admin", "marketing"].includes(authRole)) {
      return authRole;
    }
    const clientRole = data.role?.toLowerCase() as AssistantRole | undefined;
    if (clientRole && ["hotel", "supplier", "factoring", "shipping", "admin", "marketing"].includes(clientRole)) {
      return clientRole;
    }
    return "hotel";
  })();

  let context = "";

  // Build live context for hotel users
  if (auth.platformRole === "HOTEL" && data.hotelId) {
    const owns = await verifyTenantOwnership(auth, "hotel", data.hotelId);
    if (!owns) return error("Hotel not found", 404);
    const ctx = await getHotelContext(data.hotelId, auth.tenantId);
    context = `Recent orders: ${JSON.stringify(ctx.recentOrders)}. Total spend: ${ctx.totalSpend} EGP. Top suppliers: ${JSON.stringify(ctx.topSuppliers)}.`;
  }

  const systemPrompt = buildSystemPrompt(role, context || undefined);

  try {
    const result = await executeLLM(systemPrompt, data.question, { maxTokens: 800, temperature: 0.4 });
    return success({ answer: result.content, model: result.model, latencyMs: result.latencyMs });
  } catch (err) {
    // Fallback to rule-based if all LLMs fail
    const q = data.question.toLowerCase();
    let answer = "I'm your HotelsVendors Intelligence Engine. I can help with procurement, suppliers, orders, and market insights. What would you like to know?";

    if (q.includes("spend") || q.includes("budget") || q.includes("cost")) {
      answer = "Your spend analytics are available in the dashboard under Spend Intelligence. I can help interpret category breakdowns, month-over-month trends, and identify consolidation opportunities. Would you like me to guide you to a specific report?";
    } else if (q.includes("supplier") || q.includes("vendor")) {
      answer = "Our verified supplier network spans 50+ hospitality categories. I can help you discover suppliers by location, compare ratings and tiers, or evaluate alternative sources. What category are you sourcing for?";
    } else if (q.includes("order") || q.includes("purchase")) {
      answer = "Orders flow through: DRAFT → PENDING → APPROVED → CONFIRMED → IN_TRANSIT → DELIVERED. The Authority Matrix governs approvals based on value thresholds and user roles. Would you like to check a specific order status?";
    } else if (q.includes("eta") || q.includes("invoice") || q.includes("tax")) {
      answer = "All invoices issued through HotelsVendors are automatically submitted to the Egyptian Tax Authority (ETA) e-invoicing system in real time. Each invoice receives a UUID and digital signature. You can track submission status in the Invoices tab.";
    } else if (q.includes("factoring") || q.includes("payment") || q.includes("cash flow")) {
      answer = "Our embedded non-recourse factoring allows suppliers to receive early payment while hotels maintain their standard net-30/60 terms. The platform fee is always deducted first. Would you like to understand the factoring inquiry process?";
    } else if (q.includes("delivery") || q.includes("logistics") || q.includes("route")) {
      answer = "We offer shared-route logistics with a 48-hour delivery guarantee across Egypt. Coastal clusters (Red Sea, North Coast) are optimized for seasonal demand. I can help you track shipments or understand delivery windows.";
    }

    return success({ answer, source: "rule-based-fallback" });
  }
});
