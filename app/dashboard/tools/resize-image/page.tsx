"use client"

import React, { useState, useRef } from "react"
import { ToolPageLayout } from "@/components/tools/tool-page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Upload, Download, ImageIcon, RefreshCw, Link2, Link2Off, Check } from "lucide-react"

export default function ResizeImagePage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 })
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{ dataUrl: string; width: number; height: number } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setPreview(url)
      setResult(null)

      const img = new window.Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height })
        setWidth(img.width.toString())
        setHeight(img.height.toString())
      }
      img.src = url
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile)
      const url = URL.createObjectURL(droppedFile)
      setPreview(url)
      setResult(null)

      const img = new window.Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height })
        setWidth(img.width.toString())
        setHeight(img.height.toString())
      }
      img.src = url
    }
  }

  const handleWidthChange = (value: string) => {
    setWidth(value)
    if (maintainAspectRatio && value && originalDimensions.width) {
      const ratio = originalDimensions.height / originalDimensions.width
      setHeight(Math.round(Number.parseInt(value) * ratio).toString())
    }
  }

  const handleHeightChange = (value: string) => {
    setHeight(value)
    if (maintainAspectRatio && value && originalDimensions.height) {
      const ratio = originalDimensions.width / originalDimensions.height
      setWidth(Math.round(Number.parseInt(value) * ratio).toString())
    }
  }

  const handleResize = async () => {
    if (!file || !width || !height || !preview) return

    setIsProcessing(true)

    try {
      const img = new window.Image()
      img.crossOrigin = "anonymous"

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = reject
        img.src = preview
      })

      const canvas = canvasRef.current || document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Could not get canvas context")

      const newWidth = Number.parseInt(width)
      const newHeight = Number.parseInt(height)

      canvas.width = newWidth
      canvas.height = newHeight

      // Use high-quality resizing
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"
      ctx.drawImage(img, 0, 0, newWidth, newHeight)

      const dataUrl = canvas.toDataURL("image/png")

      setResult({ dataUrl, width: newWidth, height: newHeight })
    } catch (error) {
      console.error("Resize failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!result || !file) return
    const link = document.createElement("a")
    link.href = result.dataUrl
    link.download = `resized-${file.name.replace(/\.[^/.]+$/, "")}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const presets = [
    { name: "Profile", width: 400, height: 400 },
    { name: "Instagram", width: 1080, height: 1080 },
    { name: "FB Cover", width: 820, height: 312 },
    { name: "Twitter", width: 1500, height: 500 },
    { name: "HD", width: 1920, height: 1080 },
    { name: "4K", width: 3840, height: 2160 },
  ]

  const tips = [
    "Enable aspect ratio to prevent distortion",
    "Use presets for common social media sizes",
    "Upscaling may reduce image quality",
    "Download as PNG for best quality",
  ]

  return (
    <ToolPageLayout
      title="Image Resizer"
      description="Resize images to any dimension while maintaining quality"
      tips={tips}
    >
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex flex-col gap-6">
        {/* Upload Area */}
        <div
          className="relative"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
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
              {originalDimensions.width > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Original: {originalDimensions.width} x {originalDimensions.height} px
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Presets */}
        {file && (
          <div className="flex flex-col gap-2">
            <Label>Quick Presets</Label>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                  onClick={() => {
                    setWidth(preset.width.toString())
                    setHeight(preset.height.toString())
                    setMaintainAspectRatio(false)
                  }}
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Dimension Controls */}
        {file && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Label>Dimensions</Label>
              <div className="flex items-center gap-2">
                <Label htmlFor="aspect-ratio" className="text-sm text-muted-foreground">
                  Lock aspect ratio
                </Label>
                <Switch
                  id="aspect-ratio"
                  checked={maintainAspectRatio}
                  onCheckedChange={setMaintainAspectRatio}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="width" className="text-xs text-muted-foreground">
                  Width (px)
                </Label>
                <Input
                  id="width"
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>
              <div className="flex items-center pt-5">
                {maintainAspectRatio ? (
                  <Link2 className="h-4 w-4 text-heroic-blue" />
                ) : (
                  <Link2Off className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <Label htmlFor="height" className="text-xs text-muted-foreground">
                  Height (px)
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button onClick={handleResize} disabled={!file || !width || !height || isProcessing}>
          {isProcessing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Resizing...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Resize Image
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
                    <p className="text-sm font-medium text-green-500">Image Resized Successfully!</p>
                    <p className="text-xs text-muted-foreground">
                      {originalDimensions.width}x{originalDimensions.height} → {result.width}x{result.height} px
                    </p>
                  </div>
                </div>
              </div>
              <img
                src={result.dataUrl || "/placeholder.svg"}
                alt="Resized preview"
                className="max-h-32 max-w-full rounded-lg mb-4 object-contain mx-auto"
              />
              <Button className="w-full" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download Resized Image
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolPageLayout>
  )
}
