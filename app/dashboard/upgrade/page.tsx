"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Check, Zap, Building2, Crown, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function UpgradePage() {
  const { t } = useLanguage()
  const [isYearly, setIsYearly] = useState(true)

  const plans = [
    {
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      description: "For individuals getting started",
      features: [
        "5 AI generations per day",
        "Basic writing tools",
        "3 Heroic Tools",
        "Standard support",
        "1 project",
      ],
      cta: "Current Plan",
      disabled: true,
      icon: Zap,
    },
    {
      name: "Pro",
      price: { monthly: 19, yearly: 190 },
      description: "For professionals and creators",
      features: [
        "Unlimited AI generations",
        "All writing tools & templates",
        "All 50+ Heroic Tools",
        "Priority support",
        "Unlimited projects",
        "Export to Word/PDF",
        "SEO optimization",
        "API access",
      ],
      cta: "Upgrade to Pro",
      popular: true,
      icon: Crown,
    },
    {
      name: "Business",
      price: { monthly: 49, yearly: 490 },
      description: "For teams and agencies",
      features: [
        "Everything in Pro",
        "Team collaboration (5 seats)",
        "Admin dashboard",
        "Custom branding",
        "Advanced analytics",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantee",
      ],
      cta: "Contact Sales",
      icon: Building2,
    },
  ]

  const handleUpgrade = (planName: string) => {
    if (planName === "Business") {
      window.open("mailto:cs.heroicweb@gmail.com?subject=Business Plan Inquiry", "_blank")
    } else {
      alert(`Upgrade to ${planName} plan initiated. In production, this would redirect to a payment page.`)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{t("nav.upgrade")}</h1>
          <p className="text-muted-foreground mt-2">Choose the plan that fits your needs</p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={`text-sm ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
          <Switch checked={isYearly} onCheckedChange={setIsYearly} />
          <span className={`text-sm ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
            Yearly <Badge variant="secondary" className="ml-2 bg-accent/20 text-accent">Save 17%</Badge>
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative bg-card border-border ${
                plan.popular ? "ring-2 ring-accent" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-accent text-accent-foreground">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <div className="mx-auto p-3 rounded-xl bg-secondary/50 w-fit mb-4">
                  <plan.icon className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl text-foreground">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">
                    ${isYearly ? plan.price.yearly : plan.price.monthly}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="text-muted-foreground">/{isYearly ? "year" : "month"}</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                      : plan.disabled
                      ? "bg-secondary text-muted-foreground"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  disabled={plan.disabled}
                  onClick={() => handleUpgrade(plan.name)}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <h3 className="font-medium text-foreground mb-2">Can I cancel anytime?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <h3 className="font-medium text-foreground mb-2">What payment methods do you accept?</h3>
                <p className="text-sm text-muted-foreground">
                  We accept all major credit cards, PayPal, and bank transfers for business plans.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <h3 className="font-medium text-foreground mb-2">Is there a free trial?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! The Free plan gives you access to basic features. You can upgrade anytime to unlock more.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <h3 className="font-medium text-foreground mb-2">Do you offer refunds?</h3>
                <p className="text-sm text-muted-foreground">
                  We offer a 14-day money-back guarantee on all paid plans. No questions asked.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
