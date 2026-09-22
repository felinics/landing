<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useSeoMeta } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, ChevronRight, FileQuestion } from 'lucide-vue-next'
import { getHelpArticle, getHelpCollection, getHelpUi } from '../lib/help'
import HelpContactCard from '../components/help/HelpContactCard.vue'

const route = useRoute()
const { locale } = useI18n()

const collectionId = computed(() => {
  const value = route.params.collectionId
  return typeof value === 'string' ? value : ''
})
const articleId = computed(() => {
  const value = route.params.articleId
  return typeof value === 'string' ? value : ''
})

const ui = computed(() => getHelpUi(locale.value))
const article = computed(() => getHelpArticle(collectionId.value, articleId.value, locale.value))
const relatedArticles = computed(() => {
  const collection = getHelpCollection(collectionId.value, locale.value)
  return (collection?.articles ?? []).filter((candidate) => candidate.id !== articleId.value).slice(0, 4)
})

const renderedHtml = ref('')
let renderToken = 0

watch(
  article,
  async (current) => {
    const token = ++renderToken
    if (!current) {
      renderedHtml.value = ''
      return
    }

    const { renderMarkdown } = await import('../lib/markdown')
    const html = await renderMarkdown(current.answer)
    if (token === renderToken) renderedHtml.value = html
  },
  { immediate: true },
)

useSeoMeta({
  title: () => (article.value ? `${article.value.question} | ${ui.value('seoTitle')}` : ui.value('notFoundTitle')),
  description: () => article.value?.question ?? ui.value('seoDescription'),
  robots: () => (article.value ? undefined : 'noindex, follow'),
})
</script>

<template>
  <main class="w-full max-w-[1080px] min-h-[calc(100vh-3.5rem)] mx-auto px-4 md:px-8 pt-[112px] md:pt-[148px] pb-[120px] relative z-10">
    <template v-if="article">
      <article class="mx-auto flex max-w-[760px] flex-col gap-8">
        <nav class="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground" :aria-label="ui('breadcrumbRoot')">
          <RouterLink
            to="/help"
            class="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            {{ ui('breadcrumbRoot') }}
          </RouterLink>
          <ChevronRight class="h-3.5 w-3.5 shrink-0" />
          <RouterLink
            :to="`/help/${article.collectionId}`"
            class="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            {{ article.collectionTitle }}
          </RouterLink>
        </nav>

        <header class="border-b border-border pb-6">
          <h1 class="text-3xl md:text-4xl font-semibold tracking-tight text-foreground leading-tight">
            {{ article.question }}
          </h1>
        </header>

        <div class="help-body" v-html="renderedHtml"></div>

        <section v-if="relatedArticles.length" class="border-t border-border pt-6">
          <h2 class="mb-3 text-sm font-medium text-muted-foreground">{{ ui('relatedTitle') }}</h2>
          <div class="flex flex-col gap-1">
            <RouterLink
              v-for="related in relatedArticles"
              :key="related.id"
              :to="`/help/${related.collectionId}/${related.id}`"
              class="group inline-flex w-fit items-center gap-2 rounded-sm py-1.5 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {{ related.question }}
              <ChevronRight class="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </RouterLink>
          </div>
        </section>

        <HelpContactCard />
      </article>
    </template>

    <section v-else class="mx-auto flex max-w-[640px] flex-col items-center gap-5 py-24 text-center">
      <div class="rounded-xl border border-border bg-muted p-3 text-muted-foreground">
        <FileQuestion class="w-6 h-6" />
      </div>
      <h1 class="text-3xl font-semibold tracking-tight text-foreground">{{ ui('notFoundTitle') }}</h1>
      <p class="text-muted-foreground">{{ ui('notFoundDesc') }}</p>
      <RouterLink
        to="/help"
        class="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <ArrowLeft :size="16" />
        {{ ui('backToHelp') }}
      </RouterLink>
    </section>
  </main>
</template>

<style scoped>
.help-body {
  color: var(--foreground);
  font-size: 1rem;
  line-height: 1.78;
}

.help-body :deep(h2),
.help-body :deep(h3),
.help-body :deep(h4) {
  margin: 2rem 0 0.75rem;
  color: var(--foreground);
  font-weight: 650;
  letter-spacing: -0.01em;
  line-height: 1.35;
}

.help-body :deep(h2) {
  font-size: 1.35rem;
}

.help-body :deep(h3) {
  font-size: 1.15rem;
}

.help-body :deep(h4) {
  font-size: 1rem;
}

.help-body :deep(h2:first-child),
.help-body :deep(h3:first-child),
.help-body :deep(h4:first-child) {
  margin-top: 0;
}

.help-body :deep(p) {
  margin: 1rem 0;
  color: var(--muted-foreground);
}

.help-body :deep(p:first-child) {
  margin-top: 0;
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
  margin: 1rem 0;
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
  margin: 0.5rem 0;
  padding-left: 0.25rem;
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
  margin: 1.5rem 0;
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}

.help-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  min-width: 420px;
  font-size: 0.92rem;
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
