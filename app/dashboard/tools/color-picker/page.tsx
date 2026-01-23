"use client"

import { useState, useEffect } from "react"
import { ToolPageLayout } from "@/components/tools/tool-page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Copy, Check, Palette, RefreshCw } from "lucide-react"

// Color conversion utilities
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360
  s /= 100
  l /= 100

  let r: number, g: number, b: number

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}

export default function ColorPickerPage() {
  const [hex, setHex] = useState("#3B82F6")
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 })
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 })
  const [copied, setCopied] = useState<string | null>(null)

  const updateFromHex = (newHex: string) => {
    const validHex = newHex.startsWith("#") ? newHex : `#${newHex}`
    if (/^#[0-9A-Fa-f]{6}$/.test(validHex)) {
      setHex(validHex)
      const rgbVal = hexToRgb(validHex)
      if (rgbVal) {
        setRgb(rgbVal)
        setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b))
      }
    }
  }

  const updateFromRgb = (r: number, g: number, b: number) => {
    setRgb({ r, g, b })
    setHex(rgbToHex(r, g, b))
    setHsl(rgbToHsl(r, g, b))
  }

  const updateFromHsl = (h: number, s: number, l: number) => {
    setHsl({ h, s, l })
    const rgbVal = hslToRgb(h, s, l)
    setRgb(rgbVal)
    setHex(rgbToHex(rgbVal.r, rgbVal.g, rgbVal.b))
  }

  const handleCopy = (value: string, format: string) => {
    navigator.clipboard.writeText(value)
    setCopied(format)
    setTimeout(() => setCopied(null), 2000)
  }

  const generateRandomColor = () => {
    const randomHex = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`
    updateFromHex(randomHex)
  }

  const colorFormats = [
    { label: "HEX", value: hex.toUpperCase(), format: "hex" },
    { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, format: "rgb" },
    { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, format: "hsl" },
    { label: "CSS", value: `--color: ${hex};`, format: "css" },
  ]

  const tips = [
    "Click any format to copy to clipboard",
    "Use the sliders for fine control",
    "Generate random colors for inspiration",
    "All formats stay in sync automatically",
  ]

  return (
    <ToolPageLayout
      title="Color Picker"
      description="Pick colors and convert between HEX, RGB, and HSL formats."
      tips={tips}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Color Preview & Picker */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Color Picker
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* Color Preview */}
            <div
              className="h-32 rounded-lg shadow-inner border"
              style={{ backgroundColor: hex }}
            />

            {/* Native Color Picker */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="color"
                  value={hex}
                  onChange={(e) => updateFromHex(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" className="w-full bg-transparent">
                  <Palette className="h-4 w-4 mr-2" />
                  Pick Color
                </Button>
              </div>
              <Button variant="outline" onClick={generateRandomColor} className="bg-transparent">
                <RefreshCw className="h-4 w-4 mr-2" />
                Random
              </Button>
            </div>

            {/* HEX Input */}
            <div className="flex flex-col gap-2">
              <Label>HEX</Label>
              <Input
                value={hex}
                onChange={(e) => updateFromHex(e.target.value)}
                placeholder="#000000"
                className="bg-secondary/50 font-mono"
              />
            </div>

            {/* RGB Sliders */}
            <div className="flex flex-col gap-3">
              <Label>RGB</Label>
              {["r", "g", "b"].map((channel) => (
                <div key={channel} className="flex items-center gap-3">
                  <span className="w-4 text-xs text-muted-foreground uppercase">{channel}</span>
                  <Slider
                    value={[rgb[channel as keyof typeof rgb]]}
                    onValueChange={([val]) =>
                      updateFromRgb(
                        channel === "r" ? val : rgb.r,
                        channel === "g" ? val : rgb.g,
                        channel === "b" ? val : rgb.b
                      )
                    }
                    min={0}
                    max={255}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={rgb[channel as keyof typeof rgb]}
                    onChange={(e) =>
                      updateFromRgb(
                        channel === "r" ? Number(e.target.value) : rgb.r,
                        channel === "g" ? Number(e.target.value) : rgb.g,
                        channel === "b" ? Number(e.target.value) : rgb.b
                      )
                    }
                    min={0}
                    max={255}
                    className="w-16 bg-secondary/50 text-center"
                  />
                </div>
              ))}
            </div>

            {/* HSL Sliders */}
            <div className="flex flex-col gap-3">
              <Label>HSL</Label>
              <div className="flex items-center gap-3">
                <span className="w-4 text-xs text-muted-foreground">H</span>
                <Slider
                  value={[hsl.h]}
                  onValueChange={([val]) => updateFromHsl(val, hsl.s, hsl.l)}
                  min={0}
                  max={360}
                  step={1}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={hsl.h}
                  onChange={(e) => updateFromHsl(Number(e.target.value), hsl.s, hsl.l)}
                  min={0}
                  max={360}
                  className="w-16 bg-secondary/50 text-center"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 text-xs text-muted-foreground">S</span>
                <Slider
                  value={[hsl.s]}
                  onValueChange={([val]) => updateFromHsl(hsl.h, val, hsl.l)}
                  min={0}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={hsl.s}
                  onChange={(e) => updateFromHsl(hsl.h, Number(e.target.value), hsl.l)}
                  min={0}
                  max={100}
                  className="w-16 bg-secondary/50 text-center"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 text-xs text-muted-foreground">L</span>
                <Slider
                  value={[hsl.l]}
                  onValueChange={([val]) => updateFromHsl(hsl.h, hsl.s, val)}
                  min={0}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={hsl.l}
                  onChange={(e) => updateFromHsl(hsl.h, hsl.s, Number(e.target.value))}
                  min={0}
                  max={100}
                  className="w-16 bg-secondary/50 text-center"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Formats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Color Formats</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {colorFormats.map(({ label, value, format }) => (
              <div
                key={format}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors cursor-pointer"
                onClick={() => handleCopy(value, format)}
              >
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{label}</div>
                  <div className="font-mono text-sm">{value}</div>
                </div>
                <Button variant="ghost" size="sm">
                  {copied === format ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}

            {/* Color Variations */}
            <div className="mt-4">
              <Label className="mb-3 block">Variations</Label>
              <div className="grid grid-cols-5 gap-2">
                {[20, 40, 60, 80, 100].map((lightness) => {
                  const varRgb = hslToRgb(hsl.h, hsl.s, lightness)
                  const varHex = rgbToHex(varRgb.r, varRgb.g, varRgb.b)
                  return (
                    <button
                      key={lightness}
                      type="button"
                      className="aspect-square rounded-lg shadow-inner border cursor-pointer hover:scale-105 transition-transform"
                      style={{ backgroundColor: varHex }}
                      onClick={() => updateFromHex(varHex)}
                      title={varHex}
                    />
                  )
                })}
              </div>
            </div>

            {/* Complementary Colors */}
            <div className="mt-4">
              <Label className="mb-3 block">Complementary</Label>
              <div className="grid grid-cols-3 gap-2">
                {[0, 120, 240].map((offset) => {
                  const compH = (hsl.h + offset) % 360
                  const compRgb = hslToRgb(compH, hsl.s, hsl.l)
                  const compHex = rgbToHex(compRgb.r, compRgb.g, compRgb.b)
                  return (
                    <button
                      key={offset}
                      type="button"
                      className="h-12 rounded-lg shadow-inner border cursor-pointer hover:scale-105 transition-transform"
                      style={{ backgroundColor: compHex }}
                      onClick={() => updateFromHex(compHex)}
                      title={compHex}
                    />
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolPageLayout>
  )
}
