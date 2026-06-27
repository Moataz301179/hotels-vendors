"use client";

import { useState, useEffect, useCallback } from "react";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, RefreshCw, Sparkles } from "lucide-react";

interface ForecastDay {
  day: string;
  predicted: number;
  confidence: number;
}

interface ForecastData {
  forecast: {
    sku: string;
    predictedQuantity: number;
    confidence: number;
    breakdown: ForecastDay[];
    recommendedOrder: {
      quantity: number;
      urgency: "low" | "medium" | "high";
      reason: string;
    };
  };
  demo?: boolean;
  generatedAt: string;
}

interface ForecastWidgetProps {
  hotelId?: string;
  sku?: string;
}

export function ForecastWidget({ hotelId, sku }: ForecastWidgetProps) {
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchForecast = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (hotelId) params.set("hotelId", hotelId);
      if (sku) params.set("sku", sku);
      const qs = params.toString();
      const res = await fetch(`/api/v1/ai/forecast${qs ? `?${qs}` : ""}`);
      if (!res.ok) throw new Error("Forecast unavailable");
      const json = await res.json();
      setData(json);
    } catch {
      setError("AI forecast temporarily unavailable");
    } finally {
      setLoading(false);
    }
  }, [hotelId, sku]);

  useEffect(() => {
    fetchForecast();
  }, [fetchForecast]);

  if (loading) {
    return (
      <div className="card-outlined p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-accent-base" />
          <h3 className="text-sm font-medium text-foreground">AI Demand Forecast</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <RefreshCw size={18} className="animate-spin text-foreground-muted" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="card-outlined p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-accent-base" />
          <h3 className="text-sm font-medium text-foreground">AI Demand Forecast</h3>
        </div>
        <p className="text-sm text-foreground-muted text-center py-4">{error}</p>
        <button
          onClick={fetchForecast}
          className="w-full text-xs py-2 rounded-sm bg-accent-muted text-accent-base hover:bg-accent-muted/80 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const { forecast } = data;
  const maxPredicted = Math.max(...forecast.breakdown.map((d) => d.predicted), 1);
  const avgConfidence = forecast.confidence;

  const urgencyColor =
    forecast.recommendedOrder.urgency === "high"
      ? "text-error"
      : forecast.recommendedOrder.urgency === "medium"
        ? "text-accent-base"
        : "text-success";

  const urgencyBg =
    forecast.recommendedOrder.urgency === "high"
      ? "bg-error/10 border-error/20"
      : forecast.recommendedOrder.urgency === "medium"
        ? "bg-accent-muted border-accent-base/20"
        : "bg-success/10 border-success/20";

  const urgencyIcon =
    forecast.recommendedOrder.urgency === "high"
      ? AlertTriangle
      : forecast.recommendedOrder.urgency === "medium"
        ? TrendingUp
        : Minus;

  const UrgencyIcon = urgencyIcon;

  return (
    <div className="card-outlined p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent-base" />
          <h3 className="text-sm font-medium text-foreground">AI Demand Forecast</h3>
          {data.demo && (
            <span className="status-pill text-accent-base border-accent-base/20 bg-accent-muted">DEMO</span>
          )}
        </div>
        <button onClick={fetchForecast} className="p-1.5 rounded-sm hover:bg-surface-hover transition-colors">
          <RefreshCw size={12} className="text-foreground-muted" />
        </button>
      </div>

      <div className="flex items-baseline justify-between mb-1">
        <span className="label-upper">{forecast.sku}</span>
        <span className="metric-value text-xl text-foreground">{forecast.predictedQuantity.toLocaleString()}</span>
      </div>
      <p className="text-xs text-foreground-muted mb-4">
        predicted units · 14 days · {Math.round(avgConfidence * 100)}% confidence
      </p>

      <div className="flex items-end gap-0.5 h-16 mb-4">
        {forecast.breakdown.map((day) => {
          const height = Math.max(4, (day.predicted / maxPredicted) * 100);
          const isHigh = day.predicted > maxPredicted * 0.8;
          return (
            <div
              key={day.day}
              className="flex-1 rounded-t-sm transition-all"
              style={{
                height: `${height}%`,
                backgroundColor: isHigh ? "var(--accent-base)" : "var(--accent-base)",
                opacity: isHigh ? 0.9 : 0.4,
              }}
              title={`${day.day}: ${day.predicted} units (${Math.round(day.confidence * 100)}% conf)`}
            />
          );
        })}
      </div>
      <div className="flex justify-between mb-4">
        <span className="label-upper">Day 1</span>
        <span className="label-upper">Day 14</span>
      </div>

      <div className={`rounded-sm p-3 border ${urgencyBg}`}>
        <div className="flex items-center gap-2 mb-1">
          <UrgencyIcon size={13} className={urgencyColor} />
          <span className={`text-xs font-medium ${urgencyColor}`}>
            {forecast.recommendedOrder.urgency === "high"
              ? "Reorder Now"
              : forecast.recommendedOrder.urgency === "medium"
                ? "Plan Reorder"
                : "Stock OK"}
          </span>
        </div>
        <p className="text-xs text-foreground-muted leading-relaxed">{forecast.recommendedOrder.reason}</p>
        <p className="text-sm text-foreground-secondary mt-1">
          Suggested: <span className="font-medium text-foreground">{forecast.recommendedOrder.quantity.toLocaleString()} units</span>
        </p>
      </div>
    </div>
  );
}
