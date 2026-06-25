"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  Store,
  Landmark,
  Truck,
  CheckCircle2,
  BarChart3,
  ShoppingCart,
  Receipt,
  Banknote,
  RotateCcw,
  Sparkles,
  Play,
  Package,
  Shield,
  TrendingUp,
  Zap,
  ShieldCheck,
  Monitor,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { SandboxDashboard, EmptySandboxState, type Role } from "@/components/marketing/sandbox-dashboard";

interface RoleConfig {
  key: Role;
  label: string;
  icon: React.ElementType;
  color: string;
  accentMuted: string;
  description: string;
  steps: SandboxStep[];
}

interface SandboxStep {
  title: string;
  description: string;
  action: string;
  icon: React.ElementType;
  detail: string;
}

const ROLES: RoleConfig[] = [
  {
    key: "hotel",
    label: "Hotel / Resort",
    icon: Building2,
    color: "var(--accent-base)",
    accentMuted: "rgba(163,230,53,0.1)",
    description: "Use the HotelsVendors orchestrator to manage compliance, payments, and factoring for your procurement needs.",
    steps: [
      {
        title: "AI Demand Forecast",
        description: "The engine analyzes occupancy, events, and 12-month consumption history to predict needs.",
        action: "Generate 14-day forecast",
        icon: BarChart3,
        detail: "HV Engine predicts 3,420 room-nights with 94% accuracy across 6 categories (F&B, Housekeeping, Amenities, Engineering, Consumables, Capital Equipment).",
      },
      {
        title: "Auto PO Generation",
        description: "POs are auto-created against budget ceilings and routed to pre-mandated suppliers.",
        action: "Issue PO",
        icon: ShoppingCart,
        detail: "14-item PO generated for EGP 247,800. Authority Matrix validated at property level. Budget utilization: 68% of Q3 allocation.",
      },
      {
        title: "Three-Way Match",
        description: "System validates PO + ETA UUID + Signed GRN. All must match before payment.",
        action: "Receive shipment",
        icon: Shield,
        detail: "PO #INVO-00421 matched with ETA UUID 9b7e3f51 and digital GRN #GRN-ALM-003. All three signatures cryptographically verified.",
      },
      {
        title: "Factoring Settlement",
        description: "Pre-cleared invoice enters competitive factoring. Supplier paid in 24hrs. You keep net-60.",
        action: "Submit to factoring pool",
        icon: Banknote,
        detail: "Invoice entered competitive pool. 2 bids received (1.85% vs 1.95%). Best rate accepted. EGP 243,401.40 settled via bank-direct IBAN.",
      },
    ],
  },
  {
    key: "supplier",
    label: "Supplier / Vendor",
    icon: Store,
    color: "#22C55E",
    accentMuted: "rgba(34,197,94,0.1)",
    description: "Use the INVO marketplace aggregator to receive orders and the HotelsVendors fintech layer to get paid fast.",
    steps: [
      {
        title: "Catalog Upload",
        description: "Upload your product catalog. AI categorizes and matches you to hotel demand.",
        action: "Upload SKUs",
        icon: Package,
        detail: "1,247 SKUs categorized across 6 categories. AI matched 43 hotel procurement profiles in Red Sea, Cairo, and Alexandria corridors.",
      },
      {
        title: "PO Notification",
        description: "Receive purchase orders directly from hotel procurement teams with delivery windows.",
        action: "Accept PO",
        icon: ShoppingCart,
        detail: "PO #INVO-00421 from Steigenberger Resort El Gouna: 14 items, EGP 247,800. Delivery window: 72 hours. Shared-route eligible.",
      },
      {
        title: "ETA Invoice Issuance",
        description: "Issue ETA-compliant e-invoices with digital signatures and cryptographic validation.",
        action: "Issue invoice",
        icon: Receipt,
        detail: "Invoice #HV-INV-00421 RSA-2048 signed. ETA UUID: 9b7e3f51-2a8d-4c6e-b0f1-8d3e5a7c9b0a. Submitted real-time. Status: ACCEPTED.",
      },
      {
        title: "24-Hour Payment",
        description: "Invoice enters factoring pool. Get paid in 24 hours, not 180 days.",
        action: "Opt for early settlement",
        icon: Banknote,
        detail: "EGP 243,401.40 settled via bank-direct IBAN within 14 hours. Non-recourse. Zero risk to supplier.",
      },
    ],
  },
  {
    key: "factoring",
    label: "Factoring Company",
    icon: Landmark,
    color: "#D4A843",
    accentMuted: "rgba(212,168,67,0.1)",
    description: "Use the HotelsVendors fintech orchestrator to access pre-verified invoices and settle via bank-direct payments.",
    steps: [
      {
        title: "Invoice Pool Access",
        description: "Browse pre-verified invoices that have passed three-way matching and ETA validation.",
        action: "Browse available invoices",
        icon: Receipt,
        detail: "37 invoices available. Total face value: EGP 8.2M. All triple-validated (PO + ETA UUID + GRN). Filter by risk tier, sector, or governance.",
      },
      {
        title: "Risk Scoring",
        description: "AI scores each invoice on hotel creditworthiness, delivery confirmation, and ETA compliance.",
        action: "Review risk scores",
        icon: Shield,
        detail: "12 LOW (avg 24/100), 18 MEDIUM (avg 47/100), 7 HIGH (avg 68/100). Top-tier hotels: Steigenberger, Jaz, Movenpick.",
      },
      {
        title: "Competitive Bid",
        description: "Bid on invoices. Best rate wins. Non-recourse protects your capital.",
        action: "Submit bid",
        icon: TrendingUp,
        detail: "Bid placed at 1.85% on INV-00421 (EGP 247,800). Est. return: 14.2% APR. Non-recourse: risk transfers at acceptance.",
      },
      {
        title: "Bank-Direct Settlement",
        description: "Settlement flows directly between your bank and supplier. Zero intermediary risk.",
        action: "Confirm settlement",
        icon: Banknote,
        detail: "EGP 243,209.70 transferred CIB → Supplier IBAN EG380039003445600000000123456. Clean balance-sheet treatment.",
      },
    ],
  },
  {
    key: "shipping",
    label: "Logistics Provider",
    icon: Truck,
    color: "#3B82F6",
    accentMuted: "rgba(59,130,246,0.1)",
    description: "Use the INVO marketplace aggregator to find loads and the HotelsVendors compliance layer to ensure digital proof of delivery.",
    steps: [
      {
        title: "Load Matching",
        description: "AI matches your available capacity to multi-supplier delivery requests.",
        action: "View available loads",
        icon: Package,
        detail: "12 loads on Red Sea corridor. Multi-supplier consolidation: 4 suppliers sharing 1 truck. Utilization: 87%. Fuel savings: 34%.",
      },
      {
        title: "Route Optimization",
        description: "Shared-route planning minimizes empty miles across 6 governorates.",
        action: "Optimize route",
        icon: BarChart3,
        detail: "Cairo → Sokhna → Hurghada → El Gouna → Marsa Alam. 487 km, 6 stops. Fuel: EGP 4,280. ETA: 08:30 tomorrow.",
      },
      {
        title: "Delivery Confirmation",
        description: "GPS-tracked delivery with digital proof for automatic payment trigger.",
        action: "Confirm delivery",
        icon: Shield,
        detail: "Stop 3/6 — Jaz Almaza: 14 cartons delivered. GRN #GRN-ALM-003 signed. ETA UUID validated. POD captured.",
      },
      {
        title: "On-Time Payment",
        description: "Payment released automatically upon delivery confirmation. No 90-day waits.",
        action: "Receive payment",
        icon: Banknote,
        detail: "EGP 18,420 settled within 3 hours of final POD. Auto-reconciled with trip manifest. No manual invoicing needed.",
      },
    ],
  },
  {
    key: "admin",
    label: "Admin / Operator",
    icon: Monitor,
    color: "#A855F7",
    accentMuted: "rgba(168,85,247,0.1)",
    description: "Monitor platform health, manage tenants, audit transactions, and track revenue via the HotelsVendors orchestrator.",
    steps: [
      {
        title: "Tenant Management",
        description: "Onboard and manage hotel groups, suppliers, funders, and logistics providers.",
        action: "View tenant dashboard",
        icon: Building2,
        detail: "24 active tenants across 4 tiers. 12 on trial, 8 enterprise, 4 onboarding. Platform GMV: EGP 18.2M. Fee revenue: EGP 847K.",
      },
      {
        title: "Revenue Monitoring",
        description: "Track platform fee revenue by stream: subscription, funding fees (HV), logistics margin.",
        action: "Review revenue breakdown",
        icon: BarChart3,
        detail: "Subscription: EGP 198K (23%). Funding Fees (HV): EGP 512K (60%). Logistics Margin: EGP 93K (11%). Value-Added: EGP 44K (6%). Total: EGP 847K.",
      },
      {
        title: "Audit Log Review",
        description: "Immutable SHA-256 audit trail of every transaction state transition on the platform.",
        action: "View audit log",
        icon: Shield,
        detail: "1,247 audit events today. 99.97% automated. 3 manual escalations — all resolved. Full cryptographic chain from PO creation to settlement.",
      },
      {
        title: "System Health",
        description: "Real-time monitoring of platform uptime, queue depths, and ETA bridge status.",
        action: "Confirm health status",
        icon: TrendingUp,
        detail: "Uptime: 99.99% (30d). Avg response: 187ms. ETA bridge: Connected. Queue depth: 12 pending. Zero active escalations.",
      },
    ],
  },
  {
    key: "eta-officer",
    label: "ETA Compliance Officer",
    icon: ShieldCheck,
    color: "#F97316",
    accentMuted: "rgba(249,115,22,0.1)",
    description: "Use the HotelsVendors compliance SaaS to monitor ETA submission pipelines and validate cryptographic signatures.",
    steps: [
      {
        title: "Submission Queue",
        description: "Monitor real-time ETA e-invoicing submission pipeline for all platform invoices.",
        action: "Check submission queue",
        icon: Receipt,
        detail: "47 invoices submitted today. All RSA-2048 signed. UUIDs: 47/47 validated by ETA Portal. Queue clear. No dead-letter messages.",
      },
      {
        title: "Three-Way Validation",
        description: "Verify PO + ETA UUID + Signed Digital GRN match before invoice acceptance.",
        action: "Run validation check",
        icon: Shield,
        detail: "PO-00421 ✓ | ETA UUID 9b7e3f51 ✓ (ETAPortal: ACCEPTED) | RSA-2048 Signature ✓ | GRN #GRN-ALM-003 ✓ | GS1/EGS Tax Codes: 14/14 ✓",
      },
      {
        title: "FRA Compliance Audit",
        description: "Run anti-fraud compliance checks per FRA requirements on all transactions.",
        action: "Generate compliance report",
        icon: CheckCircle2,
        detail: "3-Way Match Gate: 100% pass rate. SHA-256 Audit Trail: Complete. AES-256-GCM: Enabled. Tenant RLS: Active. TLS 1.3: Enforced.",
      },
      {
        title: "Compliance Sign-Off",
        description: "Final compliance sign-off for daily batch — all invoices meet ETA Phase 1 & 2.",
        action: "Approve batch",
        icon: TrendingUp,
        detail: "Batch 2026-05-14: 47/47 invoices accepted. 0 rejections. 0 failed signatures. ETA compliance rate: 100%. FRA audit: Clean.",
      },
    ],
  },
];

export default function SandboxPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isRunning, setIsRunning] = useState(false);

  const role = ROLES.find((r) => r.key === selectedRole);
  const RoleIcon = role?.icon;
  const totalSteps = role?.steps.length ?? 0;
  const allCompleted = completedSteps.size === totalSteps && totalSteps > 0;

  const handleStartStep = useCallback((stepIndex: number) => {
    setIsRunning(true);
    setTimeout(() => {
      setCompletedSteps((prev) => new Set([...prev, stepIndex]));
      if (stepIndex < totalSteps - 1) {
        setCurrentStep(stepIndex + 1);
      }
      setIsRunning(false);
    }, 1200);
  }, [totalSteps]);

  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setIsRunning(false);
  }, []);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--background)", color: "var(--text-primary)" }}>
      <MarketingNav />

      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-full blur-[200px] pointer-events-none" style={{ background: "radial-gradient(circle, var(--accent-muted) 0%, transparent 70%)" }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3" style={{ border: "1px solid var(--accent-glow)", backgroundColor: "var(--accent-muted)" }}>
              <Zap size={11} style={{ color: "var(--accent-base)" }} />
              <span className="text-[10px] text-primary/50 font-medium uppercase tracking-wider">Interactive Sandbox</span>
            </div>
            <h1 className="text-[clamp(24px,3.5vw,40px)] font-bold tracking-tight text-primary mb-3">
              Try HotelsVendors.<br /><span style={{ background: "linear-gradient(135deg, var(--accent-base), #00E5CC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>No Sign-Up Required.</span>
            </h1>
            <p className="text-[13px] text-primary/50 max-w-2xl mx-auto leading-relaxed">
              Walk through a real procurement workflow from any stakeholder perspective. See how AI forecasting,<br className="hidden md:block" />
              ETA compliance, and embedded factoring work together in one unified platform.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!selectedRole ? (
              /* ─── Role Selection Grid ─── */
              <motion.div
                key="roles"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-[10px] font-medium text-primary/25 uppercase tracking-[0.15em] mb-5 text-center">
                  Choose Your Stakeholder Role
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
                  {ROLES.map((r, i) => {
                    const Icon = r.icon;
                    return (
                      <motion.button
                        key={r.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        whileHover={{ y: -4, borderColor: r.color + "50", boxShadow: `0 8px 30px ${r.color}10` }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedRole(r.key)}
                        className="rounded-xl p-5 text-left transition-all"
                        style={{
                          backgroundColor: "var(--background)",
                          border: "1px solid var(--border-subtle)",
                        }}
                      >
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                          style={{ backgroundColor: r.accentMuted }}
                        >
                          <Icon size={22} style={{ color: r.color }} />
                        </div>
                        <h3 className="text-[14px] font-semibold text-primary mb-1.5">{r.label}</h3>
                        <p className="text-[11px] leading-relaxed mb-3" style={{ color: "var(--text-muted)" }}>
                          {r.description}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: r.color }}>
                          Launch Demo <ArrowRight size={11} />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              /* ─── Split Layout: Steps + Dashboard ─── */
              <motion.div
                key="sandbox"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                  <button
                    onClick={() => { setSelectedRole(null); handleReset(); }}
                    className="inline-flex items-center gap-1.5 text-[12px] hover:text-primary/60 transition-colors"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <ArrowLeft size={13} /> All Roles
                  </button>

                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: role!.accentMuted }}>
                      {RoleIcon && <RoleIcon size={15} style={{ color: role!.color }} />}
                    </div>
                    <span className="text-[13px] font-medium">{role!.label}</span>
                  </div>

                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 text-[12px] hover:text-primary/60 transition-colors"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <RotateCcw size={12} /> Reset
                  </button>
                </div>

                {/* Split Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* ── Left: Steps ── */}
                  <div>
                    {/* Progress */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                          Step {Math.min(currentStep + 1, totalSteps)} of {totalSteps}
                        </span>
                        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                          {completedSteps.size}/{totalSteps} completed
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-surface-2)" }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: role!.color }}
                          initial={{ width: "0%" }}
                          animate={{ width: `${(completedSteps.size / totalSteps) * 100}%` }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </div>

                    {/* Steps List */}
                    <div className="space-y-2.5">
                      {role!.steps.map((step, i) => {
                        const isCompleted = completedSteps.has(i);
                        const isCurrent = !isCompleted && (i === currentStep || (i < completedSteps.size || (i === completedSteps.size && i === currentStep)));
                        const isLocked = i > currentStep && !isCompleted && i > completedSteps.size;

                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="rounded-xl overflow-hidden transition-all"
                            style={{
                              backgroundColor: isCurrent ? "rgba(255,255,255,0.02)" : "#0a0a0a",
                              border: `1px solid ${
                                isCompleted ? role!.color + "30"
                                : isCurrent ? "rgba(255,255,255,0.1)"
                                : "rgba(255,255,255,0.04)"
                              }`,
                              opacity: isLocked ? 0.45 : 1,
                            }}
                          >
                            <div className="p-4">
                              <div className="flex items-start gap-3.5">
                                {/* Step Icon */}
                                <div
                                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                                  style={{
                                    backgroundColor: isCompleted
                                      ? role!.color + "18"
                                      : "rgba(255,255,255,0.04)",
                                  }}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 size={17} style={{ color: role!.color }} />
                                  ) : (
                                    <step.icon size={16} style={{ color: isCurrent ? role!.color : "rgba(255,255,255,0.15)" }} />
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  {/* Step header */}
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-[8px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.18)" }}>
                                      Step {String(i + 1).padStart(2, "0")}
                                    </span>
                                    {isCompleted && (
                                      <span
                                        className="text-[7px] px-1.5 py-0.5 rounded font-medium"
                                        style={{ backgroundColor: role!.color + "12", color: role!.color }}
                                      >
                                        Done
                                      </span>
                                    )}
                                  </div>

                                  <h3 className="text-[14px] font-semibold text-primary mb-1">{step.title}</h3>
                                  <p className="text-[11px] leading-relaxed mb-2.5" style={{ color: "var(--text-muted)" }}>
                                    {step.description}
                                  </p>

                                  {/* Detail / Result */}
                                  <AnimatePresence>
                                    {isCompleted && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mb-2.5"
                                      >
                                        <div
                                          className="rounded-lg p-2.5"
                                          style={{
                                            backgroundColor: role!.color + "04",
                                            border: `1px solid ${role!.color}10`,
                                          }}
                                        >
                                          <p className="text-[9px] font-medium mb-1" style={{ color: role!.color }}>
                                            ✓ Result:
                                          </p>
                                          <p className="text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                                            {step.detail}
                                          </p>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>

                                  {/* Action button */}
                                  {isCurrent && !isCompleted && (
                                    <button
                                      onClick={() => handleStartStep(i)}
                                      disabled={isRunning}
                                      className="inline-flex items-center gap-2 px-4 py-2 text-[11px] font-semibold rounded-lg transition-all disabled:opacity-50"
                                      style={{ backgroundColor: role!.color, color: "#fff" }}
                                    >
                                      {isRunning ? (
                                        <>
                                          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                          </svg>
                                          Processing…
                                        </>
                                      ) : (
                                        <>
                                          <Play size={11} /> {step.action}
                                        </>
                                      )}
                                    </button>
                                  )}

                                  {isLocked && (
                                    <div className="flex items-center gap-1.5">
                                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0110 0v4" />
                                      </svg>
                                      <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.12)" }}>
                                        Complete previous step to unlock
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Completion State */}
                    <AnimatePresence>
                      {allCompleted && (
                        <motion.div
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="mt-5 rounded-xl p-5 text-center"
                          style={{ backgroundColor: role!.color + "06", border: `1px solid ${role!.color}20` }}
                        >
                          <Sparkles size={24} className="mx-auto mb-3" style={{ color: role!.color }} />
                          <h3 className="text-[16px] font-bold text-primary mb-1">Workflow Complete</h3>
                          <p className="text-[11px] mb-4 max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
                            You&apos;ve walked through the full {role!.label.toLowerCase()} workflow — exactly how HotelsVendors operates in production with real ETA compliance, cryptographic audit trails, and automated settlement.
                          </p>
                          <div className="flex flex-wrap justify-center gap-3">
                            <Link
                              href="/register"
                              className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] font-semibold rounded-lg transition-all hover:shadow-[0_0_30px_var(--accent-glow)]"
                              style={{ backgroundColor: "var(--accent-base)", color: "#fff" }}
                            >
                              Get Full Access <ArrowRight size={13} />
                            </Link>
                            <button
                              onClick={handleReset}
                              className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] font-medium rounded-lg"
                              style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
                            >
                              <RotateCcw size={12} /> Run Again
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ── Right: Live Dashboard ── */}
                  <div className="lg:sticky lg:top-24 lg:self-start">
                    <SandboxDashboard
                      role={selectedRole}
                      completedSteps={completedSteps}
                      currentStep={currentStep}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
