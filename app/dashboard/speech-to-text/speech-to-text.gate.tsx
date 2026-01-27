"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SpeechToTextClient from "./speech-to-text.client"

type GateState = "loading" | "allowed" | "login" | "pay_required" | "error"

export default function SpeechToTextGate() {
  const router = useRouter()
  const [state, setState] = useState<GateState>("loading")

  useEffect(() => {
    async function checkAccess() {
      try {
        const res = await fetch("/api/speech-to-text/access")
        const data = await res.json()

        if (!res.ok) throw new Error()

        if (!data.user) {
          setState("login")
        } else if (!data.hasAccess) {
          setState("pay_required")
        } else {
          setState("allowed")
        }
      } catch {
        setState("error")
      }
    }

    checkAccess()
  }, [])

  // ⛔ belum login
  if (state === "login") {
    router.replace("/login")
    return null
  }

  // ⛔ belum bayar
  if (state === "pay_required") {
    router.replace("/pricing/speech-to-text?alert=pay_required")
    return null
  }

  // ❌ error
  if (state === "error") {
    return <div className="p-6 text-red-600">Gagal memverifikasi akses</div>
  }

  // ⏳ loading
  if (state === "loading") {
    return <div className="p-6">Memverifikasi akses...</div>
  }

  // ✅ akses valid
  return <SpeechToTextClient />
}