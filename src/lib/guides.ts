// Guides content for /guides — getting-started tutorials for Memoh.
//
// Self-contained like src/lib/help.ts: UI strings and guide metadata live here
// (keyed by locale) so the guides section never conflicts with in-flight
// locale-file work and can be moved out as a unit later.
//
// The guide list is intentionally empty for now; the page renders an empty
// state until entries are added to `guides` below.

export const guideLocales = ['en', 'zh', 'ja'] as const
export type GuideLocale = (typeof guideLocales)[number]

type Localized = Record<GuideLocale, string>

const resolveLocale = (locale: string): GuideLocale =>
  (guideLocales as readonly string[]).includes(locale) ? (locale as GuideLocale) : 'en'

// ---------------------------------------------------------------------------
// UI strings
// ---------------------------------------------------------------------------

const ui = {
  seoTitle: { en: 'Memoh Guides', zh: 'Memoh 教程', ja: 'Memoh ガイド' },
  seoDescription: {
    en: 'Getting-started tutorials for Memoh — set up your agents and put them to work.',
    zh: 'Memoh 上手教程：从零开始，让你的 Agent 用起来。',
    ja: 'Memoh の入門チュートリアル。エージェントをセットアップして、すぐに使い始めましょう。',
  },
  title: { en: 'Memoh Guides', zh: 'Memoh 教程', ja: 'Memoh ガイド' },
  subtitle: {
    en: 'Getting-started tutorials for agents with their own computers.',
    zh: '给拥有自己电脑的 Agent 准备的上手教程。',
    ja: '自分のコンピューターを持つエージェントのための入門チュートリアル。',
  },
  categoriesLabel: { en: 'Browse by category', zh: '按分类浏览', ja: 'カテゴリで探す' },
  allCategories: { en: 'All', zh: '全部', ja: 'すべて' },
  featured: { en: 'Featured', zh: '精选', ja: '注目' },
  allGuides: { en: 'All guides', zh: '全部教程', ja: 'すべてのガイド' },
  emptyTitle: { en: 'Guides are on the way', zh: '教程正在路上', ja: 'ガイドは準備中です' },
  emptyDesc: {
    en: 'We are writing the first tutorials now. In the meantime, the docs and help center cover the basics.',
    zh: '第一批教程正在撰写中。在此之前，可以先看看文档和帮助中心。',
    ja: '最初のチュートリアルを執筆中です。それまではドキュメントとヘルプセンターをご覧ください。',
  },
  emptyCategoryDesc: {
    en: 'No guides in this category yet.',
    zh: '这个分类下还没有教程。',
    ja: 'このカテゴリにはまだガイドがありません。',
  },
  readDocs: { en: 'Read the docs', zh: '查看文档', ja: 'ドキュメントを読む' },
  visitHelp: { en: 'Help Center', zh: '帮助中心', ja: 'ヘルプセンター' },
} satisfies Record<string, Localized>

export type GuidesUiKey = keyof typeof ui

export const getGuidesUi = (locale: string) => {
  const resolved = resolveLocale(locale)
  return (key: GuidesUiKey) => ui[key][resolved]
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

const categories = [
  { id: 'getting-started', title: { en: 'Getting started', zh: '入门', ja: 'はじめに' } },
  // Hidden for now — restore when there are guides in these categories.
  // { id: 'engineering', title: { en: 'Engineering', zh: '工程', ja: 'エンジニアリング' } },
  // { id: 'product', title: { en: 'Product', zh: '产品', ja: 'プロダクト' } },
  // { id: 'design', title: { en: 'Design', zh: '设计', ja: 'デザイン' } },
  // { id: 'research', title: { en: 'Research', zh: '研究', ja: 'リサーチ' } },
  // { id: 'marketing', title: { en: 'Marketing', zh: '营销', ja: 'マーケティング' } },
  // { id: 'sales', title: { en: 'Sales', zh: '销售', ja: 'セールス' } },
  // { id: 'support', title: { en: 'Support', zh: '客服', ja: 'サポート' } },
  // { id: 'operations', title: { en: 'Operations', zh: '运营', ja: 'オペレーション' } },
] as const satisfies readonly { id: string; title: Localized }[]

export type GuideCategoryId = (typeof categories)[number]['id']

export type GuideCategory = { id: GuideCategoryId; title: string }

export const getGuideCategories = (locale: string): GuideCategory[] => {
  const resolved = resolveLocale(locale)
  return categories.map((c) => ({ id: c.id, title: c.title[resolved] }))
}

export const isGuideCategoryId = (value: unknown): value is GuideCategoryId =>
  typeof value === 'string' && categories.some((c) => c.id === value)

// ---------------------------------------------------------------------------
// Guides
// ---------------------------------------------------------------------------

type GuideSource = {
  slug: string
  category: GuideCategoryId
  title: Localized
  summary: Localized
  /** Featured guides render as large cards with a cover image. */
  featured?: boolean
  /** Path under public/, e.g. /guides/<slug>/cover.webp. */
  cover?: string
}

export type Guide = {
  slug: string
  category: GuideCategoryId
  categoryTitle: string
  title: string
  summary: string
  featured: boolean
  cover?: string
}

// Tutorials intentionally left empty for now.
const guides: GuideSource[] = []

export const getGuides = (locale: string): Guide[] => {
  const resolved = resolveLocale(locale)
  return guides.map((g) => ({
    slug: g.slug,
    category: g.category,
    categoryTitle: categories.find((c) => c.id === g.category)?.title[resolved] ?? g.category,
    title: g.title[resolved],
    summary: g.summary[resolved],
    featured: g.featured ?? false,
    cover: g.cover,
  }))
}
