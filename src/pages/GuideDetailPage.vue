<script setup lang="ts">
// Guide detail. Bodies are not written yet, so every known guide renders its
// cover + summary and a "being written" notice. Unknown slugs show NotFound.
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useSeoMeta } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'
import GuideCover from '../components/GuideCover.vue'
import NotFoundPage from './NotFoundPage.vue'
import { getGuide, getGuidesUi } from '../lib/guides'

const { locale } = useI18n()
const route = useRoute()

const ui = computed(() => getGuidesUi(locale.value))
const guide = computed(() => getGuide(String(route.params.slug), locale.value))

const docsUrl = computed(() =>
  locale.value === 'zh' || locale.value === 'ja' ? `https://docs.memoh.ai/${locale.value}/` : 'https://docs.memoh.ai/',
)

useSeoMeta({
  title: () => (guide.value ? `${guide.value.title} | ${ui.value('seoTitle')}` : ui.value('seoTitle')),
  description: () => guide.value?.summary ?? ui.value('seoDescription'),
  ogTitle: () => guide.value?.title ?? ui.value('seoTitle'),
  ogDescription: () => guide.value?.summary ?? ui.value('seoDescription'),
  ogUrl: () => `https://memoh.ai/guides/${String(route.params.slug)}`,
})
</script>

<template>
  <NotFoundPage v-if="!guide" />
  <main v-else class="w-full max-w-[760px] min-h-[calc(100vh-3.5rem)] mx-auto px-4 md:px-8 pt-[112px] md:pt-[148px] pb-[120px] relative z-10">
    <RouterLink
      :to="{ path: '/guides', query: { category: guide.category } }"
      class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft class="h-4 w-4" />
      {{ ui('back') }}
    </RouterLink>

    <header class="mt-8 flex flex-col gap-4">
      <span class="text-sm text-muted-foreground">{{ guide.categoryTitle }}</span>
      <h1 class="text-4xl md:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">{{ guide.title }}</h1>
      <p class="text-base md:text-lg text-muted-foreground leading-relaxed">{{ guide.summary }}</p>
    </header>

    <div class="mt-10">
      <img v-if="guide.cover" :src="guide.cover" alt="" class="aspect-[19/10] w-full rounded-[14px] border border-border object-cover" />
      <GuideCover v-else :title="guide.coverTitle" />
    </div>

    <section class="mt-12 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-14 text-center">
      <h2 class="text-base font-semibold text-foreground">{{ ui('draftTitle') }}</h2>
      <p class="max-w-[420px] text-sm text-muted-foreground leading-relaxed">{{ ui('draftDesc') }}</p>
      <a
        :href="docsUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="btn-pill btn-pill-primary mt-3 inline-flex h-9 items-center gap-1.5 px-4 text-sm font-medium"
      >
        {{ ui('readDocs') }}
        <ArrowRight class="h-4 w-4" />
      </a>
    </section>
  </main>
</template>
