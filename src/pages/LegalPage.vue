<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useSeoMeta } from '@unhead/vue'
import { ArrowDownToLine, ArrowLeft, CalendarDays } from 'lucide-vue-next'
import { getLegalHeadings, legalDocuments, legalDocumentKeys, legalUpdatedDate, type LegalDocumentKey } from '../lib/legal'

const props = defineProps<{ documentKey: LegalDocumentKey }>()
const { locale, t } = useI18n()
const route = useRoute()
const router = useRouter()
const language = computed(() => locale.value === 'zh' ? 'zh' : 'en')

// A shared URL selects a language; the existing site language switch still works.
watch(() => route.query.lang, (lang) => {
  if (lang === 'zh' || lang === 'en') locale.value = lang
}, { immediate: true })
watch(locale, () => {
  if (route.meta.legal && route.query.lang !== language.value) {
    void router.replace({ path: route.path, query: { ...route.query, lang: language.value } })
  }
})

const title = computed(() => t(`legal.titles.${props.documentKey}`))
const body = computed(() => legalDocuments[props.documentKey][language.value])
const headings = computed(() => getLegalHeadings(body.value))
const html = ref('')
const renderError = ref(false)
let renderVersion = 0

useSeoMeta({
  title: () => `${title.value} | Memoh`,
  description: () => `Memoh · ${title.value}`,
  // These documents contain explicit operational details still awaiting completion.
  robots: 'noindex, nofollow',
  ogTitle: () => `${title.value} | Memoh`,
  ogDescription: () => `Memoh · ${title.value}`,
})

async function scrollToSection() {
  await nextTick()
  if (!route.hash || !html.value) return
  try {
    document.getElementById(decodeURIComponent(route.hash.slice(1)))?.scrollIntoView()
  } catch {
    // Ignore a malformed fragment in a shared URL.
  }
}

watch(body, async (markdown) => {
  const version = ++renderVersion
  html.value = ''
  renderError.value = false
  try {
    const { renderMarkdown } = await import('../lib/markdown')
    const result = await renderMarkdown(markdown)
    if (version !== renderVersion) return
    html.value = result
    await scrollToSection()
  } catch {
    if (version === renderVersion) renderError.value = true
  }
}, { immediate: true })
watch(() => route.hash, scrollToSection)

function downloadDocument() {
  const text = `# Memoh ${title.value}\n\n${t('legal.updated')} · ${legalUpdatedDate}\n\n${body.value}`
  const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `Memoh-${props.documentKey}-${language.value}.md`
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
</script>

<template>
  <main class="legal-page" :lang="language === 'zh' ? 'zh-CN' : 'en'">
    <div class="legal-document">
      <RouterLink to="/" class="legal-back"><ArrowLeft :size="16" />{{ t('legal.back') }}</RouterLink>

      <header class="legal-header">
        <div class="legal-meta">
          <span><CalendarDays :size="14" />{{ t('legal.updated') }} <time :datetime="legalUpdatedDate">{{ legalUpdatedDate }}</time></span>
          <span>Felinic</span>
        </div>
        <h1>{{ title }}</h1>
        <nav class="legal-tabs" :aria-label="t('legal.documents')">
          <RouterLink v-for="key in legalDocumentKeys" :key="key" :to="{ path: `/legal/${key}`, query: { lang: language } }" :aria-current="documentKey === key ? 'page' : undefined">{{ t(`legal.titles.${key}`) }}</RouterLink>
        </nav>
        <div class="legal-actions">
          <nav class="legal-languages" :aria-label="t('legal.language')">
            <RouterLink :to="{ path: route.path, query: { lang: 'zh' } }" :aria-current="language === 'zh' ? 'true' : undefined" lang="zh-CN">中文</RouterLink>
            <span class="legal-language-divider" aria-hidden="true">/</span>
            <RouterLink :to="{ path: route.path, query: { lang: 'en' } }" :aria-current="language === 'en' ? 'true' : undefined" lang="en">English</RouterLink>
          </nav>
          <button class="legal-download" @click="downloadDocument"><ArrowDownToLine :size="16" />{{ t('legal.download') }}</button>
        </div>
      </header>

      <details :key="documentKey" class="legal-contents">
        <summary>{{ t('legal.contents') }}</summary>
        <nav :aria-label="t('legal.contents')">
          <RouterLink v-for="heading in headings" :key="heading.id" :to="{ path: route.path, query: route.query, hash: `#${heading.id}` }">{{ heading.title }}</RouterLink>
        </nav>
      </details>

      <p v-if="renderError" role="alert">{{ t('legal.loadError') }}</p>
      <p v-else-if="!html" role="status">{{ t('legal.loading') }}</p>
      <article v-else class="legal-body" :aria-label="title" v-html="html" />
    </div>
  </main>
</template>

<style scoped>
/* Match the Blog article's container, spacing and type scale. */
.legal-page { width: min(100%, 1080px); min-height: calc(100vh - 3.5rem); margin: 0 auto; padding: 148px 32px 120px; color: var(--foreground); }
.legal-document { max-width: 820px; margin: 0 auto; }
.legal-back { display: inline-flex; gap: 8px; align-items: center; padding: 8px 0; margin-bottom: 32px; color: var(--muted-foreground); font-size: 14px; font-weight: 500; }
.legal-header { display: flex; flex-direction: column; gap: 20px; padding-bottom: 32px; border-bottom: 1px solid var(--border); }
.legal-meta { display: flex; gap: 16px; flex-wrap: wrap; color: var(--muted-foreground); font-size: 12px; }
.legal-meta span { display: inline-flex; align-items: center; gap: 6px; }
h1 { font-size: 48px; font-weight: 600; line-height: 1.25; letter-spacing: -.025em; text-wrap: balance; }
.legal-tabs { display: flex; flex-wrap: wrap; gap: 8px 24px; }
.legal-tabs a { padding: 4px 0; font-size: 14px; line-height: 1.6; color: var(--muted-foreground); text-underline-offset: 6px; }
.legal-tabs a[aria-current] { color: var(--foreground); text-decoration: underline; }
.legal-actions { display: flex; justify-content: space-between; align-items: center; gap: 12px 24px; flex-wrap: wrap; }
.legal-languages { display: inline-flex; align-items: center; gap: 10px; }
.legal-language-divider { font-size: 13px; color: var(--muted-foreground); }
.legal-languages a { padding: 4px 0; font-size: 13px; color: var(--muted-foreground); }
.legal-languages a[aria-current] { color: var(--foreground); font-weight: 600; }
.legal-download { display: inline-flex; align-items: center; gap: 7px; padding: 4px 0; font-size: 13px; color: var(--muted-foreground); cursor: pointer; }
.legal-contents { margin: 24px 0 32px; color: var(--muted-foreground); }
.legal-contents summary { width: fit-content; font-size: 14px; cursor: pointer; padding: 4px 0; }
.legal-contents nav { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 24px; padding: 20px 0 8px; }
.legal-contents a { padding: 4px 0; font-size: 13px; line-height: 1.6; }
.legal-body { font-size: 1rem; line-height: 1.78; overflow-wrap: anywhere; }
.legal-body :deep(p) { margin: 1rem 0; color: var(--muted-foreground); }
.legal-body :deep(h2) { margin: 2.75rem 0 1rem; font-size: 1.6rem; line-height: 1.25; font-weight: 700; letter-spacing: -.02em; scroll-margin-top: 96px; }
.legal-body :deep(h3) { margin: 2rem 0 .75rem; font-size: 1.2rem; line-height: 1.35; font-weight: 650; scroll-margin-top: 96px; }
.legal-body :deep(strong) { color: var(--foreground); font-weight: 650; }
.legal-body :deep(a) { color: var(--foreground); font-weight: 500; text-decoration: underline; text-underline-offset: 3px; }
.legal-body :deep(ul), .legal-body :deep(ol) { padding-left: 1.25rem; margin: 1rem 0; color: var(--muted-foreground); }
.legal-body :deep(ul) { list-style: disc; }
.legal-body :deep(ol) { list-style: decimal; }
.legal-body :deep(li) { margin: .5rem 0; padding-left: .25rem; }
.legal-body :deep(.blog-table-wrap) { overflow-x: auto; margin: 1.5rem 0; border: 1px solid var(--border); border-radius: .75rem; }
.legal-body :deep(table) { width: 100%; border-collapse: collapse; font-size: .92rem; }
.legal-body :deep(th), .legal-body :deep(td) { padding: .75rem; text-align: left; border-bottom: 1px solid var(--border); vertical-align: top; }
.legal-body :deep(th) { background: var(--muted); font-weight: 650; }
.legal-body :deep(tr:last-child td) { border-bottom: 0; }
.legal-body :deep(td:first-child) { min-width: 110px; }
.legal-page :is(a, button, summary):hover { color: var(--foreground); }
.legal-page :is(a, button, summary):focus-visible { outline: 2px solid var(--foreground); outline-offset: 4px; border-radius: 3px; }
@media (max-width: 767px) {
  .legal-page { padding: 112px 16px 120px; }
  h1 { font-size: 30px; }
  .legal-tabs { gap: 8px 20px; }
  .legal-tabs a { font-size: 13px; }
  .legal-contents nav { grid-template-columns: minmax(0, 1fr); }
}
@media print {
  .legal-page { width: 100%; padding: 0; }
  .legal-back, .legal-actions, .legal-tabs, .legal-contents { display: none; }
  .legal-body :deep(h2) { break-after: avoid; }
}
</style>
