"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { RoleBenefits } from "@/components/auth/role-benefits";

type Role = "HOTEL" | "SUPPLIER" | "FACTORING" | "LOGISTICS";

const ROLES: { id: Role; label: string; sub: string; emoji: string; layer: "HV Web" | "INVO Mobile" }[] = [
  { id: "HOTEL", label: "Hotel / Property", sub: "Buy, approve, comply", emoji: "🏨", layer: "HV Web" },
  { id: "SUPPLIER", label: "Supplier / Vendor", sub: "List, fulfill, cash out", emoji: "🚜", layer: "INVO Mobile" },
  { id: "FACTORING", label: "Factoring Partner", sub: "Fund verified invoices", emoji: "🏦", layer: "HV Web" },
  { id: "LOGISTICS", label: "Logistics Provider", sub: "Deliver & reconcile", emoji: "🚚", layer: "INVO Mobile" },
];

const FIELD_LABELS: Record<Role, { name: string; cr: string; booking: string; extra?: { label: string; placeholder: string } }> = {
  HOTEL: { name: "Company / Hotel Name", cr: "Commercial Register (CR)", booking: "HotelsVendors Booking Ref" },
  SUPPLIER: { name: "Company / Brand Name", cr: "Commercial Register (CR)", booking: "Primary Category" },
  FACTORING: { name: "Institution Name", cr: "FRA License No.", booking: "Underwriting Ref" },
  LOGISTICS: { name: "Carrier / Fleet Name", cr: "Commercial Register (CR)", booking: "Operator License" },
};

const ROLE_HOOKS: Record<Role, React.ReactNode> = {
  HOTEL: (
    <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-800">
      Unlocks Multi-Tier Approval Chains &amp; ETA E-Invoicing Compliance.
    </div>
  ),
  SUPPLIER: (
    <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
      <span className="font-bold">Promo Code CHV000 Active</span> · 0% Platform Subscription Fee + Instant 48h
      Cash-Out Queue via Oliv (Suez Canal Bank EGP 10M Pool).
    </div>
  ),
  FACTORING: (
    <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-800">
      FRA-Compliant e-Factoring Registry · single-instance invoice locks · automated credit-risk scoring.
    </div>
  ),
  LOGISTICS: (
    <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-800">
      Connect provider API keys for live bookings · dock-slot scheduling · GRN reconciliation.
    </div>
  ),
};

/* ═══ ROLE PITCH — procurement tech, "as reimagined" for the chosen role ═══ */
const ROLE_PITCH: Record<Role, { kicker: string; line: string; highlights: string[]; statement: string }> = {
  HOTEL: {
    kicker: "Procurement, as reimagined for Hotel Leaders",
    line: "Replace spreadsheets, back-and-forth emails, and 90-day waits with an automated, compliant spend engine.",
    highlights: [
      "Multi-tier approval matrix — Chef → F&B → Procurement → Finance, auto-routed by dollar threshold",
      "Departmental budget locks + AI spend forecast before you commit a single order",
      "Native ETA e-invoicing & e-Waybill compliance, submission-ready",
      "Consolidated supplier catalogs with hybrid FIXED / RFQ pricing",
    ],
    statement: "Stop losing margin to manual procurement. See your whole portfolio in one console — and approve from anywhere, in seconds.",
  },
  SUPPLIER: {
    kicker: "Fulfillment, as reimagined for Suppliers",
    line: "Stop waiting 60–90 days to get paid. Ship once, cash out in 48 hours.",
    highlights: [
      "Live order inbox with one-tap accept & fulfill from the INVO app",
      "48h early cash-out via Oliv — promo code CHV000, Suez Canal Bank pool",
      "0% platform subscription fee — keep more of every order",
      "ETA-compliant invoicing generated automatically, no paperwork",
    ],
    statement: "List free, get real orders, and get paid in 48 hours. Built for suppliers tired of financing their buyers' cash flow.",
  },
  FACTORING: {
    kicker: "Liquidity, as reimagined for Financial Partners",
    line: "License a live, FRA-compliant reverse-factoring book of ETA-verified receivables.",
    highlights: [
      "FRA-compliant e-factoring registry with single-instance invoice locks",
      "Automated credit-risk reliability index per hotel TRN (0–100)",
      "Suez Canal Bank facility integration for pooled liquidity",
      "48h reverse-factoring pool across Egyptian hospitality suppliers",
    ],
    statement: "Deploy capital into verified, ETA-connected receivables with institutional-grade risk controls — not blind SME debt.",
  },
  LOGISTICS: {
    kicker: "Logistics, as reimagined for Carriers",
    line: "From manual dispatch and lost paperwork to a live, reconciled delivery network.",
    highlights: [
      "Connect provider API keys for live bookings immediately",
      "Dock-slot scheduling & e-Waybill QR verification",
      "GRN reconciliation that flags shortages and auto-issues credit notes",
      "Real-time tracking & notifications for every involved party",
    ],
    statement: "Run an honest, reconciled carrier operation — fewer disputes, faster payments, no more chasing missing signatures.",
  },
};

interface FormState {
  name: string; cr: string; booking: string; contact: string;
  phone: string; email: string; password: string; promo: string;
  extraField: string; accepted: boolean; step: number;
}

const EMPTY: FormState = {
  name: "", cr: "", booking: "", contact: "", phone: "", email: "",
  password: "", promo: "CHV000", extraField: "", accepted: false, step: 1,
};

/* ── Lazy-loaded inner form (uses useSearchParams) ── */
function RegisterInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = (searchParams.get("type") as Role) || null;
  const refParam = searchParams.get("ref");

  const valid = (t: string | null): t is Role => !!t && ["HOTEL", "SUPPLIER", "FACTORING", "LOGISTICS"].includes(t);
  const [role, setRole] = useState<Role>(valid(typeParam) ? typeParam : refParam ? "SUPPLIER" : "HOTEL");
  const [f, setF] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (valid(typeParam)) setRole(typeParam);
  }, [typeParam]);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));
  const setB = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((s) => ({ ...s, [k]: e.target.checked }));

  const field = FIELD_LABELS[role];
  const stepOk = f.step === 1 ? !!(f.name && f.cr && f.contact && f.phone) : !!(f.email && f.password && f.accepted);

  async function submit() {
    setSubmitting(true); setMsg(null);
    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          name: f.name,
          commercialRegister: f.cr,
          bookingRef: f.booking,
          contactPerson: f.contact,
          phone: f.phone,
          email: f.email,
          password: f.password,
          promoCode: role === "SUPPLIER" ? f.promo || "CHV000" : undefined,
          extraField: f.extraField,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ ok: true, text: "Account created. Verify your phone to continue." });
        setTimeout(() => router.push(role === "HOTEL" ? "/dashboard/hotel" : "/login"), 1400);
      } else {
        setMsg({ ok: false, text: data.error || "Registration failed. Please try again." });
      }
    } catch {
      setMsg({ ok: false, text: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {/* ═══ ROLE SELECTOR (first step, before the form) ═══ */}
      <div className="mb-1">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">1 · Choose your role</div>
        <p className="text-xs text-slate-500 mb-2">Every role registers on one primary layer for its account &amp; records. You'll use both apps day-to-day.</p>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {ROLES.map((r) => {
          const sel = role === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={`text-left px-3 py-2.5 rounded-lg border transition-colors ${
                sel ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
              }`}
            >
              <div className="text-sm font-semibold">{r.emoji} {r.label}</div>
              <div className={`text-[10px] ${sel ? "text-slate-300" : "text-slate-400"}`}>{r.sub}</div>
              <div className={`mt-1 inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                r.layer === "INVO Mobile"
                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}>Registers on: {r.layer}</div>
            </button>
          );
        })}
      </div>
      <div className="mb-6 text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-500">
        <span className="font-semibold text-slate-700">Two-layer registration:</span> Hotels &amp; Factoring partners register on the
        HotelsVendors web layer; Suppliers &amp; Logistics providers register on the INVO mobile layer. Regardless of where you
        register, hotels and suppliers use <span className="font-medium">both apps</span> — web for control &amp; compliance, mobile for the field.
      </div>

      {/* ═══ ROLE PITCH — procurement tech, as reimagined for this role ═══ */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-1">{ROLE_PITCH[role].kicker}</div>
        <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2">{ROLE_PITCH[role].line}</h3>
        <ul className="space-y-1.5 mb-3">
          {ROLE_PITCH[role].highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-[13px] text-slate-700">
              <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 shrink-0" /> {h}
            </li>
          ))}
        </ul>
        <div className="text-[13px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          {ROLE_PITCH[role].statement}
        </div>
      </div>

      {/* Promotional hooks */}
      {ROLE_HOOKS[role]}
      <div className="mt-3">
        <RoleBenefits role={role === "FACTORING" ? "FACTOR" : role === "LOGISTICS" ? "LOGISTICS" : role as "HOTEL" | "SUPPLIER"} />
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mt-6 mb-4">
        {[1, 2].map((s) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full ${f.step >= s ? "bg-blue-600" : "bg-slate-200"}`} />
        ))}
        <span className="text-[11px] text-slate-400 ml-1">Step {f.step} of 2</span>
      </div>

      {f.step === 1 ? (
        <div className="space-y-3">
          <Input label={field.name} value={f.name} onChange={set("name")} placeholder="Meridian Resorts" />
          <Input label={field.cr} value={f.cr} onChange={set("cr")} placeholder="Commercial Registration No." />
          <Input label={field.booking} value={f.booking} onChange={set("booking")} placeholder="Optional" />
          <Input label="Contact Person" value={f.contact} onChange={set("contact")} placeholder="Full name" />
          <Input label="Phone (WhatsApp)" value={f.phone} onChange={set("phone")} placeholder="+20 1X XXX XXXX" dir="ltr" />
          <button
            onClick={() => f.step < 2 && setF((s) => ({ ...s, step: 2 }))}
            disabled={!stepOk}
            className="w-full mt-2 py-3 rounded-lg bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 disabled:opacity-40 transition-colors"
          >
            Continue
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <Input label="Business Email" type="email" value={f.email} onChange={set("email")} placeholder="ops@company.com" />
          <Input label="Password" type="password" value={f.password} onChange={set("password")} placeholder="Min. 8 characters" />
          {role === "SUPPLIER" && (
            <Input label="Promo Code" value={f.promo} onChange={set("promo")} placeholder="CHV000" lg />
          )}
          {field.extra && <Input label={field.extra.label} value={f.extraField} onChange={set("extraField")} placeholder={field.extra.placeholder} />}
          <label className="flex items-start gap-2.5 text-xs text-slate-600">
            <input type="checkbox" checked={f.accepted} onChange={setB("accepted")} className="mt-0.5 h-4 w-4 rounded border-slate-300" />
            I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms</Link> and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>, and authorize ETA-compliant e-invoicing.
          </label>
          {msg && <div className={`rounded-md px-3 py-2 text-xs ${msg.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{msg.text}</div>}
          <div className="flex gap-3">
            <button onClick={() => setF((s) => ({ ...s, step: 1 }))} className="px-5 py-3 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold">Back</button>
            <button onClick={submit} disabled={!stepOk || submitting} className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-40 transition-colors">
              {submitting ? "Creating…" : "Create Free Account"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 text-center text-sm text-slate-500">
        Already have an account? <Link href="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
      </div>
    </div>
  );
}

function Input(props: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; placeholder?: string; dir?: string; lg?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 mb-1">{props.label}</label>
      <input
        type={props.type || "text"}
        dir={props.dir as "ltr" | "rtl" | undefined}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        className={`w-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-3.5 ${props.lg ? "py-3" : "py-2.5"} text-sm bg-white text-slate-900`}
      />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md">
      <Suspense fallback={<div className="text-slate-400 text-sm">Loading registration…</div>}>
        <RegisterInner />
      </Suspense>
    </div>
  );
}
