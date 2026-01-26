"use client"

import React, { useState, useCallback } from "react"
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
      setImages([])
      setConverted(false)
      setError("")
    } else {
      setError("Please upload a valid PDF file.")
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (selectedFile?.type === "application/pdf") {
      setFile(selectedFile)
      setImages([])
      setConverted(false)
      setError("")
    } else {
      setError("Please upload a valid PDF file.")
    }
  }

  const handleRemove = () => {
    setFile(null)
    setImages([])
    setConverted(false)
    setError("")
  }

  /* =============================
   * CONVERT
   * ============================= */

  const handleConvert = async () => {
    if (!file) return

    setIsConverting(true)
    setError("")
    setImages([])
    setConverted(false)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("quality", quality)

      const res = await fetch("/api/pdf-to-image", {
        method: "POST",
        body: formData,
      })

      const contentType = res.headers.get("content-type") || ""

      if (!contentType.includes("application/json")) {
        throw new Error("Server error occurred.")
      }

      const data: ApiResponse = await res.json()

      if (!data.success) {
        throw new Error(data.message || "PDF conversion failed.")
      }

      if (!data.images || data.images.length === 0) {
        throw new Error("No images generated.")
      }

      setImages(data.images.map((img) => img.base64))
      setConverted(true)
    } catch (err) {
      console.error("UI PDF ERROR:", err)
      setError(
        err instanceof Error
          ? err.message
          : "Failed to convert PDF."
      )
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
                  <SelectItem value="high">High (300 DPI)</SelectItem>
                  <SelectItem value="medium">Medium (150 DPI)</SelectItem>
                  <SelectItem value="low">Low (72 DPI)</SelectItem>
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