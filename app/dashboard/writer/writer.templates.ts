import { ContentTemplate, GeneratePayload } from "./writer.types"

/* =========================================================
 * TEMPLATE DEFINITIONS (OUTPUT BERBEDA TOTAL)
 * ========================================================= */

export const CONTENT_TEMPLATES: ContentTemplate[] = [
  {
    id: "article",
    label: "Article",
    description: "Long-form informative article",
    structure: [
      "Introduction",
      "Background & Context",
      "Main Discussion",
      "Examples & Case Study",
      "Conclusion",
    ],
  },
  {
    id: "blog",
    label: "Blog Post",
    description: "SEO friendly blog post",
    structure: [
      "Hook / Opening",
      "Problem Explanation",
      "Tips & Solutions",
      "Call To Action",
    ],
  },
  {
    id: "ad",
    label: "Ad Copy",
    description: "High converting advertisement",
    structure: [
      "Attention Grabber",
      "Problem",
      "Solution",
      "Benefits",
      "Strong CTA",
    ],
  },
  {
    id: "email",
    label: "Email",
    description: "Professional or marketing email",
    structure: [
      "Subject Line",
      "Greeting",
      "Main Message",
      "Call To Action",
      "Signature",
    ],
  },
  {
    id: "social",
    label: "Social Media",
    description: "Short engaging social post",
    structure: [
      "Hook",
      "Main Message",
      "Emoji / Hashtag",
    ],
  },
  {
    id: "product",
    label: "Product Description",
    description: "E-commerce ready product copy",
    structure: [
      "Product Overview",
      "Key Features",
      "Benefits",
      "Why Choose This Product",
      "CTA",
    ],
  },
]

/* =========================================================
 * CORE GENERATOR (AKURAT & KONSISTEN)
 * ========================================================= */

export function generateByTemplate(payload: GeneratePayload): string {
  const {
    topic,
    keywords,
    tone,
    wordCount,
    language,
    contentType,
  } = payload

  const template = CONTENT_TEMPLATES.find(
    (t) => t.id === contentType,
  )

  const keywordLine = keywords
    ? language === "id"
      ? `Kata kunci utama: ${keywords}`
      : `Primary keywords: ${keywords}`
    : ""

  let result = ""

  template?.structure.forEach((section) => {
    result += `## ${section}\n\n`
    result += generateParagraph(
      topic,
      section,
      tone,
      language,
    )
    result += "\n\n"
  })

  result += `---\n${keywordLine}\n`
  result += `Tone: ${tone} | Language: ${language}\n`
  result += `Target length: ${wordCount} words\n`

  return result
}

/* =========================================================
 * PARAGRAPH ENGINE
 * ========================================================= */

function generateParagraph(
  topic: string,
  section: string,
  tone: string,
  language: string,
): string {
  if (language === "id") {
    return `Bagian **${section}** membahas topik *${topic}* dengan gaya ${tone}. Konten ini dirancang agar relevan, mudah dipahami, dan memberikan nilai nyata bagi pembaca.`
  }

  return `The **${section}** section discusses *${topic}* using a ${tone} tone. This content is crafted to be clear, engaging, and valuable for the reader.`
}