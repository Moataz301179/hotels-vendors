"use client";

import Link from "next/link";

export default function AIPage() {
  return (
    <main className="bg-slate-50 min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
        <header className="mb-10 max-w-3xl">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-blue-600">Productivity</div>
          <h1 className="text-3xl font-bold text-slate-900 mt-1">AI Catalog Ingestion</h1>
          <p className="text-slate-600 text-sm mt-2">Import supplier price sheets (PDF / Excel / CSV) and let the ingestion engine parse, normalize, and LLM-map every row to the canonical marketplace taxonomy before it goes live.</p>
        </header>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { t: "Upload", d: "Drop supplier price lists in PDF, XLSX, or CSV. No manual row entry." },
            { t: "LLM Enrich", d: "Auto-generates SKUs, maps categories, extracts unit sizes, rewrites titles in EN/AR." },
            { t: "Publish", d: "Enriched, ETA-compliant products appear live on INVO Marketplace." },
          ].map((s, i) => (
            <div key={s.t} className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-slate-200 mb-1">0{i+1}</div>
              <div className="text-sm font-semibold text-slate-900 mb-1">{s.t}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link href="/register" className="inline-flex items-center px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-md hover:bg-slate-800">Get started free</Link>
        </div>
      </div>
    </main>
  );
}
