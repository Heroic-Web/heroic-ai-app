'use client'

import { useNotifications } from '@/lib/notification-context'

export function NotificationPanel() {
  const { notifications, markAllRead } = useNotifications()

  return (
    <div className="w-80 p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Notifications</h3>
        <button
          onClick={markAllRead}
          className="text-xs text-blue-600"
        >
          Mark all read
        </button>
      </div>

      {notifications.map((n) => (
        <div
          key={n.id}
          className={`border rounded p-3 ${
            n.read ? 'opacity-60' : 'bg-muted'
          }`}
        >
          <p className="font-medium">{n.title}</p>
          <p className="text-sm text-muted-foreground">
            {n.message}
          </p>
          <p className="text-xs text-muted-foreground">
            Just now
          </p>
        </div>
      ))}
    </div>
  )
}