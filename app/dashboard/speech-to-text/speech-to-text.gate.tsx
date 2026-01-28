"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SpeechToTextClient from "./speech-to-text.client"

type State = "checking" | "allowed" | "login" | "pay"

export default function SpeechToTextGate() {
  const router = useRouter()
  const [state, setState] = useState<State>("checking")

  useEffect(() => {
    let active = true

    async function run() {
      try {
        const res = await fetch("/api/speech-to-text/access", {
          cache: "no-store",
        })
        const data = await res.json()

        if (!active) return

        if (!data.user) {
          setState("login")
          return
        }

        if (!data.hasAccess) {
          setState("pay")
          return
        }

        setState("allowed")
      } catch {
        setState("login")
      }
    }

    run()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (state === "login") {
      router.replace("/login")
    }
    if (state === "pay") {
      router.replace("/pricing/speech-to-text?alert=pay_required")
    }
  }, [state, router])

  if (state === "checking") {
    return <div className="p-6">Memverifikasi akses...</div>
  }

  if (state === "allowed") {
    return <SpeechToTextClient />
  }

  return null
}
