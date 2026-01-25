'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

/* ======================
   TYPE (ANTI MERAH)
====================== */
type Activity = {
  id: string
  title: string
  type: string
  createdAt: string
}

export default function RecentProjectsPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/activity/all')
      .then((res) => res.json())
      .then((data) => {
        setActivities(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">All Recent Projects</h1>

      {loading && (
        <p className="text-muted-foreground">
          Loading activities...
        </p>
      )}

      {!loading && activities.length === 0 && (
        <p className="text-muted-foreground">
          Belum ada aktivitas.
        </p>
      )}

      {!loading &&
        activities.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {item.type} •{' '}
              {new Date(item.createdAt).toLocaleString()}
            </CardContent>
          </Card>
        ))}
    </div>
  )
}