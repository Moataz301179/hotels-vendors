"use client";

import Link from "next/link";

export default function ETAPage() {
  return (
    <main className="bg-slate-50 min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
        <header className="mb-10 max-w-3xl">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[#8a6d3b]">Regulatory</div>
          <h1 className="text-3xl font-bold text-[#111827] mt-1">ETA Compliance Sentinel</h1>
          <p className="text-slate-600 text-sm mt-2">Automatic Egyptian Tax Authority e-invoicing validation. Every fulfilled order is formatted, verified, and submitted as an official ETA payload with a scannable e-Waybill QR code.</p>
        </header>
<div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="text-[11px] text-slate-500 uppercase bg-slate-50">
              <th className="text-left px-4 py-2">Document</th><th className="text-left px-4 py-2">Type</th><th className="text-right px-4 py-2">Status</th>
            </tr></thead>
            <tbody>
              <tr>
                <td colSpan={3} className="px-4 py-12 text-center">
                  <p className="text-sm text-slate-500">No ETA documents yet — clears when invoices are submitted.</p>
                  <p className="text-xs text-slate-400 mt-1">Submitted invoices will appear here with their ETA verification status.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-10">
          <Link href="/register" className="inline-flex items-center px-5 py-2.5 bg-[#314B43] text-white text-sm font-semibold rounded-md hover:bg-[#3a544a]">Get started free</Link>
        </div>
      </div>
    </main>
  );
}
