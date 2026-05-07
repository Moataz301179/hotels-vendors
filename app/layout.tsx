import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";

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
    "موردين فنادق",
    "توريدات الفنادق",
    "مشتريات الفنادق",
  ],
  authors: [{ name: "Hotels Vendors" }],
  creator: "Hotels Vendors",
  publisher: "Hotels Vendors",
  robots: "index, follow",
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
        url: "/hotelsvendors-logo.png",
        width: 1200,
        height: 630,
        alt: "Hotels Vendors — Smarter Together",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotels Vendors | Digital Procurement Hub",
    description:
      "Egypt's leading B2B procurement platform for hotels. Verified suppliers, streamlined logistics, and integrated ETA e-invoicing.",
    images: ["/hotelsvendors-logo.png"],
    creator: "@hotelsvendors",
  },
  alternates: {
    canonical: "https://hotels-vendors.com",
    languages: {
      "en-EG": "https://hotels-vendors.com",
      "ar-EG": "https://hotels-vendors.com/ar",
    },
  },
  icons: {
    icon: [
      { url: "/logo-icon.png", sizes: "32x32", type: "image/png" },
      { url: "/logo-horse-only.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/logo-horse-only.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/logo-icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    google: "google-site-verification-placeholder",
  },
  other: {
    "msapplication-TileColor": "#800000",
    "msapplication-TileImage": "/logo-horse-only.png",
    "theme-color": "#0c0e12",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0c0e12" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://hotels-vendors.com" />
        <meta name="geo.region" content="EG" />
        <meta name="geo.placename" content="Cairo, Egypt" />
        <meta name="ICBM" content="30.0444, 31.2357" />
        <meta name="application-name" content="Hotels Vendors" />
        <meta name="apple-mobile-web-app-title" content="Hotels Vendors" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Hotels Vendors",
              url: "https://hotels-vendors.com",
              logo: "https://hotels-vendors.com/hotelsvendors-logo.png",
              description:
                "Egypt's leading B2B procurement platform for the hospitality sector.",
              sameAs: [
                "https://facebook.com/hotelsvendors",
                "https://instagram.com/hotelsvendors",
                "https://linkedin.com/company/hotelsvendors",
              ],
              address: {
                "@type": "PostalAddress",
                addressCountry: "EG",
                addressLocality: "Cairo",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                availableLanguage: ["English", "Arabic"],
              },
            }),
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col antialiased bg-background text-foreground"
        style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
