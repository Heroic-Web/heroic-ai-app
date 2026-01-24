"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  Menu,
  X,
  Sparkles,
  Wrench,
  CreditCard,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const { t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-50
        bg-background text-foreground
        border-b border-border
        isolate
      "
    >
      {/* ================= DESKTOP NAV ================= */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* LEFT */}
        <div className="flex items-center gap-8">
          {/* Logo */}
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

          {/* Nav links (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Sparkles className="h-4 w-4 text-heroic-blue" />
              {t("nav.features")}
            </Link>

            <Link
              href="#tools"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Wrench className="h-4 w-4 text-heroic-blue" />
              {t("nav.tools")}
            </Link>

            <Link
              href="#pricing"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <CreditCard className="h-4 w-4 text-heroic-blue" />
              {t("nav.pricing")}
            </Link>
          </div>
        </div>

        {/* RIGHT (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <LanguageSwitcher />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              {t("nav.login")}
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">{t("nav.getStarted")}</Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4">
          <div className="flex flex-col gap-4">
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Sparkles className="h-4 w-4 text-heroic-blue" />
              {t("nav.features")}
            </Link>

            <Link
              href="#tools"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Wrench className="h-4 w-4 text-heroic-blue" />
              {t("nav.tools")}
            </Link>

            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <CreditCard className="h-4 w-4 text-heroic-blue" />
              {t("nav.pricing")}
            </Link>

            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>

            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.login")}
              </Button>
            </Link>

            <Link href="/register">
              <Button
                size="sm"
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.getStarted")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}