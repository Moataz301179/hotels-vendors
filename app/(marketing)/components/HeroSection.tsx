import Link from "next/link";

export function HeroSection() {
  return (
    <section
      className="relative min-h-[92vh] flex items-center justify-center px-4 md:px-8 pt-28 pb-20 overflow-hidden"
      style={{ backgroundColor: "#080B10", color: "#F4F7FA" }}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(54,214,181,0.08) 0%, transparent 70%)" }}
      />
      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs font-medium tracking-[0.22em] uppercase mb-6 text-[#36D6B5]">
            Hospitality procurement intelligence
          </p>
          <h1 className="font-semibold text-[clamp(38px,6vw,70px)] leading-[1.02] tracking-[-0.04em] mb-6">
            Your Virtual Shadow for smarter procurement.
          </h1>
          <p className="text-lg max-w-xl mb-10 leading-relaxed text-[#8E9AAA]">
            HotelsVendors watches the hospitality network for money leaks,
            savings opportunities, supplier demand and external funding signals.
            It turns evidence into opportunities, actions and recorded outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/sign-in" className="btn-accent">Enter HotelsVendors</Link>
            <Link href="/platform" className="btn-outline">See the intelligence loop</Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-3 text-xs text-[#8E9AAA]">
            <span className="rounded-full border border-[#202936] px-3 py-2">Signal</span>
            <span className="rounded-full border border-[#202936] px-3 py-2">Detect</span>
            <span className="rounded-full border border-[#202936] px-3 py-2">Explain</span>
            <span className="rounded-full border border-[#202936] px-3 py-2">Opportunity</span>
            <span className="rounded-full border border-[#202936] px-3 py-2">Action</span>
            <span className="rounded-full border border-[#202936] px-3 py-2">Outcome</span>
          </div>
        </div>
        <div className="hidden lg:flex justify-center">
          <div className="relative w-[430px] aspect-square rounded-full border border-[#202936] bg-[#10151D] p-10">
            <div className="absolute inset-10 rounded-full border border-[#36D6B5]/30" />
            <div className="absolute inset-20 rounded-full border border-[#202936]" />
            <div className="relative h-full flex flex-col items-center justify-center text-center">
              <span className="text-xs uppercase tracking-[0.22em] text-[#8E9AAA]">Virtual Shadow</span>
              <strong className="mt-3 text-2xl text-[#F4F7FA]">Watch → Find → Act</strong>
              <span className="mt-3 max-w-[210px] text-sm leading-6 text-[#8E9AAA]">
                One intelligence layer across hotels, suppliers, carriers and funders.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
