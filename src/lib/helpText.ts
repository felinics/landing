// Plain-text (Markdown) export of the help center for LLMs and agents.
//
// The help center is a SPA, so a plain HTTP fetch of /help returns an empty
// shell. These files mirror the docs.memoh.ai convention instead: one
// llms.txt index, then one Markdown file per article at the page path plus
// `.md`, with non-English locales under a `/<locale>` prefix. vite.config.ts
// emits them at build time and serves them in dev.

import { getHelpArticle, getHelpCollection, getHelpCollections, getHelpUi, helpLocales, type HelpLocale } from './help'

const siteUrl = 'https://memoh.ai'

export const helpTextIndexPath = 'help/llms.txt'

const localePrefix = (locale: HelpLocale) => (locale === 'en' ? '' : `${locale}/`)

const articleTextPath = (locale: HelpLocale, collectionId: string, articleId: string) =>
  `${localePrefix(locale)}help/${collectionId}/${articleId}.md`

// Answers link inside the site with root-relative paths such as /download;
// make them absolute so they still resolve once the text leaves memoh.ai.
const absolutizeLinks = (markdown: string) => markdown.replace(/\]\((\/[^)\s]*)\)/g, `](${siteUrl}$1)`)

// Returns output paths (relative to the site root) mapped to file contents.
export const buildHelpTextFiles = (): Map<string, string> => {
  const files = new Map<string, string>()
  const index = [
    '# Memoh Help Center',
    '',
    '> Answers about Memoh plans, credits and billing, the desktop app, channels, scheduled tasks, cloud computers, privacy and security. Each article below is plain Markdown. For product setup and feature references, see the documentation index at https://docs.memoh.ai/llms.txt.',
  ]

  for (const locale of helpLocales) {
    const ui = getHelpUi(locale)
    index.push('', `## ${ui('title')} (${locale})`)

    for (const summary of getHelpCollections(locale)) {
      const collection = getHelpCollection(summary.id, locale)
      if (!collection) continue
      index.push('', `### ${collection.title}`, '', collection.description, '')

      for (const { id } of collection.articles) {
        const article = getHelpArticle(collection.id, id, locale)
        if (!article) continue
        const path = articleTextPath(locale, collection.id, article.id)
        const pageUrl = `${siteUrl}/help/${collection.id}/${article.id}`
        files.set(
          path,
          `# ${article.question}\n\n${ui('breadcrumbRoot')} › ${collection.title} · ${pageUrl}\n\n${absolutizeLinks(article.answer.trim())}\n`,
        )
        index.push(`- [${article.question}](${siteUrl}/${path})`)
      }
    }
  }

  files.set(helpTextIndexPath, `${index.join('\n')}\n`)
  return files
}
