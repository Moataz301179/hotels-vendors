"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const TX = {
  ink: "#0B0F14",
  goldDark: "#a8874a",
  beige: "#F4F0E8",
  border: "rgba(11,15,20,.14)",
};

/* ── Live platform counts from the real API (honest — no fabricated numbers) ── */
interface LiveCounts { products: number | null; suppliers: number | null; }

function useLiveCounts(): LiveCounts {
  const [counts, setCounts] = useState<LiveCounts>({ products: null, suppliers: null });
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [p, s] = await Promise.all([
          fetch("/api/v1/products?limit=1").then((r) => r.json()),
          fetch("/api/v1/suppliers?limit=1").then((r) => r.json()),
        ]);
        if (!active) return;
        setCounts({
          products: p.success && p.data ? (p.data.pagination?.total ?? null) : null,
          suppliers: s.success && s.data ? (s.data.pagination?.total ?? null) : null,
        });
      } catch { if (active) setCounts({ products: null, suppliers: null }); }
    })();
    return () => { active = false; };
  }, []);
  return counts;
}

export default function MarketingPage() {
  const { products, suppliers } = useLiveCounts();
  const hasLive = (products !== null && products > 0) || (suppliers !== null && suppliers > 0);

  return (
    <div style={{ background: "#FFFFFF", color: TX.ink, fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", minHeight: "100vh" }}>
      <style>{`
        .ct-shadow{box-shadow:8px 8px 0 rgba(11,15,20,.08)}
        .ct-btn{display:inline-block;padding:13px 24px;border-radius:8px;font-weight:700;font-size:14px;cursor:pointer;border:1.5px solid ${TX.ink};background:transparent;color:${TX.ink};transition:transform .15s ease-out,box-shadow .15s ease-out;font-family:inherit;text-decoration:none}
        .ct-btn:hover{transform:translate(-1px,-1px);box-shadow:3px 3px 0 ${TX.ink}}
        .ct-btn-gold{background:${TX.goldDark};color:#fff;border-color:${TX.goldDark}}
        .ct-btn-gold:hover{box-shadow:3px 3px 0 rgba(11,15,20,.35)}
      `}</style>

      {/* HERO — honest value prop, no fabricated numbers */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "120px 28px 84px", display: "grid", gridTemplateColumns: "1.15fr .85fr", gap: 60, alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid "+TX.border, borderRadius: 99, padding: "6px 14px", fontSize: 12, color: "#64609a", fontWeight: 600, marginBottom: 22 }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: TX.goldDark, display: "inline-block" }} />
            Egypt&apos;s B2B hospitality procurement platform
          </div>
          <h1 style={{ fontSize: "clamp(36px,4.2vw,60px)", fontWeight: 800, letterSpacing: "-.025em", lineHeight: 1.06, margin: 0 }}>
            Procurement infrastructure for <span style={{ color: TX.goldDark }}>Egyptian hospitality</span>
          </h1>
          <p style={{ fontSize: 16, color: "#64609a", lineHeight: 1.65, maxWidth: "52ch", marginTop: 18 }}>
            Hotels buy, suppliers sell at fixed prices, logistics fulfills consolidated routes, and factoring injects liquidity — every invoice ETA e-invoiced and governed by the Authority Matrix.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
            <Link className="ct-btn ct-btn-gold" href="/marketplace">Browse the catalog</Link>
            <Link className="ct-btn" href="/register">Create an account</Link>
          </div>

          {/* LIVE honest counters — only render when real data exists */}
          {hasLive && (
            <div style={{ display: "flex", gap: 32, marginTop: 40, borderTop: "1px solid "+TX.border, paddingTop: 22 }}>
              {products !== null && products > 0 && (
                <div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 24, fontWeight: 700 }}>{products}</div><div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#8a8a90", fontWeight: 700 }}>Products live</div></div>
              )}
              {suppliers !== null && suppliers > 0 && (
                <div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 24, fontWeight: 700 }}>{suppliers}</div><div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#8a8a90", fontWeight: 700 }}>Suppliers live</div></div>
              )}
            </div>
          )}
          {!hasLive && (
            <div style={{ marginTop: 40, borderTop: "1px solid "+TX.border, paddingTop: 18, fontSize: 13, color: "#8a8a90" }}>
              Early access — supplier onboarding in progress. The catalog grows as verified suppliers list inventory.
            </div>
          )}
        </div>

        {/* Right: platform schematic (real capabilities, no invented metrics) */}
        <div style={{ position: "relative", minHeight: 430 }}>
          <div className="ct-shadow" style={{ position: "absolute", inset: "28px 28px 28px 8px", background: TX.beige, border: "1.5px solid "+TX.ink, borderRadius: 12, padding: 26, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#8a8a90", fontWeight: 800 }}>Platform core</span>
            {[
              ["Fixed-price catalog", "Suppliers set price + quantity — no bidding"],
              ["Authority Matrix", "Every order mutation passes approval chains"],
              ["ETA e-Invoicing", "Sign, submit, track — dead-letter retry"],
              ["Factoring", "Non-recourse advances on validated invoices"],
              ["Shared logistics", "Consolidated routes cut delivery overhead"],
            ].map(([t, d]) => (
              <div key={t} style={{ background: "#fff", border: "1px solid "+TX.border, borderRadius: 10, padding: "10px 14px", boxShadow: "3px 3px 0 rgba(11,15,20,.05)" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700 }}>{t}</div>
                <div style={{ fontSize: 11, color: "#8a8a90", marginTop: 2 }}>{d}</div>
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", left: -16, bottom: -18, background: TX.ink, color: "#fff", padding: "14px 18px", borderRadius: 10, fontFamily: "'JetBrains Mono',monospace", fontSize: 13, boxShadow: "5px 5px 0 rgba(168,135,74,.55)" }}>
            ETA e-invoicing enabled
          </div>
        </div>
      </section>

      {/* REAL differentiators (factual, no invented testimonials) */}
      <section style={{ borderTop: "1px solid "+TX.border, background: "#FAFAF7", padding: "64px 28px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          {[
            ["Fixed pricing", "Suppliers publish price + quantity. Hotels compare and commit — no auction fatigue."],
            ["ETA-native", "Every invoice is submitted to the Egyptian Tax Authority with signed UUID."],
            ["Factoring embedded", "Non-recourse liquidity tied to validated invoices — suppliers get paid in days, not months."],
            ["Governance built in", "Tiered approvals, dual-signature overrides, and a full audit trail on every order."],
          ].map(([t, d]) => (
            <div key={t} style={{ borderTop: "3px solid "+TX.goldDark, paddingTop: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 800 }}>{t}</div>
              <p style={{ fontSize: 13.5, color: "#64609a", lineHeight: 1.6, marginTop: 8 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATALOG CTA (honest empty state) */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "64px 28px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 32 }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, margin: 0 }}>Browse the <span style={{ color: TX.goldDark }}>catalog</span></h2>
          <span style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#8a8a90", fontWeight: 700 }}>Live from the platform</span>
        </div>
        <div style={{ border: "1.5px solid "+TX.ink, borderRadius: 12, padding: "48px 28px", textAlign: "center", background: "#FAFAF7" }}>
          {products !== null && products > 0 ? (
            <p style={{ fontSize: 15, color: "#64609a" }}>{products} products available — <Link href="/marketplace" style={{ color: TX.goldDark, fontWeight: 700 }}>open the marketplace →</Link></p>
          ) : (
            <>
              <p style={{ fontSize: 15, color: "#64609a" }}>Products appear here as suppliers list their inventory on the platform.</p>
              <Link href="/marketplace" className="ct-btn" style={{ marginTop: 18 }}>Visit the marketplace</Link>
            </>
          )}
        </div>
      </section>

      {/* PRICING — real approved fee tiers */}
      <section style={{ background: "#FAFAF7", padding: "64px 28px", borderTop: "1px solid "+TX.border }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 40 }}>
            <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, margin: 0 }}>Transaction <span style={{ color: TX.goldDark }}>fees</span></h2>
            <span style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#8a8a90", fontWeight: 700 }}>Per completed order</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {[
              { t: "Starter", v: "2.5% fee", d: "For hotels starting platform procurement" },
              { t: "Professional", v: "2.0% fee", d: "Most popular — includes full governance" },
              { t: "Enterprise", v: "1.5% fee", d: "Volume pricing for hotel groups" },
            ].map((p) => (
              <div key={p.t} style={{ border: "1.5px solid "+TX.border, borderRadius: 12, padding: 24, background: "#fff" }}>
                <div style={{ fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase", color: "#8a8a90", fontWeight: 800 }}>{p.t}</div>
                <div style={{ fontSize: 30, fontWeight: 800, margin: "12px 0 6px", fontFamily: "'JetBrains Mono',monospace" }}>{p.v}</div>
                <div style={{ fontSize: 13, color: "#64609a" }}>{p.d}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#8a8a90", marginTop: 18, textAlign: "center" }}>Approved fee structure — HotelsVendors platform. Fees are deducted before partner settlement, always.</p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "0 28px 64px" }}>
        <div className="ct-shadow" style={{ background: TX.ink, color: "#fff", borderRadius: 16, padding: "56px 28px", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,38px)", fontWeight: 800, margin: 0 }}>Start procurement on the right rails</h2>
          <p style={{ color: "rgba(255,255,255,.7)", marginTop: 10, fontSize: 15 }}>ETA-native, fixed-price, factoring-embedded — built for Egyptian hotels and suppliers.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 26, flexWrap: "wrap" }}>
            <Link href="/register" style={{ background: TX.goldDark, color: "#fff", padding: "14px 30px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Create your account</Link>
            <Link href="/marketplace" style={{ background: "transparent", color: "#fff", padding: "14px 30px", borderRadius: 8, fontWeight: 700, fontSize: 14, border: "1.5px solid rgba(255,255,255,.4)", textDecoration: "none" }}>Browse marketplace</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
