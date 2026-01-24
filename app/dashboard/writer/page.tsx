"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "lucide-react"
import { generateContent, countWords } from "@/lib/content-generator"
import { exportToDocx } from "@/lib/export-docx"

export default function WriterPage() {
  const { t } = useLanguage()
  const [topic, setTopic] = useState("")
  const [keywords, setKeywords] = useState("")
  const [tone, setTone] = useState("professional")
  const [wordCount, setWordCount] = useState("1000")
  const [language, setLanguage] = useState<"en" | "id">("en")
  const [contentType, setContentType] = useState("article")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const contentTypes = [
    { id: "article", label: t("writer.types.article"), icon: BookOpen },
    { id: "blog", label: t("writer.types.blog"), icon: FileText },
    { id: "ad", label: t("writer.types.ad"), icon: Megaphone },
    { id: "email", label: t("writer.types.email"), icon: Mail },
    { id: "social", label: t("writer.types.social"), icon: MessageSquare },
    { id: "product", label: t("writer.types.product"), icon: ShoppingBag },
  ]

  const wordCountOptions = [
    { value: "500", label: "500 words", labelId: "500 kata" },
    { value: "700", label: "700 words", labelId: "700 kata" },
    { value: "1000", label: "1,000 words", labelId: "1.000 kata" },
    { value: "1500", label: "1,500 words", labelId: "1.500 kata" },
    { value: "2000", label: "2,000 words", labelId: "2.000 kata" },
    { value: "2500", label: "2,500 words", labelId: "2.500 kata" },
  ]

  const handleGenerate = async () => {
    if (!topic) return

    setIsGenerating(true)

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const content = generateContent({
      topic,
      keywords,
      tone,
      wordCount: parseInt(wordCount),
      language,
      contentType,
    })

    setGeneratedContent(content)
    setIsGenerating(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportMd = () => {
    const blob = new Blob([generatedContent], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${topic.slice(0, 30).replace(/\s+/g, "-")}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportDocx = async () => {
    const keywordsList = keywords.split(",").map((k) => k.trim()).filter(Boolean)
    if (keywordsList.length === 0 && topic) {
      keywordsList.push(...topic.toLowerCase().split(" ").filter((w) => w.length > 3))
    }

    await exportToDocx({
      title: topic,
      content: generatedContent,
      keywords: keywordsList,
      createdAt: new Date().toLocaleString(),
    })
  }

  const actualWordCount = countWords(generatedContent)

  return (
    <>
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            {/* Editor Area */}
            <div className="flex flex-col gap-6">
              {/* Content Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("writer.templates")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                    {contentTypes.map((type) => (
                      <button
                        type="button"
                        key={type.id}
                        onClick={() => setContentType(type.id)}
                        className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                          contentType === type.id
                            ? "border-heroic-blue bg-heroic-blue/10 text-heroic-blue"
                            : "border-border bg-card hover:border-heroic-blue/50 hover:bg-secondary/50"
                        }`}
                      >
                        <type.icon className="h-5 w-5" />
                        <span className="text-xs font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Main Editor */}
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="text-lg">Content</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {/* Topic Input */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="topic">Topic / Title</Label>
                    <Input
                      id="topic"
                      placeholder="e.g., How to boost your productivity with AI tools"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="bg-secondary/50"
                    />
                  </div>

                  {/* Keywords */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="keywords">{t("writer.keywords")} (SEO)</Label>
                    <Input
                      id="keywords"
                      placeholder="e.g., AI tools, productivity, automation"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className="bg-secondary/50"
                    />
                  </div>

                  {/* Generated Content */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label>Generated Content</Label>
                        {generatedContent && (
                          <span className="text-xs text-muted-foreground">
                            ({actualWordCount} words)
                          </span>
                        )}
                      </div>
                      {generatedContent && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopy}
                            className="h-8"
                          >
                            {copied ? (
                              <Check className="h-4 w-4 mr-1 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4 mr-1" />
                            )}
                            {copied ? "Copied!" : t("writer.copy")}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleExportMd}
                            className="h-8"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            MD
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleExportDocx}
                            className="h-8"
                          >
                            <FileType className="h-4 w-4 mr-1" />
                            DOCX
                          </Button>
                        </div>
                      )}
                    </div>
                    <Textarea
                      placeholder="Your generated content will appear here..."
                      value={generatedContent}
                      onChange={(e) => setGeneratedContent(e.target.value)}
                      className="min-h-[400px] bg-secondary/50 font-mono text-sm leading-relaxed"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={handleGenerate}
                      disabled={!topic || isGenerating}
                      className="flex-1"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          {t("writer.generate")}
                        </>
                      )}
                    </Button>
                    {generatedContent && (
                      <Button
                        variant="outline"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="bg-transparent"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        {t("writer.regenerate")}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Settings Sidebar */}
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Settings</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {/* Word Count */}
                  <div className="flex flex-col gap-2">
                    <Label>{t("writer.length")}</Label>
                    <Select value={wordCount} onValueChange={setWordCount}>
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {wordCountOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {language === "id" ? opt.labelId : opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tone */}
                  <div className="flex flex-col gap-2">
                    <Label>{t("writer.tone")}</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">
                          {t("writer.tones.professional")}
                        </SelectItem>
                        <SelectItem value="casual">
                          {t("writer.tones.casual")}
                        </SelectItem>
                        <SelectItem value="formal">
                          {t("writer.tones.formal")}
                        </SelectItem>
                        <SelectItem value="friendly">
                          {t("writer.tones.friendly")}
                        </SelectItem>
                        <SelectItem value="persuasive">
                          {t("writer.tones.persuasive")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Language */}
                  <div className="flex flex-col gap-2">
                    <Label>{t("writer.language")}</Label>
                    <Select value={language} onValueChange={(v) => setLanguage(v as "en" | "id")}>
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="id">Bahasa Indonesia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* SEO Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">SEO Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-heroic-blue">1.</span>
                      Include your main keyword in the title
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-heroic-blue">2.</span>
                      Use keywords naturally throughout the content
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-heroic-blue">3.</span>
                      Add relevant headings (H2, H3) for structure
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-heroic-blue">4.</span>
                      Keep paragraphs short and readable
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-heroic-blue">5.</span>
                      Include a compelling meta description
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Export Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Export Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                      <Download className="h-5 w-5 text-muted-foreground shrink-0" />
                      <div>
                        <p className="font-medium">Markdown (.md)</p>
                        <p className="text-xs text-muted-foreground">Plain text with formatting</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                      <FileType className="h-5 w-5 text-muted-foreground shrink-0" />
                      <div>
                        <p className="font-medium">Word Document (.docx)</p>
                        <p className="text-xs text-muted-foreground">Full article with keywords</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
