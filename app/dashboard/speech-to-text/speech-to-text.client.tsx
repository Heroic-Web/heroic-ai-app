"use client"

import { useEffect, useRef, useState } from "react"
import { Mic, Copy, Trash2, FileText } from "lucide-react"

declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
}

type PermissionState = "unknown" | "granted" | "denied"

export default function SpeechToTextClient() {
  const recognitionRef = useRef<any>(null)
  const startedRef = useRef(false)

  const [finalText, setFinalText] = useState("")
  const [interimText, setInterimText] = useState("")
  const [recording, setRecording] = useState(false)

  const [permission, setPermission] = useState<PermissionState>("unknown")
  const [error, setError] = useState<string | null>(null)

  /* ============================
     INIT SPEECH RECOGNITION
  ============================ */
  useEffect(() => {
    const SR =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SR) {
      setError("Browser tidak mendukung Speech Recognition.")
      return
    }

    const recognition = new SR()
    recognition.lang = "id-ID"
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event: any) => {
      let interim = ""
      let final = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript
        if (event.results[i].isFinal) final += t + " "
        else interim += t
      }

      if (final) setFinalText((p) => p + final)
      setInterimText(interim)
    }

    recognition.onerror = () => {
      setRecording(false)
      startedRef.current = false
    }

    recognition.onend = () => {
      setRecording(false)
      startedRef.current = false
      setInterimText("")
    }

    recognitionRef.current = recognition
  }, [])

  /* ============================
     CHECK PERMISSION (SAFE)
  ============================ */
  async function checkPermission() {
    try {
      const res = await navigator.mediaDevices.getUserMedia({ audio: true })
      res.getTracks().forEach((t) => t.stop())
      setPermission("granted")
      return true
    } catch (err: any) {
      setPermission("denied")
      return false
    }
  }

  /* ============================
     START MIC (USER CLICK ONLY)
  ============================ */
  async function startMic() {
    if (recording || startedRef.current) return
    setError(null)

    const ok = await checkPermission()

    if (!ok) {
      setError(
        "Izin mikrofon diblokir oleh browser.\n\n" +
        "Solusi:\n" +
        "• Tap ikon 🔒 di address bar\n" +
        "• Pilih Microphone → Allow\n" +
        "• Refresh halaman\n"
      )
      return
    }

    try {
      startedRef.current = true
      recognitionRef.current.start()
      setRecording(true)
    } catch {
      startedRef.current = false
    }
  }

  function stopMic() {
    recognitionRef.current?.stop()
    startedRef.current = false
    setRecording(false)
    setInterimText("")
  }

  /* ============================
     UTIL
  ============================ */
  function downloadTxt() {
    if (!finalText) return
    const blob = new Blob([finalText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "speech-to-text.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  function copyText() {
    navigator.clipboard.writeText(finalText)
    alert("Teks disalin")
  }

  function resetAll() {
    stopMic()
    setFinalText("")
    setInterimText("")
    setError(null)
  }

  /* ============================
     UI
  ============================ */
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold flex gap-2 items-center">
        <Mic className="text-orange-500" />
        Speech to Text (PRO)
      </h1>

      <div className="flex gap-3">
        {!recording ? (
          <button
            onClick={startMic}
            className="bg-black text-white px-4 py-2 rounded-md"
          >
            🎙️ Mulai Bicara
          </button>
        ) : (
          <button
            onClick={stopMic}
            className="bg-red-600 text-white px-4 py-2 rounded-md"
          >
            ⏹️ Hentikan
          </button>
        )}

        {finalText && (
          <button onClick={downloadTxt} className="border px-3 rounded-md">
            <FileText className="inline h-4 w-4" /> Download
          </button>
        )}

        <button onClick={copyText} className="border px-3 rounded-md">
          <Copy className="inline h-4 w-4" /> Copy
        </button>

        <button onClick={resetAll} className="border px-3 rounded-md text-red-500">
          <Trash2 className="inline h-4 w-4" /> Reset
        </button>
      </div>

      {error && (
        <pre className="whitespace-pre-wrap rounded bg-red-100 p-3 text-red-700 text-sm">
          {error}
        </pre>
      )}

      <textarea
        readOnly
        value={finalText + (recording ? interimText : "")}
        className="w-full min-h-[220px] border rounded-md p-3"
        placeholder="Hasil transkripsi muncul di sini…"
      />
    </div>
  )
}
