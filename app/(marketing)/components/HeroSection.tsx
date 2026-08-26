import { MarketplaceSandbox } from '@/components/hero/MarketplaceSandbox';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 md:px-8 pt-20 pb-16">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" />
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-4 py-1.5 text-xs font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20 rounded-full mb-6 tracking-widest uppercase">
            The Amazon of Egyptian Hospitality
          </span>
          <h1 className="font-bold text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05] tracking-tight mb-6">
            Procurement,<br />
            <span className="text-orange-500">Powered.</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto mb-10 font-normal leading-relaxed">
            Fixed-price marketplace • ETA-compliant invoicing • Embedded factoring • Multi-property governance
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/marketplace" className="px-8 py-4 bg-orange-500 text-black font-bold text-sm tracking-wider uppercase rounded hover:bg-orange-400 transition-colors">
              Explore Marketplace
            </Link>
            <Link href="/demo" className="px-8 py-4 border border-white/20 text-white font-bold text-sm tracking-wider uppercase rounded hover:border-orange-500 hover:bg-white/5 transition-colors">
              Request Demo
            </Link>
          </div>
        </div>
        <div className="relative">
          <MarketplaceSandbox />
        </div>
      </div>
    </section>
  );
}
