"use client"

import { useState, Suspense } from "react"
import Link from "next/link"

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

/* ================= TYPES ================= */
type Tool = {
  id: string
  name: string
  description: string
  icon: typeof FileText
  category: "pdf" | "image" | "text"
  isFree: boolean
}

/* ================= CONTENT ================= */
function ToolsContent() {
  const { t, locale } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const tools: Tool[] = [
    {
      id: "merge-pdf",
      name: t("tools.pdf.merge"),
      description:
        locale === "en"
          ? "Combine multiple PDFs into one document"
          : "Gabungkan beberapa PDF menjadi satu dokumen",
      icon: Merge,
      category: "pdf",
      isFree: true,
    },
    {
      id: "split-pdf",
      name: t("tools.pdf.split"),
      description:
        locale === "en"
          ? "Split a PDF into multiple documents"
          : "Pisah PDF menjadi beberapa dokumen",
      icon: Scissors,
      category: "pdf",
      isFree: true,
    },
    {
      id: "compress-pdf",
      name: t("tools.pdf.compress"),
      description:
        locale === "en"
          ? "Reduce PDF file size while maintaining quality"
          : "Kurangi ukuran file PDF tanpa mengurangi kualitas",
      icon: Minimize2,
      category: "pdf",
      isFree: true,
    },
    {
      id: "pdf-to-word",
      name: t("tools.pdf.convert"),
      description:
        locale === "en"
          ? "Convert PDF documents to Word format"
          : "Konversi dokumen PDF ke format Word",
      icon: FileOutput,
      category: "pdf",
      isFree: false,
    },
    {
      id: "resize-image",
      name: t("tools.image.resize"),
      description:
        locale === "en"
          ? "Resize images to any dimension"
          : "Ubah ukuran gambar ke dimensi apa pun",
      icon: ImageIcon,
      category: "image",
      isFree: true,
    },
    {
      id: "compress-image",
      name: t("tools.image.compress"),
      description:
        locale === "en"
          ? "Compress images without losing quality"
          : "Kompres gambar tanpa kehilangan kualitas",
      icon: Minimize2,
      category: "image",
      isFree: true,
    },
    {
      id: "remove-bg",
      name: t("tools.image.removeBg"),
      description:
        locale === "en"
          ? "Remove background from images using AI"
          : "Hapus background gambar menggunakan AI",
      icon: Eraser,
      category: "image",
      isFree: false,
    },
    {
      id: "convert-image",
      name: t("tools.image.convert"),
      description:
        locale === "en"
          ? "Convert between PNG, JPG, WEBP formats"
          : "Konversi antara format PNG, JPG, WEBP",
      icon: RefreshCw,
      category: "image",
      isFree: true,
    },
    {
      id: "paraphrase",
      name: t("tools.text.paraphrase"),
      description:
        locale === "en"
          ? "Rewrite text in different ways"
          : "Tulis ulang teks dengan cara berbeda",
      icon: Type,
      category: "text",
      isFree: true,
    },
    {
      id: "summarize",
      name: t("tools.text.summarize"),
      description:
        locale === "en"
          ? "Create concise summaries of long texts"
          : "Buat ringkasan singkat dari teks panjang",
      icon: FileText,
      category: "text",
      isFree: true,
    },
    {
      id: "rewrite",
      name: t("tools.text.rewrite"),
      description:
        locale === "en"
          ? "Improve and enhance your writing"
          : "Tingkatkan dan perbaiki tulisan Anda",
      icon: RefreshCw,
      category: "text",
      isFree: true,
    },
    {
      id: "grammar",
      name: t("tools.text.grammar"),
      description:
        locale === "en"
          ? "Check and fix grammar errors"
          : "Periksa dan perbaiki kesalahan tata bahasa",
      icon: Zap,
      category: "text",
      isFree: false,
    },
  ]

  const filteredTools = tools.filter((tool) => {
    const q = searchQuery.toLowerCase()
    return (
      (activeTab === "all" || tool.category === activeTab) &&
      (tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q))
    )
  })

  const categories = [
    { id: "all", label: locale === "en" ? "All Tools" : "Semua Tool" },
    { id: "pdf", label: "PDF" },
    { id: "image", label: locale === "en" ? "Image" : "Gambar" },
    { id: "text", label: locale === "en" ? "Text" : "Teks" },
  ]

  return (
    <>
      {/* ✅ SATU-SATUNYA NAVBAR */}
      <Navbar />

      <main className="pb-20">
        <div className="mx-auto max-w-6xl px-6 pt-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{t("tools.title")}</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("tools.subtitle")}
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={`${t("common.search")} tools...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-10">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                {categories.map((c) => (
                  <TabsTrigger key={c.id} value={c.id}>
                    {c.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <Link key={tool.id} href={`/dashboard/tools/${tool.id}`}>
                <Card className="group h-full hover:border-heroic-blue/50 transition">
                  <CardContent className="p-6 flex flex-col gap-4">
                    <div className="flex justify-between">
                      <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                        <tool.icon className="h-6 w-6" />
                      </div>
                      <Badge>{tool.isFree ? "Free" : "Pro"}</Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {tool.name}
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {tool.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

/* ================= PAGE ================= */
export default function PublicToolsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ToolsContent />
    </Suspense>
  )
}