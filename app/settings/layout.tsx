import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings — Hotels Vendors | Theme & Appearance",
  description: "Customize your Hotels Vendors experience. Choose themes, colors, fonts, and layout density.",
};

export default function SettingsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {children}
    </div>
  );
}
