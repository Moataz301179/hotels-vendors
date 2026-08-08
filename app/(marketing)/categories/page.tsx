"use client";

/* /categories — Category Hubs
   Fresh rebuild: dense catalog category grid with real product data. */

import Link from "next/link";

const CATEGORIES = [
  { name: "Premium Linens", skus: "2,340 SKUs", suppliers: 86, min: "From EGP 450/unit · MOQ 50", note: "400TC Egyptian cotton, 100% combed", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=300&fit=crop" },
  { name: "Bathroom Amenities", skus: "1,180 SKUs", suppliers: 54, min: "From EGP 35/set · MOQ 200", note: "Dispensing systems, travel-size bottles", img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop" },
  { name: "Commercial Kitchen", skus: "3,850 SKUs", suppliers: 122, min: "From EGP 2,100 · MOQ 2", note: "Ovens, cold rooms, gastronorm", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop" },
  { name: "Cleaning & Chemicals", skus: "1,960 SKUs", suppliers: 68, min: "From EGP 80/L · MOQ 20L", note: "Hotel-grade disinfectants, detergents", img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop" },
  { name: "Guest Room Furniture", skus: "1,540 SKUs", suppliers: 47, min: "From EGP 3,500 · MOQ 5", note: "Beds, desks, armchairs, casegoods", img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop" },
  { name: "HVAC & Engineering", skus: "2,710 SKUs", suppliers: 93, min: "From EGP 15,000 · MOQ 1", note: "Chillers, AHUs, VRF, spare parts", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop" },
  { name: "Hotel Bedding", skus: "980 SKUs", suppliers: 41, min: "From EGP 1,200 · MOQ 30", note: "Duvets, pillows, mattress protectors", img: "https://images.unsplash.com/photo-1559599189-fe84dea4eb79?w=400&h=300&fit=crop" },
  { name: "Pool & Spa Supplies", skus: "1,120 SKUs", suppliers: 36, min: "From EGP 550 · MOQ 10", note: "Towels, chemicals, loungers, reeds", img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop" },
];

export default function CategoriesPage() {
  return (
    <main className="bg-slate-50 min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
        <header className="mb-8">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-blue-600">Category Hubs</div>
          <h1 className="text-3xl font-bold text-slate-900 mt-1">Every Category Your Hotel Needs</h1>
          <p className="text-slate-600 text-sm mt-2 max-w-2xl">
            Dense, live SKU catalogs across 8 core hospitality categories. Each hub links to verified suppliers, unit pricing, MOQs, and instant RFQ.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((c) => (
            <div key={c.name} className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 transition-colors">
              <div className="h-36 bg-slate-100 overflow-hidden">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">{c.name}</h3>
                  <span className="text-[10px] text-slate-400">{c.skus}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1.5">{c.note}</div>
                <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
                  <span>{c.suppliers} suppliers</span>
                  <span>{c.min}</span>
                </div>
                <Link href="/rfq" className="mt-3 w-full block text-center text-xs py-2 rounded border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                  Request RFQ Quote
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
