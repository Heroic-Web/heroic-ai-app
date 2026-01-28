"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SpeechToTextClient from "./speech-to-text.client"
import { useAuth } from "@/lib/auth-context"

type GateState = "checking" | "allowed" | "login" | "pay"

export default function SpeechToTextPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [state, setState] = useState<GateState>("checking")

  /* ============================
   * 1️⃣ CEK LOGIN (CLIENT SIDE)
   * ============================ */
  useEffect(() => {
    if (isLoading) return

    if (!user) {
      setState("login")
      return
    }

    // 🔓 SEMENTARA: anggap user sudah punya akses
    // nanti bisa disambungkan ke DB / payment
    setState("allowed")
  }, [user, isLoading])

  /* ============================
   * 2️⃣ REDIRECT (STABIL)
   * ============================ */
  useEffect(() => {
    if (state === "login") {
      router.replace("/login")
    }

    if (state === "pay") {
      router.replace("/pricing/speech-to-text?alert=pay_required")
    }
  }, [state, router])

  /* ============================
   * 3️⃣ RENDER
   * ============================ */

  if (state === "checking" || isLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Memverifikasi akses…
      </div>
    )
  }

  if (state === "allowed") {
    return <SpeechToTextClient />
  }

  return null
}
