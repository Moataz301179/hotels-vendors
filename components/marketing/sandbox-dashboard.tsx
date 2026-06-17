"use client";

import { motion } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────────────

export type Role = "hotel" | "supplier" | "factoring" | "shipping" | "admin" | "eta-officer";

interface DashboardProps {
  role: Role;
  completedSteps: Set<number>;
  currentStep: number;
}

// ─── Utility Components ─────────────────────────────────────────────────

function MiniBarChart({
  data,
  color,
  height = 100,
}: {
  data: { label: string; value: number; target?: number }[];
  color: string;
  height?: number;
}) {
  const maxVal = Math.max(...data.map((d) => Math.max(d.value, d.target ?? 0)));
  const pad = 0.1;
  const yMax = maxVal * (1 + pad);

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${data.length * 60} ${height}`} className="overflow-visible">
      {data.map((d, i) => {
        const x = i * 60 + 8;
        const barW = 20;
        const barH = (d.value / yMax) * (height - 20);
        const targetH = d.target ? (d.target / yMax) * (height - 20) : 0;
        return (
          <g key={i}>
            <rect
              x={x}
              y={height - 12 - barH}
              width={barW}
              height={barH}
              rx={3}
              fill={color}
              opacity={0.8}
            />
            {d.target && (
              <line
                x1={x - 2}
                y1={height - 12 - targetH}
                x2={x + barW + 2}
                y2={height - 12 - targetH}
                stroke={color}
                strokeWidth={1.5}
                strokeDasharray="3,2"
                opacity={0.5}
              />
            )}
            <text
              x={x + barW / 2}
              y={height}
              textAnchor="middle"
              fill="rgba(255,255,255,0.3)"
              fontSize="7"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
function MiniTable({
  headers,
  rows,
  color,
}: {
  headers: string[];
  rows: (string | { text: string; color?: string })[][];
  color: string;
}) {
  return (
    <div className="w-full overflow-hidden rounded-lg border" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${headers.length}, 1fr)` }}>
        {headers.map((h, i) => (
          <div
            key={i}
            className="px-2 py-1.5 text-[8px] font-medium uppercase tracking-wider"
            style={{ backgroundColor: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.3)" }}
          >
            {h}
          </div>
        ))}
      </div>
      {rows.map((row, ri) => (
        <div key={ri} className="grid gap-px border-t" style={{ gridTemplateColumns: `repeat(${headers.length}, 1fr)`, borderColor: "rgba(255,255,255,0.03)" }}>
          {row.map((cell, ci) => (
            <div key={ci} className="px-2 py-1.5 text-[9px]" style={{ color: typeof cell === "string" ? "rgba(255,255,255,0.5)" : cell.color ?? "rgba(255,255,255,0.5)" }}>
              {typeof cell === "string" ? cell : cell.text}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function StatCard({
  label,
  value,
  change,
  color,
  icon: Icon,
}: {
  label: string;
  value: string;
  change?: string;
  color: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl p-3 flex-1 min-w-0" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[8px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>{label}</span>
        <Icon size={10} style={{ color: color, opacity: 0.6 }} />
      </div>
      <div className="text-[16px] font-bold text-white">{value}</div>
      {change && <div className="text-[8px] mt-0.5" style={{ color: change.startsWith("+") ? "#22C55E" : "rgba(255,255,255,0.25)" }}>{change}</div>}
    </div>
  );
}

// ─── Role Dashboard Views ────────────────────────────────────────────────

function HotelDashboard({ completedSteps, currentStep }: { completedSteps: Set<number>; currentStep: number }) {
  const showForecast = completedSteps.has(0) || currentStep === 0;
  const showPOs = completedSteps.has(1) || currentStep === 1;
  const showMatch = completedSteps.has(2) || currentStep === 2;
  const showSettlement = completedSteps.has(3) || currentStep === 3;

  return (
    <div className="space-y-3">
      {/* Stats Row */}
      <div className="flex gap-2">
        <StatCard label="Total Spend" value="EGP 2.4M" change="+12.3% vs LY" color="#84cc16" icon={() => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
        <StatCard label="Active POs" value="18" change="+4 this week" color="#84cc16" icon={() => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg>} />
        <StatCard label="Forecast Acc." value="94%" change="+2.1%" color="#84cc16" icon={() => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>} />
        <StatCard label="Savings" value="EGP 187K" change="+5.4%" color="#84cc16" icon={() => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
      </div>

      {/* Chart Area */}
      {(showForecast || showPOs) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-3.5" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <span className="text-[8px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>AI Demand Forecast</span>
              <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>Next 14 days • Occupancy-based prediction</p>
            </div>
            {completedSteps.has(0) && <span className="text-[8px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "#84cc1615", color: "#84cc16" }}>Forecast Active</span>}
          </div>
          <MiniBarChart
            color="#84cc16"
            data={[
              { label: "Mon", value: 340, target: 320 },
              { label: "Tue", value: 310, target: 300 },
              { label: "Wed", value: 380, target: 350 },
              { label: "Thu", value: 420, target: 380 },
              { label: "Fri", value: 510, target: 450 },
              { label: "Sat", value: 580, target: 500 },
            ]}
          />
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: "#84cc16", opacity: 0.6 }} />
              <span className="text-[7px]" style={{ color: "rgba(255,255,255,0.25)" }}>Predicted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-[2px] rounded-sm" style={{ backgroundColor: "#84cc16", opacity: 0.4 }} />
              <span className="text-[7px]" style={{ color: "rgba(255,255,255,0.25)" }}>Target</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* POs Table */}
      {(showPOs || currentStep === 1) && completedSteps.has(1) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-3.5" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[8px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>Recent Purchase Orders</span>
            <span className="text-[8px]" style={{ color: "#84cc16" }}>View All →</span>
          </div>
          <MiniTable
            color="#84cc16"
            headers={["PO #", "Supplier", "Items", "Total", "Status"]}
            rows={[
              ["PO-0421", "Egyptian Linen Co.", "14 items", "EGP 247.8K", { text: "Approved", color: "#84cc16" }],
              ["PO-0420", "Nile Chemical Supply", "8 items", "EGP 89.2K", { text: "Pending", color: "#D4A843" }],
              ["PO-0419", "Cairo Kitchenware", "22 items", "EGP 312.5K", { text: "Approved", color: "#84cc16" }],
              ["PO-0418", "Delta Amenities", "6 items", "EGP 45.1K", { text: "Delivered", color: "#3B82F6" }],
            ]}
          />
        </motion.div>
      )}

      {/* Three-Way Match Flow */}
      {(showMatch || currentStep === 2) && completedSteps.has(2) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-3.5" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[8px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>Three-Way Match — Validated</span>
            <span className="text-[8px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "#84cc1615", color: "#84cc16" }}>● All Matched</span>
          </div>
          <div className="flex items-center justify-center gap-0">
            <div className="flex-1 text-center">
              <div className="w-10 h-10 rounded-full mx-auto mb-1 flex items-center justify-center" style={{ backgroundColor: "#84cc1615", border: "2px solid #84cc16" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/></svg>
              </div>
              <span className="text-[7px] font-medium" style={{ color: "#84cc16" }}>PO</span>
              <p className="text-[6px]" style={{ color: "rgba(255,255,255,0.2)" }}>#INVO-00421</p>
            </div>
            <svg width="40" height="2" viewBox="0 0 40 2"><line x1="0" y1="1" x2="40" y2="1" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/></svg>
            <div className="flex-1 text-center">
              <div className="w-10 h-10 rounded-full mx-auto mb-1 flex items-center justify-center" style={{ backgroundColor: "#84cc1615", border: "2px solid #84cc16" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </div>
              <span className="text-[7px] font-medium" style={{ color: "#84cc16" }}>GRN</span>
              <p className="text-[6px]" style={{ color: "rgba(255,255,255,0.2)" }}>Signed Digital</p>
            </div>
            <svg width="40" height="2" viewBox="0 0 40 2"><line x1="0" y1="1" x2="40" y2="1" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/></svg>
            <div className="flex-1 text-center">
              <div className="w-10 h-10 rounded-full mx-auto mb-1 flex items-center justify-center" style={{ backgroundColor: "#84cc1615", border: "2px solid #84cc16" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>
              </div>
              <span className="text-[7px] font-medium" style={{ color: "#84cc16" }}>ETA UUID</span>
              <p className="text-[6px]" style={{ color: "rgba(255,255,255,0.2)" }}>9b7e3f51</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Settlement Flow */}
      {(showSettlement || currentStep === 3) && completedSteps.has(3) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-3.5" style={{ backgroundColor: "#84cc1608", border: "1px solid #84cc1620" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-[9px] font-semibold" style={{ color: "#84cc16" }}>Settlement Complete — Net-60 Terms Active</span>
          </div>
          <p className="text-[8px]" style={{ color: "rgba(255,255,255,0.35)" }}>
            EGP 247,800 invoice settled via factoring pool. EGP 243,401.40 transferred to supplier. You pay in 60 days.
          </p>
        </motion.div>
      )}
    </div>
  );
}

function SupplierDashboard({ completedSteps, currentStep }: { completedSteps: Set<number>; currentStep: number }) {
  const showCatalog = completedSteps.has(0) || currentStep === 0;
  const showPO = completedSteps.has(1) || currentStep === 1;
  const showInvoice = completedSteps.has(2) || currentStep === 2;
  const showPayment = completedSteps.has(3) || currentStep === 3;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <StatCard label="Active Listings" value="1,247" change="+43 this week" color="#22C55E" icon={() => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>} />
        <StatCard label="Pending POs" value="8" change="EGP 1.2M total" color="#22C55E" icon={() => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18"/></svg>} />
        <StatCard label="Revenue MTD" value="EGP 847K" change="+18.2%" color="#22C55E" icon={() => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} />
        <StatCard label="Avg Rating" value="4.7★" change="Top 5% sellers" color="#22C55E" icon={() => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>} />
      </div>

      {showCatalog && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-3.5" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <span className="text-[8px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>Catalog — Categorized by AI</span>
              <p className="text-[7px]" style={{ color: "rgba(255,255,255,0.2)" }}>1,247 SKUs • 6 categories • 43 hotel matches</p>
            </div>
            {completedSteps.has(0) && <span className="text-[8px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "#22C55E15", color: "#22C55E" }}>Published</span>}
          </div>
          <div className="space-y-1.5">
            {[
              { cat: "F&B", count: 412, pct: 33, color: "#22C55E" },
              { cat: "Housekeeping", count: 284, pct: 23, color: "#3B82F6" },
              { cat: "Amenities", count: 198, pct: 16, color: "#D4A843" },
              { cat: "Engineering", count: 156, pct: 13, color: "#A855F7" },
              { cat: "Capital Equipment", count: 112, pct: 9, color: "#F97316" },
              { cat: "Consumables", count: 85, pct: 7, color: "#EC4899" },
            ].map((item) => (
              <div key={item.cat} className="flex items-center gap-2.5">
                <span className="text-[8px] w-20" style={{ color: "rgba(255,255,255,0.4)" }}>{item.cat}</span>
                <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  />
                </div>
                <span className="text-[8px] w-8 text-right font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {showPO && completedSteps.has(1) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-3.5" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[8px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>Incoming Purchase Orders</span>
            <span className="text-[8px]" style={{ color: "#22C55E" }}>Accept →</span>
          </div>
          <MiniTable
            color="#22C55E"
            headers={["Hotel", "PO #", "Items", "Total", "Window"]}
            rows={[
              ["Steigenberger El Gouna", "PO-0421", "14 items", "EGP 247.8K", { text: "72 hrs", color: "#22C55E" }],
              ["Jaz Almaza Beach", "PO-0422", "8 items", "EGP 89.2K", { text: "48 hrs", color: "#D4A843" }],
              ["Movenpick Resort", "PO-0423", "6 items", "EGP 45.1K", { text: "24 hrs", color: "#F97316" }],
            ]}
          />
        </motion.div>
      )}

      {showInvoice && completedSteps.has(2) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-3.5" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[8px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>ETA-Compliant Invoice</span>
            <span className="text-[8px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "#22C55E15", color: "#22C55E" }}>● ETA Accepted</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[9px]">
            <div><span className="block" style={{ color: "rgba(255,255,255,0.25)" }}>Invoice #</span><span className="text-white">HV-INV-00421</span></div>
            <div><span className="block" style={{ color: "rgba(255,255,255,0.25)" }}>ETA UUID</span><span className="text-white font-mono text-[7px]">9b7e3f51-2a8d-4c6e-b0f1-8d3e5a7c9b0a</span></div>
            <div><span className="block" style={{ color: "rgba(255,255,255,0.25)" }}>Digital Signature</span><span className="text-white font-mono text-[7px]">RSA-2048</span></div>
            <div><span className="block" style={{ color: "rgba(255,255,255,0.25)" }}>Status</span><span style={{ color: "#22C55E" }}>● ACCEPTED</span></div>
          </div>
        </motion.div>
      )}

      {showPayment && completedSteps.has(3) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-3.5" style={{ backgroundColor: "#22C55E08", border: "1px solid #22C55E20" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-[9px] font-semibold" style={{ color: "#22C55E" }}>Payment Received — 14 Hours</span>
          </div>
          <p className="text-[8px]" style={{ color: "rgba(255,255,255,0.35)" }}>
            EGP 243,401.40 settled to IBAN EG380039003445600000000123456. Non-recourse. No risk.
          </p>
        </motion.div>
      )}
    </div>
  );
}

function FactoringDashboard({ completedSteps, currentStep }: { completedSteps: Set<number>; currentStep: number }) {
  const showPool = completedSteps.has(0) || currentStep === 0;
  const showRisk = completedSteps.has(1) || currentStep === 1;
  const showBid = completedSteps.has(2) || currentStep === 2;
  const showSettlement = completedSteps.has(3) || currentStep === 3;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <StatCard label="Pool Volume" value="EGP 8.2M" change="37 invoices" color="#D4A843" icon={() => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>} />
        <StatCard label="Active Bids" value="3" change="2 new today" color="#D4A843" icon={() => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2"/></svg>} />
        <StatCard label="Avg Rate" value="1.85%" change="-0.15% MoM" color="#D4A843" icon={() => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} />
        <StatCard label="Capital Deployed" value="EGP 3.1M" change="38% of pool" color="#D4A843" icon={() => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>} />
      </div>

      {showPool && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-3.5" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <span className="text-[8px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>Invoice Pool</span>
              <p className="text-[7px]" style={{ color: "rgba(255,255,255,0.2)" }}>Pre-verified • Triple-matched • ETA-validated</p>
            </div>
            {completedSteps.has(0) && <span className="text-[8px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "#D4A84315", color: "#D4A843" }}>37 Available</span>}
          </div>
          <MiniTable
            color="#D4A843"
            headers={["Invoice", "Hotel", "Face Value", "Risk Tier", "Maturity"]}
            rows={[
              ["INV-00421", "Steigenberger", "EGP 247.8K", { text: "Low", color: "#22C55E" }, "45 days"],
              ["INV-00419", "Jaz Almaza", "EGP 312.5K", { text: "Low", color: "#22C55E" }, "60 days"],
              ["INV-00418", "Movenpick", "EGP 189.2K", { text: "Medium", color: "#D4A843" }, "30 days"],
              ["INV-00417", "Hilton Pyramids", "EGP 456.0K", { text: "Medium", color: "#D4A843" }, "90 days"],
              ["INV-00416", "Soma Bay", "EGP 98.4K", { text: "Low", color: "#22C55E" }, "30 days"],
            ]}
          />
        </motion.div>
      )}

      {showRisk && completedSteps.has(1) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-3.5" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[8px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>Risk Score Distribution</span>
            <span className="text-[8px]" style={{ color: "#D4A843" }}>AI-powered</span>
          </div>
          <div className="flex items-end justify-center gap-4 h-20">
            {[
              { label: "Low", value: 12, color: "#22C55E", pct: 32 },
              { label: "Medium", value: 18, color: "#D4A843", pct: 49 },
              { label: "High", value: 7, color: "#F97316", pct: 19 },
            ].map((tier) => (
              <div key={tier.label} className="flex flex-col items-center gap-1">
                <div className="relative w-12 rounded-t-md" style={{ height: `${tier.pct * 1.8}px`, backgroundColor: tier.color, opacity: 0.7 }} />
                <span className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>{tier.value}</span>
                <span className="text-[7px]" style={{ color: tier.color }}>{tier.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {showBid && completedSteps.has(2) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-3.5" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[8px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>Competitive Bid — INV-00421</span>
            <span className="text-[8px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "#D4A84315", color: "#D4A843" }}>Best Bid Placed</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg p-2.5 text-center" style={{ backgroundColor: "#D4A84310", border: "1px solid #D4A84320" }}>
              <span className="block text-[14px] font-bold" style={{ color: "#D4A843" }}>1.85%</span>
              <span className="text-[7px]" style={{ color: "rgba(255,255,255,0.3)" }}>Your Bid</span>
            </div>
            <div className="rounded-lg p-2.5 text-center" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="block text-[14px] font-bold text-white">1.95%</span>
              <span className="text-[7px]" style={{ color: "rgba(255,255,255,0.3)" }}>Competitor</span>
            </div>
            <div className="rounded-lg p-2.5 text-center" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="block text-[14px] font-bold text-white">14.2%</span>
              <span className="text-[7px]" style={{ color: "rgba(255,255,255,0.3)" }}>Est. APR</span>
            </div>
            <div className="rounded-lg p-2.5 text-center" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="block text-[14px] font-bold text-white">EGP 243.2K</span>
              <span className="text-[7px]" style={{ color: "rgba(255,255,255,0.3)" }}>Payout</span>
            </div>
          </div>
        </motion.div>
      )}

      {showSettlement && completedSteps.has(3) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-3.5" style={{ backgroundColor: "#D4A84308", border: "1px solid #D4A84320" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-[9px] font-semibold" style={{ color: "#D4A843" }}>Bank-Direct Settlement Confirmed</span>
          </div>
          <p className="text-[8px]" style={{ color: "rgba(255,255,255,0.35)" }}>
            EGP 243,209.70 transferred CIB → Supplier IBAN. Non-recourse. Clean balance-sheet. Ref: SET-2026-05-14-089.
          </p>
        </motion.div>
      )}
    </div>
  );
}

function LogisticsDashboard({ completedSteps, currentStep }: { completedSteps: Set<number>; currentStep: number }) {
  const showLoads = completedSteps.has(0) || currentStep === 0;
  const showRoute = completedSteps.has(1) || currentStep === 1;
  const showDelivery = completedSteps.has(2) || currentStep === 2;
  const showPayment = completedSteps.has(3) || currentStep === 3;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <StatCard label="Active Routes" value="12" change="+3 this week" color="#3B82F6" icon={() => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} />
        <StatCard label="Deliveries Today" value="47" change="92% on-time" color="#3B82F6" icon={() => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>} />
        <StatCard label="Utilization" value="87%" change="+12% MoM" color="#3B82F6" icon={() => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>} />
        <StatCard label="Fuel Savings" value="34%" change="vs individual" color="#3B82F6" icon={() => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
      </div>

      {showLoads && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-3.5" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <span className="text-[8px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>Available Loads — Red Sea Corridor</span>
              <p className="text-[7px]" style={{ color: "rgba(255,255,255,0.2)" }}>Multi-supplier consolidation • 87% utilization</p>
            </div>
            {completedSteps.has(0) && <span className="text-[8px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "#3B82F615", color: "#3B82F6" }}>12 Loads</span>}
          </div>
          <MiniTable
            color="#3B82F6"
            headers={["Route", "Suppliers", "Weight", "Distance", "Fuel Cost"]}
            rows={[
              ["Cairo → Hurghada", "4 suppliers", "3.2 tons", "487 km", "EGP 4,280"],
              ["Alexandria → Marsa Matruh", "3 suppliers", "2.1 tons", "290 km", "EGP 2,150"],
              ["Suez → Sharm El Sheikh", "5 suppliers", "4.5 tons", "380 km", "EGP 3,870"],
            ]}
          />
        </motion.div>
      )}

      {showRoute && completedSteps.has(1) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-3.5" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[8px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>Optimized Route — Timeline</span>
            <span className="text-[8px]" style={{ color: "#3B82F6" }}>ETA 08:30</span>
          </div>
          <div className="space-y-2">
            {[
              { stop: "Cairo Hub", time: "14:00", done: true },
              { stop: "Sokhna", time: "15:30", done: true },
              { stop: "El Gouna", time: "22:15", done: true },
              { stop: "Hurghada", time: "23:45", done: false },
              { stop: "Marsa Alam", time: "08:30", done: false },
            ].map((s) => (
              <div key={s.stop} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full ${s.done ? "" : "border-2"}`} style={{ backgroundColor: s.done ? "#3B82F6" : "transparent", borderColor: s.done ? "#3B82F6" : "rgba(255,255,255,0.15)" }} />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-[9px]" style={{ color: s.done ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)" }}>{s.stop}</span>
                  <span className="text-[8px] font-mono" style={{ color: s.done ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)" }}>{s.time}</span>
                </div>
                {s.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {showDelivery && completedSteps.has(2) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-3.5" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[8px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>Digital Proof of Delivery</span>
            <span className="text-[8px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "#22C55E15", color: "#22C55E" }}>● POD Captured</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[8px]">
            <div className="rounded-lg p-2" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
              <span className="block" style={{ color: "rgba(255,255,255,0.25)" }}>Location</span>
              <span className="text-white">Jaz Almaza Resort</span>
            </div>
            <div className="rounded-lg p-2" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
              <span className="block" style={{ color: "rgba(255,255,255,0.25)" }}>Items</span>
              <span className="text-white">14 cartons</span>
            </div>
            <div className="rounded-lg p-2" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
              <span className="block" style={{ color: "rgba(255,255,255,0.25)" }}>GRN #</span>
              <span className="text-white font-mono">GRN-ALM-003</span>
            </div>
          </div>
        </motion.div>
      )}

      {showPayment && completedSteps.has(3) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-3.5" style={{ backgroundColor: "#3B82F608", border: "1px solid #3B82F620" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-[9px] font-semibold" style={{ color: "#3B82F6" }}>Payment Released — 3 Hours</span>
          </div>
          <p className="text-[8px]" style={{ color: "rgba(255,255,255,0.35)" }}>
            EGP 18,420 settled to IBAN EG380039003445600000000789012. Auto-reconciled. Ref: PAY-LOG-2026-05-14-022.
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────

function AdminDashboard({ completedSteps, currentStep }: { completedSteps: Set<number>; currentStep: number }) {
  const showTenants = completedSteps.has(0) || currentStep === 0;
  const showFees = completedSteps.has(1) || currentStep === 1;
  const showAudit = completedSteps.has(2) || currentStep === 2;
  const showAlerts = completedSteps.has(3) || currentStep === 3;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <StatCard label="Active Tenants" value="24" change="+3 this month" color="#A855F7" icon={() => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>} />
        <StatCard label="Platform GMV" value="EGP 18.2M" change="+22.4% MoM" color="#A855F7" icon={() => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} />
        <StatCard label="Fee Revenue" value="EGP 847K" change="+18.2%" color="#A855F7" icon={() => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
        <StatCard label="Settlements" value="1,247" change="99.97% success" color="#A855F7" icon={() => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>} />
      </div>

      {showTenants && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-3.5" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <span className="text-[8px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>Tenant Overview</span>
              <p className="text-[7px]" style={{ color: "rgba(255,255,255,0.2)" }}>24 active tenants • 12 on trial • 8 enterprise</p>
            </div>
            {completedSteps.has(0) && <span className="text-[8px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "#A855F715", color: "#A855F7" }}>Monitored</span>}
          </div>
          <MiniTable
            color="#A855F7"
            headers={["Tenant", "Type", "Properties", "GMV", "Status"]}
            rows={[
              ["Steigenberger Group", "Hotel Chain", "12", "EGP 3.2M", { text: "Active", color: "#22C55E" }],
              ["Egyptian Linen Co.", "Supplier", "—", "EGP 847K", { text: "Active", color: "#22C55E" }],
              ["CIB Capital", "Funder", "—", "EGP 8.2M", { text: "Active", color: "#22C55E" }],
              ["Delta Logistics", "Shipper", "—", "EGP 247K", { text: "Trial", color: "#D4A843" }],
              ["Jaz Hotels", "Hotel Chain", "8", "EGP 1.1M", { text: "Onboarding", color: "#3B82F6" }],
            ]}
          />
        </motion.div>
      )}

      {showFees && completedSteps.has(1) && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-3.5" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[8px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>Fee Revenue Breakdown</span>
            <span className="text-[8px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "#A855F715", color: "#A855F7" }}>Subscription + Funding</span>
          </div>
          <div className="space-y-2">
            {[
              { item: "Subscription Fees", amount: "EGP 198K", pct: 23, color: "#A855F7" },
              { item: "Funding Fees (HV)", amount: "EGP 512K", pct: 60, color: "#84cc16" },
              { item: "Logistics Margin", amount: "EGP 93K", pct: 11, color: "#3B82F6" },
              { item: "Value-Added Services", amount: "EGP 44K", pct: 6, color: "#D4A843" },
            ].map((item) => (
              <div key={item.item} className="flex items-center gap-2">
                <span className="text-[8px] w-28" style={{ color: "rgba(255,255,255,0.4)" }}>{item.item}</span>
                <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <motion.div className="h-full rounded-full" style={{ backgroundColor: item.color }} initial={{ width: "0%" }} animate={{ width: `${item.pct}%` }} transition={{ duration: 0.8 }} />
                </div>
                <span className="text-[8px] w-20 text-right font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>{item.amount}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t flex justify-between" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            <span className="text-[9px] font-medium text-white/40">Total Platform Revenue</span>
            <span className="text-[9px] font-bold text-white">EGP 847K</span>
          </div>
        </motion.div>
      )}

      {showAudit && completedSteps.has(2) && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-3.5" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[8px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>Audit Log — Recent Events</span>
            <span className="text-[8px]" style={{ color: "#A855F7" }}>View Full Log →</span>
          </div>
          <div className="space-y-1.5">
            {[
              { time: "14:23:01", event: "Order INV-00421 → CONFIRMED", actor: "System", type: "auto" },
              { time: "14:22:45", event: "Fee deducted: EGP 4,584 from INV-00421", actor: "Fee Engine", type: "auto" },
              { time: "14:20:10", event: "Tenant 'Jaz Hotels' → ONBOARDING_COMPLETE", actor: "admin@hv", type: "manual" },
              { time: "13:55:00", event: "ETA UUID 9b7e3f51 → VALIDATED", actor: "ETA Bridge", type: "auto" },
              { time: "12:30:22", event: "Authority override: PO-0419 approved", actor: "admin@hv", type: "alert" },
            ].map((entry) => (
              <div key={entry.time} className="flex items-center gap-2 p-1.5 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.01)" }}>
                <span className="text-[7px] font-mono" style={{ color: "rgba(255,255,255,0.15)" }}>{entry.time}</span>
                <span className="text-[8px] flex-1" style={{ color: "rgba(255,255,255,0.4)" }}>{entry.event}</span>
                <span className={`text-[7px] px-1 py-0.5 rounded font-medium ${
                  entry.type === "auto" ? "" : entry.type === "manual" ? "" : ""
                }`} style={{
                  backgroundColor: entry.type === "auto" ? "rgba(34,197,94,0.08)" : entry.type === "alert" ? "rgba(239,68,68,0.08)" : "rgba(59,130,246,0.08)",
                  color: entry.type === "auto" ? "#22C55E" : entry.type === "alert" ? "#ef4444" : "#3B82F6"
                }}>{entry.actor}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {showAlerts && completedSteps.has(3) && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-3.5" style={{ backgroundColor: "#A855F708", border: "1px solid #A855F720" }}>
          <div className="flex items-center gap-2 mb-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span className="text-[9px] font-semibold" style={{ color: "#A855F7" }}>Platform Health: All Systems Normal</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              { metric: "Uptime (30d)", value: "99.99%", status: "ok" },
              { metric: "Avg Response", value: "187ms", status: "ok" },
              { metric: "Pending Escalations", value: "0", status: "ok" },
              { metric: "Queue Depth", value: "12 msg", status: "ok" },
            ].map((m) => (
              <div key={m.metric} className="rounded-lg p-2 text-center" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                <span className="block text-[7px]" style={{ color: "rgba(255,255,255,0.2)" }}>{m.metric}</span>
                <span className="block text-[14px] font-bold text-white">{m.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── ETA Compliance Officer Dashboard ──────────────────────────────────────

function ETAOfficerDashboard({ completedSteps, currentStep }: { completedSteps: Set<number>; currentStep: number }) {
  const showQueue = completedSteps.has(0) || currentStep === 0;
  const showValidations = completedSteps.has(1) || currentStep === 1;
  const showCompliance = completedSteps.has(2) || currentStep === 2;
  const showReport = completedSteps.has(3) || currentStep === 3;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <StatCard label="Invoices Today" value="47" change="ETA: 47/47 accepted" color="#F97316" icon={() => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} />
        <StatCard label="Pending Review" value="3" change="3 flagged anomalies" color="#F97316" icon={() => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>} />
        <StatCard label="Compliance Rate" value="99.2%" change="+0.4% WoW" color="#F97316" icon={() => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} />
        <StatCard label="etaStatus" value="ACCEPTED" change="Live connection" color="#F97316" icon={() => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} />
      </div>

      {showQueue && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-3.5" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <span className="text-[8px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>ETA Submission Queue</span>
              <p className="text-[7px]" style={{ color: "rgba(255,255,255,0.2)" }}>Real-time pipeline • RSA-2048 • UUID tracking</p>
            </div>
            {completedSteps.has(0) && <span className="text-[8px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "#F9731615", color: "#F97316" }}>Queue Clear</span>}
          </div>
          <MiniTable
            color="#F97316"
            headers={["Invoice", "Tenant", "Amount", "ETA Status", "UUID"]}
            rows={[
              ["HV-INV-00421", "Steigenberger", "EGP 247.8K", { text: "ACCEPTED", color: "#22C55E" }, "9b7e3f51…"],
              ["HV-INV-00422", "Jaz Almaza", "EGP 189.2K", { text: "ACCEPTED", color: "#22C55E" }, "a1b2c3d4…"],
              ["HV-INV-00423", "Movenpick", "EGP 312.5K", { text: "PENDING", color: "#D4A843" }, "e5f6g7h8…"],
              ["HV-INV-00424", "Hilton Pyramids", "EGP 456.0K", { text: "VALIDATED", color: "#3B82F6" }, "i9j0k1l2…"],
            ]}
          />
        </motion.div>
      )}

      {showValidations && completedSteps.has(1) && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-3.5" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[8px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>Three-Way Validation Gate</span>
            <span className="text-[8px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "#22C55E15", color: "#22C55E" }}>All Passed</span>
          </div>
          <div className="rounded-lg p-3" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
            {[
              { check: "PO Match", status: "✓", detail: "PO-00421 matches invoice line items 14/14" },
              { check: "ETA UUID Validation", status: "✓", detail: "UUID 9b7e3f51-2a8d… → ETA Portal: ACCEPTED" },
              { check: "Digital Signature", status: "✓", detail: "RSA-2048 signature verified against ETA public key" },
              { check: "GRN Signed", status: "✓", detail: "Digital GRN #GRN-ALM-003 signed by Steigenberger" },
              { check: "Tax Code Mapping", status: "✓", detail: "GS1/EGS codes mapped — 14 items all compliant" },
            ].map((item) => (
              <div key={item.check} className="flex items-center gap-2 py-1.5 border-b last:border-0" style={{ borderColor: "rgba(255,255,255,0.03)" }}>
                <span className="text-[10px]" style={{ color: "#22C55E" }}>{item.status}</span>
                <span className="text-[9px] font-medium w-28" style={{ color: "rgba(255,255,255,0.5)" }}>{item.check}</span>
                <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.25)" }}>{item.detail}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {showCompliance && completedSteps.has(2) && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-3.5" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[8px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>FRA Compliance Report</span>
            <span className="text-[8px]" style={{ color: "#F97316" }}>Download →</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {[
              { metric: "Anti-Fraud (3-Way Match)", value: "100%", status: "pass" },
              { metric: "Cryptographic Audit Trail", value: "SHA-256", status: "pass" },
              { metric: "Data at Rest Encryption", value: "AES-256-GCM", status: "pass" },
              { metric: "Tenant Data Isolation", value: "RLS Active", status: "pass" },
              { metric: "Session Security", value: "TLS 1.3", status: "pass" },
              { metric: "Access Control", value: "RBAC + Matrix", status: "pass" },
            ].map((m) => (
              <div key={m.metric} className="flex items-center gap-2 p-1.5 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.01)" }}>
                <span className="text-[8px] flex-1" style={{ color: "rgba(255,255,255,0.3)" }}>{m.metric}</span>
                <span className="text-[8px] font-mono" style={{ color: "#22C55E" }}>{m.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {showReport && completedSteps.has(3) && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-3.5" style={{ backgroundColor: "#F9731608", border: "1px solid #F9731620" }}>
          <div className="flex items-center gap-2 mb-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-[9px] font-semibold" style={{ color: "#F97316" }}>Compliance Audit — All Clear</span>
          </div>
          <p className="text-[8px]" style={{ color: "rgba(255,255,255,0.35)" }}>
            All 47 invoices today passed ETA validation. Zero rejections. Zero failed signatures. FRA anti-fraud gates: 100% pass rate. Next scheduled audit: 30 days.
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ─── Main Container ──────────────────────────────────────────────────────

export function SandboxDashboard({ role, completedSteps, currentStep }: DashboardProps) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#080808", border: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: "rgba(255,255,255,0.04)", backgroundColor: "rgba(255,255,255,0.01)" }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#22C55E" }} />
          <span className="text-[9px] font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Live Sandbox</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[7px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.2)" }}>
            Demo Mode
          </span>
        </div>
      </div>

      {/* Dashboard Body */}
      <div className="p-3.5">
        {role === "hotel" && <HotelDashboard completedSteps={completedSteps} currentStep={currentStep} />}
        {role === "supplier" && <SupplierDashboard completedSteps={completedSteps} currentStep={currentStep} />}
        {role === "factoring" && <FactoringDashboard completedSteps={completedSteps} currentStep={currentStep} />}
        {role === "shipping" && <LogisticsDashboard completedSteps={completedSteps} currentStep={currentStep} />}
        {role === "admin" && <AdminDashboard completedSteps={completedSteps} currentStep={currentStep} />}
        {role === "eta-officer" && <ETAOfficerDashboard completedSteps={completedSteps} currentStep={currentStep} />}
      </div>
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────

export function EmptySandboxState() {
  return (
    <div className="rounded-2xl p-10 flex flex-col items-center justify-center text-center" style={{ backgroundColor: "#080808", border: "1px solid rgba(255,255,255,0.06)", minHeight: "400px" }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(132,204,22,0.06)" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="1.5" opacity={0.4}>
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      </div>
      <h3 className="text-[14px] font-semibold text-white mb-2">Select a Role</h3>
      <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)", maxWidth: "240px" }}>
        Choose a stakeholder role to see the platform in action with real data visualizations.
      </p>
    </div>
  );
}
