import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth"
import { hasSpeechToTextAccess } from "@/lib/subscription"
import SpeechToTextClient from "./speech-to-text.client"

export default async function SpeechToTextPage() {
  const user = await getUser()

  // ⛔ belum login
  if (!user) {
    redirect("/login")
  }

  // ⛔ belum bayar
  const hasAccess = await hasSpeechToTextAccess(user.id)
  if (!hasAccess) {
    redirect("/pricing/speech-to-text?alert=pay_required")
  }

  // ✅ akses valid
  return <SpeechToTextClient />
}