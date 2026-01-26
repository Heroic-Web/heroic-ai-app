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
      return NextResponse.json({
        success: false,
        message: "PDF file is required",
      })
    }

    const qualityRaw = String(formData.get("quality") || "high")
    const quality =
      qualityRaw === "medium" || qualityRaw === "low"
        ? qualityRaw
        : "high"

    const scale = quality === "high" ? 2 : quality === "medium" ? 1.5 : 1

    /* =============================
     * 2️⃣ TEMP DIR
     * ============================= */
    const requestId = crypto.randomUUID()
    baseDir = path.join(os.tmpdir(), "pdf-to-image", requestId)
    await mkdir(baseDir, { recursive: true })

    const inputPath = path.join(baseDir, "input.pdf")
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(inputPath, buffer)

    /* =============================
     * 3️⃣ LOAD PUPPETEER
     * ============================= */
    const puppeteer = (await import("puppeteer")).default

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    })

    const page = await browser.newPage()

    /* =============================
     * 4️⃣ RENDER PDF
     * ============================= */
    const pdfBase64 = (await readFile(inputPath)).toString("base64")

    await page.goto(`data:application/pdf;base64,${pdfBase64}`, {
      waitUntil: "networkidle0",
    })

    const images: { name: string; base64: string }[] = []

    // Ambil screenshot full page (PDF viewer Chromium)
    const screenshot = await page.screenshot({
      fullPage: true,
      type: "png",
      scale,
    })

    images.push({
      name: "page-001.png",
      base64: Buffer.from(screenshot).toString("base64"),
    })

    await browser.close()

    /* =============================
     * 5️⃣ RESPONSE
     * ============================= */
    return NextResponse.json({
      success: true,
      pageCount: images.length,
      images,
    })
  } catch (error) {
    console.error("PDF TO IMAGE ERROR:", error)
    return NextResponse.json({
      success: false,
      message: "Gagal mengonversi PDF.",
    })
  } finally {
    if (baseDir) {
      await rm(baseDir, { recursive: true, force: true }).catch(() => {})
    }
  }
}