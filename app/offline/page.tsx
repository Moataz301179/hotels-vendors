import Link from "next/link";
import { WifiOff, Home } from "lucide-react";
import { ReloadButton } from "@/components/offline/reload-button";

export const metadata = {
  title: "Offline | Hotels Vendors",
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#121212]">
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-6">
          <WifiOff size={36} className="text-white/40" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">
          You are offline
        </h1>
        <p className="text-sm text-white/50 mb-8 leading-relaxed">
          It looks like your internet connection is down. Some features may be
          unavailable until you reconnect.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <ReloadButton />

          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm font-medium hover:bg-white/[0.08] transition-colors"
          >
            <Home size={16} />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
