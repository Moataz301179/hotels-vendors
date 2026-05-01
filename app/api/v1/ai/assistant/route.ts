import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, validateBody, success, error } from "@/lib/api-utils";
import { z } from "zod";

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

const AskSchema = z.object({
  question: z.string().min(1).max(500),
  hotelId: z.string().optional(),
});

async function getHotelContext(hotelId: string) {
  const [orders, spend, topSuppliers] = await Promise.all([
    prisma.order.findMany({
      where: { hotelId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { supplier: { select: { name: true } }, items: { include: { product: { select: { name: true } } } } },
    }),
    prisma.order.aggregate({
      where: { hotelId, status: { in: ["DELIVERED", "CONFIRMED"] } },
      _sum: { total: true },
    }),
    prisma.order.groupBy({
      by: ["supplierId"],
      where: { hotelId },
      _sum: { total: true },
      _count: { id: true },
      orderBy: { _sum: { total: "desc" } },
      take: 5,
    }),
  ]);

  const supplierNames = await prisma.supplier.findMany({
    where: { id: { in: topSuppliers.map((s) => s.supplierId) } },
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
  if (data.hotelId) {
    const ctx = await getHotelContext(data.hotelId);
    context = `Recent orders: ${JSON.stringify(ctx.recentOrders)}. Total spend: ${ctx.totalSpend} EGP. Top suppliers: ${JSON.stringify(ctx.topSuppliers)}.`;
  }

  if (!OPENROUTER_KEY) {
    // Fallback: rule-based responses
    const q = data.question.toLowerCase();
    let answer = "I'm your procurement assistant. I can help with orders, suppliers, and budgets.";
    if (q.includes("spend")) answer = `Your hotel's total confirmed spend is available in the dashboard. Based on recent patterns, F&B represents the largest category.`;
    if (q.includes("supplier")) answer = `Your top suppliers by volume are listed in the Spend Intelligence section. I can help you compare prices across vendors.`;
    if (q.includes("order")) answer = `You can view all orders in the Orders tab. Pending approvals require GM authorization.`;
    if (q.includes("budget")) answer = `Your credit facility is shown in the dashboard. For increases, contact your account manager.`;
    return success({ answer, source: "rule-based" });
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_KEY}`,
      "HTTP-Referer": "https://hotelsvendors.com",
      "X-Title": "Hotels Vendors AI",
    },
    body: JSON.stringify({
      model: "anthropic/claude-3.5-haiku",
      messages: [
        {
          role: "system",
          content: `You are a procurement advisor for Egyptian hotels. Be concise, practical, and use EGP for currency. Context: ${context}`,
        },
        { role: "user", content: data.question },
      ],
      max_tokens: 300,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return error(`AI service error: ${err}`, 502);
  }

  const aiData = await res.json();
  const answer = aiData.choices?.[0]?.message?.content || "I'm analyzing your request...";

  return success({ answer, source: "openrouter" });
});
