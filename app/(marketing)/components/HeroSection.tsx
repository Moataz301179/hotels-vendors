import Link from "next/link";

export function HeroSection() {
  return (
    <section
      className="relative min-h-[92vh] flex items-center justify-center px-4 md:px-8 pt-28 pb-20 overflow-hidden"
      style={{ backgroundColor: "#F8FAFC", color: "#0F172A" }}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)" }}
      />
      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs font-medium tracking-[0.22em] uppercase mb-6 text-[#0D9488]">
            Hospitality procurement intelligence
          </p>
          <h1 className="font-semibold text-[clamp(38px,6vw,70px)] leading-[1.02] tracking-[-0.04em] mb-6">
            Your Virtual Shadow for smarter procurement.
          </h1>
          <p className="text-lg max-w-xl mb-10 leading-relaxed text-[#64748B]">
            HotelsVendors watches the hospitality network for money leaks,
            savings opportunities, supplier demand and external funding signals.
            It turns evidence into opportunities, actions and recorded outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/sign-in" className="btn-accent">Enter HotelsVendors</Link>
            <Link href="/platform" className="inline-flex items-center justify-center rounded-xl border border-[#CBD5E1] bg-white px-6 py-3 text-sm font-semibold text-[#0F172A] transition-colors hover:bg-[#F1F5F9]">See the intelligence loop</Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-3 text-xs text-[#64748B]">
            <span className="rounded-full border border-[#E2E8F0] px-3 py-2">Signal</span>
            <span className="rounded-full border border-[#E2E8F0] px-3 py-2">Detect</span>
            <span className="rounded-full border border-[#E2E8F0] px-3 py-2">Explain</span>
            <span className="rounded-full border border-[#E2E8F0] px-3 py-2">Opportunity</span>
            <span className="rounded-full border border-[#E2E8F0] px-3 py-2">Action</span>
            <span className="rounded-full border border-[#E2E8F0] px-3 py-2">Outcome</span>
          </div>
        </div>
        <div className="hidden lg:flex justify-center">
          <div className="relative w-[430px] aspect-square rounded-full border border-[#E2E8F0] bg-white p-10">
            <div className="absolute inset-10 rounded-full border border-[#0D9488]/30 virtual-shadow-orbit" />
            <div className="absolute inset-20 rounded-full border border-[#E2E8F0]" />
            <span className="absolute left-1/2 top-8 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#2563EB] shadow-[0_0_0_6px_rgba(37,99,235,0.10)]" />
            <span className="absolute right-8 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[#0D9488] shadow-[0_0_0_6px_rgba(13,148,136,0.10)]" />
            <span className="absolute bottom-8 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#2563EB] shadow-[0_0_0_6px_rgba(37,99,235,0.10)]" />
            <span className="absolute left-8 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[#0D9488] shadow-[0_0_0_6px_rgba(13,148,136,0.10)]" />
            <div className="relative h-full flex flex-col items-center justify-center text-center">
              <span className="text-xs uppercase tracking-[0.22em] text-[#64748B]">Virtual Shadow</span>
              <strong className="mt-3 text-2xl text-[#0F172A]">Watch → Find → Act</strong>
              <span className="mt-3 max-w-[210px] text-sm leading-6 text-[#64748B]">
                One intelligence layer across hotels, suppliers, carriers and funders.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
