'use client';

import { useEffect, useState } from 'react';

const views = [
  { key: 'hotel', label: 'Hotel Buyer', title: 'Procurement Portal', rows: [['F&B Order', 'EGP 42,300', 'Approved'], ['Linen Supply', 'EGP 18,900', 'In Transit'], ['Amenities Restock', 'EGP 7,450', 'Pending']] },
  { key: 'supplier', label: 'Supplier Central', title: 'Inventory & Orders', rows: [['Open Orders', '14', 'Live'], ['Catalog SKUs', '312', 'Synced'], ['Payouts', 'EGP 96,200', '48h']] },
  { key: 'funder', label: 'Funder Dashboard', title: 'Liquidity & Credit', rows: [['Portfolio Yield', '14.2%', 'Healthy'], ['Credit Lines', 'EGP 2.4M', 'Active'], ['Factored Invoices', '38', 'Settled']] },
];

export function HeroSection() {
  const [tab, setTab] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTab((p) => (p + 1) % 3), 4000);
    return () => clearInterval(t);
  }, []);
  const v = views[tab];
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 md:px-8 pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block px-4 py-1.5 text-xs font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20 rounded-full mb-6 tracking-widest uppercase">
            The Amazon of Egyptian Hospitality
          </span>
          <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight mb-6">
            Procurement, Powered.
          </h1>
          <p className="text-white/70 text-lg max-w-xl mb-10 leading-relaxed">
            Fixed-price marketplace • ETA-compliant invoicing • Embedded factoring • Multi-property governance
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/marketplace" className="px-8 py-4 bg-orange-500 text-black font-bold text-sm tracking-wider uppercase rounded hover:bg-orange-400 transition-colors">Explore Marketplace</a>
            <a href="/demo" className="px-8 py-4 border border-white/20 text-white font-bold text-sm tracking-wider uppercase rounded hover:border-orange-500 hover:bg-white/5 transition-colors">Request Demo</a>
          </div>
        </div>
        <div className="hidden lg:flex justify-center">
          <div style={{ width: 375, height: 700, borderRadius: 54, padding: 11, background: '#0A0A0A', border: '1px solid #262626', boxShadow: '0 50px 120px rgba(0,0,0,0.8)' }}>
            <div style={{ borderRadius: 44, background: '#0F0F0F', border: '1px solid #262626', height: '100%', padding: '24px 18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="flex gap-2">
                {views.map((t, i) => (
                  <button key={t.key} onClick={() => setTab(i)}
                    className={"px-3 py-1.5 rounded-full text-xs font-bold tracking-wide transition-colors " + (i === tab ? "bg-orange-500 text-black" : "bg-white/5 text-white/60")}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="text-white font-bold text-xl">{v.title}</div>
              <div className="flex flex-col gap-3">
                {v.rows.map((r) => (
                  <div key={r[0]} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-white/90 text-sm font-semibold">{r[0]}</div>
                    <div className="text-white font-bold text-lg mt-1">{r[1]}</div>
                    <div className="text-orange-500 text-xs mt-1 uppercase tracking-wider">{r[2]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
