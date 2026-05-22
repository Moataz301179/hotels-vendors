/**
 * Hotel Credit Risk Engine
 * Separate from supplier compliance scoring.
 * Assesses hotel creditworthiness for financing eligibility.
 */

import { prisma } from "@/lib/prisma";

export interface HotelRiskProfile {
  score: number;           // 0-100
  tier: "EXCELLENT" | "GOOD" | "FAIR" | "POOR" | "UNACCEPTABLE";
  monthlyAvgSpend: number;
  orderConsistency: number; // 0-100
  paymentReliability: number; // 0-100
  seasonalityRisk: number;  // 0-100
  propertyTierScore: number; // 0-100
  maxRecommendedLimit: number;
  recommendedRate: number;  // APR
  factors: string[];
}

export async function assessHotelCreditRisk(hotelId: string): Promise<HotelRiskProfile> {
  const hotel = await prisma.hotel.findUnique({
    where: { id: hotelId },
    select: { starRating, roomCount, tier, city, governorate, createdAt },
  });

  if (!hotel) {
    return {
      score: 0, tier: "UNACCEPTABLE", monthlyAvgSpend: 0,
      orderConsistency: 0, paymentReliability: 0, seasonalityRisk: 0,
      propertyTierScore: 0, maxRecommendedLimit: 0, recommendedRate: 0.24,
      factors: ["Hotel not found"],
    };
  }

  const factors: string[] = [];
  let score = 50; // Base score

  // 1. Transaction history (last 12 months)
  const twelveMonthsAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  const orders = await prisma.order.findMany({
    where: {
      hotelId,
      createdAt: { gte: twelveMonthsAgo },
      status: { in: ["CONFIRMED", "DELIVERED", "COMPLETED"] },
    },
    orderBy: { createdAt: "asc" },
  });

  const totalSpend = orders.reduce((s, o) => s + Number(o.total), 0);
  const monthlyAvg = totalSpend / 12;
  const orderCount = orders.length;

  // Monthly consistency: did they order every month?
  const monthsWithOrders = new Set(orders.map((o) => o.createdAt.toISOString().slice(0, 7))).size;
  const orderConsistency = Math.min((monthsWithOrders / 12) * 100, 100);

  if (orderCount >= 20 && monthlyAvg >= 50000) {
    score += 15;
    factors.push("Strong transaction history: 20+ orders, EGP 50K+ monthly");
  } else if (orderCount >= 10 && monthlyAvg >= 25000) {
    score += 8;
    factors.push("Good transaction history: 10+ orders, EGP 25K+ monthly");
  } else {
    score -= 10;
    factors.push("Limited transaction history — needs more data");
  }

  // 2. Payment reliability
  const invoices = await prisma.invoice.findMany({
    where: { hotelId, createdAt: { gte: twelveMonthsAgo } },
    select: { paymentStatus, dueDate, paidDate },
  });

  const paidOnTime = invoices.filter((inv) => {
    if (inv.paymentStatus === "PAID" && inv.dueDate && inv.paidDate) {
      return new Date(inv.paidDate) <= new Date(inv.dueDate);
    }
    return false;
  }).length;

  const paymentReliability = invoices.length > 0
    ? Math.round((paidOnTime / invoices.length) * 100)
    : 50;

  if (paymentReliability >= 95) {
    score += 15;
    factors.push("Excellent payment record: 95%+ on-time");
  } else if (paymentReliability >= 80) {
    score += 5;
    factors.push("Good payment record: 80%+ on-time");
  } else {
    score -= 15;
    factors.push("Payment concerns: <80% on-time payments");
  }

  // 3. Property tier
  let propertyTierScore = 40;
  if (hotel.starRating && hotel.starRating >= 4) propertyTierScore = 90;
  else if (hotel.starRating && hotel.starRating >= 3) propertyTierScore = 70;
  else if (hotel.roomCount && hotel.roomCount >= 50) propertyTierScore = 65;
  else if (hotel.tier === "PREMIUM") propertyTierScore = 80;

  score += (propertyTierScore - 50) * 0.2;
  factors.push(`Property tier score: ${propertyTierScore}/100 (${hotel.starRating || "N/A"} star, ${hotel.roomCount || "N/A"} rooms)`);

  // 4. Seasonality risk
  const governorateRisk: Record<string, number> = {
    "Cairo": 30, "Alexandria": 35, "Red Sea": 60, "South Sinai": 70,
    "Luxor": 55, "Aswan": 55, "Matruh": 75,
  };
  const seasonalityRisk = governorateRisk[hotel.governorate] || 50;
  score -= (seasonalityRisk - 30) * 0.1;
  factors.push(`Seasonality risk: ${seasonalityRisk}/100 (${hotel.governorate})`);

  // 5. Account age
  const accountAgeMonths = (Date.now() - hotel.createdAt.getTime()) / (30 * 24 * 60 * 60 * 1000);
  if (accountAgeMonths >= 12) {
    score += 5;
    factors.push("Established account: 12+ months");
  } else {
    score -= 5;
    factors.push("New account: <12 months");
  }

  // Clamp score
  score = Math.max(0, Math.min(100, Math.round(score)));

  // Determine tier
  let tier: HotelRiskProfile["tier"] = "FAIR";
  if (score >= 80) tier = "EXCELLENT";
  else if (score >= 65) tier = "GOOD";
  else if (score >= 45) tier = "FAIR";
  else if (score >= 25) tier = "POOR";
  else tier = "UNACCEPTABLE";

  // Recommended limit and rate
  const maxRecommendedLimit = Math.min(monthlyAvg * 4, 3000000); // Cap at 3M
  let recommendedRate = 0.20;
  if (tier === "EXCELLENT") recommendedRate = 0.12;
  else if (tier === "GOOD") recommendedRate = 0.14;
  else if (tier === "FAIR") recommendedRate = 0.18;
  else if (tier === "POOR") recommendedRate = 0.22;

  return {
    score,
    tier,
    monthlyAvgSpend: Math.round(monthlyAvg),
    orderConsistency,
    paymentReliability,
    seasonalityRisk,
    propertyTierScore,
    maxRecommendedLimit: Math.round(maxRecommendedLimit),
    recommendedRate,
    factors,
  };
}
