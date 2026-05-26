"use client";

import { useState } from "react";
import { Search, ShieldCheck, CheckCircle2, Building, PackageSearch } from "lucide-react";

export default function MarketplaceFront() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#f0f0f0] font-sans flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/[0.08] bg-[#0a0a0a]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#bef264] flex items-center justify-center font-bold text-white tracking-tighter">HV</div>
          <span className="text-lg font-black tracking-tight text-white">HotelsVendors</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <a href="#" className="text-white">Procurement Matrix</a>
          <a href="#" className="text-[#a0a0a0] hover:text-white transition-colors">Supplier Intel</a>
          <a href="#" className="text-[#a0a0a0] hover:text-white transition-colors">Institutional Factoring</a>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm text-[#a0a0a0] hover:text-white transition-colors">Hotel Login</button>
          <button className="px-5 py-2 text-sm font-bold bg-white text-black rounded hover:bg-[#e1a95f] hover:text-black transition-colors">Open Hotel Account</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        {/* Abstract Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#bef264]/20 blur-[120px] rounded-full pointer-events-none" />

        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white max-w-4xl leading-tight mb-6 relative z-10">
          The Financial Operating System for <span className="text-[#e1a95f]">Egyptian Hospitality</span>.
        </h1>
        
        <p className="text-lg text-[#a0a0a0] max-w-2xl mb-10 relative z-10">
          Zero friction procurement. Access wholesale factories, strictly governed logistics, and embedded multi-rail credit facilities in one uncompromising matrix.
        </p>

        {/* Global Search Matrix */}
        <div className="w-full max-w-3xl bg-[#101010] p-2 rounded-lg border border-white/[0.1] flex items-center relative z-10 shadow-2xl">
          <Search className="text-[#505050] ml-3" />
          <input 
            type="text" 
            placeholder="Search SKUs, Factories, or Asset Categories (e.g., 'Luxury Bath Towels 800 GSM')"
            className="flex-1 bg-transparent border-none text-white px-4 py-3 text-sm focus:outline-none focus:ring-0 placeholder-[#505050]"
          />
          <button className="bg-[#bef264] text-white px-6 py-3 rounded text-sm font-bold hover:bg-[#a00000] transition-colors">
            Query Matrix
          </button>
        </div>

        {/* Enterprise Trust Badges (CPA & ETA) */}
        <div className="mt-20 flex flex-wrap justify-center gap-8 relative z-10">
          
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#a3e635]/40 border border-[#bef264]/50">
            <ShieldCheck size={28} className="text-[#55b3ff]" />
            <div className="text-left">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                CPA Compliant <CheckCircle2 size={10} className="text-green-400" />
              </div>
              <div className="text-[9px] text-[#a0a0a0] uppercase tracking-wider">Law No. 181 of 2018 (حماية المستهلك)</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#2e1d0f]/40 border border-[#e1a95f]/30">
            <Building size={28} className="text-[#e1a95f]" />
            <div className="text-left">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                ETA Integrated <CheckCircle2 size={10} className="text-green-400" />
              </div>
              <div className="text-[9px] text-[#a0a0a0] uppercase tracking-wider">E-Invoicing Bridge (مصلحة الضرائب)</div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer (Supplier Backdoor) */}
      <footer className="border-t border-white/[0.08] bg-[#000000] py-8 px-8 flex justify-between items-center text-xs">
        <div className="text-[#505050]">© 2026 HotelsVendors. Institutional Grade B2B.</div>
        <div className="flex gap-6">
          <a href="#" className="text-[#a0a0a0] hover:text-[#e1a95f] transition-colors font-semibold flex items-center gap-2">
            <PackageSearch size={14} /> Supplier SaaS Login
          </a>
          <a href="#" className="text-[#707070] hover:text-white transition-colors">API Documentation</a>
          <a href="#" className="text-[#707070] hover:text-white transition-colors">Institutional Factoring</a>
        </div>
      </footer>
    </div>
  );
}
