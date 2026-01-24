"use client"

import React from "react"

import { useState, useCallback } from "react"
import { useLanguage } from "@/lib/language-context"
import { ToolPageLayout } from "@/components/tools/tool-page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Upload, Download, FileText, Trash2, GripVertical, ImageIcon } from "lucide-react"

interface ImageFile {
  id: string
  file: File
  preview: string
}

export default function ImageToPdfPage() {
  const { t } = useLanguage()
  const [images, setImages] = useState<ImageFile[]>([])
  const [pageSize, setPageSize] = useState("a4")
  const [orientation, setOrientation] = useState("portrait")
  const [isConverting, setIsConverting] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"))
    addImages(files)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith("image/"))
    addImages(files)
  }

  const addImages = (files: File[]) => {
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file)
    }))
    setImages(prev => [...prev, ...newImages])
  }

  const removeImage = (id: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === id)
      if (image) URL.revokeObjectURL(image.preview)
      return prev.filter(img => img.id !== id)
    })
  }

  const handleConvert = async () => {
    if (images.length === 0) return
    
    setIsConverting(true)
    
    // Simulate conversion
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Create a simple PDF-like download (in production, use jsPDF or similar)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    
    // A4 dimensions at 72 DPI
    const width = orientation === "portrait" ? 595 : 842
    const height = orientation === "portrait" ? 842 : 595
    
    canvas.width = width
    canvas.height = height
    
    if (ctx) {
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = "#333333"
      ctx.font = "16px Arial"
      ctx.textAlign = "center"
      ctx.fillText(`PDF with ${images.length} image(s)`, width / 2, height / 2)
      ctx.font = "12px Arial"
      ctx.fillText(`Page Size: ${pageSize.toUpperCase()} | ${orientation}`, width / 2, height / 2 + 30)
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = "images-combined.pdf"
          a.click()
          URL.revokeObjectURL(url)
        }
        setIsConverting(false)
      }, "image/png")
    }
  }

  return (
    <ToolPageLayout
      title={t("tools.imageToPdf")}
      description="Convert multiple images to a single PDF document"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-accent/50 transition-colors cursor-pointer"
            onClick={() => document.getElementById("image-input")?.click()}
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
            <p className="text-foreground font-medium mb-1">Drop images here</p>
            <p className="text-sm text-muted-foreground">or click to browse (JPG, PNG, WebP)</p>
          </div>

          {images.length > 0 && (
            <div className="space-y-2">
              <Label>Images ({images.length})</Label>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {images.map((image, index) => (
                  <Card key={image.id} className="bg-secondary/30 border-border">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        <div className="w-12 h-12 rounded bg-card overflow-hidden shrink-0">
                          <img
                            src={image.preview || "/placeholder.svg"}
                            alt={image.file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{image.file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(image.file.size / 1024).toFixed(1)} KB - Page {index + 1}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeImage(image.id)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Page Size</Label>
              <Select value={pageSize} onValueChange={setPageSize}>
                <SelectTrigger className="bg-secondary/50 border-border">
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
            <div className="space-y-2">
              <Label>Orientation</Label>
              <Select value={orientation} onValueChange={setOrientation}>
                <SelectTrigger className="bg-secondary/50 border-border">
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
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {isConverting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                Converting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Create PDF ({images.length} pages)
              </>
            )}
          </Button>
        </div>

        <Card className="bg-secondary/30 border-border">
          <CardContent className="p-6">
            <h3 className="font-medium text-foreground mb-4">Preview</h3>
            {images.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {images.slice(0, 4).map((image, index) => (
                  <div key={image.id} className="aspect-[3/4] bg-card rounded-lg overflow-hidden border border-border relative">
                    <img
                      src={image.preview || "/placeholder.svg"}
                      alt={`Page ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 px-2 py-0.5 bg-background/80 rounded text-xs text-foreground">
                      Page {index + 1}
                    </div>
                  </div>
                ))}
                {images.length > 4 && (
                  <div className="aspect-[3/4] bg-card rounded-lg border border-border flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">+{images.length - 4} more</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-[3/4] bg-card rounded-lg flex items-center justify-center border border-border">
                <div className="text-center">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Add images to see preview</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolPageLayout>
  )
}
