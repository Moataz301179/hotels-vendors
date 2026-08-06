import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — INVO | Founder & CEO",
  description: "Meet Moataz Abdel Ghani, Founder & CEO of INVO. Big 4 background, hospitality expertise, and the vision behind Egypt's digital procurement hub.",
};

export default function AboutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
