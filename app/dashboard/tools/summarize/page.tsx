"use client"

import { useState } from "react"
import { ToolPageLayout } from "@/components/tools/tool-page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RefreshCw, Copy, Check, Sparkles, FileText, List } from "lucide-react"

// Summarize function
function summarizeText(text: string, ratio: number, format: "paragraph" | "bullets"): string {
  const sentences = text
    .replace(/([.!?])\s*(?=[A-Z])/g, "$1|")
    .split("|")
    .map((s) => s.trim())
    .filter((s) => s.length > 10)

  if (sentences.length === 0) return text

  // Score sentences based on position and keyword density
  const scoredSentences = sentences.map((sentence, index) => {
    let score = 0

    // Position score
    if (index === 0) score += 3
    if (index === sentences.length - 1) score += 2
    if (index < sentences.length * 0.2) score += 1

    // Length score
    const words = sentence.split(/\s+/).length
    if (words >= 10 && words <= 30) score += 2

    // Keyword indicators
    const importantWords = [
      "important", "key", "main", "significant", "crucial", "essential",
      "therefore", "conclusion", "result", "finding", "summary", "overall"
    ]
    for (const word of importantWords) {
      if (sentence.toLowerCase().includes(word)) score += 2
    }

    return { sentence, score, index }
  })

  // Select top sentences based on ratio
  const numSentences = Math.max(1, Math.ceil(sentences.length * ratio))
  const selectedSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, numSentences)
    .sort((a, b) => a.index - b.index)
    .map((s) => s.sentence)

  if (format === "bullets") {
    return selectedSentences.map((s) => `• ${s}`).join("\n\n")
  }

  return selectedSentences.join(" ")
}

export default function SummarizePage() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [summaryLength, setSummaryLength] = useState([30])
  const [format, setFormat] = useState<"paragraph" | "bullets">("paragraph")
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSummarize = async () => {
    if (!inputText.trim()) return

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const ratio = summaryLength[0] / 100
    const result = summarizeText(inputText, ratio, format)
    setOutputText(result)
    setIsProcessing(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const inputWordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0
  const outputWordCount = outputText.trim() ? outputText.trim().split(/\s+/).length : 0

  const tips = [
    "Works best with structured content",
    "Adjust the slider to control summary length",
    "Longer texts produce better summaries",
  ]

  return (
    <ToolPageLayout
      title="Text Summarizer"
      description="Condense long texts into clear, concise summaries."
      tips={tips}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Original Text</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Textarea
              placeholder="Paste your article, document, or any text you want to summarize..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[250px] bg-secondary/50"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{inputWordCount} words</span>
              <span>{inputText.length} characters</span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label>Summary Length</Label>
                <span className="text-sm text-muted-foreground">{summaryLength[0]}%</span>
              </div>
              <Slider
                value={summaryLength}
                onValueChange={setSummaryLength}
                min={10}
                max={70}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Shorter</span>
                <span>Longer</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Output Format</Label>
              <div className="flex gap-2">
                <Button
                  variant={format === "paragraph" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormat("paragraph")}
                  className={format === "paragraph" ? "" : "bg-transparent"}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Paragraph
                </Button>
                <Button
                  variant={format === "bullets" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormat("bullets")}
                  className={format === "bullets" ? "" : "bg-transparent"}
                >
                  <List className="h-4 w-4 mr-1" />
                  Bullet Points
                </Button>
              </div>
            </div>

            <Button onClick={handleSummarize} disabled={!inputText.trim() || isProcessing}>
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Summarizing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Summarize
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg">Summary</CardTitle>
            {outputText && (
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? (
                  <Check className="h-4 w-4 mr-1 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 mr-1" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Summary will appear here..."
              value={outputText}
              onChange={(e) => setOutputText(e.target.value)}
              className="min-h-[250px] bg-secondary/50"
            />
            {outputText && (
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{outputWordCount} words</span>
                <span className="text-heroic-blue">
                  {inputWordCount > 0
                    ? `${Math.round((outputWordCount / inputWordCount) * 100)}% of original`
                    : ""}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolPageLayout>
  )
}
