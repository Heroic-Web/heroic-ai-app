"use client"

/**
 * =========================================================
 * WRITER PAGE — FULL FIX (TIDAK MENGHAPUS FITUR & KODE)
 * - Semua template menghasilkan output BERBEDA & SESUAI
 * - Tidak ada navbar/header duplikat
 * - Generate, regenerate, copy, export MD & DOCX berfungsi
 * - SEO, tone, language, word count berpengaruh nyata
 * - Struktur panjang & stabil (aman >400 baris)
 * =========================================================
 */

import { useEffect, useMemo, useState } from "react"
import { useLanguage } from "@/lib/language-context"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Sparkles,
  Copy,
  Download,
  RefreshCw,
  FileText,
  Mail,
  Megaphone,
  ShoppingBag,
  MessageSquare,
  BookOpen,
  FileType,
  Check,
  Info,
  History,
} from "lucide-react"

import { generateContent, countWords } from "@/lib/content-generator"
import { exportToDocx } from "@/lib/export-docx"

/* =========================================================
 * TYPES
 * ========================================================= */

type Language = "en" | "id"
type Tone =
  | "professional"
  | "casual"
  | "formal"
  | "friendly"
  | "persuasive"

type ContentTypeId =
  | "article"
  | "blog"
  | "ad"
  | "email"
  | "social"
  | "product"

type ContentType = {
  id: ContentTypeId
  label: string
  description: string
  icon: React.ElementType
}

/* =========================================================
 * COMPONENT
 * ========================================================= */

export default function WriterPage() {
  const { t } = useLanguage()

  /* =======================
   * STATE
   * ======================= */
  const [topic, setTopic] = useState("")
  const [keywords, setKeywords] = useState("")
  const [tone, setTone] = useState<Tone>("professional")
  const [wordCount, setWordCount] = useState("1000")
  const [language, setLanguage] = useState<Language>("en")
  const [contentType, setContentType] =
    useState<ContentTypeId>("article")

  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  /* =======================
   * CONTENT TYPES
   * ======================= */
  const contentTypes: ContentType[] = [
    {
      id: "article",
      label: "Article",
      description: "Long-form informative article",
      icon: BookOpen,
    },
    {
      id: "blog",
      label: "Blog Post",
      description: "SEO friendly blog content",
      icon: FileText,
    },
    {
      id: "ad",
      label: "Ad Copy",
      description: "High converting advertisement copy",
      icon: Megaphone,
    },
    {
      id: "email",
      label: "Email",
      description: "Professional or marketing email",
      icon: Mail,
    },
    {
      id: "social",
      label: "Social Media",
      description: "Short engaging social content",
      icon: MessageSquare,
    },
    {
      id: "product",
      label: "Product Description",
      description: "E-commerce ready product copy",
      icon: ShoppingBag,
    },
  ]

  /* =======================
   * WORD COUNT OPTIONS
   * ======================= */
  const wordCountOptions = [
    { value: "500", label: "500 words", labelId: "500 kata" },
    { value: "700", label: "700 words", labelId: "700 kata" },
    { value: "1000", label: "1,000 words", labelId: "1.000 kata" },
    { value: "1500", label: "1,500 words", labelId: "1.500 kata" },
    { value: "2000", label: "2,000 words", labelId: "2.000 kata" },
    { value: "2500", label: "2,500 words", labelId: "2.500 kata" },
  ]

  /* =======================
   * DERIVED DATA
   * ======================= */
  const actualWordCount = useMemo(
    () => countWords(generatedContent),
    [generatedContent],
  )

  const readingTime = useMemo(() => {
    if (!actualWordCount) return 0
    return Math.ceil(actualWordCount / 200)
  }, [actualWordCount])

  const currentTemplate = useMemo(
    () => contentTypes.find((t) => t.id === contentType),
    [contentType],
  )

  /* =======================
   * GENERATION LOGIC
   * ======================= */
  const handleGenerate = async () => {
    if (!topic) return

    setIsGenerating(true)

    await new Promise((r) => setTimeout(r, 1200))

    const content = generateContent({
      topic,
      keywords,
      tone,
      wordCount: parseInt(wordCount),
      language,
      contentType, // ⬅️ PENTING: membedakan output
    })

    if (generatedContent) {
      setHistory((prev) => [generatedContent, ...prev].slice(0, 5))
    }

    setGeneratedContent(content)
    setIsGenerating(false)
  }

  /* =======================
   * ACTIONS
   * ======================= */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportMd = () => {
    const blob = new Blob([generatedContent], {
      type: "text/markdown",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${contentType}-${topic
      .slice(0, 40)
      .replace(/\s+/g, "-")}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportDocx = async () => {
    const keywordsList = keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean)

    await exportToDocx({
      title: topic,
      content: generatedContent,
      keywords: keywordsList,
      createdAt: new Date().toLocaleString(),
    })
  }

  const handleClear = () => {
    setGeneratedContent("")
    setHistory([])
  }

    /* =========================================================
   * UX HELPERS & SIDE EFFECTS
   * ========================================================= */

  // Auto-save draft
  useEffect(() => {
    const payload = {
      topic,
      keywords,
      tone,
      wordCount,
      language,
      contentType,
      generatedContent,
    }
    localStorage.setItem("writer:draft", JSON.stringify(payload))
  }, [
    topic,
    keywords,
    tone,
    wordCount,
    language,
    contentType,
    generatedContent,
  ])

  // Restore draft on mount
  useEffect(() => {
    const raw = localStorage.getItem("writer:draft")
    if (!raw) return

    try {
      const saved = JSON.parse(raw)
      setTopic(saved.topic || "")
      setKeywords(saved.keywords || "")
      setTone(saved.tone || "professional")
      setWordCount(saved.wordCount || "1000")
      setLanguage(saved.language || "en")
      setContentType(saved.contentType || "article")
      setGeneratedContent(saved.generatedContent || "")
    } catch {
      // ignore corrupted draft
    }
  }, [])

  // Keyboard shortcut: Ctrl + Enter → Generate
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault()
        handleGenerate()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [handleGenerate])

  /* =========================================================
   * VALIDATION
   * ========================================================= */

  const isTopicValid = topic.trim().length > 3
  const hasKeywords = keywords.trim().length > 0
  
  /* =========================================================
   * RENDER
   * ========================================================= */

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* =======================
         * TEMPLATE SELECTOR
         * ======================= */}
        <Card>
          <CardHeader>
            <CardTitle>Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setContentType(type.id)}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition ${
                    contentType === type.id
                      ? "border-heroic-blue bg-heroic-blue/10 text-heroic-blue"
                      : "hover:bg-secondary"
                  }`}
                >
                  <type.icon className="h-5 w-5" />
                  <span className="text-xs font-semibold">
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">

          {/* =======================
           * EDITOR
           * ======================= */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>
                {currentTemplate?.label} Content
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">

              <div>
                <Label>Topic / Title</Label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter main topic or headline"
                  className="bg-secondary/50"
                />
              </div>

              <div>
                <Label>Keywords (SEO)</Label>
                <Input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                  className="bg-secondary/50"
                />
              </div>

              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">
                    Generated Content
                  </span>
                  {generatedContent && (
                    <span className="text-muted-foreground">
                      {actualWordCount} words • ~{readingTime} min
                    </span>
                  )}
                </div>

                <Textarea
                  value={generatedContent}
                  onChange={(e) =>
                    setGeneratedContent(e.target.value)
                  }
                  placeholder="Generated content will appear here…"
                  className="min-h-[420px] bg-secondary/50 font-mono text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleGenerate}
                  disabled={!topic || isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>

                {generatedContent && (
                  <>
                    <Button variant="outline" onClick={handleCopy}>
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="outline" onClick={handleExportMd}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={handleExportDocx}>
                      <FileType className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleClear}
                    >
                      Clear
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* =======================
           * SETTINGS SIDEBAR
           * ======================= */}
          <div className="flex flex-col gap-6">

            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">

                <div>
                  <Label>Word Length</Label>
                  <Select
                    value={wordCount}
                    onValueChange={setWordCount}
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {wordCountOptions.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value}
                        >
                          {language === "id"
                            ? opt.labelId
                            : opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tone</Label>
                  <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">
                        Professional
                      </SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="persuasive">
                        Persuasive
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Language</Label>
                  <Select
                    value={language}
                    onValueChange={(v) =>
                      setLanguage(v as Language)
                    }
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="id">
                        Bahasa Indonesia
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* =======================
             * TEMPLATE INFO
             * ======================= */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Template Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>Type:</strong> {currentTemplate?.label}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {currentTemplate?.description}
                </p>
                <p>
                  <strong>Tone:</strong> {tone}
                </p>
                <p>
                  <strong>Language:</strong>{" "}
                  {language === "id"
                    ? "Bahasa Indonesia"
                    : "English"}
                </p>
                <p>
                  <strong>Target Length:</strong> {wordCount} words
                </p>
              </CardContent>
            </Card>

            {/* =======================
             * WRITING & SEO GUIDE
             * ======================= */}
            <Card>
              <CardHeader>
                <CardTitle>Writing & SEO Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Gunakan keyword di paragraf awal</p>
                <p>• Sesuaikan tone dengan audiens</p>
                <p>• Gunakan heading agar mudah dibaca</p>
                <p>• Artikel & blog cocok untuk SEO</p>
                <p>• Ad & social fokus ke CTA</p>
                <p>• Product harus fokus benefit</p>
                <p className="text-xs italic mt-2">
                  Shortcut: <strong>Ctrl + Enter</strong> untuk Generate
                </p>
              </CardContent>
            </Card>
            
            {history.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    History
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {history.map((item, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        setGeneratedContent(item)
                      }
                      className="w-full rounded border p-2 text-left hover:bg-secondary"
                    >
                      {item.slice(0, 140)}…
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}