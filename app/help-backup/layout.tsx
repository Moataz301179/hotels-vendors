import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center — Hotels Vendors | Support & Guides",
  description: "Video guides, FAQ, and support for Hotels Vendors. Learn how to use the hotel portal, supplier dashboard, ETA e-invoicing, and more.",
};

export default function HelpLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
