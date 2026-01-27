import { NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import { hasSpeechToTextAccess } from "@/lib/subscription"

export const runtime = "nodejs"

export async function GET() {
  try {
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ user: null, hasAccess: false })
    }

    const hasAccess = await hasSpeechToTextAccess(user.id)

    return NextResponse.json({
      user: { id: user.id },
      hasAccess,
    })
  } catch (err) {
    console.error("ACCESS API ERROR:", err)

    // jangan lempar error keras ke UI
    return NextResponse.json({ user: null, hasAccess: false })
  }
}
