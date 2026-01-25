"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  Workflow,
  Plus,
  Play,
  Clock,
  CheckCircle2,
  Sparkles,
  PauseCircle,
} from "lucide-react"

/* ================= TYPES ================= */
type WorkflowStatus = "active" | "paused"

type WorkflowItem = {
  id: number
  name: string
  description: string
  status: WorkflowStatus
  lastRun: string
  runs: number
}

type TemplateItem = {
  id: number
  name: string
  description: string
  icon: React.ElementType
}

/* ================= PAGE ================= */
export default function WorkflowPage() {
  const { t, locale } = useLanguage()

  const [workflows, setWorkflows] = useState<WorkflowItem[]>([
    {
      id: 1,
      name: locale === "en" ? "Blog Post Pipeline" : "Pipeline Artikel Blog",
      description:
        locale === "en"
          ? "Generate ideas, write content, and schedule publication"
          : "Buat ide, tulis konten, dan jadwalkan publikasi",
      status: "active",
      lastRun: locale === "en" ? "2 hours ago" : "2 jam lalu",
      runs: 15,
    },
    {
      id: 2,
      name: locale === "en" ? "Social Media Manager" : "Manajer Media Sosial",
      description:
        locale === "en"
          ? "Create posts for multiple platforms from one brief"
          : "Buat postingan untuk banyak platform dari satu brief",
      status: "paused",
      lastRun: locale === "en" ? "3 days ago" : "3 hari lalu",
      runs: 42,
    },
  ])

  const templates: TemplateItem[] = [
    {
      id: 1,
      name: locale === "en" ? "Content Repurposing" : "Repurposing Konten",
      description:
        locale === "en"
          ? "Turn one content into multiple formats"
          : "Ubah satu konten menjadi banyak format",
      icon: Sparkles,
    },
    {
      id: 2,
      name: locale === "en" ? "SEO Content Workflow" : "Workflow Konten SEO",
      description:
        locale === "en"
          ? "Keyword research, writing, and SEO optimization"
          : "Riset keyword, penulisan, dan optimasi SEO",
      icon: Workflow,
    },
    {
      id: 3,
      name: locale === "en" ? "Product Launch" : "Peluncuran Produk",
      description:
        locale === "en"
          ? "Prepare all marketing assets for launch"
          : "Siapkan semua aset marketing peluncuran",
      icon: Play,
    },
  ]

  /* ================= ACTIONS ================= */
  const toggleWorkflow = (id: number) => {
    setWorkflows((prev) =>
      prev.map((wf) =>
        wf.id === id
          ? { ...wf, status: wf.status === "active" ? "paused" : "active" }
          : wf,
      ),
    )
  }

  const useTemplate = (template: TemplateItem) => {
    const newWorkflow: WorkflowItem = {
      id: Date.now(),
      name: template.name,
      description: template.description,
      status: "active",
      lastRun: locale === "en" ? "Never" : "Belum pernah",
      runs: 0,
    }

    setWorkflows((prev) => [newWorkflow, ...prev])
  }

  /* ================= RENDER ================= */
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t("features.workflow.title")}
            </h2>
            <p className="text-muted-foreground mt-1">
              {t("features.workflow.description")}
            </p>
          </div>

          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {locale === "en" ? "New Workflow" : "Workflow Baru"}
          </Button>
        </div>

        {/* ================= MY WORKFLOWS ================= */}
        <section className="mb-12">
          <h3 className="text-lg font-semibold mb-4">
            {locale === "en" ? "My Workflows" : "Workflow Saya"}
          </h3>

          <div className="grid gap-4">
            {workflows.map((workflow) => (
              <Card
                key={workflow.id}
                className="hover:bg-secondary/50 transition"
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                    <Workflow className="h-6 w-6 text-muted-foreground" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{workflow.name}</h4>
                      <Badge
                        className={
                          workflow.status === "active"
                            ? "bg-green-500/10 text-green-600 border-0"
                            : "bg-yellow-500/10 text-yellow-600 border-0"
                        }
                      >
                        {workflow.status === "active" ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {workflow.status === "active"
                          ? locale === "en"
                            ? "Active"
                            : "Aktif"
                          : locale === "en"
                          ? "Paused"
                          : "Dijeda"}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {workflow.description}
                    </p>
                  </div>

                  <div className="hidden md:block text-right text-sm text-muted-foreground">
                    <p>
                      {locale === "en" ? "Last run:" : "Terakhir:"}{" "}
                      {workflow.lastRun}
                    </p>
                    <p>
                      {workflow.runs}{" "}
                      {locale === "en" ? "total runs" : "total eksekusi"}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleWorkflow(workflow.id)}
                  >
                    {workflow.status === "active" ? (
                      <>
                        <PauseCircle className="h-4 w-4 mr-1" />
                        {locale === "en" ? "Pause" : "Jeda"}
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        {locale === "en" ? "Run" : "Jalankan"}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ================= TEMPLATES ================= */}
        <section>
          <h3 className="text-lg font-semibold mb-4">
            {locale === "en" ? "Templates" : "Template"}
          </h3>

          <div className="grid gap-4 md:grid-cols-3">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="hover:bg-secondary/50 transition"
              >
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-heroic-blue/10 text-heroic-blue">
                    <template.icon className="h-6 w-6" />
                  </div>

                  <div>
                    <h4 className="font-semibold">{template.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => useTemplate(template)}
                  >
                    {locale === "en" ? "Use Template" : "Gunakan Template"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}