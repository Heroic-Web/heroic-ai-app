"use client"

import React, { Suspense } from "react"
import Loading from "./loading"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Mail, 
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

const faqs = [
  {
    question: "How do I generate content with AI Writer?",
    answer: "Navigate to AI Writer from the sidebar, select your content type (article, social post, email, etc.), enter your topic and keywords, choose your preferred tone and word count, then click 'Generate'. The AI will create SEO-optimized content based on your specifications."
  },
  {
    question: "What file formats can I export?",
    answer: "You can export your content in multiple formats including Markdown (.md), Microsoft Word (.docx), and plain text (.txt). The DOCX export includes proper formatting, headings, and your target keywords."
  },
  {
    question: "How do the HINAI Tech Tools work?",
    answer: "HINAI Tech Tools are specialized utilities for various tasks. Each tool has a specific function - from image compression to PDF merging. Simply upload your file or enter your text, adjust the settings, and click the action button to process."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take security seriously. All data is encrypted in transit and at rest. We do not store your generated content on our servers longer than necessary for processing. You can delete your account and all associated data at any time."
  },
  {
    question: "Can I use the generated content commercially?",
    answer: "Yes! All content generated through HINAI Tech is yours to use commercially. There are no restrictions on how you use the content you create with our tools."
  },
  {
    question: "What's the difference between Free and Pro plans?",
    answer: "Free users get 5 AI generations per day and access to basic tools. Pro users get unlimited generations, all 50+ HINAI Tech Tools, export capabilities, SEO optimization features, and priority support."
  }
]

export default function HelpPage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const filteredFaqs = faqs.filter(
    faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setContactForm({ name: "", email: "", message: "" })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-foreground">{t("nav.help")}</h1>
            <p className="text-muted-foreground mt-2">Find answers and get support</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-card border-border hover:border-accent/50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20">
                  <Book className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Documentation</p>
                  <p className="text-sm text-muted-foreground">Learn how to use</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border hover:border-accent/50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <MessageCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Community</p>
                  <p className="text-sm text-muted-foreground">Join discussions</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border hover:border-accent/50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Mail className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Email Support</p>
                  <p className="text-sm text-muted-foreground">Get help directly</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <HelpCircle className="h-5 w-5 text-accent" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border"
                />
              </div>

              <div className="space-y-2">
                {filteredFaqs.map((faq, index) => (
                  <div key={index} className="border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors"
                    >
                      <span className="font-medium text-foreground">{faq.question}</span>
                      {expandedFaq === index ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <div className="px-4 pb-4 text-muted-foreground">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Mail className="h-5 w-5 text-accent" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Your Name</Label>
                      <Input
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="John Doe"
                        required
                        className="bg-secondary/50 border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="john@example.com"
                        required
                        className="bg-secondary/50 border-border"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Describe your issue or question..."
                      required
                      className="min-h-[120px] bg-secondary/50 border-border resize-none"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">Need immediate assistance?</p>
            <Button variant="outline" asChild>
              <a href="mailto:support@heroicai.studio" className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4" />
                support@heroicai.studio
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Suspense>
  )
}
