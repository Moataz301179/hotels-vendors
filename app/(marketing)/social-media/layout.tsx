import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Media — INVO",
  description:
    "Connect with INVO on social media. Follow our journey building Egypt's first smart hospitality procurement platform.",
};

export default function SocialMediaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
