"use client";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

export function CategoryFilter({ categories }: { categories: Category[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button className="rounded-full bg-[#a3e635] px-5 py-2 text-[12px] font-semibold text-white transition-all hover:bg-[#bef264] hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]">
        All ({categories.reduce((sum, c) => sum + c._count.products, 0)})
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className="rounded-full border border-white/[0.04] bg-[#0a0a0a] px-5 py-2 text-[12px] text-white/30 transition-all duration-500 hover:border-[#a3e635]/20 hover:text-white/70"
        >
          {cat.name} ({cat._count.products})
        </button>
      ))}
    </div>
  );
}
