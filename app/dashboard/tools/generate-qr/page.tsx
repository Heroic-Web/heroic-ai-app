"use client"

import React, { useState, useRef } from "react"
import * as QRCode from "qrcode"

import { ToolPageLayout } from "@/components/tools/tool-page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

import {
  Download,
  QrCode,
  RefreshCw,
  Link,
  FileText,
  Mail,
  Phone,
  Wifi,
  User,
} from "lucide-react"

/* ================================
 * TYPES
 * ================================ */
type QRType =
  | "url"
  | "text"
  | "email"
  | "phone"
  | "wifi"
  | "vcard"

/* ================================
 * PAGE
 * ================================ */
export default function GenerateQRPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [qrType, setQRType] = useState<QRType>("url")
  const [content, setContent] = useState("")
  const [size, setSize] = useState([256])
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  /* ================================
   * FORMATTER (INI KUNCI QR VALID)
   * ================================ */
  const formatQRContent = () => {
    switch (qrType) {
      case "url":
        return content.startsWith("http") ? content : `https://${content}`

      case "email":
        return `mailto:${content}`

      case "phone":
        return `tel:${content}`

      case "wifi":
        // Format WiFi standard
        // WIFI:T:WPA;S:SSID;P:PASSWORD;;
        return content

      case "vcard":
        return content

      case "text":
      default:
        return content
    }
  }

  /* ================================
   * GENERATE QR (REAL & SCANNABLE)
   * ================================ */
  const generateQR = async () => {
    if (!content.trim()) return

    setIsGenerating(true)

    try {
      const formatted = formatQRContent()

      const canvas = canvasRef.current
      if (!canvas) return

      await QRCode.toCanvas(canvas, formatted, {
        width: size[0],
        margin: 2,
        errorCorrectionLevel: "H",
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      })

      setQrDataUrl(canvas.toDataURL("image/png"))
    } catch (err) {
      console.error("QR ERROR:", err)
      alert("Gagal membuat QR Code")
    } finally {
      setIsGenerating(false)
    }
  }

  /* ================================
   * DOWNLOAD
   * ================================ */
  const handleDownload = () => {
    if (!qrDataUrl) return
    const a = document.createElement("a")
    a.href = qrDataUrl
    a.download = `qr-${qrType}-${Date.now()}.png`
    a.click()
  }

  /* ================================
   * PLACEHOLDER / TEMPLATE
   * ================================ */
  const getPlaceholder = () => {
    switch (qrType) {
      case "url":
        return "https://example.com"
      case "email":
        return "hello@example.com"
      case "phone":
        return "+628123456789"
      case "wifi":
        return "WIFI:T:WPA;S:MyWifi;P:password123;;"
      case "vcard":
        return `BEGIN:VCARD
VERSION:3.0
N:Doe;John
FN:John Doe
TEL:+628123456789
EMAIL:john@email.com
END:VCARD`
      default:
        return "Masukkan teks bebas"
    }
  }

  /* ================================
   * UI
   * ================================ */
  const typeButtons = [
    { type: "url", label: "URL", icon: Link },
    { type: "text", label: "Text", icon: FileText },
    { type: "email", label: "Email", icon: Mail },
    { type: "phone", label: "Phone", icon: Phone },
    { type: "wifi", label: "WiFi", icon: Wifi },
    { type: "vcard", label: "VCard", icon: User },
  ]

  const tips = [
    "QR ini VALID & bisa discan oleh WhatsApp, Google Lens, dll",
    "Gunakan Error Correction High agar lebih awet",
    "WiFi & VCard punya format khusus (lihat template)",
    "Ukuran besar lebih mudah discan",
  ]

  return (
    <ToolPageLayout
      title="QR Code Generator"
      description="Generate QR Code untuk URL, Email, Phone, WiFi, VCard, dan Text."
      tips={tips}
    >
      <canvas ref={canvasRef} className="hidden" />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* INPUT */}
        <Card>
          <CardHeader>
            <CardTitle>QR Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>QR Type</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {typeButtons.map(({ type, label, icon: Icon }) => (
                  <Button
                    key={type}
                    size="sm"
                    variant={qrType === type ? "default" : "outline"}
                    onClick={() => {
                      setQRType(type as QRType)
                      setContent("")
                      setQrDataUrl(null)
                    }}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Content</Label>
              {qrType === "text" || qrType === "wifi" || qrType === "vcard" ? (
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="min-h-[140px]"
                />
              ) : (
                <Input
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={getPlaceholder()}
                />
              )}
            </div>

            <div>
              <Label>Size: {size[0]}px</Label>
              <Slider
                value={size}
                onValueChange={setSize}
                min={128}
                max={512}
                step={32}
              />
            </div>

            <Button
              onClick={generateQR}
              disabled={!content.trim() || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate QR
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* PREVIEW */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="min-h-[260px] w-full flex items-center justify-center bg-secondary/50 rounded-lg">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  className="rounded-lg shadow-lg"
                  style={{ imageRendering: "pixelated" }}
                />
              ) : (
                <QrCode className="h-16 w-16 text-muted-foreground opacity-30" />
              )}
            </div>

            {qrDataUrl && (
              <Button onClick={handleDownload} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download PNG
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolPageLayout>
  )
}