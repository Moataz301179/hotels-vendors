import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center px-4 md:px-8 pt-24 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />
      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
          <span className="inline-block px-4 py-1.5 text-xs font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20 rounded-full mb-6 tracking-widest uppercase">
            The Amazon of Egyptian Hospitality
          </span>
          <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight mb-6">
            Procurement, Powered.
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
            Sourcing • ETA-compliant invoicing • Embedded factoring • Multi-property governance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/demo" className="px-8 py-4 bg-orange-500 text-black font-bold text-sm tracking-wider uppercase rounded hover:bg-orange-400 transition-colors">Request Demo</Link>
            <Link href="/solutions" className="px-8 py-4 border border-white/20 text-white font-bold text-sm tracking-wider uppercase rounded hover:border-orange-500 hover:bg-white/5 transition-colors">Explore Solutions</Link>
          </div>
        </div>
        <div className="hidden lg:flex justify-center">
          <iframe
            src="/arena-sandbox.html"
            title="HOVIN App Sandbox"
            style={{ width: 409, height: 874, maxWidth: '100%', border: 'none', borderRadius: 54, boxShadow: '0 50px 120px rgba(0,0,0,0.85)', background: '#0A0A0A' }}
          />
        </div>
      </div>
    </section>
  );
}
