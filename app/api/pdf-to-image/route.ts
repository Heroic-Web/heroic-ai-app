import { NextResponse } from "next/server"
import { mkdir, rm } from "fs/promises"
import path from "path"
import crypto from "crypto"
import os from "os"

export const runtime = "nodejs"

export async function POST(req: Request) {
  let baseDir: string | null = null
  let browser: any = null

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
     * 2️⃣ TEMP DIRECTORY
     * ============================= */
    baseDir = path.join(os.tmpdir(), "pdf-to-image", crypto.randomUUID())
    await mkdir(baseDir, { recursive: true })

    const buffer = Buffer.from(await file.arrayBuffer())
    const pdfBase64 = buffer.toString("base64")

    /* =============================
     * 3️⃣ LAUNCH PUPPETEER (SAFE)
     * ============================= */
    const puppeteerModule = await import("puppeteer")
    const puppeteer = puppeteerModule.default

    browser = await puppeteer.launch({
      headless: true,

      // ✅ INI KUNCI STABILITAS
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH ||
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",

      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    })

    const page = await browser.newPage()

    /* =============================
     * 4️⃣ LOAD PDF.JS VIA CDN
     * (NO WORKER, NO ERROR)
     * ============================= */
    await page.addScriptTag({
      url: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
    })

    /* =============================
     * 5️⃣ RENDER PDF → IMAGE
     * ============================= */
    const images = await page.evaluate(
      async (base64: string, scaleValue: number) => {
        const pdfData = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
        const pdfjsLib = (window as any).pdfjsLib

        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise
        const results: { name: string; base64: string }[] = []

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale: scaleValue })

          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")!

          canvas.width = Math.floor(viewport.width)
          canvas.height = Math.floor(viewport.height)

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

    /* =============================
     * 6️⃣ RESPONSE
     * ============================= */
    return NextResponse.json({
      success: true,
      pageCount: images.length,
      images,
    })
  } catch (err) {
    console.error("PDF TO IMAGE ROUTE ERROR:", err)
    return NextResponse.json({
      success: false,
      images: [],
    })
  } finally {
    if (browser) {
      await browser.close().catch(() => {})
    }
    if (baseDir) {
      await rm(baseDir, { recursive: true, force: true }).catch(() => {})
    }
  }
}