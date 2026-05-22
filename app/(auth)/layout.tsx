import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { AuthLeftPanel } from "@/components/auth/auth-left-panel";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#121212] flex">
      {/* Left Panel — Brand, social proof, value props (desktop only) */}
      <AuthLeftPanel />

      {/* Right Panel — Auth forms */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Ambient background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#8b5cf6]/3 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />
        </div>

        {/* Top Nav — Back to home */}
        <div className="relative z-20 flex items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-[14px] text-white/30 hover:text-white/70 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[14px] text-white/30 hover:text-white/70 transition-colors"
          >
            <Home size={16} />
            Hotels Vendors
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="w-full max-w-xl mx-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
