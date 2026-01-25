"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Loader2,
  Wand2,
  Download,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

/* =============================
   TYPES
============================= */
type StyleType = "realistic" | "anime" | "illustration" | "logo"
type RatioType = "1:1" | "16:9" | "9:16"

type HistoryItem = {
  prompt: string
  imageUrl: string
  style: StyleType
  ratio: RatioType
}

/* =============================
   STYLE PROMPT
============================= */
const STYLE_PROMPT: Record<StyleType, string> = {
  realistic: "realistic photo, natural lighting, ultra detail",
  anime: "anime illustration, vibrant colors, cinematic lighting",
  illustration: "digital illustration, concept art, soft lighting",
  logo: "minimal logo, flat design, vector style",
}

/* =============================
   RATIO
============================= */
const RATIO: Record<RatioType, { w: number; h: number }> = {
  "1:1": { w: 1024, h: 1024 },
  "16:9": { w: 1280, h: 720 },
  "9:16": { w: 720, h: 1280 },
}

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState<StyleType>("realistic")
  const [ratio, setRatio] = useState<RatioType>("1:1")

  const [imageUrl, setImageUrl] = useState<string | null>(null)

  /* LOADING UX */
  const [loading, setLoading] = useState(false)
  const [statusText, setStatusText] = useState("")
  const [eta, setEta] = useState(0)

  /* HISTORY */
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [historyOpen, setHistoryOpen] = useState(true)

  /* =============================
     LOAD HISTORY
  ============================= */
  useEffect(() => {
    const saved = localStorage.getItem("ai-image-history")
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  /* =============================
     SAVE HISTORY
  ============================= */
  const saveHistory = (item: HistoryItem) => {
    const updated = [item, ...history].slice(0, 9)
    setHistory(updated)
    localStorage.setItem("ai-image-history", JSON.stringify(updated))
  }

  /* =============================
     GENERATE IMAGE (WITH UX)
  ============================= */
  const generateImage = () => {
    if (!prompt.trim()) return

    setLoading(true)
    setImageUrl(null)

    /* UX Timeline */
    setStatusText("🧠 Menyiapkan prompt…")
    setEta(3)

    const interval = setInterval(() => {
      setEta((e) => (e > 0 ? e - 1 : 0))
    }, 1000)

    setTimeout(() => setStatusText("🎨 AI sedang menggambar…"), 1000)
    setTimeout(() => setStatusText("🖼️ Hampir selesai…"), 2000)

    const fullPrompt = `${prompt}, ${STYLE_PROMPT[style]}, no text, no watermark, textless, clean background`
    const { w, h } = RATIO[ratio]
    const seed = Math.floor(Math.random() * 1_000_000_000)

    const url =
      `/api/image?prompt=${encodeURIComponent(fullPrompt)}` +
      `&width=${w}&height=${h}&seed=${seed}`

    /* Tunggu gambar benar-benar load */
    const img = new Image()
    img.src = url
    img.onload = () => {
      clearInterval(interval)
      setImageUrl(url)
      setLoading(false)
      setStatusText("")
      saveHistory({ prompt, imageUrl: url, style, ratio })
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
          <Sparkles />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Image Generator</h1>
          <p className="text-muted-foreground">
            AI image generation with real-time feedback
          </p>
        </div>
      </div>

      {/* CONTROLS */}
      <Card>
        <CardHeader>
          <CardTitle>Prompt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Contoh: chicken and pig inside cozy house"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          {/* STYLE */}
          <div className="flex gap-2 flex-wrap">
            {(["realistic", "anime", "illustration", "logo"] as StyleType[]).map(
              (s) => (
                <Button
                  key={s}
                  variant={style === s ? "default" : "outline"}
                  onClick={() => setStyle(s)}
                >
                  {s}
                </Button>
              )
            )}
          </div>

          {/* RATIO */}
          <div className="flex gap-2">
            {(["1:1", "16:9", "9:16"] as RatioType[]).map((r) => (
              <Button
                key={r}
                variant={ratio === r ? "default" : "outline"}
                onClick={() => setRatio(r)}
              >
                {r}
              </Button>
            ))}
          </div>

          <Button onClick={generateImage} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {statusText} {eta > 0 && `(${eta}s)`}
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Image
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* RESULT */}
      {imageUrl && (
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Result</CardTitle>
            <Button asChild variant="outline">
              <a href={imageUrl} download target="_blank">
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
          </CardHeader>
          <CardContent>
            <img
              src={imageUrl}
              alt="AI Result"
              className="w-full rounded-xl border object-cover"
            />
          </CardContent>
        </Card>
      )}

      {/* HISTORY */}
      {history.length > 0 && (
        <Card>
          <CardHeader
            className="flex cursor-pointer items-center justify-between"
            onClick={() => setHistoryOpen(!historyOpen)}
          >
            <CardTitle>History</CardTitle>
            {historyOpen ? <ChevronUp /> : <ChevronDown />}
          </CardHeader>

          {historyOpen && (
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {history.map((h, i) => (
                  <div
                    key={i}
                    className="rounded-lg border p-2 space-y-2"
                  >
                    <img
                      src={h.imageUrl}
                      alt={h.prompt}
                      className="h-40 w-full rounded-md object-cover"
                    />
                    <p className="text-xs line-clamp-2 text-muted-foreground">
                      {h.prompt}
                    </p>
                    <Button asChild size="sm" variant="outline" className="w-full">
                      <a href={h.imageUrl} download>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}