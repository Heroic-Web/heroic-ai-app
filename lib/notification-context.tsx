'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { Notification } from '@/types/notification'

type NotificationContextType = {
  notifications: Notification[]
  unreadCount: number
  addNotification: (n: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void
  markAllRead: () => void
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (
    n: Omit<Notification, 'id' | 'read' | 'createdAt'>
  ) => {
    setNotifications((prev) => [
      {
        id: crypto.randomUUID(),
        read: false,
        createdAt: new Date().toISOString(),
        ...n,
      },
      ...prev,
    ])
  }

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    )
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, addNotification, markAllRead }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx)
    throw new Error('useNotifications must be inside provider')
  return ctx
}