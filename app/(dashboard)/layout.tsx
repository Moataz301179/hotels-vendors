import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Dashboard — Hotels Vendors",
    template: "%s — Hotels Vendors",
  },
  description:
    "Role-specific command center for the Egyptian hospitality procurement hub.",
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {children}
    </div>
  );
}
