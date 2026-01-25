/* =========================================================
 * WRITER TYPES — STABIL & ANTI ERROR
 * ========================================================= */

export type Language = "en" | "id"

export type Tone =
  | "professional"
  | "casual"
  | "formal"
  | "friendly"
  | "persuasive"

export type ContentTypeId =
  | "article"
  | "blog"
  | "ad"
  | "email"
  | "social"
  | "product"

export type GeneratePayload = {
  topic: string
  keywords: string
  tone: Tone
  wordCount: number
  language: Language
  contentType: ContentTypeId
}

export type ContentTemplate = {
  id: ContentTypeId
  label: string
  description: string
  structure: string[]
}

export type HistoryItem = {
  id: number
  content: string
  createdAt: string
  meta: {
    contentType: ContentTypeId
    tone: Tone
    language: Language
    wordCount: number
  }
}