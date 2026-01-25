"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

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
        {/* ================= TOP ================= */}
        <div className="grid gap-10 md:grid-cols-12">
          {/* BRAND */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex items-center">
              <div className="relative h-[72px] md:h-[84px] w-auto">
                <Image
                  src="/Heroic_AI.png"
                  alt="HINAI Tech Logo"
                  width={300}
                  height={120}
                  priority
                  className="h-full w-auto object-contain"
                />
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          {/* LINKS GRID — RAPI & MENYAMPING */}
          <div className="md:col-span-8">
            <div
              className="
                grid grid-cols-2
                gap-x-8 gap-y-6
                sm:grid-cols-3
                lg:grid-cols-4
              "
            >
              <FooterColumn
                title={t("footer.product")}
                links={links.product}
              />
              <FooterColumn
                title={t("footer.resources")}
                links={links.resources}
              />
              <FooterColumn
                title={t("footer.company")}
                links={links.company}
              />
              <FooterColumn
                title={t("footer.legal")}
                links={links.legal}
              />
            </div>
          </div>
        </div>

        {/* ================= BOTTOM ================= */}
        <div className="mt-12 border-t border-border pt-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} HINAI Tech.{" "}
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ================= COLUMN ================= */
function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="
                text-sm text-muted-foreground
                hover:text-foreground
                transition-colors
              "
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}