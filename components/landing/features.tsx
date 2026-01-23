"use client"

import { useLanguage } from "@/lib/language-context"
import { FileText, Wrench, Palette, Workflow } from "lucide-react"

export function Features() {
  const { t } = useLanguage()

  const features = [
    {
      icon: FileText,
      title: t("features.writer.title"),
      description: t("features.writer.description"),
    },
    {
      icon: Wrench,
      title: t("features.tools.title"),
      description: t("features.tools.description"),
    },
    {
      icon: Palette,
      title: t("features.design.title"),
      description: t("features.design.description"),
    },
    {
      icon: Workflow,
      title: t("features.workflow.title"),
      description: t("features.workflow.description"),
    },
  ]

  return (
    <section id="features" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">
            {t("features.title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-balance">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-heroic-blue/50 hover:bg-secondary/50"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-foreground group-hover:bg-heroic-blue/20 group-hover:text-heroic-blue transition-colors">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
