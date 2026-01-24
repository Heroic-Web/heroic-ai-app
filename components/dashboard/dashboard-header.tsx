"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/language-context"

interface DashboardHeaderProps {
  title?: string
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const { t } = useLanguage()

  return (
    <header
      className="
        sticky top-0 z-[60]
        flex h-16 items-center gap-2
        border-b border-border
        bg-white text-foreground
        px-4
      "
    >
      {/* Sidebar toggle */}
      <SidebarTrigger className="-ml-1" />

      <Separator orientation="vertical" className="mx-2 h-4" />

      {/* Title */}
      {title && (
        <h1 className="hidden text-lg font-semibold sm:block">
          {title}
        </h1>
      )}

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-2">
        {/* Search desktop */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`${t("common.search")}...`}
            className="w-64 pl-9 bg-white"
          />
        </div>

        {/* Search mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </Button>

        {/* Language */}
        <LanguageSwitcher />
      </div>
    </header>
  )
}