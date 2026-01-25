"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"
import {
  LayoutDashboard,
  FileText,
  Wrench,
  Palette,
  Workflow,
  Settings,
  ChevronsUpDown,
  LogOut,
  User,
  CreditCard,
  Sparkles,
} from "lucide-react"

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()
  const { user, logout } = useAuth()

  const mainNavItems = [
    { title: t("nav.dashboard"), url: "/dashboard", icon: LayoutDashboard },
    { title: t("writer.title"), url: "/dashboard/writer", icon: FileText },
    { title: t("tools.title"), url: "/dashboard/tools", icon: Wrench },
    { title: t("features.design.title"), url: "/dashboard/design", icon: Palette },
    { title: t("features.workflow.title"), url: "/dashboard/workflow", icon: Workflow },
  ]

  const secondaryNavItems = [
    { title: t("common.settings"), url: "/dashboard/settings", icon: Settings },
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const userInitials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"

  return (
    <Sidebar collapsible="icon" className="bg-background">
      {/* ===== Sidebar Header (SOLID) ===== */}
      <SidebarHeader className="flex items-center justify-center border-b bg-background px-4 py-4">
        <Link href="/" className="flex items-center justify-center">
          <div className="relative h-[56px] w-auto">
            <Image
              src="/Heroic_AI.png"
              alt="HINAI Tech Logo"
              width={220}
              height={88}
              priority
              className="h-full w-auto object-contain"
            />
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      {/* ===== Main Navigation ===== */}
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.url)}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ===== Upgrade Banner ===== */}
        <SidebarGroup className="mt-auto group-data-[collapsible=icon]:hidden">
          <div className="rounded-lg border bg-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-heroic-blue" />
              <span className="text-sm font-medium">
                {t("nav.upgrade")}
              </span>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">
              Get unlimited AI generations and access all tools.
            </p>
            <Link
              href="/dashboard/upgrade"
              className="inline-flex w-full items-center justify-center rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background hover:bg-foreground/90"
            >
              Upgrade Now
            </Link>
          </div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      {/* ===== User Menu ===== */}
      <SidebarFooter className="bg-background p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-heroic-blue text-background">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left text-sm leading-tight">
                    <span className="block truncate font-semibold">
                      {user?.name || "User"}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {user?.email || "user@example.com"}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                side="top"
                sideOffset={6}
                className="w-56"
              >
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings?tab=profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings?tab=billing">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}