"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Truck,
  MapPin,
  Clock,
  TrendingDown,
  Route,
  Package,
  CheckCircle,
  ArrowRight,
  Gauge,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

const governorates = [
  { name: "Cairo", hubs: 4, avgDelivery: "Same day", coverage: "100%" },
  { name: "Alexandria", hubs: 2, avgDelivery: "Next day", coverage: "95%" },
  { name: "Gouna", hubs: 1, avgDelivery: "24-48 hrs", coverage: "90%" },
  { name: "Sharm El-Sheikh", hubs: 1, avgDelivery: "24-48 hrs", coverage: "90%" },
  { name: "Hurghada", hubs: 1, avgDelivery: "24-48 hrs", coverage: "90%" },
  { name: "North Coast", hubs: 1, avgDelivery: "24-48 hrs", coverage: "85%" },
];

const features = [
  {
    icon: <Route size={18} />,
    title: "Intelligent Route Consolidation",
    desc: "AI engine combines deliveries from multiple suppliers into shared routes, reducing empty miles and fuel costs by up to 40%.",
  },
  {
    icon: <Gauge size={18} />,
    title: "Real-Time Load Optimization",
    desc: "Dynamic cargo matching ensures every truck runs at optimal capacity. No half-empty loads, no wasted trips.",
  },
  {
    icon: <Clock size={18} />,
    title: "Live Delivery Tracking",
    desc: "Track every shipment in real-time from pickup to drop-off. ETA updates every 30 seconds via GPS.",
  },
  {
    icon: <Package size={18} />,
    title: "Multi-Temperature Zones",
    desc: "Chilled, frozen, and ambient cargo in the same vehicle with separate temperature-controlled compartments.",
  },
];

const howItWorks = [
  {
    num: "01",
    title: "Order Consolidation",
    desc: "AI aggregates orders from multiple suppliers heading to the same hotel or zone.",
  },
  {
    num: "02",
    title: "Route Optimization",
    desc: "Machine learning calculates the most efficient path across all pickups and drop-offs.",
  },
  {
    num: "03",
    title: "Shared Dispatch",
    desc: "One truck, multiple suppliers. Hotels receive consolidated deliveries with single sign-off.",
  },
  {
    num: "04",
    title: "Cost Split",
    desc: "Delivery costs are automatically prorated across all suppliers on the route.",
  },
];

const savingsData = [
  { metric: "40%", label: "Cost Reduction", detail: "vs. individual supplier deliveries" },
  { metric: "65%", label: "Fewer Trucks", detail: "on shared routes" },
  { metric: "Same Day", label: "Cairo Delivery", detail: "for orders before 10 AM" },
  { metric: "30%", label: "CO2 Reduction", detail: "per delivery on shared routes" },
];

export default function ShippingPage() {
  const [routeFrom, setRouteFrom] = useState("Cairo");
  const [routeTo, setRouteTo] = useState("Gouna");
  const [cargoWeight, setCargoWeight] = useState(500);
  const [shared, setShared] = useState(true);

  const baseRate =
    routeFrom === routeTo
      ? 150
      : routeFrom === "Cairo" &&
        (routeTo === "Alexandria" || routeTo === "North Coast")
        ? 450
        : routeFrom === "Cairo" &&
          (routeTo === "Gouna" ||
            routeTo === "Sharm El-Sheikh" ||
            routeTo === "Hurghada")
          ? 850
          : 600;

  const weightCost = cargoWeight * 0.8;
  const individualTotal = baseRate + weightCost;
  const sharedTotal = shared
    ? Math.round(individualTotal * 0.6)
    : individualTotal;
  const savings = individualTotal - sharedTotal;

  return (
    <main className="min-h-screen bg-black">
      <MarketingNav />

      {/* Hero */}
      <section className="pt-36 pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <p className="label-upper mb-3">Shared-Route Logistics</p>
          <h1 className="text-[32px] md:text-[48px] font-medium text-white leading-[1.1] mb-5">
            40% Cost Reduction via
            <br />
            Intelligent Route Sharing
          </h1>
          <p className="text-[13px] text-white/40 max-w-2xl leading-relaxed mb-8">
            Our AI-powered logistics engine consolidates deliveries from multiple
            suppliers into shared routes across 6 Egyptian governorates. Hotels
            get consolidated deliveries. Suppliers pay less. The planet benefits.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/register" className="btn-accent">
              <Truck size={14} /> Start Shipping
            </Link>
            <Link href="/marketplace" className="btn-ghost">
              Browse Suppliers
            </Link>
          </div>
        </div>
      </section>

      {/* Savings Stats */}
      <section className="pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {savingsData.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="surface-card p-6 text-center"
              >
                <p className="text-[28px] font-medium text-white mb-1">
                  {s.metric}
                </p>
                <p className="text-[12px] font-medium text-white/50 mb-0.5">
                  {s.label}
                </p>
                <p className="text-[10px] text-white/25">{s.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20" style={{ background: "var(--bg-surface-1)" }}>
        <div className="mx-auto max-w-6xl px-6">
          <p className="label-upper mb-3">Technology</p>
          <h2 className="text-[20px] font-medium text-white mb-8">
            How Shared-Route Works
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i} className="surface-card p-6">
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4 text-white/25">
                  {f.icon}
                </div>
                <h3 className="text-[14px] font-medium text-white/70 mb-2">
                  {f.title}
                </h3>
                <p className="text-[12px] text-white/40 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="label-upper mb-3">Workflow</p>
          <h2 className="text-[20px] font-medium text-white mb-8">
            The Consolidation Process
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <div key={i} className="text-center">
                <span className="text-[36px] font-light text-white/[0.10]">
                  {step.num}
                </span>
                <h3 className="text-[14px] font-medium text-white/70 mt-2 mb-2">
                  {step.title}
                </h3>
                <p className="text-[11px] text-white/40 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Map */}
      <section className="py-20" style={{ background: "var(--bg-surface-1)" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin size={16} className="text-[#D4A843]" />
            <div>
              <span className="label-upper">Coverage</span>
              <h2 className="text-[20px] font-medium text-white">
                6 Governorates Served
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {governorates.map((g) => (
              <div key={g.name} className="surface-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[13px] font-medium text-white/70">
                    {g.name}
                  </h3>
                  <span className="text-[9px] px-1.5 py-0.5 bg-green-500/10 text-green-400 rounded-full">
                    {g.coverage}
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-white/25">
                  <div className="flex justify-between">
                    <span>Hubs</span>
                    <span className="text-white/60">{g.hubs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Delivery</span>
                    <span className="text-white/60">{g.avgDelivery}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Calculator */}
      <section className="pt-16 pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <p className="label-upper mb-2">Estimator</p>
              <h2 className="text-[20px] font-medium text-white">
                Delivery Cost Calculator
              </h2>
              <p className="text-[12px] text-white/25 mt-1">
                See your savings with shared-route logistics
              </p>
            </div>

            <div
              className="surface-card p-6 space-y-4"
            >
              {/* From / To */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-white/50 mb-1.5 block">
                    From
                  </label>
                  <select
                    value={routeFrom}
                    onChange={(e) => setRouteFrom(e.target.value)}
                    className="w-full surface-input px-3 py-2.5 text-[12px]"
                  >
                    {governorates.map((g) => (
                      <option key={g.name} value={g.name}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-white/50 mb-1.5 block">
                    To
                  </label>
                  <select
                    value={routeTo}
                    onChange={(e) => setRouteTo(e.target.value)}
                    className="w-full surface-input px-3 py-2.5 text-[12px]"
                  >
                    {governorates.map((g) => (
                      <option key={g.name} value={g.name}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="text-[11px] font-medium text-white/50 mb-1.5 block">
                  Cargo Weight: {cargoWeight} kg
                </label>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={cargoWeight}
                  onChange={(e) => setCargoWeight(Number(e.target.value))}
                  className="w-full accent-[#D4A843]"
                />
              </div>

              {/* Shared toggle */}
              <label
                className="flex items-center gap-2.5 cursor-pointer p-3 rounded-xl"
                style={{ background: "var(--bg-surface-1)" }}
              >
                <input
                  type="checkbox"
                  checked={shared}
                  onChange={(e) => setShared(e.target.checked)}
                  className="rounded accent-[#D4A843]"
                />
                <span className="text-[12px] text-white/50">
                  Use shared-route consolidation
                </span>
                {shared && (
                  <CheckCircle
                    size={14}
                    className="text-[#D4A843] ml-auto"
                  />
                )}
              </label>

              {/* Result */}
              <div
                className="p-4 rounded-xl"
                style={{ background: "var(--bg-surface-1)" }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] text-white/25">
                    Individual delivery
                  </span>
                  <span className="text-[12px] text-white/25 line-through">
                    EGP {individualTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[12px] font-medium text-white/60">
                    Shared-route delivery
                  </span>
                  <span className="text-[18px] font-medium text-[#D4A843]">
                    EGP {sharedTotal.toLocaleString()}
                  </span>
                </div>
                {shared && (
                  <div className="flex items-center gap-1.5 text-[11px] text-green-400">
                    <TrendingDown size={12} /> You save EGP{" "}
                    {savings.toLocaleString()} (
                    {Math.round((savings / individualTotal) * 100)}%)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "var(--bg-surface-1)" }}>
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-[22px] font-medium text-white mb-4">
            Ready to Cut Delivery Costs?
          </h2>
          <p className="text-[13px] text-white/40 mb-8 max-w-lg mx-auto">
            Join hotels and suppliers already using HotelsVendors shared-route
            logistics across Egypt&apos;s top hospitality destinations.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register" className="btn-accent">
              Get Started <ArrowRight size={14} />
            </Link>
            <Link href="/marketplace" className="btn-ghost">
              Browse Suppliers
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
