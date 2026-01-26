import { NextResponse } from "next/server"
import { writeFile, mkdir, readdir, readFile, rm } from "fs/promises"
import path from "path"
import crypto from "crypto"
import { exec } from "child_process"
import { promisify } from "util"

export const runtime = "nodejs" // ⬅️ wajib (bukan edge)

const execAsync = promisify(exec)

export async function POST(req: Request) {
  let baseDir: string | null = null

  try {
    // ===============================
    // 1️⃣ PARSE & VALIDASI FORM DATA
    // ===============================
    let formData: FormData
    try {
      formData = await req.formData()
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid form data" },
        { status: 400 }
      )
    }

    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "PDF file is required" },
        { status: 400 }
      )
    }

    const qualityRaw = formData.get("quality")
    const quality =
      qualityRaw === "high" ||
      qualityRaw === "medium" ||
      qualityRaw === "low"
        ? qualityRaw
        : "high"

    // ===============================
    // 2️⃣ DPI MAPPING (AMAN)
    // ===============================
    const dpi =
      quality === "high" ? 300 :
      quality === "medium" ? 150 :
      72

    // ===============================
    // 3️⃣ SETUP FOLDER TEMP (UNIK)
    // ===============================
    const requestId = crypto.randomUUID()
    baseDir = path.join(process.cwd(), "tmp", "pdf-to-image", requestId)
    await mkdir(baseDir, { recursive: true })

    const inputPath = path.join(baseDir, "input.pdf")
    const outputPattern = path.join(baseDir, "page-%03d.png")

    // ===============================
    // 4️⃣ SIMPAN FILE PDF
    // ===============================
    const buffer = Buffer.from(await file.arrayBuffer())

    if (buffer.length === 0) {
      return NextResponse.json(
        { success: false, message: "Uploaded PDF is empty" },
        { status: 400 }
      )
    }

    await writeFile(inputPath, buffer)

    // ===============================
    // 5️⃣ JALANKAN GHOSTSCRIPT
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

    let execResult
    try {
      execResult = await execAsync(command)
    } catch (err: any) {
      console.error("Ghostscript exec failed:", err)
      return NextResponse.json(
        {
          success: false,
          message:
            "PDF conversion engine failed. Pastikan server mendukung Ghostscript.",
        },
        { status: 500 }
      )
    }

    if (execResult.stderr) {
      console.warn("Ghostscript warning:", execResult.stderr)
    }

    // ===============================
    // 6️⃣ BACA FILE HASIL
    // ===============================
    const files = (await readdir(baseDir))
      .filter((f) => f.startsWith("page-") && f.endsWith(".png"))
      .sort()

    if (files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "PDF tidak bisa dikonversi. Biasanya karena PDF scan, XFA, atau protected. Coba Print → Save as PDF lalu upload ulang.",
        },
        { status: 422 }
      )
    }

    const images = await Promise.all(
      files.map(async (name) => {
        const filePath = path.join(baseDir!, name)
        const data = await readFile(filePath)

        return {
          name,
          base64: data.toString("base64"),
        }
      })
    )

    // ===============================
    // 7️⃣ RESPONSE FINAL (PASTI JSON)
    // ===============================
    return NextResponse.json({
      success: true,
      pageCount: images.length,
      images,
    })

  } catch (error: any) {
    console.error("PDF TO IMAGE UNHANDLED ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "PDF conversion failed",
      },
      { status: 500 }
    )

  } finally {
    // ===============================
    // 8️⃣ CLEANUP (ANTI RACE CONDITION)
    // ===============================
    if (baseDir) {
      await rm(baseDir, {
        recursive: true,
        force: true,
      }).catch(() => {})
    }
  }
}