"use client";

import Link from "next/link";

export default function ETAPage() {
  return (
    <main className="bg-slate-50 min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
        <header className="mb-10 max-w-3xl">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-blue-600">Regulatory</div>
          <h1 className="text-3xl font-bold text-slate-900 mt-1">ETA Compliance Sentinel</h1>
          <p className="text-slate-600 text-sm mt-2">Automatic Egyptian Tax Authority e-invoicing validation. Every fulfilled order is formatted, verified, and submitted as an official ETA payload with a scannable e-Waybill QR code.</p>
        </header>
<div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="text-[11px] text-slate-500 uppercase bg-slate-50">
              <th className="text-left px-4 py-2">Document</th><th className="text-left px-4 py-2">Type</th><th className="text-right px-4 py-2">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              <tr><td className="px-4 py-2.5 text-slate-900 font-medium">ETA e-Invoice #382-910-112</td><td className="px-4 py-2.5 text-slate-600">Tax Invoice v2</td><td className="px-4 py-2.5 text-right"><span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">Verified</span></td></tr>
              <tr><td className="px-4 py-2.5 text-slate-900 font-medium">e-Waybill EWB-88K2F9</td><td className="px-4 py-2.5 text-slate-600">Transport Waybill</td><td className="px-4 py-2.5 text-right"><span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">Generated + QR</span></td></tr>
              <tr><td className="px-4 py-2.5 text-slate-900 font-medium">FRA Registry Lock</td><td className="px-4 py-2.5 text-slate-600">Anti double-financing</td><td className="px-4 py-2.5 text-right"><span className="text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300">Active</span></td></tr>
            </tbody>
          </table>
        </div>
        <div className="mt-10">
          <Link href="/register" className="inline-flex items-center px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-md hover:bg-slate-800">Get started free</Link>
        </div>
      </div>
    </main>
  );
}
