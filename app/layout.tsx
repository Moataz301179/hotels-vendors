import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { NotificationProvider } from "@/components/notifications/notification-context";
import { LanguageProvider } from "@/lib/i18n/language-context";
import { SkipLink } from "@/components/shared/skip-link";
import { CookieConsentBanner } from "@/components/shared/cookie-consent-banner";
import { initServer } from "@/lib/startup";

// Register graceful shutdown handlers (runs once per server instance)
if (typeof window === "undefined") {
  initServer();
}

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "HotelsVendors — B2B Procurement & Fintech for Egyptian Hospitality",
    template: "%s | HotelsVendors",
  },
  description:
    "Egypt's B2B hospitality procurement infrastructure. AI-automated demand forecasting, embedded reverse factoring, ETA e-invoicing compliance, and shared-route logistics — purpose-built for coastal hotel chains.",
  keywords: [
    "B2B hospitality procurement Egypt",
    "automated factoring lines Cairo",
    "hotel supply chain management Egypt",
    "ETA e-invoicing compliance",
    "hospitality vendor marketplace",
    "Sharm El-Sheikh hotel suppliers",
    "Hurghada resort procurement",
    "digital invoice Egypt",
    "تجهيزات الفنادق بالجملة",
    "منصة المشتريات الفندقية مصر",
    "الفوترة الإلكترونية هيئة الضرائب",
    "تمويل فندقي مصر",
    "سلسلة التوريد الفندقية",
  ],
  authors: [{ name: "HotelsVendors" }],
  creator: "HotelsVendors",
  publisher: "HotelsVendors",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_EG",
    url: "https://www.hotelsvendors.com",
    siteName: "HotelsVendors",
    title: "HotelsVendors — B2B Procurement & Fintech for Egyptian Hospitality",
    description:
      "AI-automated procurement. Embedded reverse factoring. ETA e-invoicing compliance. Purpose-built for Egyptian coastal hotel chains.",
    images: [
      {
        url: "/assets/logo.svg",
        width: 1200,
        height: 630,
        alt: "HotelsVendors — The Market Changer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HotelsVendors — B2B Procurement & Fintech",
    description:
      "AI-automated procurement. Embedded reverse factoring. ETA e-invoicing compliance.",
    images: ["/assets/logo.svg"],
    creator: "@hotelsvendors",
  },
  alternates: {
    canonical: "https://www.hotelsvendors.com",
    languages: {
      "en": "https://www.hotelsvendors.com",
      "ar": "https://www.hotelsvendors.com/ar",
    },
  },
  icons: {
    icon: [
      { url: "/logo-icon.png", sizes: "32x32", type: "image/png" },
      { url: "/logo-icon-white.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/logo-icon-white.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/logo-icon.png",
  },
  manifest: "/manifest.json",
  other: {
    "msapplication-TileColor": "#39ff7e",
    "msapplication-TileImage": "/logo-icon-white.png",
    "theme-color": "#0c0c12",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0c0c12" },
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
    <html
      lang="en"
      dir="ltr"
      className={`h-full ${plusJakarta.variable} ${jetbrainsMono.variable} ${inter.variable} ${firaCode.variable}`}
    >
      <head>
        <link rel="dns-prefetch" href="https://www.hotelsvendors.com" />
        <meta name="geo.region" content="EG" />
        <meta name="geo.placename" content="Cairo, Egypt" />
        <meta name="ICBM" content="30.0444, 31.2357" />
        <meta name="application-name" content="HotelsVendors" />
        <meta name="apple-mobile-web-app-title" content="HotelsVendors" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f5f7f8" id="theme-color-meta" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('hv-theme-mode') || 'light';
                  if (mode === 'light') {
                    document.documentElement.setAttribute('data-theme', 'light');
                    var meta = document.getElementById('theme-color-meta');
                    if (meta) meta.setAttribute('content', '#f5f7f8');
                  } else {
                    document.documentElement.removeAttribute('data-theme');
                    var meta = document.getElementById('theme-color-meta');
                    if (meta) meta.setAttribute('content', '#f5f7f8');
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
              name: "HotelsVendors",
              url: "https://www.hotelsvendors.com",
              logo: "https://www.hotelsvendors.com/assets/logo.svg",
              description:
                "Egypt's B2B hospitality procurement infrastructure platform. AI-automated demand forecasting, embedded reverse factoring, ETA e-invoicing compliance, and shared-route coastal logistics.",
              sameAs: [
                "https://linkedin.com/company/hotelsvendors",
                "https://twitter.com/hotelsvendors",
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
        className="min-h-full flex flex-col antialiased"
        style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          background: "var(--bg-canvas)",
        }}
      >
        <SkipLink />
        <LanguageProvider>
          <NotificationProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </NotificationProvider>
        </LanguageProvider>
        <CookieConsentBanner />
      </body>
    </html>
  );
}
