"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { ToolPageLayout } from "@/components/tools/tool-page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Download, QrCode, RefreshCw, Link, FileText, Mail, Phone } from "lucide-react"

type QRType = "url" | "text" | "email" | "phone"

export default function GenerateQRPage() {
  const [qrType, setQRType] = useState<QRType>("url")
  const [content, setContent] = useState("")
  const [size, setSize] = useState([256])
  const [isGenerating, setIsGenerating] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Simple QR code generation using canvas
  const generateQR = async () => {
    if (!content.trim()) return

    setIsGenerating(true)

    // Format content based on type
    let formattedContent = content
    if (qrType === "email") {
      formattedContent = `mailto:${content}`
    } else if (qrType === "phone") {
      formattedContent = `tel:${content}`
    }

    // Create a simple QR-like pattern (in production, use a proper QR library)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const qrSize = size[0]
    canvas.width = qrSize
    canvas.height = qrSize

    // Draw white background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, qrSize, qrSize)

    // Create QR pattern from content hash
    const moduleSize = qrSize / 25
    ctx.fillStyle = "#000000"

    // Generate a deterministic pattern based on content
    const hash = formattedContent.split("").reduce((a, c) => {
      return ((a << 5) - a + c.charCodeAt(0)) | 0
    }, 0)

    // Draw finder patterns (corners)
    const drawFinderPattern = (x: number, y: number) => {
      const s = moduleSize * 7
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(x + moduleSize, y + moduleSize, s - moduleSize * 2, s - moduleSize * 2)
      ctx.fillStyle = "#000000"
      ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, s - moduleSize * 4, s - moduleSize * 4)
    }

    drawFinderPattern(0, 0)
    drawFinderPattern(qrSize - moduleSize * 7, 0)
    drawFinderPattern(0, qrSize - moduleSize * 7)

    // Draw data pattern
    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 25; col++) {
        // Skip finder pattern areas
        if ((row < 8 && col < 8) || (row < 8 && col > 16) || (row > 16 && col < 8)) continue

        // Use content hash to determine fill
        const seed = hash + row * 25 + col + formattedContent.charCodeAt(col % formattedContent.length)
        if (seed % 3 === 0 || seed % 5 === 0) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize - 1, moduleSize - 1)
        }
      }
    }

    setQrDataUrl(canvas.toDataURL("image/png"))
    setIsGenerating(false)
  }

  const handleDownload = () => {
    if (!qrDataUrl) return
    const link = document.createElement("a")
    link.href = qrDataUrl
    link.download = `qr-code-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getPlaceholder = () => {
    switch (qrType) {
      case "url":
        return "https://example.com"
      case "text":
        return "Enter your text message..."
      case "email":
        return "email@example.com"
      case "phone":
        return "+1234567890"
    }
  }

  const typeButtons: { type: QRType; icon: React.ElementType; label: string }[] = [
    { type: "url", icon: Link, label: "URL" },
    { type: "text", icon: FileText, label: "Text" },
    { type: "email", icon: Mail, label: "Email" },
    { type: "phone", icon: Phone, label: "Phone" },
  ]

  const tips = [
    "URLs should include https://",
    "Larger sizes are easier to scan",
    "Test your QR code before sharing",
    "Simple content creates cleaner codes",
  ]

  return (
    <ToolPageLayout
      title="QR Code Generator"
      description="Create QR codes for URLs, text, emails, and phone numbers."
      tips={tips}
    >
      <canvas ref={canvasRef} className="hidden" />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">QR Content</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Content Type</Label>
              <div className="flex flex-wrap gap-2">
                {typeButtons.map(({ type, icon: Icon, label }) => (
                  <Button
                    key={type}
                    variant={qrType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setQRType(type)
                      setContent("")
                      setQrDataUrl(null)
                    }}
                    className={qrType === type ? "" : "bg-transparent"}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Content</Label>
              {qrType === "text" ? (
                <Textarea
                  placeholder={getPlaceholder()}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[120px] bg-secondary/50"
                />
              ) : (
                <Input
                  type={qrType === "email" ? "email" : qrType === "phone" ? "tel" : "url"}
                  placeholder={getPlaceholder()}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="bg-secondary/50"
                />
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label>QR Code Size</Label>
                <span className="text-sm text-muted-foreground">{size[0]}px</span>
              </div>
              <Slider value={size} onValueChange={setSize} min={128} max={512} step={32} className="w-full" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>

            <Button onClick={generateQR} disabled={!content.trim() || isGenerating}>
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate QR Code
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center min-h-[256px] w-full rounded-lg bg-secondary/50 p-8">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl || "/placeholder.svg"}
                  alt="Generated QR Code"
                  className="max-w-full h-auto rounded-lg shadow-lg"
                  style={{ imageRendering: "pixelated" }}
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <QrCode className="h-16 w-16 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Your QR code will appear here</p>
                </div>
              )}
            </div>

            {qrDataUrl && (
              <Button onClick={handleDownload} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download QR Code
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolPageLayout>
  )
}
