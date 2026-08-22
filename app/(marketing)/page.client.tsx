"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ── Corporate Trust design tokens (light) ── */
const TX = {
  ink: "#0B0F14",
  grey: "#646367",
  goldDark: "#a8874a",
  beige: "#F4F0E8",
  border: "rgba(11,15,20,.14)",
};

/* ── Count-up hook (settles on real value) ── */
function useCountUp(end: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    let raf = 0;
    let settled = false;
    const run = (startNow: number) => {
      const tick = (now: number) => {
        const p = Math.min((now - startNow) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(eased * end));
        if (p < 1) raf = requestAnimationFrame(tick);
        else { settled = true; setValue(end); }
      };
      tick(startNow);
    };
    const timer = window.setTimeout(() => {
      if (!started.current) { started.current = true; run(performance.now()); }
    }, 200);
    const force = window.setTimeout(() => { if (!settled) setValue(end); }, duration + 500);
    return () => { cancelAnimationFrame(raf); clearTimeout(timer); clearTimeout(force); };
  }, [end, duration]);

  return { value, ref };
}

function StatCounter({ end, suffix = "", label }: { end: number; suffix?: string; label: string }) {
  const { value, ref } = useCountUp(end);
  return (
    <div style={{ textAlign: "center" }}>
      <div ref={ref} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 36, fontWeight: 800, color: TX.ink }}>
        {value.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#8a8a90", fontWeight: 700, marginTop: 6 }}>
        {label}
      </div>
    </div>
  );
}

/* ── Scroll reveal ── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-visible")); return; }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach((e) => obs.observe(e));
    return () => obs.disconnect();
  }, []);
}

const PLANS = [
  { name: "Starter", price: "2.5", unit: "% fee", pop: false, feats: ["Up to 3 properties", "Fixed-price catalog", "ETA e-invoicing", "Email support"] },
  { name: "Professional", price: "2.0", unit: "% fee", pop: true, feats: ["Unlimited properties", "Authority Matrix governance", "Embedded factoring (48h)", "Shared-route logistics", "Priority support"] },
  { name: "Enterprise", price: "1.5", unit: "% fee", pop: false, feats: ["Everything in Professional", "Dedicated account manager", "ERP integrations (Opera/SAP)", "Custom SLA & SSO"] },
];

const QUOTES = [
  { q: "Daily ordering via shared logistics freed 60% of our storage — pure found money for a 15-property chain.", who: "Mark G.", role: "Procurement Director, Cairo hotel group" },
  { q: "Every PO is ETA-signed and every approval is logged. The Authority Matrix actually works.", who: "Sara A.", role: "GM, Coastal resort" },
  { q: "Factoring against validated invoices got us paid in 48 hours. Zero recourse, zero chasing.", who: "El Nour Textiles", role: "Supplier, 6th of October" },
];

export default function MarketingPage() {
  useScrollReveal();

  return (
    <div style={{ background: "#FFFFFF", color: TX.ink, fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", minHeight: "100vh" }}>
      <style>{`
        .reveal{opacity:0;transform:translateY(26px);transition:opacity .6s ease-out,transform .6s ease-out}
        .reveal.is-visible{opacity:1;transform:none}
        .ct-shadow{box-shadow:8px 8px 0 rgba(11,15,20,.08)}
        .ct-btn{display:inline-block;padding:13px 24px;border-radius:8px;font-weight:700;font-size:14px;cursor:pointer;border:1.5px solid ${TX.ink};background:transparent;color:${TX.ink};transition:transform .15s ease-out,box-shadow .15s ease-out}
        .ct-btn:hover{transform:translate(-1px,-1px);box-shadow:3px 3px 0 ${TX.ink}}
        .ct-btn-gold{background:${TX.goldDark};color:#fff;border-color:${TX.goldDark}}
        .ct-btn-gold:hover{box-shadow:3px 3px 0 rgba(11,15,20,.35)}
      `}</style>

      {/* HERO */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "120px 28px 84px", display: "grid", gridTemplateColumns: "1.15fr .85fr", gap: 60, alignItems: "center", background: "#FFFFFF" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid "+TX.border, borderRadius: 99, padding: "6px 14px", fontSize: 12, color: "#64609a", fontWeight: 600, marginBottom: 22 }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: TX.goldDark, display: "inline-block" }} />
            ETA-native · fixed pricing · factoring-embedded
          </div>
          <h1 style={{ fontSize: "clamp(38px,4.4vw,62px)", fontWeight: 800, letterSpacing: "-.025em", lineHeight: 1.05, margin: 0 }}>
            The procurement hub for <span style={{ color: TX.goldDark }}>Egyptian hospitality</span>
          </h1>
          <p style={{ fontSize: 16.5, color: "#64609a", lineHeight: 1.65, maxWidth: "48ch", marginTop: 18 }}>
            A four-sided B2B marketplace — hotels, suppliers, logistics, and factoring — with fixed pricing, tenant-isolated governance, and ETA-native e-invoicing on every order.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
            <Link className="ct-btn ct-btn-gold" href="/marketplace">Browse marketplace</Link>
            <Link className="ct-btn" href="/register">Join as supplier</Link>
          </div>
          <div style={{ display: "flex", gap: 32, marginTop: 40, borderTop: "1px solid "+TX.border, paddingTop: 22 }}>
            <div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 24, fontWeight: 700 }}>EGP 418K</div><div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#8a8a90", fontWeight: 700 }}>GMV / hour</div></div>
            <div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 24, fontWeight: 700 }}>5,214</div><div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#8a8a90", fontWeight: 700 }}>Live SKUs</div></div>
            <div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 24, fontWeight: 700 }}>99.6%</div><div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#8a8a90", fontWeight: 700 }}>ETA accepted</div></div>
          </div>
        </div>
        <div style={{ position: "relative", minHeight: 430 }}>
          <div className="ct-shadow" style={{ position: "absolute", inset: "28px 28px 28px 8px", background: TX.beige, border: "1.5px solid "+TX.ink, borderRadius: 12, padding: 26, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#8a8a90", fontWeight: 800 }}>Market pulse · LIVE</span>
            <div style={{ background: "#fff", border: "1px solid "+TX.border, borderRadius: 10, padding: 16, boxShadow: "4px 4px 0 rgba(11,15,20,.05)" }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, fontWeight: 700 }}>EGP 418,200</div>
              <div style={{ fontSize: 11, color: "#8a8a90", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 700 }}>GMV · last 60 min</div>
            </div>
            <div style={{ background: "#fff", border: "1px solid "+TX.border, borderRadius: 10, padding: 16, boxShadow: "4px 4px 0 rgba(15,15,20,.05)" }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, fontWeight: 700 }}>+12.4%</div>
              <div style={{ fontSize: 11, color: "#8a8a90", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 700 }}>vs same hour yesterday</div>
            </div>
          </div>
          <div style={{ position: "absolute", left: -16, bottom: -18, background: TX.ink, color: "#fff", padding: "16px 20px", borderRadius: 10, fontFamily: "'JetBrains Mono',monospace", fontSize: 15, boxShadow: "5px 5px 0 rgba(168,135,74,.55)" }}>
            ETA UUID ✓ SIGNED
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ borderTop: "1px solid "+TX.border, borderBottom: "1px solid "+TX.border, padding: "56px 28px", background: "#FAFAF7" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          <StatCounter end={200} suffix="+" label="Hotels" />
          <StatCounter end={1200} suffix="+" label="Suppliers" />
          <StatCounter end={2} suffix="B" label="GMV EGP" />
          <StatCounter end={48} suffix="h" label="Delivery window" />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ maxWidth: 1240, margin: "0 auto", padding: "64px 28px", background: "#FFFFFF" }}>
        <div className="reveal" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 40 }}>
          <h2 style={{ fontSize: "clamp(26px,3vw,38px)", fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>
            Everything you need to <span style={{ color: TX.goldDark }}>run procurement</span>
          </h2>
          <span style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#8a8a90", fontWeight: 700 }}>Four-sided marketplace</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
          <div className="reveal">
            <div style={{ display: "inline-grid", placeItems: "center", width: 48, height: 48, background: TX.goldDark, color: "#fff", borderRadius: 10, fontWeight: 800, marginBottom: 16, fontSize: 17 }}>AM</div>
            <h3 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 12px" }}>Authority Matrix governance</h3>
            <p style={{ fontSize: 15, color: "#64609a", lineHeight: 1.7, maxWidth: "46ch" }}>Every order mutation passes value-threshold approval chains. Rejections log actor, timestamp, reason, and order snapshot. Admin overrides need dual authorization.</p>
          </div>
          <div className="reveal ct-shadow" style={{ minHeight: 220, background: TX.beige, border: "1.5px solid "+TX.ink, borderRadius: 12, display: "grid", placeItems: "center" }}>
            <div style={{ border: "1.5px dashed #b9b4a8", borderRadius: 8, padding: "26px 34px", color: "#8a8a90", fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", fontSize: 12, textAlign: "center" }}>
              Approval chain · dual-auth
            </div>
          </div>
          <div className="reveal ct-shadow" style={{ minHeight: 220, borderRadius: 12, border: "1.5px solid "+TX.ink, display: "grid", placeItems: "center", background: "#fff" }}>
            <div style={{ border: "1.5px dashed #b9b4a8", borderRadius: 8, padding: "26px 34px", color: "#8a8a90", fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", fontSize: 12, textAlign: "center" }}>
              Catalog · 5,214 SKUs · fixed pricing
            </div>
          </div>
          <div className="reveal">
            <div style={{ display: "inline-grid", placeItems: "center", width: 48, height: 48, background: TX.goldDark, color: "#fff", borderRadius: 10, fontWeight: 800, marginBottom: 16, fontSize: 17 }}>◈</div>
            <h3 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 12px" }}>Fixed-price catalog</h3>
            <p style={{ fontSize: 15, color: "#64609a", lineHeight: 1.7, maxWidth: "46ch" }}>Suppliers list price and quantity. No bidding — predictable, auditable procurement with hospitality-specific SKU taxonomy.</p>
          </div>
          <div className="reveal">
            <div style={{ display: "inline-grid", placeItems: "center", width: 48, height: 48, background: TX.goldDark, color: "#fff", borderRadius: 10, fontWeight: 800, marginBottom: 16 }}>FC</div>
            <h3 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 12px" }}>Embedded factoring liquidity</h3>
            <p style={{ fontSize: 15, color: "#64609a", lineHeight: 1.7, maxWidth: "46ch" }}>Non-recourse advances against ETA-validated invoices. Suppliers get paid in 48h; the hub fee is settled first, always.</p>
          </div>
          <div className="reveal ct-shadow" style={{ minHeight: 220, borderRadius: 12, border: "1.5px solid "+TX.ink, display: "grid", placeItems: "center", background: "#fff" }}>
            <div style={{ border: "1.5px dashed #b9b4a8", borderRadius: 8, padding: "26px 34px", color: "#8a8a90", fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", fontSize: 12, textAlign: "center" }}>
              Factoring · 48h advance · non-recourse
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="how" style={{ background: "#FAFAF7", padding: "64px 28px", borderTop: "1px solid "+TX.border, borderBottom: "1px solid "+TX.border }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div className="reveal" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 40 }}>
            <h2 style={{ fontSize: "clamp(26px,3vw,38px)", fontWeight: 800, letterSpacing: "-.02em", margin: 0 }}>
              Simple, transparent <span style={{ color: TX.goldDark }}>pricing</span>
            </h2>
            <span style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#8a8a90", fontWeight: 700 }}>Fee decreases with volume</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 26 }}>
            {PLANS.map((p) => (
              <div key={p.name} className="reveal" style={{ position: "relative", border: "1.5px solid "+(p.pop ? TX.goldDark : TX.border), borderRadius: 14, padding: 28, background: "#fff", boxShadow: p.pop ? "0 0 0 1.5px "+TX.goldDark+", 8px 8px 0 rgba(168,135,74,.18)" : undefined }}>
                {p.pop && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: TX.goldDark, color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 99, whiteSpace: "nowrap" }}>Most popular</div>}
                <h4 style={{ fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase", color: "#8a8a90", fontWeight: 800, margin: 0 }}>{p.name}</h4>
                <div style={{ fontSize: 40, fontWeight: 800, margin: "14px 0 4px", fontFamily: "'JetBrains Mono',monospace" }}>
                  {p.price}<small style={{ fontSize: 14, color: "#8a8a90", fontWeight: 600 }}> {p.unit}</small>
                </div>
                <ul style={{ listStyle: "none", margin: "18px 0 24px", padding: 0 }}>
                  {p.feats.map((f) => (
                    <li key={f} style={{ fontSize: 13.5, color: "#64609a", padding: "7px 0 7px 24px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, color: TX.goldDark, fontWeight: 800 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={"ct-btn"+(p.pop ? " ct-btn-gold" : "")} style={{ width: "100%", textAlign: "center", display: "block" }}>
                  {p.name === "Enterprise" ? "Contact sales" : "Get started"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "64px 28px", background: "#FFFFFF" }}>
        <div className="reveal" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 40 }}>
          <h2 style={{ fontSize: "clamp(26px,3vw,38px)", fontWeight: 800, letterSpacing: "-.02em", margin: 0 }}>
            Trusted by <span style={{ color: TX.goldDark }}>hotel leaders</span>
          </h2>
          <span style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#8a8a90", fontWeight: 700 }}>Closed beta · 2026</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
          {QUOTES.map((x, i) => (
            <div key={i} className="reveal" style={{ border: "1.5px solid "+TX.border, borderRadius: 12, padding: 24, background: "#fff" }}>
              <div style={{ fontSize: 44, lineHeight: 1, color: TX.goldDark, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>"</div>
              <p style={{ fontSize: 14, color: "#64609a", lineHeight: 1.7, margin: "12px 0 18px", fontStyle: "italic" }}>{x.q}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 99, background: TX.beige, border: "1.5px solid "+TX.ink, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 13 }}>
                  {x.who.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{x.who}</div>
                  <div style={{ fontSize: 11.5, color: "#8a8a90" }}>{x.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "0 28px 64px", background: "#FFFFFF" }}>
        <div className="reveal" style={{ background: TX.ink, color: "#fff", borderRadius: 16, padding: "60px 28px", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(26px,3vw,40px)", fontWeight: 800, margin: 0 }}>Ready to cut procurement cost?</h2>
          <p style={{ color: "rgba(255,255,255,.7)", marginTop: 10, fontSize: 15 }}>Join the closed beta — 5 hotel groups already on board.</p>
          <Link href="/register" style={{ display: "inline-block", marginTop: 26, background: TX.goldDark, color: "#fff", padding: "15px 32px", borderRadius: 8, fontWeight: 700, fontSize: 14 }}>
            Start free trial
          </Link>
        </div>
      </section>
    </div>
  );
}
