/**
 * AI Demand Forecast API
 * POST /api/v1/ai/forecast
 *
 * Returns 14-day demand predictions based on historical orders,
 * occupancy data, seasonality, and upcoming events.
 *
 * Request body matches ForecastInput from lib/ai/workflows/forecast.ts
 */

import { NextRequest, NextResponse } from "next/server";
import { generateForecast, type ForecastInput } from "@/lib/ai/workflows/forecast";
import { authenticate, success, ApiError } from "@/lib/api-utils";
import { z } from "zod";

const ForecastRequestSchema = z.object({
  hotelId: z.string().min(1),
  sku: z.string().min(1),
  historicalOrders: z.array(
    z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      quantity: z.number().min(0).max(10000),
    })
  ).min(7, "At least 7 days of historical data required"),
  occupancyData: z.array(
    z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      rate: z.number().min(0).max(1),
    })
  ).optional().default([]),
  seasonalityFactor: z.number().min(0.1).max(3.0).optional().default(1.0),
  upcomingEvents: z.array(
    z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      impact: z.number().min(-0.5).max(2.0),
      name: z.string().min(1),
    })
  ).optional().default([]),
});

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const auth = await authenticate(req);
    if (!auth) {
      throw new ApiError("Unauthorized", 401);
    }

    // Parse and validate request body
    const body = await req.json();
    const input: ForecastInput = ForecastRequestSchema.parse(body);

    // Verify hotel belongs to user's tenant
    // (In production, verify tenant ownership here)

    // Generate forecast
    const forecast = await generateForecast(input);

    return success({
      forecast,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    const message = error instanceof Error ? error.message : "Forecast generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/v1/ai/forecast?hotelId=xxx&sku=xxx
 * Returns a demo forecast using synthetic data for dashboard preview.
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await authenticate(req);
    if (!auth) {
      throw new ApiError("Unauthorized", 401);
    }

    const { searchParams } = new URL(req.url);
    const hotelId = searchParams.get("hotelId") || "demo";
    const sku = searchParams.get("sku") || "linens-towel-set";

    // Generate demo forecast with synthetic data
    const today = new Date();
    const demoInput: ForecastInput = {
      hotelId,
      sku,
      historicalOrders: Array.from({ length: 14 }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - 14 + i);
        return {
          date: d.toISOString().split("T")[0],
          quantity: Math.round(50 + Math.random() * 30 + (i > 10 ? 20 : 0)),
        };
      }),
      occupancyData: Array.from({ length: 14 }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() + i + 1);
        return {
          date: d.toISOString().split("T")[0],
          rate: 0.6 + Math.random() * 0.3,
        };
      }),
      seasonalityFactor: 1.1,
      upcomingEvents: [],
    };

    const forecast = await generateForecast(demoInput);

    return success({
      forecast,
      demo: true,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Forecast generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
