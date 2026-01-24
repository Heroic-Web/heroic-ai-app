"use client"

import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

export function Pricing() {
  const { t, locale } = useLanguage()

  const plans = [
    {
      name: t("pricing.free.name"),
      price: t("pricing.free.price"),
      period: t("pricing.free.period"),
      description: t("pricing.free.description"),
      features: locale === "en" 
        ? ["5 AI generations/day", "Basic tools access", "Standard support", "1 project"]
        : ["5 generasi AI/hari", "Akses tool dasar", "Dukungan standar", "1 proyek"],
      cta: t("pricing.free.cta"),
      popular: false,
    },
    {
      name: t("pricing.pro.name"),
      price: t("pricing.pro.price"),
      period: t("pricing.pro.period"),
      description: t("pricing.pro.description"),
      features: locale === "en"
        ? ["Unlimited AI generations", "All tools access", "Priority support", "Unlimited projects", "Custom templates", "API access"]
        : ["Generasi AI unlimited", "Akses semua tool", "Dukungan prioritas", "Proyek unlimited", "Template kustom", "Akses API"],
      cta: t("pricing.pro.cta"),
      popular: true,
      badge: t("pricing.pro.badge"),
    },
    {
      name: t("pricing.business.name"),
      price: t("pricing.business.price"),
      period: t("pricing.business.period"),
      description: t("pricing.business.description"),
      features: locale === "en"
        ? ["Everything in Pro", "Team collaboration", "Advanced analytics", "Custom integrations", "Dedicated support", "SLA guarantee"]
        : ["Semua fitur Pro", "Kolaborasi tim", "Analitik lanjutan", "Integrasi kustom", "Dukungan dedikasi", "Jaminan SLA"],
      cta: t("pricing.business.cta"),
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">
            {t("pricing.title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-balance">
            {t("pricing.subtitle")}
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 ${
                plan.popular
                  ? "border-heroic-blue bg-heroic-blue/5"
                  : "border-border bg-card"
              }`}
            >
              {plan.popular && plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-heroic-blue px-3 py-1 text-xs font-medium text-primary-foreground">
                    {plan.badge}
                  </span>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <ul className="mb-8 flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-heroic-blue mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href={`https://wa.me/6282144137914?text=Hello%2C%20I%20would%20like%20to%20order%20the%20${encodeURIComponent(
                  plan.name ?? "Business Package"
                )}.%20Please%20share%20the%20details%20and%20pricing.`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
