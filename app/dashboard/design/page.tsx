"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ImageIcon, Palette, Shapes } from "lucide-react"

export default function DesignPage() {
  const { t, locale } = useLanguage()

  const designTools = [
    {
      title: locale === "en" ? "AI Image Generator" : "Generator Gambar AI",
      description: locale === "en" ? "Create stunning images from text descriptions" : "Buat gambar menakjubkan dari deskripsi teks",
      icon: Sparkles,
      color: "bg-purple-500/10 text-purple-500",
      comingSoon: false,
    },
    {
      title: locale === "en" ? "Image Editor" : "Editor Gambar",
      description: locale === "en" ? "Edit and enhance your images with AI" : "Edit dan tingkatkan gambar dengan AI",
      icon: ImageIcon,
      color: "bg-blue-500/10 text-blue-500",
      comingSoon: true,
    },
    {
      title: locale === "en" ? "Brand Kit" : "Kit Merek",
      description: locale === "en" ? "Manage your brand colors, fonts, and assets" : "Kelola warna, font, dan aset merek Anda",
      icon: Palette,
      color: "bg-green-500/10 text-green-500",
      comingSoon: true,
    },
    {
      title: locale === "en" ? "Logo Maker" : "Pembuat Logo",
      description: locale === "en" ? "Generate professional logos with AI" : "Buat logo profesional dengan AI",
      icon: Shapes,
      color: "bg-orange-500/10 text-orange-500",
      comingSoon: true,
    },
  ]

  return (
    <>
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              {t("features.design.title")}
            </h2>
            <p className="text-muted-foreground mt-1">
              {t("features.design.description")}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {designTools.map((tool) => (
              <Card
                key={tool.title}
                className={`relative overflow-hidden ${
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
                    <tool.icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {tool.description}
                    </p>
                  </div>
                  <Button
                    disabled={tool.comingSoon}
                    className={tool.comingSoon ? "opacity-50" : ""}
                  >
                    {tool.comingSoon 
                      ? (locale === "en" ? "Coming Soon" : "Segera Hadir") 
                      : (locale === "en" ? "Open Tool" : "Buka Tool")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
