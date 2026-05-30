export function MarketingFooter() {
  return (
    <footer className="bg-black border-t border-purple-900/30">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="text-lg font-bold text-white mb-2">Hotels Vendors</div>
            <p className="text-sm text-zinc-400">Egypts integrated procurement OS for hospitality.</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-purple-400 uppercase mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/solutions" className="text-zinc-400 hover:text-purple-400">Solutions</a></li>
              <li><a href="/pricing" className="text-zinc-400 hover:text-purple-400">Pricing</a></li>
              <li><a href="/marketplace" className="text-zinc-400 hover:text-purple-400">Marketplace</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-purple-400 uppercase mb-4">Stakeholders</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/hotels" className="text-zinc-400 hover:text-purple-400">Hotels</a></li>
              <li><a href="/suppliers" className="text-zinc-400 hover:text-purple-400">Suppliers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-purple-400 uppercase mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="text-zinc-400 hover:text-purple-400">About</a></li>
              <li><a href="/register" className="text-zinc-400 hover:text-purple-400">Get Started</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-purple-900/20 text-center text-xs text-zinc-500">
          © 2026 Hotels Vendors. Cairo, Egypt.
        </div>
      </div>
    </footer>
  );
}
