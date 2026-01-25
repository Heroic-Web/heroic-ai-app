import { NextResponse } from "next/server"
import { writeFile, unlink, mkdir, readFile } from "fs/promises"
import path from "path"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function POST(req: Request) {
  const formData = await req.formData()
  const files = formData.getAll("files") as File[]

  if (files.length < 2) {
    return NextResponse.json(
      { error: "At least 2 PDF files are required" },
      { status: 400 }
    )
  }

  const tempDir = path.join(process.cwd(), "tmp/pdf")
  await mkdir(tempDir, { recursive: true })

  const inputPaths: string[] = []

  try {
    // 1. simpan semua PDF ke disk
    for (let i = 0; i < files.length; i++) {
      const buffer = Buffer.from(await files[i].arrayBuffer())
      const filePath = path.join(tempDir, `input-${i}.pdf`)
      await writeFile(filePath, buffer)
      inputPaths.push(filePath)
    }

    // 2. merge pakai Ghostscript
    const outputPath = path.join(tempDir, "merged.pdf")
    const command = [
      "gs",
      "-dBATCH",
      "-dNOPAUSE",
      "-sDEVICE=pdfwrite",
      `-sOutputFile="${outputPath}"`,
      ...inputPaths.map((p) => `"${p}"`),
    ].join(" ")

    await execAsync(command)

    // 3. kirim hasil PDF
    const mergedBuffer = await readFile(outputPath)

    return new Response(mergedBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="merged.pdf"',
      },
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Merge failed" },
      { status: 500 }
    )
  } finally {
    // cleanup file sementara
    await Promise.all(
      inputPaths.map((p) => unlink(p).catch(() => {}))
    )
  }
}