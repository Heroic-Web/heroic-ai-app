"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"

export default function SpeechToTextPricingPage() {
  const params = useSearchParams()
  const router = useRouter()
  const alert = params.get("alert")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function pay() {
    setLoading(true)
    setError(null)

    try {
        const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        })

        const text = await res.text()
        let data: any = {}

        try {
        data = JSON.parse(text)
        } catch {}

        // ❗ jangan cuma res.ok
        if (!res.ok || !data.redirectUrl) {
        throw new Error("Payment failed")
        }

        window.location.href = data.redirectUrl
    } catch (err) {
        console.error(err)
        setError("Gagal memulai pembayaran")
    } finally {
        setLoading(false)
    }
    }

  return (
    <div className="mx-auto max-w-xl p-6">
      {/* ALERT */}
      {alert === "pay_required" && (
        <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">
          ⚠️ Untuk menggunakan tools ini, silakan lakukan pembayaran terlebih
          dahulu.
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">
          ❌ {error}
        </div>
      )}

      <h1 className="text-2xl font-bold">
        🎙️ Speech to Text (PRO)
      </h1>

      <p className="mt-2 text-muted-foreground">
        Transkripsikan audio menjadi teks dengan cepat, akurat, dan bisa langsung
        diedit.
      </p>

      <ul className="mt-4 list-disc space-y-1 pl-5">
        <li>Realtime transcription audio</li>
        <li>Editor teks bawaan</li>
        <li>Copy & download TXT</li>
        <li>Unlimited usage (PRO)</li>
      </ul>

      <button
        onClick={pay}
        disabled={loading}
        className="mt-6 w-full rounded-md bg-black px-6 py-3 text-white disabled:opacity-60"
      >
        {loading ? "Memproses pembayaran..." : "Bayar Sekarang"}
      </button>

      <button
        onClick={() => router.push("/dashboard")}
        className="mt-3 w-full rounded-md border px-6 py-3"
      >
        Kembali ke Dashboard
      </button>
    </div>
  )
}