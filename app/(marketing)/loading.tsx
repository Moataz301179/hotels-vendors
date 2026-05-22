export default function MarketingLoading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
        <p className="text-white/50 text-sm">Loading Hotels Vendors...</p>
      </div>
    </div>
  );
}
