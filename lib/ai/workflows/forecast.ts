/**
 * AI Demand Forecasting Engine
 * Predicts consumption 14 days ahead based on historical orders,
 * occupancy data, seasonality, and local events.
 *
 * Includes full input validation, sanitization, and output validation
 * to prevent corrupted or hallucinated predictions when fed irregular data.
 */

// ─────────────────────────────────────────
// DOMAIN CONSTANTS
// ─────────────────────────────────────────

const MAX_DAILY_QUANTITY = 10000;
const MIN_DAILY_QUANTITY = 0;
const MAX_SEASONALITY_FACTOR = 3.0;
const MIN_SEASONALITY_FACTOR = 0.1;
const MIN_HISTORICAL_DATA_POINTS = 7;
const OUTLIER_Z_THRESHOLD = 3.0;
const FORECAST_DAYS = 14;

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────

export interface ForecastInput {
  hotelId: string;
  sku: string;
  historicalOrders: { date: string; quantity: number }[];
  occupancyData: { date: string; rate: number }[];
  seasonalityFactor: number;
  upcomingEvents: { date: string; impact: number; name: string }[];
}

export interface ForecastOutput {
  sku: string;
  hotelId: string;
  predictedQuantity: number;
  confidence: number;
  forecastDays: number;
  breakdown: { day: string; predicted: number; confidence: number }[];
  recommendedOrder: {
    quantity: number;
    urgency: "low" | "medium" | "high";
    reason: string;
  };
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ─────────────────────────────────────────
// INPUT VALIDATION
// ─────────────────────────────────────────

function validateForecastInput(input: ForecastInput): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!input.historicalOrders || input.historicalOrders.length < MIN_HISTORICAL_DATA_POINTS) {
    errors.push(
      `Insufficient historical data: ${input.historicalOrders?.length || 0} points, ` +
      `minimum ${MIN_HISTORICAL_DATA_POINTS} required.`
    );
  }

  for (const order of input.historicalOrders || []) {
    if (!isFinite(order.quantity) || isNaN(order.quantity)) {
      errors.push(`Invalid quantity in historical data: ${order.quantity} on ${order.date}`);
    }
    if (order.quantity < 0) {
      errors.push(`Negative quantity in historical data: ${order.quantity} on ${order.date}`);
    }
  }

  if (input.seasonalityFactor < MIN_SEASONALITY_FACTOR || input.seasonalityFactor > MAX_SEASONALITY_FACTOR) {
    errors.push(
      `Seasonality factor ${input.seasonalityFactor} outside bounds ` +
      `[${MIN_SEASONALITY_FACTOR}, ${MAX_SEASONALITY_FACTOR}].`
    );
  }

  if (input.historicalOrders && input.historicalOrders.length >= 7) {
    const quantities = input.historicalOrders.map(o => o.quantity);
    const mean = quantities.reduce((a, b) => a + b, 0) / quantities.length;
    const stdDev = Math.sqrt(
      quantities.reduce((sum, q) => sum + Math.pow(q - mean, 2), 0) / quantities.length
    );

    if (stdDev > 0) {
      const outliers = quantities.filter(q => Math.abs((q - mean) / stdDev) > OUTLIER_Z_THRESHOLD);
      if (outliers.length > 0) {
        warnings.push(`Detected ${outliers.length} outlier(s) — will be winsorized.`);
      }
    }

    if (stdDev === 0 && quantities.length > 0) {
      warnings.push("Zero variance in historical data — confidence will be limited.");
    }
  }

  for (const occ of input.occupancyData || []) {
    if (occ.rate < 0 || occ.rate > 1) {
      errors.push(`Invalid occupancy rate: ${occ.rate} on ${occ.date}. Must be 0-1.`);
    }
  }

  for (const event of input.upcomingEvents || []) {
    if (event.impact < -0.5 || event.impact > 2.0) {
      warnings.push(`Event "${event.name}" has extreme impact ${event.impact} — will be clamped.`);
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

// ─────────────────────────────────────────
// INPUT SANITIZATION
// ─────────────────────────────────────────

function sanitizeForecastInput(input: ForecastInput): ForecastInput {
  const sanitized = { ...input };

  // Winsorize historical data outliers
  if (sanitized.historicalOrders && sanitized.historicalOrders.length >= 7) {
    const quantities = sanitized.historicalOrders.map(o => o.quantity);
    const mean = quantities.reduce((a, b) => a + b, 0) / quantities.length;
    const stdDev = Math.sqrt(
      quantities.reduce((sum, q) => sum + Math.pow(q - mean, 2), 0) / quantities.length
    );

    if (stdDev > 0) {
      const upperBound = mean + OUTLIER_Z_THRESHOLD * stdDev;
      sanitized.historicalOrders = sanitized.historicalOrders.map(o => ({
        ...o,
        quantity: Math.max(0, Math.min(o.quantity, upperBound)),
      }));
    }
  }

  // Clamp seasonality factor
  sanitized.seasonalityFactor = Math.max(
    MIN_SEASONALITY_FACTOR,
    Math.min(MAX_SEASONALITY_FACTOR, sanitized.seasonalityFactor)
  );

  // Clamp event impacts
  sanitized.upcomingEvents = sanitized.upcomingEvents.map(e => ({
    ...e,
    impact: Math.max(-0.5, Math.min(2.0, e.impact)),
  }));

  return sanitized;
}

// ─────────────────────────────────────────
// OUTPUT VALIDATION & SANITIZATION
// ─────────────────────────────────────────

function sanitizeForecastOutput(output: ForecastOutput): ForecastOutput {
  const sanitized = { ...output };

  // Clamp total prediction
  if (!isFinite(sanitized.predictedQuantity) || isNaN(sanitized.predictedQuantity)) {
    sanitized.predictedQuantity = 0;
  }
  sanitized.predictedQuantity = Math.max(MIN_DAILY_QUANTITY, sanitized.predictedQuantity);

  // Clamp confidence
  sanitized.confidence = Math.max(0, Math.min(1, sanitized.confidence));

  // Sanitize each day in breakdown
  sanitized.breakdown = sanitized.breakdown.map(day => ({
    day: day.day,
    predicted: isFinite(day.predicted) && !isNaN(day.predicted)
      ? Math.max(MIN_DAILY_QUANTITY, Math.min(MAX_DAILY_QUANTITY, day.predicted))
      : 0,
    confidence: Math.max(0, Math.min(1, day.confidence)),
  }));

  // Sanitize recommended order
  sanitized.recommendedOrder.quantity = Math.max(
    0,
    Math.ceil(sanitized.recommendedOrder.quantity)
  );

  return sanitized;
}

// ─────────────────────────────────────────
// CORE FORECAST ENGINE
// ─────────────────────────────────────────

/**
 * Main entry point: validates input, sanitizes, generates forecast,
 * validates output, and returns a sanitized ForecastOutput.
 *
 * @throws Error if input validation fails (insufficient data, NaN values, etc.)
 */
export async function generateForecast(input: ForecastInput): Promise<ForecastOutput> {
  // STEP 1: Validate raw input
  const validation = validateForecastInput(input);
  if (!validation.valid) {
    throw new Error(`Forecast input validation failed: ${validation.errors.join("; ")}`);
  }
  // Log warnings (in production, use proper logger)
  for (const warning of validation.warnings) {
    console.warn(`[Forecast] ${warning}`);
  }

  // STEP 2: Sanitize input (winsorize outliers, clamp values)
  const clean = sanitizeForecastInput(input);

  const { hotelId, sku, historicalOrders, occupancyData, seasonalityFactor, upcomingEvents } = clean;

  // STEP 3: Calculate baseline from historical average
  const avgDaily = historicalOrders.length > 0
    ? historicalOrders.reduce((sum, o) => sum + o.quantity, 0) / historicalOrders.length
    : 0;

  // Apply seasonality
  const seasonalBaseline = avgDaily * seasonalityFactor;

  // STEP 4: Generate 14-day breakdown
  const breakdown: ForecastOutput["breakdown"] = [];
  const today = new Date();

  for (let i = 1; i <= FORECAST_DAYS; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];

    // Occupancy multiplier: 0.5 + rate maps [0,1] → [0.5, 1.5]
    const occ = occupancyData.find(o => o.date === dateStr);
    const occMultiplier = occ ? 0.5 + occ.rate : 1.0;

    // Event multiplier: product of all events on this date
    const events = upcomingEvents.filter(e => e.date === dateStr);
    const eventMultiplier = events.reduce((m, e) => m * (1 + e.impact), 1);

    const predicted = Math.round(seasonalBaseline * occMultiplier * eventMultiplier);
    const confidence = Math.max(0.3, 1 - i * 0.03);

    breakdown.push({
      day: dateStr,
      predicted: Math.max(0, Math.min(MAX_DAILY_QUANTITY, predicted)),
      confidence,
    });
  }

  const totalPredicted = breakdown.reduce((sum, d) => sum + d.predicted, 0);
  const avgConfidence = breakdown.length > 0
    ? breakdown.reduce((sum, d) => sum + d.confidence, 0) / breakdown.length
    : 0;

  // STEP 5: Determine urgency
  const dailyAvg = totalPredicted / FORECAST_DAYS;
  const stockOnHand = 0; // Would come from inventory system in production
  const daysOfStock = dailyAvg > 0 ? stockOnHand / dailyAvg : 999;
  const urgency: "low" | "medium" | "high" =
    daysOfStock < 3 ? "high" : daysOfStock < 7 ? "medium" : "low";

  const output: ForecastOutput = {
    sku,
    hotelId,
    predictedQuantity: totalPredicted,
    confidence: avgConfidence,
    forecastDays: FORECAST_DAYS,
    breakdown,
    recommendedOrder: {
      quantity: Math.ceil(totalPredicted * 1.1),
      urgency,
      reason: urgency === "high"
        ? "Critical stock level predicted within 3 days"
        : urgency === "medium"
          ? "Stock level predicted within 7 days"
          : "Standard replenishment cycle",
    },
  };

  // STEP 6: Sanitize output (final safety net)
  return sanitizeForecastOutput(output);
}
