"use client"

import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import {
  Zap,
  Layers,
  ShieldCheck,
  Globe,
  Cpu,
  Workflow,
} from "lucide-react"

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background">
        <section className="container mx-auto max-w-6xl px-6 py-20">
          {/* ================= HEADER ================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              About Heroic AI Studio
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
              Heroic AI Studio is a modern AI platform built to help businesses
              create smarter, faster, and more scalable digital solutions.
            </p>
          </motion.div>

          {/* ================= COMPANY OVERVIEW ================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="space-y-8 text-muted-foreground leading-relaxed max-w-4xl mx-auto"
          >
            <p>
              <strong className="text-foreground">
                Heroic AI Studio
              </strong>{" "}
              is an AI-powered application platform designed to support product
              development, business automation, and intelligent digital
              workflows. The platform integrates AI tools, modern web
              technologies, and scalable infrastructure into one unified
              workspace.
            </p>

            <p>
              This application is officially developed and operated by{" "}
              <strong className="text-foreground">
                PT Heroic Inovasi Nusantara
              </strong>
              , a technology company focused on innovation, automation, and the
              real-world application of artificial intelligence for businesses
              and organizations.
            </p>

            <p>
              Through Heroic AI Studio, users can access a collection of
              AI driven tools for content generation, document processing,
              workflow automation, and digital optimization—enabling teams to
              work more efficiently and make data-driven decisions.
            </p>
          </motion.div>

          {/* ================= FEATURES GRID ================= */}
          <div className="my-20">
            <h2 className="text-2xl font-semibold text-center mb-12">
              Platform Capabilities
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: Cpu,
                  title: "AI Powered Tools",
                  desc: "A growing suite of intelligent tools for content creation, automation, and data processing.",
                },
                {
                  icon: Workflow,
                  title: "Workflow Automation",
                  desc: "Streamline repetitive tasks and business processes with AI-driven workflows.",
                },
                {
                  icon: Layers,
                  title: "Scalable Architecture",
                  desc: "Built with modern, scalable system architecture suitable for startups to enterprises.",
                },
                {
                  icon: ShieldCheck,
                  title: "Security & Reliability",
                  desc: "Designed with security best practices to ensure data protection and system stability.",
                },
                {
                  icon: Globe,
                  title: "Global & Multi language",
                  desc: "Cloud-based infrastructure with multi-language support for global users.",
                },
                {
                  icon: Zap,
                  title: "Fast Time to Market",
                  desc: "Accelerate digital product development and deployment with ready-to-use AI components.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <item.icon className="h-8 w-8 text-primary mb-4" />
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ================= TABLE SECTION ================= */}
          <div className="my-24">
            <h2 className="text-2xl font-semibold text-center mb-10">
              Why Choose Heroic AI Studio
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border border-border rounded-lg">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Aspect
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Heroic AI Studio
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-4 py-3">Technology Focus</td>
                    <td className="px-4 py-3">
                      AI-first platform with modern web stack
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Target Users</td>
                    <td className="px-4 py-3">
                      Businesses, startups, institutions, enterprises
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Developer</td>
                    <td className="px-4 py-3">
                      PT Heroic Inovasi Nusantara
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Core Value</td>
                    <td className="px-4 py-3">
                      Efficiency, innovation, scalability
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Use Cases</td>
                    <td className="px-4 py-3">
                      Automation, content generation, digital transformation
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ================= VISION ================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <h2 className="text-2xl font-semibold">Our Vision</h2>
            <p className="text-muted-foreground">
              Our vision is to become a trusted AI technology partner that helps
              organizations adopt intelligent systems seamlessly and
              sustainably. Through Heroic AI Studio, PT Heroic Inovasi Nusantara
              aims to bridge the gap between advanced AI technology and practical
              business solutions.
            </p>
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  )
}