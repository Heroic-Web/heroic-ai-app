"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  ImageIcon,
  Type,
  Search,
  Scissors,
  Minimize2,
  FileOutput,
  Eraser,
  RefreshCw,
  Merge,
  FileImage,
  Zap,
  Lock,
  QrCode,
  Palette,
  Hash,
  SpellCheck,
  CaseSensitive,
} from "lucide-react"
import Link from "next/link"

type Tool = {
  id: string
  name: string
  description: string
  icon: typeof FileText
  category: "pdf" | "image" | "text" | "utility"
  isPro: boolean
  href: string
}

export default function ToolsPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const tools: Tool[] = [
    // PDF Tools
    {
      id: "merge-pdf",
      name: t("tools.mergePdf"),
      description: "Combine multiple PDFs into one document",
      icon: Merge,
      category: "pdf",
      isPro: false,
      href: "/dashboard/tools/merge-pdf",
    },
    {
      id: "pdf-to-image",
      name: t("tools.pdfToImage"),
      description: "Convert PDF pages to high-quality images",
      icon: FileImage,
      category: "pdf",
      isPro: false,
      href: "/dashboard/tools/pdf-to-image",
    },
    {
      id: "image-to-pdf",
      name: t("tools.imageToPdf"),
      description: "Convert images to PDF document",
      icon: FileText,
      category: "pdf",
      isPro: false,
      href: "/dashboard/tools/image-to-pdf",
    },
    // Image Tools
    {
      id: "resize-image",
      name: t("tools.resizeImage"),
      description: "Resize images to any dimension",
      icon: ImageIcon,
      category: "image",
      isPro: false,
      href: "/dashboard/tools/resize-image",
    },
    {
      id: "compress-image",
      name: t("tools.compressImage"),
      description: "Compress images without losing quality",
      icon: Minimize2,
      category: "image",
      isPro: false,
      href: "/dashboard/tools/compress-image",
    },
    {
      id: "generate-qr",
      name: t("tools.generateQr"),
      description: "Create customized QR codes",
      icon: QrCode,
      category: "image",
      isPro: false,
      href: "/dashboard/tools/generate-qr",
    },
    // Text Tools
    {
      id: "paraphrase",
      name: t("tools.paraphrase"),
      description: "Rewrite text in different ways",
      icon: Type,
      category: "text",
      isPro: false,
      href: "/dashboard/tools/paraphrase",
    },
    {
      id: "summarize",
      name: t("tools.summarize"),
      description: "Create concise summaries of long texts",
      icon: FileText,
      category: "text",
      isPro: false,
      href: "/dashboard/tools/summarize",
    },
    {
      id: "grammar-check",
      name: t("tools.grammarCheck"),
      description: "Check and fix grammar errors",
      icon: SpellCheck,
      category: "text",
      isPro: false,
      href: "/dashboard/tools/grammar-check",
    },
    // Utility Tools
    {
      id: "word-counter",
      name: t("tools.wordCounter"),
      description: "Count words, characters, and reading time",
      icon: Hash,
      category: "utility",
      isPro: false,
      href: "/dashboard/tools/word-counter",
    },
    {
      id: "convert-case",
      name: t("tools.convertCase"),
      description: "Convert text between different cases",
      icon: CaseSensitive,
      category: "utility",
      isPro: false,
      href: "/dashboard/tools/convert-case",
    },
    {
      id: "color-picker",
      name: t("tools.colorPicker"),
      description: "Pick and convert colors between formats",
      icon: Palette,
      category: "utility",
      isPro: false,
      href: "/dashboard/tools/color-picker",
    },
  ]

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeTab === "all" || tool.category === activeTab
    return matchesSearch && matchesCategory
  })

  const categories = [
    { id: "all", label: "All Tools", count: tools.length },
    { id: "pdf", label: "PDF", count: tools.filter((t) => t.category === "pdf").length },
    { id: "image", label: "Image", count: tools.filter((t) => t.category === "image").length },
    { id: "text", label: "Text", count: tools.filter((t) => t.category === "text").length },
    { id: "utility", label: "Utility", count: tools.filter((t) => t.category === "utility").length },
  ]

  return (
    <>
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">HINAI Tech Tools</h2>
            <p className="text-muted-foreground mt-1">Powerful utilities for your everyday tasks</p>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-border"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="bg-secondary/50">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                >
                  {category.label}
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <Link key={tool.id} href={tool.href}>
                <Card className="group h-full cursor-pointer transition-all hover:border-accent/50 hover:bg-secondary/50 bg-card border-border">
                  <CardContent className="flex flex-col gap-4 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-foreground group-hover:bg-accent/20 group-hover:text-accent transition-colors">
                        <tool.icon className="h-6 w-6" />
                      </div>
                      {tool.isPro ? (
                        <Badge className="bg-accent/20 text-accent border-0">
                          <Lock className="h-3 w-3 mr-1" />
                          Pro
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="border-0">
                          Free
                        </Badge>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-foreground">{tool.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tools found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
