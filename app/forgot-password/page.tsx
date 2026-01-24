"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Loader2, ArrowLeft, Mail, Check } from "lucide-react"
import Image from "next/image"

export default function ForgotPasswordPage() {
  const { t, locale } = useLanguage()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate sending reset email
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <Link href="/" className="flex items-center">
            <div className="relative h-[72px] md:h-[84px] w-auto">
              <Image
                src="/Heroic_AI.png"
                alt="HINTech Studio Logo"
                width={300}
                height={120}
                priority
                className="h-full w-auto object-contain"
              />
            </div>
          </Link>
        <LanguageSwitcher />
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            {isSubmitted ? (
              <>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                  <Check className="h-6 w-6 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold">
                  {locale === "en" ? "Check your email" : "Cek email Anda"}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {locale === "en" 
                    ? `We have sent a password reset link to` 
                    : `Kami telah mengirim link reset password ke`} <strong>{email}</strong>
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-heroic-blue/10">
                  <Mail className="h-6 w-6 text-heroic-blue" />
                </div>
                <h1 className="text-2xl font-bold">{t("auth.forgotPassword")}</h1>
                <p className="text-muted-foreground mt-2">
                  {locale === "en" 
                    ? "Enter your email address and we will send you a link to reset your password." 
                    : "Masukkan alamat email Anda dan kami akan mengirimkan link untuk mereset password Anda."}
                </p>
              </>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {isSubmitted ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground text-center">
                  {locale === "en" 
                    ? "Did not receive the email? Check your spam folder or" 
                    : "Tidak menerima email? Cek folder spam atau"}
                </p>
                <Button
                  variant="outline"
                  onClick={() => setIsSubmitted(false)}
                  className="w-full bg-transparent"
                >
                  {locale === "en" ? "Try another email" : "Coba email lain"}
                </Button>
                <Link href="/login">
                  <Button variant="ghost" className="w-full gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    {locale === "en" ? "Back to login" : "Kembali ke login"}
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">{t("auth.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-secondary/50"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {locale === "en" ? "Sending..." : "Mengirim..."}
                    </>
                  ) : (
                    locale === "en" ? "Send reset link" : "Kirim link reset"
                  )}
                </Button>

                <Link href="/login">
                  <Button variant="ghost" className="w-full gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    {locale === "en" ? "Back to login" : "Kembali ke login"}
                  </Button>
                </Link>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
