import { NextResponse } from "next/server"

/**
 * SIMULASI AKTIVITAS SISTEM
 * (nanti bisa diganti DB / prisma.notification)
 */
export async function GET() {
  const now = new Date().toISOString()

  return NextResponse.json([
    {
      id: Date.now() + 1,
      title: "Free plan almost used",
      message: "You have used 90% of your free quota.",
      type: "warning",
      read: false,
      time: "Just now",
      activity: "quota",
      createdAt: now,
    },
    {
      id: Date.now() + 2,
      title: "Workflow completed",
      message: "Your SEO workflow finished successfully.",
      type: "success",
      read: false,
      time: "Just now",
      activity: "workflow",
      createdAt: now,
    },
    {
      id: Date.now() + 3,
      title: "Speech to Text finished",
      message: "Audio transcription completed successfully.",
      type: "success",
      read: true,
      time: "2 minutes ago",
      activity: "speech-to-text",
      createdAt: now,
    },
    {
      id: Date.now() + 4,
      title: "New login detected",
      message: "Your account was logged in from a new device.",
      type: "info",
      read: true,
      time: "1 second ago",
      activity: "auth",
      createdAt: now,
    },
    {
      id: Date.now() + 5,
      title: "New feature available",
      message: "AI Workflow Builder is now live.",
      type: "info",
      read: true,
      time: "1 hour ago",
      activity: "feature",
      createdAt: now,
    },
  ])
}