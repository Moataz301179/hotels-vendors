import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  if (auth.platformRole !== "ADMIN") {
    return error("Forbidden", 403);
  }

  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);

  const [monthlyInvoices, yearlyInvoices, totalOrders, activeHotels, activeSuppliers] = await Promise.all([
    prisma.invoice.findMany({ where: { createdAt: { gte: startOfMonth } }, select: { total: true } }),
    prisma.invoice.findMany({ where: { createdAt: { gte: startOfYear } }, select: { total: true } }),
    prisma.order.count(),
    prisma.hotel.count({ where: { status: "ACTIVE" } }),
    prisma.supplier.count({ where: { status: "ACTIVE" } }),
  ]);

  const platformFeeRate = 0.025;
  const monthlyGmv = monthlyInvoices.reduce((s, i) => s + i.total, 0);
  const yearlyGmv = yearlyInvoices.reduce((s, i) => s + i.total, 0);

  return success({
    fees: {
      monthlyGmv,
      yearlyGmv,
      monthlyPlatformFees: monthlyGmv * platformFeeRate,
      yearlyPlatformFees: yearlyGmv * platformFeeRate,
      platformFeeRate,
      totalOrders,
      activeHotels,
      activeSuppliers,
      avgOrderValue: totalOrders > 0 ? yearlyGmv / totalOrders : 0,
    },
  });
});
