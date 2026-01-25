'use server'

type Activity = {
  id: string
  title: string
  type: string
  createdAt: Date
}

let activities: Activity[] = []

export async function createActivity(
  title: string,
  type: string
) {
  const activity: Activity = {
    id: crypto.randomUUID(),
    title,
    type,
    createdAt: new Date(),
  }

  activities.unshift(activity)
  return activity
}

export async function getRecentActivities(limit = 5) {
  return activities.slice(0, limit)
}

export async function getAllActivities() {
  return activities
}