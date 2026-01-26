import { NextResponse } from "next/server"
import { writeFile, mkdir, readdir, readFile, rm } from "fs/promises"
import path from "path"
import crypto from "crypto"
import { exec } from "child_process"
import { promisify } from "util"

export const runtime = "nodejs" // ⬅️ WAJIB (bukan edge)

const execAsync = promisify(exec)

export async function POST(req: Request) {
  let baseDir: string | null = null

  try {
    // ===============================
    // 1️⃣ VALIDASI FORM DATA
    // ===============================
    const formData = await req.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "PDF file is required" },
        { status: 400 }
      )
    }

    const quality = (formData.get("quality") as string) || "high"

    // DPI mapping
    const dpi =
      quality === "high" ? 300 :
      quality === "medium" ? 150 :
      72

    // ===============================
    // 2️⃣ SETUP FOLDER AMAN
    // ===============================
    const requestId = crypto.randomUUID()
    baseDir = path.join(process.cwd(), "tmp", "pdf-to-image", requestId)

    await mkdir(baseDir, { recursive: true })

    const inputPath = path.join(baseDir, "input.pdf")
    const outputPattern = path.join(baseDir, "page-%03d.png")

    // ===============================
    // 3️⃣ SIMPAN FILE PDF
    // ===============================
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(inputPath, buffer)

    // ===============================
    // 4️⃣ EKSEKUSI GHOSTSCRIPT
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

    const { stderr } = await execAsync(command)

    if (stderr) {
      console.warn("Ghostscript warning:", stderr)
    }

    // ===============================
    // 5️⃣ BACA HASIL IMAGE
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
        const data = await readFile(path.join(baseDir!, name))
        return {
          name,
          base64: data.toString("base64"),
        }
      })
    )

    // ===============================
    // 6️⃣ RESPONSE FINAL (PASTI JSON)
    // ===============================
    return NextResponse.json({
      success: true,
      pageCount: images.length,
      images,
    })

  } catch (error: any) {
    console.error("PDF TO IMAGE ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "PDF conversion failed",
      },
      { status: 500 }
    )

  } finally {
    // ===============================
    // 7️⃣ CLEANUP AMAN
    // ===============================
    if (baseDir) {
      await rm(baseDir, { recursive: true, force: true }).catch(() => {})
    }
  }
}