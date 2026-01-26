import { NextResponse } from "next/server"
import { writeFile, mkdir, readdir, readFile, rm } from "fs/promises"
import path from "path"
import crypto from "crypto"
import os from "os"
import { exec } from "child_process"
import { promisify } from "util"

export const runtime = "nodejs" // wajib

const execAsync = promisify(exec)

export async function POST(req: Request) {
  let baseDir: string | null = null

  try {
    // ===============================
    // 1️⃣ PARSE FORM DATA
    // ===============================
    const formData = await req.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "PDF file is required" },
        { status: 400 }
      )
    }

    const quality = ["high", "medium", "low"].includes(
      String(formData.get("quality"))
    )
      ? String(formData.get("quality"))
      : "high"

    const dpi =
      quality === "high" ? 300 :
      quality === "medium" ? 150 :
      72

    // ===============================
    // 2️⃣ FOLDER TEMP (SERVERLESS SAFE)
    // ===============================
    const requestId = crypto.randomUUID()
    baseDir = path.join(os.tmpdir(), "pdf-to-image", requestId)

    await mkdir(baseDir, { recursive: true })

    const inputPath = path.join(baseDir, "input.pdf")
    const outputPattern = path.join(baseDir, "page-%03d.png")

    // ===============================
    // 3️⃣ SIMPAN PDF
    // ===============================
    const buffer = Buffer.from(await file.arrayBuffer())
    if (!buffer.length) {
      return NextResponse.json(
        { success: false, message: "Uploaded PDF is empty" },
        { status: 400 }
      )
    }

    await writeFile(inputPath, buffer)

    // ===============================
    // 4️⃣ JALANKAN GHOSTSCRIPT
    // ===============================
    const command = [
      "gs",
      "-dBATCH",
      "-dNOPAUSE",
      "-dSAFER",
      "-dUseCropBox",
      "-sDEVICE=png16m",
      `-r${dpi}`,
      `-sOutputFile=${outputPattern}`,
      inputPath,
    ].join(" ")

    try {
      await execAsync(command)
    } catch (err) {
      console.error("Ghostscript not available:", err)
      return NextResponse.json(
        {
          success: false,
          message:
            "PDF conversion engine not available on this server (Ghostscript missing).",
        },
        { status: 500 }
      )
    }

    // ===============================
    // 5️⃣ AMBIL HASIL
    // ===============================
    const files = (await readdir(baseDir))
      .filter((f) => f.endsWith(".png"))
      .sort()

    if (!files.length) {
      return NextResponse.json(
        {
          success: false,
          message:
            "PDF tidak bisa dikonversi. Biasanya karena PDF scan atau protected.",
        },
        { status: 422 }
      )
    }

    const images = await Promise.all(
      files.map(async (name) => ({
        name,
        base64: (await readFile(path.join(baseDir!, name))).toString("base64"),
      }))
    )

    return NextResponse.json({
      success: true,
      pageCount: images.length,
      images,
    })

  } catch (error: any) {
    console.error("PDF TO IMAGE ERROR:", error)
    return NextResponse.json(
      { success: false, message: error?.message || "PDF conversion failed" },
      { status: 500 }
    )

  } finally {
    if (baseDir) {
      await rm(baseDir, { recursive: true, force: true }).catch(() => {})
    }
  }
}