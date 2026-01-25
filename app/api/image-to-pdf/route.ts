import { NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

export async function POST(req: Request) {
  try {
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

    const pageMap: Record<string, [number, number]> = {
      a4: [595, 842],
      a3: [842, 1191],
      letter: [612, 792],
      legal: [612, 1008],
    }

    let [pageWidth, pageHeight] = pageMap[pageSize] || pageMap.a4
    if (orientation === "landscape") {
      ;[pageWidth, pageHeight] = [pageHeight, pageWidth]
    }

    const pdfDoc = await PDFDocument.create()

    for (const img of images) {
      const bytes = await img.arrayBuffer()
      const image =
        img.type === "image/jpeg" || img.type === "image/jpg"
          ? await pdfDoc.embedJpg(bytes)
          : await pdfDoc.embedPng(bytes)

      const page = pdfDoc.addPage([pageWidth, pageHeight])

      const scale = Math.min(
        pageWidth / image.width,
        pageHeight / image.height
      )

      const w = image.width * scale
      const h = image.height * scale

      page.drawImage(image, {
        x: (pageWidth - w) / 2,
        y: (pageHeight - h) / 2,
        width: w,
        height: h,
      })
    }

    const pdfBytes = await pdfDoc.save()

    // ✅ FIX TYPE DI SINI JUGA
    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="images-to-pdf.pdf"',
      },
    })
  } catch (err: any) {
    console.error("IMAGE TO PDF ERROR:", err)
    return NextResponse.json(
      { error: err.message || "Image to PDF failed" },
      { status: 500 }
    )
  }
}