"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ArrowRight, ArrowLeft, Building2, Store, Landmark, Truck,
  CheckCircle2, Loader2, Sparkles, Mail, Lock, MapPin, Users,
  Package, Banknote, Shield, ChevronRight,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { HotelDashboardMockup } from "@/components/marketing/hotel-dashboard-mockup";
import { SupplierDashboardMockup } from "@/components/marketing/supplier-dashboard-mockup";
import { FunderDashboardMockup } from "@/components/marketing/funder-dashboard-mockup";
import { LogisticsDashboardMockup } from "@/components/marketing/logistics-dashboard-mockup";

/* ─── Types ─── */

type Role = "hotel" | "supplier" | "funder" | "logistics" | null;
type Step = 1 | 2 | 3 | 4 | 5;

interface WizardData {
  role: Role;
  subCategory: string;
  supplyCategories: string[];
  capacity: string;
  companyName: string;
  contactName: string;
  email: string;
  password: string;
  city: string;
  taxId: string;
  licenseNumber: string;
  coverage: string;
}

interface Message {
  role: "assistant" | "user";
  content: string;
}

/* ─── Config ─── */

const ROLE_CONFIG: Record<string, {
  label: string;
  icon: React.ElementType;
  color: string;
  dashboard: React.ComponentType;
  subCategories: string[];
}> = {
  hotel: {
    label: "Hotel / Resort",
    icon: Building2,
    color: "#22C55E",
    dashboard: HotelDashboardMockup,
    subCategories: ["Independent Hotel", "Hotel Chain", "Resort", "Serviced Apartments"],
  },
  supplier: {
    label: "Supplier / Vendor",
    icon: Store,
    color: "#F97316",
    dashboard: SupplierDashboardMockup,
    subCategories: ["F&B Supplier", "Housekeeping & Chemicals", "Linens & Amenities", "FF&E / Capital Equipment", "Engineering & Maintenance", "Services (Pest, Laundry, Security)"],
  },
  funder: {
    label: "Factoring Company",
    icon: Landmark,
    color: "#A855F7",
    dashboard: FunderDashboardMockup,
    subCategories: ["Bank", "Non-Bank Financial Institution", "Investment Fund", "Microfinance"],
  },
  logistics: {
    label: "Logistics Provider",
    icon: Truck,
    color: "#3B82F6",
    dashboard: LogisticsDashboardMockup,
    subCategories: ["Full-Truckload (FTL)", "Less-Than-Truckload (LTL)", "Last-Mile Delivery", "Cold Chain", "Multi-Modal"],
  },
};

const STEPS = [
  { num: 1, label: "I am a..." },
  { num: 2, label: "Details" },
  { num: 3, label: "Company" },
  { num: 4, label: "Account" },
  { num: 5, label: "Preview" },
] as const;

const CAPACITY_OPTIONS = [
  "Solo / 1 person",
  "Small team (2–10)",
  "Medium (11–50)",
  "Large (51–200)",
  "Enterprise (200+)",
];

/* ─── Main Export ─── */

export function RegistrationWizard({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<WizardData>({
    role: null,
    subCategory: "",
    supplyCategories: [],
    capacity: "",
    companyName: "",
    contactName: "",
    email: "",
    password: "",
    city: "",
    taxId: "",
    licenseNumber: "",
    coverage: "",
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && step === 1 && messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: "Welcome to HotelsVendors! I'll guide you through registration in about 2 minutes.\n\nFirst — what best describes your business?",
      }]);
    }
  }, [isOpen, step, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const update = useCallback(<K extends keyof WizardData>(key: K, value: WizardData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setError("");
  }, []);

  const handleSend = useCallback(async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: msg.trim() }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/ai/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: msg.trim(),
          context: { wizardStep: step, role: data.role, subCategory: data.subCategory },
        }),
      });
      const json = await res.json();
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: json.data?.answer || "I understand. Let's continue with the registration.",
      }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Got it. Let's continue.",
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, step, data.role, data.subCategory]);

  const handleRegister = useCallback(async () => {
    setRegistering(true);
    setError("");
    try {
      const roleKey = data.role!;
      const config = ROLE_CONFIG[roleKey];
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: roleKey,
          name: data.contactName,
          email: data.email,
          password: data.password,
          accountType: "business",
          companyName: data.companyName,
          taxId: data.taxId || "",
          city: data.city || "",
          governorate: data.coverage || "",
          subCategory: data.subCategory,
          supplyCategories: data.supplyCategories,
          capacity: data.capacity,
          licenseNumber: data.licenseNumber || "",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setRegistered(true);
      } else {
        setError(json.error || "Registration failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setRegistering(false);
    }
  }, [data]);

  const canProceed = (): boolean => {
    switch (step) {
      case 1: return !!data.role;
      case 2: return !!data.subCategory && !!data.capacity;
      case 3: return !!data.companyName.trim() && !!data.contactName.trim() && !!data.city.trim();
      case 4: return !!data.email.trim() && data.password.length >= 6;
      case 5: return true;
      default: return false;
    }
  };

  const nextStep = () => { if (canProceed() && step < 5) setStep((step + 1) as Step); };
  const prevStep = () => { if (step > 1) setStep((step - 1) as Step); };

  if (!isOpen) return null;

  const roleKey = data.role || "";
  const config = roleKey ? ROLE_CONFIG[roleKey] : null;
  const DashboardComponent = config?.dashboard;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col"
        style={{ backgroundColor: "#0B0F1A", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" showText={false} />
            <div>
              <h2 className="text-[15px] font-semibold text-white">
                {registered ? "Welcome to HotelsVendors!" : "Registration"}
              </h2>
              {!registered && (
                <p className="text-[11px] text-white/30">Step {step} of 5 — {STEPS[step - 1].label}</p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Progress bar */}
        {!registered && (
          <div className="flex gap-1 px-6 pt-3">
            {STEPS.map((s) => (
              <div key={s.num} className="flex-1 h-1 rounded-full transition-colors" style={{ backgroundColor: step >= s.num ? "#FFB000" : "rgba(255,255,255,0.06)" }} />
            ))}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {registered ? (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
                  <CheckCircle2 size={32} style={{ color: "#22C55E" }} />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Account Created!</h3>
                <p className="text-sm text-white/40 mb-6">Check your email to verify your account.</p>
                <button onClick={onClose} className="px-6 py-2.5 text-sm font-medium rounded-lg text-black" style={{ backgroundColor: "#FFB000" }}>
                  Continue to Dashboard
                </button>
              </motion.div>
            ) : (
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                {step === 1 && <StepRole data={data} update={update} />}
                {step === 2 && config && <StepDetails data={data} update={update} config={config} />}
                {step === 3 && <StepCompany data={data} update={update} />}
                {step === 4 && <StepAccount data={data} update={update} error={error} />}
                {step === 5 && config && <StepPreview data={data} config={config} DashboardComponent={DashboardComponent!} messages={messages} input={input} setInput={setInput} onSend={handleSend} loading={loading} messagesEndRef={messagesEndRef} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {!registered && step < 5 && (
          <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button onClick={step === 1 ? onClose : prevStep} className="flex items-center gap-1.5 px-4 py-2 text-sm text-white/40 hover:text-white/60 transition-colors">
              <ArrowLeft size={14} /> {step === 1 ? "Cancel" : "Back"}
            </button>
            <button onClick={nextStep} disabled={!canProceed()} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition-all disabled:opacity-30" style={{ backgroundColor: "#FFB000", color: "#0B0F1A" }}>
              Continue <ArrowRight size={14} />
            </button>
          </div>
        )}

        {step === 5 && !registered && (
          <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button onClick={prevStep} className="flex items-center gap-1.5 px-4 py-2 text-sm text-white/40 hover:text-white/60 transition-colors">
              <ArrowLeft size={14} /> Back
            </button>
            <button onClick={handleRegister} disabled={registering} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition-all disabled:opacity-50" style={{ backgroundColor: "#FFB000", color: "#0B0F1A" }}>
              {registering ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              {registering ? "Creating Account..." : "Complete Registration"}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STEP 1 — Role Selection
   ═══════════════════════════════════════════════════════════════ */

function StepRole({ data, update }: { data: WizardData; update: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void }) {
  return (
    <div>
      <h3 className="text-[20px] font-semibold text-white mb-2">What best describes your business?</h3>
      <p className="text-[13px] text-white/40 mb-6">Select one to continue. You can always add more roles later.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries(ROLE_CONFIG).map(([key, cfg]) => {
          const Icon = cfg.icon;
          const isActive = data.role === key;
          return (
            <button
              key={key}
              onClick={() => { update("role", key as Role); update("subCategory", ""); update("supplyCategories", []); }}
              className="flex items-start gap-4 p-5 rounded-xl text-left transition-all"
              style={{
                backgroundColor: isActive ? "rgba(255,176,0,0.06)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${isActive ? "rgba(255,176,0,0.25)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                <Icon size={22} className="text-white/50" />
              </div>
              <div>
                <h4 className="text-[14px] font-semibold text-white mb-1">{cfg.label}</h4>
                <p className="text-[11px] text-white/30 leading-relaxed">
                  {key === "hotel" && "Manage procurement, orders, invoices, and payments for your property"}
                  {key === "supplier" && "Sell to hotels, receive POs, issue ETA invoices, get paid in 48h"}
                  {key === "funder" && "Access pre-verified invoices, competitive bidding, bank-direct settlement"}
                  {key === "logistics" && "Shared-route optimization, GPS tracking, auto-settlement on delivery"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STEP 2 — Subcategory & Capacity
   ═══════════════════════════════════════════════════════════════ */

function StepDetails({ data, update, config }: { data: WizardData; update: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void; config: typeof ROLE_CONFIG[string] }) {
  const toggleSupplyCategory = (cat: string) => {
    const current = data.supplyCategories || [];
    if (current.includes(cat)) {
      update("supplyCategories", current.filter((c) => c !== cat));
    } else {
      update("supplyCategories", [...current, cat]);
    }
  };

  return (
    <div>
      <h3 className="text-[20px] font-semibold text-white mb-2">Tell us more about your {config.label}</h3>
      <p className="text-[13px] text-white/40 mb-6">This helps us configure your dashboard and match you with the right partners.</p>

      {/* Subcategory */}
      <div className="mb-6">
        <label className="text-[12px] font-medium text-white/50 uppercase tracking-wider mb-3 block">Business Type</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {config.subCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => update("subCategory", cat)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-left text-[13px] transition-all"
              style={{
                backgroundColor: data.subCategory === cat ? "rgba(255,176,0,0.06)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${data.subCategory === cat ? "rgba(255,176,0,0.25)" : "rgba(255,255,255,0.06)"}`,
                color: data.subCategory === cat ? "#FFB000" : "rgba(255,255,255,0.5)",
              }}
            >
              <ChevronRight size={14} className={data.subCategory === cat ? "opacity-100" : "opacity-0"} />
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Supply categories (for suppliers) */}
      {data.role === "supplier" && (
        <div className="mb-6">
          <label className="text-[12px] font-medium text-white/50 uppercase tracking-wider mb-3 block">Supply Categories (select all that apply)</label>
          <div className="flex flex-wrap gap-2">
            {["F&B / Food & Beverage", "Housekeeping & Chemicals", "Linens & Guest Amenities", "FF&E / Capital Equipment", "Engineering & Maintenance", "Services (Pest, Laundry, Security)", "Pool & Spa", "Water Sports Equipment"].map((cat) => {
              const selected = (data.supplyCategories || []).includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleSupplyCategory(cat)}
                  className="px-3 py-1.5 rounded-lg text-[12px] transition-all"
                  style={{
                    backgroundColor: selected ? "rgba(255,176,0,0.08)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${selected ? "rgba(255,176,0,0.2)" : "rgba(255,255,255,0.06)"}`,
                    color: selected ? "#FFB000" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Capacity */}
      <div>
        <label className="text-[12px] font-medium text-white/50 uppercase tracking-wider mb-3 block">Team Size</label>
        <div className="flex flex-wrap gap-2">
          {CAPACITY_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => update("capacity", opt)}
              className="px-3 py-1.5 rounded-lg text-[12px] transition-all"
              style={{
                backgroundColor: data.capacity === opt ? "rgba(255,176,0,0.08)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${data.capacity === opt ? "rgba(255,176,0,0.2)" : "rgba(255,255,255,0.06)"}`,
                color: data.capacity === opt ? "#FFB000" : "rgba(255,255,255,0.4)",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STEP 3 — Company Details
   ═══════════════════════════════════════════════════════════════ */

function StepCompany({ data, update }: { data: WizardData; update: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void }) {
  return (
    <div>
      <h3 className="text-[20px] font-semibold text-white mb-2">Company Details</h3>
      <p className="text-[13px] text-white/40 mb-6">We use this to set up your account and verify your business.</p>

      <div className="space-y-4 max-w-lg">
        <FieldInput label="Company / Property Name" value={data.companyName} onChange={(v) => update("companyName", v)} placeholder="e.g. Stella Di Mare Resort" icon={Building2} required />
        <FieldInput label="Your Full Name" value={data.contactName} onChange={(v) => update("contactName", v)} placeholder="Your name" icon={Users} required />
        <FieldInput label="City" value={data.city} onChange={(v) => update("city", v)} placeholder="e.g. Hurghada" icon={MapPin} required />

        {data.role === "supplier" && (
          <FieldInput label="Tax ID" value={data.taxId} onChange={(v) => update("taxId", v)} placeholder="Egyptian Tax Authority ID" icon={Shield} />
        )}
        {data.role === "funder" && (
          <FieldInput label="FRA License Number" value={data.licenseNumber} onChange={(v) => update("licenseNumber", v)} placeholder="e.g. FRA-2024-001" icon={Banknote} />
        )}
        {data.role === "logistics" && (
          <FieldInput label="Coverage Areas" value={data.coverage} onChange={(v) => update("coverage", v)} placeholder="e.g. Cairo, Hurghada, Sharm" icon={MapPin} />
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STEP 4 — Account Creation
   ═══════════════════════════════════════════════════════════════ */

function StepAccount({ data, update, error }: { data: WizardData; update: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void; error: string }) {
  return (
    <div>
      <h3 className="text-[20px] font-semibold text-white mb-2">Create Your Account</h3>
      <p className="text-[13px] text-white/40 mb-6">Your login credentials for the dashboard.</p>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}>
          {error}
        </div>
      )}

      <div className="space-y-4 max-w-lg">
        <FieldInput label="Email Address" value={data.email} onChange={(v) => update("email", v)} placeholder="you@company.com" icon={Mail} type="email" required />
        <FieldInput label="Password" value={data.password} onChange={(v) => update("password", v)} placeholder="Min 6 characters" icon={Lock} type="password" required />
      </div>

      <p className="text-[11px] text-white/20 mt-4">By registering, you agree to our Terms of Service and Privacy Policy.</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STEP 5 — Preview & AI Chat
   ═══════════════════════════════════════════════════════════════ */

function StepPreview({
  data, config, DashboardComponent, messages, input, setInput, onSend, loading, messagesEndRef,
}: {
  data: WizardData;
  config: typeof ROLE_CONFIG[string];
  DashboardComponent: React.ComponentType;
  messages: Message[];
  input: string;
  setInput: (v: string) => void;
  onSend: (text?: string) => void;
  loading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div>
      <h3 className="text-[20px] font-semibold text-white mb-2">Your Dashboard Preview</h3>
      <p className="text-[13px] text-white/40 mb-6">Here&apos;s what your {config.label} dashboard looks like. Ask me anything before completing registration.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dashboard preview */}
        <div>
          <p className="text-[10px] text-white/20 uppercase tracking-wider mb-2 text-center">Dashboard Preview</p>
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
            <DashboardComponent />
          </div>
        </div>

        {/* AI Chat */}
        <div className="flex flex-col rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.01)" }}>
          <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <Sparkles size={14} style={{ color: "#FFB000" }} />
            <span className="text-[12px] font-medium text-white/60">Ask about your dashboard</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 200, maxHeight: 300 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[85%] px-3 py-2 rounded-lg text-[12px] leading-relaxed" style={{
                  backgroundColor: msg.role === "user" ? "rgba(255,176,0,0.1)" : "rgba(255,255,255,0.04)",
                  color: msg.role === "user" ? "#FFB000" : "rgba(255,255,255,0.6)",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <Loader2 size={12} className="animate-spin text-white/30" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="px-3 py-2 flex gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") onSend(); }}
              placeholder="Ask a question..."
              className="flex-1 bg-transparent text-[12px] text-white placeholder:text-white/20 outline-none"
            />
            <button onClick={() => onSend()} disabled={loading} className="p-1.5 rounded-md text-white/30 hover:text-white/60 transition-colors disabled:opacity-30">
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Shared Field Input
   ═══════════════════════════════════════════════════════════════ */

function FieldInput({
  label, value, onChange, placeholder, icon: Icon, type = "text", required = false,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; icon: React.ElementType; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-1.5 block">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20">
          <Icon size={14} />
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-[rgba(255,176,0,0.3)] focus:shadow-[0_0_0_2px_rgba(255,176,0,0.08)]"
        />
      </div>
    </div>
  );
}
