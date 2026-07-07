"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, Banknote, ClipboardCheck, CreditCard, FileText, PackageCheck, ShoppingCart, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Sparkles,
    label: "AI demand signal",
    title: "Assistant detects a replenishment risk",
    body: "Occupancy, PAR levels and banquet calendar trigger a suggested purchase plan before shortage happens.",
    meta: "Forecast confidence 91%",
  },
  {
    icon: ShoppingCart,
    label: "Order placement",
    title: "Hotel turns the plan into a controlled PO",
    body: "Budget, department approval, contracted supplier pricing and delivery window are locked before checkout.",
    meta: "PO approved · EGP 492K",
  },
  {
    icon: CreditCard,
    label: "Checkout terms",
    title: "Payment terms are selected at checkout",
    body: "Pay now, Net-30, Net-60 or Net-90. The platform checks credit limits and supplier preferences instantly.",
    meta: "Net-60 selected",
  },
  {
    icon: Banknote,
    label: "Factoring request",
    title: "Supplier requests early payout",
    body: "The accepted PO becomes a fundable receivable with buyer data, risk score and expected ETA invoice evidence.",
    meta: "Funder quote 2.1% discount",
  },
  {
    icon: PackageCheck,
    label: "Delivery tracking",
    title: "Carrier delivers with live status",
    body: "Route, SLA, temperature notes and proof-of-delivery stay linked to the order and settlement record.",
    meta: "POD captured 10:42 AM",
  },
  {
    icon: ClipboardCheck,
    label: "GRN",
    title: "Receiving creates the Goods Received Note",
    body: "Quantity variance, acceptance, rejection, photos and department sign-off are stored before payment release.",
    meta: "GRN accepted 97.5%",
  },
  {
    icon: FileText,
    label: "ETA invoice",
    title: "ETA e-invoice is recorded and matched",
    body: "UUID, tax profile, invoice line items and buyer acceptance are attached to the financing and payment audit trail.",
    meta: "ETA UUID matched",
  },
  {
    icon: BadgeCheck,
    label: "Settlement",
    title: "Payments, fees and repayments settle automatically",
    body: "Supplier payout, platform fee, funder repayment and hotel liability all reconcile on the same ledger.",
    meta: "Supplier paid in 24h",
  },
];

export function HeroWorkflowCarousel() {
  const [active, setActive] = useState(0);
  const step = steps[active];
  const Icon = step.icon;

  useEffect(() => {
    const t = setInterval(() => setActive((v) => (v + 1) % steps.length), 2900);
    return () => clearInterval(t);
  }, []);

  const visible = useMemo(() => {
    return steps.map((s, i) => ({ ...s, active: i === active, done: i < active }));
  }, [active]);

  return (
    <div className="rounded-3xl border border-border-2 bg-bg-1 p-4 shadow-2xl shadow-black/30 lg:p-5">
      <div className="rounded-2xl border border-border bg-bg p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-lime-dim text-lime">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-lime">{step.label}</p>
              <h3 className="mt-1 text-lg font-semibold text-fg">{step.title}</h3>
            </div>
          </div>
          <span className="hidden rounded-full border border-border-2 px-3 py-1 text-xs text-fg-3 sm:block">
            {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
          </span>
        </div>
        <p className="mt-5 min-h-[76px] text-sm leading-relaxed text-fg-2">{step.body}</p>
        <div className="mt-5 rounded-2xl border border-border bg-bg-2 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-fg-3">Live workflow status</span>
            <span className="font-medium text-lime">{step.meta}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-bg-3">
            <div className="h-full rounded-full bg-lime transition-all duration-700" style={{ width: `${((active + 1) / steps.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 lg:grid-cols-8">
        {visible.map((s, i) => {
          const SIcon = s.icon;
          return (
            <button
              key={s.label}
              type="button"
              onClick={() => setActive(i)}
              className={`group rounded-2xl border p-3 text-left transition ${s.active ? "border-lime bg-lime-dim" : "border-border bg-bg hover:border-border-3"}`}
            >
              <SIcon className={`h-4 w-4 ${s.active ? "text-lime" : "text-fg-4 group-hover:text-fg-2"}`} />
              <p className={`mt-2 hidden text-[11px] leading-tight lg:block ${s.active ? "text-fg" : "text-fg-4"}`}>{s.label}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-bg-2 px-4 py-3 text-xs text-fg-3">
        <span>One transaction file: PO → checkout → factoring → GRN → ETA → settlement</span>
        <ArrowRight className="h-4 w-4 text-lime" />
      </div>
    </div>
  );
}
