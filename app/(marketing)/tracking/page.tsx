import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Package, FileCheck, Truck, CheckCircle2, Clock, MapPin, Bell, Search } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingPage } from "@/components/layout/marketing-page";

export const metadata: Metadata = {
  title: "Order Tracking — Real-Time Procurement Visibility | HotelsVendors",
  description: "Track every purchase order from issuance to delivery and settlement. Real-time status updates, ETA compliance confirmation, and delivery proof — all in one timeline.",
  keywords: ["hotel order tracking Egypt", "procurement status dashboard", "B2B delivery visibility", "ETA invoice status", "supply chain tracking Sharm El-Sheikh"],
  openGraph: {
    title: "Order Tracking — Real-Time Procurement Visibility",
    description: "Track every purchase order from issuance to delivery and settlement.",
    type: "website",
  },
};

const stages = [
  {
    step: "01",
    title: "PO Issued",
    desc: "Purchase order generated and sent to supplier. Budget validated against your Authority Matrix.",
    icon: Package,
    status: "complete",
  },
  {
    step: "02",
    title: "ETA Cleared",
    desc: "Supplier issues e-invoice. Three-way match confirmed: PO + UUID + Digital Delivery Note.",
    icon: FileCheck,
    status: "complete",
  },
  {
    step: "03",
    title: "In Transit",
    desc: "Goods dispatched. GPS-tracked via Shark-Breaker logistics. Live ETA updated every 30 minutes.",
    icon: Truck,
    status: "active",
  },
  {
    step: "04",
    title: "Delivered & Settled",
    desc: "Delivery confirmed with digital proof. Invoice enters factoring pool. Supplier paid within 48 hours.",
    icon: CheckCircle2,
    status: "pending",
  },
];

export default function TrackingPage() {
  return (
    <MarketingPage>
      <MarketingNav />

      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[300px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <span className="label-upper mb-3 block">Order Tracking</span>
          <h1 className="text-[clamp(28px,5vw,48px)] font-medium leading-[1.05] tracking-tight mb-5">
            Every Order,<br />
            <span className="text-gradient-accent">Every Step, Visible.</span>
          </h1>
          <p className="text-[15px] text-secondary max-w-2xl leading-relaxed mb-8">
            From the moment you issue a PO to final settlement — track status in real-time.
            No more WhatsApp chains. No more &quot;where is my order?&quot; emails.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/login" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--accent-base)] text-[var(--accent-text)] text-sm font-semibold rounded-xl transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5">
              Track Live Orders <ArrowRight size={14} />
            </Link>
            <Link href="/platform" className="inline-flex items-center gap-2 px-7 py-3.5 border border-[var(--border-visible)] text-[var(--foreground-secondary)] text-sm font-medium rounded-xl transition-all duration-200 hover:border-[var(--accent-base)] hover:text-[var(--foreground)]">
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Timeline mockup */}
      <section className="py-16 marketing-section">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="label-upper mb-4">Live Status Timeline</h2>
              <h3 className="text-[22px] md:text-[26px] font-medium mb-4">
                One timeline per order. Four stakeholders, zero confusion.
              </h3>
              <p className="text-[14px] text-secondary leading-relaxed mb-6">
                Each purchase order gets a shared timeline visible to your procurement team,
                the supplier, the funder, and the logistics partner. Everyone sees the same status.
              </p>
              <ul className="space-y-3">
                {[
                  "Real-time GPS for Shark-Breaker deliveries",
                  "Automated ETA compliance confirmation",
                  "Digital proof of delivery with photo capture",
                  "Instant alerts on delays or exceptions",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13px] text-secondary">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: "var(--success)" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Timeline mockup card */}
            <div className="surface-card p-5 md:p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>PO-2026-0847</div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Al-Gomhouria · F&B</div>
                </div>
                <span className="status-pill" style={{ color: "var(--info)", background: "rgba(43,108,176,0.08)", borderColor: "rgba(43,108,176,0.2)" }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--info)" }} />
                  In Transit
                </span>
              </div>

              {/* Timeline */}
              <div className="relative pl-6 space-y-0">
                {stages.map((stage, i) => {
                  const Icon = stage.icon;
                  const isLast = i === stages.length - 1;
                  return (
                    <div key={stage.step} className="relative pb-5">
                      {/* Connector line */}
                      {!isLast && (
                        <div
                          className="absolute left-[11px] top-[24px] bottom-0 w-px"
                          style={{ background: stage.status === "complete" ? "var(--success)" : "var(--border-subtle)" }}
                        />
                      )}
                      <div className="flex gap-4">
                        <div
                          className="relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                          style={{
                            background: stage.status === "complete" ? "var(--success)" : stage.status === "active" ? "var(--info)" : "var(--bg-surface-3)",
                            border: `2px solid ${stage.status === "pending" ? "var(--border-subtle)" : stage.status === "active" ? "var(--info)" : "var(--success)"}`,
                          }}
                        >
                          {stage.status === "complete" ? (
                            <CheckCircle2 size={11} style={{ color: "#F8FAFC" }} />
                          ) : (
                            <Icon size={11} style={{ color: stage.status === "active" ? "#F8FAFC" : "var(--text-muted)" }} />
                          )}
                        </div>
                        <div className="flex-1 pt-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>Step {stage.step}</span>
                            {stage.status === "active" && (
                              <span className="text-[9px] flex items-center gap-1" style={{ color: "var(--info)" }}>
                                <Clock size={8} /> Live
                              </span>
                            )}
                          </div>
                          <div className="text-[12px] font-medium mt-0.5" style={{ color: "var(--text-primary)" }}>{stage.title}</div>
                          <div className="text-[11px] text-secondary mt-0.5 leading-relaxed">{stage.desc}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Map preview */}
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={12} style={{ color: "var(--info)" }} />
                  <span className="text-[10px] font-medium" style={{ color: "var(--text-primary)" }}>Cairo → Hurghada Route</span>
                </div>
                <div className="h-16 rounded-lg overflow-hidden relative" style={{ background: "linear-gradient(90deg, #E8F5EE 0%, #E5EEF7 50%, #F5EDE0 100%)" }}>
                  <svg viewBox="0 0 300 60" className="w-full h-full">
                    <path d="M 20 30 Q 80 10 150 30 Q 220 50 280 30" fill="none" stroke="#2B6CB0" strokeWidth="1.5" strokeDasharray="3 2"/>
                    <circle cx="60" cy="22" r="4" fill="#2E7D4F"/>
                    <circle cx="150" cy="30" r="5" fill="#A16207" stroke="#F8FAFC" strokeWidth="1.5"/>
                    <circle cx="240" cy="32" r="4" fill="#CBD5E1"/>
                    <text x="55" y="16" fontSize="6" fill="#2E7D4F">Cairo</text>
                    <text x="140" y="18" fontSize="6" fill="#A16207">Hub</text>
                    <text x="230" y="18" fontSize="6" fill="#9D978E">Sharm</text>
                  </svg>
                </div>
                <div className="flex items-center justify-between mt-2 text-[9px]">
                  <span style={{ color: "var(--text-muted)" }}>ETA: 14:30 today</span>
                  <span className="flex items-center gap-1" style={{ color: "var(--success)" }}>
                    <Truck size={9} /> Shark-Breaker #42
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-16 marketing-section-alt">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="label-upper mb-8 text-center">Built for Multi-Stakeholder Visibility</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Bell, title: "Proactive Alerts", desc: "SMS, email, and in-app notifications on status changes. No need to refresh." },
              { icon: Search, title: "Audit-Ready Trail", desc: "Every status change logged with timestamp, actor, and geolocation. ETA-compliant by default." },
              { icon: Clock, title: "SLA Monitoring", desc: "Internal delivery SLAs with automatic escalation when deadlines approach." },
            ].map((f) => (
              <div key={f.title} className="surface-card p-6">
                <f.icon size={20} className="mb-3" style={{ color: "var(--accent-base)" }} />
                <h3 className="text-[14px] font-medium mb-2" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
                <p className="text-[12px] text-secondary leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 marketing-section">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-[24px] font-medium mb-4">See Your Orders in Real Time</h2>
          <p className="text-[13px] text-secondary mb-8 max-w-lg mx-auto">
            Log in to your hotel dashboard to see live tracking for every active PO.
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--accent-base)] text-[var(--accent-text)] text-sm font-semibold rounded-xl transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5">
            Log In to Track <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </MarketingPage>
  );
}
