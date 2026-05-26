import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/marketplace/product-card";
import { SearchBar } from "@/components/marketplace/search-bar";
import { CategoryFilter } from "@/components/marketplace/category-filter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Marketplace — Hotels Vendors",
  description: "B2B procurement marketplace for Egyptian hospitality sector",
};

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      include: {
        Supplier: { select: { companyName: true, logo: true } },
        category: { select: { name: true } },
      },
      take: 24,
      orderBy: { createdAt: "desc" },
    });
    return products;
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    return prisma.category.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true, slug: true, _count: { select: { products: true } } },
    });
  } catch {
    return [];
  }
}

export default async function MarketplacePage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <div className="min-h-screen bg-[#000000]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.04] py-16 lg:py-24">
        <div className="absolute inset-0">
          <div className="absolute top-[-30%] right-[-10%] w-[70%] h-[80%] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, rgba(163,230,53,0.4) 0%, transparent 70%)", filter: "blur(120px)" }} />
        </div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border border-[#a3e635]/20 bg-[#a3e635]/[0.06]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635] animate-pulse" />
              <span className="text-[11px] font-medium text-[#a3e635] tracking-wide">Verified Suppliers</span>
            </div>
            <h1 className="text-[36px] md:text-[44px] font-semibold text-white tracking-[-0.03em] leading-[1.1]">
              B2B Hospitality Marketplace
            </h1>
            <p className="mx-auto mt-4 max-w-[480px] text-[15px] text-white/30 leading-relaxed">
              Discover verified suppliers for hotels. AI-powered procurement with 20%+ cost reduction.
            </p>
            <div className="mt-8 flex justify-center">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-white/[0.04] py-6">
        <div className="max-w-[1280px] mx-auto px-8">
          <CategoryFilter categories={categories} />
        </div>
      </section>

      {/* Products */}
      <section className="py-12">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-[20px] font-semibold text-white">Featured Products</h2>
            <span className="text-[12px] text-white/20">{products.length} results</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
