"use client"

import { useState, Suspense } from "react"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
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
  Zap,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

type Tool = {
  id: string
  name: string
  description: string
  icon: typeof FileText
  category: "pdf" | "image" | "text"
  isFree: boolean
}

function ToolsContent() {
  const { t, locale } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const tools: Tool[] = [
    // PDF Tools
    {
      id: "merge-pdf",
      name: t("tools.pdf.merge"),
      description: locale === "en" ? "Combine multiple PDFs into one document" : "Gabungkan beberapa PDF menjadi satu dokumen",
      icon: Merge,
      category: "pdf",
      isFree: true,
    },
    {
      id: "split-pdf",
      name: t("tools.pdf.split"),
      description: locale === "en" ? "Split a PDF into multiple documents" : "Pisah PDF menjadi beberapa dokumen",
      icon: Scissors,
      category: "pdf",
      isFree: true,
    },
    {
      id: "compress-pdf",
      name: t("tools.pdf.compress"),
      description: locale === "en" ? "Reduce PDF file size while maintaining quality" : "Kurangi ukuran file PDF tanpa mengurangi kualitas",
      icon: Minimize2,
      category: "pdf",
      isFree: true,
    },
    {
      id: "pdf-to-word",
      name: t("tools.pdf.convert"),
      description: locale === "en" ? "Convert PDF documents to Word format" : "Konversi dokumen PDF ke format Word",
      icon: FileOutput,
      category: "pdf",
      isFree: false,
    },
    // Image Tools
    {
      id: "resize-image",
      name: t("tools.image.resize"),
      description: locale === "en" ? "Resize images to any dimension" : "Ubah ukuran gambar ke dimensi apapun",
      icon: ImageIcon,
      category: "image",
      isFree: true,
    },
    {
      id: "compress-image",
      name: t("tools.image.compress"),
      description: locale === "en" ? "Compress images without losing quality" : "Kompres gambar tanpa kehilangan kualitas",
      icon: Minimize2,
      category: "image",
      isFree: true,
    },
    {
      id: "remove-bg",
      name: t("tools.image.removeBg"),
      description: locale === "en" ? "Remove background from images using AI" : "Hapus background gambar menggunakan AI",
      icon: Eraser,
      category: "image",
      isFree: false,
    },
    {
      id: "convert-image",
      name: t("tools.image.convert"),
      description: locale === "en" ? "Convert between PNG, JPG, WEBP formats" : "Konversi antara format PNG, JPG, WEBP",
      icon: RefreshCw,
      category: "image",
      isFree: true,
    },
    // Text Tools
    {
      id: "paraphrase",
      name: t("tools.text.paraphrase"),
      description: locale === "en" ? "Rewrite text in different ways" : "Tulis ulang teks dengan cara berbeda",
      icon: Type,
      category: "text",
      isFree: true,
    },
    {
      id: "summarize",
      name: t("tools.text.summarize"),
      description: locale === "en" ? "Create concise summaries of long texts" : "Buat ringkasan singkat dari teks panjang",
      icon: FileText,
      category: "text",
      isFree: true,
    },
    {
      id: "rewrite",
      name: t("tools.text.rewrite"),
      description: locale === "en" ? "Improve and enhance your writing" : "Tingkatkan dan perbaiki tulisan Anda",
      icon: RefreshCw,
      category: "text",
      isFree: true,
    },
    {
      id: "grammar",
      name: t("tools.text.grammar"),
      description: locale === "en" ? "Check and fix grammar errors" : "Periksa dan perbaiki kesalahan tata bahasa",
      icon: Zap,
      category: "text",
      isFree: false,
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
    { id: "all", label: locale === "en" ? "All Tools" : "Semua Tool", count: tools.length },
    { id: "pdf", label: "PDF", count: tools.filter((t) => t.category === "pdf").length },
    { id: "image", label: locale === "en" ? "Image" : "Gambar", count: tools.filter((t) => t.category === "image").length },
    { id: "text", label: locale === "en" ? "Text" : "Teks", count: tools.filter((t) => t.category === "text").length },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-6xl px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">{t("tools.title")}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("tools.subtitle")}
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-8 max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={`${t("common.search")} tools...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center mb-10">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-secondary/50">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="data-[state=active]:bg-background"
                  >
                    {category.label}
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                      {category.count}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Tools Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <Link key={tool.id} href={`/dashboard/tools/${tool.id}`}>
                <Card className="group h-full cursor-pointer transition-all hover:border-heroic-blue/50 hover:bg-secondary/50">
                  <CardContent className="flex flex-col gap-4 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-foreground group-hover:bg-heroic-blue/20 group-hover:text-heroic-blue transition-colors">
                        <tool.icon className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="border-0">
                        {tool.isFree ? (locale === "en" ? "Free" : "Gratis") : "Pro"}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 flex items-center gap-2">
                        {tool.name}
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
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
              <p className="text-muted-foreground">
                {locale === "en" ? "No tools found matching your search." : "Tidak ada tool yang cocok dengan pencarian Anda."}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function PublicToolsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ToolsContent />
    </Suspense>
  )
}
