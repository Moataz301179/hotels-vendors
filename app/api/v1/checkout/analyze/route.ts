/**
 * POST /api/v1/checkout/analyze
 * Pre-Spend Gatekeeper — Analyze cart before checkout
 * Returns risk score, budget status, price benchmarks, anomalies, and recommendations.
 */

import { NextRequest } from "next/server";
import { z } from "zod";
import { apiRoute, authenticate, success, error, validateBody } from "@/lib/api-utils";
import { preSpendGatekeeper } from "@/lib/swarm/agents/pre-spend-gatekeeper";

const AnalyzeCartSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive(),
      unitPrice: z.number().positive(),
    })
  ).min(1),
  hotelId: z.string().min(1).optional(), // Falls back to auth context
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const body = validateBody(AnalyzeCartSchema, await request.json());

  const hotelId = body.hotelId ?? auth.userId; // Fallback: many hotels use userId as hotelId in early stages

  const analysis = await preSpendGatekeeper.analyze(
    body.items,
    hotelId,
    auth.tenantId,
    auth.userId
  );

  return success({
    analysis,
    summary: {
      gateOpen: analysis.gateOpen,
      riskLevel: analysis.riskLevel,
      riskScore: analysis.riskScore,
      totalWithVat: analysis.totalWithVat,
      authorityRequired: analysis.authorityRequired,
      recommendationCount: analysis.recommendations.length,
      savingsOpportunityCount: analysis.savingsOpportunities.length,
    },
  });
});
