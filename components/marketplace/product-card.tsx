"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string | null;
    images: string[];
    unitPrice: number;
    moq: number;
    Supplier: { companyName: string; logo: string | null };
    category: { name: string };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/marketplace/product/${product.id}`}>
      <div className="group relative overflow-hidden rounded-2xl border border-white/[0.04] bg-[#0a0a12] transition-all duration-500 hover:border-[#7c3aed]/20">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7c3aed]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="aspect-square overflow-hidden bg-[#0a0a12]">
          {product.images && product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              width={400}
              height={400}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white/20 text-sm">
              No Image
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="text-[10px] font-bold tracking-[0.15em] text-[#a78bfa] uppercase">{product.category.name}</div>
          <h3 className="mt-2 text-[14px] font-semibold text-white line-clamp-2">{product.name}</h3>
          <p className="mt-1 text-[12px] text-white/30 leading-relaxed line-clamp-2">{product.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[16px] font-bold text-white tracking-tight">${product.unitPrice}</span>
            <span className="text-[10px] text-white/20 uppercase tracking-wider">MOQ: {product.moq}</span>
          </div>
          <div className="mt-2 text-[11px] text-white/20">{product.Supplier.companyName}</div>
        </div>
      </div>
    </Link>
  );
}
