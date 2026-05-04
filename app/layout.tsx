import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Hotels Vendors | Digital Procurement Hub for B2B Hospitality",
    template: "%s | Hotels Vendors",
  },
  description:
    "Egypt's leading B2B procurement platform for hotels. Connect with verified suppliers, streamline logistics, and unlock factoring liquidity — all with integrated ETA e-invoicing compliance.",
  keywords: [
    "hotel procurement",
    "hospitality suppliers Egypt",
    "B2B hotel sourcing",
    "hotel supply chain",
    "procurement hub",
    "ETA e-invoicing",
    "hospitality logistics",
    "supplier factoring",
  ],
  openGraph: {
    type: "website",
    locale: "en_EG",
    url: "https://hotels-vendors.com",
    siteName: "Hotels Vendors",
    title: "Hotels Vendors | Digital Procurement Hub for B2B Hospitality",
    description:
      "Egypt's leading B2B procurement platform for hotels. Verified suppliers, streamlined logistics, and integrated ETA e-invoicing.",
    images: [
      {
        url: "/logo.jpg",
        width: 632,
        height: 632,
        alt: "Hotels Vendors — Smarter Together",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotels Vendors | Digital Procurement Hub",
    description:
      "Egypt's leading B2B procurement platform for hotels. Verified suppliers, streamlined logistics, and integrated ETA e-invoicing.",
    images: ["/logo.jpg"],
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0c0e12",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${nunito.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-background text-foreground font-sans">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
