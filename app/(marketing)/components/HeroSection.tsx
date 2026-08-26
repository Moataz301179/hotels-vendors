import Link from 'next/link';

export function HeroSection() {
  return (
    <section
      className="relative min-h-[92vh] flex items-center justify-center px-4 md:px-8 pt-28 pb-20 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-canvas)', color: 'var(--text-primary)' }}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,61,0,0.05) 0%, transparent 70%)' }}
      />
      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
          <span
            className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-6"
            style={{ color: 'var(--accent-base)', backgroundColor: 'var(--accent-muted)', border: '1px solid var(--border-accent)' }}
          >
            End stockouts. Unlock cashflow. One platform.
          </span>
          <h1 className="font-semibold text-[clamp(36px,6vw,68px)] leading-[1.04] tracking-[-0.03em] mb-6 text-white">
            Your inventory gap and your cashflow gap.
            <br />
            Closed by one system.
          </h1>
          <p className="text-lg max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Hotels: end stockouts with AI forecasting · Suppliers: fixed prices, paid in 48 hours — ETA-compliant on every order.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/marketplace" className="btn-accent">Try the sandbox</Link>
            <a href="#sandbox" className="btn-outline">How it works</a>
          </div>
        </div>
        <div id="sandbox" className="hidden lg:flex justify-center scroll-mt-24">
          <iframe
            src="/arena-sandbox.html"
            title="HOVIN App Sandbox"
            style={{ width: 409, height: 874, maxWidth: '100%', border: 'none', borderRadius: 54, boxShadow: 'none', background: 'var(--bg-canvas)', outline: '1px solid var(--border-subtle)' }}
          />
        </div>
      </div>
    </section>
  );
}
