"use client"

import { useState } from "react"
import { ToolPageLayout } from "@/components/tools/tool-page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RefreshCw, Copy, Check, Sparkles } from "lucide-react"

// Paraphrase function with different styles
function paraphraseText(text: string, style: string): string {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean)

  const synonyms: Record<string, string[]> = {
    good: ["excellent", "great", "wonderful", "fantastic", "superb"],
    bad: ["poor", "terrible", "awful", "dreadful", "inferior"],
    important: ["crucial", "vital", "essential", "significant", "critical"],
    big: ["large", "massive", "enormous", "substantial", "considerable"],
    small: ["tiny", "little", "minute", "compact", "modest"],
    fast: ["quick", "rapid", "swift", "speedy", "prompt"],
    slow: ["gradual", "unhurried", "leisurely", "measured", "steady"],
    make: ["create", "produce", "generate", "develop", "construct"],
    help: ["assist", "support", "aid", "facilitate", "enable"],
    use: ["utilize", "employ", "apply", "leverage", "implement"],
    show: ["demonstrate", "illustrate", "reveal", "display", "exhibit"],
    think: ["believe", "consider", "regard", "view", "perceive"],
    very: ["extremely", "highly", "remarkably", "exceptionally", "particularly"],
    many: ["numerous", "several", "various", "multiple", "countless"],
    also: ["additionally", "furthermore", "moreover", "besides", "likewise"],
    however: ["nevertheless", "nonetheless", "yet", "still", "although"],
    because: ["since", "as", "due to the fact that", "given that", "owing to"],
    but: ["however", "yet", "although", "nevertheless", "on the other hand"],
    get: ["obtain", "acquire", "receive", "gain", "secure"],
    start: ["begin", "commence", "initiate", "launch", "embark on"],
  }

  const paraphrased = sentences.map((sentence) => {
    let newSentence = sentence

    // Replace words with synonyms
    for (const [word, syns] of Object.entries(synonyms)) {
      const regex = new RegExp(`\\b${word}\\b`, "gi")
      if (regex.test(newSentence)) {
        const randomSyn = syns[Math.floor(Math.random() * syns.length)]
        newSentence = newSentence.replace(regex, randomSyn)
      }
    }

    // Apply style-specific transformations
    switch (style) {
      case "formal":
        newSentence = newSentence
          .replace(/\bdon't\b/gi, "do not")
          .replace(/\bcan't\b/gi, "cannot")
          .replace(/\bwon't\b/gi, "will not")
          .replace(/\bi'm\b/gi, "I am")
          .replace(/\bit's\b/gi, "it is")
          .replace(/\bthat's\b/gi, "that is")
          .replace(/\bwhat's\b/gi, "what is")
        break
      case "casual":
        newSentence = newSentence
          .replace(/\bdo not\b/gi, "don't")
          .replace(/\bcannot\b/gi, "can't")
          .replace(/\bwill not\b/gi, "won't")
          .replace(/\bI am\b/gi, "I'm")
          .replace(/\bit is\b/gi, "it's")
        break
      case "creative":
        if (Math.random() > 0.7) {
          newSentence = newSentence.replace(/\.$/, "!")
        }
        break
      case "concise":
        newSentence = newSentence
          .replace(/\bvery\s+/gi, "")
          .replace(/\breally\s+/gi, "")
          .replace(/\bjust\s+/gi, "")
          .replace(/\bactually\s+/gi, "")
          .replace(/\bbasically\s+/gi, "")
        break
    }

    return newSentence
  })

  return paraphrased.join(" ")
}

export default function ParaphrasePage() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [style, setStyle] = useState("standard")
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleParaphrase = async () => {
    if (!inputText.trim()) return

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const result = paraphraseText(inputText, style)
    setOutputText(result)
    setIsProcessing(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0

  const tips = [
    "Enter complete sentences for better results",
    "Try different styles to find the best match",
    "You can edit the output after generation",
  ]

  return (
    <ToolPageLayout
      title="Paraphrase Tool"
      description="Rewrite your text in different styles while maintaining the original meaning."
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
              placeholder="Enter or paste your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[250px] bg-secondary/50"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{wordCount} words</span>
              <span>{inputText.length} characters</span>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Paraphrase Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="concise">Concise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleParaphrase} disabled={!inputText.trim() || isProcessing}>
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Paraphrase
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg">Paraphrased Text</CardTitle>
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
              placeholder="Paraphrased text will appear here..."
              value={outputText}
              onChange={(e) => setOutputText(e.target.value)}
              className="min-h-[250px] bg-secondary/50"
            />
            {outputText && (
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>{outputText.trim().split(/\s+/).length} words</span>
                <span>{outputText.length} characters</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolPageLayout>
  )
}
