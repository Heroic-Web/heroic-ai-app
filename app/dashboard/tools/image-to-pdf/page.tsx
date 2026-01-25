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
  Trash2,
  GripVertical,
  ImageIcon,
} from "lucide-react"

interface ImageFile {
  id: string
  file: File
  preview: string
}

export default function ImageToPdfPage() {
  const { t } = useLanguage()

  const [images, setImages] = useState<ImageFile[]>([])
  const [pageSize, setPageSize] = useState("a4")
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  )
  const [isConverting, setIsConverting] = useState(false)

  /* =============================
   * HELPERS
   * ============================= */

  const generateId = () =>
    typeof window !== "undefined" && window.crypto?.randomUUID
      ? window.crypto.randomUUID()
      : Math.random().toString(36).slice(2)

  /* =============================
   * FILE INPUT
   * ============================= */

  const addImages = (files: File[]) => {
    const newImages = files.map((file) => ({
      id: generateId(),
      file,
      preview: URL.createObjectURL(file),
    }))
    setImages((prev) => [...prev, ...newImages])
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    )
    addImages(files)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith("image/")
    )
    addImages(files)
  }

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id)
      if (img) URL.revokeObjectURL(img.preview)
      return prev.filter((i) => i.id !== id)
    })
  }

  /* =============================
   * IMAGE → PDF (CLIENT, DYNAMIC jsPDF)
   * ============================= */

  const handleConvert = async () => {
    if (images.length === 0) return
    setIsConverting(true)

    try {
      // ✅ DYNAMIC IMPORT (ANTI ERROR MERAH)
      const { jsPDF } = await import("jspdf")

      const pdf = new jsPDF({
        orientation,
        unit: "mm",
        format: pageSize,
      })

      for (let i = 0; i < images.length; i++) {
        const img = images[i]

        const imgData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(img.file)
        })

        if (i > 0) pdf.addPage()

        const w = pdf.internal.pageSize.getWidth()
        const h = pdf.internal.pageSize.getHeight()

        pdf.addImage(imgData, "AUTO", 0, 0, w, h)
      }

      pdf.save("images-to-pdf.pdf")
    } catch (err) {
      console.error("IMAGE TO PDF ERROR:", err)
      alert("Gagal membuat PDF")
    } finally {
      setIsConverting(false)
    }
  }

  const PAGE_RATIO: Record<string, { w: number; h: number }> = {
    a4: { w: 210, h: 297 },
    a3: { w: 297, h: 420 },
    letter: { w: 216, h: 279 },
    legal: { w: 216, h: 356 },
  }

const getPreviewAspect = () => {
  const page = PAGE_RATIO[pageSize] ?? PAGE_RATIO.a4
  return orientation === "portrait"
    ? `${page.w} / ${page.h}`
    : `${page.h} / ${page.w}`
}

  /* =============================
   * RENDER
   * ============================= */

  return (
    <ToolPageLayout
      title={t("tools.imageToPdf")}
      description="Convert multiple images to a single PDF document"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* LEFT */}
        <div className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("image-input")?.click()}
            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-accent/50"
          >
            <input
              id="image-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="font-medium">Drop images here</p>
            <p className="text-sm text-muted-foreground">
              or click to browse (JPG, PNG, WebP)
            </p>
          </div>

          {images.length > 0 && (
            <div className="space-y-2">
              <Label>Images ({images.length})</Label>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {images.map((img, i) => (
                  <Card key={img.id} className="bg-secondary/30">
                    <CardContent className="p-3 flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <img
                        src={img.preview}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{img.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Page {i + 1}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeImage(img.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Page Size</Label>
              <Select value={pageSize} onValueChange={setPageSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4</SelectItem>
                  <SelectItem value="letter">Letter</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="a3">A3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Orientation</Label>
              <Select value={orientation} onValueChange={(value) => setOrientation(value as "portrait" | "landscape")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleConvert}
            disabled={images.length === 0 || isConverting}
            className="w-full"
          >
            {isConverting ? "Converting..." : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Create PDF ({images.length} pages)
              </>
            )}
          </Button>
        </div>

        {/* RIGHT */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Preview</h3>

            {images.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {images.slice(0, 4).map((img, i) => (
                  <div
                    key={img.id}
                    className="rounded overflow-hidden border relative bg-white"
                    style={{ aspectRatio: getPreviewAspect() }}
                  >
                    <img
                      src={img.preview}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-1 right-1 text-xs bg-background/80 px-2 rounded">
                      Page {i + 1}
                    </div>
                  </div>
                ))}

                {images.length > 4 && (
                  <div
                    className="flex items-center justify-center border rounded text-muted-foreground"
                    style={{ aspectRatio: getPreviewAspect() }}
                  >
                    +{images.length - 4} more
                  </div>
                )}
              </div>
            ) : (
              <div
                className="flex items-center justify-center border rounded"
                style={{ aspectRatio: getPreviewAspect() }}
              >
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolPageLayout>
  )
}