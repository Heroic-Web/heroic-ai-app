"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"

interface User {
  id: string
  name: string
  email: string
  picture?: string
  createdAt: string
  provider: "email" | "google"
}

interface AuthResult {
  success: boolean
  error?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<AuthResult>
  register: (name: string, email: string, password: string) => Promise<AuthResult>
  loginWithGoogle: () => Promise<AuthResult>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USERS_KEY = "heroic_users"
const CURRENT_USER_KEY = "heroic_current_user"

function getUsers(): Record<string, { password: string; user: User }> {
  if (typeof window === "undefined") return {}
  try {
    const users = localStorage.getItem(USERS_KEY)
    return users ? JSON.parse(users) : {}
  } catch {
    return {}
  }
}

function saveUsers(users: Record<string, { password: string; user: User }>) {
  if (typeof window === "undefined") return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return
    const savedUser = localStorage.getItem(CURRENT_USER_KEY)
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem(CURRENT_USER_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const users = getUsers()
    const userEntry = users[email.toLowerCase()]

    if (!userEntry) {
      return { success: false, error: "No account found with this email" }
    }

    if (userEntry.user.provider === "google") {
      return { success: false, error: "This account uses Google Sign-In. Please use the Google button." }
    }

    if (userEntry.password !== password) {
      return { success: false, error: "Incorrect password" }
    }

    setUser(userEntry.user)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userEntry.user))
    return { success: true }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string): Promise<AuthResult> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const users = getUsers()
    const emailLower = email.toLowerCase()

    if (users[emailLower]) {
      return { success: false, error: "An account with this email already exists" }
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email: emailLower,
      createdAt: new Date().toISOString(),
      provider: "email",
    }

    users[emailLower] = { password, user: newUser }
    saveUsers(users)

    setUser(newUser)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser))
    return { success: true }
  }, [])

  const loginWithGoogle = useCallback(async (): Promise<AuthResult> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const googleUser: User = {
      id: crypto.randomUUID(),
      name: "Google User",
      email: `user.${Date.now()}@gmail.com`,
      picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      createdAt: new Date().toISOString(),
      provider: "google",
    }
    
    const users = getUsers()
    users[googleUser.email] = { password: "", user: googleUser }
    saveUsers(users)
    
    setUser(googleUser)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(googleUser))
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem(CURRENT_USER_KEY)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
