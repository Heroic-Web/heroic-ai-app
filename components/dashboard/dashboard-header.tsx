"use client"

import { useEffect, useRef, useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Bell, Search, AlertTriangle, CheckCircle2, Info, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/language-context"
import { Badge } from "@/components/ui/badge"
import clsx from "clsx"

/* ================= TYPES ================= */
type NotificationType = "warning" | "info" | "success"

type Notification = {
  id: number
  title: string
  message: string
  type: NotificationType
  read: boolean
  time: string
}

interface DashboardHeaderProps {
  title?: string
}

/* ================= COMPONENT ================= */
export function DashboardHeader({ title }: DashboardHeaderProps) {
  const { t, locale } = useLanguage()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  /* ================= MOCK REALTIME NOTIFICATION ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      const samples: Omit<Notification, "id" | "read" | "time">[] = [
        {
          title: locale === "en" ? "Free plan almost used" : "Paket gratis hampir habis",
          message:
            locale === "en"
              ? "You have used 90% of your free quota."
              : "Kamu sudah memakai 90% kuota gratis.",
          type: "warning",
        },
        {
          title: locale === "en" ? "Workflow completed" : "Workflow selesai",
          message:
            locale === "en"
              ? "Your SEO workflow finished successfully."
              : "Workflow SEO kamu berhasil dijalankan.",
          type: "success",
        },
        {
          title: locale === "en" ? "New feature available" : "Fitur baru tersedia",
          message:
            locale === "en"
              ? "AI Workflow Builder is now live."
              : "AI Workflow Builder sudah tersedia.",
          type: "info",
        },
      ]

      const random = samples[Math.floor(Math.random() * samples.length)]

      setNotifications((prev) => [
        {
          id: Date.now(),
          ...random,
          read: false,
          time: locale === "en" ? "Just now" : "Baru saja",
        },
        ...prev,
      ])
    }, 20000) // tiap 20 detik

    return () => clearInterval(interval)
  }, [locale])

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  /* ================= ACTIONS ================= */
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const iconByType = (type: NotificationType) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <header className="sticky top-0 z-[60] flex h-16 items-center gap-2 border-b bg-white px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-2 h-4" />

      {title && <h1 className="hidden text-lg font-semibold sm:block">{title}</h1>}

      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`${t("common.search")}...`}
            className="w-64 pl-9 bg-white"
          />
        </div>

        {/* NOTIFICATIONS */}
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen((v) => !v)}
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </Button>

          {open && (
            <div className="absolute right-0 mt-2 w-96 rounded-xl border bg-white shadow-lg">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <p className="font-semibold">
                  {locale === "en" ? "Notifications" : "Notifikasi"}
                </p>
                <Button variant="ghost" size="sm" onClick={markAllRead}>
                  {locale === "en" ? "Mark all read" : "Tandai semua"}
                </Button>
              </div>

              <div className="max-h-96 overflow-auto">
                {notifications.length === 0 && (
                  <p className="p-4 text-sm text-muted-foreground text-center">
                    {locale === "en"
                      ? "No notifications"
                      : "Tidak ada notifikasi"}
                  </p>
                )}

                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={clsx(
                      "flex gap-3 px-4 py-3 border-b hover:bg-secondary/50",
                      !n.read && "bg-secondary/30",
                    )}
                  >
                    {iconByType(n.type)}

                    <div className="flex-1">
                      <p className="font-medium text-sm">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {n.time}
                      </p>
                    </div>

                    <button onClick={() => removeNotification(n.id)}>
                      <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Language */}
        <LanguageSwitcher />
      </div>
    </header>
  )
}