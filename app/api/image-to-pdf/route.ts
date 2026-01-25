// app/api/image-to-pdf/route.ts
import { NextResponse } from "next/server"
import { writeFile, mkdir, readdir, readFile, rm } from "fs/promises"
import path from "path"
import crypto from "crypto"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function POST(req: Request) {
  const formData = await req.formData()
  const images = formData.getAll("images") as File[]
  const pageSize = (formData.get("pageSize") as string) || "a4"
  const orientation = (formData.get("orientation") as string) || "portrait"

  if (!images || images.length === 0) {
    return NextResponse.json(
      { error: "No images uploaded" },
      { status: 400 }
    )
  }

  // 📐 ukuran halaman (POINTS)
  const pageMap: Record<string, [number, number]> = {
    a4: [595, 842],
    a3: [842, 1191],
    letter: [612, 792],
    legal: [612, 1008],
  }

  let [width, height] = pageMap[pageSize] || pageMap.a4
  if (orientation === "landscape") {
    ;[width, height] = [height, width]
  }

  // 🔐 folder unik per request
  const requestId = crypto.randomUUID()
  const baseDir = path.join(process.cwd(), "tmp/image-to-pdf", requestId)
  await mkdir(baseDir, { recursive: true })

  try {
    // 1️⃣ simpan semua image
    const imagePaths: string[] = []

    for (let i = 0; i < images.length; i++) {
      const img = images[i]
      const ext = img.type.split("/")[1] || "png"
      const filePath = path.join(baseDir, `page-${i + 1}.${ext}`)
      await writeFile(filePath, Buffer.from(await img.arrayBuffer()))
      imagePaths.push(filePath)
    }

    // 2️⃣ buat file list Ghostscript
    const listPath = path.join(baseDir, "images.txt")
    await writeFile(listPath, imagePaths.join("\n"))

    const outputPdf = path.join(baseDir, "result.pdf")

    // 3️⃣ GHOSTSCRIPT — IMAGE → PDF
    const command = [
      "gs",
      "-dBATCH",
      "-dNOPAUSE",
      "-dSAFER",
      "-sDEVICE=pdfwrite",
      `-g${width}x${height}`,
      "-dPDFFitPage",
      `-sOutputFile="${outputPdf}"`,
      ...imagePaths.map(p => `"${p}"`),
    ].join(" ")

    await execAsync(command)

    const pdfBuffer = await readFile(outputPdf)

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="images-to-pdf.pdf"',
      },
    })
  } catch (err: any) {
    console.error("IMAGE TO PDF FAILED:", err)
    return NextResponse.json(
      { error: err.message || "Image to PDF failed" },
      { status: 500 }
    )
  } finally {
    // 🧹 bersihkan temp
    await rm(baseDir, { recursive: true, force: true }).catch(() => {})
  }
}