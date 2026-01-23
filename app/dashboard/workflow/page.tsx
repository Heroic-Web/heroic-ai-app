"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Workflow, Plus, Play, Clock, CheckCircle2, Sparkles } from "lucide-react"

export default function WorkflowPage() {
  const { t, locale } = useLanguage()

  const workflows = [
    {
      id: 1,
      name: locale === "en" ? "Blog Post Pipeline" : "Pipeline Artikel Blog",
      description: locale === "en" 
        ? "Generate topic ideas, write content, and schedule publication" 
        : "Buat ide topik, tulis konten, dan jadwalkan publikasi",
      status: "active",
      lastRun: locale === "en" ? "2 hours ago" : "2 jam lalu",
      runs: 15,
    },
    {
      id: 2,
      name: locale === "en" ? "Social Media Manager" : "Manajer Media Sosial",
      description: locale === "en" 
        ? "Create posts for multiple platforms from a single brief" 
        : "Buat postingan untuk berbagai platform dari satu brief",
      status: "paused",
      lastRun: locale === "en" ? "3 days ago" : "3 hari lalu",
      runs: 42,
    },
    {
      id: 3,
      name: locale === "en" ? "Email Newsletter" : "Newsletter Email",
      description: locale === "en" 
        ? "Weekly newsletter generation and scheduling" 
        : "Pembuatan dan penjadwalan newsletter mingguan",
      status: "active",
      lastRun: locale === "en" ? "1 day ago" : "1 hari lalu",
      runs: 8,
    },
  ]

  const templates = [
    {
      name: locale === "en" ? "Content Repurposing" : "Repurposing Konten",
      description: locale === "en" 
        ? "Turn one piece of content into multiple formats" 
        : "Ubah satu konten menjadi berbagai format",
      icon: Sparkles,
    },
    {
      name: locale === "en" ? "SEO Content Workflow" : "Workflow Konten SEO",
      description: locale === "en" 
        ? "Research keywords, generate content, optimize for SEO" 
        : "Riset keyword, buat konten, optimasi untuk SEO",
      icon: Workflow,
    },
    {
      name: locale === "en" ? "Product Launch" : "Peluncuran Produk",
      description: locale === "en" 
        ? "Create all marketing materials for a product launch" 
        : "Buat semua materi marketing untuk peluncuran produk",
      icon: Play,
    },
  ]

  return (
    <>
      <DashboardHeader title={t("features.workflow.title")} />
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-6xl">
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

          {/* My Workflows */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold mb-4">
              {locale === "en" ? "My Workflows" : "Workflow Saya"}
            </h3>
            <div className="grid gap-4">
              {workflows.map((workflow) => (
                <Card key={workflow.id} className="hover:bg-secondary/50 transition-colors">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                      <Workflow className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{workflow.name}</h4>
                        <Badge
                          variant={workflow.status === "active" ? "default" : "secondary"}
                          className={
                            workflow.status === "active"
                              ? "bg-green-500/10 text-green-500 border-0"
                              : ""
                          }
                        >
                          {workflow.status === "active" ? (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {workflow.status === "active" 
                            ? (locale === "en" ? "active" : "aktif")
                            : (locale === "en" ? "paused" : "dijeda")}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{workflow.description}</p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground hidden md:block">
                      <p>{locale === "en" ? "Last run:" : "Terakhir:"} {workflow.lastRun}</p>
                      <p>{workflow.runs} {locale === "en" ? "total runs" : "total eksekusi"}</p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Play className="h-4 w-4 mr-1" />
                      {locale === "en" ? "Run" : "Jalankan"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Templates */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {locale === "en" ? "Templates" : "Template"}
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              {templates.map((template) => (
                <Card
                  key={template.name}
                  className="cursor-pointer hover:border-heroic-blue/50 hover:bg-secondary/50 transition-all"
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
                    <Button variant="outline" size="sm" className="bg-transparent w-full">
                      {locale === "en" ? "Use Template" : "Gunakan Template"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
