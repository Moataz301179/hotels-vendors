"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, MapPin, Star, ShieldCheck, Zap, ArrowRight } from "lucide-react";

const A = "#FF6B00";
const AM = "rgba(255,107,0,0.08)";
const AB = "rgba(255,107,0,0.25)";
const AG = "rgba(255,107,0,0.15)";
const S1 = "#080B12";
const SC = "#0C1018";
const B1 = "rgba(255,255,255,0.06)";
const BH = "rgba(255,255,255,0.12)";

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const CATEGORIES = [
  { name: "F&B", count: "186", coverage: "94%", hot: true },
  { name: "Consumables", count: "142", coverage: "88%", hot: true },
  { name: "Guest Supplies", count: "124", coverage: "82%", hot: false },
  { name: "FF&E", count: "98", coverage: "76%", hot: false },
  { name: "Services", count: "72", coverage: "71%", hot: false },
];

const GOVERNORATES = [
  { name: "Sharm El-Sheikh", suppliers: 248, fill: 92 },
  { name: "Hurghada", suppliers: 186, fill: 78 },
  { name: "Cairo", suppliers: 312, fill: 65 },
  { name: "Alexandria", suppliers: 94, fill: 45 },
  { name: "North Coast", suppliers: 62, fill: 32 },
  { name: "Marsa Matruh", suppliers: 38, fill: 18 },
];

export function VendorNetwork() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: "#000000" }}>
      <div
        className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${AG} 0%, transparent 70%)`, opacity: 0.3 }}
      />
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 block" style={{ color: A }}>
              Layer 1 · Marketplace
            </span>
            <h2
              className="text-[26px] md:text-[36px] lg:text-[40px] font-normal tracking-tight text-white mb-4 leading-[1.1]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              680+ Verified Suppliers.
              <br />
              One Searchable Network.
            </h2>
            <p className="text-[14px] md:text-[15px] text-white/40 max-w-lg mx-auto leading-relaxed">
              Every supplier is KYC-verified, trade-licensed, and scored on delivery performance, pricing, and compliance history.
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Category breakdown */}
          <div className="lg:col-span-2 space-y-4">
            <Reveal>
              <div className="rounded-2xl p-6" style={{ backgroundColor: SC, border: `1px solid ${B1}` }}>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: AM, border: `1px solid ${AB}` }}>
                    <ShieldCheck size={16} style={{ color: A }} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: A }}>By Category</span>
                    <p className="text-[10px] text-white/25">Supplier count · Coverage</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {CATEGORIES.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[13px] font-medium text-white/70">{cat.name}</span>
                        {cat.hot && (
                          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: AM, color: A }}>
                            HOT
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-white/30">{cat.count}</span>
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: A }}
                            initial={{ width: 0 }}
                            whileInView={{ width: cat.coverage }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3 }}
                          />
                        </div>
                        <span className="text-[11px] font-bold" style={{ color: A }}>{cat.coverage}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-2xl p-6" style={{ backgroundColor: SC, border: `1px solid ${B1}` }}>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: AM, border: `1px solid ${AB}` }}>
                    <MapPin size={16} style={{ color: A }} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: A }}>By Governorate</span>
                    <p className="text-[10px] text-white/25">Active suppliers</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {GOVERNORATES.map((g) => (
                    <div key={g.name} className="flex items-center justify-between">
                      <span className="text-[12px] text-white/50">{g.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: A, opacity: 0.6 }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${g.fill}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.4 }}
                          />
                        </div>
                        <span className="text-[11px] text-white/30 w-6 text-right">{g.suppliers}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: Featured suppliers mockup */}
          <div className="lg:col-span-3">
            <Reveal delay={0.05}>
              <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: SC, border: `1px solid ${B1}` }}>
                <div className="p-5 flex items-center justify-between" style={{ borderBottom: `1px solid ${B1}` }}>
                  <div className="flex items-center gap-2">
                    <Zap size={14} style={{ color: A }} />
                    <span className="text-[12px] font-semibold text-white/80">Top-Rated Suppliers</span>
                  </div>
                  <span className="text-[10px] text-white/25">Live from network</span>
                </div>
                <div className="divide-y" style={{ borderColor: B1 }}>
                  {[
                    { name: "NileFresh Produce", cat: "F&B", rating: 4.9, onTime: "98%", location: "Cairo → Sharm", badge: "Platinum" },
                    { name: "Red Sea Linen Co.", cat: "Consumables", rating: 4.8, onTime: "96%", location: "Hurghada", badge: "Gold" },
                    { name: "Pharaoh Chemicals", cat: "Consumables", rating: 4.7, onTime: "94%", location: "Alexandria", badge: "Gold" },
                    { name: "Cleopatra Amenities", cat: "Guest Supplies", rating: 4.9, onTime: "99%", location: "Cairo", badge: "Platinum" },
                    { name: "Oasis FF&E", cat: "FF&E", rating: 4.6, onTime: "91%", location: "6th October", badge: "Silver" },
                  ].map((s, i) => (
                    <motion.div
                      key={s.name}
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: AM, border: `1px solid ${AB}` }}>
                          <span className="text-[10px] font-bold" style={{ color: A }}>{s.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-medium text-white/80">{s.name}</span>
                            <span
                              className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{
                                backgroundColor: s.badge === "Platinum" ? "rgba(255,107,0,0.12)" : s.badge === "Gold" ? "rgba(234,179,8,0.12)" : "rgba(148,163,184,0.12)",
                                color: s.badge === "Platinum" ? A : s.badge === "Gold" ? "#EAB308" : "#94A3B8",
                              }}
                            >
                              {s.badge}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-white/25">{s.cat}</span>
                            <span className="text-[10px] text-white/10">·</span>
                            <span className="text-[10px] text-white/25">{s.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-1">
                          <Star size={10} style={{ color: "#EAB308" }} fill="#EAB308" />
                          <span className="text-[11px] text-white/40">{s.rating}</span>
                        </div>
                        <span className="text-[11px] font-bold" style={{ color: A }}>{s.onTime}</span>
                        <span className="text-[10px] text-white/20">on-time</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="p-4 flex items-center justify-between" style={{ borderTop: `1px solid ${B1}` }}>
                  <span className="text-[11px] text-white/25">Showing top 5 of 680+ verified suppliers</span>
                  <div className="flex items-center gap-1 text-[11px] font-medium" style={{ color: A }}>
                    Browse all <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Marketplace preview image */}
        <Reveal delay={0.15}>
          <div className="mt-8 rounded-2xl overflow-hidden" style={{ border: `1px solid ${B1}` }}>
            <img
              src="/previews/marketplace-preview.png"
              alt="Verified B2B Supplier Marketplace"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
