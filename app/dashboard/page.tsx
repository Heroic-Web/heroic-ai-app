"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  FileText,
  ImageIcon,
  Upload,
  ArrowRight,
  Sparkles,
  FileIcon,
  Clock,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { t } = useLanguage()
  const { user } = useAuth()

  const quickActions = [
    {
      title: t("dashboard.newArticle"),
      description: "Start writing with AI",
      icon: FileText,
      href: "/dashboard/writer",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: t("dashboard.newDesign"),
      description: "Create with AI Image",
      icon: ImageIcon,
      href: "/dashboard/design",
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      title: t("dashboard.uploadFile"),
      description: "Convert, compress, edit",
      icon: Upload,
      href: "/dashboard/tools",
      color: "bg-green-500/10 text-green-500",
    },
  ]

  const recentProjects = [
    {
      id: 1,
      title: "Marketing Blog Post",
      type: "Article",
      updatedAt: "2 hours ago",
      icon: FileText,
    },
    {
      id: 2,
      title: "Social Media Banner",
      type: "Design",
      updatedAt: "5 hours ago",
      icon: ImageIcon,
    },
    {
      id: 3,
      title: "Product Description",
      type: "Copy",
      updatedAt: "1 day ago",
      icon: FileIcon,
    },
  ]

  const usageStats = {
    aiGenerations: { used: 45, total: 100 },
    storage: { used: 2.4, total: 5 },
    tools: { used: 12, total: "unlimited" },
  }

  return (
    <>
      <DashboardHeader title={t("nav.dashboard")} />
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-6xl">
          {/* Welcome */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              {t("dashboard.welcome")}, {user?.name || "User"}!
            </h2>
            <p className="text-muted-foreground mt-1">
              What would you like to create today?
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">
              {t("dashboard.quickActions")}
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <Card className="group cursor-pointer transition-all hover:border-heroic-blue/50 hover:bg-secondary/50">
                    <CardContent className="flex items-center gap-4 p-6">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color}`}
                      >
                        <action.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{action.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Projects */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">
                    {t("dashboard.recentProjects")}
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    {t("dashboard.viewAll")}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    {recentProjects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-secondary/50"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                          <project.icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{project.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {project.type}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {project.updatedAt}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Usage Stats */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("dashboard.usage")}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  {/* AI Generations */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-heroic-blue" />
                        <span className="text-sm font-medium">AI Generations</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {usageStats.aiGenerations.used}/{usageStats.aiGenerations.total}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-heroic-blue"
                        style={{
                          width: `${(usageStats.aiGenerations.used / usageStats.aiGenerations.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Storage */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileIcon className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Storage</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {usageStats.storage.used}GB / {usageStats.storage.total}GB
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{
                          width: `${(usageStats.storage.used / usageStats.storage.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Tools Used */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium">Tools Used Today</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {usageStats.tools.used}
                      </span>
                    </div>
                  </div>

                  <Link href="/dashboard/upgrade">
                    <Button variant="outline" className="w-full mt-2 bg-transparent">
                      Upgrade for More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
