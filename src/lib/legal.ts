import termsZh from '../content/legal/terms.zh.md?raw'
import termsEn from '../content/legal/terms.en.md?raw'
import privacyZh from '../content/legal/privacy.zh.md?raw'
import privacyEn from '../content/legal/privacy.en.md?raw'
import crossBorderZh from '../content/legal/cross-border.zh.md?raw'
import crossBorderEn from '../content/legal/cross-border.en.md?raw'

export const legalDocuments = {
  terms: { zh: termsZh, en: termsEn },
  privacy: { zh: privacyZh, en: privacyEn },
  'cross-border': { zh: crossBorderZh, en: crossBorderEn },
} as const

export type LegalDocumentKey = keyof typeof legalDocuments
export const legalDocumentKeys = Object.keys(legalDocuments) as LegalDocumentKey[]
export const legalUpdatedDate = '2026-09-14'

export function getLegalHeadings(markdown: string) {
  return [...markdown.matchAll(/^## (.+)$/gm)].map((match) => ({
    title: match[1]!,
    // Match the existing Markdown renderer's heading IDs.
    id: match[1]!.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, ''),
  }))
}
