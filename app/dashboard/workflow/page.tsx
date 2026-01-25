"use client"

/**
 * =========================================================
 * WORKFLOW PAGE – FULL FIX (SAFE, DEFENSIVE, NO FEATURE REMOVED)
 * =========================================================
 * - All previous features are preserved
 * - Runtime error `.map of undefined` fully prevented
 * - Outputs always normalized
 * - UI guaranteed to render safely
 * - Extra guards, helpers, and comments added
 * - Ready for DB / API / AI integration
 * =========================================================
 */

import { useEffect, useMemo, useState } from "react"
import { useLanguage } from "@/lib/language-context"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  Workflow,
  Plus,
  Play,
  PauseCircle,
  Clock,
  CheckCircle2,
  Sparkles,
  Trash2,
  FileText,
  Bell,
  Info,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react"

/* =========================================================
 * TYPES
 * ========================================================= */

type WorkflowStatus = "active" | "paused"

type WorkflowOutput = {
  id: number
  content: string
  createdAt: string
}

type WorkflowItem = {
  id: number
  name: string
  description: string
  status: WorkflowStatus
  lastRun: string
  runs: number
  outputs?: WorkflowOutput[] // optional for safety
}

type TemplateItem = {
  id: number
  name: string
  description: string
  icon: React.ElementType
  generateOutput: () => string
}

/* =========================================================
 * PAGE
 * ========================================================= */

export default function WorkflowPage() {
  const { t, locale } = useLanguage()

  /* =======================================================
   * STATE
   * ======================================================= */

  const [workflows, setWorkflows] = useState<WorkflowItem[]>([])
  const [notification, setNotification] = useState<string | null>(null)
  const [showGuide, setShowGuide] = useState(true)

  /* =======================================================
   * UTILITIES
   * ======================================================= */

  const nowText = locale === "en" ? "Just now" : "Baru saja"

  const notify = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 3000)
  }

  const normalizeWorkflow = (wf: WorkflowItem): WorkflowItem => {
    return {
      ...wf,
      outputs: Array.isArray(wf.outputs) ? wf.outputs : [],
    }
  }

  const safeWorkflows = useMemo(
    () => workflows.map(normalizeWorkflow),
    [workflows],
  )

  const findWorkflowByName = (name: string) =>
    workflows.find((wf) => wf.name === name)

  const downloadText = (filename: string, text: string) => {
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  /* =======================================================
   * TEMPLATES
   * ======================================================= */

  const templates: TemplateItem[] = [
    {
      id: 1,
      name: "Content Repurposing",
      description: "Turn one content into multiple formats",
      icon: Sparkles,
      generateOutput: () =>
        `INSTAGRAM CAPTION:
Boost your productivity with AI 🚀

TWITTER THREAD:
1/ AI saves time
2/ Repurpose content
3/ Scale faster

LINKEDIN POST:
AI enables teams to ship content consistently.`,
    },
    {
      id: 2,
      name: "SEO Content Workflow",
      description: "Keyword research and SEO optimization",
      icon: Workflow,
      generateOutput: () =>
        `KEYWORDS:
- ai workflow
- seo automation
- content engine

OUTLINE:
1. Intro
2. Benefits
3. Implementation
4. Conclusion`,
    },
    {
      id: 3,
      name: "Product Launch",
      description: "Prepare marketing assets",
      icon: FileText,
      generateOutput: () =>
        `LANDING PAGE:
Launch faster with AI automation.

EMAIL:
Subject: 🚀 Launch Day
Body: Scale your launch with confidence.`,
    },
  ]

  /* =======================================================
   * ACTIONS
   * ======================================================= */

  const runWorkflow = (id: number) => {
    setWorkflows((prev) =>
      prev.map((wf) => {
        if (wf.id !== id) return wf

        const safe = normalizeWorkflow(wf)

        return {
          ...safe,
          status: "active",
          runs: safe.runs + 1,
          lastRun: nowText,
          outputs: [
            ...safe.outputs!,
            {
              id: Date.now(),
              createdAt: nowText,
              content:
                templates.find((t) => t.name === safe.name)
                  ?.generateOutput() ??
                "Generated custom workflow content.",
            },
          ],
        }
      }),
    )

    notify("Workflow dijalankan & menghasilkan output")
  }

  const pauseWorkflow = (id: number) => {
    setWorkflows((prev) =>
      prev.map((wf) =>
        wf.id === id ? { ...wf, status: "paused" } : wf,
      ),
    )
    notify("Workflow dijeda")
  }

  const deleteWorkflow = (id: number) => {
    setWorkflows((prev) => prev.filter((wf) => wf.id !== id))
    notify("Workflow dihapus")
  }

  const createNewWorkflow = () => {
    const name = locale === "en" ? "Custom Workflow" : "Workflow Kustom"
    const existing = findWorkflowByName(name)

    if (existing) {
      const ok = confirm(
        "Workflow ini sudah ada.\nHapus workflow lama dan buat baru?",
      )
      if (!ok) return
      deleteWorkflow(existing.id)
    }

    setWorkflows((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        description:
          locale === "en"
            ? "Custom workflow created manually"
            : "Workflow kustom dibuat manual",
        status: "paused",
        lastRun: locale === "en" ? "Never" : "Belum pernah",
        runs: 0,
        outputs: [],
      },
    ])

    notify("Workflow baru berhasil dibuat")
  }

  const useTemplate = (template: TemplateItem) => {
    const existing = findWorkflowByName(template.name)

    if (existing) {
      const ok = confirm(
        `Template "${template.name}" sudah digunakan.\nHapus workflow lama dan buat ulang?`,
      )
      if (!ok) return
      deleteWorkflow(existing.id)
    }

    setWorkflows((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: template.name,
        description: template.description,
        status: "paused",
        lastRun: locale === "en" ? "Never" : "Belum pernah",
        runs: 0,
        outputs: [],
      },
    ])

    notify(`Template "${template.name}" siap dijalankan`)
  }

  /* =======================================================
   * RENDER
   * ======================================================= */

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-6xl space-y-8">

        {notification && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-black text-white px-4 py-2 text-sm shadow">
            <Bell className="h-4 w-4" />
            {notification}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {t("features.workflow.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("features.workflow.description")}
            </p>
          </div>

          <Button className="gap-2" onClick={createNewWorkflow}>
            <Plus className="h-4 w-4" />
            {locale === "en" ? "New Workflow" : "Workflow Baru"}
          </Button>
        </div>

        <Card>
          <CardContent className="p-4 space-y-3">
            <button
              onClick={() => setShowGuide((v) => !v)}
              className="flex items-center gap-2 font-semibold"
            >
              <Info className="h-4 w-4" />
              Panduan Lengkap Workflow
              {showGuide ? (
                <ChevronUp className="h-4 w-4 ml-auto" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-auto" />
              )}
            </button>

            {showGuide && (
              <div className="text-sm text-muted-foreground space-y-3">
                <p>
                  <b>Workflow</b> adalah sistem otomatis untuk menghasilkan
                  konten nyata.
                </p>
                <ol className="list-decimal ml-5 space-y-1">
                  <li>Buat workflow atau gunakan template</li>
                  <li>Tekan Run untuk menghasilkan output</li>
                  <li>Setiap run menghasilkan dokumen baru</li>
                  <li>Output dapat diunduh</li>
                </ol>
              </div>
            )}
          </CardContent>
        </Card>

        <section className="space-y-4">
          {safeWorkflows.map((wf) => (
            <Card key={wf.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-semibold">{wf.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {wf.description}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {wf.status === "active" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => pauseWorkflow(wf.id)}
                      >
                        <PauseCircle className="h-4 w-4 mr-1 text-yellow-500" />
                        Pause
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => runWorkflow(wf.id)}>
                        <Play className="h-4 w-4 mr-1" />
                        Run
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteWorkflow(wf.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Badge
                  className={
                    wf.status === "active"
                      ? "bg-green-500/10 text-green-600 border-0"
                      : "bg-yellow-500/10 text-yellow-600 border-0"
                  }
                >
                  {wf.status === "active" ? (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  ) : (
                    <Clock className="h-3 w-3 mr-1" />
                  )}
                  {wf.status}
                </Badge>

                {wf.outputs && wf.outputs.length > 0 ? (
                  wf.outputs.map((out) => (
                    <div
                      key={out.id}
                      className="bg-secondary rounded-md p-3 text-xs space-y-2"
                    >
                      <pre className="whitespace-pre-wrap">{out.content}</pre>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          downloadText(
                            `${wf.name}-${out.id}.txt`,
                            out.content,
                          )
                        }
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Belum ada output. Klik Run untuk menghasilkan konten.
                  </p>
                )}

                <p className="text-xs text-muted-foreground">
                  Last run: {wf.lastRun} • Runs: {wf.runs}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-4">
            {locale === "en" ? "Templates" : "Template"}
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            {templates.map((tpl) => (
              <Card key={tpl.id}>
                <CardContent className="p-5 space-y-4">
                  <tpl.icon className="h-6 w-6 text-primary" />
                  <div>
                    <h4 className="font-semibold">{tpl.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {tpl.description}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => useTemplate(tpl)}
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