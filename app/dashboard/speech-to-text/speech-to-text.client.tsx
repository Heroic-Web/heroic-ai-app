"use client"

import { useState, useRef } from "react"
import {
  Mic,
  Upload,
  Copy,
  Trash2,
  FileText,
} from "lucide-react"

declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
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
  const [error, setError] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const recognitionRef = useRef<any>(null)

  /* =====================
     FILE UPLOAD (TETAP ADA)
  ====================== */
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return

    setFile(f)
    setAudioUrl(URL.createObjectURL(f))
    setError("Upload audio memerlukan API. Gunakan Mic Realtime di bawah.")
  }

  /* =====================
     🎙️ MIC REALTIME (ANTI DOUBLE)
  ====================== */
  const startMicTranscription = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setError("Browser tidak mendukung Speech Recognition")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = "id-ID"
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event: any) => {
      let interim = ""
      let final = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += transcript + " "
        } else {
          interim += transcript
        }
      }

      if (final) {
        setFinalText((prev) => (prev + final).trim())
      }

      setInterimText(interim)
    }

    recognition.onerror = () => {
      setError("Terjadi error pada speech recognition")
      setRecording(false)
    }

    recognition.start()
    recognitionRef.current = recognition
    setRecording(true)
    setError(null)
  }

  const stopMicTranscription = () => {
    recognitionRef.current?.stop()
    setRecording(false)
    setInterimText("")
  }

  /* =====================
     UTILITIES
  ====================== */
  const copyText = async () => {
    const text = finalText.trim()
    if (!text) return
    await navigator.clipboard.writeText(text)
    alert("Text berhasil disalin")
  }

  const downloadTxt = () => {
    if (!finalText) return
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
     UI
  ====================== */
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <Mic className="h-7 w-7 text-orange-500" />
          Speech to Text (PRO)
        </h1>
        <p className="mt-2 text-muted-foreground">
          Klik tombol mic, lalu <b>mulai berbicara dengan jelas</b>.
          Teks akan muncul otomatis saat kamu berbicara.
        </p>
      </div>

      {/* UPLOAD */}
      <div className="rounded-xl border p-6 space-y-4">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 text-center">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="font-medium">Upload Audio File</p>
          <p className="text-xs text-muted-foreground">
            MP3, WAV, M4A (perlu API)
          </p>
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={onFileChange}
          />
        </label>

        {audioUrl && (
          <audio ref={audioRef} controls src={audioUrl} className="w-full" />
        )}

        {/* MIC BUTTON */}
        <div className="flex gap-2">
          {!recording ? (
            <button
              onClick={startMicTranscription}
              className="rounded-md bg-black px-4 py-2 text-white"
            >
              🎙️ Mulai Bicara
            </button>
          ) : (
            <button
              onClick={stopMicTranscription}
              className="rounded-md bg-red-600 px-4 py-2 text-white"
            >
              ⏹️ Selesai Bicara
            </button>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          💡 Silahkan klik tombol mic untuk mulai berbicara.
        </p>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {/* EDITOR */}
      <div className="rounded-xl border p-6 space-y-4">
        <textarea
          value={finalText + (recording ? " " + interimText : "")}
          readOnly
          className="min-h-[260px] w-full rounded-md border p-3"
          placeholder="Hasil transkripsi akan muncul di sini..."
        />

        <div className="flex gap-2">
          <button
            onClick={copyText}
            className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
          >
            <Copy className="h-4 w-4" />
            Copy
          </button>

          <button
            onClick={downloadTxt}
            className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
          >
            <FileText className="h-4 w-4" />
            Download TXT
          </button>

          <button
            onClick={resetAll}
            className="ml-auto flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-red-500"
          >
            <Trash2 className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
