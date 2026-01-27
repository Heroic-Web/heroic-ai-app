"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SpeechToTextClient from "./speech-to-text.client"

type GateState = "checking" | "allowed" | "login" | "pay_required"

export default function SpeechToTextGate() {
  const router = useRouter()
  const [state, setState] = useState<GateState>("checking")

  useEffect(() => {
    let mounted = true

    async function checkAccess() {
      try {
        const res = await fetch("/api/speech-to-text/access", {
          cache: "no-store",
        })

        const data = await res.json()

        if (!mounted) return

        if (!data.user) {
          setState("login")
          return
        }

        if (!data.hasAccess) {
          setState("pay_required")
          return
        }

        // ✅ AKSES VALID
        setState("allowed")
      } catch (err) {
        console.error("ACCESS CHECK FAILED:", err)
        setState("login")
      }
    }

    checkAccess()

    return () => {
      mounted = false
    }
  }, [])

  /* ===============================
   * REDIRECT EFFECT (AMAN)
   * =============================== */
  useEffect(() => {
    if (state === "login") {
      router.replace("/login")
    }

    if (state === "pay_required") {
      router.replace("/pricing/speech-to-text?alert=pay_required")
    }
  }, [state, router])

  /* ===============================
   * RENDER
   * =============================== */

  if (state === "checking") {
    return <div className="p-6">Memverifikasi akses...</div>
  }

  if (state === "allowed") {
    return <SpeechToTextClient />
  }

  // redirect sedang berjalan
  return null
}
