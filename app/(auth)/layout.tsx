export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#DC143C]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#DC143C]/3 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
