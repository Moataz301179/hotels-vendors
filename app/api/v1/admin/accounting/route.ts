import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { apiRoute, authenticate, requirePermission } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";

const REVENUE_ACCOUNTS = new Set(["4010", "4020", "4030"]);

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");

  const [journalEntries, outstandingInvoices, recentOrders] = await Promise.all([
    prisma.journalEntry.findMany({ where: { tenantId: auth.tenantId, status: { in: ["POSTED", "REVERSED"] } }, orderBy: { date: "desc" }, take: 500 }),
    prisma.invoice.aggregate({ where: { tenantId: auth.tenantId, paymentStatus: { in: ["UNPAID", "OVERDUE", "PARTIALLY_PAID"] } }, _sum: { total: true }, _count: { id: true } }),
    prisma.order.findMany({ where: { tenantId: auth.tenantId, status: { in: ["DELIVERED", "CONFIRMED"] } }, include: { hotel: { select: { name: true } }, supplier: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 20 }),
  ]);

  const revenueByMonth = new Map<string, number>();
  let recognizedRevenue = 0;
  let factoringCommissions = 0;
  for (const entry of journalEntries) {
    const lines = (() => { try { return JSON.parse(entry.lines) as Array<{ accountCode?: string; credit?: number }>; } catch { return []; } })();
    const revenue = lines.filter((l) => REVENUE_ACCOUNTS.has(l.accountCode ?? "")).reduce((sum, l) => sum + Number(l.credit ?? 0), 0);
    if (!revenue) continue;
    recognizedRevenue += revenue;
    const month = new Date(entry.date).toISOString().slice(0, 7);
    revenueByMonth.set(month, (revenueByMonth.get(month) ?? 0) + revenue);
    factoringCommissions += lines.filter((l) => l.accountCode === "4010").reduce((sum, l) => sum + Number(l.credit ?? 0), 0);
  }

  const monthlyRevenue = [...revenueByMonth.entries()].sort(([a], [b]) => b.localeCompare(a)).map(([month, revenue]) => ({ month: `${month}-01T00:00:00.000Z`, revenue, orders: 0 }));
  const recentTransactions = recentOrders.map((tx) => ({ id: tx.id, orderNumber: tx.orderNumber, total: Number(tx.total ?? 0), status: tx.status, createdAt: tx.createdAt, hotelName: tx.hotel?.name ?? "Unknown", supplierName: tx.supplier?.name ?? "Unknown" }));

  return NextResponse.json({ success: true, data: { totalRevenue: recognizedRevenue, platformFees: recognizedRevenue, factoringCommissions, subscriptionRevenue: 0, outstandingInvoices: { total: Number(outstandingInvoices._sum.total ?? 0), count: outstandingInvoices._count.id }, monthlyRevenue, recentTransactions, orderCount: recentOrders.length } });
});
