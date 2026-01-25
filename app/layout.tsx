import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"

import { LanguageProvider } from "@/lib/language-context"
import { AuthProvider } from "@/lib/auth-context"
import { Providers } from "./providers"

import "./globals.css"

/* ================= FONT SETUP (LOCAL — NO INTERNET) ================= */
const geist = localFont({
  src: [
    {
      path: "../public/fonts/Geist-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Geist-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Geist-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-geist",
  display: "swap",
})

const geistMono = localFont({
  src: [
    {
      path: "../public/fonts/GeistMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-geist-mono",
  display: "swap",
})

/* ================= METADATA ================= */
export const metadata: Metadata = {
  title: "HINTech Studio - All-in-One AI Content, Design & Utility Platform",
  description:
    "Create content at the speed of thought. HINTech Studio combines AI writing, design tools, and utilities in one powerful platform.",
  applicationName: "HINTech Studio",
  authors: [{ name: "HINTech", url: "https://heroic.web.id" }],
  creator: "Rodhi Faisal Mufid",
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
      { url: "/Heroic_AI.png", media: "(prefers-color-scheme: light)" },
      { url: "/Heroic_AI.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/Heroic_AI.png",
  },
}

/* ================= VIEWPORT ================= */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
}

/* ================= ROOT LAYOUT ================= */
/**
 * ⚠️ RULE KERAS:
 * - JANGAN render Navbar di sini
 * - JANGAN render DashboardHeader di sini
 * - Layout ini HARUS NETRAL
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <Providers>
          <AuthProvider>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </AuthProvider>
        </Providers>

        <Analytics />
      </body>
    </html>
  )
}