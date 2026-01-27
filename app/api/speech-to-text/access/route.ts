import { NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import { hasSpeechToTextAccess } from "@/lib/subscription"

export const runtime = "nodejs"

export async function GET() {
  try {
    const user = await getUser()

    // belum login → BUKAN error
    if (!user) {
      return NextResponse.json(
        { user: null, hasAccess: false },
        { status: 200 }
      )
    }

    const hasAccess = await hasSpeechToTextAccess(user.id)

    return NextResponse.json(
      { user: { id: user.id }, hasAccess },
      { status: 200 }
    )
  } catch (err) {
    console.error("ACCESS CHECK ERROR:", err)

    // ❗ jangan lempar 500 ke UI
    return NextResponse.json(
      { user: null, hasAccess: false },
      { status: 200 }
    )
  }
}
