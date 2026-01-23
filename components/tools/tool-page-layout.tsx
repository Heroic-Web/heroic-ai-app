"use client"

import { ReactNode } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ToolPageLayoutProps {
  title: string
  description: string
  children: ReactNode
  tips?: string[]
}

export function ToolPageLayout({
  title,
  description,
  children,
  tips,
}: ToolPageLayoutProps) {
  return (
    <>
      <DashboardHeader title={title} />
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl">
          {/* Back Button */}
          <Link href="/dashboard/tools" className="inline-block mb-6">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Button>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>

          {/* Main Content */}
          <div className="mb-6">
            {children}
          </div>

          {/* Tips */}
          {tips && tips.length > 0 && (
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle className="text-base">Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                  {tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-accent font-medium">{index + 1}.</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
