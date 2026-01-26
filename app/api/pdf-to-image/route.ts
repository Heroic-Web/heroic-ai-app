import { NextResponse } from "next/server"
import { writeFile, mkdir, rm, readFile } from "fs/promises"
import path from "path"
import crypto from "crypto"
import os from "os"

export const runtime = "nodejs"

export async function POST(req: Request) {
  let baseDir: string | null = null

  try {
    /* =============================
     * 1️⃣ PARSE FORM DATA
     * ============================= */
    const formData = await req.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, images: [] })
    }

    const qualityRaw = String(formData.get("quality") || "high")
    const quality =
      qualityRaw === "medium" || qualityRaw === "low" ? qualityRaw : "high"

    const scale = quality === "high" ? 2 : quality === "medium" ? 1.5 : 1

    /* =============================
     * 2️⃣ TEMP DIR
     * ============================= */
    baseDir = path.join(os.tmpdir(), "pdf-to-image", crypto.randomUUID())
    await mkdir(baseDir, { recursive: true })

    const pdfPath = path.join(baseDir, "input.pdf")
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(pdfPath, buffer)

    /* =============================
     * 3️⃣ LAUNCH PUPPETEER
     * ============================= */
    const puppeteer = (await import("puppeteer")).default

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    const page = await browser.newPage()

    /* =============================
     * 4️⃣ LOAD PDF.JS (LOCAL)
     * ============================= */
    const pdfJsPath = require.resolve("pdfjs-dist/build/pdf.min.js")
    await page.addScriptTag({ path: pdfJsPath })

    const pdfBase64 = buffer.toString("base64")

    /* =============================
     * 5️⃣ RENDER PDF → IMAGE (BROWSER CONTEXT)
     * ============================= */
    const images = await page.evaluate(
      async (base64: string, scaleValue: number) => {
        const pdfData = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
        const pdf = await (window as any).pdfjsLib.getDocument({ data: pdfData }).promise

        const results: { name: string; base64: string }[] = []

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale: scaleValue })
          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")!

          canvas.width = viewport.width
          canvas.height = viewport.height

          await page.render({ canvasContext: ctx, viewport }).promise
          results.push({
            name: `page-${String(i).padStart(3, "0")}.png`,
            base64: canvas.toDataURL("image/png").split(",")[1],
          })
        }

        return results
      },
      pdfBase64,
      scale
    )

    await browser.close()

    /* =============================
     * 6️⃣ RESPONSE
     * ============================= */
    return NextResponse.json({
      success: true,
      pageCount: images.length,
      images,
    })
  } catch (err) {
    console.error("PDF TO IMAGE ERROR:", err)
    return NextResponse.json({
      success: false,
      images: [],
    })
  } finally {
    if (baseDir) {
      await rm(baseDir, { recursive: true, force: true }).catch(() => {})
    }
  }
}