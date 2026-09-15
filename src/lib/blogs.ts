const markdownModules = import.meta.glob('../content/blogs/*/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export const blogLocales = ['en', 'zh'] as const
export type BlogLocale = (typeof blogLocales)[number]

export type BlogPost = {
  slug: string
  locale: BlogLocale
  title: string
  author: string
  dateKey: string
  excerpt: string
  readingMinutes: number
  body: string
}

const slugAliases: Record<string, string> = {
  '2026-09-11': '2026-09-15',
  '2026-09-11-en': '2026-09-15',
}

const parseFrontmatter = (raw: string) => {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(raw)
  if (!match) return { meta: {}, body: raw }

  const meta = Object.fromEntries(
    match[1]
      .split('\n')
      .map((line) => {
        const separator = line.indexOf(':')
        if (separator === -1) return undefined
        return [
          line.slice(0, separator).trim(),
          line.slice(separator + 1).trim().replace(/^["']|["']$/g, ''),
        ] as const
      })
      .filter((entry): entry is readonly [string, string] => Boolean(entry)),
  )

  return {
    meta,
    body: raw.slice(match[0].length),
  }
}

const stripMarkdown = (value: string) =>
  value
    .replace(/!\[[^\]]*]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/[`*_>#|:-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const getExcerpt = (body: string) => {
  const lines = body.split('\n')
  const line = lines.find((candidate) => {
    const trimmed = candidate.trim()
    return (
      trimmed &&
      !trimmed.startsWith('#') &&
      !trimmed.startsWith(':::') &&
      !trimmed.startsWith('![') &&
      !trimmed.startsWith('- ') &&
      !trimmed.startsWith('|') &&
      !trimmed.startsWith('```')
    )
  })

  const excerpt = stripMarkdown(line ?? '')
  return excerpt.length > 180 ? `${excerpt.slice(0, 177)}...` : excerpt
}

const getReadingMinutes = (body: string) => {
  const normalized = stripMarkdown(body.replace(/```[\s\S]*?```/g, ''))
  const units = normalized.match(/[\u4e00-\u9fff]|[A-Za-z0-9]+/g)?.length ?? 0
  return Math.max(2, Math.round(units / 320))
}

const parseLocalePath = (path: string) => {
  const parts = path.replace(/\\/g, '/').split('/')
  const file = parts.pop()?.replace(/\.md$/, '')
  const locale = parts.pop()
  if (!file || file === 'index') return undefined
  if (locale !== 'en' && locale !== 'zh') return undefined
  return { slug: file, locale }
}

const parseBlogPost = (path: string, raw: string): BlogPost | undefined => {
  const parsedPath = parseLocalePath(path)
  if (!parsedPath) return undefined

  const { meta, body } = parseFrontmatter(raw)
  const bodyWithoutTitle = body.replace(/^#\s+.+\n+/, '')
  const dateMatch = /^(\d{4}-\d{2}-\d{2})/.exec(parsedPath.slug)

  return {
    slug: parsedPath.slug,
    locale: parsedPath.locale,
    title: meta.title || parsedPath.slug,
    author: meta.author || 'Team Memoh',
    dateKey: dateMatch?.[1] ?? parsedPath.slug,
    excerpt: getExcerpt(bodyWithoutTitle),
    readingMinutes: getReadingMinutes(bodyWithoutTitle),
    body: bodyWithoutTitle,
  }
}

const postsBySlug = new Map<string, Partial<Record<BlogLocale, BlogPost>>>()

for (const [path, raw] of Object.entries(markdownModules)) {
  const post = parseBlogPost(path, raw)
  if (!post) continue
  const versions = postsBySlug.get(post.slug) ?? {}
  versions[post.locale] = post
  postsBySlug.set(post.slug, versions)
}

const normalizeLocale = (locale: string): BlogLocale => (locale === 'zh' ? 'zh' : 'en')

const pickPost = (slug: string, locale: BlogLocale) => {
  const versions = postsBySlug.get(slug)
  if (!versions) return undefined
  return versions[locale] ?? versions.en ?? versions.zh
}

const canonicalSlug = (slug: string) => slugAliases[slug] ?? slug

export const formatBlogDate = (dateKey: string, locale: string) => {
  const match = /^(\d{4}-\d{2}-\d{2})$/.exec(dateKey)
  if (!match) return dateKey

  return new Intl.DateTimeFormat(normalizeLocale(locale) === 'zh' ? 'zh-CN' : 'en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${match[1]}T00:00:00Z`))
}

export const getBlogPosts = (locale: string) => {
  const normalized = normalizeLocale(locale)
  return [...postsBySlug.keys()]
    .sort((a, b) => b.localeCompare(a))
    .map((slug) => pickPost(slug, normalized))
    .filter((post): post is BlogPost => Boolean(post))
}

export const getBlogPost = (slug: string, locale: string) =>
  pickPost(canonicalSlug(decodeURIComponent(slug)), normalizeLocale(locale))
