"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Factory,
  FileText,
  Landmark,
  RefreshCw,
  Shield,
  Upload,
  Users,
  Zap,
} from "lucide-react";

/* ── Content ───────────────────────────────────────────────────── */

const BENEFITS = [
  {
    icon: Zap,
    accent: "text-emerald-600 bg-emerald-50 border-emerald-200",
    title: "48-hour early cash-out via Oliv",
    desc: "Once a delivered order is verified and invoiced, you can request early payment and receive cash in about 48 hours — instead of waiting on hotel payment cycles. Promo code CHV000 applies at checkout.",
  },
  {
    icon: RefreshCw,
    accent: "text-blue-600 bg-blue-50 border-blue-200",
    title: "0% platform subscription",
    desc: "There is no monthly subscription to sell on HotelsVendors. You are charged only a transactional fee on completed orders — you only pay when you actually sell.",
  },
  {
    icon: FileText,
    accent: "text-emerald-600 bg-emerald-50 border-emerald-200",
    title: "ETA-compliant invoicing, generated for you",
    desc: "Every order is turned into ETA-compliant e-invoices automatically, signed and submitted through the Egyptian Tax Authority bridge. No spreadsheet chasing on your side.",
  },
  {
    icon: Clock,
    accent: "text-blue-600 bg-blue-50 border-blue-200",
    title: "Live direct hotel order inbox",
    desc: "Direct purchase orders from hotels land in your dashboard the moment they're placed. Accept, schedule fulfilment, and track delivery in one place.",
  },
  {
    icon: Upload,
    accent: "text-blue-600 bg-blue-50 border-blue-200",
    title: "Low-friction catalog upload",
    desc: "Bring your catalog in without heavy setup — upload a price list or spreadsheet, or connect your ERP/webhook to keep it in sync automatically.",
  },
  {
    icon: Users,
    accent: "text-emerald-600 bg-emerald-50 border-emerald-200",
    title: "AI demand matching",
    desc: "The platform matches your catalog against live hotel sourcing needs and surfaces the orders most relevant to what you actually carry.",
  },
];

const STEPS = [
  {
    step: "1",
    title: "Register",
    desc: "Create your supplier account with basic company details. Takes about 2 minutes.",
  },
  {
    step: "2",
    title: "Upload your catalog / price list",
    desc: "Drop in your product catalog or send us your price list. We help keep it in sync from there.",
  },
  {
    step: "3",
    title: "Accept orders",
    desc: "Direct hotel orders land in your inbox. Accept what makes sense for you and deliver.",
  },
  {
    step: "4",
    title: "Cash out in 48h",
    desc: "Once an order is delivered and the invoice is verified, request early cash-out via Oliv.",
  },
];

const FAQ = [
  {
    q: "How does the 48h cash-out actually work?",
    a: "You deliver an order, the invoice is verified on the platform, and you opt into early payment funded by our financing partner Oliv. Funds are typically available in around 48 hours. Use promo code CHV000 when signing up.",
  },
  {
    q: "What does HotelsVendors cost suppliers?",
    a: "There is no platform subscription fee — it's 0% to have an account. Revenue comes from a transactional fee on completed orders, so you only pay when you actually sell.",
  },
  {
    q: "Do I need to build an ERP integration to list my products?",
    a: "No. You can upload a catalog or price list directly in the dashboard. If you already have an ERP or webhook, you can connect it through the 'Connect your catalog' panel to keep inventory auto-synced.",
  },
  {
    q: "Is the platform ETA compliant for invoicing?",
    a: "Yes. ETA-compliant e-invoices are generated for you on completed orders, signed and submitted through the Egyptian Tax Authority bridge — you don't handle the e-invoice paperwork manually.",
  },
];

/* ── Components ────────────────────────────────────────────────── */

function SectionHeading({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center mb-14">
      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
        {kicker}
      </span>
      <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-slate-900">{title}</h2>
      {sub && <p className="mt-4 text-slate-600 leading-relaxed">{sub}</p>}
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */

export default function SupplierJoinPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  /* Connect-catalog form state */
  const [sourceName, setSourceName] = useState("");
  const [apiBaseUrl, setApiBaseUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [formError, setFormError] = useState("");

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setErrorMsg("");

    if (!sourceName.trim() || !apiBaseUrl.trim()) {
      setFormError("Both a source name and an API base URL are required.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/v1/sourcing/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: sourceName.trim(), apiBaseUrl: apiBaseUrl.trim(), type: "api" }),
      });

      if (!res.ok) {
        let detail = `Request failed (${res.status}).`;
        try {
          const data = await res.json();
          if (data?.error) detail = data.error;
        } catch {
          /* ignore parse error — keep generic message */
        }
        /* 401 means an active session is required to register a source */
        if (res.status === 401) detail = "Please sign in to connect your catalog. Register a free supplier account and the connection panel unlocks.";
        throw new Error(detail);
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Could not reach the sourcing service right now. Please try again in a moment."
      );
    }
  }

  return (
    <main className="bg-[#F8FAFC] text-slate-900">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">
              <Landmark size={14} className="text-emerald-600" />
              For hospitality suppliers
            </span>
            <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight text-slate-900">
              Get paid fast while
              <span className="text-blue-600"> direct buyer orders grow.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              List your hotel goods once and get <strong className="text-emerald-600">48h cash-out</strong> on
              verified deliveries — no platform subscription, no chasing invoices. The platform surfaces
              direct purchase orders from hotels actively sourcing what you carry.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register?type=supplier"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Join Free as Vendor <ArrowRight size={16} />
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                See the marketplace
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-600" /> No monthly fee
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap size={15} className="text-emerald-600" /> 48h early cash-out
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Shield size={15} className="text-emerald-600" /> ETA-compliant invoicing
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why suppliers choose ── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeading
          kicker="Why suppliers choose HotelsVendors"
          title="Payment speed and real demand — without the overhead"
          sub="We keep the value prop simple: you get paid faster, you pay less to be here, and the matching does the legwork."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="group rounded-xl border border-slate-200 bg-white p-7 transition hover:border-slate-300 hover:shadow-sm"
              >
                <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border ${b.accent}`}>
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-semibold text-slate-900">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How onboarding works ── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeading
          kicker="Onboarding"
          title="From signup to your first paid order in four steps"
          sub="No paper, no sales calls, no long approval cycles. Just get in and start serving hotel buyers."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div
              key={s.step}
              className="relative rounded-xl border border-slate-200 bg-white p-7"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {s.step}
                </span>
                {i < STEPS.length - 1 && (
                  <ArrowRight size={16} className="hidden text-slate-300 sm:inline" />
                )}
              </div>
              <h3 className="text-base font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Connect your catalog ── */}
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <div className="mb-6 flex items-start gap-4">
            <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600">
              <RefreshCw size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Connect your catalog</h2>
              <p className="mt-1 text-sm text-slate-600">
                Already have an ERP or product API? Register your source and we&apos;ll keep your catalog synced
                automatically. New to the platform? You can always upload a price list directly instead.
              </p>
            </div>
          </div>

          <form onSubmit={handleConnect} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="source-name" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Source name
                </label>
                <input
                  id="source-name"
                  type="text"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="e.g. Cairo Food Distributors"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label htmlFor="api-base" className="mb-1.5 block text-sm font-medium text-slate-700">
                  API base URL
                </label>
                <input
                  id="api-base"
                  type="url"
                  value={apiBaseUrl}
                  onChange={(e) => setApiBaseUrl(e.target.value)}
                  placeholder="https://erp.example.com/api"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {status === "loading" ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Connecting…
                </>
              ) : (
                <>
                  Connect source <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {status === "success" && (
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
              <div>
                <p className="font-semibold">Source registered — connect your ERP/webhook to push catalog.</p>
                <p className="mt-1 text-emerald-700">
                  We&apos;ll ingest your product feed as soon as your webhook or sync pushes data. Add the same
                  URL from your dashboard to start syncing.
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <Shield size={18} className="mt-0.5 shrink-0 text-red-600" />
              <div>
                <p className="font-semibold">We couldn&apos;t connect your source.</p>
                <p className="mt-1 text-red-700">
                  {formError || errorMsg || "Something went wrong. Please check your details and try again."}
                </p>
                {!formError && (
                  <p className="mt-1 text-red-600/80">
                    No changes were saved. You can retry, or reach our onboarding agent for help.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-24">
          <SectionHeading kicker="FAQ" title="Questions suppliers ask most" />
          <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {FAQ.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={f.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-sm md:text-base font-semibold text-slate-900">{f.q}</span>
                    <span
                      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-transform ${
                        isOpen ? "rotate-180 bg-slate-100" : ""
                      }`}
                    >
                      <ArrowRight size={14} className="rotate-90" />
                    </span>
                  </button>
                  {isOpen && <p className="px-6 pb-5 text-sm leading-relaxed text-slate-600">{f.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA band ── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-2xl bg-slate-900 px-8 py-14 text-center md:px-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
            <Factory size={14} /> Start today
          </span>
          <h2 className="mt-5 text-3xl md:text-4xl font-bold tracking-tight text-white">
            Ready to get paid in 48 hours on your next hotel order?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            Join free, upload your catalog, and start accepting direct orders from hotels — with early
            cash-out through Oliv when you need it.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register?type=supplier"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-400"
            >
              Join Free as Vendor <ArrowRight size={16} />
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-8 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
            >
              Browse the marketplace
            </Link>
          </div>
          <p className="mt-6 text-xs text-slate-500">
            Use promo code <span className="font-semibold text-emerald-300">CHV000</span> at signup.
          </p>
        </div>
      </section>
    </main>
  );
}