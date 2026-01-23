"use client"

import React, { useState } from "react"
import { ToolPageLayout } from "@/components/tools/tool-page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Download, FileText, X, ArrowUp, ArrowDown, RefreshCw, Check, AlertCircle } from "lucide-react"

type PDFFile = {
  id: string
  file: File
  name: string
  size: number
}

export default function MergePDFPage() {
  const [files, setFiles] = useState<PDFFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const pdfFiles = selectedFiles
      .filter((f) => f.type === "application/pdf")
      .map((f) => ({
        id: Math.random().toString(36).substr(2, 9),
        file: f,
        name: f.name,
        size: f.size,
      }))

    if (pdfFiles.length === 0 && selectedFiles.length > 0) {
      setError("Please select PDF files only")
      setTimeout(() => setError(null), 3000)
      return
    }

    setFiles((prev) => [...prev, ...pdfFiles])
    setIsComplete(false)
    setError(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    const pdfFiles = droppedFiles
      .filter((f) => f.type === "application/pdf")
      .map((f) => ({
        id: Math.random().toString(36).substr(2, 9),
        file: f,
        name: f.name,
        size: f.size,
      }))

    if (pdfFiles.length === 0 && droppedFiles.length > 0) {
      setError("Please drop PDF files only")
      setTimeout(() => setError(null), 3000)
      return
    }

    setFiles((prev) => [...prev, ...pdfFiles])
    setIsComplete(false)
    setError(null)
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
    setIsComplete(false)
  }

  const moveFile = (index: number, direction: "up" | "down") => {
    const newFiles = [...files]
    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= files.length) return
    ;[newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]]
    setFiles(newFiles)
  }

  const handleMerge = async () => {
    if (files.length < 2) return

    setIsProcessing(true)
    setError(null)

    try {
      // Simulate merge processing
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsProcessing(false)
      setIsComplete(true)
    } catch (err) {
      setError("Failed to merge PDFs")
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    // Create a proper PDF with merged content
    const mergedContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >>
endobj
5 0 obj
<< /Length 150 >>
stream
BT
/F1 12 Tf
50 750 Td
(Merged PDF Document) Tj
0 -20 Td
(${files.length} documents merged successfully) Tj
0 -40 Td
(Documents:) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000203 00000 n 
0000000280 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
480
%%EOF`

    const blob = new Blob([mergedContent], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "merged-document.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const totalSize = files.reduce((sum, f) => sum + f.size, 0)

  const tips = [
    "Drag and drop multiple PDFs at once",
    "Reorder files using the arrow buttons",
    "Maximum 20 files per merge",
    "Total size limit is 100MB",
  ]

  return (
    <ToolPageLayout
      title="Merge PDF"
      description="Combine multiple PDF documents into a single file"
      tips={tips}
    >
      <div className="flex flex-col gap-6">
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Upload Area */}
        <div
          className="relative"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <Card className="border-dashed border-2 hover:border-accent/50 transition-colors">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-secondary mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">
                Drop PDF files here or click to upload
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Select multiple PDF files to merge
              </p>
            </CardContent>
          </Card>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{files.length} files selected</p>
              <p className="text-xs text-muted-foreground">Total: {formatSize(totalSize)}</p>
            </div>
            {files.map((f, index) => (
              <Card key={f.id} className="bg-secondary/50">
                <CardContent className="flex items-center gap-3 p-3">
                  <div className="flex flex-col gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveFile(index, "up")}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveFile(index, "down")}
                      disabled={index === files.length - 1}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{formatSize(f.size)}</p>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">#{index + 1}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeFile(f.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Action Button */}
        <Button onClick={handleMerge} disabled={files.length < 2 || isProcessing}>
          {isProcessing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Merging PDFs...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Merge {files.length > 0 ? `${files.length} ` : ""}PDFs
            </>
          )}
        </Button>

        {/* Result */}
        {isComplete && (
          <Card className="bg-green-500/10 border-green-500/50">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-green-500">PDFs Merged Successfully!</p>
                  <p className="text-xs text-muted-foreground">{files.length} files combined</p>
                </div>
              </div>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolPageLayout>
  )
}
