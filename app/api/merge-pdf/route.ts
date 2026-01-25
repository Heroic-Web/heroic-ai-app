import { NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length < 2) {
      return NextResponse.json(
        { error: "At least 2 PDF files are required" },
        { status: 400 }
      )
    }

    const mergedPdf = await PDFDocument.create()

    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const pdf = await PDFDocument.load(bytes)
      const pages = await mergedPdf.copyPages(
        pdf,
        pdf.getPageIndices()
      )
      pages.forEach((page) => mergedPdf.addPage(page))
    }

    const mergedBytes = await mergedPdf.save()

    // ✅ FIX TYPE DI SINI
    return new NextResponse(Buffer.from(mergedBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="merged.pdf"',
      },
    })
  } catch (err: any) {
    console.error("MERGE PDF ERROR:", err)
    return NextResponse.json(
      { error: err.message || "Merge PDF failed" },
      { status: 500 }
    )
  }
}