"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import SpeechToTextClient from "./speech-to-text.client"

type GateState = "checking" | "allowed" | "login" | "pay"

export default function SpeechToTextPage() {
  const router = useRouter()
  const pathname = usePathname()

  const [state, setState] = useState<GateState>("checking")
  const redirected = useRef(false) // ⛔ cegah redirect berulang

  /* ============================
   * 1️⃣ CEK AKSES (API)
   * ============================ */
  useEffect(() => {
    let alive = true

    async function checkAccess() {
      try {
        const res = await fetch("/api/speech-to-text/access", {
          cache: "no-store",
        })

        const data = await res.json()

        if (!alive) return

        if (!data?.user) {
          setState("login")
          return
        }

        if (!data?.hasAccess) {
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

  /* ============================
   * 2️⃣ REDIRECT (AMAN & TERKONTROL)
   * ============================ */
  useEffect(() => {
    if (redirected.current) return

    // belum login
    if (state === "login" && pathname !== "/login") {
      redirected.current = true
      router.replace("/login")
      return
    }

    // belum bayar
    if (
      state === "pay" &&
      !pathname.startsWith("/pricing/speech-to-text")
    ) {
      redirected.current = true
      router.replace("/pricing/speech-to-text?alert=pay_required")
      return
    }
  }, [state, pathname, router])

  /* ============================
   * 3️⃣ RENDER
   * ============================ */

  // loading
  if (state === "checking") {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Memverifikasi akses…
      </div>
    )
  }

  // ✅ AKSES VALID → HALAMAN STT MUNCUL
  if (state === "allowed") {
    return <SpeechToTextClient />
  }

  // redirect sedang berlangsung
  return null
}
