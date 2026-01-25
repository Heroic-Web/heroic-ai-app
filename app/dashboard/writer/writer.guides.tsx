"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function WriterGuides() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Writing & SEO Tips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>• Gunakan keyword utama di judul</p>
        <p>• Buat paragraf pendek & jelas</p>
        <p>• Gunakan heading (H2/H3)</p>
        <p>• Sertakan CTA jika perlu</p>
        <p>• Sesuaikan tone dengan audiens</p>
      </CardContent>
    </Card>
  )
}