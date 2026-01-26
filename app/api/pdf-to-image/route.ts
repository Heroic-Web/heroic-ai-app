import { NextResponse } from "next/server"
import { mkdir, writeFile, rm, readFile } from "fs/promises"
import path from "path"
import crypto from "crypto"
import os from "os"
import { createCanvas } from "canvas"
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs"

export const runtime = "nodejs"

// ⛑️ worker dimatikan dengan cara aman
pdfjs.GlobalWorkerOptions.workerSrc = ""

type ImageResult = {
  name: string
  base64: string
}

// ===============================
// CanvasFactory untuk Node
// ===============================
class NodeCanvasFactory {
  create(width: number, height: number) {
    const canvas = createCanvas(width, height)
    const context = canvas.getContext("2d")
    if (!context) {
      throw new Error("Failed to get canvas context")
    }
    return { canvas, context }
  }
}

export async function POST(req: Request) {
  let workDir: string | null = null

  try {
    // ===============================
    // 1️⃣ FORM DATA
    // ===============================
    const formData = await req.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "PDF file is required" },
        { status: 400 }
      )
    }

    const qualityRaw = String(formData.get("quality"))
    const quality =
      qualityRaw === "high" ||
      qualityRaw === "medium" ||
      qualityRaw === "low"
        ? qualityRaw
        : "high"

    const scale =
      quality === "high" ? 3 :
      quality === "medium" ? 2 :
      1.2

    // ===============================
    // 2️⃣ TEMP DIR
    // ===============================
    workDir = path.join(os.tmpdir(), "pdf-to-image", crypto.randomUUID())
    await mkdir(workDir, { recursive: true })

    const pdfPath = path.join(workDir, "input.pdf")
    await writeFile(pdfPath, Buffer.from(await file.arrayBuffer()))

    // ===============================
    // 3️⃣ LOAD PDF
    // ===============================
    const pdfBuffer = await readFile(pdfPath)
    const pdf = await pdfjs.getDocument({ data: pdfBuffer }).promise

    const images: ImageResult[] = []
    const canvasFactory = new NodeCanvasFactory()

    // ===============================
    // 4️⃣ RENDER TIAP HALAMAN
    // ===============================
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale })

      const { canvas } = canvasFactory.create(
        Math.floor(viewport.width),
        Math.floor(viewport.height)
      )

      // 🔥 INI KUNCINYA — 1 BARIS SAJA
      await (page.render as any)({
        viewport,
        canvasFactory,
      }).promise

      images.push({
        name: `page-${String(pageNum).padStart(3, "0")}.png`,
        base64: canvas.toBuffer("image/png").toString("base64"),
      })
    }

    // ===============================
    // 5️⃣ RESPONSE
    // ===============================
    return NextResponse.json({
      success: true,
      pageCount: images.length,
      images,
    })

  } catch (err: any) {
    console.error("PDF TO IMAGE ERROR:", err)
    return NextResponse.json(
      { success: false, message: err?.message || "PDF conversion failed" },
      { status: 500 }
    )
  } finally {
    if (workDir) {
      await rm(workDir, { recursive: true, force: true }).catch(() => {})
    }
  }
}