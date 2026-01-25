"use client"

import React, { createContext, useContext, useState, useMemo } from "react"

/* ================= TYPES ================= */

type UsageState = {
  aiUsed: number
  aiLimit: number
  storageUsedMB: number
  storageLimitMB: number
}

type UsageContextType = {
  usage: UsageState
  consumeAI: (count?: number) => void
  consumeStorage: (mb: number) => void
  resetUsage: () => void
}

/* ================= CONTEXT ================= */

const UsageContext = createContext<UsageContextType | undefined>(undefined)

/* ================= PROVIDER ================= */

export function UsageProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [usage, setUsage] = useState<UsageState>({
    aiUsed: 0,
    aiLimit: 100,
    storageUsedMB: 0,
    storageLimitMB: 5 * 1024, // 5GB
  })

  const consumeAI = (count: number = 1) => {
    setUsage((prev) => ({
      ...prev,
      aiUsed: Math.min(prev.aiUsed + count, prev.aiLimit),
    }))
  }

  const consumeStorage = (mb: number) => {
    setUsage((prev) => ({
      ...prev,
      storageUsedMB: Math.min(
        prev.storageUsedMB + mb,
        prev.storageLimitMB,
      ),
    }))
  }

  const resetUsage = () => {
    setUsage({
      aiUsed: 0,
      aiLimit: 100,
      storageUsedMB: 0,
      storageLimitMB: 5 * 1024,
    })
  }

  const value = useMemo(
    () => ({
      usage,
      consumeAI,
      consumeStorage,
      resetUsage,
    }),
    [usage],
  )

  return (
    <UsageContext.Provider value={value}>
      {children}
    </UsageContext.Provider>
  )
}

/* ================= HOOK ================= */

export function useUsage() {
  const context = useContext(UsageContext)
  if (!context) {
    throw new Error("useUsage must be used inside UsageProvider")
  }
  return context
}