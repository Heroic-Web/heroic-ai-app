"use client"

import React from "react"

import { useState, useCallback } from "react"
import { useLanguage } from "@/lib/language-context"
import { ToolPageLayout } from "@/components/tools/tool-page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Upload, Download, FileImage, Trash2, AlertCircle } from "lucide-react"

export default function PdfToImagePage() {
  const { t } = useLanguage()
  const [file, setFile] = useState<File | null>(null)
  const [format, setFormat] = useState("png")
  const [quality, setQuality] = useState("high")
  const [isConverting, setIsConverting] = useState(false)
  const [converted, setConverted] = useState(false)
  const [error, setError] = useState("")

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile)
      setConverted(false)
      setError("")
    } else {
      setError("Please upload a PDF file")
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile?.type === "application/pdf") {
      setFile(selectedFile)
      setConverted(false)
      setError("")
    } else {
      setError("Please upload a PDF file")
    }
  }

  const handleConvert = async () => {
    if (!file) return
    
    setIsConverting(true)
    setError("")
    
    // Simulate conversion process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsConverting(false)
    setConverted(true)
  }

  const handleDownload = () => {
    // Create a placeholder image for demo
    const canvas = document.createElement("canvas")
    canvas.width = 800
    canvas.height = 1100
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#333333"
      ctx.font = "24px Arial"
      ctx.textAlign = "center"
      ctx.fillText(`Converted from: ${file?.name}`, canvas.width / 2, canvas.height / 2)
      ctx.font = "16px Arial"
      ctx.fillText(`Format: ${format.toUpperCase()} | Quality: ${quality}`, canvas.width / 2, canvas.height / 2 + 40)
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `${file?.name.replace(".pdf", "")}_page1.${format}`
          a.click()
          URL.revokeObjectURL(url)
        }
      }, `image/${format}`, quality === "high" ? 1 : quality === "medium" ? 0.8 : 0.6)
    }
  }

  const handleRemove = () => {
    setFile(null)
    setConverted(false)
    setError("")
  }

  return (
    <ToolPageLayout
      title={t("tools.pdfToImage")}
      description="Convert PDF pages to high-quality images"
      icon={<FileImage className="h-6 w-6" />}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {!file ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-accent/50 transition-colors cursor-pointer"
              onClick={() => document.getElementById("pdf-input")?.click()}
            >
              <input
                id="pdf-input"
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-foreground font-medium mb-2">Drop your PDF here</p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
            </div>
          ) : (
            <Card className="bg-secondary/30 border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-500/20">
                      <FileImage className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground truncate max-w-[200px]">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleRemove}>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Output Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="bg-secondary/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG (Best Quality)</SelectItem>
                  <SelectItem value="jpeg">JPEG (Smaller Size)</SelectItem>
                  <SelectItem value="webp">WebP (Modern Format)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quality</Label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger className="bg-secondary/50 border-border">
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
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {isConverting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                Converting...
              </>
            ) : (
              <>
                <FileImage className="mr-2 h-4 w-4" />
                Convert to {format.toUpperCase()}
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          <Card className="bg-secondary/30 border-border">
            <CardContent className="p-6">
              <h3 className="font-medium text-foreground mb-4">Preview</h3>
              {converted ? (
                <div className="space-y-4">
                  <div className="aspect-[3/4] bg-card rounded-lg flex items-center justify-center border border-border">
                    <div className="text-center">
                      <FileImage className="h-16 w-16 mx-auto text-accent mb-4" />
                      <p className="text-foreground font-medium">Page 1</p>
                      <p className="text-sm text-muted-foreground">Ready to download</p>
                    </div>
                  </div>
                  <Button onClick={handleDownload} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Image
                  </Button>
                </div>
              ) : (
                <div className="aspect-[3/4] bg-card rounded-lg flex items-center justify-center border border-border">
                  <p className="text-muted-foreground">
                    {file ? "Click convert to see preview" : "Upload a PDF to see preview"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolPageLayout>
  )
}
