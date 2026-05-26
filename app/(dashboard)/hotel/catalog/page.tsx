"use client";

import { useState } from "react";
import { Package, Box, Settings, Cpu, ShieldCheck, Database, CheckCircle2, ChevronRight, Filter } from "lucide-react";

// Mock B2B Trading Matrix Data strictly adhering to hospitality procurement categories
const PROCUREMENT_CATEGORIES = [
  { id: "fb", label: "Food & Beverage (F&B)", icon: Package },
  { id: "linens", label: "Guest Linens & Amenities", icon: Box },
  { id: "ffe", label: "FF&E Assets", icon: ShieldCheck },
  { id: "ose", label: "OS&E Utilities", icon: Database },
  { id: "mro", label: "MRO Engineering", icon: Settings },
  { id: "ops", label: "Operating Services", icon: ShieldCheck },
  { id: "it", label: "IT Infrastructure", icon: Cpu },
];

const MOCK_MATRIX_DATA = [
  {
    id: "SKU-FB-1001",
    category: "Food & Beverage (F&B)",
    product: "Premium Arabica Coffee Beans (Bulk)",
    supplier: "Global Roasters SME",
    moq: "50 kg",
    unitBreakdown: "5kg / vacuum bag",
    pricePerUnit: "EGP 4,200",
    factoringEligible: true,
  },
  {
    id: "SKU-LIN-204",
    category: "Guest Linens & Amenities",
    product: "Luxury Bath Towels - 800 GSM",
    supplier: "Nile Weavers Inc.",
    moq: "200 units",
    unitBreakdown: "24 units / carton",
    pricePerUnit: "EGP 180",
    factoringEligible: true,
  },
  {
    id: "SKU-IT-992",
    category: "IT Infrastructure",
    product: "Enterprise Wi-Fi 6 Access Points",
    supplier: "TechNet Hospitality Solutions",
    moq: "10 units",
    unitBreakdown: "Single Unit Box",
    pricePerUnit: "EGP 12,500",
    factoringEligible: false,
  },
  {
    id: "SKU-MRO-441",
    category: "MRO Engineering",
    product: "HVAC Filter Replacements (MERV 13)",
    supplier: "Delta Engineering Supplies",
    moq: "100 units",
    unitBreakdown: "10 units / pack",
    pricePerUnit: "EGP 850",
    factoringEligible: true,
  }
];

export default function CatalogWorkspace() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="bg-[#000000] text-[#f0f0f0] p-6 font-sans min-h-screen">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex items-end justify-between border-b border-white/[0.08] pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Procurement Catalog Matrix</h1>
            <p className="text-xs text-[#a0a0a0] max-w-2xl">
              High-density procurement gateway. All assets enforce strict minimum order quantities (MOQs) and integrate seamlessly with our Tier-1 Factoring liquidity pools.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-white/[0.08] bg-[#0a0a0a] rounded text-xs text-[#a0a0a0] flex items-center gap-2 hover:text-white transition-colors">
              <Filter size={14} /> Filter Parameters
            </button>
            <button className="px-4 py-2 bg-[#bef264] text-white rounded text-xs font-semibold hover:bg-[#bef264] transition-colors border border-transparent">
              Initialize Bulk PO
            </button>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="flex gap-6 items-start">
          
          {/* Categorization Sidebar */}
          <aside className="w-64 shrink-0 flex flex-col gap-1">
            <h2 className="text-[10px] font-bold text-[#505050] uppercase tracking-wider mb-2 px-2">Asset Categories</h2>
            {PROCUREMENT_CATEGORIES.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.label)}
                className={`flex items-center justify-between px-3 py-2.5 rounded text-xs transition-all ${
                  activeCategory === cat.label 
                  ? "bg-white/[0.06] text-white border border-white/[0.12]" 
                  : "text-[#a0a0a0] border border-transparent hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <cat.icon size={14} className={activeCategory === cat.label ? "text-[#e1a95f]" : "text-[#505050]"} />
                  <span className="font-medium">{cat.label}</span>
                </div>
                <ChevronRight size={14} className={activeCategory === cat.label ? "text-white" : "opacity-0"} />
              </button>
            ))}
          </aside>

          {/* Core Trading Matrix */}
          <main className="flex-1 border border-white/[0.08] rounded bg-[#0a0a0a] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#101010] border-b border-white/[0.08]">
                  <th className="py-3 px-4 text-[10px] uppercase tracking-wider text-[#707070] font-semibold w-24">Asset ID</th>
                  <th className="py-3 px-4 text-[10px] uppercase tracking-wider text-[#707070] font-semibold">Product Description</th>
                  <th className="py-3 px-4 text-[10px] uppercase tracking-wider text-[#707070] font-semibold w-40">Verified Vendor</th>
                  <th className="py-3 px-4 text-[10px] uppercase tracking-wider text-[#707070] font-semibold text-right w-24">MOQ</th>
                  <th className="py-3 px-4 text-[10px] uppercase tracking-wider text-[#707070] font-semibold text-right w-32">Unit Yield</th>
                  <th className="py-3 px-4 text-[10px] uppercase tracking-wider text-[#707070] font-semibold text-center w-32">Liquidity Class</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_MATRIX_DATA.filter(item => activeCategory === "All" || item.category === activeCategory).map((row, idx) => (
                  <tr key={idx} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
                    <td className="py-3 px-4 text-xs font-mono text-[#a0a0a0]">{row.id}</td>
                    <td className="py-3 px-4">
                      <div className="text-xs font-semibold text-[#f0f0f0] group-hover:text-white transition-colors">{row.product}</div>
                      <div className="text-[10px] text-[#505050] mt-0.5">{row.category} — {row.unitBreakdown}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-[#a0a0a0]">{row.supplier}</td>
                    <td className="py-3 px-4 text-xs font-medium text-right text-white">{row.moq}</td>
                    <td className="py-3 px-4 text-xs font-medium text-right text-[#e1a95f]">{row.pricePerUnit}</td>
                    <td className="py-3 px-4 text-center">
                      {row.factoringEligible ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#a3e635] border border-[#bef264] text-[9px] font-bold uppercase tracking-wider text-[#55b3ff]">
                          <CheckCircle2 size={10} className="text-[#55b3ff]" /> Factoring Eligible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.02] border border-white/[0.06] text-[9px] font-bold uppercase tracking-wider text-[#707070]">
                          Standard Terms
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {MOCK_MATRIX_DATA.filter(item => activeCategory === "All" || item.category === activeCategory).length === 0 && (
              <div className="py-12 text-center text-[#707070] text-xs">
                No indexed assets currently align with this procurement sector.
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
