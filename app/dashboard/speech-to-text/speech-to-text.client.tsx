"use client"

import { useState, useRef, useEffect } from "react"
import {
  Mic,
  Upload,
  Copy,
  Trash2,
  FileText,
  Pause,
  Play,
  Globe,
  Save,
  Waves,
  FileDown,
} from "lucide-react"

declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
}

/* =====================
   TYPES
===================== */
type HistoryItem = {
  id: string
  text: string
  language: string
  createdAt: string
  words: number
}

export default function SpeechToTextClient() {
  /* =====================
     STATE
  ====================== */
  const [file, setFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const [finalText, setFinalText] = useState("")
  const [interimText, setInterimText] = useState("")

  const [recording, setRecording] = useState(false)
  const [paused, setPaused] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [language, setLanguage] = useState<"id-ID" | "en-US">("id-ID")
  const [withTimestamp, setWithTimestamp] = useState(false)
  const [autoPunctuate, setAutoPunctuate] = useState(true)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const recognitionRef = useRef<any>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  /* =====================
     FILE UPLOAD (TETAP)
  ====================== */
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setAudioUrl(URL.createObjectURL(f))
    setError("Upload audio memerlukan API. Gunakan Mic Realtime.")
  }

  /* =====================
     AUTO PUNCTUATION (SIMPLE)
  ====================== */
  const applyPunctuation = (text: string) => {
    if (!autoPunctuate) return text

    let t = text.trim()
    if (!t.endsWith(".") && !t.endsWith("?") && !t.endsWith("!")) {
      t += "."
    }
    t = t.replace(/\s+/g, " ")
    return t
  }

  /* =====================
     INIT RECOGNITION
  ====================== */
  const getRecognition = () => {
    if (recognitionRef.current) return recognitionRef.current

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setError("Browser tidak mendukung Speech Recognition")
      return null
    }

    const recognition = new SR()
    recognition.lang = language
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event: any) => {
      let interim = ""
      let final = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          const stamp = withTimestamp
            ? `[${new Date().toLocaleTimeString()}] `
            : ""
          final += stamp + applyPunctuation(t) + " "
        } else {
          interim += t
        }
      }

      if (final) {
        setFinalText((prev) => prev + final)
      }

      setInterimText(interim)
    }

    recognition.onerror = () => {
      setError("Terjadi error pada speech recognition")
      setRecording(false)
      setPaused(false)
    }

    recognition.onend = () => {
      if (!paused) setRecording(false)
    }

    recognitionRef.current = recognition
    return recognition
  }

  /* =====================
     MIC CONTROL
  ====================== */
  const startMicTranscription = async () => {
    setError(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((t) => t.stop())

      const recognition = getRecognition()
      if (!recognition) return

      recognition.lang = language
      recognition.start()

      setRecording(true)
      setPaused(false)
    } catch {
      setError(
        "Izin mikrofon diblokir browser. Aktifkan mic melalui ikon 🔒 di address bar."
      )
    }
  }

  const stopMicTranscription = () => {
    recognitionRef.current?.stop()
    setRecording(false)
    setPaused(false)
    setInterimText("")
  }

  const pauseMic = () => {
    recognitionRef.current?.stop()
    setPaused(true)
    setRecording(false)
  }

  const resumeMic = () => {
    startMicTranscription()
  }

  /* =====================
     SAVE HISTORY
  ====================== */
  const saveHistory = () => {
    if (!finalText) return

    const history: HistoryItem[] =
      JSON.parse(localStorage.getItem("stt_history") || "[]")

    history.unshift({
      id: crypto.randomUUID(),
      text: finalText,
      language,
      createdAt: new Date().toISOString(),
      words: finalText.trim().split(/\s+/).length,
    })

    localStorage.setItem("stt_history", JSON.stringify(history.slice(0, 50)))
    alert("Hasil berhasil disimpan ke dashboard")
  }

  /* =====================
     EXPORT PDF (PRINT)
  ====================== */
  const exportPDF = () => {
    const win = window.open("", "_blank")
    if (!win) return

    win.document.write(`
      <html>
        <head>
          <title>Speech to Text</title>
          <style>
            body { font-family: sans-serif; padding: 32px; }
            pre { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <h1>Speech to Text</h1>
          <pre>${finalText}</pre>
        </body>
      </html>
    `)
    win.document.close()
    win.print()
  }

  /* =====================
     UTILITIES
  ====================== */
  const copyText = async () => {
    if (!finalText) return
    await navigator.clipboard.writeText(finalText)
    alert("Text berhasil disalin")
  }

  const downloadTxt = () => {
    const blob = new Blob([finalText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "speech-to-text.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const resetAll = () => {
    stopMicTranscription()
    setFinalText("")
    setInterimText("")
    setFile(null)
    setAudioUrl(null)
    setError(null)
  }

  /* =====================
     AUTO SCROLL
  ====================== */
  useEffect(() => {
    textareaRef.current?.scrollTo({
      top: textareaRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [finalText, interimText])

  const wordCount = finalText.trim().split(/\s+/).filter(Boolean).length
  const charCount = finalText.length

  /* =====================
     UI
  ====================== */
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <h1 className="flex items-center gap-2 text-3xl font-bold">
        <Mic className="h-7 w-7 text-orange-500" />
        Speech to Text (PRO)
      </h1>

      {/* SETTINGS */}
      <div className="flex flex-wrap gap-3 items-center text-sm">
        <Globe className="h-4 w-4" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as any)}
          className="border rounded px-2 py-1"
        >
          <option value="id-ID">Indonesia</option>
          <option value="en-US">English</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={withTimestamp}
            onChange={() => setWithTimestamp(!withTimestamp)}
          />
          Timestamp
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={autoPunctuate}
            onChange={() => setAutoPunctuate(!autoPunctuate)}
          />
          Auto punctuation
        </label>

        <span className="ml-auto text-muted-foreground">
          {wordCount} words · {charCount} chars
        </span>
      </div>

      {/* MIC CONTROLS */}
      <div className="flex gap-2">
        {!recording && !paused && (
          <button
            onClick={startMicTranscription}
            className="bg-black text-white px-4 py-2 rounded-md"
          >
            🎙️ Mulai
          </button>
        )}

        {recording && (
          <button
            onClick={pauseMic}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
          >
            <Pause className="inline h-4 w-4" /> Pause
          </button>
        )}

        {paused && (
          <button
            onClick={resumeMic}
            className="bg-green-600 text-white px-4 py-2 rounded-md"
          >
            <Play className="inline h-4 w-4" /> Resume
          </button>
        )}

        <button
          onClick={stopMicTranscription}
          className="bg-red-600 text-white px-4 py-2 rounded-md"
        >
          ⏹️ Stop
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* WAVEFORM (VISUAL) */}
      {recording && (
        <div className="flex items-center gap-2 text-orange-500">
          <Waves className="animate-pulse" />
          Recording audio...
        </div>
      )}

      {/* EDITOR */}
      <textarea
        ref={textareaRef}
        value={finalText + (recording ? interimText : "")}
        readOnly
        className="min-h-[260px] w-full rounded-md border p-3"
        placeholder="Hasil transkripsi..."
      />

      {/* ACTIONS */}
      <div className="flex flex-wrap gap-2">
        <button onClick={copyText} className="border px-3 py-2 rounded-md">
          <Copy className="h-4 w-4 inline" /> Copy
        </button>
        <button onClick={downloadTxt} className="border px-3 py-2 rounded-md">
          <FileText className="h-4 w-4 inline" /> TXT
        </button>
        <button onClick={exportPDF} className="border px-3 py-2 rounded-md">
          <FileDown className="h-4 w-4 inline" /> PDF
        </button>
        <button onClick={saveHistory} className="border px-3 py-2 rounded-md">
          <Save className="h-4 w-4 inline" /> Save
        </button>
        <button
          onClick={resetAll}
          className="ml-auto border px-3 py-2 rounded-md text-red-500"
        >
          <Trash2 className="h-4 w-4 inline" /> Reset
        </button>
      </div>
    </div>
  )
}
