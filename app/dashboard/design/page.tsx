"use client"

import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ImageIcon, Palette, Shapes } from "lucide-react"
import type { ReactNode } from "react"

/* =========================
 * TYPE YANG JELAS & AMAN
 * ========================= */
type DesignTool = {
  title: string
  description: string
  icon: ReactNode
  color: string
  comingSoon: boolean
  href?: string
}

export default function DesignPage() {
  const { t, locale } = useLanguage()

  /* =========================
   * NORMALISASI TEXT (ANTI MERAH)
   * ========================= */
  const titleText: string =
    locale === "en" ? "Design Tools" : "Alat Desain"

  const descriptionText: string =
    typeof t("features.design.description") === "string"
      ? t("features.design.description")
      : locale === "en"
        ? "Explore powerful design tools to create, edit, and enhance your visuals."
        : "Jelajahi alat desain canggih untuk membuat, mengedit, dan meningkatkan visual Anda."

  const designTools: DesignTool[] = [
    {
      title: locale === "en" ? "AI Image Generator" : "Generator Gambar AI",
      description:
        locale === "en"
          ? "Create stunning images from text descriptions"
          : "Buat gambar menakjubkan dari deskripsi teks",
      icon: <Sparkles className="h-7 w-7" />,
      color: "bg-purple-500/10 text-purple-500",
      href: "/dashboard/design/image-generator",
      comingSoon: false,
    },
    {
      title: locale === "en" ? "Image Editor" : "Editor Gambar",
      description:
        locale === "en"
          ? "Edit images: rotate, resize, flip, and export"
          : "Edit gambar: rotasi, resize, flip, dan export",
      icon: <ImageIcon className="h-7 w-7" />,
      color: "bg-blue-500/10 text-blue-500",
      href: "/dashboard/design/image-editor",
      comingSoon: false,
    },
    {
      title: locale === "en" ? "Brand Kit" : "Kit Merek",
      description:
        locale === "en"
          ? "Manage your brand colors, fonts, and assets"
          : "Kelola warna, font, dan aset merek Anda",
      icon: <Palette className="h-7 w-7" />,
      color: "bg-green-500/10 text-green-500",
      comingSoon: true,
    },
    {
      title: locale === "en" ? "Logo Maker" : "Pembuat Logo",
      description:
        locale === "en"
          ? "Generate professional logos with AI"
          : "Buat logo profesional dengan AI",
      icon: <Shapes className="h-7 w-7" />,
      color: "bg-orange-500/10 text-orange-500",
      comingSoon: true,
    },
  ]

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-6xl space-y-6">

        <div className="grid gap-6 md:grid-cols-2">
          {designTools.map((tool) => (
            <Card
              key={tool.title}
              className={`relative overflow-hidden transition hover:shadow-lg ${
                tool.comingSoon ? "opacity-60" : ""
              }`}
            >
              {tool.comingSoon && (
                <div className="absolute top-4 right-4">
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                    {locale === "en" ? "Coming Soon" : "Segera Hadir"}
                  </span>
                </div>
              )}

              <CardContent className="flex flex-col gap-4 p-6">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-xl ${tool.color}`}
                >
                  {tool.icon}
                </div>

                <div>
                  <h3 className="text-lg font-semibold">{tool.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </div>

                {tool.comingSoon || !tool.href ? (
                  <Button disabled className="opacity-50">
                    {locale === "en" ? "Coming Soon" : "Segera Hadir"}
                  </Button>
                ) : (
                  <Button asChild>
                    <Link href={tool.href}>
                      {locale === "en" ? "Open Tool" : "Buka Tool"}
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}