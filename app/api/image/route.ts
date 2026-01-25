import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const prompt = searchParams.get("prompt")
  const width = searchParams.get("width") ?? "1024"
  const height = searchParams.get("height") ?? "1024"
  const seed = searchParams.get("seed") ?? Date.now().toString()

  if (!prompt) {
    return NextResponse.json(
      { error: "Prompt is required" },
      { status: 400 }
    )
  }

  const targetUrl =
    `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
    `?width=${width}&height=${height}&seed=${seed}`

  const res = await fetch(targetUrl)

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    )
  }

  const buffer = await res.arrayBuffer()

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store",
    },
  })
}