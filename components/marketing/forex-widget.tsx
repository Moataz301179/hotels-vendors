"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, TrendingDown, Globe, RefreshCw, AlertCircle } from "lucide-react";

interface ForexRate {
  label: string;
  value: string;
  change: string;
  up: boolean;
  source: string;
}

interface ForexWidgetProps {
  apiKey?: string;
}

/**
 * ForexWidget — connects to a real market data API.
 *
 * Without an API key, shows an empty placeholder state.
 * With a Google Finance / Exchange Rate API key, fetches live EGP rates.
 *
 * This is a UI widget slot — data is fetched server-side or via client API call.
 */
export function ForexWidget({ apiKey }: ForexWidgetProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [rates, setRates] = useState<ForexRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchRates = async () => {
    if (!apiKey) return;
    setLoading(true);
    setError(null);
    try {
      // Google Finance via exchangerate-api.com (free tier available)
      // Or any API that returns EGP rates
      const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
      if (!res.ok) throw new Error("API request failed");
      const data = await res.json();
      if (data.result !== "success") throw new Error(data["error-type"] || "API error");

      const egpRate = data.conversion_rates?.EGP;
      if (!egpRate) throw new Error("EGP rate not available");

      setRates([
        { label: "USD/EGP", value: egpRate.toFixed(4), change: "Live", up: true, source: "Live" },
        { label: "EUR/EGP", value: (egpRate * (data.conversion_rates?.EUR || 1)).toFixed(4), change: "Live", up: true, source: "Live" },
      ]);
      setLastUpdated(new Date().toLocaleTimeString("en-EG", { hour: "2-digit", minute: "2-digit" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch rates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (apiKey) fetchRates();
  }, [apiKey]);

  // ── Empty state: no API key configured ──
  if (!apiKey) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="rounded-2xl p-4"
        style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Globe size={12} style={{ color: "#FFB000" }} />
          <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">Market Rates</span>
        </div>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Globe size={24} className="mb-2 text-white/10" />
          <p className="text-[11px] text-white/30 mb-1">Connect API Key to Display Live Rates</p>
          <p className="text-[9px] text-white/15 leading-tight max-w-[180px]">
            Add your Exchange Rate API key to show real-time EGP forex data in this widget.
          </p>
          <div className="mt-3 px-3 py-1.5 rounded-md text-[9px] text-white/20 font-mono" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            process.env.NEXT_PUBLIC_EXCHANGE_API_KEY
          </div>
        </div>
      </motion.div>
    );
  }

  // ── Loading state ──
  if (loading && rates.length === 0) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="rounded-2xl p-4"
        style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Globe size={12} style={{ color: "#FFB000" }} />
          <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">Market Rates</span>
          <RefreshCw size={10} className="ml-auto animate-spin text-white/20" />
        </div>
        <div className="space-y-2.5">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-3 w-16 rounded bg-white/[0.04] animate-pulse" />
              <div className="h-3 w-12 rounded bg-white/[0.04] animate-pulse" />
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="rounded-2xl p-4"
        style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(239,68,68,0.15)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Globe size={12} style={{ color: "#EF4444" }} />
          <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">Market Rates</span>
          <button onClick={fetchRates} className="ml-auto p-1 rounded hover:bg-white/[0.04] transition-colors">
            <RefreshCw size={10} className="text-white/30" />
          </button>
        </div>
        <div className="flex items-center gap-2 py-3">
          <AlertCircle size={12} style={{ color: "#EF4444" }} />
          <span className="text-[10px] text-white/40">{error}</span>
        </div>
      </motion.div>
    );
  }

  // ── Live data state ──
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="rounded-2xl p-4"
      style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Globe size={12} style={{ color: "#FFB000" }} />
        <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">Market Rates</span>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse ml-auto" style={{ backgroundColor: "#FFB000" }} />
        {lastUpdated && <span className="text-[8px] text-white/20 ml-1">Updated {lastUpdated}</span>}
        <button onClick={fetchRates} className="p-1 rounded hover:bg-white/[0.04] transition-colors">
          <RefreshCw size={9} className="text-white/20" />
        </button>
      </div>
      <div className="space-y-2.5">
        {rates.map((rate) => (
          <div key={rate.label} className="flex items-center justify-between">
            <div>
              <span className="text-[11px] text-white/50">{rate.label}</span>
              <span className="text-[9px] text-white/20 ml-1.5">{rate.source}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-white/70">{rate.value}</span>
              <span className="text-[9px] flex items-center gap-0.5" style={{ color: rate.up ? "#22C55E" : "#EF4444" }}>
                {rate.up ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
                {rate.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
