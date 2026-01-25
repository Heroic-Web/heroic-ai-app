"use client"

import React, { useState } from "react"
import { ToolPageLayout } from "@/components/tools/tool-page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Upload,
  Download,
  FileText,
  X,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Check,
  AlertCircle,
} from "lucide-react"

/* =========================================================
 * TYPES
 * ========================================================= */

type PDFFile = {
  id: string
  file: File
  name: string
  size: number
}

/* =========================================================
 * PAGE
 * ========================================================= */

export default function MergePDFPage() {
  const [files, setFiles] = useState<PDFFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null)

  /* =========================================================
   * FILE HANDLING
   * ========================================================= */

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])

    const pdfFiles = selectedFiles
      .filter((f) => f.type === "application/pdf")
      .map((f) => ({
        id: crypto.randomUUID(),
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
    setMergedBlob(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)

    const pdfFiles = droppedFiles
      .filter((f) => f.type === "application/pdf")
      .map((f) => ({
        id: crypto.randomUUID(),
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
    setMergedBlob(null)
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
    setIsComplete(false)
    setMergedBlob(null)
  }

  const moveFile = (index: number, direction: "up" | "down") => {
    const newFiles = [...files]
    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= files.length) return
    ;[newFiles[index], newFiles[newIndex]] = [
      newFiles[newIndex],
      newFiles[index],
    ]
    setFiles(newFiles)
  }

  /* =========================================================
   * CORE MERGE LOGIC (REAL PDF MERGE)
   * ========================================================= */

    const handleMerge = async () => {
      if (files.length < 2) return

      setIsProcessing(true)
      setError(null)

      try {
        const formData = new FormData()
        files.forEach((f) => formData.append("files", f.file))

        const res = await fetch("/api/merge-pdf", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Merge failed")
        }

        const blob = await res.blob()
        setMergedBlob(blob)
        setIsComplete(true)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsProcessing(false)
      }
    }

  /* =========================================================
   * DOWNLOAD
   * ========================================================= */

  const handleDownload = () => {
    if (!mergedBlob) return
    const url = URL.createObjectURL(mergedBlob)
    const a = document.createElement("a")
    a.href = url
    a.download = "merged-document.pdf"
    a.click()
    URL.revokeObjectURL(url)
  }

  /* =========================================================
   * HELPERS
   * ========================================================= */

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024)
      return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const totalSize = files.reduce((sum, f) => sum + f.size, 0)

  const tips = [
    "Drag & drop multiple PDF files",
    "Reorder files before merging",
    "All original content is preserved",
    "Images, text, and layout remain intact",
  ]

  /* =========================================================
   * RENDER
   * ========================================================= */

  return (
    <ToolPageLayout
      title="Merge PDF"
      description="Combine multiple PDF files into one without losing content"
      tips={tips}
    >
      <div className="flex flex-col gap-6">

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Upload */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative"
        >
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileSelect}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
          />
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center py-12">
              <FileText className="h-8 w-8 mb-3" />
              <p className="text-sm font-medium">
                Drop PDF files or click to upload
              </p>
            </CardContent>
          </Card>
        </div>

        {/* File List */}
        {files.map((f, index) => (
          <Card key={f.id} className="bg-secondary/50">
            <CardContent className="flex items-center gap-3 p-3">
              <div className="flex flex-col">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => moveFile(index, "up")}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => moveFile(index, "down")}
                  disabled={index === files.length - 1}
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {f.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatSize(f.size)}
                </p>
              </div>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeFile(f.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Merge Button */}
        <Button
          onClick={handleMerge}
          disabled={files.length < 2 || isProcessing}
        >
          {isProcessing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Merging...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Merge PDFs
            </>
          )}
        </Button>

        {/* Result */}
        {isComplete && (
          <Card className="bg-green-500/10 border-green-500/40">
            <CardContent className="flex justify-between items-center p-4">
              <div className="flex gap-2 items-center">
                <Check className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-green-500">
                    Merge Successful
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {files.length} PDFs merged •{" "}
                    {formatSize(totalSize)}
                  </p>
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