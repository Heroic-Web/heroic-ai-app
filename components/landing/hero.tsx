"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Background glow effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-heroic-blue/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm">
            <span className="h-2 w-2 rounded-full bg-heroic-blue animate-pulse" />
            <span className="text-muted-foreground">{t("hero.badge")}</span>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance md:text-6xl lg:text-7xl">
            {t("hero.title")}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground text-balance md:text-xl">
            {t("hero.subtitle")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="gap-2 px-8">
                {t("hero.cta")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a
              href="https://wa.me/6282144137914?text=Halo%20saya%20tertarik%20dengan%20aplikasi%20Anda..."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="gap-2 px-8 bg-transparent">
                <Play className="h-4 w-4" />
                {t("hero.ctaSecondary")}
              </Button>
            </a>
          </div>

          {/* Trusted by */}
          <p className="mt-12 text-sm text-muted-foreground">{t("hero.trustedBy")}</p>

          {/* Logo cloud */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 opacity-50">
            {["Acme Inc", "Globex", "Initech", "Umbrella", "Massive Dynamic"].map((company) => (
              <div key={company} className="text-sm font-medium tracking-wider text-muted-foreground">
                {company}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { value: "50K+", label: t("stats.users") },
            { value: "1M+", label: t("stats.content") },
            { value: "15+", label: t("stats.tools") },
            { value: "99.9%", label: t("stats.uptime") },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold md:text-4xl">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
