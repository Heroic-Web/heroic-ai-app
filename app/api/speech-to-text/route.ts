import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    {
      error: "STT_SERVER_DISABLED",
      message: "Server STT disabled. Use browser speech recognition.",
    },
    { status: 400 }
  )
}