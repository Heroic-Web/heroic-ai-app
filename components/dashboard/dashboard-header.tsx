"use client"

import { useEffect, useRef, useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import {
  Bell,
  Search,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  Mic,
  LogIn,
  CreditCard,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/language-context"
import clsx from "clsx"

/* ================= TYPES ================= */
type NotificationType = "warning" | "info" | "success" | "error"

type Notification = {
  id: number
  title: string
  message: string
  type: NotificationType
  activity: string
  read: boolean
  time: string
}

/* ================= CONFIG ================= */
const POLLING_INTERVAL = 90_000 // 90 detik
const NOTIF_INTERVAL = 60_000   // 1 menit per notif

/* ================= COMPONENT ================= */
export function DashboardHeader({ title }: { title?: string }) {
  const { t, locale } = useLanguage()

  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])

  const dropdownRef = useRef<HTMLDivElement>(null)

  /** 🔐 ID notif yang sudah pernah tampil */
  const knownIdsRef = useRef<Set<number>>(new Set())

  /** 📥 queue internal */
  const queueRef = useRef<Notification[]>([])
  const isProcessingRef = useRef(false)

  /* ======================================================
    FETCH DARI API (TIDAK LANGSUNG RENDER)
  ====================================================== */
  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" })
      if (!res.ok) return

      const data: Notification[] = await res.json()

      const fresh = data.filter((n) => !knownIdsRef.current.has(n.id))

      if (fresh.length > 0) {
        queueRef.current.push(...fresh)
        processQueue()
      }
    } catch (e) {
      console.error("notif error", e)
    }
  }

  /* ======================================================
    PROSES QUEUE SATU-SATU (ANTI SPAM)
  ====================================================== */
  const processQueue = () => {
    if (isProcessingRef.current) return
    if (queueRef.current.length === 0) return

    isProcessingRef.current = true

    const next = queueRef.current.shift()
    if (!next) {
      isProcessingRef.current = false
      return
    }

    knownIdsRef.current.add(next.id)

    setNotifications((prev) => [
      {
        ...next,
        read: false,
        time: locale === "en" ? "Just now" : "Baru saja",
      },
      ...prev,
    ])

    setTimeout(() => {
      isProcessingRef.current = false
      processQueue()
    }, NOTIF_INTERVAL)
  }

  /* ======================================================
    INIT & POLLING
  ====================================================== */
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, POLLING_INTERVAL)
    return () => clearInterval(interval)
  }, [locale])

  /* ======================================================
    CLICK OUTSIDE
  ====================================================== */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  /* ======================================================
    ACTIONS
  ====================================================== */
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const iconByActivity = (activity: string) => {
    switch (activity) {
      case "quota":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "workflow":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "speech-to-text":
        return <Mic className="h-4 w-4 text-purple-500" />
      case "auth":
        return <LogIn className="h-4 w-4 text-blue-500" />
      case "payment":
        return <CreditCard className="h-4 w-4 text-emerald-500" />
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />
    }
  }

  /* ======================================================
    UI
  ====================================================== */
  return (
    <header className="sticky top-0 z-[60] flex h-16 items-center gap-2 border-b bg-white px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-2 h-4" />

      {title && <h1 className="hidden text-lg font-semibold sm:block">{title}</h1>}

      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={`${t("common.search")}...`} className="w-64 pl-9" />
        </div>

        {/* NOTIF */}
        <div className="relative" ref={dropdownRef}>
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>

          {open && (
            <div className="absolute right-0 mt-2 w-96 rounded-xl border bg-white shadow-lg">
              <div className="flex justify-between px-4 py-3 border-b">
                <p className="font-semibold">Notifications</p>
                <Button size="sm" variant="ghost" onClick={markAllRead}>
                  Mark all read
                </Button>
              </div>

              <div className="max-h-96 overflow-auto">
                {notifications.length === 0 && (
                  <p className="p-4 text-sm text-muted-foreground text-center">
                    No notifications
                  </p>
                )}

                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={clsx(
                      "flex gap-3 px-4 py-3 border-b",
                      !n.read && "bg-secondary/30",
                    )}
                  >
                    {iconByActivity(n.activity)}

                    <div className="flex-1">
                      <p className="font-medium text-sm">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {n.time}
                      </p>
                    </div>

                    <button onClick={() => removeNotification(n.id)}>
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <LanguageSwitcher />
      </div>
    </header>
  )
}