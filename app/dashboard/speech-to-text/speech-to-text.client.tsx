"use client"

import { useState, useRef, useEffect } from "react"
import {
  Mic,
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
  const [finalText, setFinalText] = useState("")
  const [interimText, setInterimText] = useState("")
  const [recording, setRecording] = useState(false)
  const [paused, setPaused] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [language, setLanguage] = useState<"id-ID" | "en-US">("id-ID")
  const [withTimestamp, setWithTimestamp] = useState(false)
  const [autoPunctuate, setAutoPunctuate] = useState(true)

  const recognitionRef = useRef<any>(null)
  const finalIndexRef = useRef(0)
  const manualStopRef = useRef(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  /* =====================
     AUTO PUNCTUATION
  ====================== */
  const applyPunctuation = (text: string) => {
    if (!autoPunctuate) return text

    let t = text.trim()
    if (!/[.!?]$/.test(t)) t += "."
    return t + " "
  }

  /* =====================
     INIT RECOGNITION
  ====================== */
  const initRecognition = () => {
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
      let finalChunk = ""

      for (let i = finalIndexRef.current; i < event.results.length; i++) {
        const res = event.results[i]
        const transcript = res[0].transcript.trim()

        if (res.isFinal) {
          const stamp = withTimestamp
            ? `[${new Date().toLocaleTimeString()}] `
            : ""

          finalChunk += stamp + applyPunctuation(transcript)
          finalIndexRef.current++
        } else {
          interim = transcript
        }
      }

      if (finalChunk) {
        setFinalText((prev) => prev + finalChunk)
      }

      setInterimText(interim)
    }

    recognition.onerror = () => {
      setError("Terjadi error pada speech recognition")
      setRecording(false)
    }

    recognition.onend = () => {
      // 🔥 AUTO RESTART kalau bukan stop manual
      if (!manualStopRef.current && !paused) {
        recognition.start()
      } else {
        setRecording(false)
      }
    }

    recognitionRef.current = recognition
    return recognition
  }

  /* =====================
     MIC CONTROL
  ====================== */
  const startMic = async () => {
    setError(null)
    manualStopRef.current = false
    finalIndexRef.current = 0

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      setError(
        "Izin mikrofon diblokir browser. Aktifkan mic via ikon 🔒 di address bar."
      )
      return
    }

    const recognition = initRecognition()
    recognition?.start()
    setRecording(true)
    setPaused(false)
  }

  const pauseMic = () => {
    setPaused(true)
    recognitionRef.current?.stop()
  }

  const resumeMic = () => {
    setPaused(false)
    recognitionRef.current?.start()
    setRecording(true)
  }

  const stopMic = () => {
    manualStopRef.current = true
    recognitionRef.current?.stop()
    setRecording(false)
    setPaused(false)
    setInterimText("")
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
    alert("Hasil disimpan ke dashboard")
  }

  /* =====================
     EXPORT PDF
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
     AUTO SCROLL
  ====================== */
  useEffect(() => {
    textareaRef.current?.scrollTo({
      top: textareaRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [finalText, interimText])

  const wordCount = finalText.trim().split(/\s+/).filter(Boolean).length

  /* =====================
     UI
  ====================== */
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Mic className="text-orange-500" /> Speech to Text (PRO)
      </h1>

      {/* SETTINGS */}
      <div className="flex gap-3 items-center text-sm flex-wrap">
        <Globe />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as any)}
          className="border px-2 py-1 rounded"
        >
          <option value="id-ID">Indonesia</option>
          <option value="en-US">English</option>
        </select>

        <label className="flex gap-1">
          <input
            type="checkbox"
            checked={withTimestamp}
            onChange={() => setWithTimestamp(!withTimestamp)}
          />
          Timestamp
        </label>

        <label className="flex gap-1">
          <input
            type="checkbox"
            checked={autoPunctuate}
            onChange={() => setAutoPunctuate(!autoPunctuate)}
          />
          Auto punctuation
        </label>

        <span className="ml-auto text-muted-foreground">
          {wordCount} words
        </span>
      </div>

      {/* MIC */}
      <div className="flex gap-2">
        {!recording && !paused && (
          <button onClick={startMic} className="bg-black text-white px-4 py-2 rounded">
            🎙️ Mulai
          </button>
        )}
        {recording && (
          <button onClick={pauseMic} className="bg-yellow-500 text-white px-4 py-2 rounded">
            <Pause className="w-4 h-4 inline" /> Pause
          </button>
        )}
        {paused && (
          <button onClick={resumeMic} className="bg-green-600 text-white px-4 py-2 rounded">
            <Play className="w-4 h-4 inline" /> Resume
          </button>
        )}
        <button onClick={stopMic} className="bg-red-600 text-white px-4 py-2 rounded">
          ⏹️ Stop
        </button>
      </div>

      {recording && (
        <div className="flex items-center gap-2 text-orange-500">
          <Waves className="animate-pulse" /> Recording...
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {/* TEXT */}
      <textarea
        ref={textareaRef}
        value={finalText + (recording ? " " + interimText : "")}
        readOnly
        className="w-full min-h-[260px] border rounded p-3"
      />

      {/* ACTIONS */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => navigator.clipboard.writeText(finalText)} className="border px-3 py-2 rounded">
          <Copy className="w-4 h-4 inline" /> Copy
        </button>
        <button onClick={exportPDF} className="border px-3 py-2 rounded">
          <FileDown className="w-4 h-4 inline" /> PDF
        </button>
        <button onClick={saveHistory} className="border px-3 py-2 rounded">
          <Save className="w-4 h-4 inline" /> Save
        </button>
        <button onClick={stopMic} className="ml-auto border px-3 py-2 rounded text-red-500">
          <Trash2 className="w-4 h-4 inline" /> Reset
        </button>
      </div>
    </div>
  )
}
