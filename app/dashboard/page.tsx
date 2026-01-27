'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { useAuth } from '@/lib/auth-context'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import {
  FileText,
  ImageIcon,
  Upload,
  ArrowRight,
  Sparkles,
  FileIcon,
  Clock,
  LucideIcon,
  Rocket,
  Star,
  Mic,      
  Lock,    
} from 'lucide-react'

/* ======================
   TYPES
====================== */

type QuickAction = {
  title: string
  description: string
  icon: LucideIcon
  href: string
  color: string
  badge?: 'PRO' 
}

type RecentProject = {
  id: number
  title: string
  type: string
  updatedAt: string
  icon: LucideIcon
}

/* ======================
   PAGE
====================== */

export default function DashboardPage() {
  const { t } = useLanguage()
  const { user } = useAuth()

  /* ======================
     QUICK ACTIONS
  ====================== */

  const quickActions: QuickAction[] = [
    {
      title: t('dashboard.newArticle'),
      description:
        'Transform ideas into impactful writing powered by intelligent AI assistance.',
      icon: FileText,
      href: '/dashboard/writer',
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: t('dashboard.newDesign'),
      description:
        'Design stunning visuals, banners, and creative assets in just a few clicks.',
      icon: ImageIcon,
      href: '/dashboard/design',
      color: 'bg-purple-500/10 text-purple-500',
    },
    {
      title: t('dashboard.uploadFile'),
      description:
        'Upload, convert, compress, and manage your files effortlessly.',
      icon: Upload,
      href: '/dashboard/tools',
      color: 'bg-green-500/10 text-green-500',
    },
    {
      title: 'Speech to Text Notes',
      description:
        'Convert audio into editable text with realtime transcription and smart notes.',
      icon: Mic,
      href: '/dashboard/speech-to-text',
      color: 'bg-orange-500/10 text-orange-500',
      badge: 'PRO',
    },
  ]

  /* ======================
     RECENT PROJECTS (DUMMY)
  ====================== */

  const recentProjects: RecentProject[] = [
    {
      id: 1,
      title: 'Marketing Blog Post',
      type: 'AI Article',
      updatedAt: '2 hours ago',
      icon: FileText,
    },
    {
      id: 2,
      title: 'Social Media Banner',
      type: 'Visual Design',
      updatedAt: '5 hours ago',
      icon: ImageIcon,
    },
    {
      id: 3,
      title: 'Product Description',
      type: 'Copywriting',
      updatedAt: '1 day ago',
      icon: FileIcon,
    },
    {
      id: 4,
      title: 'Meeting Notes Transcription',
      type: 'Speech to Text (PRO)',
      updatedAt: '1 day ago',
      icon: Mic,
    },
  ]

  /* ======================
     USAGE STATS
  ====================== */

  const usageStats = {
    aiGenerations: {
      used: 45,
      total: 100,
      percent: 45,
    },
    storage: {
      used: 2.4,
      total: 5,
      percent: 48,
    },
    tools: {
      used: 12,
    },
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-6xl space-y-10">

        {/* ======================
           WELCOME SECTION
        ====================== */}
        <section className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">
            {t('dashboard.welcome')}, {user?.name || 'Creator'} 👋
          </h2>

          <p className="max-w-3xl text-muted-foreground leading-relaxed">
            Welcome to your personal creative command center. This dashboard
            is designed to help you turn raw ideas into polished results
            faster, smarter, and with far less effort. Whether you’re writing,
            designing, or managing files, everything you need lives right here.
          </p>

          <p className="max-w-3xl text-muted-foreground leading-relaxed">
            Think of this space as your digital workshop a place where
            creativity meets productivity. Every click you make moves your
            project one step closer to something remarkable.
          </p>

          <p className="max-w-3xl text-muted-foreground leading-relaxed">
            Ready to dive in? Explore the tools, check your recent projects,
            and see your usage stats at a glance. Your next big idea is just a
            few clicks away.
          </p>

          <p className="max-w-3xl text-muted-foreground leading-relaxed">
            Let’s make something amazing today!
          </p>
        </section>

        {/* ======================
           QUICK ACTIONS
        ====================== */}
        <section>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Rocket className="h-5 w-5 text-heroic-blue" />
            {t('dashboard.quickActions')}
          </h3>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <Card className="group cursor-pointer transition hover:border-heroic-blue/50 hover:bg-secondary/50">
                {action.badge === 'PRO' && (
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black px-2 py-0.5 text-xs text-white">
                      <Lock className="h-3 w-3" />
                      PRO
                    </div>
                  )}
                  
                  <CardContent className="flex items-center gap-4 p-6">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color}`}
                    >
                      <action.icon className="h-6 w-6" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <h4 className="font-semibold">{action.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>

                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* ======================
           MAIN CONTENT
        ====================== */}
        <section className="grid gap-6 lg:grid-cols-3">

          {/* ===== RECENT PROJECTS ===== */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  {t('dashboard.recentProjects')}
                </CardTitle>

                <Button asChild variant="ghost" size="sm">
                  <Link
                    href="/dashboard/recent-projects"
                    className="flex items-center gap-1 text-muted-foreground"
                  >
                    {t('dashboard.viewAll')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>

              <CardContent className="space-y-3">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center gap-4 rounded-lg border p-4 transition hover:bg-secondary/50"
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

                <p className="pt-4 text-sm text-muted-foreground leading-relaxed">
                  Your recent projects appear here so you can instantly continue
                  where you left off. No more searching, no more friction
                  productivity stays uninterrupted.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* ===== USAGE ===== */}
          <Card>
            <CardHeader>
              <CardTitle>
                {t('dashboard.usage')}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">

              {/* AI Generations */}
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <Sparkles className="h-4 w-4 text-heroic-blue" />
                    AI Generations
                  </span>
                  <span className="text-muted-foreground">
                    {usageStats.aiGenerations.used}/{usageStats.aiGenerations.total}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-heroic-blue"
                    style={{ width: `${usageStats.aiGenerations.percent}%` }}
                  />
                </div>
              </div>

              {/* Storage */}
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <FileIcon className="h-4 w-4 text-green-500" />
                    Storage
                  </span>
                  <span className="text-muted-foreground">
                    {usageStats.storage.used}GB / {usageStats.storage.total}GB
                  </span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${usageStats.storage.percent}%` }}
                  />
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Keep track of your usage to stay in control. Upgrade anytime to
                unlock more power, more storage, and limitless creative freedom.
              </p>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Need help managing your account or understanding your usage?
                Visit the support center or contact our team for assistance.
              </p>

              <Link href="/dashboard/upgrade">
                <Button variant="outline" className="w-full">
                  Upgrade for More
                </Button>
              </Link>

            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}