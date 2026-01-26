"use client"

import React, { useState, useCallback } from "react"
import * as pdfjsLib from "pdfjs-dist"

import { useLanguage } from "@/lib/language-context"
import { ToolPageLayout } from "@/components/tools/tool-page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Upload,
  Download,
  FileImage,
  Trash2,
  AlertCircle,
} from "lucide-react"

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js"

interface ApiImage {
  name: string
  base64: string
}

interface ApiResponse {
  success: boolean
  message?: string
  images?: ApiImage[]
}

export default function PdfToImagePage() {
  const { t } = useLanguage()

  const [file, setFile] = useState<File | null>(null)
  const [format, setFormat] = useState("png")
  const [quality, setQuality] = useState("high")
  const [isConverting, setIsConverting] = useState(false)
  const [converted, setConverted] = useState(false)
  const [error, setError] = useState("")
  const [images, setImages] = useState<string[]>([])

  /* =============================
   * FILE INPUT
   * ============================= */

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]

    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile)
      resetState()
    } else {
      setError("Please upload a valid PDF file.")
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (selectedFile?.type === "application/pdf") {
      setFile(selectedFile)
      resetState()
    } else {
      setError("Please upload a valid PDF file.")
    }
  }

  const resetState = () => {
    setImages([])
    setConverted(false)
    setError("")
  }

  const handleRemove = () => {
    setFile(null)
    resetState()
  }

  /* =============================
   * CLIENT-SIDE FALLBACK
   * ============================= */

  const convertClientSide = async (pdfFile: File) => {
    try {
      // =============================
      // 1️⃣ LOAD PDF
      // =============================
      const buffer = await pdfFile.arrayBuffer()

      const loadingTask = pdfjsLib.getDocument({ data: buffer })
      const pdf = await loadingTask.promise

      // =============================
      // 2️⃣ QUALITY → SCALE
      // =============================
      const scale =
        quality === "high"
          ? 2
          : quality === "medium"
          ? 1.5
          : 1

      const resultImages: string[] = []

      // =============================
      // 3️⃣ RENDER PER PAGE
      // =============================
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber)
        const viewport = page.getViewport({ scale })

        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

        canvas.width = viewport.width
        canvas.height = viewport.height

        const renderTask = (page.render as any)({
          canvasContext: ctx,
          viewport,
        })

  await renderTask.promise

        // =============================
        // 4️⃣ SAVE BASE64 (TANPA PREFIX)
        // =============================
        const dataUrl = canvas.toDataURL(`image/${format}`)
        resultImages.push(dataUrl.split(",")[1])
      }

      // =============================
      // 5️⃣ UPDATE UI (WAJIB)
      // =============================
      setImages(resultImages)
      setConverted(true)
      setError("")

    } catch (err) {
      console.error("CLIENT PDF CONVERT ERROR:", err)
      setError("Failed to convert PDF.")
      setConverted(false)
    }
  }

  /* =============================
   * CONVERT (API + FALLBACK)
   * ============================= */

  const handleConvert = async () => {
    if (!file) return

    setIsConverting(true)
    resetState()

    try {
      // 1️⃣ TRY BACKEND API
      const formData = new FormData()
      formData.append("file", file)
      formData.append("quality", quality)

      const res = await fetch("/api/pdf-to-image", {
        method: "POST",
        body: formData,
      })

      const contentType = res.headers.get("content-type") || ""

      if (contentType.includes("application/json")) {
        const data: ApiResponse = await res.json()

        if (data.success && data.images?.length) {
          setImages(data.images.map((img) => img.base64))
          setConverted(true)
          return
        }
      }

      // 2️⃣ FALLBACK CLIENT-SIDE
      await convertClientSide(file)

    } catch (err) {
      console.error("PDF CONVERT ERROR:", err)
      setError("Failed to convert PDF.")
    } finally {
      setIsConverting(false)
    }
  }

  /* =============================
   * DOWNLOAD
   * ============================= */

  const handleDownload = (base64: string, index: number) => {
    const a = document.createElement("a")
    a.href = `data:image/${format};base64,${base64}`
    a.download = `${file?.name.replace(".pdf", "")}_page${index + 1}.${format}`
    a.click()
  }

  /* =============================
   * RENDER
   * ============================= */

  return (
    <ToolPageLayout
      title={t("tools.pdfToImage")}
      description="Convert PDF pages to high-quality images"
    >
      <div className="grid gap-6 lg:grid-cols-2">

        {/* LEFT */}
        <div className="space-y-4">
          {!file ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() =>
                document.getElementById("pdf-input")?.click()
              }
              className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer hover:border-accent/50"
            >
              <input
                id="pdf-input"
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="font-medium">Drop your PDF here</p>
              <p className="text-sm text-muted-foreground">
                or click to browse
              </p>
            </div>
          ) : (
            <Card className="bg-secondary/30">
              <CardContent className="p-4 flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <div className="p-2 rounded bg-red-500/20">
                    <FileImage className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium truncate max-w-[200px]">
                      {file.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleRemove}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {error && (
            <div className="flex gap-2 items-center p-3 rounded bg-destructive/10 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label>Output Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Quality</Label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleConvert}
            disabled={!file || isConverting}
            className="w-full"
          >
            {isConverting ? "Converting..." : `Convert to ${format.toUpperCase()}`}
          </Button>
        </div>

        {/* RIGHT */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Preview</h3>

              {converted && images.length > 0 ? (
                <div className="space-y-6">
                  {images.map((img, i) => (
                    <div key={i} className="space-y-2">
                      <img
                        src={`data:image/${format};base64,${img}`}
                        className="w-full rounded border"
                        alt={`Page ${i + 1}`}
                      />
                      <Button
                        onClick={() => handleDownload(img, i)}
                        className="w-full"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Page {i + 1}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="aspect-[3/4] flex items-center justify-center text-muted-foreground border rounded">
                  {file
                    ? "Click convert to see preview"
                    : "Upload a PDF to see preview"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolPageLayout>
  )
}