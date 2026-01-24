"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import Image from "next/image"

export function Footer() {
  const { t } = useLanguage()

  const links = {
    product: [
      { label: t("footer.features"), href: "#features" },
      { label: t("footer.pricing"), href: "#pricing" },
      { label: t("footer.tools"), href: "/tools" },
      { label: t("footer.api"), href: "#" },
    ],
    resources: [
      { label: t("footer.docs"), href: "#" },
      { label: t("footer.blog"), href: "#" },
      { label: t("footer.tutorials"), href: "#" },
      { label: t("footer.support"), href: "#" },
    ],
    company: [
      { label: t("footer.about"), href: "/about" },
      { label: t("footer.careers"), href: "#" },
      { label: t("footer.contact"), href: "#" },
      { label: t("footer.partners"), href: "#" },
    ],
    legal: [
      { label: t("footer.privacy"), href: "/privacy" },
      { label: t("footer.terms"), href: "/terms" },
      { label: t("footer.cookies"), href: "#" },
    ],
  }

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center">
            <div className="relative h-[72px] md:h-[84px] w-auto">
              <Image
                src="/Heroic_AI.png"
                alt="Heroic AI Studio Logo"
                width={300}
                height={120}
                priority
                className="h-full w-auto object-contain"
              />
            </div>
          </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">{t("footer.product")}</h4>
            <ul className="flex flex-col gap-3">
              {links.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">{t("footer.resources")}</h4>
            <ul className="flex flex-col gap-3">
              {links.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">{t("footer.company")}</h4>
            <ul className="flex flex-col gap-3">
              {links.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">{t("footer.legal")}</h4>
            <ul className="flex flex-col gap-3">
              {links.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Heroic AI Studio. {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  )
}
