"use client"

import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { ToolsPreview } from "@/components/landing/tools-preview"
import { Pricing } from "@/components/landing/pricing"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
    
      <main>
        <Hero />
        <Navbar />
        <Features />
        <ToolsPreview />
        <Pricing />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
