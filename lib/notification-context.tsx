"use client"

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { Notification } from "@/types/notification"

/* ======================================================
  CONFIG
====================================================== */
const NOTIFICATION_INTERVAL = 60000 // ⏱️ 1 menit / notif

/* ======================================================
  CONTEXT TYPE
====================================================== */
type NotificationContextType = {
  notifications: Notification[]
  unreadCount: number

  /** tambah notif (AMAN, lewat queue) */
  addNotification: (
    n: Omit<Notification, "id" | "read" | "createdAt">
  ) => void

  markAllRead: () => void
  removeNotification: (id: string) => void
}

/* ======================================================
  CONTEXT
====================================================== */
const NotificationContext =
  createContext<NotificationContextType | null>(null)

/* ======================================================
  PROVIDER
====================================================== */
export function NotificationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  /** 🔑 queue & control */
  const queueRef = useRef<Notification[]>([])
  const isProcessingRef = useRef(false)

  /** 🔒 anti duplicate */
  const knownIdsRef = useRef<Set<string>>(new Set())

  /* ======================================================
    PROCESS QUEUE (SATU-SATU)
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

    setNotifications((prev) => [next, ...prev])

    setTimeout(() => {
      isProcessingRef.current = false
      processQueue()
    }, NOTIFICATION_INTERVAL)
  }

  /* ======================================================
    ADD NOTIFICATION (PUBLIC API)
  ====================================================== */
  const addNotification = (
    n: Omit<Notification, "id" | "read" | "createdAt">
  ) => {
    const id = crypto.randomUUID()

    if (knownIdsRef.current.has(id)) return
    knownIdsRef.current.add(id)

    const notif: Notification = {
      id,
      read: false,
      createdAt: new Date().toISOString(),
      ...n,
    }

    queueRef.current.push(notif)
    processQueue()
  }

  /* ======================================================
    ACTIONS
  ====================================================== */
  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    )
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((n) => n.id !== id)
    )
  }

  const unreadCount = notifications.filter(
    (n) => !n.read
  ).length

  /* ======================================================
    VALUE
  ====================================================== */
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAllRead,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

/* ======================================================
  HOOK
====================================================== */
export const useNotifications = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    )
  }
  return ctx
}