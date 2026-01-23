"use client"

import React, { useState, useCallback, useRef } from "react"
import { ToolPageLayout } from "@/components/tools/tool-page-layout"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Download, ImageIcon, RefreshCw, Check } from "lucide-react"

export default function CompressImagePage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [quality, setQuality] = useState([80])
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{
    originalSize: number
    compressedSize: number
    dataUrl: string
  } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile)
      setPreview(URL.createObjectURL(droppedFile))
      setResult(null)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
      setResult(null)
    }
  }

  const handleCompress = async () => {
    if (!file || !preview) return

    setIsProcessing(true)

    try {
      const img = new Image()
      img.crossOrigin = "anonymous"

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = reject
        img.src = preview
      })

      const canvas = canvasRef.current || document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Could not get canvas context")

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      // Compress to JPEG with quality setting
      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality[0] / 100)

      // Calculate compressed size (base64 to bytes approximation)
      const base64Length = compressedDataUrl.split(",")[1].length
      const compressedSize = Math.round((base64Length * 3) / 4)

      setResult({
        originalSize: file.size,
        compressedSize,
        dataUrl: compressedDataUrl,
      })
    } catch (error) {
      console.error("Compression failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!result || !file) return

    const link = document.createElement("a")
    link.href = result.dataUrl
    link.download = `compressed-${file.name.replace(/\.[^/.]+$/, "")}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const tips = [
    "JPG images compress better than PNG",
    "Lower quality = smaller file size",
    "80% quality is usually unnoticeable",
    "Great for web and email use",
  ]

  const savings = result
    ? Math.round((1 - result.compressedSize / result.originalSize) * 100)
    : 0

  return (
    <ToolPageLayout
      title="Image Compressor"
      description="Reduce image file size while maintaining visual quality"
      tips={tips}
    >
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex flex-col gap-6">
        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <Card className="border-dashed border-2 hover:border-heroic-blue/50 transition-colors">
            <CardContent className="flex flex-col items-center justify-center py-12">
              {preview ? (
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Preview"
                  className="max-h-48 max-w-full rounded-lg mb-4 object-contain"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-secondary mb-4">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <p className="text-sm font-medium">
                {file ? file.name : "Drop an image here or click to upload"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {file ? formatSize(file.size) : "PNG, JPG, WEBP up to 10MB"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quality Control */}
        {file && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Label>Compression Quality</Label>
              <span className="text-sm text-muted-foreground">{quality[0]}%</span>
            </div>
            <Slider
              value={quality}
              onValueChange={setQuality}
              min={10}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Smaller file</span>
              <span>Better quality</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button onClick={handleCompress} disabled={!file || isProcessing}>
          {isProcessing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Compressing...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Compress Image
            </>
          )}
        </Button>

        {/* Result */}
        {result && (
          <Card className="bg-green-500/10 border-green-500/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Compression Complete</p>
                    <p className="text-xs text-muted-foreground">
                      {formatSize(result.originalSize)} → {formatSize(result.compressedSize)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-500">{savings}%</p>
                  <p className="text-xs text-muted-foreground">smaller</p>
                </div>
              </div>
              {result.dataUrl && (
                <img
                  src={result.dataUrl || "/placeholder.svg"}
                  alt="Compressed preview"
                  className="max-h-32 max-w-full rounded-lg mb-4 object-contain mx-auto"
                />
              )}
              <Button className="w-full" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download Compressed Image
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolPageLayout>
  )
}
