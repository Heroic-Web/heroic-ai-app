"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { ToolPageLayout } from "@/components/tools/tool-page-layout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, RotateCcw, CheckCircle, AlertTriangle, SpellCheck } from "lucide-react"

interface GrammarIssue {
  type: "grammar" | "spelling" | "style" | "punctuation"
  original: string
  suggestion: string
  message: string
}

export default function GrammarCheckPage() {
  const { t } = useLanguage()
  const [text, setText] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [issues, setIssues] = useState<GrammarIssue[]>([])
  const [correctedText, setCorrectedText] = useState("")
  const [copied, setCopied] = useState(false)

  const checkGrammar = async () => {
    if (!text.trim()) return
    
    setIsChecking(true)
    
    // Simulate grammar checking
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simple demo grammar checking
    const foundIssues: GrammarIssue[] = []
    let corrected = text
    
    // Check for common issues
    const commonErrors: [RegExp, string, string, string, string][] = [
      [/\bi\b/g, "I", "i", "Capitalize 'I'", "grammar"],
      [/\bdont\b/gi, "don't", "dont", "Missing apostrophe", "punctuation"],
      [/\bwont\b/gi, "won't", "wont", "Missing apostrophe", "punctuation"],
      [/\bcant\b/gi, "can't", "cant", "Missing apostrophe", "punctuation"],
      [/\bthier\b/gi, "their", "thier", "Spelling error", "spelling"],
      [/\brecieve\b/gi, "receive", "recieve", "Spelling error", "spelling"],
      [/\boccured\b/gi, "occurred", "occured", "Spelling error", "spelling"],
      [/\buntill\b/gi, "until", "untill", "Spelling error", "spelling"],
      [/\bvery unique\b/gi, "unique", "very unique", "'Unique' doesn't need 'very'", "style"],
      [/\s{2,}/g, " ", "  ", "Extra spaces", "style"],
    ]
    
    for (const [pattern, replacement, original, message, type] of commonErrors) {
      if (pattern.test(text)) {
        foundIssues.push({
          type: type as GrammarIssue["type"],
          original,
          suggestion: replacement,
          message
        })
        corrected = corrected.replace(pattern, replacement)
      }
    }
    
    // Check for sentences not starting with capital
    const sentences = text.split(/[.!?]+\s*/)
    for (const sentence of sentences) {
      if (sentence && sentence[0] && sentence[0] !== sentence[0].toUpperCase() && /[a-z]/.test(sentence[0])) {
        foundIssues.push({
          type: "grammar",
          original: sentence.substring(0, 20) + "...",
          suggestion: sentence[0].toUpperCase() + sentence.substring(1, 20) + "...",
          message: "Sentence should start with capital letter"
        })
        corrected = corrected.replace(sentence, sentence[0].toUpperCase() + sentence.substring(1))
      }
    }
    
    setIssues(foundIssues)
    setCorrectedText(corrected)
    setIsChecking(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(correctedText || text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setText("")
    setIssues([])
    setCorrectedText("")
  }

  const applyCorrection = () => {
    setText(correctedText)
    setIssues([])
    setCorrectedText("")
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "grammar": return "bg-red-500/20 text-red-400"
      case "spelling": return "bg-orange-500/20 text-orange-400"
      case "style": return "bg-blue-500/20 text-blue-400"
      case "punctuation": return "bg-yellow-500/20 text-yellow-400"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <ToolPageLayout
      title={t("tools.grammarCheck")}
      description="Check and fix grammar, spelling, and style issues"
      icon={<SpellCheck className="h-6 w-6" />}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Textarea
            placeholder="Paste your text here to check for grammar errors..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[350px] bg-secondary/50 border-border resize-none"
          />
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} className="flex-1 bg-transparent">
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <Button 
              onClick={checkGrammar}
              disabled={!text.trim() || isChecking}
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isChecking ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                  Checking...
                </>
              ) : (
                <>
                  <SpellCheck className="mr-2 h-4 w-4" />
                  Check Grammar
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {issues.length > 0 ? (
            <>
              <Card className="bg-secondary/30 border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-foreground">
                      Found {issues.length} issue{issues.length !== 1 ? "s" : ""}
                    </h3>
                    <div className="flex gap-2">
                      <Badge variant="outline" className={getTypeColor("grammar")}>Grammar</Badge>
                      <Badge variant="outline" className={getTypeColor("spelling")}>Spelling</Badge>
                      <Badge variant="outline" className={getTypeColor("style")}>Style</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3 max-h-[200px] overflow-y-auto">
                    {issues.map((issue, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-card">
                        <AlertTriangle className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">{issue.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            <span className="line-through text-red-400">{issue.original}</span>
                            {" → "}
                            <span className="text-green-400">{issue.suggestion}</span>
                          </p>
                        </div>
                        <Badge className={getTypeColor(issue.type)}>{issue.type}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-secondary/30 border-border">
                <CardContent className="p-4">
                  <h3 className="font-medium text-foreground mb-3">Corrected Text</h3>
                  <div className="p-3 rounded-lg bg-card min-h-[100px] text-foreground whitespace-pre-wrap">
                    {correctedText}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" onClick={handleCopy} className="flex-1 bg-transparent">
                      <Copy className="mr-2 h-4 w-4" />
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button onClick={applyCorrection} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Apply All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-secondary/30 border-border h-full">
              <CardContent className="p-6 h-full flex items-center justify-center">
                <div className="text-center">
                  {text.trim() && !isChecking ? (
                    <>
                      <CheckCircle className="h-16 w-16 mx-auto text-green-400 mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No Issues Found!</h3>
                      <p className="text-muted-foreground">Your text looks great.</p>
                    </>
                  ) : (
                    <>
                      <SpellCheck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">Grammar Checker</h3>
                      <p className="text-muted-foreground">Enter text and click "Check Grammar" to find issues</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ToolPageLayout>
  )
}
