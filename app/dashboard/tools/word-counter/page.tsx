"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { ToolPageLayout } from "@/components/tools/tool-page-layout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, RotateCcw, FileText, Hash, Clock, Type } from "lucide-react"

export default function WordCounterPage() {
  const { t } = useLanguage()
  const [text, setText] = useState("")
  const [copied, setCopied] = useState(false)

  const stats = {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, "").length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    sentences: text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0,
    paragraphs: text.trim() ? text.split(/\n\n+/).filter(p => p.trim()).length : 0,
    readingTime: Math.ceil((text.trim() ? text.trim().split(/\s+/).length : 0) / 200),
    speakingTime: Math.ceil((text.trim() ? text.trim().split(/\s+/).length : 0) / 150),
  }

  const handleCopy = () => {
    const statsText = `Characters: ${stats.characters}
Characters (no spaces): ${stats.charactersNoSpaces}
Words: ${stats.words}
Sentences: ${stats.sentences}
Paragraphs: ${stats.paragraphs}
Reading Time: ${stats.readingTime} min
Speaking Time: ${stats.speakingTime} min`
    navigator.clipboard.writeText(statsText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setText("")
  }

  return (
    <ToolPageLayout
      title={t("tools.wordCounter")}
      description="Count words, characters, sentences, and estimate reading time"
      icon={<Hash className="h-6 w-6" />}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Textarea
            placeholder="Paste or type your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[400px] bg-secondary/50 border-border resize-none"
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} className="flex-1 bg-transparent">
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <Button onClick={handleCopy} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Copy className="mr-2 h-4 w-4" />
              {copied ? "Copied!" : "Copy Stats"}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-secondary/30 border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/20">
                    <Type className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.characters.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Characters</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/30 border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/20">
                    <Type className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.charactersNoSpaces.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">No Spaces</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/30 border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <FileText className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.words.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Words</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/30 border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <FileText className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.sentences.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Sentences</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/30 border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <FileText className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.paragraphs.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Paragraphs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/30 border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/20">
                    <Clock className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.readingTime} min</p>
                    <p className="text-sm text-muted-foreground">Reading Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-secondary/30 border-border">
            <CardContent className="p-4">
              <h3 className="font-medium text-foreground mb-3">Detailed Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average word length</span>
                  <span className="text-foreground">
                    {stats.words > 0 ? (stats.charactersNoSpaces / stats.words).toFixed(1) : 0} chars
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average sentence length</span>
                  <span className="text-foreground">
                    {stats.sentences > 0 ? (stats.words / stats.sentences).toFixed(1) : 0} words
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Speaking time (150 wpm)</span>
                  <span className="text-foreground">{stats.speakingTime} min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolPageLayout>
  )
}
