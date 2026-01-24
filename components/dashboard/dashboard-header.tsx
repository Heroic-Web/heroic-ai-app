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
    <header className="sticky top-0 z-40 flex h-16 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-2 h-4" />

      {title && (
        <h1 className="hidden text-lg font-semibold sm:block">
          {title}
        </h1>
      )}

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`${t("common.search")}...`}
            className="w-64 pl-9"
          />
        </div>

        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>

        <LanguageSwitcher />
      </div>
    </header>
  )
}