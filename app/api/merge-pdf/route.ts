import { NextResponse } from "next/server"
import { writeFile, unlink, mkdir, readFile } from "fs/promises"
import path from "path"
import crypto from "crypto"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const files = formData.getAll("files") as File[]

    if (files.length < 2) {
      return NextResponse.json(
        { error: "At least 2 PDF files are required" },
        { status: 400 }
      )
    }

    // ✅ WAJIB: gunakan /tmp (bukan process.cwd)
    const tempDir = path.join("/tmp", "pdf", crypto.randomUUID())
    await mkdir(tempDir, { recursive: true })

    const inputPaths: string[] = []

    // 1️⃣ Simpan semua PDF ke /tmp
    for (let i = 0; i < files.length; i++) {
      const buffer = Buffer.from(await files[i].arrayBuffer())
      const filePath = path.join(tempDir, `input-${i}.pdf`)
      await writeFile(filePath, buffer)
      inputPaths.push(filePath)
    }

    // 2️⃣ Merge pakai Ghostscript
    const outputPath = path.join(tempDir, "merged.pdf")

    const command = [
      "gs",
      "-dBATCH",
      "-dNOPAUSE",
      "-q",
      "-sDEVICE=pdfwrite",
      `-sOutputFile=${outputPath}`,
      ...inputPaths,
    ].join(" ")

    await execAsync(command)

    // 3️⃣ Kirim hasil PDF
    const mergedBuffer = await readFile(outputPath)

    return new Response(mergedBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="merged.pdf"',
      },
    })
  } catch (err: any) {
    console.error("MERGE PDF ERROR:", err)
    return NextResponse.json(
      { error: err.message || "Merge failed" },
      { status: 500 }
    )
  }
}