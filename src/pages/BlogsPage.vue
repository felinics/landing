<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useHead, useSeoMeta } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, FileText, UserRound } from 'lucide-vue-next'
import { formatBlogDate, getBlogPost, getBlogPosts } from '../lib/blogs'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()

const slug = computed(() => {
  const value = route.params.slug
  return typeof value === 'string' ? value : ''
})
const isDetail = computed(() => slug.value.length > 0)
const blogPosts = computed(() => getBlogPosts(locale.value))
const activePost = computed(() => (slug.value ? getBlogPost(slug.value, locale.value) : undefined))
const featuredPost = computed(() => blogPosts.value[0])
const relatedPosts = computed(() => blogPosts.value.filter((post) => post.slug !== activePost.value?.slug).slice(0, 3))
const renderedHtml = ref('')
const isRenderingPost = ref(false)
let renderToken = 0

const pageTitle = computed(() => {
  if (activePost.value) return t('blog.seoPostTitle', { title: activePost.value.title })
  if (isDetail.value) return t('blog.seoNotFoundTitle')
  return t('blog.seoTitle')
})

const pageDescription = computed(() => activePost.value?.excerpt || t('blog.seoDescription'))

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value),
  },
})

useSeoMeta({
  title: () => pageTitle.value,
  description: () => pageDescription.value,
  ogTitle: () => pageTitle.value,
  ogDescription: () => pageDescription.value,
  ogType: 'article',
  ogUrl: () => `https://memoh.ai${route.path}`,
  twitterCard: 'summary_large_image',
  twitterTitle: () => pageTitle.value,
  twitterDescription: () => pageDescription.value,
})

watch(
  activePost,
  async (post) => {
    const token = ++renderToken
    renderedHtml.value = ''

    if (!post) {
      isRenderingPost.value = false
      return
    }

    isRenderingPost.value = true
    const { renderMarkdown } = await import('../lib/markdown')
    const html = await renderMarkdown(post.body)

    if (token === renderToken) {
      renderedHtml.value = html
      isRenderingPost.value = false
    }
  },
  { immediate: true },
)
</script>

<template>
  <main class="w-full max-w-[1080px] min-h-[calc(100vh-3.5rem)] mx-auto px-4 md:px-8 pt-[112px] md:pt-[148px] pb-[120px] relative z-10">
    <template v-if="!isDetail">
      <section class="flex flex-col gap-12">
        <header class="max-w-[760px] flex flex-col gap-5">
          <div class="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <FileText class="w-3.5 h-3.5" />
            {{ $t('blog.badge') }}
          </div>
          <div class="flex flex-col gap-4">
            <h1 class="text-4xl md:text-6xl font-semibold tracking-tight text-foreground leading-[1.05]">
              {{ $t('blog.indexTitle') }}
            </h1>
            <p class="text-base md:text-lg text-muted-foreground leading-relaxed max-w-[680px]">
              {{ $t('blog.indexDescription') }}
            </p>
          </div>
        </header>

        <RouterLink
          v-if="featuredPost"
          :to="`/blogs/${featuredPost.slug}`"
          class="group grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] overflow-hidden rounded-xl border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div class="p-6 md:p-8 flex flex-col gap-6">
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span class="inline-flex items-center gap-1.5">
                <CalendarDays class="w-3.5 h-3.5" />
                {{ formatBlogDate(featuredPost.dateKey, locale) }}
              </span>
              <span class="inline-flex items-center gap-1.5">
                <UserRound class="w-3.5 h-3.5" />
                {{ featuredPost.author }}
              </span>
              <span class="inline-flex items-center gap-1.5">
                <Clock3 class="w-3.5 h-3.5" />
                {{ $t('blog.minRead', { n: featuredPost.readingMinutes }) }}
              </span>
            </div>
            <div class="flex flex-col gap-3">
              <span class="text-xs font-medium uppercase tracking-[0.16em] text-primary">{{ $t('blog.latest') }}</span>
              <h2 class="text-2xl md:text-3xl font-semibold tracking-tight text-foreground leading-tight">
                {{ featuredPost.title }}
              </h2>
              <p class="text-sm md:text-base text-muted-foreground leading-relaxed">
                {{ featuredPost.excerpt }}
              </p>
            </div>
            <span class="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              {{ $t('blog.readArticle') }}
              <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
          <div class="border-t md:border-t-0 md:border-l border-border bg-muted/35 p-6 md:p-8 flex items-end">
            <div class="w-full font-mono text-xs text-muted-foreground leading-relaxed">
              <div class="mb-4 flex items-center gap-1.5">
                <span class="h-2.5 w-2.5 rounded-full bg-red-400/80"></span>
                <span class="h-2.5 w-2.5 rounded-full bg-yellow-400/80"></span>
                <span class="h-2.5 w-2.5 rounded-full bg-green-400/80"></span>
              </div>
              <p>agent.workspace.boot()</p>
              <p class="text-foreground">container.isolated = true</p>
              <p>memory.local_first = true</p>
              <p>status = "always-on"</p>
            </div>
          </div>
        </RouterLink>

        <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RouterLink
            v-for="post in blogPosts.slice(1)"
            :key="post.slug"
            :to="`/blogs/${post.slug}`"
            class="group flex min-h-[260px] flex-col justify-between rounded-xl border border-border bg-background p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <div class="flex flex-col gap-4">
              <div class="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>{{ formatBlogDate(post.dateKey, locale) }}</span>
                <span>{{ $t('blog.min', { n: post.readingMinutes }) }}</span>
              </div>
              <div class="flex flex-col gap-3">
                <h2 class="text-lg font-semibold tracking-tight text-foreground leading-snug">
                  {{ post.title }}
                </h2>
                <p class="text-sm text-muted-foreground leading-relaxed">
                  {{ post.excerpt }}
                </p>
              </div>
            </div>
            <span class="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground">
              {{ $t('blog.readArticle') }}
              <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </RouterLink>
        </section>
      </section>
    </template>

    <template v-else-if="activePost">
      <article class="mx-auto max-w-[820px]">
        <RouterLink
          to="/blogs"
          class="mb-8 inline-flex items-center gap-2 rounded-md px-0 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ArrowLeft class="w-4 h-4" />
          {{ $t('blog.back') }}
        </RouterLink>

        <header class="mb-10 flex flex-col gap-5 border-b border-border pb-8">
          <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span class="inline-flex items-center gap-1.5">
              <CalendarDays class="w-3.5 h-3.5" />
              {{ formatBlogDate(activePost.dateKey, locale) }}
            </span>
            <span class="inline-flex items-center gap-1.5">
              <UserRound class="w-3.5 h-3.5" />
              {{ activePost.author }}
            </span>
            <span class="inline-flex items-center gap-1.5">
              <Clock3 class="w-3.5 h-3.5" />
              {{ $t('blog.minRead', { n: activePost.readingMinutes }) }}
            </span>
          </div>
          <h1 class="text-3xl md:text-5xl font-semibold tracking-tight text-foreground leading-tight">
            {{ activePost.title }}
          </h1>
          <p class="text-base md:text-lg text-muted-foreground leading-relaxed">
            {{ activePost.excerpt }}
          </p>
        </header>

        <div v-if="isRenderingPost" class="rounded-xl border border-border bg-background p-6 text-sm text-muted-foreground">
          {{ $t('blog.rendering') }}
        </div>
        <div v-else class="blog-body" v-html="renderedHtml"></div>

        <section v-if="relatedPosts.length" class="mt-14 border-t border-border pt-8">
          <h2 class="mb-4 text-lg font-semibold tracking-tight text-foreground">{{ $t('blog.more') }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RouterLink
              v-for="post in relatedPosts"
              :key="post.slug"
              :to="`/blogs/${post.slug}`"
              class="group rounded-xl border border-border bg-background p-4 transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <p class="mb-2 text-xs text-muted-foreground">{{ formatBlogDate(post.dateKey, locale) }}</p>
              <h3 class="text-sm font-medium leading-snug text-foreground">{{ post.title }}</h3>
            </RouterLink>
          </div>
        </section>
      </article>
    </template>

    <section v-else class="mx-auto flex max-w-[640px] flex-col items-center gap-5 py-24 text-center">
      <div class="rounded-xl border border-border bg-muted p-3 text-muted-foreground">
        <FileText class="w-6 h-6" />
      </div>
      <h1 class="text-3xl font-semibold tracking-tight text-foreground">{{ $t('blog.notFoundTitle') }}</h1>
      <p class="text-muted-foreground">{{ $t('blog.notFoundDescription') }}</p>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        @click="router.push('/blogs')"
      >
        {{ $t('blog.back') }}
      </button>
    </section>
  </main>
</template>

<style scoped>
.blog-body {
  color: var(--foreground);
  font-size: 1rem;
  line-height: 1.78;
}

.blog-body :deep(h2) {
  margin-top: 2.75rem;
  margin-bottom: 1rem;
  font-size: 1.6rem;
  line-height: 1.25;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.blog-body :deep(h3) {
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  font-size: 1.2rem;
  line-height: 1.35;
  font-weight: 650;
}

.blog-body :deep(p) {
  margin: 1rem 0;
  color: var(--muted-foreground);
}

.blog-body :deep(strong) {
  color: var(--foreground);
  font-weight: 650;
}

.blog-body :deep(a) {
  color: var(--foreground);
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.blog-body :deep(ul),
.blog-body :deep(ol) {
  margin: 1rem 0;
  padding-left: 1.25rem;
  color: var(--muted-foreground);
}

.blog-body :deep(ul) {
  list-style: disc;
}

.blog-body :deep(ol) {
  list-style: decimal;
}

.blog-body :deep(li) {
  margin: 0.5rem 0;
  padding-left: 0.25rem;
}

.blog-body :deep(blockquote) {
  margin: 1.5rem 0;
  border-left: 3px solid var(--foreground);
  padding: 0.5rem 0 0.5rem 1rem;
  background: var(--muted);
}

.blog-body :deep(blockquote p) {
  margin: 0;
  color: var(--foreground);
}

.blog-body :deep(pre) {
  margin: 1.5rem 0;
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--muted);
  padding: 1rem;
  color: var(--foreground);
  font-size: 0.86rem;
  line-height: 1.65;
}

.blog-body :deep(code) {
  border: 1px solid var(--border);
  border-radius: 0.25rem;
  background: var(--muted);
  padding: 0.1rem 0.3rem;
  color: var(--foreground);
  font-family: var(--font-mono);
  font-size: 0.88em;
}

.blog-body :deep(pre code) {
  border: 0;
  background: transparent;
  padding: 0;
  font-size: inherit;
}

.blog-body :deep(figure) {
  margin: 1.75rem 0;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: var(--background);
}

.blog-body :deep(img) {
  display: block;
  width: 100%;
  height: auto;
}

.blog-body :deep(.blog-caption) {
  margin-top: -1rem;
  text-align: center;
  font-size: 0.86rem;
  color: var(--muted-foreground);
}

.blog-body :deep(.blog-tip) {
  margin: 1.5rem 0;
  border: 1px solid var(--border);
  border-left: 3px solid var(--foreground);
  border-radius: 0.75rem;
  background: var(--muted);
  padding: 1rem;
}

.blog-body :deep(.blog-tip strong:first-child) {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--foreground);
}

.blog-body :deep(.blog-tip p) {
  margin: 0.5rem 0 0;
}

.blog-body :deep(.blog-table-wrap) {
  margin: 1.5rem 0;
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}

.blog-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;
  font-size: 0.92rem;
}

.blog-body :deep(th),
.blog-body :deep(td) {
  border-bottom: 1px solid var(--border);
  padding: 0.75rem;
  text-align: left;
  vertical-align: top;
}

.blog-body :deep(th) {
  background: var(--muted);
  color: var(--foreground);
  font-weight: 650;
}

.blog-body :deep(tr:last-child td) {
  border-bottom: 0;
}
</style>
