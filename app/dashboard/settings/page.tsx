"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { User, CreditCard, Bell, Shield, Check, Sparkles } from "lucide-react"
import Loading from "./loading"

function SettingsContent() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "profile"
  const { t, locale } = useLanguage()
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSaveProfile = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: locale === "en" ? "/month" : "/bulan",
      features: locale === "en" ? [
        "5 AI generations per day",
        "Basic writing templates",
        "Standard tools access",
        "Community support",
      ] : [
        "5 generasi AI per hari",
        "Template penulisan dasar",
        "Akses tool standar",
        "Dukungan komunitas",
      ],
      current: true,
    },
    {
      name: "Pro",
      price: "$19",
      period: locale === "en" ? "/month" : "/bulan",
      features: locale === "en" ? [
        "Unlimited AI generations",
        "All writing templates",
        "Full tools access",
        "Priority support",
        "API access",
        "Custom branding",
      ] : [
        "Generasi AI unlimited",
        "Semua template penulisan",
        "Akses semua tool",
        "Dukungan prioritas",
        "Akses API",
        "Branding kustom",
      ],
      current: false,
      popular: true,
    },
    {
      name: "Business",
      price: "$49",
      period: locale === "en" ? "/month" : "/bulan",
      features: locale === "en" ? [
        "Everything in Pro",
        "Team collaboration",
        "Advanced analytics",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantee",
      ] : [
        "Semua fitur Pro",
        "Kolaborasi tim",
        "Analitik lanjutan",
        "Dukungan dedikasi",
        "Integrasi kustom",
        "Jaminan SLA",
      ],
      current: false,
    },
  ]

  return (
    <>
      <DashboardHeader title={t("common.settings")} />
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl">
          <Tabs defaultValue={defaultTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                {locale === "en" ? "Profile" : "Profil"}
              </TabsTrigger>
              <TabsTrigger value="billing" className="gap-2">
                <CreditCard className="h-4 w-4" />
                {locale === "en" ? "Billing" : "Tagihan"}
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                {locale === "en" ? "Notifications" : "Notifikasi"}
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="h-4 w-4" />
                {locale === "en" ? "Security" : "Keamanan"}
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>{locale === "en" ? "Profile Settings" : "Pengaturan Profil"}</CardTitle>
                  <CardDescription>
                    {locale === "en" 
                      ? "Manage your account information and preferences." 
                      : "Kelola informasi akun dan preferensi Anda."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">{locale === "en" ? "Full Name" : "Nama Lengkap"}</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="max-w-md bg-secondary/50"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="max-w-md bg-secondary/50"
                    />
                  </div>

                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="w-fit"
                  >
                    {saved ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        {locale === "en" ? "Saved!" : "Tersimpan!"}
                      </>
                    ) : isSaving ? (
                      locale === "en" ? "Saving..." : "Menyimpan..."
                    ) : (
                      locale === "en" ? "Save Changes" : "Simpan Perubahan"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing">
              <div className="flex flex-col gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{locale === "en" ? "Current Plan" : "Paket Saat Ini"}</CardTitle>
                    <CardDescription>
                      {locale === "en" 
                        ? "You are currently on the Free plan." 
                        : "Anda saat ini menggunakan paket Gratis."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div>
                        <p className="font-semibold">{locale === "en" ? "Free Plan" : "Paket Gratis"}</p>
                        <p className="text-sm text-muted-foreground">
                          {locale === "en" ? "5 AI generations per day" : "5 generasi AI per hari"}
                        </p>
                      </div>
                      <Badge variant="secondary">{locale === "en" ? "Active" : "Aktif"}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-3">
                  {plans.map((plan) => (
                    <Card
                      key={plan.name}
                      className={plan.popular ? "border-heroic-blue" : ""}
                    >
                      <CardHeader>
                        {plan.popular && (
                          <Badge className="w-fit mb-2 bg-heroic-blue text-foreground">
                            <Sparkles className="h-3 w-3 mr-1" />
                            {locale === "en" ? "Most Popular" : "Paling Populer"}
                          </Badge>
                        )}
                        <CardTitle>{plan.name}</CardTitle>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold">{plan.price}</span>
                          <span className="text-muted-foreground">{plan.period}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="flex flex-col gap-2 mb-6">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-sm">
                              <Check className="h-4 w-4 text-heroic-blue shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <Button
                          variant={plan.current ? "outline" : "default"}
                          className={`w-full ${plan.current ? "bg-transparent" : ""}`}
                          disabled={plan.current}
                        >
                          {plan.current 
                            ? (locale === "en" ? "Current Plan" : "Paket Saat Ini")
                            : (locale === "en" ? "Upgrade" : "Tingkatkan")}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>{locale === "en" ? "Notification Preferences" : "Preferensi Notifikasi"}</CardTitle>
                  <CardDescription>
                    {locale === "en" 
                      ? "Choose what notifications you want to receive." 
                      : "Pilih notifikasi yang ingin Anda terima."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  {[
                    { 
                      label: locale === "en" ? "Email notifications" : "Notifikasi email", 
                      description: locale === "en" ? "Receive updates via email" : "Terima pembaruan via email" 
                    },
                    { 
                      label: locale === "en" ? "Marketing emails" : "Email marketing", 
                      description: locale === "en" ? "News and special offers" : "Berita dan penawaran khusus" 
                    },
                    { 
                      label: locale === "en" ? "Product updates" : "Pembaruan produk", 
                      description: locale === "en" ? "New features and improvements" : "Fitur baru dan peningkatan" 
                    },
                    { 
                      label: locale === "en" ? "Security alerts" : "Peringatan keamanan", 
                      description: locale === "en" ? "Important security notifications" : "Notifikasi keamanan penting" 
                    },
                  ].map((item, index) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch defaultChecked={index === 0 || index === 3} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <div className="flex flex-col gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{locale === "en" ? "Change Password" : "Ubah Password"}</CardTitle>
                    <CardDescription>
                      {locale === "en" 
                        ? "Update your password to keep your account secure." 
                        : "Perbarui password untuk menjaga keamanan akun Anda."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="current-password">
                        {locale === "en" ? "Current Password" : "Password Saat Ini"}
                      </Label>
                      <Input
                        id="current-password"
                        type="password"
                        className="max-w-md bg-secondary/50"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="new-password">
                        {locale === "en" ? "New Password" : "Password Baru"}
                      </Label>
                      <Input
                        id="new-password"
                        type="password"
                        className="max-w-md bg-secondary/50"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="confirm-password">
                        {locale === "en" ? "Confirm New Password" : "Konfirmasi Password Baru"}
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        className="max-w-md bg-secondary/50"
                      />
                    </div>
                    <Button className="w-fit">
                      {locale === "en" ? "Update Password" : "Perbarui Password"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{locale === "en" ? "Two-Factor Authentication" : "Autentikasi Dua Faktor"}</CardTitle>
                    <CardDescription>
                      {locale === "en" 
                        ? "Add an extra layer of security to your account." 
                        : "Tambahkan lapisan keamanan ekstra ke akun Anda."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{locale === "en" ? "Enable 2FA" : "Aktifkan 2FA"}</p>
                        <p className="text-sm text-muted-foreground">
                          {locale === "en" 
                            ? "Use an authenticator app for additional security" 
                            : "Gunakan aplikasi autentikator untuk keamanan tambahan"}
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-destructive/50">
                  <CardHeader>
                    <CardTitle className="text-destructive">
                      {locale === "en" ? "Danger Zone" : "Zona Berbahaya"}
                    </CardTitle>
                    <CardDescription>
                      {locale === "en" 
                        ? "Irreversible actions for your account." 
                        : "Tindakan yang tidak dapat dibatalkan untuk akun Anda."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="destructive">
                      {locale === "en" ? "Delete Account" : "Hapus Akun"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SettingsContent />
    </Suspense>
  )
}
