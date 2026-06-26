import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { NotificationProvider } from "@/components/notifications/notification-context";
import { LanguageProvider } from "@/lib/i18n/language-context";
import { PublicChatbot } from "@/components/ai-assistant/public-chatbot";

export const metadata: Metadata = {
  title: {
    default: "HotelsVendors | Digital Procurement Hub for B2B Hospitality",
    template: "%s | HotelsVendors",
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
    url: "https://hotelsvendors.com",
    siteName: "Hotels Vendors",
    title: "HotelsVendors | Digital Procurement Hub for B2B Hospitality",
    description:
      "Egypt's leading B2B procurement platform for hotels. Verified suppliers, streamlined logistics, and integrated ETA e-invoicing.",
    images: [
      {
        url: "/hotelsvendors-logo.png",
        width: 1200,
        height: 630,
        alt: "HotelsVendors — Smarter Together",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HotelsVendors | Digital Procurement Hub",
    description:
      "Egypt's leading B2B procurement platform for hotels. Verified suppliers, streamlined logistics, and integrated ETA e-invoicing.",
    images: ["/hotelsvendors-logo.png"],
    creator: "@hotelsvendors",
  },
  alternates: {
    canonical: "https://hotelsvendors.com",
    languages: {
      "en-EG": "https://hotelsvendors.com",
      "ar-EG": "https://hotelsvendors.com/ar",
    },
  },
  icons: {
    icon: [
      { url: "/logo-icon.png", sizes: "32x32", type: "image/png" },
      { url: "/logo-icon-white.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/logo-icon-white.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/logo-icon.png",
  },
  other: {
    "msapplication-TileColor": "#14110E",
    "msapplication-TileImage": "/logo-icon-white.png",
    "theme-color": "#14110E",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#14110E" },
    { media: "(prefers-color-scheme: light)", color: "#14110E" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <link rel="dns-prefetch" href="https://hotelsvendors.com" />
        <meta name="geo.region" content="EG" />
        <meta name="geo.placename" content="Cairo, Egypt" />
        <meta name="ICBM" content="30.0444, 31.2357" />
        <meta name="application-name" content="Hotels Vendors" />
        <meta name="apple-mobile-web-app-title" content="Hotels Vendors" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#14110E" id="theme-color-meta" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var valid = ['noir', 'ember'];
                  var saved = localStorage.getItem('hv-theme-mode');
                  var mode = valid.indexOf(saved) !== -1 ? saved : 'noir';
                  document.documentElement.setAttribute('data-theme', mode);
                  var meta = document.getElementById('theme-color-meta');
                  if (meta) {
                    var colors = { noir: '#14110E', ember: '#0A1612' };
                    meta.setAttribute('content', colors[mode] || '#14110E');
                  }
                } catch (e) {}
                if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
                  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                    window.addEventListener('load', function() {
                      navigator.serviceWorker.register('/sw.js').catch(function(err) {
                        console.warn('SW registration failed:', err);
                      });
                    });
                  }
                }
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Hotels Vendors",
              url: "https://hotelsvendors.com",
              logo: "https://hotelsvendors.com/hotelsvendors-logo.png",
              description: "Egypt's leading B2B procurement platform for the hospitality sector.",
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
        className="font-sans min-h-full flex flex-col bg-background text-foreground antialiased"
        style={{ fontFamily: "var(--font-sans)", background: "var(--bg-canvas)", color: "var(--text-primary)" }}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-black focus:text-white"
          style={{ position: "absolute", left: -9999, top: "auto", width: 1, height: 1, overflow: "hidden" }}
        >
          Skip to main content
        </a>
        <LanguageProvider>
          <NotificationProvider>
            <ThemeProvider>
              <main id="main-content">{children}</main>
            </ThemeProvider>
          </NotificationProvider>
        </LanguageProvider>
        <PublicChatbot />
      </body>
    </html>
  );
}
