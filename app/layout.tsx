import type { Metadata } from "next"
import type { ReactNode } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "HotelsVendors",
    template: "%s | HotelsVendors",
  },
  description: "AI-powered procurement marketplace for hotels and verified suppliers in Egypt",
  icons: {
    icon: "/favicon.svg",
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
