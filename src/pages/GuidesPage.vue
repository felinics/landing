<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useSeoMeta } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { ArrowRight, BookOpen } from 'lucide-vue-next'
import MemohMascot from '../components/MemohMascot.vue'
import GuideCover from '../components/GuideCover.vue'
import { getGuideCategories, getGuides, getGuidesUi, isGuideCategoryId } from '../lib/guides'

const { locale } = useI18n()
const route = useRoute()

const ui = computed(() => getGuidesUi(locale.value))
const categories = computed(() => getGuideCategories(locale.value))
const guides = computed(() => getGuides(locale.value))

// Category filter lives in the query string (?category=engineering) so it is linkable.
const activeCategory = computed(() => {
  const raw = route.query.category
  return isGuideCategoryId(raw) ? raw : null
})

const visibleGuides = computed(() =>
  activeCategory.value ? guides.value.filter((g) => g.category === activeCategory.value) : guides.value,
)
// Featured guides get cover cards; the rest are text-only cards.
const featuredGuides = computed(() => visibleGuides.value.filter((g) => g.featured))
const listGuides = computed(() => visibleGuides.value.filter((g) => !g.featured))

const docsUrl = computed(() =>
  locale.value === 'zh' || locale.value === 'ja' ? `https://docs.memoh.ai/${locale.value}/` : 'https://docs.memoh.ai/',
)

const chipClass = (active: boolean) => [
  'inline-flex h-8 items-center rounded-full border px-3.5 text-sm whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  active
    ? 'border-foreground bg-foreground text-background'
    : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground',
]

useSeoMeta({
  title: () => ui.value('seoTitle'),
  description: () => ui.value('seoDescription'),
  ogTitle: () => ui.value('seoTitle'),
  ogDescription: () => ui.value('seoDescription'),
  ogUrl: 'https://memoh.ai/guides',
})
</script>

<template>
  <main class="guides-static w-full max-w-[1080px] min-h-[calc(100vh-3.5rem)] mx-auto px-4 md:px-8 pt-[112px] md:pt-[148px] pb-[120px] relative z-10">
    <header class="flex flex-col-reverse gap-8 md:flex-row md:items-center md:justify-between">
      <div class="flex flex-col gap-5">
      <h1 class="text-4xl md:text-6xl font-semibold tracking-tight text-foreground leading-[1.05]">
        {{ ui('title') }}
      </h1>
      <p class="max-w-[560px] text-base md:text-lg text-muted-foreground leading-relaxed">
        {{ ui('subtitle') }}
      </p>
      </div>
      <MemohMascot class="w-[120px] shrink-0 md:mr-6 md:w-[200px]" />
    </header>

    <nav :aria-label="ui('categoriesLabel')" class="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
      <RouterLink :to="{ path: '/guides' }" :class="chipClass(activeCategory === null)">
        {{ ui('allCategories') }}
      </RouterLink>
      <RouterLink
        v-for="category in categories"
        :key="category.id"
        :to="{ path: '/guides', query: { category: category.id } }"
        :class="chipClass(activeCategory === category.id)"
      >
        {{ category.title }}
      </RouterLink>
    </nav>

    <!-- Featured: cover + title + summary, no card frame -->
    <section v-if="featuredGuides.length" class="mt-14 flex flex-col gap-5">
      <h2 class="text-sm font-medium text-muted-foreground">{{ ui('featured') }}</h2>
      <div class="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        <RouterLink
          v-for="guide in featuredGuides"
          :key="guide.slug"
          :to="`/guides/${guide.slug}`"
          class="guide-card group flex flex-col gap-4 rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          <img
            v-if="guide.cover"
            :src="guide.cover"
            alt=""
            loading="lazy"
            class="aspect-[19/10] w-full rounded-[14px] border border-border object-cover"
          />
          <GuideCover v-else :title="guide.coverTitle" />
          <div class="flex flex-col gap-2 px-0.5">
            <h3 class="text-lg font-medium tracking-tight text-foreground leading-snug group-hover:underline underline-offset-4 decoration-border">
              {{ guide.title }}
            </h3>
            <p class="text-sm md:text-[15px] text-muted-foreground leading-relaxed">{{ guide.summary }}</p>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- All guides: text-only cards -->
    <section v-if="listGuides.length" class="mt-14 flex flex-col gap-5">
      <h2 class="text-sm font-medium text-muted-foreground">{{ ui('allGuides') }}</h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RouterLink
          v-for="guide in listGuides"
          :key="guide.slug"
          :to="`/guides/${guide.slug}`"
          class="flex flex-col gap-4 rounded-xl border border-border bg-background p-6 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div class="flex flex-col gap-1.5">
            <h3 class="text-base font-semibold tracking-tight text-foreground leading-snug">{{ guide.title }}</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">{{ guide.summary }}</p>
          </div>
          <span class="mt-auto text-xs text-muted-foreground">{{ guide.categoryTitle }}</span>
        </RouterLink>
      </div>
    </section>

    <!-- Empty state (tutorials are not written yet) -->
    <section
      v-if="!visibleGuides.length"
      class="mt-14 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-20 text-center"
    >
      <div class="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-foreground">
        <BookOpen class="h-5 w-5" />
      </div>
      <h2 class="mt-2 text-base font-semibold text-foreground">{{ ui('emptyTitle') }}</h2>
      <p class="max-w-[420px] text-sm text-muted-foreground leading-relaxed">
        {{ activeCategory && guides.length ? ui('emptyCategoryDesc') : ui('emptyDesc') }}
      </p>
      <div v-if="!guides.length" class="mt-4 flex flex-wrap items-center justify-center gap-3">
        <a
          :href="docsUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-pill btn-pill-primary inline-flex h-9 items-center gap-1.5 px-4 text-sm font-medium"
        >
          {{ ui('readDocs') }}
          <ArrowRight class="h-4 w-4" />
        </a>
        <RouterLink to="/help" class="btn-pill btn-pill-secondary inline-flex h-9 items-center px-4 text-sm font-medium">
          {{ ui('visitHelp') }}
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Match the help center: no global colour transitions inside the page. */
/* The mascot is exempt — it is meant to move. */
.guides-static,
.guides-static :deep(*:not(.memoh-mascot, .memoh-mascot *)) {
  transition: none !important;
  animation: none !important;
}
</style>
