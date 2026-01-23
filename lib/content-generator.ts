// AI Content Generator - Generates SEO-optimized articles

interface GenerateOptions {
  topic: string
  keywords: string
  tone: string
  wordCount: number
  language: "en" | "id"
  contentType: string
}

const toneStyles: Record<string, { en: string; id: string }> = {
  professional: { en: "professional and authoritative", id: "profesional dan berwibawa" },
  casual: { en: "casual and conversational", id: "santai dan percakapan" },
  formal: { en: "formal and academic", id: "formal dan akademis" },
  friendly: { en: "friendly and approachable", id: "ramah dan mudah didekati" },
  persuasive: { en: "persuasive and compelling", id: "persuasif dan meyakinkan" },
}

function generateParagraph(sentences: number, keywordsList: string[], topic: string, isIndonesian: boolean): string {
  const fillerEn = [
    "This is particularly important when considering the broader implications.",
    "Research shows that this approach yields significant results.",
    "Many experts in the field have noted the effectiveness of this method.",
    "The data consistently supports these findings across various studies.",
    "Implementation of these strategies has proven beneficial for many organizations.",
    "Understanding these fundamentals is crucial for long-term success.",
    "The practical applications of this concept are numerous and varied.",
    "Industry leaders have adopted these practices with notable success.",
    "This framework provides a solid foundation for future development.",
    "Analysis reveals compelling evidence supporting this methodology.",
  ]

  const fillerIdIndonesia = [
    "Hal ini sangat penting ketika mempertimbangkan implikasi yang lebih luas.",
    "Penelitian menunjukkan bahwa pendekatan ini menghasilkan hasil yang signifikan.",
    "Banyak ahli di bidang ini telah mencatat efektivitas metode ini.",
    "Data secara konsisten mendukung temuan ini di berbagai studi.",
    "Implementasi strategi ini telah terbukti bermanfaat bagi banyak organisasi.",
    "Memahami dasar-dasar ini sangat penting untuk kesuksesan jangka panjang.",
    "Aplikasi praktis dari konsep ini sangat banyak dan beragam.",
    "Para pemimpin industri telah mengadopsi praktik ini dengan sukses yang luar biasa.",
    "Kerangka kerja ini menyediakan fondasi yang kuat untuk pengembangan masa depan.",
    "Analisis mengungkapkan bukti kuat yang mendukung metodologi ini.",
  ]

  const filler = isIndonesian ? fillerIdIndonesia : fillerEn
  let paragraph = ""

  for (let i = 0; i < sentences; i++) {
    // Insert keyword occasionally
    if (i % 3 === 0 && keywordsList.length > 0) {
      const keyword = keywordsList[Math.floor(Math.random() * keywordsList.length)]
      if (isIndonesian) {
        paragraph += `Dalam konteks ${keyword}, ${filler[Math.floor(Math.random() * filler.length)]} `
      } else {
        paragraph += `When it comes to ${keyword}, ${filler[Math.floor(Math.random() * filler.length)].toLowerCase()} `
      }
    } else {
      paragraph += filler[Math.floor(Math.random() * filler.length)] + " "
    }
  }

  return paragraph.trim()
}

function generateSection(heading: string, keywordsList: string[], topic: string, paragraphCount: number, isIndonesian: boolean): string {
  let section = `## ${heading}\n\n`

  for (let i = 0; i < paragraphCount; i++) {
    section += generateParagraph(4 + Math.floor(Math.random() * 3), keywordsList, topic, isIndonesian) + "\n\n"
  }

  return section
}

export function generateContent(options: GenerateOptions): string {
  const { topic, keywords, tone, wordCount, language, contentType } = options
  const isIndonesian = language === "id"
  const keywordsList = keywords.split(",").map((k) => k.trim()).filter(Boolean)
  if (keywordsList.length === 0 && topic) {
    keywordsList.push(...topic.toLowerCase().split(" ").filter((w) => w.length > 3))
  }

  const toneDesc = toneStyles[tone]?.[language] || toneStyles.professional[language]

  // Calculate section count based on word count
  const sectionsNeeded = Math.max(3, Math.floor(wordCount / 250))
  const paragraphsPerSection = Math.max(2, Math.floor(wordCount / (sectionsNeeded * 150)))

  let content = ""

  // Title
  content += `# ${topic}\n\n`

  // Meta description
  if (isIndonesian) {
    content += `*Artikel ${toneDesc} tentang ${topic}. Pelajari semua yang perlu Anda ketahui tentang topik penting ini.*\n\n`
  } else {
    content += `*A ${toneDesc} article about ${topic}. Learn everything you need to know about this important topic.*\n\n`
  }

  // Introduction
  const introHeading = isIndonesian ? "Pendahuluan" : "Introduction"
  if (isIndonesian) {
    content += `## ${introHeading}\n\n`
    content += `${topic} adalah topik yang semakin penting di dunia modern saat ini. `
    content += `Dalam panduan komprehensif ini, kita akan mengeksplorasi berbagai aspek dari ${topic} dan memberikan wawasan berharga yang dapat Anda terapkan segera. `
    content += generateParagraph(3, keywordsList, topic, isIndonesian) + "\n\n"
  } else {
    content += `## ${introHeading}\n\n`
    content += `${topic} is an increasingly important topic in today's modern world. `
    content += `In this comprehensive guide, we will explore various aspects of ${topic} and provide valuable insights that you can apply immediately. `
    content += generateParagraph(3, keywordsList, topic, isIndonesian) + "\n\n"
  }

  // Generate main sections based on content type
  const sectionHeadings: Record<string, { en: string[]; id: string[] }> = {
    article: {
      en: ["Understanding the Basics", "Key Concepts and Principles", "Practical Applications", "Best Practices", "Common Challenges and Solutions", "Future Trends", "Expert Insights"],
      id: ["Memahami Dasar-Dasar", "Konsep dan Prinsip Utama", "Aplikasi Praktis", "Praktik Terbaik", "Tantangan Umum dan Solusi", "Tren Masa Depan", "Wawasan Para Ahli"],
    },
    blog: {
      en: ["Why This Matters", "The Main Points", "Real-World Examples", "Tips and Tricks", "What to Avoid", "Taking Action"],
      id: ["Mengapa Ini Penting", "Poin-Poin Utama", "Contoh Nyata", "Tips dan Trik", "Yang Harus Dihindari", "Mengambil Tindakan"],
    },
    product: {
      en: ["Product Overview", "Key Features", "Benefits", "How It Works", "Use Cases", "Customer Reviews"],
      id: ["Ikhtisar Produk", "Fitur Utama", "Manfaat", "Cara Kerja", "Kasus Penggunaan", "Ulasan Pelanggan"],
    },
    email: {
      en: ["The Opportunity", "What We Offer", "Why Choose Us", "Next Steps"],
      id: ["Kesempatan", "Yang Kami Tawarkan", "Mengapa Memilih Kami", "Langkah Selanjutnya"],
    },
    social: {
      en: ["The Hook", "The Value", "The Proof", "The Call to Action"],
      id: ["Pembuka", "Nilai", "Bukti", "Ajakan Bertindak"],
    },
    ad: {
      en: ["The Problem", "The Solution", "The Benefits", "Limited Time Offer"],
      id: ["Masalah", "Solusi", "Manfaat", "Penawaran Terbatas"],
    },
  }

  const headings = sectionHeadings[contentType]?.[language] || sectionHeadings.article[language]
  const headingsToUse = headings.slice(0, Math.min(sectionsNeeded, headings.length))

  for (const heading of headingsToUse) {
    content += generateSection(heading, keywordsList, topic, paragraphsPerSection, isIndonesian)
  }

  // Add bullet points section
  const bulletHeading = isIndonesian ? "Poin-Poin Penting" : "Key Takeaways"
  content += `## ${bulletHeading}\n\n`
  const bullets = isIndonesian
    ? [
        `Memahami ${topic} sangat penting untuk kesuksesan`,
        "Implementasi yang tepat menghasilkan hasil yang lebih baik",
        "Pembelajaran berkelanjutan adalah kunci",
        "Praktik terbaik harus diikuti secara konsisten",
        "Mengukur hasil membantu meningkatkan strategi",
      ]
    : [
        `Understanding ${topic} is essential for success`,
        "Proper implementation yields better results",
        "Continuous learning is key",
        "Best practices should be followed consistently",
        "Measuring results helps improve strategy",
      ]

  for (const bullet of bullets) {
    content += `- ${bullet}\n`
  }
  content += "\n"

  // Conclusion
  const conclusionHeading = isIndonesian ? "Kesimpulan" : "Conclusion"
  if (isIndonesian) {
    content += `## ${conclusionHeading}\n\n`
    content += `Sebagai kesimpulan, ${topic} mewakili area penting yang membutuhkan perhatian dan pemahaman. `
    content += `Dengan mengikuti pedoman yang diuraikan dalam artikel ini, Anda akan dilengkapi dengan baik untuk menavigasi kompleksitas bidang ini. `
    content += `Ingatlah bahwa pembelajaran dan adaptasi berkelanjutan adalah kunci kesuksesan jangka panjang. `
    content += generateParagraph(2, keywordsList, topic, isIndonesian) + "\n\n"
  } else {
    content += `## ${conclusionHeading}\n\n`
    content += `In conclusion, ${topic} represents a critical area that deserves attention and understanding. `
    content += `By following the guidelines outlined in this article, you'll be well-equipped to navigate the complexities of this field. `
    content += `Remember that continuous learning and adaptation are key to long-term success. `
    content += generateParagraph(2, keywordsList, topic, isIndonesian) + "\n\n"
  }

  // Keywords footer
  content += "---\n\n"
  content += `**${isIndonesian ? "Kata Kunci" : "Keywords"}:** ${keywordsList.join(", ")}\n`

  return content
}

export function countWords(text: string): number {
  return text
    .replace(/[#*_\-\[\]()]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 0).length
}
