"use client"

import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  FileText,
  ImageIcon,
  Type,
  Scissors,
  Minimize2,
  FileOutput,
  Eraser,
  RefreshCw,
  ArrowRight,
} from "lucide-react"

export function ToolsPreview() {
  const { t } = useLanguage()

  const toolCategories = [
    {
      title: "PDF",
      tools: [
        { icon: FileText, label: t("tools.pdf.merge") },
        { icon: Scissors, label: t("tools.pdf.split") },
        { icon: Minimize2, label: t("tools.pdf.compress") },
        { icon: FileOutput, label: t("tools.pdf.convert") },
      ],
    },
    {
      title: "Image",
      tools: [
        { icon: ImageIcon, label: t("tools.image.resize") },
        { icon: Minimize2, label: t("tools.image.compress") },
        { icon: Eraser, label: t("tools.image.removeBg") },
        { icon: RefreshCw, label: t("tools.image.convert") },
      ],
    },
    {
      title: "Text",
      tools: [
        { icon: Type, label: t("tools.text.paraphrase") },
        { icon: FileText, label: t("tools.text.summarize") },
        { icon: RefreshCw, label: t("tools.text.rewrite") },
        { icon: Type, label: t("tools.text.grammar") },
      ],
    },
  ]

  return (
    <section id="tools" className="py-20 md:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">
            {t("tools.title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-balance">
            {t("tools.subtitle")}
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {toolCategories.map((category) => (
            <div key={category.title} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-6 text-lg font-semibold">{category.title}</h3>
              <div className="grid grid-cols-2 gap-3">
                {category.tools.map((tool) => (
                  <button
                    type="button"
                    key={tool.label}
                    className="flex flex-col items-center gap-2 rounded-xl border border-border bg-background p-4 text-center transition-all hover:border-heroic-blue/50 hover:bg-secondary/50"
                  >
                    <tool.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs font-medium">{tool.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/tools">
            <Button variant="outline" size="lg" className="gap-2 bg-transparent">
              {t("tools.viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
