"use client"

import { useState } from "react"
import { ToolPageLayout } from "@/components/tools/tool-page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Check, Type, ArrowRight } from "lucide-react"

type CaseType =
  | "uppercase"
  | "lowercase"
  | "titlecase"
  | "sentencecase"
  | "camelcase"
  | "pascalcase"
  | "snakecase"
  | "kebabcase"
  | "dotcase"
  | "constantcase"

export default function ConvertCasePage() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [selectedCase, setSelectedCase] = useState<CaseType | null>(null)
  const [copied, setCopied] = useState(false)

  const convertCase = (text: string, caseType: CaseType): string => {
    if (!text.trim()) return ""

    // Normalize text - split into words
    const words = text.replace(/([a-z])([A-Z])/g, "$1 $2").split(/[\s_\-\.]+/)

    switch (caseType) {
      case "uppercase":
        return text.toUpperCase()
      case "lowercase":
        return text.toLowerCase()
      case "titlecase":
        return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
      case "sentencecase":
        return text
          .toLowerCase()
          .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
      case "camelcase":
        return words
          .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
          .join("")
      case "pascalcase":
        return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("")
      case "snakecase":
        return words.map((w) => w.toLowerCase()).join("_")
      case "kebabcase":
        return words.map((w) => w.toLowerCase()).join("-")
      case "dotcase":
        return words.map((w) => w.toLowerCase()).join(".")
      case "constantcase":
        return words.map((w) => w.toUpperCase()).join("_")
      default:
        return text
    }
  }

  const handleConvert = (caseType: CaseType) => {
    setSelectedCase(caseType)
    setOutputText(convertCase(inputText, caseType))
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const caseButtons: { type: CaseType; label: string; example: string }[] = [
    { type: "uppercase", label: "UPPERCASE", example: "HELLO WORLD" },
    { type: "lowercase", label: "lowercase", example: "hello world" },
    { type: "titlecase", label: "Title Case", example: "Hello World" },
    { type: "sentencecase", label: "Sentence case", example: "Hello world. How are you?" },
    { type: "camelcase", label: "camelCase", example: "helloWorld" },
    { type: "pascalcase", label: "PascalCase", example: "HelloWorld" },
    { type: "snakecase", label: "snake_case", example: "hello_world" },
    { type: "kebabcase", label: "kebab-case", example: "hello-world" },
    { type: "dotcase", label: "dot.case", example: "hello.world" },
    { type: "constantcase", label: "CONSTANT_CASE", example: "HELLO_WORLD" },
  ]

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0

  const tips = [
    "Click any case button to instantly convert",
    "Great for coding variable names",
    "Output is editable if you need tweaks",
    "Perfect for formatting consistency",
  ]

  return (
    <ToolPageLayout
      title="Case Converter"
      description="Transform text between different letter cases instantly."
      tips={tips}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Type className="h-5 w-5" />
              Input Text
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Textarea
              placeholder="Enter or paste your text here..."
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value)
                if (selectedCase) {
                  setOutputText(convertCase(e.target.value, selectedCase))
                }
              }}
              className="min-h-[180px] bg-secondary/50"
            />
            <div className="text-sm text-muted-foreground">
              {wordCount} words, {inputText.length} characters
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium">Select Case</div>
              <div className="grid grid-cols-2 gap-2">
                {caseButtons.map(({ type, label }) => (
                  <Button
                    key={type}
                    variant={selectedCase === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleConvert(type)}
                    disabled={!inputText.trim()}
                    className={`justify-start text-left ${selectedCase === type ? "" : "bg-transparent"}`}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Converted Text
            </CardTitle>
            {outputText && (
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 mr-1 text-green-500" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Textarea
              placeholder="Converted text will appear here..."
              value={outputText}
              onChange={(e) => setOutputText(e.target.value)}
              className="min-h-[180px] bg-secondary/50"
            />
            {selectedCase && (
              <div className="p-3 rounded-lg bg-secondary/50">
                <div className="text-xs text-muted-foreground mb-1">Selected format</div>
                <div className="font-medium">
                  {caseButtons.find((c) => c.type === selectedCase)?.label}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Example: {caseButtons.find((c) => c.type === selectedCase)?.example}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolPageLayout>
  )
}
