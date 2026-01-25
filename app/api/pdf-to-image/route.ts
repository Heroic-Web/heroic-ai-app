import { NextResponse } from "next/server"
import { writeFile, mkdir, readdir, readFile, rm } from "fs/promises"
import path from "path"
import crypto from "crypto"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file") as File | null
  const quality = (formData.get("quality") as string) || "high"

  if (!file) {
    return NextResponse.json({ error: "PDF file is required" }, { status: 400 })
  }

  // DPI mapping (AMAN)
  const dpi =
    quality === "high" ? 300 :
    quality === "medium" ? 150 :
    72

  // 🔐 Folder unik per request (ANTI BENTROK)
  const requestId = crypto.randomUUID()
  const baseDir = path.join(process.cwd(), "tmp/pdf-to-image", requestId)
  await mkdir(baseDir, { recursive: true })

  const inputPath = path.join(baseDir, "input.pdf")
  const outputPattern = path.join(baseDir, "page-%03d.png")

  try {
    // 1️⃣ Simpan PDF dari UI (RANDOM USER FILE)
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(inputPath, buffer)

    // 2️⃣ Ghostscript — CONFIG PALING STABIL
    const command = [
      "gs",
      "-dBATCH",
      "-dNOPAUSE",
      "-dSAFER",
      "-dUseCropBox",
      "-sDEVICE=png16m",
      `-r${dpi}`,
      `-sOutputFile="${outputPattern}"`,
      `"${inputPath}"`
    ].join(" ")

    const { stderr } = await execAsync(command)

    if (stderr) {
      console.warn("GS warning:", stderr)
    }

    // 3️⃣ Ambil hasil
    const files = (await readdir(baseDir))
      .filter(f => f.startsWith("page-") && f.endsWith(".png"))
      .sort()

    if (files.length === 0) {
      throw new Error(
        "PDF tidak bisa dikonversi. Biasanya karena PDF scan/XFA/protected. Coba Print → Save as PDF lalu upload ulang."
      )
    }

    const images = await Promise.all(
      files.map(async (name) => ({
        name,
        data: (await readFile(path.join(baseDir, name))).toString("base64"),
      }))
    )

    return NextResponse.json({ images })

  } catch (err: any) {
    console.error("PDF TO IMAGE FAILED:", err)
    return NextResponse.json(
      { error: err.message || "PDF conversion failed" },
      { status: 500 }
    )
  } finally {
    // 🧹 Bersihkan folder (ANTI BOCOR DISK)
    await rm(baseDir, { recursive: true, force: true }).catch(() => {})
  }
}