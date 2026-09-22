<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useSeoMeta } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, ChevronDown, ChevronRight, FileQuestion } from 'lucide-vue-next'
import { getHelpArticle, getHelpCollection, getHelpCollections, getHelpUi } from '../lib/help'
import { helpIcons } from '../components/help/helpIcons'
import HelpContactCard from '../components/help/HelpContactCard.vue'

const route = useRoute()
const { locale } = useI18n()

const collectionId = computed(() => {
  const value = route.params.collectionId
  return typeof value === 'string' ? value : ''
})

const ui = computed(() => getHelpUi(locale.value))
const collection = computed(() => getHelpCollection(collectionId.value, locale.value))
const otherCollections = computed(() =>
  getHelpCollections(locale.value).filter((candidate) => candidate.id !== collectionId.value),
)

// Answers expand in place (accordion) instead of navigating to a page.
const expandedIds = ref<string[]>([])
const renderedById = ref<Record<string, string>>({})

const isExpanded = (articleId: string) => expandedIds.value.includes(articleId)

const renderAnswer = async (articleId: string) => {
  if (renderedById.value[articleId]) return
  const article = getHelpArticle(collectionId.value, articleId, locale.value)
  if (!article) return
  const { renderMarkdown } = await import('../lib/markdown')
  const html = await renderMarkdown(article.answer)
  renderedById.value = { ...renderedById.value, [articleId]: html }
}

const toggleArticle = (articleId: string) => {
  if (isExpanded(articleId)) {
    expandedIds.value = expandedIds.value.filter((id) => id !== articleId)
    return
  }
  expandedIds.value = [...expandedIds.value, articleId]
  void renderAnswer(articleId)
}

const relatedFor = (articleId: string) =>
  (collection.value?.articles ?? []).filter((candidate) => candidate.id !== articleId).slice(0, 4)

const scrollToItem = (articleId: string) =>
  document.getElementById(`help-item-${articleId}`)?.scrollIntoView({ block: 'start' })

const openRelated = async (articleId: string) => {
  if (!isExpanded(articleId)) toggleArticle(articleId)
  await nextTick()
  scrollToItem(articleId)
}

// Deep links: /help/:collectionId#article-id — used by search results and the
// redirect that keeps old /help/:collectionId/:articleId URLs working.
const expandFromHash = async () => {
  const id = route.hash.slice(1)
  if (!id || !collection.value?.articles.some((candidate) => candidate.id === id)) return
  if (!isExpanded(id)) toggleArticle(id)
  await nextTick()
  scrollToItem(id)
}

onMounted(expandFromHash)
watch(() => route.hash, expandFromHash)

watch(collectionId, () => {
  expandedIds.value = []
  renderedById.value = {}
  void expandFromHash()
})

// Rendered markdown is locale-specific — re-render open answers on switch.
watch(locale, () => {
  renderedById.value = {}
  for (const id of expandedIds.value) void renderAnswer(id)
})

useSeoMeta({
  title: () =>
    collection.value ? `${collection.value.title} | ${ui.value('seoTitle')}` : ui.value('notFoundTitle'),
  description: () => collection.value?.description ?? ui.value('seoDescription'),
  robots: () => (collection.value ? undefined : 'noindex, follow'),
})
</script>

<template>
  <main class="help-static w-full max-w-[1080px] min-h-[calc(100vh-3.5rem)] mx-auto px-4 md:px-8 pt-[112px] md:pt-[148px] pb-[120px] relative z-10">
    <template v-if="collection">
      <div class="mx-auto flex max-w-[760px] flex-col gap-10">
        <nav class="flex items-center gap-1.5 text-sm text-muted-foreground" :aria-label="ui('breadcrumbRoot')">
          <RouterLink
            to="/help"
            class="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            {{ ui('breadcrumbRoot') }}
          </RouterLink>
          <ChevronRight class="h-3.5 w-3.5 shrink-0" />
          <span class="text-foreground">{{ collection.title }}</span>
        </nav>

        <header class="flex flex-col gap-4">
          <div class="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-muted text-foreground">
            <component :is="helpIcons[collection.icon]" class="h-5 w-5" />
          </div>
          <div class="flex flex-col gap-2">
            <h1 class="text-3xl md:text-4xl font-semibold tracking-tight text-foreground leading-tight">
              {{ collection.title }}
            </h1>
            <p class="text-base text-muted-foreground leading-relaxed">{{ collection.description }}</p>
            <p class="text-xs text-muted-foreground">{{ ui('articleCount', { n: collection.articleCount }) }}</p>
          </div>
        </header>

        <section class="rounded-xl border border-border bg-background divide-y divide-border overflow-hidden">
          <div
            v-for="article in collection.articles"
            :key="article.id"
            :id="`help-item-${article.id}`"
            class="scroll-mt-24"
          >
            <button
              type="button"
              class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-muted/50 focus-visible:outline-none focus-visible:bg-muted/50"
              :aria-expanded="isExpanded(article.id)"
              @click="toggleArticle(article.id)"
            >
              <h2 class="text-sm md:text-base font-medium text-foreground leading-snug">{{ article.question }}</h2>
              <ChevronDown v-if="isExpanded(article.id)" class="h-4 w-4 shrink-0 text-muted-foreground" />
              <ChevronRight v-else class="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>

            <div v-if="isExpanded(article.id)" class="border-t border-border/60 px-5 py-5">
              <div v-if="renderedById[article.id]" class="help-body" v-html="renderedById[article.id]"></div>
              <p v-else class="text-sm text-muted-foreground">{{ ui('loadingAnswer') }}</p>

              <div v-if="relatedFor(article.id).length" class="mt-6 border-t border-border/60 pt-4">
                <h3 class="mb-2 text-xs font-medium text-muted-foreground">{{ ui('relatedTitle') }}</h3>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="related in relatedFor(article.id)"
                    :key="related.id"
                    type="button"
                    class="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    @click="openRelated(related.id)"
                  >
                    {{ related.question }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="flex flex-col gap-4">
          <h2 class="text-sm font-medium text-muted-foreground">{{ ui('moreCollections') }}</h2>
          <div class="flex flex-wrap gap-2">
            <RouterLink
              v-for="other in otherCollections"
              :key="other.id"
              :to="`/help/${other.id}`"
              class="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <component :is="helpIcons[other.icon]" class="h-3.5 w-3.5" />
              {{ other.title }}
            </RouterLink>
          </div>
        </section>

        <HelpContactCard />
      </div>
    </template>

    <section v-else class="mx-auto flex max-w-[640px] flex-col items-center gap-5 py-24 text-center">
      <div class="rounded-xl border border-border bg-muted p-3 text-muted-foreground">
        <FileQuestion class="w-6 h-6" />
      </div>
      <h1 class="text-3xl font-semibold tracking-tight text-foreground">{{ ui('notFoundTitle') }}</h1>
      <p class="text-muted-foreground">{{ ui('notFoundDesc') }}</p>
      <RouterLink
        to="/help"
        class="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <ArrowLeft :size="16" />
        {{ ui('backToHelp') }}
      </RouterLink>
    </section>
  </main>
</template>

<style scoped>
/* The help center is deliberately animation-free — override the global
   `* { transition: colors 300ms }` from style.css for everything inside. */
.help-static,
.help-static :deep(*) {
  transition: none !important;
  animation: none !important;
}

.help-body {
  color: var(--foreground);
  font-size: 0.95rem;
  line-height: 1.75;
}

.help-body :deep(h2),
.help-body :deep(h3),
.help-body :deep(h4) {
  margin: 1.75rem 0 0.6rem;
  color: var(--foreground);
  font-weight: 650;
  letter-spacing: -0.01em;
  line-height: 1.35;
}

.help-body :deep(h2) {
  font-size: 1.2rem;
}

.help-body :deep(h3) {
  font-size: 1.05rem;
}

.help-body :deep(h4) {
  font-size: 0.95rem;
}

.help-body :deep(h2:first-child),
.help-body :deep(h3:first-child),
.help-body :deep(h4:first-child) {
  margin-top: 0;
}

.help-body :deep(p) {
  margin: 0.9rem 0;
  color: var(--muted-foreground);
}

.help-body :deep(p:first-child) {
  margin-top: 0;
}

.help-body :deep(p:last-child) {
  margin-bottom: 0;
}

.help-body :deep(strong) {
  color: var(--foreground);
  font-weight: 650;
}

.help-body :deep(a) {
  color: var(--foreground);
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.help-body :deep(ul),
.help-body :deep(ol) {
  margin: 0.9rem 0;
  padding-left: 1.25rem;
  color: var(--muted-foreground);
}

.help-body :deep(ul) {
  list-style: disc;
}

.help-body :deep(ol) {
  list-style: decimal;
}

.help-body :deep(li) {
  margin: 0.45rem 0;
  padding-left: 0.25rem;
}

.help-body :deep(li:last-child) {
  margin-bottom: 0;
}

.help-body :deep(code) {
  border: 1px solid var(--border);
  border-radius: 0.25rem;
  background: var(--muted);
  padding: 0.1rem 0.3rem;
  color: var(--foreground);
  font-family: var(--font-mono);
  font-size: 0.88em;
}

/* lib/markdown.ts wraps tables in .blog-table-wrap regardless of page. */
.help-body :deep(.blog-table-wrap) {
  margin: 1.25rem 0;
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}

.help-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  min-width: 420px;
  font-size: 0.9rem;
}

.help-body :deep(th),
.help-body :deep(td) {
  border-bottom: 1px solid var(--border);
  padding: 0.6rem 0.75rem;
  text-align: left;
  vertical-align: top;
}

.help-body :deep(th) {
  background: var(--muted);
  color: var(--foreground);
  font-weight: 650;
}

.help-body :deep(td) {
  color: var(--muted-foreground);
}

.help-body :deep(tr:last-child td) {
  border-bottom: 0;
}
</style>
