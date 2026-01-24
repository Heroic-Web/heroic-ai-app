import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import { LanguageProvider } from "@/lib/language-context"
import { AuthProvider } from "@/lib/auth-context"
import { Providers } from "./providers"

import "./globals.css"

/* ================= FONT SETUP ================= */
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

/* ================= METADATA ================= */
export const metadata: Metadata = {
  title: "Heroic AI Studio - All-in-One AI Content, Design & Utility Platform",
  description:
    "Create content at the speed of thought. Heroic AI Studio combines AI writing, design tools, and utilities in one powerful platform.",
  generator: "v0.app",
  keywords: [
    "AI",
    "content creation",
    "copywriting",
    "design tools",
    "PDF tools",
    "image tools",
  ],
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

/* ================= VIEWPORT ================= */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
}

/* ================= ROOT LAYOUT ================= */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {/* Theme (light / dark) */}
        <Providers>
          {/* Auth context */}
          <AuthProvider>
            {/* Language context */}
            <LanguageProvider>{children}</LanguageProvider>
          </AuthProvider>
        </Providers>

        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  )
}