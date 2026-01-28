"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SpeechToTextClient from "./speech-to-text.client"

type GateState = "checking" | "allowed" | "login" | "pay"

export default function SpeechToTextPage() {
  const router = useRouter()
  const [state, setState] = useState<GateState>("checking")

  useEffect(() => {
    let alive = true

    async function checkAccess() {
      try {
        const res = await fetch("/api/speech-to-text/access", {
          cache: "no-store",
        })

        const data = await res.json()

        if (!alive) return

        if (!data.user) {
          setState("login")
          return
        }

        if (!data.hasAccess) {
          setState("pay")
          return
        }

        setState("allowed")
      } catch (err) {
        console.error("ACCESS CHECK ERROR:", err)
        setState("login")
      }
    }

    checkAccess()

    return () => {
      alive = false
    }
  }, [])

  // 🔁 redirect HARUS di effect
  useEffect(() => {
    if (state === "login") {
      router.replace("/login")
    }
    if (state === "pay") {
      router.replace("/pricing/speech-to-text?alert=pay_required")
    }
  }, [state, router])

  // ⏳ loading
  if (state === "checking") {
    return <div className="p-6">Memverifikasi akses…</div>
  }

  // ✅ akses valid → TAMPILKAN HALAMAN
  if (state === "allowed") {
    return <SpeechToTextClient />
  }

  // redirect sedang berlangsung
  return null
}
