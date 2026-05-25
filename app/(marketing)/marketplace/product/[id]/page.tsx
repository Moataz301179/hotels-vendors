import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      Supplier: true,
      category: true,
      specifications: true,
    },
  });
  return product;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} — Hotels Vendors`,
    description: product.description || "",
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <div className="min-h-screen bg-[#0B0F1A] py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-xl border border-white/10 bg-slate-800">
              {product.images && product.images[0] ? (
                <Image src={product.images[0]} alt={product.name} width={600} height={600} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500">No Image</div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <span className="text-sm font-medium text-blue-400">{product.category.name}</span>
              <h1 className="mt-2 text-3xl font-bold text-white">{product.name}</h1>
              <p className="mt-4 text-slate-400">{product.description}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">${product.unitPrice}</span>
                <span className="text-slate-400">/ unit</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-500">MOQ</span>
                  <p className="text-white">{product.moq} units</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Lead Time</span>
                  <p className="text-white">{product.leadTimeDays || "TBD"} days</p>
                </div>
              </div>
            </div>

            {/* Supplier */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white">Supplier</h3>
              <p className="mt-2 text-white">{product.Supplier.companyName}</p>
              <p className="text-sm text-slate-400">{product.Supplier.city}, {product.Supplier.country}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button className="flex-1 rounded-lg bg-blue-500 py-3 font-semibold text-white transition-colors hover:bg-blue-600">
                Request Quote (RFQ)
              </button>
              <button className="flex-1 rounded-lg border border-white/10 bg-white/5 py-3 font-semibold text-white transition-colors hover:bg-white/10">
                Contact Supplier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
