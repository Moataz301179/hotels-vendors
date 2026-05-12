export default function MarketplaceLoading() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#050505]/90 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <div className="w-32 h-8 bg-white/[0.04] rounded-lg animate-pulse" />
          <div className="flex-1 max-w-2xl h-10 bg-white/[0.04] rounded-xl animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="w-20 h-8 bg-white/[0.04] rounded-lg animate-pulse" />
            <div className="w-20 h-8 bg-white/[0.04] rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        {/* Banner */}
        <div className="w-full h-[180px] md:h-[200px] rounded-xl bg-white/[0.04] animate-pulse mb-6" />

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block w-56 shrink-0 space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-10 bg-white/[0.04] rounded-xl animate-pulse" />
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                  <div className="aspect-[4/3] bg-white/[0.04] animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 w-16 bg-white/[0.04] rounded animate-pulse" />
                    <div className="h-4 w-full bg-white/[0.04] rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-white/[0.04] rounded animate-pulse" />
                    <div className="h-6 w-24 bg-white/[0.04] rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
