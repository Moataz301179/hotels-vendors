/**
 * AI Demand Forecasting Engine
 * Predicts consumption 14 days ahead based on historical orders,
 * occupancy data, seasonality, and local events.
 */

export interface ForecastInput {
  hotelId: string;
  sku: string;
  historicalOrders: { date: string; quantity: number }[];
  occupancyData: { date: string; rate: number }[];
  seasonalityFactor: number; // 0.5 = low season, 1.5 = peak
  upcomingEvents: { date: string; impact: number; name: string }[];
}

export interface ForecastOutput {
  sku: string;
  hotelId: string;
  predictedQuantity: number;
  confidence: number; // 0-1
  forecastDays: number;
  breakdown: { day: string; predicted: number; confidence: number }[];
  recommendedOrder: {
    quantity: number;
    urgency: "low" | "medium" | "high";
    reason: string;
  };
}

/**
 * Simple moving average with seasonality and event adjustments.
 * In production, this calls the LLM or a dedicated ML service.
 */
export async function generateForecast(input: ForecastInput): Promise<ForecastOutput> {
  const { hotelId, sku, historicalOrders, occupancyData, seasonalityFactor, upcomingEvents } = input;

  // Calculate baseline from historical average
  const avgDaily = historicalOrders.length > 0
    ? historicalOrders.reduce((sum, o) => sum + o.quantity, 0) / historicalOrders.length
    : 10;

  // Apply seasonality
  const seasonalBaseline = avgDaily * seasonalityFactor;

  // Generate 14-day breakdown
  const breakdown: ForecastOutput["breakdown"] = [];
  const today = new Date();

  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];

    // Find occupancy for this date
    const occ = occupancyData.find((o) => o.date === dateStr);
    const occMultiplier = occ ? 0.5 + occ.rate : 1.0;

    // Find events for this date
    const events = upcomingEvents.filter((e) => e.date === dateStr);
    const eventMultiplier = events.reduce((m, e) => m + e.impact, 1);

    const predicted = Math.round(seasonalBaseline * occMultiplier * eventMultiplier);
    const confidence = Math.max(0.3, 1 - i * 0.03); // confidence decreases with distance

    breakdown.push({ day: dateStr, predicted, confidence });
  }

  const totalPredicted = breakdown.reduce((sum, d) => sum + d.predicted, 0);
  const avgConfidence = breakdown.reduce((sum, d) => sum + d.confidence, 0) / breakdown.length;

  // Determine urgency
  const stockOnHand = 0; // Would come from inventory system
  const daysOfStock = stockOnHand / (totalPredicted / 14);
  const urgency = daysOfStock < 3 ? "high" : daysOfStock < 7 ? "medium" : "low";

  return {
    sku,
    hotelId,
    predictedQuantity: totalPredicted,
    confidence: avgConfidence,
    forecastDays: 14,
    breakdown,
    recommendedOrder: {
      quantity: Math.ceil(totalPredicted * 1.1), // 10% buffer
      urgency,
      reason: urgency === "high"
        ? "Critical stock level predicted within 3 days"
        : urgency === "medium"
        ? "Stock level predicted within 7 days"
        : "Standard replenishment cycle",
    },
  };
}
