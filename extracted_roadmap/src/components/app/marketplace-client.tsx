"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { egp } from "@/lib/utils";
import { Badge } from "@/components/ui";
import { ArrowUpRight, CheckCircle2, Loader2, Minus, Plus, Search, ShieldCheck, Star, Store, TrendingDown, TrendingUp, X, Wallet, Receipt, PiggyBank, AlertTriangle } from "lucide-react";

export type MarketProduct = {
  id: number;
  name: string;
  category: string;
  image: string | null;
  unit: string | null;
  price: number;
  moq: number | null;
  leadTimeDays: number | null;
  rating: string | null;
  supplierName: string;
  supplierCity: string | null;
  deal?: boolean;
};

const marketTickerItems = [
  { name: "F&B Fresh Produce Index", value: "EGP 42.0K", move: "+1.8%", up: true, deal: false },
  { name: "Linen & Bedding Index", value: "EGP 132.0K", move: "-0.9%", up: false, deal: false },
  { name: "Guest Amenity Flash Deal", value: "EGP 2.2", move: "-12%", up: false, deal: true },
  { name: "Still Water 24-Pack Promo", value: "EGP 180", move: "-8%", up: false, deal: true },
  { name: "Kitchen CapEx Index", value: "EGP 8.9M", move: "+2.1%", up: true, deal: false },
  { name: "Supplier SLA Performance", value: "97.8%", move: "+1.9%", up: true, deal: false },
  { name: "Housekeeping Sanitizer Deal", value: "EGP 220", move: "-15%", up: false, deal: true },
  { name: "Reverse Factoring Rate", value: "2.1%", move: "-0.3%", up: false, deal: false },
];

function MarketTicker() {
  const repeated = [...marketTickerItems, ...marketTickerItems];
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-bg-1">
      <div className="flex min-w-max ticker-track">
        {repeated.map((i, idx) => (
          <div key={`${i.name}-${idx}`} className="flex min-w-[230px] items-center justify-between gap-5 border-r border-border px-5 py-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-4 flex items-center gap-1">
                {i.deal && <span className="inline-block h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />}
                {i.name}
              </p>
              <p className="mt-1 text-sm font-semibold text-fg">{i.value}</p>
            </div>
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${i.up ? "bg-green/10 text-green" : i.deal ? "bg-lime-dim text-lime" : "bg-red/10 text-red"}`}>
              {i.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {i.move}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MarketplaceClient({ products, canBuy, creditAvailable, walletBalance }: { products: MarketProduct[]; canBuy: boolean; creditAvailable: number; walletBalance: number }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [active, setActive] = useState<MarketProduct | null>(null);
  const [qty, setQty] = useState(1);
  const [term, setTerm] = useState(0);
  const [finance, setFinance] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [orderRef, setOrderRef] = useState("");

  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map((p) => p.category)))], [products]);
  const filtered = products.filter((p) => (cat === "All" || p.category === cat) && (q === "" || p.name.toLowerCase().includes(q.toLowerCase()) || p.supplierName.toLowerCase().includes(q.toLowerCase())));

  function openDrawer(p: MarketProduct) {
    setActive(p);
    setQty(p.moq ?? 1);
    setTerm(0);
    setFinance(false);
    setStatus("idle");
  }

  async function placeOrder() {
    if (!active) return;
    setStatus("loading");
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: active.id, qty, paymentTermDays: term, finance }),
    });
    const data = await res.json();
    if (data.ok) {
      setOrderRef(data.reference);
      setStatus("done");
      router.refresh();
    } else {
      setStatus("idle");
    }
  }

  const subtotal = active ? active.price * qty : 0;
  const fee = Math.round((subtotal * 250) / 10000);
  const total = subtotal + fee;
  const wouldExceedCredit = term > 0 && total > creditAvailable;
  const projectedRunway = Math.max(0, walletBalance - total);

  return (
    <div className="space-y-6">
      <MarketTicker />

      <div className="rounded-3xl border border-border bg-bg-1 p-4 lg:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-4" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search SKUs, contract suppliers, categories…" className="h-11 w-full rounded-2xl border border-border-2 bg-bg px-10 text-sm text-fg outline-none placeholder:text-fg-4 focus:border-lime focus:ring-2 focus:ring-[var(--ring)]" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-3.5 py-2 text-xs font-medium transition ${cat === c ? "border-lime bg-lime-dim text-lime" : "border-border-2 text-fg-3 hover:border-border-3 hover:text-fg"}`}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Spend Guard Banner */}
      {canBuy && (
        <div className="rounded-2xl border border-lime/30 bg-lime-dim px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-lime text-bg"><PiggyBank className="h-5 w-5" /></div>
            <div>
              <p className="text-sm font-semibold text-fg">Control your spend before it happens</p>
              <p className="text-xs text-fg-3">Every order checks budget, credit limit, and cash impact before checkout.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-fg-3">Credit available: <strong className="text-lime">{egp(creditAvailable, { compact: true })}</strong></span>
            <span className="text-fg-3">Wallet: <strong className="text-lime">{egp(walletBalance, { compact: true })}</strong></span>
          </div>
        </div>
      )}

      {/* Promotional Deals Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.filter((p) => p.deal).slice(0, 4).map((p) => (
          <div key={p.id} className="rounded-2xl border border-lime/30 bg-lime-dim p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <Badge tone="lime">Flash Deal</Badge>
                <span className="text-2xl">{p.image}</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-fg line-clamp-2">{p.name}</p>
              <p className="text-xs text-fg-3">{p.supplierName}</p>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-base font-bold text-fg">{egp(p.price)}</span>
              {canBuy && (
                <button onClick={() => openDrawer(p)} className="h-8 rounded-lg bg-lime px-3 text-xs font-semibold text-bg hover:bg-lime-light">Order</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div key={p.id} className="group flex flex-col rounded-3xl border border-border bg-bg-1 p-5 transition hover:-translate-y-0.5 hover:border-border-3">
            <div className="flex items-start justify-between gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-bg-2 text-3xl">{p.image || "📦"}</div>
              <div className="flex flex-col items-end gap-1.5">
                <Badge tone="muted">{p.category}</Badge>
                {p.deal && <Badge tone="lime">Promo</Badge>}
              </div>
            </div>
            <h3 className="mt-5 min-h-[48px] font-semibold leading-snug text-fg">{p.name}</h3>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-fg-3">
              <span className="inline-flex items-center gap-1.5"><Store className="h-3.5 w-3.5 text-lime" /> {p.supplierName}</span>
              <span className="inline-flex items-center gap-1 text-gold"><Star className="h-3 w-3 fill-current" /> {p.rating}</span>
              <span className="text-fg-4">{p.leadTimeDays}d lead</span>
            </div>
            <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
              <div>
                <div className="text-xl font-semibold text-fg">{egp(p.price)}</div>
                <div className="mt-1 text-xs text-fg-4">per {p.unit} · MOQ {p.moq}</div>
              </div>
              {canBuy ? (
                <button onClick={() => openDrawer(p)} className="inline-flex items-center gap-1.5 rounded-xl bg-lime px-4 py-2 text-sm font-semibold text-bg transition hover:bg-lime-light">
                  Order <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <span className="rounded-full border border-border px-2.5 py-1 text-xs text-fg-4">Hotel checkout only</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <div className="rounded-3xl border border-border bg-bg-1 p-12 text-center text-fg-3">No products match your market search.</div>}

      {active && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/70" onClick={() => setActive(null)} />
          <div className="relative h-full w-full max-w-md overflow-y-auto border-l border-border bg-bg p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-fg">{status === "done" ? "Order captured" : "Controlled checkout"}</h2>
              <button onClick={() => setActive(null)} className="grid h-9 w-9 place-items-center rounded-xl border border-border-2"><X className="h-4 w-4" /></button>
            </div>

            {status === "done" ? (
              <div className="mt-12 flex flex-col items-center text-center">
                <CheckCircle2 className="h-14 w-14 text-lime" />
                <h3 className="mt-4 text-xl font-semibold text-fg">{orderRef}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-3">Order confirmed{finance ? `, financed on Net-${term}, and ready for tracking + GRN.` : " and ready for tracking + GRN."}</p>
                <button onClick={() => setActive(null)} className="mt-8 h-11 w-full rounded-2xl bg-lime font-semibold text-bg">Done</button>
              </div>
            ) : (
              <>
                <div className="mt-6 flex items-center gap-4 rounded-2xl border border-border bg-bg-1 p-4">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-bg-2 text-3xl">{active.image || "📦"}</div>
                  <div>
                    <div className="font-semibold text-fg">{active.name}</div>
                    <div className="text-xs text-fg-3">{active.supplierName} · {egp(active.price)}/{active.unit}</div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="text-sm font-semibold text-fg">Quantity</label>
                  <div className="mt-2 flex items-center gap-3">
                    <button onClick={() => setQty((v) => Math.max(active.moq ?? 1, v - 1))} className="grid h-10 w-10 place-items-center rounded-xl border border-border-2"><Minus className="h-4 w-4" /></button>
                    <input type="number" value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} className="h-10 w-24 rounded-xl border border-border-2 bg-bg-1 text-center text-sm outline-none focus:border-lime" />
                    <button onClick={() => setQty((v) => v + 1)} className="grid h-10 w-10 place-items-center rounded-xl border border-border-2"><Plus className="h-4 w-4" /></button>
                    <span className="text-xs text-fg-4">{active.unit}s</span>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="text-sm font-semibold text-fg">Checkout payment terms</label>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {[0, 30, 60, 90].map((d) => (
                      <button key={d} onClick={() => { setTerm(d); if (d === 0) setFinance(false); }} className={`rounded-xl border py-2 text-sm transition ${term === d ? "border-lime bg-lime-dim text-lime" : "border-border-2 text-fg-3"}`}>{d === 0 ? "Now" : `Net-${d}`}</button>
                    ))}
                  </div>
                </div>

                {term > 0 && (
                  <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-bg-1 p-4">
                    <input type="checkbox" checked={finance} onChange={(e) => setFinance(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--lime)]" />
                    <span>
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-fg"><ShieldCheck className="h-4 w-4 text-lime" /> Request reverse factoring lane</span>
                      <span className="mt-1 block text-xs leading-relaxed text-fg-3">Supplier can get paid early. Hotel repays in {term} days. Available credit: {egp(creditAvailable, { compact: true })}.</span>
                    </span>
                  </label>
                )}

                {/* Spend-before-it-happens guardrail */}
                <div className="mt-4 space-y-2 rounded-2xl border border-border bg-bg-1 p-4 text-sm">
                  <div className="flex justify-between"><span className="text-fg-3">Subtotal</span><span>{egp(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-fg-3">Platform fee (2.5%)</span><span>{egp(fee)}</span></div>
                  {term > 0 && (
                    <div className="flex justify-between">
                      <span className="text-fg-3">Credit impact</span>
                      <span className={wouldExceedCredit ? "text-red" : "text-green"}>{wouldExceedCredit ? "Exceeds limit" : "Within limit"}</span>
                    </div>
                  )}
                  {term === 0 && (
                    <div className="flex justify-between">
                      <span className="text-fg-3">Cash wallet impact</span>
                      <span className={total > walletBalance ? "text-red" : "text-green"}>{total > walletBalance ? "Insufficient wallet" : `EGP ${Math.round(projectedRunway / 100).toLocaleString()} remaining`}</span>
                    </div>
                  )}
                  <div className="mt-2 flex justify-between border-t border-border pt-2 font-semibold"><span>Total</span><span>{egp(total)}</span></div>
                </div>

                {wouldExceedCredit && (
                  <div className="mt-4 flex items-start gap-2 rounded-xl border border-red/30 bg-red/10 p-3 text-xs text-red">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    This order would exceed your available credit. Reduce quantity or choose Net-0 payment.
                  </div>
                )}

                <button onClick={placeOrder} disabled={status === "loading" || wouldExceedCredit || (term === 0 && total > walletBalance)} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-lime font-semibold text-bg transition hover:bg-lime-light disabled:opacity-60">
                  {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : `Confirm controlled order · ${egp(total, { compact: true })}`}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
