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
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Ambient background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8B0000]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#8B0000]/3 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />
        </div>

        <div className="relative z-10 w-full max-w-xl mx-6 py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
