import { NextResponse } from "next/server"
import { writeFile, mkdir, readdir, readFile, rm } from "fs/promises"
import path from "path"
import crypto from "crypto"
import os from "os"
import { exec } from "child_process"
import { promisify } from "util"

export const runtime = "nodejs"

const execAsync = promisify(exec)

/* =============================
 * UTIL: CHECK GHOSTSCRIPT
 * ============================= */
async function isGhostscriptAvailable(): Promise<boolean> {
  try {
    await execAsync("gs --version")
    return true
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  let baseDir: string | null = null

  try {
    /* =============================
     * 1️⃣ PARSE FORM DATA
     * ============================= */
    const formData = await req.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "PDF file is required" },
        { status: 400 }
      )
    }

    const qualityRaw = String(formData.get("quality") || "high")
    const quality =
      qualityRaw === "medium" || qualityRaw === "low" ? qualityRaw : "high"

    const dpi = quality === "high" ? 300 : quality === "medium" ? 150 : 72

    /* =============================
     * 2️⃣ CHECK GHOSTSCRIPT
     * ============================= */
    const hasGhostscript = await isGhostscriptAvailable()

    if (!hasGhostscript) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Fitur PDF to Image belum tersedia di server ini. Silakan hubungi administrator.",
        },
        { status: 200 }
      )
    }

    /* =============================
     * 3️⃣ TEMP DIRECTORY
     * ============================= */
    const requestId = crypto.randomUUID()
    baseDir = path.join(os.tmpdir(), "pdf-to-image", requestId)

    await mkdir(baseDir, { recursive: true })

    const inputPath = path.join(baseDir, "input.pdf")
    const outputPattern = path.join(baseDir, "page-%03d.png")

    /* =============================
     * 4️⃣ SAVE PDF
     * ============================= */
    const buffer = Buffer.from(await file.arrayBuffer())

    if (!buffer.length) {
      return NextResponse.json(
        { success: false, message: "Uploaded PDF is empty" },
        { status: 400 }
      )
    }

    await writeFile(inputPath, buffer)

    /* =============================
     * 5️⃣ CONVERT PDF → IMAGE
     * ============================= */
    const command = [
      "gs",
      "-dBATCH",
      "-dNOPAUSE",
      "-dSAFER",
      "-dUseCropBox",
      "-sDEVICE=png16m",
      `-r${dpi}`,
      `-sOutputFile=${outputPattern}`,
      `"${inputPath}"`,
    ].join(" ")

    try {
      await execAsync(command)
    } catch (err) {
      console.error("GHOSTSCRIPT EXEC ERROR:", err)
      return NextResponse.json(
        {
          success: false,
          message:
            "PDF tidak dapat dikonversi. File mungkin rusak, terenkripsi, atau tidak didukung.",
        },
        { status: 200 }
      )
    }

    /* =============================
     * 6️⃣ READ OUTPUT IMAGES
     * ============================= */
    const files = (await readdir(baseDir))
      .filter((f) => f.endsWith(".png"))
      .sort()

    if (!files.length) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Tidak ada halaman yang berhasil dikonversi dari PDF ini.",
        },
        { status: 200 }
      )
    }

    const images = await Promise.all(
      files.map(async (name) => ({
        name,
        base64: (await readFile(path.join(baseDir!, name))).toString("base64"),
      }))
    )

    /* =============================
     * 7️⃣ SUCCESS RESPONSE
     * ============================= */
    return NextResponse.json({
      success: true,
      pageCount: images.length,
      images,
    })
  } catch (error) {
    console.error("PDF TO IMAGE FATAL ERROR:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat memproses PDF.",
      },
      { status: 200 }
    )
  } finally {
    if (baseDir) {
      await rm(baseDir, { recursive: true, force: true }).catch(() => {})
    }
  }
}