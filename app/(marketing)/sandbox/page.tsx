import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sandbox | HotelsVendors",
  description: "Interactive demo of the HotelsVendors procurement platform",
};

export default function SandboxPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-canvas)] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-semibold text-white mb-8">Platform Sandbox</h1>
        <div className="flex justify-center">
          <iframe
            src="/arena-sandbox.html"
            title="HOVIN App Sandbox"
            style={{ width: 409, height: 874, maxWidth: '100%', border: 'none', borderRadius: 54, background: 'var(--bg-canvas)', outline: '1px solid var(--border-subtle)' }}
          />
        </div>
      </div>
    </main>
  );
}
